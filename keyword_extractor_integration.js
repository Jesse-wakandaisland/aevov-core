/**
 * KEYWORD EXTRACTOR INTEGRATION
 * Integrates DynamicKeywordExtractor with Advanced Pattern Extractor
 * Replaces static keywords with dynamic extraction
 */

(function() {
    'use strict';

    console.log('🔗 Loading Keyword Extractor Integration...');

    const KeywordExtractorIntegration = {
        enabled: false,

        async init() {
            console.log('⚡ Initializing Keyword Extractor Integration...');

            // Wait for dependencies
            await this.waitForDependencies();

            // Patch pattern extraction functions
            this.patchAdvancedExtractor();
            this.patchRealPatternSystem();

            this.enabled = true;
            console.log('✅ Keyword Extractor Integration ready');
        },

        async waitForDependencies() {
            // Wait for DynamicKeywordExtractor
            let attempts = 0;
            while (!window.DynamicKeywordExtractor && attempts < 50) {
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }

            if (!window.DynamicKeywordExtractor) {
                throw new Error('DynamicKeywordExtractor not loaded');
            }

            console.log('✅ DynamicKeywordExtractor found');
        },

        /**
         * Patch Advanced Pattern Extractor
         */
        patchAdvancedExtractor() {
            if (!window.extractAdvancedPatterns) {
                console.warn('⚠️ extractAdvancedPatterns not found');
                return;
            }

            const original = window.extractAdvancedPatterns;

            window.extractAdvancedPatterns = async function(...args) {
                console.log('🔬 Extracting patterns with dynamic keywords...');

                // Call original
                const result = await original.apply(this, args);

                // Enhance patterns with dynamic keywords
                if (window.advancedPatterns) {
                    Object.keys(window.advancedPatterns).forEach(category => {
                        const patterns = window.advancedPatterns[category];
                        if (Array.isArray(patterns)) {
                            patterns.forEach(pattern => {
                                KeywordExtractorIntegration.enhancePattern(pattern, category);
                            });
                        }
                    });

                    console.log('✅ Patterns enhanced with dynamic keywords');
                }

                return result;
            };

            console.log('✅ Advanced Pattern Extractor patched');
        },

        /**
         * Patch Real Pattern System
         */
        patchRealPatternSystem() {
            if (window.extractRealPatternsFromChunks) {
                const original = window.extractRealPatternsFromChunks;

                window.extractRealPatternsFromChunks = async function(chunks, manifest) {
                    const result = await original.call(this, chunks, manifest);

                    // Enhance each pattern
                    if (result && result.patterns) {
                        result.patterns = result.patterns.map(pattern => 
                            KeywordExtractorIntegration.enhancePattern(pattern, pattern.category)
                        );
                    }

                    return result;
                };

                console.log('✅ Real Pattern System patched');
            }

            if (window.BinaryPatternAnalyzer && window.BinaryPatternAnalyzer.analyzeChunk) {
                const original = window.BinaryPatternAnalyzer.analyzeChunk;

                window.BinaryPatternAnalyzer.analyzeChunk = function(chunk, chunkIndex) {
                    const result = original.call(this, chunk, chunkIndex);

                    // Enhance patterns
                    ['byteFrequency', 'sequences', 'structures', 'entropy'].forEach(key => {
                        if (result[key]) {
                            const patterns = Array.isArray(result[key]) ? result[key] : [result[key]];
                            patterns.forEach(p => {
                                if (p && typeof p === 'object') {
                                    KeywordExtractorIntegration.enhancePattern(p, 'binary_analysis');
                                }
                            });
                        }
                    });

                    return result;
                };

                console.log('✅ Binary Pattern Analyzer patched');
            }
        },

        /**
         * Enhance pattern with dynamic keywords
         */
        enhancePattern(pattern, category = 'general') {
            if (!pattern || !window.DynamicKeywordExtractor) return pattern;

            // Skip if already enhanced
            if (pattern._keywordsEnhanced) return pattern;

            try {
                // Extract binary data if available
                let binaryData = null;
                if (pattern.template) {
                    try {
                        binaryData = this.base64ToArrayBuffer(pattern.template);
                    } catch (e) {
                        // Not base64, ignore
                    }
                }

                // Prepare metadata
                const metadata = {
                    category: category,
                    entropy: pattern.metadata?.entropy || pattern.entropy,
                    type: pattern.type,
                    ...pattern.metadata
                };

                // Extract keywords
                let keywords = [];
                
                if (binaryData) {
                    // From binary data
                    keywords = window.DynamicKeywordExtractor.extractFromBinary(binaryData, metadata);
                } else {
                    // From metadata and category
                    keywords = [
                        ...window.DynamicKeywordExtractor.getDomainKeywords(category),
                        ...window.DynamicKeywordExtractor.mapEntropyToKeywords(metadata.entropy || 0.5)
                    ];

                    // Add context-specific keywords
                    if (pattern.type) {
                        keywords.push(pattern.type, `${pattern.type}_pattern`, `${pattern.type}_based`);
                    }

                    if (pattern.sourceQuery) {
                        const queryWords = pattern.sourceQuery.toLowerCase().split(/\s+/);
                        keywords.push(...queryWords.filter(w => w.length > 3));
                    }

                    // Expand and filter
                    keywords = window.DynamicKeywordExtractor.filterAndRank(keywords);
                }

                // Update pattern
                pattern.keywords = keywords;
                pattern._keywordsEnhanced = true;
                pattern._keywordCount = keywords.length;

                console.log(`📝 Enhanced pattern ${pattern.id}: ${keywords.length} keywords`);

            } catch (error) {
                console.warn(`⚠️ Failed to enhance pattern ${pattern.id}:`, error);
            }

            return pattern;
        },

        /**
         * Convert base64 to ArrayBuffer
         */
        base64ToArrayBuffer(base64) {
            const binaryString = atob(base64);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes.buffer;
        },

        /**
         * Batch enhance patterns
         */
        batchEnhancePatterns(patterns, category = 'general') {
            console.log(`🔄 Batch enhancing ${patterns.length} patterns...`);

            const enhanced = patterns.map(p => this.enhancePattern(p, category));

            const totalKeywords = enhanced.reduce((sum, p) => sum + (p._keywordCount || 0), 0);
            const avgKeywords = Math.floor(totalKeywords / enhanced.length);

            console.log(`✅ Batch complete: ${totalKeywords} total keywords, ${avgKeywords} avg per pattern`);

            return enhanced;
        },

        /**
         * Configure keyword extraction
         */
        configure(config) {
            if (window.DynamicKeywordExtractor) {
                window.DynamicKeywordExtractor.setConfig(config);
                console.log('⚙️ Keyword extractor configured:', config);
            }
        },

        /**
         * Add custom dictionary
         */
        addDictionary(name, words) {
            if (window.DynamicKeywordExtractor) {
                window.DynamicKeywordExtractor.addDictionary(name, words);
                console.log(`📚 Added dictionary "${name}" with ${words.length} words`);
            }
        }
    };

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                KeywordExtractorIntegration.init().catch(console.error);
            }, 2500);
        });
    } else {
        setTimeout(() => {
            KeywordExtractorIntegration.init().catch(console.error);
        }, 2500);
    }

    // Export
    window.KeywordExtractorIntegration = KeywordExtractorIntegration;

    // Helper function for manual enhancement
    window.enhancePatternKeywords = function(pattern, category) {
        return KeywordExtractorIntegration.enhancePattern(pattern, category);
    };

    window.batchEnhancePatterns = function(patterns, category) {
        return KeywordExtractorIntegration.batchEnhancePatterns(patterns, category);
    };

    console.log('✅ Keyword Extractor Integration loaded');

})();
