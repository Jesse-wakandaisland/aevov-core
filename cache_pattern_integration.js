/**
 * CACHE-PATTERN INTEGRATION SYSTEM
 * Automatically detects cached model chunks and extracts real patterns
 * Integrates with Advanced Extractor for hierarchical categorization
 * 
 * Usage: Include this script after your main system scripts
 * It will automatically hook into JSON Loader and pattern extraction
 */

(function() {
    'use strict';

    console.log('🔄 Loading Cache-Pattern Integration System...');

    const CachePatternIntegration = {
        config: {
            dbName: 'AevovModelCache',
            storeName: 'chunks',
            autoScanInterval: 30000, // 30 seconds
            minPatternsForExtraction: 100,
            batchSize: 10
        },

        state: {
            initialized: false,
            lastScanTime: null,
            cachedChunks: new Map(),
            extractedPatterns: new Map(),
            isProcessing: false
        },

        /**
         * Initialize the cache integration system
         */
        async init() {
            if (this.state.initialized) return;

            console.log('🔧 Initializing Cache-Pattern Integration...');

            try {
                // Connect to IndexedDB
                await this.connectDB();
                
                // Scan existing cache
                await this.scanCache();
                
                // Set up auto-scan
                this.startAutoScan();
                
                // Hook into JSON Loader events
                this.hookJsonLoader();
                
                this.state.initialized = true;
                console.log('✅ Cache-Pattern Integration initialized');
                
                return true;
            } catch (error) {
                console.error('❌ Failed to initialize:', error);
                return false;
            }
        },

        /**
         * Connect to IndexedDB cache database
         */
        async connectDB() {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(this.config.dbName, 1);

                request.onerror = () => reject(request.error);
                request.onsuccess = () => {
                    this.db = request.result;
                    resolve(this.db);
                };

                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains(this.config.storeName)) {
                        db.createObjectStore(this.config.storeName, { keyPath: 'url' });
                    }
                };
            });
        },

        /**
         * Scan cache for available chunks
         */
        async scanCache() {
            if (!this.db) await this.connectDB();

            console.log('🔍 Scanning cache for model chunks...');

            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction([this.config.storeName], 'readonly');
                const store = transaction.objectStore(this.config.storeName);
                const request = store.getAll();

                request.onsuccess = () => {
                    const chunks = request.result;
                    
                    chunks.forEach(chunk => {
                        this.state.cachedChunks.set(chunk.url, {
                            url: chunk.url,
                            data: chunk.data,
                            timestamp: chunk.timestamp,
                            metadata: chunk.metadata || {},
                            processed: false
                        });
                    });

                    console.log(`📦 Found ${chunks.length} cached chunks`);
                    this.state.lastScanTime = Date.now();
                    
                    // Auto-extract patterns if enough chunks available
                    if (chunks.length > 0) {
                        this.extractPatternsFromCache();
                    }
                    
                    resolve(chunks);
                };

                request.onerror = () => reject(request.error);
            });
        },

        /**
         * Extract real patterns from cached chunks
         */
        async extractPatternsFromCache() {
            if (this.state.isProcessing) {
                console.log('⏳ Pattern extraction already in progress...');
                return;
            }

            this.state.isProcessing = true;
            console.log('🧬 Starting pattern extraction from cached chunks...');

            try {
                const unprocessedChunks = Array.from(this.state.cachedChunks.values())
                    .filter(chunk => !chunk.processed);

                if (unprocessedChunks.length === 0) {
                    console.log('✅ All cached chunks already processed');
                    this.state.isProcessing = false;
                    return;
                }

                console.log(`📊 Processing ${unprocessedChunks.length} unprocessed chunks`);

                const allPatterns = [];
                
                // Process chunks in batches
                for (let i = 0; i < unprocessedChunks.length; i += this.config.batchSize) {
                    const batch = unprocessedChunks.slice(i, i + this.config.batchSize);
                    
                    console.log(`Processing batch ${Math.floor(i / this.config.batchSize) + 1}/${Math.ceil(unprocessedChunks.length / this.config.batchSize)}`);
                    
                    for (const chunk of batch) {
                        try {
                            const patterns = await this.extractPatternsFromChunk(chunk, i);
                            allPatterns.push(...patterns);
                            
                            // Mark as processed
                            chunk.processed = true;
                            this.state.cachedChunks.set(chunk.url, chunk);
                        } catch (error) {
                            console.warn(`Failed to extract patterns from chunk ${chunk.url}:`, error);
                        }
                    }
                    
                    // Small delay between batches
                    await new Promise(resolve => setTimeout(resolve, 100));
                }

                console.log(`✅ Extracted ${allPatterns.length} raw patterns from cache`);

                // Send to Advanced Extractor for categorization
                if (allPatterns.length > 0) {
                    await this.sendToAdvancedExtractor(allPatterns);
                }

                this.state.isProcessing = false;
                return allPatterns;

            } catch (error) {
                console.error('❌ Pattern extraction failed:', error);
                this.state.isProcessing = false;
                throw error;
            }
        },

        /**
         * Extract patterns from a single chunk using tensor analysis
         */
        async extractPatternsFromChunk(chunk, chunkIndex) {
            const patterns = [];

            try {
                // Convert chunk data to ArrayBuffer if needed
                let arrayBuffer;
                if (typeof chunk.data === 'string') {
                    // Base64 decode
                    const binaryString = atob(chunk.data);
                    arrayBuffer = new Uint8Array(binaryString.length);
                    for (let i = 0; i < binaryString.length; i++) {
                        arrayBuffer[i] = binaryString.charCodeAt(i);
                    }
                } else if (chunk.data instanceof ArrayBuffer) {
                    arrayBuffer = chunk.data;
                } else {
                    arrayBuffer = chunk.data.buffer || chunk.data;
                }

                const uint8Array = new Uint8Array(arrayBuffer);

                // Tensor analysis: byte frequency
                const byteFreq = this.analyzeByteFrequency(uint8Array);
                patterns.push(...this.generatePatternsFromFrequency(byteFreq, chunkIndex));

                // Tensor analysis: sequence detection
                const sequences = this.detectSequences(uint8Array);
                patterns.push(...this.generatePatternsFromSequences(sequences, chunkIndex));

                // Tensor analysis: structural markers
                const structures = this.detectStructures(uint8Array);
                patterns.push(...this.generatePatternsFromStructures(structures, chunkIndex));

                // Tensor analysis: entropy regions
                const entropyRegions = this.analyzeEntropy(uint8Array);
                patterns.push(...this.generatePatternsFromEntropy(entropyRegions, chunkIndex));

            } catch (error) {
                console.warn(`Error analyzing chunk ${chunkIndex}:`, error);
            }

            return patterns;
        },

        /**
         * Analyze byte frequency distribution
         */
        analyzeByteFrequency(uint8Array) {
            const freq = new Array(256).fill(0);
            for (let i = 0; i < uint8Array.length; i++) {
                freq[uint8Array[i]]++;
            }
            
            const total = uint8Array.length;
            const normalized = freq.map(f => f / total);
            
            return {
                raw: freq,
                normalized: normalized,
                entropy: this.calculateEntropy(normalized),
                dominant: freq.indexOf(Math.max(...freq))
            };
        },

        /**
         * Detect repeating sequences
         */
        detectSequences(uint8Array, minLength = 4, maxLength = 16) {
            const sequences = new Map();
            
            for (let len = minLength; len <= maxLength; len++) {
                for (let i = 0; i <= uint8Array.length - len; i++) {
                    const seq = Array.from(uint8Array.slice(i, i + len));
                    const key = seq.join(',');
                    sequences.set(key, (sequences.get(key) || 0) + 1);
                }
            }
            
            return Array.from(sequences.entries())
                .filter(([, count]) => count > 2)
                .map(([pattern, frequency]) => ({
                    pattern: pattern.split(',').map(Number),
                    frequency,
                    significance: frequency / uint8Array.length
                }))
                .sort((a, b) => b.significance - a.significance)
                .slice(0, 20);
        },

        /**
         * Detect structural patterns
         */
        detectStructures(uint8Array) {
            const structures = [];
            const windowSize = 256;
            
            for (let i = 0; i < uint8Array.length - windowSize; i += windowSize) {
                const window = uint8Array.slice(i, i + windowSize);
                const entropy = this.calculateEntropy(
                    Array.from(new Set(window)).map(
                        val => window.filter(v => v === val).length / windowSize
                    )
                );
                
                if (entropy > 0.7) {
                    structures.push({
                        type: 'high_entropy',
                        offset: i,
                        entropy: entropy
                    });
                } else if (entropy < 0.3) {
                    structures.push({
                        type: 'low_entropy',
                        offset: i,
                        entropy: entropy
                    });
                }
            }
            
            return structures;
        },

        /**
         * Analyze entropy regions
         */
        analyzeEntropy(uint8Array) {
            const regions = [];
            const windowSize = 128;
            
            for (let i = 0; i < uint8Array.length - windowSize; i += windowSize / 2) {
                const window = uint8Array.slice(i, i + windowSize);
                const uniqueBytes = new Set(window).size;
                const entropy = this.calculateEntropy(
                    Array.from(new Set(window)).map(
                        val => window.filter(v => v === val).length / windowSize
                    )
                );
                
                regions.push({
                    offset: i,
                    entropy: entropy,
                    uniqueBytes: uniqueBytes,
                    complexity: uniqueBytes / 256
                });
            }
            
            return regions;
        },

        /**
         * Calculate Shannon entropy
         */
        calculateEntropy(probabilities) {
            return -probabilities.reduce((sum, p) => {
                return p > 0 ? sum + p * Math.log2(p) : sum;
            }, 0);
        },

        /**
         * Generate patterns from byte frequency analysis
         */
        generatePatternsFromFrequency(freqData, chunkIndex) {
            const patterns = [];
            
            // High entropy pattern
            if (freqData.entropy > 0.85) {
                patterns.push({
                    id: `chunk${chunkIndex}_freq_high_entropy`,
                    type: 'frequency',
                    keywords: ['high_entropy', 'random_distribution', 'complex_data'],
                    confidence: Math.min(0.95, freqData.entropy),
                    sourceChunk: chunkIndex,
                    metadata: {
                        entropy: freqData.entropy,
                        dominantByte: freqData.dominant,
                        analysisType: 'byte_frequency'
                    }
                });
            }
            
            // Low entropy pattern
            if (freqData.entropy < 0.4) {
                patterns.push({
                    id: `chunk${chunkIndex}_freq_low_entropy`,
                    type: 'frequency',
                    keywords: ['low_entropy', 'structured_data', 'repetitive'],
                    confidence: 0.88,
                    sourceChunk: chunkIndex,
                    metadata: {
                        entropy: freqData.entropy,
                        dominantByte: freqData.dominant,
                        analysisType: 'byte_frequency'
                    }
                });
            }
            
            return patterns;
        },

        /**
         * Generate patterns from sequence analysis
         */
        generatePatternsFromSequences(sequences, chunkIndex) {
            return sequences.slice(0, 10).map((seq, idx) => ({
                id: `chunk${chunkIndex}_seq_${idx}`,
                type: 'sequence',
                keywords: ['repeating_sequence', 'pattern_detected', 'structural'],
                confidence: Math.min(0.95, 0.6 + seq.significance * 10),
                sourceChunk: chunkIndex,
                metadata: {
                    sequenceLength: seq.pattern.length,
                    frequency: seq.frequency,
                    significance: seq.significance,
                    analysisType: 'sequence_detection'
                }
            }));
        },

        /**
         * Generate patterns from structural analysis
         */
        generatePatternsFromStructures(structures, chunkIndex) {
            return structures.map((struct, idx) => ({
                id: `chunk${chunkIndex}_struct_${idx}`,
                type: 'structure',
                keywords: [struct.type, 'structural_marker', 'entropy_region'],
                confidence: 0.85,
                sourceChunk: chunkIndex,
                metadata: {
                    structureType: struct.type,
                    entropy: struct.entropy,
                    offset: struct.offset,
                    analysisType: 'structural_detection'
                }
            }));
        },

        /**
         * Generate patterns from entropy analysis
         */
        generatePatternsFromEntropy(entropyRegions, chunkIndex) {
            return entropyRegions
                .filter(region => region.entropy > 0.8 || region.entropy < 0.3)
                .map((region, idx) => ({
                    id: `chunk${chunkIndex}_entropy_${idx}`,
                    type: 'entropy',
                    keywords: [
                        region.entropy > 0.8 ? 'high_complexity' : 'low_complexity',
                        'entropy_analysis',
                        'data_region'
                    ],
                    confidence: 0.82,
                    sourceChunk: chunkIndex,
                    metadata: {
                        entropy: region.entropy,
                        uniqueBytes: region.uniqueBytes,
                        complexity: region.complexity,
                        offset: region.offset,
                        analysisType: 'entropy_analysis'
                    }
                }));
        },

        /**
         * Send extracted patterns to Advanced Extractor
         */
        async sendToAdvancedExtractor(patterns) {
            console.log('📤 Sending patterns to Advanced Extractor...');

            try {
                // Check if Advanced Extractor is available
                if (typeof window.processRealPatterns === 'function') {
                    const categorized = window.processRealPatterns(patterns);
                    console.log('✅ Patterns processed by Advanced Extractor');
                    
                    // Store in local state
                    patterns.forEach(pattern => {
                        this.state.extractedPatterns.set(pattern.id, pattern);
                    });
                    
                    return categorized;
                } else {
                    console.warn('⚠️ Advanced Extractor not available, storing patterns locally');
                    
                    // Store patterns anyway
                    patterns.forEach(pattern => {
                        this.state.extractedPatterns.set(pattern.id, pattern);
                    });
                    
                    return patterns;
                }
            } catch (error) {
                console.error('❌ Failed to send to Advanced Extractor:', error);
                throw error;
            }
        },

        /**
         * Hook into JSON Loader events
         */
        hookJsonLoader() {
            console.log('🔗 Hooking into JSON Loader...');

            // Monitor for new chunks being added to cache
            if (this.db) {
                const transaction = this.db.transaction([this.config.storeName], 'readwrite');
                const store = transaction.objectStore(this.config.storeName);
                
                // Set up listener for cache updates
                store.onsuccess = () => {
                    console.log('📦 New chunk detected in cache');
                    this.scanCache();
                };
            }

            // Hook into window events if JSON Loader exposes them
            if (window.addEventListener) {
                window.addEventListener('aevov:chunkCached', async (event) => {
                    console.log('📦 Chunk cached event received');
                    await this.scanCache();
                });

                window.addEventListener('aevov:loadComplete', async (event) => {
                    console.log('✅ Load complete event received');
                    await this.scanCache();
                });
            }
        },

        /**
         * Start automatic cache scanning
         */
        startAutoScan() {
            console.log(`⏰ Starting auto-scan every ${this.config.autoScanInterval / 1000}s`);
            
            setInterval(async () => {
                if (!this.state.isProcessing) {
                    await this.scanCache();
                }
            }, this.config.autoScanInterval);
        },

        /**
         * Get statistics
         */
        getStats() {
            return {
                cachedChunks: this.state.cachedChunks.size,
                extractedPatterns: this.state.extractedPatterns.size,
                processedChunks: Array.from(this.state.cachedChunks.values())
                    .filter(c => c.processed).length,
                isProcessing: this.state.isProcessing,
                lastScanTime: this.state.lastScanTime
            };
        },

        /**
         * Force immediate scan and extraction
         */
        async forceScan() {
            console.log('🔄 Force scanning cache...');
            await this.scanCache();
        }
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            CachePatternIntegration.init();
        });
    } else {
        CachePatternIntegration.init();
    }

    // Export to window
    window.CachePatternIntegration = CachePatternIntegration;

    console.log('✅ Cache-Pattern Integration System loaded');

})();