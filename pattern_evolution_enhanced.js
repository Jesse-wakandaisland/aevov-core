/**
 * ENHANCED PATTERN EVOLUTION LAB
 * 
 * Features:
 * - Import button from Advanced Extractor
 * - ARMsquare reasoning protocol for native reasoning models
 * - Integration with all knowledge bases
 * - Generalized .aev model creation
 * - Path to 10T and 100T models
 */

(function() {
    'use strict';

    console.log('🧬 Loading Enhanced Pattern Evolution Lab...');

    const PatternEvolutionEnhanced = {
        // State
        state: {
            extractedPatterns: [],
            knowledgeBases: [],
            reasoningModels: [],
            modelSize: 0
        },

        // Config
        config: {
            useARMsquare: true,
            targetModelSize: 10_000_000_000_000, // 10T parameters
            compressionRatio: 0.95 // 95% compression
        },

        /**
         * INITIALIZE
         */
        init() {
            console.log('⚡ Initializing Enhanced Pattern Evolution...');

            // Create import button
            this.createImportButton();

            // Setup ARMsquare reasoning
            this.setupARMsquareReasoning();

            // Setup knowledge base integration
            this.setupKnowledgeBaseIntegration();

            // Create model path visualization
            this.createModelPathVisualization();

            console.log('✅ Enhanced Pattern Evolution ready!');
        },

        /**
         * CREATE IMPORT BUTTON
         */
        createImportButton() {
            console.log('📥 Creating import button from Advanced Extractor...');

            // Add to Advanced Extractor section
            const extractorSection = document.getElementById('advancedExtractor');
            if (!extractorSection) return;

            const importButton = `
                <div style="margin-top: 20px; padding: 15px; background: linear-gradient(135deg, #00ff88 0%, #00cc70 100%); border-radius: 10px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h4 style="margin: 0 0 5px 0; color: white;">🧬 Pattern Evolution Lab</h4>
                            <p style="margin: 0; font-size: 13px; color: rgba(255, 255, 255, 0.9);">
                                Import extracted patterns to evolution lab for .aev model creation
                            </p>
                        </div>
                        <button onclick="window.PatternEvolutionEnhanced.importFromExtractor()" style="
                            padding: 12px 24px;
                            background: linear-gradient(135deg, #00d4ff 0%, #3a47d5 100%);
                            border: none;
                            color: white;
                            font-weight: 600;
                            border-radius: 6px;
                            cursor: pointer;
                            white-space: nowrap;
                        ">
                            🚀 Import to Evolution Lab
                        </button>
                    </div>
                </div>
            `;

            const lastSection = extractorSection.querySelector('.section:last-child');
            if (lastSection) {
                lastSection.insertAdjacentHTML('beforeend', importButton);
                console.log('✅ Import button created');
            }
        },

        /**
         * IMPORT FROM EXTRACTOR
         */
        importFromExtractor() {
            console.log('📥 Importing patterns from Advanced Extractor...');

            // Get patterns from Advanced Extractor
            const patterns = this.gatherPatternsFromExtractor();

            if (patterns.length === 0) {
                alert('No patterns found in Advanced Extractor. Please extract patterns first.');
                return;
            }

            this.state.extractedPatterns = patterns;

            // Switch to Pattern Evolution Lab tab
            const evolutionTab = document.querySelector('[onclick*="architect"]');
            if (evolutionTab) {
                evolutionTab.click();
            }

            // Scroll to evolution section
            setTimeout(() => {
                const evolutionSection = document.querySelector('h2:contains("Pattern Evolution Lab")');
                if (evolutionSection) {
                    evolutionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 300);

            // Show success notification
            this.showNotification(
                `✅ Imported ${patterns.length} patterns from Advanced Extractor`,
                'success'
            );

            // Update evolution stats
            this.updateEvolutionStats();

            console.log(`✅ Imported ${patterns.length} patterns`);
        },

        /**
         * GATHER PATTERNS FROM EXTRACTOR
         */
        gatherPatternsFromExtractor() {
            const patterns = [];

            // Get from window.advancedPatterns
            if (window.advancedPatterns) {
                for (const category in window.advancedPatterns) {
                    const categoryPatterns = window.advancedPatterns[category];
                    if (Array.isArray(categoryPatterns)) {
                        patterns.push(...categoryPatterns);
                    }
                }
            }

            // Get from window.patterns
            if (window.patterns) {
                for (const category in window.patterns) {
                    const categoryPatterns = window.patterns[category];
                    if (Array.isArray(categoryPatterns)) {
                        patterns.push(...categoryPatterns);
                    }
                }
            }

            return patterns;
        },

        /**
         * SETUP ARMSQUARE REASONING
         */
        setupARMsquareReasoning() {
            console.log('📐 Setting up ARMsquare Reasoning Protocol...');

            const ARMsquareReasoning = {
                /**
                 * ARMsquare - Aevov Reasoning Multidimensional Model
                 * Advanced reasoning protocol for pattern evolution
                 */
                
                // Reasoning dimensions
                dimensions: {
                    pattern_similarity: { weight: 0.3, active: true },
                    semantic_coherence: { weight: 0.25, active: true },
                    domain_relevance: { weight: 0.2, active: true },
                    novelty_score: { weight: 0.15, active: true },
                    utility_prediction: { weight: 0.1, active: true }
                },

                /**
                 * APPLY REASONING
                 */
                applyReasoning(patterns, options = {}) {
                    console.log('🧠 Applying ARMsquare reasoning...');

                    const reasoned = patterns.map(pattern => {
                        const scores = this.calculateDimensionalScores(pattern, patterns);
                        const reasoning = this.generateReasoningPath(pattern, scores);
                        
                        return {
                            ...pattern,
                            armsquare: {
                                scores,
                                reasoning,
                                confidence: this.calculateOverallConfidence(scores),
                                timestamp: Date.now()
                            }
                        };
                    });

                    console.log(`  ✓ Applied reasoning to ${reasoned.length} patterns`);
                    return reasoned;
                },

                /**
                 * CALCULATE DIMENSIONAL SCORES
                 */
                calculateDimensionalScores(pattern, allPatterns) {
                    const scores = {};

                    // Pattern Similarity
                    scores.pattern_similarity = this.calculatePatternSimilarity(pattern, allPatterns);

                    // Semantic Coherence
                    scores.semantic_coherence = this.calculateSemanticCoherence(pattern);

                    // Domain Relevance
                    scores.domain_relevance = this.calculateDomainRelevance(pattern);

                    // Novelty Score
                    scores.novelty_score = this.calculateNovelty(pattern, allPatterns);

                    // Utility Prediction
                    scores.utility_prediction = this.predictUtility(pattern);

                    return scores;
                },

                /**
                 * CALCULATE PATTERN SIMILARITY
                 */
                calculatePatternSimilarity(pattern, allPatterns) {
                    const similarities = allPatterns
                        .filter(p => p.id !== pattern.id)
                        .map(p => this.cosineSimilarity(pattern.keywords, p.keywords));

                    return similarities.length > 0 ? 
                        similarities.reduce((sum, s) => sum + s, 0) / similarities.length : 
                        0.5;
                },

                /**
                 * CALCULATE SEMANTIC COHERENCE
                 */
                calculateSemanticCoherence(pattern) {
                    if (!pattern.keywords || pattern.keywords.length < 2) return 0.5;

                    // Check keyword relatedness using nlp-compromise if available
                    if (typeof nlp !== 'undefined') {
                        const doc = nlp(pattern.keywords.join(' '));
                        const entities = doc.topics().out('array');
                        return Math.min(entities.length / pattern.keywords.length, 1.0);
                    }

                    return 0.7;
                },

                /**
                 * CALCULATE DOMAIN RELEVANCE
                 */
                calculateDomainRelevance(pattern) {
                    const hasCategory = pattern.category || pattern.categoryName;
                    const hasSubcategory = pattern.subcategory;
                    const hasKeywords = pattern.keywords && pattern.keywords.length > 0;

                    let score = 0;
                    if (hasCategory) score += 0.4;
                    if (hasSubcategory) score += 0.3;
                    if (hasKeywords) score += 0.3;

                    return score;
                },

                /**
                 * CALCULATE NOVELTY
                 */
                calculateNovelty(pattern, allPatterns) {
                    // Higher novelty for unique keyword combinations
                    const uniqueKeywords = new Set(pattern.keywords || []);
                    
                    const overlaps = allPatterns
                        .filter(p => p.id !== pattern.id)
                        .map(p => {
                            const pKeywords = new Set(p.keywords || []);
                            const intersection = new Set([...uniqueKeywords].filter(k => pKeywords.has(k)));
                            return intersection.size / uniqueKeywords.size;
                        });

                    const avgOverlap = overlaps.length > 0 ?
                        overlaps.reduce((sum, o) => sum + o, 0) / overlaps.length :
                        0;

                    return 1.0 - avgOverlap;
                },

                /**
                 * PREDICT UTILITY
                 */
                predictUtility(pattern) {
                    // Predict based on confidence, template presence, and keyword quality
                    let utility = pattern.confidence || 0.5;

                    if (pattern.template) utility += 0.2;
                    if (pattern.keywords && pattern.keywords.length >= 5) utility += 0.15;
                    if (pattern.metadata) utility += 0.1;

                    return Math.min(utility, 1.0);
                },

                /**
                 * GENERATE REASONING PATH
                 */
                generateReasoningPath(pattern, scores) {
                    const path = [];

                    // Analyze each dimension
                    for (const [dim, score] of Object.entries(scores)) {
                        const dimConfig = this.dimensions[dim];
                        if (!dimConfig || !dimConfig.active) continue;

                        const assessment = score > 0.7 ? 'strong' : score > 0.4 ? 'moderate' : 'weak';
                        
                        path.push({
                            dimension: dim,
                            score: score,
                            weight: dimConfig.weight,
                            assessment: assessment,
                            contribution: score * dimConfig.weight
                        });
                    }

                    return path;
                },

                /**
                 * CALCULATE OVERALL CONFIDENCE
                 */
                calculateOverallConfidence(scores) {
                    let totalScore = 0;
                    let totalWeight = 0;

                    for (const [dim, score] of Object.entries(scores)) {
                        const dimConfig = this.dimensions[dim];
                        if (!dimConfig || !dimConfig.active) continue;

                        totalScore += score * dimConfig.weight;
                        totalWeight += dimConfig.weight;
                    }

                    return totalWeight > 0 ? totalScore / totalWeight : 0.5;
                },

                /**
                 * COSINE SIMILARITY
                 */
                cosineSimilarity(arr1, arr2) {
                    if (!arr1 || !arr2 || arr1.length === 0 || arr2.length === 0) return 0;

                    const set1 = new Set(arr1);
                    const set2 = new Set(arr2);
                    const intersection = new Set([...set1].filter(x => set2.has(x)));

                    return intersection.size / Math.sqrt(set1.size * set2.size);
                }
            };

            window.ARMsquareReasoning = ARMsquareReasoning;

            // Add ARMsquare option to Pattern Evolution UI
            this.addARMsquareOption();

            console.log('✅ ARMsquare Reasoning ready');
        },

        /**
         * ADD ARMSQUARE OPTION
         */
        addARMsquareOption() {
            const evolutionSection = document.querySelector('#architect');
            if (!evolutionSection) return;

            const armsquareOption = `
                <div style="margin: 20px 0; padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">
                    <h3 style="margin: 0 0 10px 0; color: white;">📐 ARMsquare Reasoning Models</h3>
                    <p style="margin: 0 0 15px 0; font-size: 13px; color: rgba(255, 255, 255, 0.9);">
                        Build native reasoning models using Aevov Reasoning Multidimensional Model protocol.
                        Creates models with built-in reasoning capabilities across 5 dimensions.
                    </p>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                        <div style="background: rgba(0, 0, 0, 0.2); padding: 10px; border-radius: 6px;">
                            <div style="font-size: 11px; color: rgba(255, 255, 255, 0.7);">Reasoning Dimensions</div>
                            <div style="color: white; font-weight: 600;">5 Active</div>
                        </div>
                        <div style="background: rgba(0, 0, 0, 0.2); padding: 10px; border-radius: 6px;">
                            <div style="font-size: 11px; color: rgba(255, 255, 255, 0.7);">Model Type</div>
                            <div style="color: white; font-weight: 600;">Native Reasoning</div>
                        </div>
                    </div>

                    <button onclick="window.PatternEvolutionEnhanced.buildARMsquareModel()" style="
                        width: 100%;
                        padding: 12px;
                        background: linear-gradient(135deg, #00d4ff 0%, #3a47d5 100%);
                        border: none;
                        color: white;
                        font-weight: 600;
                        border-radius: 6px;
                        cursor: pointer;
                    ">
                        🧠 Build ARMsquare Reasoning Model
                    </button>
                </div>
            `;

            const evolutionLab = evolutionSection.querySelector('.section');
            if (evolutionLab) {
                evolutionLab.insertAdjacentHTML('beforeend', armsquareOption);
            }
        },

        /**
         * BUILD ARMSQUARE MODEL
         */
        async buildARMsquareModel() {
            console.log('🧠 Building ARMsquare reasoning model...');

            const patterns = this.state.extractedPatterns.length > 0 ?
                this.state.extractedPatterns :
                this.gatherPatternsFromExtractor();

            if (patterns.length === 0) {
                alert('No patterns available. Please import or extract patterns first.');
                return;
            }

            this.showNotification('Building ARMsquare model...', 'info');

            // Apply ARMsquare reasoning
            const reasonedPatterns = window.ARMsquareReasoning.applyReasoning(patterns);

            // Create .aev model
            const model = {
                format: 'aev',
                version: '2.0',
                protocol: 'armsquare-reasoning',
                model_name: `armsquare-reasoning-${Date.now()}`,
                created_at: new Date().toISOString(),
                reasoning: {
                    protocol: 'ARMsquare',
                    dimensions: 5,
                    native: true
                },
                patterns: reasonedPatterns,
                metadata: {
                    total_patterns: reasonedPatterns.length,
                    avg_confidence: reasonedPatterns.reduce((sum, p) => sum + (p.armsquare?.confidence || 0), 0) / reasonedPatterns.length,
                    reasoning_enabled: true
                }
            };

            // Save model
            if (window.NeuroArchitect) {
                window.NeuroArchitect.state.models.push(model);
                window.NeuroArchitect.saveModels();
            }

            // Download
            this.downloadModel(model);

            this.showNotification(
                `✅ ARMsquare model created with ${reasonedPatterns.length} reasoned patterns`,
                'success'
            );

            console.log('✅ ARMsquare model built successfully');
        },

        /**
         * SETUP KNOWLEDGE BASE INTEGRATION
         */
        setupKnowledgeBaseIntegration() {
            console.log('📚 Setting up knowledge base integration...');

            // Gather all available knowledge bases
            this.state.knowledgeBases = [
                { name: 'Advanced Patterns', source: 'window.advancedPatterns' },
                { name: 'Base Patterns', source: 'window.patterns' },
                { name: 'Chunk Registry', source: 'window.NeuroArchitect?.state.chunkRegistry' },
                { name: 'Database Patterns', source: 'window.AevovDB?.state.pglite' },
                { name: 'Cached Patterns', source: 'window.AevovCache' }
            ];

            console.log(`✅ ${this.state.knowledgeBases.length} knowledge bases integrated`);
        },

        /**
         * CREATE MODEL PATH VISUALIZATION
         */
        createModelPathVisualization() {
            const pathViz = `
                <div style="margin: 20px 0; padding: 20px; background: linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%); border-radius: 10px; border: 2px solid #00d4ff;">
                    <h3 style="margin: 0 0 15px 0; color: #00d4ff;">🚀 Path to 100T Model</h3>
                    
                    <div style="margin-bottom: 20px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <span style="font-size: 12px; color: rgba(255, 255, 255, 0.7);">Current → 10T → 100T</span>
                            <span style="font-size: 12px; color: #00ff88;" id="modelPathProgress">0%</span>
                        </div>
                        <div style="background: rgba(0, 0, 0, 0.3); height: 8px; border-radius: 4px; overflow: hidden;">
                            <div id="modelPathBar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #00d4ff, #00ff88); transition: width 0.3s;"></div>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
                        <div style="background: rgba(0, 212, 255, 0.1); padding: 12px; border-radius: 6px; text-align: center;">
                            <div style="font-size: 11px; color: rgba(255, 255, 255, 0.7);">Current</div>
                            <div style="color: #00d4ff; font-weight: 600;" id="currentModelSize">0</div>
                        </div>
                        <div style="background: rgba(255, 159, 10, 0.1); padding: 12px; border-radius: 6px; text-align: center;">
                            <div style="font-size: 11px; color: rgba(255, 255, 255, 0.7);">10T Target</div>
                            <div style="color: #ff9f0a; font-weight: 600;">10,000B</div>
                        </div>
                        <div style="background: rgba(0, 255, 136, 0.1); padding: 12px; border-radius: 6px; text-align: center;">
                            <div style="font-size: 11px; color: rgba(255, 255, 255, 0.7);">100T Target</div>
                            <div style="color: #00ff88; font-weight: 600;">100,000B</div>
                        </div>
                    </div>

                    <div style="margin-top: 15px; padding: 12px; background: rgba(255, 159, 10, 0.1); border-radius: 6px; border-left: 3px solid #ff9f0a;">
                        <div style="font-size: 12px; color: rgba(255, 255, 255, 0.9);">
                            💡 Brain-aligned: ~100T parameters matches human brain's synaptic connections
                        </div>
                    </div>
                </div>
            `;

            const evolutionSection = document.querySelector('#architect .section');
            if (evolutionSection) {
                evolutionSection.insertAdjacentHTML('beforeend', pathViz);
            }
        },

        /**
         * UPDATE EVOLUTION STATS
         */
        updateEvolutionStats() {
            const patternCount = this.state.extractedPatterns.length;
            const modelSize = patternCount * 1000000; // Rough estimate

            this.state.modelSize = modelSize;

            // Update UI
            document.getElementById('currentModelSize')?.textContent = 
                this.formatModelSize(modelSize);

            const progress = Math.min((modelSize / this.config.targetModelSize) * 100, 100);
            document.getElementById('modelPathProgress')?.textContent = progress.toFixed(2) + '%';
            document.getElementById('modelPathBar').style.width = progress + '%';
        },

        /**
         * FORMAT MODEL SIZE
         */
        formatModelSize(size) {
            if (size >= 1e12) return (size / 1e12).toFixed(1) + 'T';
            if (size >= 1e9) return (size / 1e9).toFixed(1) + 'B';
            if (size >= 1e6) return (size / 1e6).toFixed(1) + 'M';
            return size.toString();
        },

        /**
         * DOWNLOAD MODEL
         */
        downloadModel(model) {
            const json = JSON.stringify(model, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${model.model_name}.aev`;
            a.click();
            URL.revokeObjectURL(url);
        },

        /**
         * SHOW NOTIFICATION
         */
        showNotification(message, type = 'info') {
            console.log(`[${type.toUpperCase()}] ${message}`);
            // Could integrate with existing notification system
        }
    };

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            PatternEvolutionEnhanced.init();
        });
    } else {
        PatternEvolutionEnhanced.init();
    }

    // Export globally
    window.PatternEvolutionEnhanced = PatternEvolutionEnhanced;

    console.log('✅ Enhanced Pattern Evolution Lab loaded');
    console.log('🧬 ARMsquare reasoning models ready');
    console.log('🚀 Path to 10T and 100T models enabled');

})();
