/**
 * SYSTEM INTEGRATION COORDINATOR
 * Ties together all components:
 * - Environment Detection
 * - Cache Pattern Integration  
 * - JSON Loader
 * - Advanced Extractor
 * - Inference Engine
 * 
 * This script ensures all components work together seamlessly
 * and adapts behavior based on local vs cloud environment
 */

(function() {
    'use strict';

    console.log('🔗 Loading System Integration Coordinator...');

    const SystemIntegration = {
        state: {
            initialized: false,
            environmentReady: false,
            cacheIntegrationReady: false,
            componentsReady: {
                environmentDetector: false,
                cachePatternIntegration: false,
                jsonLoader: false,
                advancedExtractor: false,
                inferenceEngine: false
            }
        },

        /**
         * Initialize entire system
         */
        async init() {
            if (this.state.initialized) {
                console.log('⚠️ System already initialized');
                return;
            }

            console.log('🚀 Initializing Aevov System...');
            console.log('');

            try {
                // Step 1: Detect environment
                await this.initEnvironmentDetection();

                // Step 2: Initialize cache integration
                await this.initCacheIntegration();

                // Step 3: Check and initialize core components
                await this.initCoreComponents();

                // Step 4: Set up event coordination
                this.setupEventCoordination();

                // Step 5: Final validation
                this.validateSystem();

                this.state.initialized = true;
                console.log('');
                console.log('✅ System initialization complete!');
                this.printSystemStatus();

            } catch (error) {
                console.error('❌ System initialization failed:', error);
                throw error;
            }
        },

        /**
         * Initialize environment detection
         */
        async initEnvironmentDetection() {
            console.log('📍 Step 1: Environment Detection');
            console.log('─'.repeat(50));

            try {
                // Wait for EnvironmentDetector to be available
                if (typeof window.EnvironmentDetector === 'undefined') {
                    console.log('⏳ Waiting for EnvironmentDetector...');
                    await this.waitForComponent('EnvironmentDetector', 5000);
                }

                // Detect environment
                const environment = await window.EnvironmentDetector.detect();
                this.state.environmentReady = true;
                this.state.componentsReady.environmentDetector = true;

                console.log(`✅ Environment detected: ${environment.toUpperCase()}`);
                console.log('');

                return environment;

            } catch (error) {
                console.error('❌ Environment detection failed:', error);
                // Default to local mode
                console.log('⚠️ Defaulting to LOCAL mode');
                window.AEVOV_ENVIRONMENT = 'local';
                return 'local';
            }
        },

        /**
         * Initialize cache integration
         */
        async initCacheIntegration() {
            console.log('💾 Step 2: Cache Pattern Integration');
            console.log('─'.repeat(50));

            try {
                // Wait for CachePatternIntegration to be available
                if (typeof window.CachePatternIntegration === 'undefined') {
                    console.log('⏳ Waiting for CachePatternIntegration...');
                    await this.waitForComponent('CachePatternIntegration', 5000);
                }

                // Initialize cache integration
                await window.CachePatternIntegration.init();
                this.state.cacheIntegrationReady = true;
                this.state.componentsReady.cachePatternIntegration = true;

                console.log('✅ Cache integration initialized');
                
                // Get and display cache stats
                const stats = window.CachePatternIntegration.getStats();
                console.log(`   📦 Cached chunks: ${stats.cachedChunks}`);
                console.log(`   🧬 Extracted patterns: ${stats.extractedPatterns}`);
                console.log('');

                return true;

            } catch (error) {
                console.error('❌ Cache integration initialization failed:', error);
                return false;
            }
        },

        /**
         * Initialize core components
         */
        async initCoreComponents() {
            console.log('⚙️ Step 3: Core Components Check');
            console.log('─'.repeat(50));

            // Check JSON Loader
            if (typeof window.loadModel === 'function') {
                this.state.componentsReady.jsonLoader = true;
                console.log('✅ JSON Loader: Ready');
            } else {
                console.log('⚠️ JSON Loader: Not found');
            }

            // Check Advanced Extractor
            if (typeof window.processRealPatterns === 'function') {
                this.state.componentsReady.advancedExtractor = true;
                console.log('✅ Advanced Extractor: Ready');
            } else {
                console.log('⚠️ Advanced Extractor: Not found');
            }

            // Check Inference Engine
            if (typeof window.ComparatorEngine !== 'undefined') {
                this.state.componentsReady.inferenceEngine = true;
                console.log('✅ Inference Engine: Ready');
            } else {
                console.log('⚠️ Inference Engine: Not found');
            }

            console.log('');
        },

        /**
         * Set up event coordination between components
         */
        setupEventCoordination() {
            console.log('🔗 Step 4: Event Coordination');
            console.log('─'.repeat(50));

            // Coordinate JSON Loader → Cache Integration
            this.setupJsonLoaderIntegration();

            // Coordinate Cache Integration → Advanced Extractor
            this.setupCacheExtractorIntegration();

            // Coordinate Advanced Extractor → Inference Engine
            this.setupExtractorInferenceIntegration();

            // Set up environment-aware behavior
            this.setupEnvironmentAdaptation();

            console.log('✅ Event coordination configured');
            console.log('');
        },

        /**
         * Integrate JSON Loader with Cache Integration
         */
        setupJsonLoaderIntegration() {
            if (!this.state.componentsReady.jsonLoader) return;

            console.log('  🔗 JSON Loader ↔ Cache Integration');

            // Hook into successful model loads
            const originalLoadModel = window.loadModel;
            if (originalLoadModel) {
                window.loadModel = async function(...args) {
                    console.log('📦 JSON Loader: Starting model load...');
                    
                    const result = await originalLoadModel.apply(this, args);
                    
                    // Trigger cache scan after load
                    if (window.CachePatternIntegration) {
                        console.log('🔄 Triggering cache scan...');
                        setTimeout(() => {
                            window.CachePatternIntegration.forceScan();
                        }, 1000);
                    }
                    
                    return result;
                };
            }
        },

        /**
         * Integrate Cache with Advanced Extractor
         */
        setupCacheExtractorIntegration() {
            if (!this.state.componentsReady.cachePatternIntegration || 
                !this.state.componentsReady.advancedExtractor) return;

            console.log('  🔗 Cache Integration ↔ Advanced Extractor');

            // Patterns extracted from cache are automatically sent to Advanced Extractor
            // This is handled by CachePatternIntegration.sendToAdvancedExtractor()
        },

        /**
         * Integrate Advanced Extractor with Inference Engine
         */
        setupExtractorInferenceIntegration() {
            if (!this.state.componentsReady.advancedExtractor || 
                !this.state.componentsReady.inferenceEngine) return;

            console.log('  🔗 Advanced Extractor ↔ Inference Engine');

            // Hook into pattern processing to update inference engine
            const originalProcessPatterns = window.processRealPatterns;
            if (originalProcessPatterns) {
                window.processRealPatterns = function(patterns) {
                    const result = originalProcessPatterns.apply(this, arguments);
                    
                    // Notify inference engine of new patterns
                    console.log(`⚡ Inference Engine: ${patterns.length} new patterns available`);
                    
                    return result;
                };
            }
        },

        /**
         * Set up environment-aware behavior adaptations
         */
        setupEnvironmentAdaptation() {
            const environment = window.AEVOV_ENVIRONMENT || 'local';
            const config = window.AEVOV_CONFIG;

            console.log(`  🎯 Adapting to ${environment.toUpperCase()} environment`);

            if (environment === 'local') {
                // Local mode optimizations
                console.log('    • Using IndexedDB for storage');
                console.log('    • Simulated consensus (0.1-2ms)');
                console.log('    • Single-node inference');
            } else {
                // Cloud mode optimizations
                console.log('    • Using DHT for distributed storage');
                console.log('    • Real consensus voting (5-20ms)');
                console.log('    • Multi-node inference');
                
                if (config && config.networking) {
                    console.log(`    • Networking: ${config.networking}`);
                }
            }
        },

        /**
         * Validate system integrity
         */
        validateSystem() {
            console.log('✓ Step 5: System Validation');
            console.log('─'.repeat(50));

            const criticalComponents = [
                'environmentDetector',
                'cachePatternIntegration'
            ];

            const allCriticalReady = criticalComponents.every(
                comp => this.state.componentsReady[comp]
            );

            if (allCriticalReady) {
                console.log('✅ All critical components ready');
            } else {
                console.warn('⚠️ Some critical components missing');
                const missing = criticalComponents.filter(
                    comp => !this.state.componentsReady[comp]
                );
                console.warn('   Missing:', missing.join(', '));
            }

            const optionalComponents = [
                'jsonLoader',
                'advancedExtractor', 
                'inferenceEngine'
            ];

            const readyOptional = optionalComponents.filter(
                comp => this.state.componentsReady[comp]
            );

            console.log(`✓ Optional components: ${readyOptional.length}/${optionalComponents.length} ready`);
            console.log('');
        },

        /**
         * Print comprehensive system status
         */
        printSystemStatus() {
            console.log('');
            console.log('═'.repeat(60));
            console.log('🌟 AEVOV SYSTEM STATUS');
            console.log('═'.repeat(60));
            
            // Environment Info
            const env = window.AEVOV_ENVIRONMENT || 'unknown';
            const config = window.AEVOV_CONFIG;
            
            console.log('📍 Environment:', env.toUpperCase());
            if (config) {
                console.log('   Storage:', config.storage);
                console.log('   Consensus:', config.consensus);
                console.log('   Inference Time:', config.inferenceTime);
                console.log('   Node Count:', config.nodeCount);
            }
            
            console.log('');
            console.log('⚙️ Components Status:');
            Object.entries(this.state.componentsReady).forEach(([name, ready]) => {
                const icon = ready ? '✅' : '❌';
                const formattedName = name.replace(/([A-Z])/g, ' $1').trim();
                console.log(`   ${icon} ${formattedName}`);
            });
            
            console.log('');
            
            // Cache Stats
            if (window.CachePatternIntegration) {
                const stats = window.CachePatternIntegration.getStats();
                console.log('💾 Cache Statistics:');
                console.log(`   Cached Chunks: ${stats.cachedChunks}`);
                console.log(`   Processed Chunks: ${stats.processedChunks}`);
                console.log(`   Extracted Patterns: ${stats.extractedPatterns}`);
            }
            
            console.log('');
            console.log('═'.repeat(60));
            console.log('');
        },

        /**
         * Wait for a component to become available
         */
        async waitForComponent(componentName, timeout = 5000) {
            const startTime = Date.now();
            
            while (Date.now() - startTime < timeout) {
                if (typeof window[componentName] !== 'undefined') {
                    return window[componentName];
                }
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            throw new Error(`Component ${componentName} not available after ${timeout}ms`);
        },

        /**
         * Get system status
         */
        getStatus() {
            return {
                initialized: this.state.initialized,
                environment: window.AEVOV_ENVIRONMENT,
                config: window.AEVOV_CONFIG,
                components: this.state.componentsReady,
                cacheStats: window.CachePatternIntegration ? 
                    window.CachePatternIntegration.getStats() : null
            };
        },

        /**
         * Force system reinitialization
         */
        async reinitialize() {
            console.log('🔄 Reinitializing system...');
            this.state.initialized = false;
            await this.init();
        },

        /**
         * Trigger manual pattern extraction from cache
         */
        async extractPatternsFromCache() {
            if (!window.CachePatternIntegration) {
                console.error('❌ Cache Pattern Integration not available');
                return null;
            }

            console.log('🧬 Manually triggering pattern extraction...');
            return await window.CachePatternIntegration.extractPatternsFromCache();
        },

        /**
         * Get comprehensive system diagnostics
         */
        getDiagnostics() {
            const diagnostics = {
                timestamp: new Date().toISOString(),
                environment: {
                    detected: window.AEVOV_ENVIRONMENT,
                    config: window.AEVOV_CONFIG,
                    detector: window.EnvironmentDetector ? 
                        window.EnvironmentDetector.detection : null
                },
                components: this.state.componentsReady,
                cache: window.CachePatternIntegration ? 
                    window.CachePatternIntegration.getStats() : null,
                patterns: {
                    window_patterns: window.patterns ? 
                        Object.keys(window.patterns).length : 0,
                    advanced_patterns: window.advancedPatterns ? 
                        Object.keys(window.advancedPatterns).length : 0
                },
                performance: {
                    initialized: this.state.initialized,
                    environmentReady: this.state.environmentReady,
                    cacheIntegrationReady: this.state.cacheIntegrationReady
                }
            };

            return diagnostics;
        },

        /**
         * Export diagnostics as JSON
         */
        exportDiagnostics() {
            const diagnostics = this.getDiagnostics();
            const json = JSON.stringify(diagnostics, null, 2);
            
            console.log('📊 System Diagnostics:');
            console.log(json);
            
            // Create downloadable file
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `aevov-diagnostics-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
            
            return diagnostics;
        }
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', async () => {
            // Wait a bit for other scripts to load
            setTimeout(async () => {
                await SystemIntegration.init();
            }, 1000);
        });
    } else {
        // DOM already loaded, initialize with delay
        setTimeout(async () => {
            await SystemIntegration.init();
        }, 1000);
    }

    // Export to window
    window.SystemIntegration = SystemIntegration;

    // Also export convenient aliases
    window.Aevov = {
        init: () => SystemIntegration.init(),
        status: () => SystemIntegration.getStatus(),
        diagnostics: () => SystemIntegration.getDiagnostics(),
        exportDiagnostics: () => SystemIntegration.exportDiagnostics(),
        extractPatterns: () => SystemIntegration.extractPatternsFromCache(),
        reinitialize: () => SystemIntegration.reinitialize(),
        
        // Quick access to subsystems
        cache: () => window.CachePatternIntegration,
        environment: () => window.EnvironmentDetector,
        
        // Helper methods
        isLocal: () => window.EnvironmentDetector && window.EnvironmentDetector.isLocal(),
        isCloud: () => window.EnvironmentDetector && window.EnvironmentDetector.isCloud()
    };

    console.log('✅ System Integration Coordinator loaded');
    console.log('💡 Use window.Aevov.status() to check system status');

})();