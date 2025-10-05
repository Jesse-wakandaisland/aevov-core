/**
 * CLOUDFLARE WORKERS BACKEND
 * Distributed AEVOV Pattern Sync Protocol & Model Distribution
 * 
 * Endpoints:
 * - /licenses/validate - License validation
 * - /licenses/activate - License activation
 * - /models/available - Get available models
 * - /models/download - Download model
 * - /models/check-updates - Check for updates
 * - /sync/patterns - Pattern sync
 * - /reviews/verify - Review verification
 * - /ws - WebSocket for real-time sync
 * 
 * Features:
 * - Edge computing for low latency
 * - Durable Objects for state management
 * - R2 storage for models
 * - KV for license caching
 * - Queue for async tasks
 */

// Worker entry point
export default {
    async fetch(request, env, ctx) {
        return handleRequest(request, env, ctx);
    },
    
    async scheduled(event, env, ctx) {
        return handleScheduled(event, env, ctx);
    }
};

/**
 * Handle HTTP requests
 */
async function handleRequest(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // CORS headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
    
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }
    
    try {
        let response;
        
        // Route requests
        if (path.startsWith('/licenses/')) {
            response = await handleLicenseRequest(request, env, path);
        } else if (path.startsWith('/models/')) {
            response = await handleModelsRequest(request, env, path);
        } else if (path.startsWith('/sync/')) {
            response = await handleSyncRequest(request, env, path);
        } else if (path.startsWith('/reviews/')) {
            response = await handleReviewsRequest(request, env, path);
        } else if (path === '/ws') {
            return handleWebSocket(request, env);
        } else {
            response = new Response('Not Found', { status: 404 });
        }
        
        // Add CORS headers
        Object.entries(corsHeaders).forEach(([key, value]) => {
            response.headers.set(key, value);
        });
        
        return response;
        
    } catch (error) {
        console.error('Worker error:', error);
        return new Response(JSON.stringify({
            error: error.message
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
}

/**
 * Handle license requests
 */
async function handleLicenseRequest(request, env, path) {
    if (path === '/licenses/validate') {
        return await validateLicense(request, env);
    } else if (path === '/licenses/activate') {
        return await activateLicense(request, env);
    }
    
    return new Response('Not Found', { status: 404 });
}

/**
 * Validate license
 */
async function validateLicense(request, env) {
    const { key } = await request.json();
    
    // Check KV cache first
    const cached = await env.LICENSES.get(key);
    if (cached) {
        const license = JSON.parse(cached);
        return jsonResponse({
            valid: true,
            tier: license.tier,
            userId: license.userId
        });
    }
    
    // Validate with database (D1)
    const result = await env.DB.prepare(
        'SELECT * FROM licenses WHERE key = ? AND status = ?'
    ).bind(key, 'active').first();
    
    if (result) {
        // Cache in KV
        await env.LICENSES.put(key, JSON.stringify({
            tier: result.tier,
            userId: result.user_id,
            validUntil: result.valid_until
        }), {
            expirationTtl: 86400 // 24 hours
        });
        
        return jsonResponse({
            valid: true,
            tier: result.tier,
            userId: result.user_id
        });
    }
    
    return jsonResponse({
        valid: false
    });
}

/**
 * Activate license
 */
async function activateLicense(request, env) {
    const { key } = await request.json();
    
    // Check if key exists and is not already activated
    const result = await env.DB.prepare(
        'SELECT * FROM licenses WHERE key = ? AND status = ?'
    ).bind(key, 'inactive').first();
    
    if (!result) {
        return jsonResponse({
            valid: false,
            error: 'Invalid or already activated license key'
        }, 400);
    }
    
    // Activate license
    await env.DB.prepare(
        'UPDATE licenses SET status = ?, activated_at = ? WHERE key = ?'
    ).bind('active', new Date().toISOString(), key).run();
    
    // Cache in KV
    await env.LICENSES.put(key, JSON.stringify({
        tier: result.tier,
        userId: result.user_id,
        validUntil: result.valid_until
    }), {
        expirationTtl: 86400
    });
    
    return jsonResponse({
        valid: true,
        tier: result.tier,
        userId: result.user_id
    });
}

/**
 * Handle models requests
 */
async function handleModelsRequest(request, env, path) {
    if (path === '/models/available') {
        return await getAvailableModels(request, env);
    } else if (path === '/models/download') {
        return await downloadModel(request, env);
    } else if (path === '/models/check-updates') {
        return await checkModelUpdates(request, env);
    }
    
    return new Response('Not Found', { status: 404 });
}

/**
 * Get available models
 */
async function getAvailableModels(request, env) {
    const url = new URL(request.url);
    const tier = url.searchParams.get('tier') || 'free';
    
    // Get models from D1
    const results = await env.DB.prepare(
        'SELECT id, name, version, tier, description, size FROM models WHERE tier <= ? ORDER BY tier, name'
    ).bind(getTierLevel(tier)).all();
    
    return jsonResponse({
        models: results.results
    });
}

/**
 * Download model
 */
async function downloadModel(request, env) {
    const { modelId, licenseKey } = await request.json();
    
    // Validate license
    const licenseValid = await validateLicenseKey(licenseKey, env);
    if (!licenseValid) {
        return jsonResponse({
            error: 'Invalid license'
        }, 403);
    }
    
    // Get model from R2
    const modelObject = await env.MODELS.get(`${modelId}.aev`);
    
    if (!modelObject) {
        return jsonResponse({
            error: 'Model not found'
        }, 404);
    }
    
    // Track download
    await trackUsage(licenseKey, 'model_download', modelId, env);
    
    const modelData = await modelObject.text();
    
    return jsonResponse({
        success: true,
        modelId,
        version: modelObject.customMetadata?.version || '1.0',
        data: JSON.parse(modelData)
    });
}

/**
 * Check model updates
 */
async function checkModelUpdates(request, env) {
    const { tier, currentVersions } = await request.json();
    
    // Get latest versions from D1
    const results = await env.DB.prepare(
        'SELECT id, version FROM models WHERE tier <= ?'
    ).bind(getTierLevel(tier)).all();
    
    const updates = [];
    
    for (const model of results.results) {
        const current = currentVersions.find(v => v.id === model.id);
        
        if (!current || compareVersions(model.version, current.version) > 0) {
            updates.push({
                model: model.id,
                currentVersion: current?.version || 'none',
                newVersion: model.version
            });
        }
    }
    
    return jsonResponse({
        updates
    });
}

/**
 * Handle sync requests
 */
async function handleSyncRequest(request, env, path) {
    if (path === '/sync/patterns') {
        return await syncPatterns(request, env);
    }
    
    return new Response('Not Found', { status: 404 });
}

/**
 * Sync patterns
 */
async function syncPatterns(request, env) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
        return jsonResponse({ error: 'Unauthorized' }, 401);
    }
    
    const licenseKey = authHeader.replace('Bearer ', '');
    const licenseValid = await validateLicenseKey(licenseKey, env);
    
    if (!licenseValid) {
        return jsonResponse({ error: 'Invalid license' }, 403);
    }
    
    const { patterns } = await request.json();
    
    // Store patterns in R2
    const timestamp = Date.now();
    const patternsKey = `patterns/${licenseKey}/${timestamp}.json`;
    
    await env.PATTERNS.put(patternsKey, JSON.stringify(patterns), {
        customMetadata: {
            licenseKey,
            count: patterns.length.toString(),
            timestamp: timestamp.toString()
        }
    });
    
    // Update sync registry in D1
    await env.DB.prepare(
        'INSERT INTO pattern_syncs (license_key, timestamp, pattern_count) VALUES (?, ?, ?)'
    ).bind(licenseKey, new Date(timestamp).toISOString(), patterns.length).run();
    
    // Broadcast to connected clients via Durable Objects
    const id = env.SYNC_DO.idFromName(licenseKey);
    const stub = env.SYNC_DO.get(id);
    await stub.fetch('https://internal/broadcast', {
        method: 'POST',
        body: JSON.stringify({ type: 'pattern-sync', patterns })
    });
    
    return jsonResponse({
        success: true,
        synced: patterns.length,
        timestamp
    });
}

/**
 * Handle reviews requests
 */
async function handleReviewsRequest(request, env, path) {
    if (path === '/reviews/verify') {
        return await verifyReview(request, env);
    }
    
    return new Response('Not Found', { status: 404 });
}

/**
 * Verify review
 */
async function verifyReview(request, env) {
    const { platform, username } = await request.json();
    
    // Check if review exists in database
    const result = await env.DB.prepare(
        'SELECT * FROM reviews WHERE platform = ? AND username = ? AND verified = 1'
    ).bind(platform, username).first();
    
    if (result) {
        // Generate reviewer license
        const reviewerLicense = `REVIEWER-${platform.toUpperCase()}-${Date.now()}`;
        
        // Create reviewer license entry
        await env.DB.prepare(
            'INSERT INTO licenses (key, tier, user_id, status, valid_until) VALUES (?, ?, ?, ?, ?)'
        ).bind(
            reviewerLicense,
            'free-reviewer',
            username,
            'active',
            null // No expiration for reviewers
        ).run();
        
        return jsonResponse({
            verified: true,
            licenseKey: reviewerLicense
        });
    }
    
    return jsonResponse({
        verified: false
    });
}

/**
 * Handle WebSocket
 */
async function handleWebSocket(request, env) {
    const upgradeHeader = request.headers.get('Upgrade');
    if (!upgradeHeader || upgradeHeader !== 'websocket') {
        return new Response('Expected Upgrade: websocket', { status: 426 });
    }
    
    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);
    
    // Handle WebSocket in Durable Object
    const id = env.SYNC_DO.newUniqueId();
    const stub = env.SYNC_DO.get(id);
    
    await stub.fetch('https://internal/websocket', {
        headers: { Upgrade: 'websocket' },
        websocket: server
    });
    
    return new Response(null, {
        status: 101,
        webSocket: client,
    });
}

