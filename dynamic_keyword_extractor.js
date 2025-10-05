/**
 * DYNAMIC KEYWORD EXTRACTION LIBRARY
 * Generates hundreds to thousands of unique keywords per pattern
 * Uses comprehensive dictionaries and intelligent extraction
 */

(function() {
    'use strict';

    console.log('📚 Loading Dynamic Keyword Extraction Library...');

    const DynamicKeywordExtractor = {
        // Configuration
        config: {
            maxKeywordsPerPattern: 500,
            minKeywordLength: 3,
            useContextExpansion: true,
            useSynonyms: true,
            useNgrams: true,
            ngramRange: [1, 3]
        },

        // Comprehensive domain dictionaries (expandable)
        dictionaries: {
            technology: [
                'algorithm', 'api', 'architecture', 'array', 'async', 'authentication', 'backend', 'bandwidth', 'binary',
                'blockchain', 'boolean', 'bootstrap', 'browser', 'buffer', 'bytecode', 'cache', 'callback', 'cipher',
                'class', 'client', 'cloud', 'cluster', 'code', 'compiler', 'component', 'compression', 'computation',
                'concurrency', 'configuration', 'connection', 'container', 'cpu', 'cryptography', 'data', 'database',
                'debugging', 'deployment', 'device', 'devops', 'distributed', 'docker', 'domain', 'encryption', 'endpoint',
                'engine', 'event', 'exception', 'execution', 'file', 'firewall', 'framework', 'frontend', 'function',
                'gateway', 'git', 'gpu', 'graph', 'hash', 'header', 'heap', 'http', 'https', 'image', 'implementation',
                'index', 'inheritance', 'injection', 'input', 'instance', 'integration', 'interface', 'internet', 'io',
                'iteration', 'javascript', 'json', 'kernel', 'key', 'kubernetes', 'latency', 'library', 'linux', 'load',
                'localhost', 'logic', 'loop', 'machine', 'memory', 'method', 'microservice', 'middleware', 'model',
                'module', 'network', 'node', 'object', 'optimization', 'output', 'packet', 'parameter', 'parsing',
                'performance', 'pipeline', 'plugin', 'pointer', 'port', 'process', 'processor', 'programming', 'protocol',
                'proxy', 'query', 'queue', 'recursion', 'reference', 'registry', 'rendering', 'repository', 'request',
                'resource', 'response', 'rest', 'router', 'runtime', 'scalability', 'schema', 'script', 'security',
                'server', 'service', 'session', 'socket', 'software', 'stack', 'state', 'storage', 'stream', 'string',
                'structure', 'synchronization', 'syntax', 'system', 'template', 'testing', 'thread', 'throughput',
                'token', 'transaction', 'tree', 'tuple', 'type', 'unicode', 'unit', 'upload', 'url', 'validation',
                'variable', 'vector', 'version', 'virtual', 'web', 'webhook', 'websocket', 'workflow', 'xml', 'yaml'
            ],

            dataScience: [
                'accuracy', 'activation', 'analysis', 'anomaly', 'artificial', 'batch', 'bayes', 'bias', 'classification',
                'clustering', 'coefficient', 'computation', 'correlation', 'dataset', 'deep', 'dimension', 'distribution',
                'epoch', 'error', 'estimation', 'evaluation', 'feature', 'gradient', 'hypothesis', 'inference', 'intelligence',
                'kernel', 'label', 'learning', 'linear', 'loss', 'matrix', 'metric', 'model', 'neural', 'network',
                'normalization', 'optimization', 'outlier', 'overfitting', 'parameter', 'prediction', 'preprocessing',
                'probability', 'regression', 'reinforcement', 'sampling', 'scale', 'score', 'sigmoid', 'statistics',
                'supervised', 'tensor', 'testing', 'training', 'transformation', 'underfitting', 'unsupervised', 'validation',
                'variance', 'vector', 'visualization', 'weight'
            ],

            general: [
                'action', 'activity', 'analysis', 'application', 'approach', 'attribute', 'behavior', 'capability',
                'category', 'change', 'characteristic', 'collection', 'combination', 'communication', 'comparison',
                'complexity', 'concept', 'condition', 'connection', 'constraint', 'content', 'context', 'control',
                'conversion', 'coordination', 'creation', 'criteria', 'decision', 'definition', 'description', 'design',
                'detail', 'development', 'difference', 'direction', 'distribution', 'element', 'enhancement', 'environment',
                'evaluation', 'example', 'execution', 'experience', 'explanation', 'expression', 'extension', 'factor',
                'feature', 'flow', 'format', 'foundation', 'framework', 'function', 'generation', 'goal', 'group',
                'guideline', 'identification', 'impact', 'implementation', 'improvement', 'indication', 'information',
                'initialization', 'input', 'integration', 'interaction', 'interpretation', 'introduction', 'investigation',
                'knowledge', 'layer', 'level', 'limitation', 'location', 'logic', 'maintenance', 'management', 'manipulation',
                'meaning', 'measurement', 'mechanism', 'method', 'modification', 'monitoring', 'notion', 'objective',
                'observation', 'operation', 'optimization', 'option', 'organization', 'orientation', 'outcome', 'output',
                'overview', 'pattern', 'perspective', 'phase', 'position', 'practice', 'principle', 'procedure', 'process',
                'production', 'property', 'proportion', 'protocol', 'provision', 'quality', 'quantity', 'range', 'ratio',
                'reaction', 'reason', 'recognition', 'recommendation', 'record', 'reduction', 'reference', 'refinement',
                'relationship', 'representation', 'requirement', 'resolution', 'resource', 'response', 'result', 'retrieval',
                'review', 'revision', 'rule', 'scenario', 'scope', 'section', 'selection', 'sequence', 'service', 'setup',
                'significance', 'simulation', 'situation', 'solution', 'source', 'specification', 'standard', 'state',
                'statement', 'strategy', 'structure', 'style', 'subject', 'summary', 'support', 'symbol', 'synthesis',
                'system', 'technique', 'technology', 'template', 'term', 'testing', 'theory', 'tool', 'topic', 'tracking',
                'transaction', 'transformation', 'transition', 'transmission', 'treatment', 'trend', 'type', 'understanding',
                'unit', 'update', 'usage', 'utilization', 'validation', 'value', 'variable', 'variation', 'verification',
                'version', 'view', 'visualization', 'workflow'
            ],

            // Stop words to exclude
            stopWords: new Set([
                'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he', 'in', 'is', 'it',
                'its', 'of', 'on', 'that', 'the', 'to', 'was', 'will', 'with', 'the', 'this', 'but', 'they',
                'have', 'had', 'what', 'when', 'where', 'who', 'which', 'why', 'how', 'or', 'can', 'if', 'then'
            ])
        },

        // Synonym mapping for expansion
        synonyms: {
            'data': ['information', 'dataset', 'records', 'content'],
            'function': ['method', 'procedure', 'routine', 'operation'],
            'create': ['generate', 'build', 'construct', 'make'],
            'delete': ['remove', 'erase', 'eliminate', 'destroy'],
            'update': ['modify', 'change', 'alter', 'revise'],
            'process': ['handle', 'execute', 'compute', 'perform'],
            'analyze': ['examine', 'study', 'investigate', 'evaluate'],
            'optimize': ['improve', 'enhance', 'refine', 'streamline'],
            'validate': ['verify', 'check', 'confirm', 'authenticate'],
            'transform': ['convert', 'change', 'modify', 'adapt']
        },

        /**
         * Extract keywords from binary pattern data
         */
        extractFromBinary(data, metadata = {}) {
            const keywords = new Set();

            // 1. Byte frequency analysis
            const byteFreq = this.analyzeByteFrequency(data);
            keywords.add(...this.mapByteFreqToKeywords(byteFreq));

            // 2. Sequence patterns
            const sequences = this.detectSequences(data);
            keywords.add(...this.mapSequencesToKeywords(sequences));

            // 3. Entropy-based keywords
            const entropy = metadata.entropy || this.calculateEntropy(data);
            keywords.add(...this.mapEntropyToKeywords(entropy));

            // 4. Structural patterns
            const structures = this.detectStructures(data);
            keywords.add(...this.mapStructuresToKeywords(structures));

            // 5. Domain-specific keywords
            if (metadata.category) {
                keywords.add(...this.getDomainKeywords(metadata.category));
            }

            // 6. Context expansion
            if (this.config.useContextExpansion) {
                const expanded = this.expandContext(Array.from(keywords));
                keywords.add(...expanded);
            }

            return this.filterAndRank(Array.from(keywords));
        },

        /**
         * Analyze byte frequency distribution
         */
        analyzeByteFrequency(data) {
            const freq = new Array(256).fill(0);
            const view = new Uint8Array(data);

            for (let i = 0; i < view.length; i++) {
                freq[view[i]]++;
            }

            return freq;
        },

        /**
         * Map byte frequency to keywords
         */
        mapByteFreqToKeywords(freq) {
            const keywords = [];
            const total = freq.reduce((a, b) => a + b, 0);

            // High frequency bytes
            freq.forEach((count, byte) => {
                const ratio = count / total;
                if (ratio > 0.05) {
                    keywords.push(`high_freq_byte_${byte.toString(16)}`);
                    keywords.push('repetitive_pattern');
                    keywords.push('structured_data');
                }
            });

            // Unique bytes
            const uniqueBytes = freq.filter(f => f > 0).length;
            if (uniqueBytes < 50) {
                keywords.push('low_entropy', 'compressed', 'structured', 'binary_coded');
            } else if (uniqueBytes > 200) {
                keywords.push('high_entropy', 'random', 'encrypted', 'diverse_data');
            }

            return keywords;
        },

        /**
         * Detect sequences in binary data
         */
        detectSequences(data) {
            const sequences = [];
            const view = new Uint8Array(data);

            // Look for repeating sequences
            for (let len = 2; len <= 8; len++) {
                const seen = new Map();
                for (let i = 0; i <= view.length - len; i++) {
                    const seq = Array.from(view.slice(i, i + len)).join(',');
                    seen.set(seq, (seen.get(seq) || 0) + 1);
                }

                seen.forEach((count, seq) => {
                    if (count > 2) {
                        sequences.push({ sequence: seq, length: len, count });
                    }
                });
            }

            return sequences;
        },

        /**
         * Map sequences to keywords
         */
        mapSequencesToKeywords(sequences) {
            const keywords = [];

            sequences.forEach(seq => {
                keywords.push(`sequence_len_${seq.length}`);
                keywords.push(`repeated_${seq.count}_times`);
                
                if (seq.count > 5) {
                    keywords.push('highly_repetitive');
                    keywords.push('pattern_based');
                }
            });

            if (sequences.length > 10) {
                keywords.push('complex_sequences');
                keywords.push('structured_format');
            }

            return keywords;
        },

        /**
         * Calculate entropy
         */
        calculateEntropy(data) {
            const freq = this.analyzeByteFrequency(data);
            const total = freq.reduce((a, b) => a + b, 0);
            let entropy = 0;

            freq.forEach(count => {
                if (count > 0) {
                    const p = count / total;
                    entropy -= p * Math.log2(p);
                }
            });

            return entropy / 8; // Normalize to 0-1
        },

        /**
         * Map entropy to keywords
         */
        mapEntropyToKeywords(entropy) {
            const keywords = [];

            if (entropy < 0.3) {
                keywords.push('very_low_entropy', 'highly_compressed', 'simple_structure', 'minimal_variation');
            } else if (entropy < 0.5) {
                keywords.push('low_entropy', 'structured', 'organized', 'patterned');
            } else if (entropy < 0.7) {
                keywords.push('medium_entropy', 'mixed_content', 'varied_data', 'balanced');
            } else if (entropy < 0.9) {
                keywords.push('high_entropy', 'diverse', 'complex', 'random_like');
            } else {
                keywords.push('very_high_entropy', 'encrypted', 'compressed', 'randomized');
            }

            keywords.push(`entropy_${Math.floor(entropy * 100)}_percent`);

            return keywords;
        },

        /**
         * Detect structural patterns
         */
        detectStructures(data) {
            const structures = [];
            const view = new Uint8Array(data);

            // Header detection
            if (view.length > 4) {
                const header = Array.from(view.slice(0, 4));
                structures.push({ type: 'header', data: header });
            }

            // Footer detection
            if (view.length > 8) {
                const footer = Array.from(view.slice(-4));
                structures.push({ type: 'footer', data: footer });
            }

            // Alignment detection
            const alignment = this.detectAlignment(view);
            if (alignment) {
                structures.push({ type: 'alignment', value: alignment });
            }

            return structures;
        },

        /**
         * Detect data alignment
         */
        detectAlignment(view) {
            const alignments = [2, 4, 8, 16, 32, 64];
            
            for (const align of alignments) {
                let aligned = true;
                for (let i = align; i < view.length; i += align) {
                    if (view[i] === 0 || view[i] === 0xFF) {
                        continue;
                    }
                    aligned = false;
                    break;
                }
                if (aligned) return align;
            }

            return null;
        },

        /**
         * Map structures to keywords
         */
        mapStructuresToKeywords(structures) {
            const keywords = [];

            structures.forEach(struct => {
                if (struct.type === 'header') {
                    keywords.push('has_header', 'structured_format', 'formatted_data');
                }
                if (struct.type === 'footer') {
                    keywords.push('has_footer', 'terminated_data', 'bounded_structure');
                }
                if (struct.type === 'alignment' && struct.value) {
                    keywords.push(`${struct.value}_byte_aligned`, 'memory_aligned', 'optimized_layout');
                }
            });

            return keywords;
        },

        /**
         * Get domain-specific keywords
         */
        getDomainKeywords(category) {
            const keywords = [];
            const categoryLower = category.toLowerCase();

            // Add from dictionaries
            if (categoryLower.includes('tech') || categoryLower.includes('code')) {
                keywords.push(...this.dictionaries.technology.slice(0, 100));
            }
            if (categoryLower.includes('data') || categoryLower.includes('science')) {
                keywords.push(...this.dictionaries.dataScience.slice(0, 100));
            }

            // Always add general keywords
            keywords.push(...this.dictionaries.general.slice(0, 150));

            return keywords;
        },

        /**
         * Expand context with synonyms and related terms
         */
        expandContext(keywords) {
            const expanded = new Set(keywords);

            if (this.config.useSynonyms) {
                keywords.forEach(keyword => {
                    const lower = keyword.toLowerCase();
                    if (this.synonyms[lower]) {
                        this.synonyms[lower].forEach(syn => expanded.add(syn));
                    }
                });
            }

            if (this.config.useNgrams) {
                const ngrams = this.generateNgrams(keywords);
                ngrams.forEach(ng => expanded.add(ng));
            }

            return Array.from(expanded);
        },

        /**
         * Generate n-grams from keywords
         */
        generateNgrams(keywords) {
            const ngrams = [];
            const [minN, maxN] = this.config.ngramRange;

            for (let n = minN; n <= maxN; n++) {
                for (let i = 0; i <= keywords.length - n; i++) {
                    const ngram = keywords.slice(i, i + n).join('_');
                    if (ngram.length >= this.config.minKeywordLength) {
                        ngrams.push(ngram);
                    }
                }
            }

            return ngrams;
        },

        /**
         * Filter and rank keywords
         */
        filterAndRank(keywords) {
            // Remove stop words
            const filtered = keywords.filter(kw => {
                const lower = kw.toLowerCase();
                return !this.dictionaries.stopWords.has(lower) && 
                       kw.length >= this.config.minKeywordLength;
            });

            // Remove duplicates (case-insensitive)
            const unique = [...new Set(filtered.map(k => k.toLowerCase()))];

            // Rank by relevance (simple scoring)
            const ranked = unique
                .map(kw => ({
                    keyword: kw,
                    score: this.scoreKeyword(kw)
                }))
                .sort((a, b) => b.score - a.score)
                .map(item => item.keyword);

            // Limit to max keywords
            return ranked.slice(0, this.config.maxKeywordsPerPattern);
        },

        /**
         * Score keyword relevance
         */
        scoreKeyword(keyword) {
            let score = 1.0;

            // Longer keywords are more specific
            score += Math.min(keyword.length / 20, 2.0);

            // Technical terms score higher
            if (this.dictionaries.technology.includes(keyword)) score += 2.0;
            if (this.dictionaries.dataScience.includes(keyword)) score += 2.0;

            // Compound keywords score higher
            if (keyword.includes('_')) score += 1.0;

            return score;
        },

        /**
         * Update configuration
         */
        setConfig(config) {
            Object.assign(this.config, config);
        },

        /**
         * Add custom dictionary
         */
        addDictionary(name, words) {
            this.dictionaries[name] = words;
        },

        /**
         * Add synonyms
         */
        addSynonyms(word, synonyms) {
            this.synonyms[word] = synonyms;
        }
    };

    // Export to window
    window.DynamicKeywordExtractor = DynamicKeywordExtractor;

    console.log('✅ Dynamic Keyword Extraction Library loaded');
    console.log(`📊 Total dictionary words: ${
        Object.values(DynamicKeywordExtractor.dictionaries)
            .filter(d => Array.isArray(d))
            .reduce((sum, d) => sum + d.length, 0)
    }`);

})();
