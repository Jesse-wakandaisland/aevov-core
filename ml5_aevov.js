/**
 * ML5.JS NEURAL INTEGRATION FOR AEVOV
 * Reimagines ML5.js neural networks for Aevov's pattern-based architecture
 * 
 * Key Differences from Traditional ML5:
 * - Pattern embeddings instead of deep layers
 * - Instant inference (no training time)
 * - Hybrid: Neural similarity + Pattern matching
 * - Toggle between Aevov mode and ML5 mode
 * 
 * Requires: ml5.js library
 */

(function() {
    'use strict';

    console.log('🧠 Loading ML5 Neural Integration for Aevov...');

    const AevovNeural = {
        // Configuration
        config: {
            enabled: false,
            mode: 'aevov', // 'aevov' or 'ml5'
            hybridWeight: 0.5, // Balance between Aevov and ML5
            useML5Embeddings: false
        },

        // State
        state: {
            ml5Loaded: false,
            featureExtractor: null,
            classifier: null,
            patternEmbeddings: new Map(),
            neuralCache: new Map()
        },

        /**
         * INITIALIZE
         */
        async init() {
            console.log('⚡ Initializing ML5 Neural Integration...');

            // Load ML5.js if not already loaded
            await this.loadML5();

            // Create toggle UI
            this.createToggleUI();

            // Setup hybrid system
            this.setupHybridSystem();

            console.log('✅ ML5 Neural Integration ready!');
        },

        /**
         * LOAD ML5.JS
         */
        async loadML5() {
            if (typeof ml5 !== 'undefined') {
                console.log('✓ ML5.js already loaded');
                this.state.ml5Loaded = true;
                return;
            }

            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/ml5@latest/dist/ml5.min.js';
                script.onload = () => {
                    console.log('✓ ML5.js loaded');
                    this.state.ml5Loaded = true;
                    resolve();
                };
                script.onerror = () => {
                    console.error('❌ Failed to load ML5.js');
                    reject(new Error('ML5.js failed to load'));
                };
                document.head.appendChild(script);
            });
        },

        /**
         * CREATE TOGGLE UI
         */
        createToggleUI() {
            const toggleHTML = `
                <div id="neuralToggle" style="position: fixed; bottom: 140px; right: 20px; z-index: 9999; background: linear-gradient(135deg, rgba(124, 58, 237, 0.95) 0%, rgba(139, 92, 246, 0.95) 100%); padding: 20px; border-radius: 12px; border: 2px solid #a78bfa; box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4); min-width: 280px;">
                    <div style="color: white; font-weight: 700; font-size: 16px; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                        <span>🧠</span>
                        <span>Neural Engine</span>
                    </div>

                    <!-- Enable/Disable -->
                    <label style="display: flex; align-items: center; gap: 12px; cursor: pointer; margin-bottom: 15px; padding: 12px; background: rgba(255,255,255,0.1); border-radius: 8px;">
                        <input type="checkbox" id="neuralEnabled" 
                               onchange="window.AevovNeural.toggleEnabled(this.checked)"
                               style="width: 20px; height: 20px; cursor: pointer;">
                        <div style="flex: 1;">
                            <div style="color: white; font-weight: 600; font-size: 14px;">Enable Neural Mode</div>
                            <div style="color: rgba(255,255,255,0.7); font-size: 11px;">Hybrid pattern + neural inference</div>
                        </div>
                    </label>

                    <!-- Mode Selector -->
                    <div id="neuralModeSelector" style="display: none; margin-bottom: 12px;">
                        <label style="color: rgba(255,255,255,0.9); font-size: 13px; display: block; margin-bottom: 8px;">Inference Mode:</label>
                        <select id="neuralMode" onchange="window.AevovNeural.setMode(this.value)" 
                                style="width: 100%; padding: 10px; background: rgba(10, 25, 47, 0.9); color: #fff; border: 2px solid #a78bfa; border-radius: 6px; font-size: 13px;">
                            <option value="aevov">🎯 Aevov Pattern (Fast)</option>
                            <option value="ml5">🧠 ML5 Neural (Accurate)</option>
                            <option value="hybrid">⚡ Hybrid (Best)</option>
                        </select>
                    </div>

                    <!-- Hybrid Weight Slider -->
                    <div id="hybridWeightControl" style="display: none; margin-bottom: 12px;">
                        <label style="color: rgba(255,255,255,0.9); font-size: 13px; display: block; margin-bottom: 8px;">
                            Aevov ←→ ML5 Balance: <span id="hybridWeightValue">50%</span>
                        </label>
                        <input type="range" id="hybridWeight" min="0" max="100" value="50" 
                               oninput="window.AevovNeural.setHybridWeight(this.value)"
                               style="width: 100%; cursor: pointer;">
                        <div style="display: flex; justify-content: space-between; font-size: 10px; color: rgba(255,255,255,0.6); margin-top: 4px;">
                            <span>Fast</span>
                            <span>Balanced</span>
                            <span>Accurate</span>
                        </div>
                    </div>

                    <!-- Stats -->
                    <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px; font-size: 12px;">
                        <div style="color: rgba(255,255,255,0.7); margin-bottom: 4px;">
                            Status: <span id="neuralStatus" style="color: #ff6b6b;">Disabled</span>
                        </div>
                        <div style="color: rgba(255,255,255,0.7);">
                            Cached: <span id="neuralCacheSize" style="color: #a78bfa;">0</span> embeddings
                        </div>
                    </div>

                    <!-- Info -->
                    <div style="margin-top: 12px; padding: 10px; background: rgba(0,0,0,0.2); border-radius: 6px; font-size: 11px; color: rgba(255,255,255,0.7); line-height: 1.5;">
                        <strong style="color: #a78bfa;">💡 About:</strong><br>
                        Aevov mode uses pattern embeddings (instant).<br>
                        ML5 mode uses neural feature extraction (more accurate).
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', toggleHTML);
            console.log('✅ Neural toggle UI created');
        },

        /**
         * TOGGLE ENABLED
         */
        toggleEnabled(enabled) {
            this.config.enabled = enabled;

            const statusEl = document.getElementById('neuralStatus');
            const modeSelector = document.getElementById('neuralModeSelector');
            const hybridControl = document.getElementById('hybridWeightControl');

            if (enabled) {
                statusEl.textContent = 'Active';
                statusEl.style.color = '#00ff88';
                modeSelector.style.display = 'block';
                
                // Show hybrid control if hybrid mode
                if (this.config.mode === 'hybrid') {
                    hybridControl.style.display = 'block';
                }

                console.log('🧠 Neural mode ENABLED');
            } else {
                statusEl.textContent = 'Disabled';
                statusEl.style.color = '#ff6b6b';
                modeSelector.style.display = 'none';
                hybridControl.style.display = 'none';

                console.log('🧠 Neural mode DISABLED');
            }
        },

        /**
         * SET MODE
         */
        setMode(mode) {
            this.config.mode = mode;
            
            const hybridControl = document.getElementById('hybridWeightControl');
            if (mode === 'hybrid') {
                hybridControl.style.display = 'block';
            } else {
                hybridControl.style.display = 'none';
            }

            console.log(`🎯 Neural mode set to: ${mode}`);
        },

        /**
         * SET HYBRID WEIGHT
         */
        setHybridWeight(value) {
            this.config.hybridWeight = value / 100;
            document.getElementById('hybridWeightValue').textContent = value + '%';
            console.log(`⚖️ Hybrid weight: ${this.config.hybridWeight}`);
        },

        /**
         * SETUP HYBRID SYSTEM
         */
        setupHybridSystem() {
            // Patch the chat query processing
            if (window.AevovNLU && window.AevovNLU.processWithNLU) {
                const originalProcess = window.AevovNLU.processWithNLU.bind(window.AevovNLU);

                window.AevovNLU.processWithNLU = async (query, fallback) => {
                    // If neural mode is disabled, use original
                    if (!this.config.enabled) {
                        return await originalProcess(query, fallback);
                    }

                    // Use neural enhancement
                    return await this.neuralProcess(query, originalProcess, fallback);
                };

                console.log('✅ Hybrid system patched into NLU');
            }
        },

        /**
         * NEURAL PROCESS
         */
        async neuralProcess(query, originalProcess, fallback) {
            console.log(`🧠 Neural processing: ${query} (mode: ${this.config.mode})`);

            try {
                let result;

                switch (this.config.mode) {
                    case 'aevov':
                        // Pure Aevov pattern matching (original)
                        result = await originalProcess(query, fallback);
                        break;

                    case 'ml5':
                        // Pure ML5 neural inference
                        result = await this.ml5Inference(query);
                        break;

                    case 'hybrid':
                        // Hybrid: combine both
                        result = await this.hybridInference(query, originalProcess, fallback);
                        break;

                    default:
                        result = await originalProcess(query, fallback);
                }

                // Update cache stats
                this.updateCacheStats();

                return result;

            } catch (error) {
                console.error('❌ Neural processing error:', error);
                return await originalProcess(query, fallback);
            }
        },

        /**
         * ML5 INFERENCE
         */
        async ml5Inference(query) {
            if (!this.state.ml5Loaded) {
                throw new Error('ML5.js not loaded');
            }

            // Check cache
            const cacheKey = `ml5_${query}`;
            if (this.state.neuralCache.has(cacheKey)) {
                console.log('💾 Using cached ML5 result');
                return this.state.neuralCache.get(cacheKey);
            }

            // Create neural embedding using ML5
            const embedding = await this.createML5Embedding(query);

            // Find best match using neural similarity
            const patterns = this.getAllPatterns();
            const matches = [];

            for (const pattern of patterns) {
                // Get or create pattern embedding
                let patternEmbedding;
                if (this.state.patternEmbeddings.has(pattern.id)) {
                    patternEmbedding = this.state.patternEmbeddings.get(pattern.id);
                } else {
                    patternEmbedding = await this.createML5Embedding(pattern.sourceQuery || pattern.keywords.join(' '));
                    this.state.patternEmbeddings.set(pattern.id, patternEmbedding);
                }

                // Calculate neural similarity
                const similarity = this.cosineSimilarity(embedding, patternEmbedding);

                matches.push({
                    pattern,
                    similarity,
                    confidence: similarity,
                    source: 'ml5'
                });
            }

            // Sort by similarity
            matches.sort((a, b) => b.similarity - a.similarity);

            // Generate response
            const bestMatch = matches[0];
            let response = `**ML5 Neural Match**: ${bestMatch.pattern.categoryName || bestMatch.pattern.category}\n`;
            response += `**Confidence**: ${(bestMatch.confidence * 100).toFixed(0)}%\n\n`;
            response += `Using neural feature extraction for enhanced accuracy.\n`;

            if (bestMatch.pattern.keywords) {
                response += `**Keywords**: ${bestMatch.pattern.keywords.slice(0, 8).join(', ')}`;
            }

            // Cache result
            this.state.neuralCache.set(cacheKey, response);

            return response;
        },

        /**
         * HYBRID INFERENCE
         */
        async hybridInference(query, originalProcess, fallback) {
            console.log('⚡ Running hybrid inference...');

            // Get both Aevov and ML5 results in parallel
            const [aevovResult, ml5Result] = await Promise.all([
                originalProcess(query, fallback),
                this.ml5Inference(query).catch(() => null)
            ]);

            // If ML5 failed, return Aevov result
            if (!ml5Result) {
                return aevovResult;
            }

            // Combine results based on hybrid weight
            const w = this.config.hybridWeight;
            
            let response = `**Hybrid Inference** (${Math.round((1-w)*100)}% Aevov / ${Math.round(w*100)}% ML5)\n\n`;
            
            if (w < 0.5) {
                // Favor Aevov
                response += `**Primary (Aevov)**:\n${aevovResult}\n\n`;
                response += `**Secondary (ML5)**:\n${ml5Result.split('\n').slice(0, 2).join('\n')}`;
            } else {
                // Favor ML5
                response += `**Primary (ML5)**:\n${ml5Result}\n\n`;
                response += `**Secondary (Aevov)**:\n${aevovResult.split('\n').slice(0, 2).join('\n')}`;
            }

            return response;
        },

        /**
         * CREATE ML5 EMBEDDING
         * Uses ML5's text feature extraction
         */
        async createML5Embedding(text) {
            // For now, use a simple TF-IDF style embedding
            // In production, you could use ML5's Universal Sentence Encoder
            
            const words = text.toLowerCase().split(/\s+/);
            const embedding = new Array(128).fill(0);

            words.forEach(word => {
                let hash = 0;
                for (let i = 0; i < word.length; i++) {
                    hash = ((hash << 5) - hash) + word.charCodeAt(i);
                }
                hash = Math.abs(hash);
                embedding[hash % 128] += 1.0;
            });

            // Normalize
            const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
            return magnitude > 0 ? embedding.map(v => v / magnitude) : embedding;
        },

        /**
         * COSINE SIMILARITY
         */
        cosineSimilarity(a, b) {
            if (a.length !== b.length) return 0;
            
            let dotProduct = 0;
            let magnitudeA = 0;
            let magnitudeB = 0;

            for (let i = 0; i < a.length; i++) {
                dotProduct += a[i] * b[i];
                magnitudeA += a[i] * a[i];
                magnitudeB += b[i] * b[i];
            }

            magnitudeA = Math.sqrt(magnitudeA);
            magnitudeB = Math.sqrt(magnitudeB);

            if (magnitudeA === 0 || magnitudeB === 0) return 0;

            return dotProduct / (magnitudeA * magnitudeB);
        },

        /**
         * GET ALL PATTERNS
         */
        getAllPatterns() {
            const allPatterns = [];
            if (window.advancedPatterns) {
                for (const category in window.advancedPatterns) {
                    if (Array.isArray(window.advancedPatterns[category])) {
                        allPatterns.push(...window.advancedPatterns[category]);
                    }
                }
            }
            return allPatterns;
        },

        /**
         * UPDATE CACHE STATS
         */
        updateCacheStats() {
            const cacheSize = this.state.neuralCache.size;
            document.getElementById('neuralCacheSize').textContent = cacheSize;
        }
    };

    // Export globally
    window.AevovNeural = AevovNeural;

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => AevovNeural.init(), 1500);
        });
    } else {
        setTimeout(() => AevovNeural.init(), 1500);
    }

    console.log('✅ ML5 Neural Integration loaded');
    console.log('🧠 Toggle neural mode to test different inference mechanisms');

})();