/**
 * Durable Object for WebSocket connections
 */
export class SyncDurableObject {
    constructor(state, env) {
        this.state = state;
        this.env = env;
        this.sessions = new Set();
    }
    
    async fetch(request) {
        const url = new URL(request.url);
        
        if (url.pathname === '/websocket') {
            const websocket = request.headers.get('Upgrade') === 'websocket'
                ? request.websocket
                : null;
            
            if (websocket) {
                this.handleWebSocket(websocket);
                return new Response(null, { status: 101, webSocket: websocket });
            }
        } else if (url.pathname === '/broadcast') {
            const data = await request.json();
            this.broadcast(data);
            return new Response('OK');
        }
        
        return new Response('Not Found', { status: 404 });
    }
    
    handleWebSocket(websocket) {
        websocket.accept();
        this.sessions.add(websocket);
        
        websocket.addEventListener('message', (event) => {
            const data = JSON.parse(event.data);
            
            if (data.type === 'ping') {
                websocket.send(JSON.stringify({ type: 'pong' }));
            }
        });
        
        websocket.addEventListener('close', () => {
            this.sessions.delete(websocket);
        });
    }
    
    broadcast(data) {
        const message = JSON.stringify(data);
        
        this.sessions.forEach(session => {
            try {
                session.send(message);
            } catch (error) {
                this.sessions.delete(session);
            }
        });
    }
}

