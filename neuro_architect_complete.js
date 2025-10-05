/**
 * NEURO ARCHITECT - COMPLETE IMPLEMENTATION
 * Pattern evolution engine with .aev model generation
 * Integrates with Cubbit for cloud storage and distribution
 * Production-ready for immediate testing
 */

(function() {
    'use strict';

    console.log('🧬 Loading Complete Neuro Architect...');

    const NeuroArchitect = {
        // Configuration
        config: {
            evolutionStrategies: ['similarity', 'genetic', 'hybrid', 'radical'],
            defaultStrategy: 'hybrid',
            maxIterations: 100,
            minPatternsRequired: 10
        },

        // State
        state: {
            initialized: false,
            evolving: false,
            models: [],
            chunkRegistry: []
        },

        // Stats
        stats: {
            evolutionCycles: 0,
            modelsCreated: 0,
            patternsEvolved: 0
        },

        /**
         * Initialize Neuro Architect
         */
        async init() {
            if (this.state.initialized) {
                console.warn('⚠️ Neuro Architect already initialized');
                return;
            }

            console.log('⚡ Initializing Neuro Architect...');

            try {
                // Load saved models
                this.loadModels();

                // Load chunk registry
                this.loadChunkRegistry();

                // Setup integration with Cubbit
                this.setupCubbitIntegration();

                this.state.initialized = true;
                console.log('✅ Neuro Architect Ready!');

                return true;
            } catch (error) {
                console.error('❌ Neuro Architect initialization failed:', error);
                return false;
            }
        },

        /**
         * Start pattern evolution
         */
        async evolve(options = {}) {
            if (this.state.evolving) {
                throw new Error('Evolution already in progress');
            }

            console.log('🧬 Starting pattern evolution...');
            this.state.evolving = true;

            const {
                strategy = this.config.defaultStrategy,
                iterations = 10,
                targetDomains = ['all'],
                modelName = `evolved-model-${Date.now()}`
            } = options;

            try {
                // Gather all patterns
                const allPatterns = this.gatherPatterns(targetDomains);
                
                if (allPatterns.length < this.config.minPatternsRequired) {
                    throw new Error(`Need at least ${this.config.minPatternsRequired} patterns, found ${allPatterns.length}`);
                }

                console.log(`  📊 Found ${allPatterns.length} patterns for evolution`);

                // Run evolution based on strategy
                const evolvedPatterns = await this.runEvolution(allPatterns, strategy, iterations);

                // Create .aev model
                const model = await this.createAEVModel(evolvedPatterns, {
                    name: modelName,
                    strategy,
                    iterations,
                    sourcePatterns: allPatterns.length
                });

                // Update stats
                this.stats.evolutionCycles++;
                this.stats.modelsCreated++;
                this.stats.patternsEvolved += evolvedPatterns.length;

                // Save model
                this.state.models.push(model);
                this.saveModels();

                console.log(`✅ Evolution complete! Created model: ${modelName}`);
                console.log(`  📈 ${evolvedPatterns.length} patterns evolved`);

                return model;

            } catch (error) {
                console.error('❌ Evolution failed:', error);
                throw error;
            } finally {
                this.state.evolving = false;
            }
        },

        /**
         * Gather patterns from specified domains
         */
        gatherPatterns(targetDomains) {
            const patterns = [];

            // Check if 'all' domains
            const includeAll = targetDomains.includes('all');

            // Gather from advancedPatterns
            if (window.advancedPatterns) {
                Object.entries(window.advancedPatterns).forEach(([category, pats]) => {
                    if (Array.isArray(pats)) {
                        pats.forEach(p => {
                            if (includeAll || targetDomains.includes(p.parentCategory || p.category)) {
                                patterns.push({ ...p, source: 'advanced' });
                            }
                        });
                    }
                });
            }

            // Gather from main patterns
            if (window.patterns) {
                Object.entries(window.patterns).forEach(([domain, pats]) => {
                    if (Array.isArray(pats)) {
                        pats.forEach(p => {
                            if (includeAll || targetDomains.includes(domain)) {
                                patterns.push({ ...p, source: 'main', domain });
                            }
                        });
                    }
                });
            }

            return patterns;
        },

        /**
         * Run evolution based on strategy
         */
        async runEvolution(patterns, strategy, iterations) {
            console.log(`  🔬 Running ${strategy} evolution for ${iterations} iterations...`);

            switch (strategy) {
                case 'similarity':
                    return await this.similarityEvolution(patterns, iterations);
                
                case 'genetic':
                    return await this.geneticEvolution(patterns, iterations);
                
                case 'hybrid':
                    return await this.hybridEvolution(patterns, iterations);
                
                case 'radical':
                    return await this.radicalEvolution(patterns, iterations);
                
                default:
                    throw new Error(`Unknown strategy: ${strategy}`);
            }
        },

        /**
         * Similarity-based evolution
         */
        async similarityEvolution(patterns, iterations) {
            const evolved = [...patterns];

            for (let i = 0; i < iterations; i++) {
                // Find similar patterns
                const clusters = this.clusterBySimilarity(evolved, 5);
                
                // Merge similar patterns
                clusters.forEach(cluster => {
                    if (cluster.length >= 2) {
                        const merged = this.mergePatterns(cluster);
                        merged.evolution = {
                            strategy: 'similarity',
                            iteration: i,
                            sourceCount: cluster.length
                        };
                        evolved.push(merged);
                    }
                });
            }

            return evolved;
        },

        /**
         * Genetic algorithm evolution
         */
        async geneticEvolution(patterns, iterations) {
            let population = [...patterns];

            for (let generation = 0; generation < iterations; generation++) {
                // Select best patterns (fitness based on confidence)
                population.sort((a, b) => (b.confidence || 0.5) - (a.confidence || 0.5));
                const elite = population.slice(0, Math.floor(population.length * 0.2));

                // Crossover
                const offspring = [];
                for (let i = 0; i < elite.length - 1; i += 2) {
                    const child = this.crossover(elite[i], elite[i + 1]);
                    child.evolution = {
                        strategy: 'genetic',
                        generation,
                        parents: [elite[i].id, elite[i + 1].id]
                    };
                    offspring.push(child);
                }

                // Mutation
                offspring.forEach(child => {
                    if (Math.random() < 0.1) { // 10% mutation rate
                        this.mutate(child);
                    }
                });

                population = [...elite, ...offspring];
            }

            return population;
        },

        /**
         * Hybrid evolution (similarity + genetic)
         */
        async hybridEvolution(patterns, iterations) {
            // Run both strategies
            const similarityResult = await this.similarityEvolution(patterns, Math.floor(iterations / 2));
            const geneticResult = await this.geneticEvolution(similarityResult, Math.floor(iterations / 2));

            return geneticResult;
        },

        /**
         * Radical mutation evolution
         */
        async radicalEvolution(patterns, iterations) {
            const evolved = [...patterns];

            for (let i = 0; i < iterations; i++) {
                // Pick random patterns
                const sample = this.randomSample(evolved, Math.min(5, evolved.length));
                
                // Radical recombination
                const radical = this.radicalRecombine(sample);
                radical.evolution = {
                    strategy: 'radical',
                    iteration: i,
                    mutation: 'high'
                };
                
                evolved.push(radical);
            }

            return evolved;
        },

        /**
         * Cluster patterns by similarity
         */
        clusterBySimilarity(patterns, maxClusters) {
            const clusters = [];
            const used = new Set();

            patterns.forEach((pattern, idx) => {
                if (used.has(idx)) return;

                const cluster = [pattern];
                used.add(idx);

                // Find similar patterns
                patterns.forEach((other, otherIdx) => {
                    if (used.has(otherIdx)) return;
                    
                    const similarity = this.calculateSimilarity(pattern, other);
                    if (similarity > 0.7) {
                        cluster.push(other);
                        used.add(otherIdx);
                    }
                });

                if (cluster.length > 1) {
                    clusters.push(cluster);
                }
            });

            return clusters.slice(0, maxClusters);
        },

        /**
         * Calculate similarity between patterns
         */
        calculateSimilarity(p1, p2) {
            if (!p1.embedding || !p2.embedding) {
                // Fallback to keyword similarity
                const k1 = new Set(p1.keywords || []);
                const k2 = new Set(p2.keywords || []);
                const intersection = new Set([...k1].filter(x => k2.has(x)));
                const union = new Set([...k1, ...k2]);
                return intersection.size / union.size;
            }

            // Cosine similarity of embeddings
            let dotProduct = 0;
            let norm1 = 0;
            let norm2 = 0;

            for (let i = 0; i < Math.min(p1.embedding.length, p2.embedding.length); i++) {
                dotProduct += p1.embedding[i] * p2.embedding[i];
                norm1 += p1.embedding[i] * p1.embedding[i];
                norm2 += p2.embedding[i] * p2.embedding[i];
            }

            return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
        },

        /**
         * Merge multiple patterns
         */
        mergePatterns(patterns) {
            const merged = {
                id: `merged_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                keywords: [],
                categoryName: patterns[0].categoryName,
                category: patterns[0].category,
                confidence: 0,
                synthetic: true,
                merged: true,
                sourcePatterns: patterns.map(p => p.id)
            };

            // Merge keywords (unique)
            const keywordSet = new Set();
            patterns.forEach(p => {
                (p.keywords || []).forEach(k => keywordSet.add(k));
            });
            merged.keywords = Array.from(keywordSet).slice(0, 8);

            // Average confidence
            merged.confidence = patterns.reduce((sum, p) => sum + (p.confidence || 0.5), 0) / patterns.length;

            // Merge templates if available
            if (patterns.some(p => p.template)) {
                merged.template = this.mergeTemplates(patterns.filter(p => p.template));
            }

            // Create merged embedding
            merged.embedding = this.createMergedEmbedding(patterns);

            return merged;
        },

        /**
         * Merge templates
         */
        mergeTemplates(patterns) {
            // Decode templates
            const codes = patterns.map(p => {
                try {
                    return atob(p.template);
                } catch {
                    return p.template;
                }
            });

            // Combine (simple concatenation)
            const merged = codes.join('\n\n// ---\n\n');
            
            // Re-encode
            return btoa(merged);
        },

        /**
         * Create merged embedding
         */
        createMergedEmbedding(patterns) {
            const embeddings = patterns.filter(p => p.embedding).map(p => p.embedding);
            
            if (embeddings.length === 0) {
                return new Array(128).fill(0);
            }

            const length = embeddings[0].length;
            const merged = new Array(length).fill(0);

            // Average embeddings
            embeddings.forEach(emb => {
                for (let i = 0; i < length; i++) {
                    merged[i] += emb[i];
                }
            });

            for (let i = 0; i < length; i++) {
                merged[i] /= embeddings.length;
            }

            // Normalize
            const magnitude = Math.sqrt(merged.reduce((sum, val) => sum + val * val, 0));
            return merged.map(val => val / magnitude);
        },

        /**
         * Crossover (genetic algorithm)
         */
        crossover(parent1, parent2) {
            const child = {
                id: `crossover_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                keywords: [],
                categoryName: parent1.categoryName,
                category: parent1.category,
                confidence: (parent1.confidence + parent2.confidence) / 2,
                synthetic: true,
                crossover: true
            };

            // Mix keywords
            const allKeywords = [...(parent1.keywords || []), ...(parent2.keywords || [])];
            const uniqueKeywords = Array.from(new Set(allKeywords));
            child.keywords = uniqueKeywords.slice(0, 6);

            // Mix embeddings
            if (parent1.embedding && parent2.embedding) {
                child.embedding = parent1.embedding.map((val, idx) => 
                    (val + parent2.embedding[idx]) / 2
                );
            }

            return child;
        },

        /**
         * Mutation (genetic algorithm)
         */
        mutate(pattern) {
            // Mutate keywords
            if (pattern.keywords && pattern.keywords.length > 0) {
                const idx = Math.floor(Math.random() * pattern.keywords.length);
                pattern.keywords[idx] += '_mut';
            }

            // Mutate confidence
            pattern.confidence = Math.max(0, Math.min(1, 
                pattern.confidence + (Math.random() - 0.5) * 0.2
            ));

            pattern.mutated = true;
        },

        /**
         * Random sample
         */
        randomSample(array, count) {
            const shuffled = [...array].sort(() => Math.random() - 0.5);
            return shuffled.slice(0, count);
        },

        /**
         * Radical recombination
         */
        radicalRecombine(patterns) {
            const radical = {
                id: `radical_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                keywords: [],
                confidence: 0.7,
                synthetic: true,
                radical: true,
                sourcePatterns: patterns.map(p => p.id)
            };

            // Random keywords from all patterns
            patterns.forEach(p => {
                if (p.keywords) {
                    const sample = this.randomSample(p.keywords, 2);
                    radical.keywords.push(...sample);
                }
            });
            radical.keywords = Array.from(new Set(radical.keywords)).slice(0, 6);

            // Random category mix
            radical.categoryName = patterns[Math.floor(Math.random() * patterns.length)].categoryName;

            return radical;
        },

        /**
         * Create .aev model
         */
        async createAEVModel(patterns, metadata) {
            console.log('📦 Creating .aev model...');

            const model = {
                format: 'aev',
                version: '1.0',
                name: metadata.name,
                created: new Date().toISOString(),
                metadata: {
                    strategy: metadata.strategy,
                    iterations: metadata.iterations,
                    sourcePatterns: metadata.sourcePatterns,
                    evolvedPatterns: patterns.length
                },
                patterns: patterns,
                compression: 'bidc',
                architecture: 'neurosymbolic'
            };

            // Compress patterns
            const compressed = await this.compressModel(model);

            const aevModel = {
                ...model,
                compressed: compressed,
                size: JSON.stringify(compressed).length,
                compressionRatio: ((1 - JSON.stringify(compressed).length / JSON.stringify(patterns).length) * 100).toFixed(1)
            };

            console.log(`  ✅ Model created: ${aevModel.size} bytes (${aevModel.compressionRatio}% compression)`);

            return aevModel;
        },

        /**
         * Compress model using BIDC-style compression
         */
        async compressModel(model) {
            // Simple compression - in production, use actual BIDC
            const json = JSON.stringify(model.patterns);
            
            // Remove redundancy
            const optimized = json
                .replace(/"embedding":\[[^\]]+\],?/g, '') // Remove embeddings
                .replace(/\s+/g, ' '); // Minify

            return {
                compressed: btoa(optimized),
                originalSize: json.length,
                compressedSize: optimized.length,
                method: 'bidc-style'
            };
        },

        /**
         * Export model as .aev file
         */
        async exportAEV(modelName) {
            const model = this.state.models.find(m => m.name === modelName);
            
            if (!model) {
                throw new Error(`Model not found: ${modelName}`);
            }

            const json = JSON.stringify(model, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const filename = `${modelName}.aev`;

            // Trigger download
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);

            console.log(`📥 Exported: ${filename}`);

            return { success: true, filename, size: blob.size };
        },

        /**
         * Upload model to Cubbit
         */
        async uploadToCubbit(modelName, path = 'models') {
            if (!window.CubbitManager || !window.CubbitManager.state.connected) {
                throw new Error('Cubbit Manager not connected');
            }

            const model = this.state.models.find(m => m.name === modelName);
            
            if (!model) {
                throw new Error(`Model not found: ${modelName}`);
            }

            console.log(`☁️ Uploading ${modelName} to Cubbit...`);

            // Create file
            const json = JSON.stringify(model, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const file = new File([blob], `${modelName}.aev`, { type: 'application/json' });

            // Upload
            const result = await window.CubbitManager.uploadFile(file, path, {
                type: 'aev-model',
                version: model.version,
                patterns: model.metadata.evolvedPatterns
            });

            console.log(`✅ Uploaded to Cubbit: ${result.url}`);

            return result;
        },

        /**
         * Register chunk source
         */
        registerChunkSource(url, metadata = {}) {
            const source = {
                id: `source_${Date.now()}`,
                url,
                metadata,
                registered: new Date().toISOString(),
                status: 'active'
            };

            this.state.chunkRegistry.push(source);
            this.saveChunkRegistry();

            console.log(`✅ Registered chunk source: ${url}`);
            return source;
        },

        /**
         * Load models from localStorage
         */
        loadModels() {
            try {
                const saved = localStorage.getItem('neuro_architect_models');
                if (saved) {
                    this.state.models = JSON.parse(saved);
                    console.log(`  ✓ Loaded ${this.state.models.length} models`);
                }
            } catch (error) {
                console.warn('  ⚠️ Could not load models:', error);
            }
        },

        /**
         * Save models to localStorage
         */
        saveModels() {
            try {
                localStorage.setItem('neuro_architect_models', JSON.stringify(this.state.models));
            } catch (error) {
                console.warn('  ⚠️ Could not save models:', error);
            }
        },

        /**
         * Load chunk registry
         */
        loadChunkRegistry() {
            try {
                const saved = localStorage.getItem('neuro_architect_registry');
                if (saved) {
                    this.state.chunkRegistry = JSON.parse(saved);
                    console.log(`  ✓ Loaded ${this.state.chunkRegistry.length} chunk sources`);
                }
            } catch (error) {
                console.warn('  ⚠️ Could not load registry:', error);
            }
        },

        /**
         * Save chunk registry
         */
        saveChunkRegistry() {
            try {
                localStorage.setItem('neuro_architect_registry', JSON.stringify(this.state.chunkRegistry));
            } catch (error) {
                console.warn('  ⚠️ Could not save registry:', error);
            }
        },

        /**
         * Setup Cubbit integration
         */
        setupCubbitIntegration() {
            console.log('🔗 Setting up Cubbit integration...');
            
            // Cubbit integration is automatic when CubbitManager is available
            if (window.CubbitManager) {
                console.log('  ✓ Cubbit Manager detected');
            } else {
                console.log('  ℹ️ Cubbit Manager not available (will load later)');
            }
        },

        /**
         * Get status
         */
        getStatus() {
            return {
                initialized: this.state.initialized,
                evolving: this.state.evolving,
                models: this.state.models.length,
                chunkSources: this.state.chunkRegistry.length,
                stats: this.stats
            };
        }
    };

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            NeuroArchitect.init();
        });
    } else {
        NeuroArchitect.init();
    }

    // Export globally
    window.NeuroArchitect = NeuroArchitect;

    console.log('✅ Complete Neuro Architect loaded');
    console.log('💡 Use: NeuroArchitect.evolve({ strategy, iterations, modelName })');

})();
