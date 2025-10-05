/**
 * AEVOV ADVANCED CACHE SYSTEM
 * LiteSpeed-level caching with Cubbit CDN integration
 * Multi-layer: Memory → IndexedDB → Cubbit CDN
 * Features: Compression, versioning, invalidation, preloading, pattern sync
 */

(function() {
    'use strict';

    console.log('⚡ Loading Aevov Advanced Cache System...');

    const AevovCache = {
        // Configuration
        config: {
            memoryLimit: 100 * 1024 * 1024,     // 100MB in memory
            indexedDBLimit: 500 * 1024 * 1024,  // 500MB in IndexedDB
            ttl: 3600000,                        // 1 hour default TTL
            compressionEnabled: true,
            preloadEnabled: true,
            syncInterval: 30000,                 // 30 seconds
            cubbitCachePath: 'cache/patterns',
            enableCubbitCDN: true
        },

        // State
        state: {
            initialized: false,
            memoryCache: new Map(),
            memorySizeBytes: 0,
            db: null,
            stats: {
                hits: { memory: 0, indexedDB: 0, cubbit: 0 },
                misses: 0,
                sets: 0,
                evictions: 0,
                compressions: 0,
                decompressions: 0
            }
        },

        /**
         * Initialize cache system
         */
        async init() {
            if (this.state.initialized) {
                console.warn('⚠️ Cache already initialized');
                return;
            }

            console.log('🚀 Initializing Aevov Advanced Cache...');

            try {
                // Initialize IndexedDB
                await this.initIndexedDB();

                // Setup Cubbit CDN integration
                await this.setupCubbitCDN();

                // Setup pattern sync integration
                this.setupPatternSync();

                // Start background tasks
                this.startBackgroundTasks();

                this.state.initialized = true;
                console.log('✅ Aevov Advanced Cache Ready!');

                return true;
            } catch (error) {
                console.error('❌ Cache initialization failed:', error);
                return false;
            }
        },

        /**
         * Initialize IndexedDB
         */
        async initIndexedDB() {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open('AevovCacheDB', 1);

                request.onerror = () => reject(request.error);
                request.onsuccess = () => {
                    this.state.db = request.result;
                    console.log('  ✓ IndexedDB initialized');
                    resolve();
                };

                request.onupgradeneeded = (event) => {
                    const db = event.target.result;

                    // Create object stores
                    if (!db.objectStoreNames.contains('patterns')) {
                        const store = db.createObjectStore('patterns', { keyPath: 'key' });
                        store.createIndex('timestamp', 'timestamp', { unique: false });
                        store.createIndex('version', 'version', { unique: false });
                        store.createIndex('source', 'source', { unique: false });
                    }

                    if (!db.objectStoreNames.contains('metadata')) {
                        db.createObjectStore('metadata', { keyPath: 'key' });
                    }
                };
            });
        },

        /**
         * Setup Cubbit CDN integration
         */
        async setupCubbitCDN() {
            console.log('☁️ Setting up Cubbit CDN integration...');

            if (!window.CubbitManager) {
                console.warn('  ⚠️ CubbitManager not available');
                return;
            }

            // Check if connected
            if (!window.CubbitManager.state.connected) {
                console.log('  ℹ️ Cubbit not connected (will connect on first use)');
                return;
            }

            // Create cache directory structure
            try {
                await this.ensureCubbitCacheStructure();
                console.log('  ✓ Cubbit CDN ready');
            } catch (error) {
                console.warn('  ⚠️ Could not create cache structure:', error);
            }
        },

        /**
         * Ensure Cubbit cache directory exists
         */
        async ensureCubbitCacheStructure() {
            if (!window.CubbitManager || !window.CubbitManager.state.connected) {
                return;
            }

            // List to check if directory exists
            try {
                await window.CubbitManager.listFiles(this.config.cubbitCachePath);
            } catch (error) {
                // Directory might not exist, that's ok
                console.log('  ℹ️ Cache directory will be created on first upload');
            }
        },

        /**
         * Setup pattern sync integration
         */
        setupPatternSync() {
            console.log('🔗 Setting up pattern sync integration...');

            // Hook into pattern updates
            if (window.patterns || window.advancedPatterns) {
                // Intercept pattern additions
                this.hookPatternAdditions();
                console.log('  ✓ Pattern sync hooks installed');
            }
        },

        /**
         * Hook into pattern additions for auto-caching
         */
        hookPatternAdditions() {
            // Wrap array push for patterns
            const wrapPush = (obj, category) => {
                if (!obj[category] || !Array.isArray(obj[category])) return;

                const original = obj[category].push;
                obj[category].push = function(...patterns) {
                    const result = original.apply(this, patterns);
                    
                    // Auto-cache new patterns
                    patterns.forEach(pattern => {
                        if (pattern && pattern.id) {
                            AevovCache.set(`pattern:${pattern.id}`, pattern, {
                                source: 'pattern_sync',
                                category
                            }).catch(console.error);
                        }
                    });

                    return result;
                };
            };

            // Hook into both pattern databases
            if (window.patterns) {
                Object.keys(window.patterns).forEach(cat => wrapPush(window.patterns, cat));
            }
            if (window.advancedPatterns) {
                Object.keys(window.advancedPatterns).forEach(cat => wrapPush(window.advancedPatterns, cat));
            }
        },

        /**
         * Start background tasks
         */
        startBackgroundTasks() {
            console.log('⏰ Starting background tasks...');

            // Periodic sync to Cubbit
            setInterval(() => this.syncToCubbit(), this.config.syncInterval);

            // Periodic cleanup
            setInterval(() => this.cleanup(), 60000); // Every minute

            // Periodic stats logging
            setInterval(() => this.logStats(), 300000); // Every 5 minutes

            console.log('  ✓ Background tasks started');
        },

        /**
         * GET from cache (multi-layer)
         */
        async get(key) {
            // Layer 1: Memory cache
            if (this.state.memoryCache.has(key)) {
                const entry = this.state.memoryCache.get(key);
                
                // Check TTL
                if (this.isExpired(entry)) {
                    this.state.memoryCache.delete(key);
                } else {
                    this.state.stats.hits.memory++;
                    return this.decompress(entry.data, entry.compressed);
                }
            }

            // Layer 2: IndexedDB
            const dbEntry = await this.getFromIndexedDB(key);
            if (dbEntry) {
                // Check TTL
                if (this.isExpired(dbEntry)) {
                    await this.deleteFromIndexedDB(key);
                } else {
                    this.state.stats.hits.indexedDB++;
                    
                    // Promote to memory cache
                    this.promoteToMemory(key, dbEntry);
                    
                    return this.decompress(dbEntry.data, dbEntry.compressed);
                }
            }

            // Layer 3: Cubbit CDN
            if (this.config.enableCubbitCDN) {
                const cubbitEntry = await this.getFromCubbit(key);
                if (cubbitEntry) {
                    this.state.stats.hits.cubbit++;
                    
                    // Populate lower layers
                    await this.populateLowerLayers(key, cubbitEntry);
                    
                    return cubbitEntry;
                }
            }

            // Cache miss
            this.state.stats.misses++;
            return null;
        },

        /**
         * SET to cache (multi-layer)
         */
        async set(key, data, options = {}) {
            const {
                ttl = this.config.ttl,
                source = 'unknown',
                version = '1.0',
                syncToCubbit = true
            } = options;

            const entry = {
                key,
                data: data,
                compressed: false,
                timestamp: Date.now(),
                ttl,
                source,
                version,
                size: this.estimateSize(data)
            };

            // Compress if enabled and data is large enough
            if (this.config.compressionEnabled && entry.size > 1024) {
                entry.data = await this.compress(data);
                entry.compressed = true;
                entry.compressedSize = this.estimateSize(entry.data);
                this.state.stats.compressions++;
            }

            // Set in memory cache
            await this.setInMemory(key, entry);

            // Set in IndexedDB
            await this.setInIndexedDB(key, entry);

            // Async sync to Cubbit if enabled
            if (syncToCubbit && this.config.enableCubbitCDN) {
                this.syncEntryToCubbit(key, entry).catch(error => {
                    console.warn('Background Cubbit sync failed:', error);
                });
            }

            this.state.stats.sets++;
            return true;
        },

        /**
         * DELETE from cache (all layers)
         */
        async delete(key) {
            // Delete from memory
            this.state.memoryCache.delete(key);

            // Delete from IndexedDB
            await this.deleteFromIndexedDB(key);

            // Delete from Cubbit
            if (this.config.enableCubbitCDN) {
                await this.deleteFromCubbit(key);
            }

            return true;
        },

        /**
         * CLEAR entire cache
         */
        async clear() {
            console.log('🗑️ Clearing entire cache...');

            // Clear memory
            this.state.memoryCache.clear();
            this.state.memorySizeBytes = 0;

            // Clear IndexedDB
            await this.clearIndexedDB();

            // Optionally clear Cubbit (commented out for safety)
            // await this.clearCubbit();

            console.log('✅ Cache cleared');
        },

        /**
         * Set in memory cache with LRU eviction
         */
        async setInMemory(key, entry) {
            // Check if we need to evict
            while (this.state.memorySizeBytes + entry.size > this.config.memoryLimit) {
                await this.evictFromMemory();
            }

            this.state.memoryCache.set(key, entry);
            this.state.memorySizeBytes += entry.size;
        },

        /**
         * Evict LRU entry from memory
         */
        async evictFromMemory() {
            // Find oldest entry
            let oldestKey = null;
            let oldestTimestamp = Infinity;

            for (const [key, entry] of this.state.memoryCache.entries()) {
                if (entry.timestamp < oldestTimestamp) {
                    oldestTimestamp = entry.timestamp;
                    oldestKey = key;
                }
            }

            if (oldestKey) {
                const entry = this.state.memoryCache.get(oldestKey);
                this.state.memoryCache.delete(oldestKey);
                this.state.memorySizeBytes -= entry.size;
                this.state.stats.evictions++;
            }
        },

        /**
         * Get from IndexedDB
         */
        async getFromIndexedDB(key) {
            if (!this.state.db) return null;

            return new Promise((resolve) => {
                const transaction = this.state.db.transaction(['patterns'], 'readonly');
                const store = transaction.objectStore('patterns');
                const request = store.get(key);

                request.onsuccess = () => resolve(request.result);
                request.onerror = () => resolve(null);
            });
        },

        /**
         * Set in IndexedDB
         */
        async setInIndexedDB(key, entry) {
            if (!this.state.db) return;

            return new Promise((resolve, reject) => {
                const transaction = this.state.db.transaction(['patterns'], 'readwrite');
                const store = transaction.objectStore('patterns');
                const request = store.put(entry);

                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        },

        /**
         * Delete from IndexedDB
         */
        async deleteFromIndexedDB(key) {
            if (!this.state.db) return;

            return new Promise((resolve) => {
                const transaction = this.state.db.transaction(['patterns'], 'readwrite');
                const store = transaction.objectStore('patterns');
                const request = store.delete(key);

                request.onsuccess = () => resolve();
                request.onerror = () => resolve();
            });
        },

        /**
         * Clear IndexedDB
         */
        async clearIndexedDB() {
            if (!this.state.db) return;

            return new Promise((resolve) => {
                const transaction = this.state.db.transaction(['patterns'], 'readwrite');
                const store = transaction.objectStore('patterns');
                const request = store.clear();

                request.onsuccess = () => resolve();
                request.onerror = () => resolve();
            });
        },

        /**
         * Get from Cubbit CDN
         */
        async getFromCubbit(key) {
            if (!window.CubbitManager || !window.CubbitManager.state.connected) {
                return null;
            }

            try {
                const cubbitKey = `${this.config.cubbitCachePath}/${key}.json`;
                const result = await window.CubbitManager.downloadFile(cubbitKey);
                
                if (result.success) {
                    const text = await result.blob.text();
                    return JSON.parse(text);
                }
            } catch (error) {
                // Not found in Cubbit, that's ok
                return null;
            }

            return null;
        },

        /**
         * Sync entry to Cubbit
         */
        async syncEntryToCubbit(key, entry) {
            if (!window.CubbitManager || !window.CubbitManager.state.connected) {
                return;
            }

            try {
                const json = JSON.stringify(entry);
                const blob = new Blob([json], { type: 'application/json' });
                const file = new File([blob], `${key}.json`, { type: 'application/json' });

                await window.CubbitManager.uploadFile(file, this.config.cubbitCachePath, {
                    'cache-entry': 'true',
                    'cache-key': key,
                    'cache-version': entry.version
                });
            } catch (error) {
                console.warn(`Failed to sync ${key} to Cubbit:`, error);
            }
        },

        /**
         * Delete from Cubbit
         */
        async deleteFromCubbit(key) {
            if (!window.CubbitManager || !window.CubbitManager.state.connected) {
                return;
            }

            try {
                const cubbitKey = `${this.config.cubbitCachePath}/${key}.json`;
                await window.CubbitManager.deleteFile(cubbitKey);
            } catch (error) {
                // Ignore errors
            }
        },

        /**
         * Sync all changed entries to Cubbit
         */
        async syncToCubbit() {
            if (!window.CubbitManager || !window.CubbitManager.state.connected) {
                return;
            }

            // Sync recent entries from IndexedDB to Cubbit
            const recentEntries = await this.getRecentEntries(10);
            
            for (const entry of recentEntries) {
                await this.syncEntryToCubbit(entry.key, entry);
            }
        },

        /**
         * Get recent entries from IndexedDB
         */
        async getRecentEntries(limit = 10) {
            if (!this.state.db) return [];

            return new Promise((resolve) => {
                const transaction = this.state.db.transaction(['patterns'], 'readonly');
                const store = transaction.objectStore('patterns');
                const index = store.index('timestamp');
                const request = index.openCursor(null, 'prev');
                
                const results = [];
                let count = 0;

                request.onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor && count < limit) {
                        results.push(cursor.value);
                        count++;
                        cursor.continue();
                    } else {
                        resolve(results);
                    }
                };

                request.onerror = () => resolve([]);
            });
        },

        /**
         * Promote entry to memory cache
         */
        promoteToMemory(key, entry) {
            if (entry.size < this.config.memoryLimit / 10) {
                this.setInMemory(key, entry).catch(console.error);
            }
        },

        /**
         * Populate lower cache layers
         */
        async populateLowerLayers(key, data) {
            const entry = {
                key,
                data,
                compressed: false,
                timestamp: Date.now(),
                ttl: this.config.ttl,
                source: 'cubbit',
                version: '1.0',
                size: this.estimateSize(data)
            };

            await this.setInMemory(key, entry);
            await this.setInIndexedDB(key, entry);
        },

        /**
         * Compress data
         */
        async compress(data) {
            const json = JSON.stringify(data);
            // Simple compression - in production use actual compression library
            return btoa(json);
        },

        /**
         * Decompress data
         */
        async decompress(data, compressed) {
            if (!compressed) return data;
            
            this.state.stats.decompressions++;
            // Simple decompression
            try {
                const json = atob(data);
                return JSON.parse(json);
            } catch {
                return data;
            }
        },

        /**
         * Check if entry is expired
         */
        isExpired(entry) {
            if (!entry.ttl) return false;
            return (Date.now() - entry.timestamp) > entry.ttl;
        },

        /**
         * Estimate size of data in bytes
         */
        estimateSize(data) {
            return new Blob([JSON.stringify(data)]).size;
        },

        /**
         * Cleanup expired entries
         */
        async cleanup() {
            // Cleanup memory cache
            for (const [key, entry] of this.state.memoryCache.entries()) {
                if (this.isExpired(entry)) {
                    this.state.memoryCache.delete(key);
                    this.state.memorySizeBytes -= entry.size;
                }
            }

            // Cleanup IndexedDB (sample check)
            // Full cleanup would be expensive, so we check periodically
        },

        /**
         * Preload patterns
         */
        async preloadPatterns() {
            console.log('🔄 Preloading patterns...');

            // Preload from window.patterns
            if (window.patterns) {
                for (const [category, patterns] of Object.entries(window.patterns)) {
                    if (Array.isArray(patterns)) {
                        for (const pattern of patterns) {
                            if (pattern && pattern.id) {
                                await this.set(`pattern:${pattern.id}`, pattern, {
                                    source: 'preload',
                                    syncToCubbit: false
                                });
                            }
                        }
                    }
                }
            }

            // Preload from window.advancedPatterns
            if (window.advancedPatterns) {
                for (const [category, patterns] of Object.entries(window.advancedPatterns)) {
                    if (Array.isArray(patterns)) {
                        for (const pattern of patterns) {
                            if (pattern && pattern.id) {
                                await this.set(`pattern:${pattern.id}`, pattern, {
                                    source: 'preload',
                                    syncToCubbit: false
                                });
                            }
                        }
                    }
                }
            }

            console.log('✅ Patterns preloaded');
        },

        /**
         * Log statistics
         */
        logStats() {
            const stats = this.getStats();
            console.log('📊 Cache Stats:', stats);
        },

        /**
         * Get statistics
         */
        getStats() {
            const totalHits = this.state.stats.hits.memory + 
                            this.state.stats.hits.indexedDB + 
                            this.state.stats.hits.cubbit;
            
            const hitRate = totalHits > 0 ? 
                (totalHits / (totalHits + this.state.stats.misses) * 100).toFixed(2) : 0;

            return {
                memoryCache: {
                    entries: this.state.memoryCache.size,
                    sizeBytes: this.state.memorySizeBytes,
                    sizeMB: (this.state.memorySizeBytes / 1024 / 1024).toFixed(2),
                    hits: this.state.stats.hits.memory
                },
                indexedDB: {
                    hits: this.state.stats.hits.indexedDB
                },
                cubbit: {
                    hits: this.state.stats.hits.cubbit,
                    enabled: this.config.enableCubbitCDN,
                    connected: window.CubbitManager?.state.connected || false
                },
                overall: {
                    totalHits,
                    misses: this.state.stats.misses,
                    hitRate: hitRate + '%',
                    sets: this.state.stats.sets,
                    evictions: this.state.stats.evictions,
                    compressions: this.state.stats.compressions,
                    decompressions: this.state.stats.decompressions
                }
            };
        },

        /**
         * Get status
         */
        getStatus() {
            return {
                initialized: this.state.initialized,
                config: this.config,
                stats: this.getStats()
            };
        }
    };

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            AevovCache.init();
        });
    } else {
        AevovCache.init();
    }

    // Export globally
    window.AevovCache = AevovCache;

    console.log('✅ Aevov Advanced Cache System loaded');
    console.log('💡 Use: AevovCache.set(key, data) / AevovCache.get(key)');

})();