/**
 * Handle scheduled events (cron jobs)
 */
async function handleScheduled(event, env, ctx) {
    // Clean up expired licenses
    await env.DB.prepare(
        'UPDATE licenses SET status = ? WHERE valid_until < ? AND status = ?'
    ).bind('expired', new Date().toISOString(), 'active').run();
    
    // Clean up old pattern syncs (older than 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    await env.DB.prepare(
        'DELETE FROM pattern_syncs WHERE timestamp < ?'
    ).bind(thirtyDaysAgo).run();
    
    console.log('Scheduled cleanup completed');
}

/**
 * Helper: Validate license key
 */
async function validateLicenseKey(key, env) {
    const result = await env.DB.prepare(
        'SELECT * FROM licenses WHERE key = ? AND status = ?'
    ).bind(key, 'active').first();
    
    return !!result;
}

/**
 * Helper: Get tier level
 */
function getTierLevel(tier) {
    const levels = {
        'free': 0,
        'free-reviewer': 1,
        'pro': 2,
        'enterprise': 3
    };
    return levels[tier] || 0;
}

/**
 * Helper: Compare versions
 */
function compareVersions(v1, v2) {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
        const part1 = parts1[i] || 0;
        const part2 = parts2[i] || 0;
        
        if (part1 > part2) return 1;
        if (part1 < part2) return -1;
    }
    
    return 0;
}

/**
 * Helper: Track usage
 */
async function trackUsage(licenseKey, action, metadata, env) {
    await env.DB.prepare(
        'INSERT INTO usage_logs (license_key, action, metadata, timestamp) VALUES (?, ?, ?, ?)'
    ).bind(licenseKey, action, JSON.stringify(metadata), new Date().toISOString()).run();
}

/**
 * Helper: JSON response
 */
function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

/**
 * Database Schema (D1)
 * 
 * CREATE TABLE licenses (
 *   key TEXT PRIMARY KEY,
 *   tier TEXT NOT NULL,
 *   user_id TEXT,
 *   status TEXT NOT NULL DEFAULT 'inactive',
 *   activated_at TEXT,
 *   valid_until TEXT,
 *   created_at TEXT DEFAULT CURRENT_TIMESTAMP
 * );
 * 
 * CREATE TABLE models (
 *   id TEXT PRIMARY KEY,
 *   name TEXT NOT NULL,
 *   version TEXT NOT NULL,
 *   tier TEXT NOT NULL,
 *   description TEXT,
 *   size INTEGER,
 *   created_at TEXT DEFAULT CURRENT_TIMESTAMP
 * );
 * 
 * CREATE TABLE pattern_syncs (
 *   id INTEGER PRIMARY KEY AUTOINCREMENT,
 *   license_key TEXT NOT NULL,
 *   timestamp TEXT NOT NULL,
 *   pattern_count INTEGER NOT NULL
 * );
 * 
 * CREATE TABLE reviews (
 *   id INTEGER PRIMARY KEY AUTOINCREMENT,
 *   platform TEXT NOT NULL,
 *   username TEXT NOT NULL,
 *   verified INTEGER DEFAULT 0,
 *   created_at TEXT DEFAULT CURRENT_TIMESTAMP
 * );
 * 
 * CREATE TABLE usage_logs (
 *   id INTEGER PRIMARY KEY AUTOINCREMENT,
 *   license_key TEXT NOT NULL,
 *   action TEXT NOT NULL,
 *   metadata TEXT,
 *   timestamp TEXT NOT NULL
 * );
 * 
 * CREATE INDEX idx_licenses_status ON licenses(status);
 * CREATE INDEX idx_pattern_syncs_license ON pattern_syncs(license_key);
 * CREATE INDEX idx_usage_logs_license ON usage_logs(license_key);
 */