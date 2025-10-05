/**
 * SEMANTIC PATTERN SEARCH SYSTEM
 * Replaces keyword matching with vector embeddings
 */

(function() {
    'use strict';

    const SemanticSearch = {
        // State
        state: {
            initialized: false,
            embeddings: new Map(),
            model: null,
            vocabSize: 0
        },

        // Simple embedding model (TF-IDF-like)
        vocab: new Map(),
        idf: new Map(),

        /**
         * INITIALIZE
         */
        async init() {
            console.log('Initializing Semantic Search...');

            // Build vocabulary from existing patterns
            await this.buildVocabulary();

            // Generate embeddings for all patterns
            await this.generateEmbeddings();

            this.state.initialized = true;
            console.log('Semantic Search ready');
        },

        /**
         * BUILD VOCABULARY FROM ALL PATTERNS
         */
        async buildVocabulary() {
            const allPatterns = this.getAllPatterns();
            const docCount = allPatterns.length;

            // Count word occurrences across documents
            const wordDocCount = new Map();

            allPatterns.forEach(pattern => {
                const words = this.tokenize(pattern);
                const uniqueWords = new Set(words);

                uniqueWords.forEach(word => {
                    wordDocCount.set(word, (wordDocCount.get(word) || 0) + 1);
                });
            });

            // Build vocabulary and calculate IDF
            let vocabIndex = 0;
            wordDocCount.forEach((count, word) => {
                // Only include words that appear in multiple documents
                if (count > 1 && count < docCount * 0.8) {
                    this.vocab.set(word, vocabIndex++);
                    this.idf.set(word, Math.log(docCount / count));
                }
            });

            this.state.vocabSize = vocabIndex;
            console.log(`Vocabulary built: ${vocabIndex} terms`);
        },

        /**
         * GENERATE EMBEDDINGS FOR ALL PATTERNS
         */
        async generateEmbeddings() {
            const allPatterns = this.getAllPatterns();

            for (const pattern of allPatterns) {
                if (!pattern.id) continue;

                const embedding = this.createEmbedding(pattern);
                this.state.embeddings.set(pattern.id, embedding);
            }

            console.log(`Generated ${this.state.embeddings.size} embeddings`);
        },

        /**
         * CREATE EMBEDDING FOR PATTERN (TF-IDF vector)
         */
        createEmbedding(pattern) {
            const words = this.tokenize(pattern);
            const vector = new Array(this.state.vocabSize).fill(0);

            // Count word frequencies
            const termFreq = new Map();
            words.forEach(word => {
                termFreq.set(word, (termFreq.get(word) || 0) + 1);
            });

            // Calculate TF-IDF for each term
            termFreq.forEach((freq, word) => {
                const vocabIndex = this.vocab.get(word);
                if (vocabIndex !== undefined) {
                    const tf = freq / words.length;
                    const idf = this.idf.get(word) || 0;
                    vector[vocabIndex] = tf * idf;
                }
            });

            // Normalize vector
            return this.normalize(vector);
        },

        /**
         * TOKENIZE PATTERN INTO WORDS
         */
        tokenize(pattern) {
            const text = [
                pattern.query || '',
                ...(pattern.keywords || []),
                pattern.category || '',
                pattern.categoryName || '',
                pattern.subcategory || ''
            ].join(' ').toLowerCase();

            // Remove special characters and split
            return text
                .replace(/[^\w\s]/g, ' ')
                .split(/\s+/)
                .filter(w => w.length > 2);
        },

        /**
         * NORMALIZE VECTOR
         */
        normalize(vector) {
            const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
            return magnitude > 0 ? vector.map(v => v / magnitude) : vector;
        },

        /**
         * HYBRID SEARCH (Keyword + Semantic)
         */
        search(query, topK = 10) {
            if (!this.state.initialized) {
                console.warn('Semantic search not initialized, using keyword only');
                return this.fallbackKeywordSearch(query, topK);
            }

            // Get keyword matches
            const keywordResults = this.keywordSearch(query);

            // Get semantic matches
            const semanticResults = this.semanticSearch(query);

            // Combine with weighted scoring
            const combined = new Map();

            // Add keyword results (weight: 0.6)
            keywordResults.forEach(r => {
                combined.set(r.patternId, {
                    pattern: r.pattern,
                    keywordScore: r.score,
                    semanticScore: 0,
                    finalScore: r.score * 0.6
                });
            });

            // Add semantic results (weight: 0.4)
            semanticResults.forEach(r => {
                if (combined.has(r.patternId)) {
                    const existing = combined.get(r.patternId);
                    existing.semanticScore = r.similarity;
                    existing.finalScore += r.similarity * 0.4;
                } else {
                    combined.set(r.patternId, {
                        pattern: r.pattern,
                        keywordScore: 0,
                        semanticScore: r.similarity,
                        finalScore: r.similarity * 0.4
                    });
                }
            });

            // Sort by final score
            const results = Array.from(combined.values())
                .sort((a, b) => b.finalScore - a.finalScore)
                .slice(0, topK)
                .map(r => ({
                    pattern: r.pattern,
                    similarity: r.finalScore,
                    confidence: r.finalScore,
                    breakdown: {
                        keyword: r.keywordScore,
                        semantic: r.semanticScore
                    }
                }));

            return results;
        },

        /**
         * KEYWORD SEARCH (exact/fuzzy matching)
         */
        keywordSearch(query) {
            const allPatterns = this.getAllPatterns();
            const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);

            return allPatterns.map(pattern => {
                const patternWords = this.tokenize(pattern);
                
                // Exact matches
                let exactMatches = 0;
                // Partial matches
                let partialMatches = 0;

                queryWords.forEach(qw => {
                    if (patternWords.includes(qw)) {
                        exactMatches++;
                    } else if (patternWords.some(pw => pw.includes(qw) || qw.includes(pw))) {
                        partialMatches++;
                    }
                });

                const score = (exactMatches * 1.0 + partialMatches * 0.5) / queryWords.length;

                return {
                    patternId: pattern.id,
                    pattern,
                    score
                };
            }).filter(r => r.score > 0);
        },

        /**
         * PURE SEMANTIC SEARCH (vector similarity)
         */
        semanticSearch(query) {
            const queryEmbedding = this.createEmbedding({ query, keywords: [query] });

            const results = [];
            this.state.embeddings.forEach((embedding, patternId) => {
                const similarity = this.cosineSimilarity(queryEmbedding, embedding);
                results.push({ 
                    patternId, 
                    similarity,
                    pattern: this.getPatternById(patternId)
                });
            });

            return results.filter(r => r.similarity > 0.1);
        },

        /**
         * COSINE SIMILARITY
         */
        cosineSimilarity(vec1, vec2) {
            if (vec1.length !== vec2.length) return 0;

            let dotProduct = 0;
            for (let i = 0; i < vec1.length; i++) {
                dotProduct += vec1[i] * vec2[i];
            }

            return dotProduct; // Already normalized
        },

        /**
         * GET ALL PATTERNS
         */
        getAllPatterns() {
            const patterns = [];

            // From advancedPatterns
            if (window.advancedPatterns) {
                Object.values(window.advancedPatterns).forEach(categoryPatterns => {
                    if (Array.isArray(categoryPatterns)) {
                        patterns.push(...categoryPatterns);
                    }
                });
            }

            // From patterns
            if (window.patterns) {
                Object.values(window.patterns).forEach(categoryPatterns => {
                    if (Array.isArray(categoryPatterns)) {
                        patterns.push(...categoryPatterns);
                    }
                });
            }

            return patterns;
        },

        /**
         * GET PATTERN BY ID
         */
        getPatternById(patternId) {
            const allPatterns = this.getAllPatterns();
            return allPatterns.find(p => p.id === patternId);
        },

        /**
         * FALLBACK KEYWORD SEARCH
         */
        fallbackKeywordSearch(query, topK) {
            const allPatterns = this.getAllPatterns();
            const queryWords = query.toLowerCase().split(/\s+/);

            const results = allPatterns.map(pattern => {
                const patternWords = this.tokenize(pattern);
                const matches = queryWords.filter(qw => 
                    patternWords.some(pw => pw.includes(qw) || qw.includes(pw))
                ).length;

                return {
                    pattern,
                    similarity: matches / queryWords.length,
                    confidence: matches / queryWords.length
                };
            });

            results.sort((a, b) => b.similarity - a.similarity);
            return results.slice(0, topK);
        },

        /**
         * REINDEX (when patterns change)
         */
        async reindex() {
            console.log('Reindexing patterns...');
            this.state.embeddings.clear();
            await this.buildVocabulary();
            await this.generateEmbeddings();
            console.log('Reindexing complete');
        }
    };

    // Auto-initialize after pattern extraction
    if (window.advancedPatterns || window.patterns) {
        SemanticSearch.init();
    }

    // Hook into pattern extraction to auto-reindex
    const originalExtractCategory = window.extractCategoryPatterns;
    if (originalExtractCategory) {
        window.extractCategoryPatterns = async function(...args) {
            await originalExtractCategory.apply(this, args);
            
            // Reindex after extraction
            setTimeout(() => SemanticSearch.reindex(), 1000);
        };
    }

    // Replace unified chat query processing with semantic search
    if (window.UnifiedChatSystem) {
        const originalProcess = window.UnifiedChatSystem.findBestMatch;
        
        if (originalProcess) {
            window.UnifiedChatSystem.findBestMatch = function(query) {
                // Use semantic search
                const results = SemanticSearch.search(query, 5);
                
                if (results.length === 0 || results[0].similarity < 0.3) {
                    return {
                        found: false,
                        message: `No semantic match found for "${query}"`
                    };
                }

                return {
                    found: true,
                    match: results[0],
                    alternatives: results.slice(1)
                };
            };
        }
    }

    // Replace NLU pattern matching with semantic search
    if (window.AevovNLU) {
        const originalMatch = window.AevovNLU.matchPattern;
        
        if (originalMatch) {
            window.AevovNLU.matchPattern = function(query) {
                const results = SemanticSearch.search(query, 1);
                return results[0] || null;
            };
        }
    }

    window.SemanticSearch = SemanticSearch;

    console.log('Semantic Pattern Search loaded');
    console.log('Pattern matching now uses vector embeddings instead of keywords');

})();
