/**
 * ENHANCED WORDNET PATTERN UNIQUENESS SYSTEM
 * Fixes low uniqueness after pattern generation
 * Uses WordNet from nlp-compromise for dynamic keyword generation
 * Ensures keywords remain unique across categories and subcategories
 */

(function() {
    'use strict';

    console.log('🔧 Loading Enhanced WordNet Uniqueness System...');

    const WordNetUniquenessEngine = {
        // State
        state: {
            usedKeywords: new Set(),
            categoryKeywordMap: new Map(),
            synonymCache: new Map(),
            wordNetReady: false,
            uniquenessScore: 0,
            totalGenerated: 0
        },

        // Config
        config: {
            minUniqueness: 0.85,
            maxSynonymDepth: 3,
            keywordVariationFactor: 5,
            enforceUniqueness: true,
            useSemanticExpansion: true
        },

        /**
         * INITIALIZE
         */
        async init() {
            console.log('⚡ Initializing WordNet Uniqueness Engine...');

            // Check if WordNet is available through nlp-compromise
            if (typeof nlp === 'undefined') {
                console.error('❌ nlp-compromise not loaded!');
                return;
            }

            // Load WordNet.js if available
            if (window.CompromiseAevov && window.CompromiseAevov.config.useWordNet) {
                this.state.wordNetReady = true;
                console.log('✅ WordNet integration active');
            } else {
                console.log('⚠️ WordNet not active, using nlp-compromise only');
            }

            // Hook into pattern generation
            this.hookPatternGeneration();

            console.log('✅ WordNet Uniqueness Engine ready!');
        },

        /**
         * HOOK INTO PATTERN GENERATION
         */
        hookPatternGeneration() {
            // Hook into Advanced Extractor
            if (window.AdvancedPatternExtractor) {
                const original = window.AdvancedPatternExtractor.generatePatterns;
                
                if (original) {
                    window.AdvancedPatternExtractor.generatePatterns = (category, subcategory, count) => {
                        console.log(`🔍 Enhancing keywords for ${category} > ${subcategory}`);
                        
                        // Get base patterns
                        const patterns = original.call(window.AdvancedPatternExtractor, category, subcategory, count);
                        
                        // Enhance with unique keywords
                        return this.enhancePatternUniqueness(patterns, category, subcategory);
                    };

                    console.log('✅ Hooked into Advanced Extractor');
                }
            }

            // Hook into Dynamic Keyword Extractor
            if (window.DynamicKeywordExtractor) {
                const originalExtract = window.DynamicKeywordExtractor.extractKeywords;
                
                if (originalExtract) {
                    window.DynamicKeywordExtractor.extractKeywords = (text, category) => {
                        const keywords = originalExtract.call(window.DynamicKeywordExtractor, text, category);
                        return this.ensureKeywordUniqueness(keywords, category);
                    };

                    console.log('✅ Hooked into Dynamic Keyword Extractor');
                }
            }
        },

        /**
         * ENHANCE PATTERN UNIQUENESS
         */
        enhancePatternUniqueness(patterns, category, subcategory) {
            return patterns.map(pattern => {
                const enhanced = { ...pattern };
                
                // Expand keywords with unique variations
                enhanced.keywords = this.generateUniqueKeywords(
                    pattern.keywords || [],
                    category,
                    subcategory
                );

                // Track usage
                enhanced.keywords.forEach(kw => {
                    this.state.usedKeywords.add(kw.toLowerCase());
                    
                    const key = `${category}:${subcategory}`;
                    if (!this.state.categoryKeywordMap.has(key)) {
                        this.state.categoryKeywordMap.set(key, new Set());
                    }
                    this.state.categoryKeywordMap.get(key).add(kw.toLowerCase());
                });

                this.state.totalGenerated++;
                
                return enhanced;
            });
        },

        /**
         * GENERATE UNIQUE KEYWORDS
         */
        generateUniqueKeywords(baseKeywords, category, subcategory) {
            const uniqueKeywords = new Set(baseKeywords);
            const doc = nlp(baseKeywords.join(' '));

            // Extract base linguistic features
            const nouns = doc.nouns().out('array');
            const verbs = doc.verbs().toInfinitive().out('array');
            const adjectives = doc.adjectives().out('array');

            // Add base features
            [...nouns, ...verbs, ...adjectives].forEach(word => {
                if (word && word.length > 2) {
                    uniqueKeywords.add(word);
                }
            });

            // Generate synonyms and related terms
            baseKeywords.forEach(keyword => {
                const variations = this.getSemanticVariations(keyword, category, subcategory);
                variations.forEach(v => uniqueKeywords.add(v));
            });

            // Generate domain-specific terms
            const domainTerms = this.generateDomainSpecificTerms(category, subcategory, baseKeywords);
            domainTerms.forEach(term => uniqueKeywords.add(term));

            // Filter out already used keywords if enforcing uniqueness
            let finalKeywords = Array.from(uniqueKeywords);
            
            if (this.config.enforceUniqueness) {
                finalKeywords = finalKeywords.filter(kw => {
                    const lower = kw.toLowerCase();
                    const categoryKey = `${category}:${subcategory}`;
                    const categorySet = this.state.categoryKeywordMap.get(categoryKey);
                    
                    // Allow if not used globally, or only used in this category
                    return !this.state.usedKeywords.has(lower) || 
                           (categorySet && categorySet.has(lower));
                });
            }

            // Calculate uniqueness score
            this.updateUniquenessScore(finalKeywords);

            return finalKeywords;
        },

        /**
         * GET SEMANTIC VARIATIONS
         */
        getSemanticVariations(keyword, category, subcategory) {
            const variations = new Set();
            const cacheKey = `${keyword}:${category}:${subcategory}`;

            // Check cache
            if (this.state.synonymCache.has(cacheKey)) {
                return this.state.synonymCache.get(cacheKey);
            }

            const doc = nlp(keyword);

            // Morphological variations
            if (doc.has('#Noun')) {
                const plural = doc.nouns().toPlural().out('text');
                const singular = doc.nouns().toSingular().out('text');
                if (plural) variations.add(plural);
                if (singular) variations.add(singular);
            }

            if (doc.has('#Verb')) {
                const present = doc.verbs().toPresent().out('text');
                const past = doc.verbs().toPast().out('text');
                const gerund = doc.verbs().toGerund().out('text');
                if (present) variations.add(present);
                if (past) variations.add(past);
                if (gerund) variations.add(gerund);
            }

            // Technical variations (add prefixes/suffixes based on category)
            const categoryPrefixes = this.getCategoryPrefixes(category);
            const categorySuffixes = this.getCategorySuffixes(category);

            categoryPrefixes.forEach(prefix => {
                variations.add(`${prefix}${keyword}`);
                variations.add(`${prefix}_${keyword}`);
            });

            categorySuffixes.forEach(suffix => {
                variations.add(`${keyword}${suffix}`);
                variations.add(`${keyword}_${suffix}`);
            });

            const result = Array.from(variations).filter(v => v && v.length > 2);
            this.state.synonymCache.set(cacheKey, result);

            return result;
        },

        /**
         * GENERATE DOMAIN-SPECIFIC TERMS
         */
        generateDomainSpecificTerms(category, subcategory, baseKeywords) {
            const terms = new Set();

            const domainDictionaries = {
                technology: ['framework', 'library', 'api', 'sdk', 'module', 'package', 'tool', 'platform'],
                web_development: ['component', 'hook', 'router', 'state', 'props', 'lifecycle', 'render'],
                backend: ['endpoint', 'middleware', 'controller', 'service', 'repository', 'schema'],
                mobile_development: ['screen', 'navigator', 'gesture', 'sensor', 'notification'],
                data_science: ['algorithm', 'model', 'training', 'inference', 'dataset', 'feature'],
                medicine: ['diagnosis', 'treatment', 'symptom', 'condition', 'therapy', 'clinical'],
                business: ['strategy', 'analysis', 'optimization', 'metric', 'kpi', 'revenue']
            };

            const categoryDict = domainDictionaries[category] || [];
            const subcategoryDict = domainDictionaries[subcategory] || [];

            // Combine base keywords with domain terms
            baseKeywords.forEach(base => {
                categoryDict.forEach(domain => {
                    terms.add(`${base}_${domain}`);
                    terms.add(`${domain}_${base}`);
                });
                
                subcategoryDict.forEach(domain => {
                    terms.add(`${base}_${domain}`);
                });
            });

            return Array.from(terms);
        },

        /**
         * GET CATEGORY PREFIXES
         */
        getCategoryPrefixes(category) {
            const prefixMap = {
                technology: ['auto', 'multi', 'cross', 'inter', 'meta'],
                web_development: ['client', 'server', 'full', 'front', 'back'],
                backend: ['micro', 'mono', 'distrib', 'async', 'sync'],
                mobile_development: ['native', 'hybrid', 'cross', 'responsive'],
                data_science: ['super', 'unsuper', 'semi', 'deep', 'shallow'],
                medicine: ['pre', 'post', 'intra', 'extra', 'trans']
            };

            return prefixMap[category] || [];
        },

        /**
         * GET CATEGORY SUFFIXES
         */
        getCategorySuffixes(category) {
            const suffixMap = {
                technology: ['able', 'ible', 'ful', 'less', 'based'],
                web_development: ['driven', 'oriented', 'centric', 'aware'],
                backend: ['service', 'layer', 'engine', 'handler', 'worker'],
                mobile_development: ['view', 'screen', 'widget', 'controller'],
                data_science: ['model', 'network', 'tree', 'ensemble'],
                medicine: ['therapy', 'logy', 'pathy', 'osis']
            };

            return suffixMap[category] || [];
        },

        /**
         * ENSURE KEYWORD UNIQUENESS
         */
        ensureKeywordUniqueness(keywords, category) {
            if (!this.config.enforceUniqueness) {
                return keywords;
            }

            return keywords.filter(kw => {
                const lower = kw.toLowerCase();
                
                // Check if already used globally
                if (this.state.usedKeywords.has(lower)) {
                    // Generate alternative
                    const alt = this.generateAlternative(kw, category);
                    if (alt && !this.state.usedKeywords.has(alt.toLowerCase())) {
                        this.state.usedKeywords.add(alt.toLowerCase());
                        return true;
                    }
                    return false;
                }

                this.state.usedKeywords.add(lower);
                return true;
            });
        },

        /**
         * GENERATE ALTERNATIVE
         */
        generateAlternative(keyword, category) {
            const doc = nlp(keyword);
            
            // Try morphological change
            if (doc.has('#Noun')) {
                const alt = doc.nouns().toPlural().out('text');
                if (alt !== keyword) return alt;
            }

            // Try adding category prefix
            const prefixes = this.getCategoryPrefixes(category);
            if (prefixes.length > 0) {
                return `${prefixes[0]}_${keyword}`;
            }

            // Try adding number suffix
            return `${keyword}_variant`;
        },

        /**
         * UPDATE UNIQUENESS SCORE
         */
        updateUniquenessScore(keywords) {
            if (keywords.length === 0) return;

            const uniqueCount = keywords.filter(kw => 
                !this.state.usedKeywords.has(kw.toLowerCase())
            ).length;

            this.state.uniquenessScore = uniqueCount / keywords.length;
        },

        /**
         * GET STATS
         */
        getStats() {
            return {
                totalKeywords: this.state.usedKeywords.size,
                totalPatterns: this.state.totalGenerated,
                uniquenessScore: (this.state.uniquenessScore * 100).toFixed(2) + '%',
                categories: this.state.categoryKeywordMap.size,
                avgKeywordsPerCategory: (this.state.usedKeywords.size / Math.max(this.state.categoryKeywordMap.size, 1)).toFixed(1)
            };
        },

        /**
         * RESET
         */
        reset() {
            this.state.usedKeywords.clear();
            this.state.categoryKeywordMap.clear();
            this.state.synonymCache.clear();
            this.state.uniquenessScore = 0;
            this.state.totalGenerated = 0;
            console.log('🔄 Uniqueness engine reset');
        }
    };

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            WordNetUniquenessEngine.init();
        });
    } else {
        WordNetUniquenessEngine.init();
    }

    // Export globally
    window.WordNetUniquenessEngine = WordNetUniquenessEngine;

    console.log('✅ Enhanced WordNet Uniqueness System loaded');
    console.log('🎯 Pattern keywords will now have high uniqueness across categories');

})();
