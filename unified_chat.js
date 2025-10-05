/**
 * UNIFIED CHAT SYSTEM
 * Consolidates: inference_engine_fix.js, bidc_chat_integration.js, 
 *               conversational_ai_engine.js, realtime_notification_system.js
 * 
 * This SINGLE file replaces all 4 competing chat patches
 * Load this INSTEAD of the 4 individual files
 */

(function() {
    'use strict';

    console.log('🚀 Loading UNIFIED Chat System...');

    const UnifiedChatSystem = {
        // State
        state: {
            initialized: false,
            processing: false,
            conversationHistory: [],
            compressionCache: new Map(),
            lastQuery: null
        },

        // Config
        config: {
            enableNotifications: true,
            enableBIDC: true,
            enableInference: true,
            maxCacheSize: 100,
            debugMode: true
        },

        // BIDC compression (fallback implementation)
        bidc: null,

        /**
         * MAIN INITIALIZATION
         */
        async init() {
            if (this.state.initialized) {
                console.warn('⚠️ Unified Chat System already initialized');
                return;
            }

            console.log('⚡ Initializing Unified Chat System...');

            try {
                // Step 1: Initialize BIDC compression
                await this.initBIDC();

                // Step 2: Initialize notification system
                this.initNotifications();

                // Step 3: Wait for ChatWidget to be available
                await this.waitForChatWidget();

                // Step 4: Patch ChatWidget with unified pipeline
                this.patchChatWidget();

                // Step 5: Initialize conversational context
                this.initConversationalEngine();

                this.state.initialized = true;
                console.log('✅ Unified Chat System Ready!');

                // Show success notification
                this.notify('success', 'System Ready', 'Conversational AI is online and ready to help!');

            } catch (error) {
                console.error('❌ Unified Chat System initialization failed:', error);
                this.notify('error', 'Initialization Failed', error.message);
                throw error;
            }
        },

        /**
         * Wait for ChatWidget to exist
         */
        async waitForChatWidget() {
            console.log('⏳ Waiting for ChatWidget...');
            
            const maxWait = 10000; // 10 seconds
            const checkInterval = 100;
            let elapsed = 0;

            while (!window.ChatWidget || !window.ChatWidget.processQuery) {
                if (elapsed >= maxWait) {
                    throw new Error('ChatWidget not found after 10 seconds');
                }
                await new Promise(resolve => setTimeout(resolve, checkInterval));
                elapsed += checkInterval;
            }

            console.log('✓ ChatWidget found');
        },

        /**
         * Initialize BIDC compression
         */
        async initBIDC() {
            console.log('📦 Initializing BIDC compression...');

            // Simple fallback compression (since BIDC library may not be available)
            this.bidc = {
                compress: async (data) => {
                    const str = JSON.stringify(data);
                    return new TextEncoder().encode(str);
                },
                decompress: async (data) => {
                    const str = new TextDecoder().decode(data);
                    return JSON.parse(str);
                }
            };

            console.log('✓ BIDC ready (using fallback)');
        },

        /**
         * Initialize notification system
         */
        initNotifications() {
            console.log('🔔 Initializing notifications...');

            // Create notification container if it doesn't exist
            if (!document.getElementById('unified-notifications')) {
                const container = document.createElement('div');
                container.id = 'unified-notifications';
                container.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 999999;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    pointer-events: none;
                `;
                document.body.appendChild(container);
            }

            console.log('✓ Notifications ready');
        },

        /**
         * Show notification
         */
        notify(type, title, message, duration = 4000) {
            if (!this.config.enableNotifications) return;

            const container = document.getElementById('unified-notifications');
            if (!container) return;

            const notification = document.createElement('div');
            notification.style.cssText = `
                background: ${type === 'success' ? 'linear-gradient(135deg, #00d4ff 0%, #0099ff 100%)' :
                             type === 'error' ? 'linear-gradient(135deg, #ff4444 0%, #cc0000 100%)' :
                             type === 'warning' ? 'linear-gradient(135deg, #ffaa00 0%, #ff6600 100%)' :
                             'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)'}; 
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                min-width: 300px;
                max-width: 400px;
                pointer-events: auto;
                animation: slideIn 0.3s ease-out;
            `;

            const icon = type === 'success' ? '✅' : 
                        type === 'error' ? '❌' : 
                        type === 'warning' ? '⚠️' : '💬';

            notification.innerHTML = `
                <div style="display: flex; align-items: start; gap: 10px;">
                    <span style="font-size: 24px;">${icon}</span>
                    <div style="flex: 1;">
                        <strong style="display: block; margin-bottom: 5px;">${title}</strong>
                        <div style="font-size: 13px; opacity: 0.9;">${message}</div>
                    </div>
                </div>
            `;

            container.appendChild(notification);

            // Auto-remove after duration
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => notification.remove(), 300);
            }, duration);
        },

        /**
         * Initialize conversational engine
         */
        initConversationalEngine() {
            console.log('💬 Initializing conversational engine...');
            
            this.personality = {
                name: "Aevov",
                tone: "helpful",
                style: "conversational",
                traits: ["clear", "concise", "accurate"]
            };

            console.log('✓ Conversational engine ready');
        },

        /**
         * UNIFIED CHAT WIDGET PATCH
         * This is the ONE place where we patch ChatWidget
         */
        patchChatWidget() {
            console.log('🔧 Patching ChatWidget with unified pipeline...');

            const originalProcessQuery = window.ChatWidget.processQuery;

            // Replace with unified pipeline
            window.ChatWidget.processQuery = async (query) => {
                // Prevent concurrent processing
                if (this.state.processing) {
                    return "Please wait, I'm still processing your previous request...";
                }

                this.state.processing = true;
                this.state.lastQuery = query;

                try {
                    // Show processing notification
                    if (this.config.enableNotifications) {
                        this.notify('processing', 'Processing', `Analyzing: "${query.substring(0, 50)}..."`, 2000);
                    }

                    // Add to conversation history
                    this.state.conversationHistory.push({
                        role: 'user',
                        content: query,
                        timestamp: Date.now()
                    });

                    // UNIFIED PROCESSING PIPELINE
                    const response = await this.processPipeline(query);

                    // Add response to history
                    this.state.conversationHistory.push({
                        role: 'assistant',
                        content: response,
                        timestamp: Date.now()
                    });

                    return response;

                } catch (error) {
                    console.error('❌ Error in unified chat pipeline:', error);
                    this.notify('error', 'Processing Error', error.message);
                    return `I encountered an error: ${error.message}. Please try again.`;

                } finally {
                    this.state.processing = false;
                }
            };

            console.log('✅ ChatWidget patched with unified pipeline');
        },

        /**
         * UNIFIED PROCESSING PIPELINE
         * Combines: Inference → BIDC Compression → Pattern Matching → Response Generation
         */
        async processPipeline(query) {
            const startTime = performance.now();

            // STAGE 1: Query preprocessing
            const preprocessed = await this.preprocessQuery(query);

            // STAGE 2: BIDC compression (if enabled)
            const compressed = this.config.enableBIDC ? 
                await this.compressQuery(preprocessed) : preprocessed;

            // STAGE 3: Pattern matching with inference
            const match = await this.findBestMatch(compressed, query);

            // STAGE 4: Response generation
            const response = await this.generateResponse(match, query);

            const processingTime = (performance.now() - startTime).toFixed(2);

            if (this.config.debugMode) {
                console.log(`⏱️ Pipeline completed in ${processingTime}ms`);
            }

            return response;
        },

        /**
         * STAGE 1: Preprocess query
         */
        async preprocessQuery(query) {
            // Clean and normalize query
            const cleaned = query.trim().toLowerCase();
            
            // Tokenize
            const tokens = cleaned
                .replace(/[^\w\s]/g, ' ')
                .split(/\s+/)
                .filter(t => t.length > 2);

            // Create embedding
            const embedding = this.createEmbedding(tokens);

            return {
                original: query,
                cleaned: cleaned,
                tokens: tokens,
                embedding: embedding
            };
        },

        /**
         * STAGE 2: Compress query
         */
        async compressQuery(preprocessed) {
            // Check cache
            const cacheKey = preprocessed.original;
            if (this.state.compressionCache.has(cacheKey)) {
                return this.state.compressionCache.get(cacheKey);
            }

            // Compress
            let compressed;
            try {
                compressed = await this.bidc.compress(preprocessed);
            } catch (error) {
                console.warn('BIDC compression failed, using original:', error);
                compressed = preprocessed;
            }

            // Cache result
            if (this.state.compressionCache.size >= this.config.maxCacheSize) {
                const firstKey = this.state.compressionCache.keys().next().value;
                this.state.compressionCache.delete(firstKey);
            }
            this.state.compressionCache.set(cacheKey, compressed);

            return compressed;
        },

        /**
         * STAGE 3: Find best pattern match
         */
        async findBestMatch(compressed, originalQuery) {
            // Get all available patterns
            const patterns = this.getAllPatterns();

            if (patterns.length === 0) {
                return {
                    found: false,
                    reason: 'no_patterns',
                    message: 'No patterns available. Please load a model or extract patterns first.'
                };
            }

            // Extract query features
            const queryEmbedding = typeof compressed === 'object' && compressed.embedding ?
                compressed.embedding : this.createEmbedding(originalQuery.toLowerCase().split(/\s+/));

            // Score all patterns
            const scored = patterns.map(pattern => {
                // Ensure pattern has embedding
                if (!pattern.embedding && pattern.keywords) {
                    pattern.embedding = this.createEmbedding(pattern.keywords);
                }

                const similarity = this.cosineSimilarity(queryEmbedding, pattern.embedding);
                const confidence = similarity * (pattern.confidence || 0.9);

                return {
                    pattern: pattern,
                    similarity: similarity,
                    confidence: confidence,
                    score: confidence
                };
            }).sort((a, b) => b.score - a.score);

            // Get best match
            const best = scored[0];

            // Apply Goldilocks Rule
            const goldilocks = this.applyGoldilocksRule(best, originalQuery);

            if (goldilocks.score < 0.3) {
                return {
                    found: false,
                    reason: 'low_confidence',
                    message: `I couldn't find a good match for "${originalQuery}". The closest match scored ${(goldilocks.score * 100).toFixed(1)}%, which is below the confidence threshold.`,
                    bestAttempt: best
                };
            }

            return {
                found: true,
                match: best,
                goldilocks: goldilocks,
                alternatives: scored.slice(1, 4)
            };
        },

        /**
         * Apply Goldilocks Rule
         */
        applyGoldilocksRule(match, query) {
            const pattern = match.pattern;

            // Calculate specificity
            const queryLength = query.split(/\s+/).length;
            const patternComplexity = pattern.keywords ? pattern.keywords.length : 1;
            const specificity = Math.min(queryLength / patternComplexity, 1.0);

            // Calculate balance
            const idealSpecificity = 0.6;
            const specificityDelta = Math.abs(specificity - idealSpecificity);
            const balanceScore = 1.0 - specificityDelta;

            // Final Goldilocks score
            const goldilocksScore = (match.confidence * 0.7) + (balanceScore * 0.3);

            return {
                score: goldilocksScore,
                specificity: specificity,
                balance: balanceScore,
                assessment: specificity < 0.4 ? 'too_broad' :
                           specificity > 0.8 ? 'too_specific' :
                           'just_right'
            };
        },

        /**
         * STAGE 4: Generate conversational response
         */
        async generateResponse(matchResult, query) {
            if (!matchResult.found) {
                return matchResult.message;
            }

            const { match, goldilocks, alternatives } = matchResult;
            const pattern = match.pattern;
            const confidence = goldilocks.score;

            let response = '';

            // Conversational opening based on confidence
            if (confidence > 0.8) {
                response += "I found exactly what you need! ";
            } else if (confidence > 0.6) {
                response += "I found something that should help. ";
            } else {
                response += "Here's what I found, though it's not a perfect match. ";
            }

            // Main content
            if (pattern.template) {
                response += "Here's the solution:\n\n";
                try {
                    // Try to decode if base64
                    const decoded = atob(pattern.template);
                    response += `\`\`\`\n${decoded}\n\`\`\`\n\n`;
                } catch (e) {
                    // Not base64, use as-is
                    response += `\`\`\`\n${pattern.template}\n\`\`\`\n\n`;
                }
            } else {
                response += `This relates to **${pattern.categoryName || pattern.category || pattern.domain || 'general concepts'}**. `;
            }

            // Add context
            if (pattern.keywords && pattern.keywords.length > 0) {
                response += `Key concepts: ${pattern.keywords.slice(0, 5).join(', ')}.\n\n`;
            }

            // Goldilocks assessment
            response += `**Match Quality:** ${(confidence * 100).toFixed(1)}% confidence`;
            response += ` (${goldilocks.assessment.replace('_', ' ')})\n\n`;

            // Suggest alternatives if confidence is low
            if (confidence < 0.7 && alternatives.length > 0) {
                response += "**You might also consider:**\n";
                alternatives.slice(0, 2).forEach((alt, idx) => {
                    const altPattern = alt.pattern;
                    response += `${idx + 1}. ${altPattern.categoryName || altPattern.id || 'Alternative pattern'}\n`;
                });
                response += "\n";
            }

            // Friendly closing
            const closings = [
                "Let me know if you need more details!",
                "Does this help with what you're working on?",
                "Feel free to ask for clarification!",
                "Is this what you were looking for?"
            ];
            response += closings[Math.floor(Math.random() * closings.length)];

            return response;
        },

        /**
         * Create embedding vector
         */
        createEmbedding(tokens) {
            const embedding = new Array(128).fill(0);
            
            if (typeof tokens === 'string') {
                tokens = tokens.toLowerCase().split(/\s+/);
            }

            tokens.forEach(token => {
                let hash = 0;
                for (let i = 0; i < token.length; i++) {
                    hash = ((hash << 5) - hash) + token.charCodeAt(i);
                }
                const idx = Math.abs(hash) % 128;
                embedding[idx] += 1.0;
            });

            // Normalize
            const magnitude = Math.sqrt(
                embedding.reduce((sum, val) => sum + val * val, 0)
            );

            return magnitude > 0 ? embedding.map(val => val / magnitude) : embedding;
        },

        /**
         * Calculate cosine similarity
         */
        cosineSimilarity(e1, e2) {
            if (!e1 || !e2 || e1.length !== e2.length) return 0;
            return e1.reduce((sum, val, i) => sum + val * e2[i], 0);
        },

        /**
         * Get all patterns from all sources
         */
        getAllPatterns() {
            const allPatterns = [];

            // From main patterns database
            if (window.patterns) {
                Object.entries(window.patterns).forEach(([domain, pats]) => {
                    if (Array.isArray(pats)) {
                        pats.forEach(p => {
                            allPatterns.push({ ...p, domain: domain });
                        });
                    }
                });
            }

            // From advanced patterns
            if (window.advancedPatterns) {
                Object.entries(window.advancedPatterns).forEach(([category, pats]) => {
                    if (Array.isArray(pats)) {
                        pats.forEach(p => {
                            allPatterns.push({ ...p, category: category });
                        });
                    }
                });
            }

            return allPatterns;
        },

        /**
         * Get system status
         */
        getStatus() {
            return {
                initialized: this.state.initialized,
                processing: this.state.processing,
                conversationLength: this.state.conversationHistory.length,
                patternsAvailable: this.getAllPatterns().length,
                cacheSize: this.state.compressionCache.size,
                config: this.config
            };
        },

        /**
         * Clear conversation history
         */
        clearHistory() {
            this.state.conversationHistory = [];
            console.log('✓ Conversation history cleared');
        }
    };

    // CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            UnifiedChatSystem.init().catch(console.error);
        });
    } else {
        // DOM already loaded, init now
        UnifiedChatSystem.init().catch(console.error);
    }

    // Export to window
    window.UnifiedChatSystem = UnifiedChatSystem;

    console.log('✅ Unified Chat System loaded');

})();
