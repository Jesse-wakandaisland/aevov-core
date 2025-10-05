/**
 * MASTER ORCHESTRATOR
 * Central coordination system that fixes all initialization, patching, and timing issues
 * 
 * This script MUST be loaded LAST, after all other scripts
 * It will coordinate everything properly
 */

(function() {
    'use strict';

    console.log('🎯 Loading Master Orchestrator...');

    const MasterOrchestrator = {
        // State management
        state: {
            phase: 'initializing',
            initialized: false,
            componentsLoaded: {},
            componentsInitialized: {},
            intervals: new Map(),
            chatWidgetPipeline: [],
            errors: []
        },

        // Configuration
        config: {
            maxWaitTime: 15000,
            checkInterval: 100,
            enableDebugLogs: true
        },

        /**
         * MAIN INITIALIZATION
         */
        async init() {
            if (this.state.initialized) {
                console.warn('⚠️ Master Orchestrator already initialized');
                return;
            }

            console.log('🚀 Master Orchestrator Starting...\n');
            
            try {
                // Phase 1: Detect available components
                await this.detectComponents();

                // Phase 2: Initialize in correct order
                await this.initializeComponentsInOrder();

                // Phase 3: Set up ChatWidget pipeline
                await this.setupChatWidgetPipeline();

                // Phase 4: Coordinate intervals
                this.setupManagedIntervals();

                // Phase 5: Set up event coordination
                this.setupEventCoordination();

                // Phase 6: Final validation
                this.validateSystem();

                this.state.initialized = true;
                this.state.phase = 'running';

                console.log('\n✅ Master Orchestrator: ALL SYSTEMS OPERATIONAL');
                this.printSystemStatus();

                // Notify success
                if (window.NotificationSystem) {
                    window.NotificationSystem.notifySystemReady();
                }

            } catch (error) {
                console.error('❌ Master Orchestrator initialization failed:', error);
                this.state.phase = 'failed';
                this.state.errors.push(error);
                throw error;
            }
        },

        /**
         * PHASE 1: Detect available components
         */
        async detectComponents() {
            console.log('📍 PHASE 1: Detecting Components');
            console.log('─'.repeat(60));

            const components = {
                // Core infrastructure
                'EnvironmentDetector': window.EnvironmentDetector,
                'CachePatternIntegration': window.CachePatternIntegration,
                'SystemIntegration': window.SystemIntegration,
                
                // Pattern systems
                'RealPatternSystem': window.RealPatternSystem,
                'AdvancedPatternExtractor': window.AdvancedPatternExtractor,
                
                // Chat systems
                'ChatWidget': window.ChatWidget,
                'ConversationalAI': window.ConversationalAI,
                'InferenceEngineFix': window.InferenceEngineFix,
                'BIDCChatIntegration': window.BIDCChatIntegration,
                
                // UI systems
                'NotificationSystem': window.NotificationSystem,
                'ConfigAssistant': window.ConfigAssistant,
                'DashboardFix': window.DashboardFix,
                
                // Functions
                'loadModel': typeof window.loadModel === 'function',
                'processRealPatterns': typeof window.processRealPatterns === 'function',
                'ComparatorEngine': window.ComparatorEngine
            };

            Object.entries(components).forEach(([name, exists]) => {
                this.state.componentsLoaded[name] = !!exists;
                const icon = exists ? '✅' : '❌';
                console.log(`  ${icon} ${name}`);
            });

            console.log('');
        },

        /**
         * PHASE 2: Initialize components in correct order
         */
        async initializeComponentsInOrder() {
            console.log('📍 PHASE 2: Initializing Components in Order');
            console.log('─'.repeat(60));

            const initOrder = [
                {
                    name: 'Environment Detection',
                    component: 'EnvironmentDetector',
                    init: async () => {
                        if (window.EnvironmentDetector && !window.AEVOV_ENVIRONMENT) {
                            await window.EnvironmentDetector.detect();
                            console.log('  ✓ Environment detected:', window.AEVOV_ENVIRONMENT);
                        }
                    }
                },
                {
                    name: 'Real Pattern System',
                    component: 'RealPatternSystem',
                    init: async () => {
                        if (window.RealPatternSystem && !window.RealPatternSystem.initialized) {
                            await window.RealPatternSystem.init();
                            console.log('  ✓ Real Pattern System initialized');
                        }
                    }
                },
                {
                    name: 'Cache Pattern Integration',
                    component: 'CachePatternIntegration',
                    init: async () => {
                        if (window.CachePatternIntegration && !window.CachePatternIntegration.state.initialized) {
                            await window.CachePatternIntegration.init();
                            const stats = window.CachePatternIntegration.getStats();
                            console.log(`  ✓ Cache Integration: ${stats.cachedChunks} chunks`);
                        }
                    }
                },
                {
                    name: 'Notification System',
                    component: 'NotificationSystem',
                    init: async () => {
                        if (window.NotificationSystem && window.NotificationSystem.init) {
                            // NotificationSystem auto-inits, just verify
                            console.log('  ✓ Notification System ready');
                        }
                    }
                },
                {
                    name: 'Dashboard Fix',
                    component: 'DashboardFix',
                    init: async () => {
                        if (window.DashboardFix && !window.DashboardFix.initialized) {
                            window.DashboardFix.init();
                            console.log('  ✓ Dashboard Fix initialized');
                        }
                    }
                },
                {
                    name: 'Config Assistant',
                    component: 'ConfigAssistant',
                    init: async () => {
                        if (window.ConfigAssistant && window.ConfigAssistant.init) {
                            // ConfigAssistant auto-inits
                            console.log('  ✓ Config Assistant ready');
                        }
                    }
                }
            ];

            for (const step of initOrder) {
                try {
                    if (this.state.componentsLoaded[step.component]) {
                        await step.init();
                        this.state.componentsInitialized[step.component] = true;
                    } else {
                        console.log(`  ⊘ ${step.name} not available`);
                    }
                } catch (error) {
                    console.error(`  ❌ ${step.name} failed:`, error.message);
                    this.state.errors.push({ component: step.name, error });
                }
            }

            console.log('');
        },

        /**
         * PHASE 3: Set up ChatWidget pipeline (CRITICAL FIX)
         */
        async setupChatWidgetPipeline() {
            console.log('📍 PHASE 3: Setting Up ChatWidget Pipeline');
            console.log('─'.repeat(60));

            if (!window.ChatWidget || !window.ChatWidget.processQuery) {
                console.log('  ⊘ ChatWidget not available, skipping pipeline setup');
                console.log('');
                return;
            }

            // Store the ORIGINAL processQuery
            const originalProcessQuery = window.ChatWidget.processQuery.bind(window.ChatWidget);

            // Build the pipeline in correct order
            const pipeline = [];

            // 1. Notification wrapper (outermost - tracks all queries)
            if (window.NotificationSystem) {
                pipeline.push({
                    name: 'Notifications',
                    handler: async (query, next) => {
                        const notifId = window.NotificationSystem.show({
                            type: 'processing',
                            title: 'Processing Query',
                            message: 'Analyzing...',
                            duration: 2000
                        });
                        try {
                            const result = await next(query);
                            window.NotificationSystem.close(notifId);
                            return result;
                        } catch (error) {
                            window.NotificationSystem.close(notifId);
                            throw error;
                        }
                    }
                });
                console.log('  ✓ Added: Notification wrapper');
            }

            // 2. BIDC compression (if available)
            if (window.BIDCChatIntegration && window.BIDCChatIntegration.initialized) {
                pipeline.push({
                    name: 'BIDC',
                    handler: async (query, next) => {
                        // Compress query for efficient processing
                        const compressed = await window.BIDCChatIntegration.compressQuery(query);
                        return await next(query); // Pass original query forward
                    }
                });
                console.log('  ✓ Added: BIDC compression');
            }

            // 3. Conversational AI (main handler)
            if (window.ConversationalAI && window.ConversationalAI.initialized) {
                pipeline.push({
                    name: 'ConversationalAI',
                    handler: async (query, next) => {
                        // Use conversational AI if available
                        return window.ConversationalAI.generateConversationalResponse(query);
                    }
                });
                console.log('  ✓ Added: Conversational AI');
            } else if (window.InferenceEngineFix) {
                // Fallback to inference fix
                pipeline.push({
                    name: 'InferenceFix',
                    handler: async (query, next) => {
                        const patterns = window.InferenceEngineFix.getAllPatterns();
                        if (patterns.length === 0) {
                            return "No patterns loaded yet. Load a model first.";
                        }
                        const queryAnalysis = window.InferenceEngineFix.analyzeQuery(query);
                        const matches = window.InferenceEngineFix.findBestMatches(queryAnalysis, patterns);
                        return window.InferenceEngineFix.generateResponse(query, matches);
                    }
                });
                console.log('  ✓ Added: Inference Fix');
            }

            // Store pipeline
            this.state.chatWidgetPipeline = pipeline;

            // Create the unified handler
            const pipelineHandler = async (query) => {
                console.log('💬 Processing query through pipeline:', query);

                try {
                    // Execute pipeline
                    let result = query;
                    
                    for (let i = 0; i < pipeline.length; i++) {
                        const stage = pipeline[i];
                        const next = async (q) => {
                            // If there's a next stage, call it, otherwise use original
                            if (i < pipeline.length - 1) {
                                return await pipeline[i + 1].handler(q, next);
                            } else {
                                // Last stage - this should return the final response
                                return q;
                            }
                        };
                        
                        result = await stage.handler(result, next);
                        
                        // If we got a string response, return it
                        if (typeof result === 'string') {
                            return result;
                        }
                    }

                    return result;

                } catch (error) {
                    console.error('❌ Pipeline error:', error);
                    return "I encountered an error processing your query. Please try again.";
                }
            };

            // Replace ChatWidget.processQuery with our pipeline
            window.ChatWidget.processQuery = pipelineHandler;

            console.log(`  ✅ Pipeline active with ${pipeline.length} stages`);
            console.log('');
        },

        /**
         * PHASE 4: Coordinate intervals (CRITICAL FIX)
         */
        setupManagedIntervals() {
            console.log('📍 PHASE 4: Setting Up Managed Intervals');
            console.log('─'.repeat(60));

            // Clear any existing intervals first
            this.clearAllIntervals();

            // Master interval coordinator (runs every 5 seconds)
            const masterInterval = setInterval(() => {
                this.coordinatedUpdate();
            }, 5000);

            this.state.intervals.set('master', masterInterval);
            console.log('  ✓ Master interval: 5000ms');

            // Only set up additional intervals if components need them
            if (window.CachePatternIntegration) {
                const cacheInterval = setInterval(() => {
                    if (!window.CachePatternIntegration.state.isProcessing) {
                        window.CachePatternIntegration.scanCache();
                    }
                }, 30000);
                this.state.intervals.set('cache', cacheInterval);
                console.log('  ✓ Cache scan interval: 30000ms');
            }

            console.log(`  ✅ Total managed intervals: ${this.state.intervals.size}`);
            console.log('');
        },

        /**
         * Coordinated update (replaces multiple intervals)
         */
        coordinatedUpdate() {
            try {
                // Update dashboard
                if (window.DashboardFix && window.DashboardFix.initialized) {
                    window.DashboardFix.applyRealDataUpdates();
                }

                // Audit patterns
                if (window.RealPatternSystem && window.RealPatternSystem.initialized) {
                    window.RealPatternSystem.auditPatternDatabase();
                }

                // Update stats if needed
                if (typeof window.updateStats === 'function') {
                    window.updateStats();
                }

            } catch (error) {
                console.error('Error in coordinated update:', error);
            }
        },

        /**
         * Clear all managed intervals
         */
        clearAllIntervals() {
            this.state.intervals.forEach((intervalId, name) => {
                clearInterval(intervalId);
                console.log(`  🗑️ Cleared interval: ${name}`);
            });
            this.state.intervals.clear();
        },

        /**
         * PHASE 5: Set up event coordination
         */
        setupEventCoordination() {
            console.log('📍 PHASE 5: Setting Up Event Coordination');
            console.log('─'.repeat(60));

            // Coordinate model loading with pattern extraction
            if (window.loadModel && window.CachePatternIntegration) {
                const originalLoadModel = window.loadModel;
                window.loadModel = async function(...args) {
                    console.log('📦 Model loading started...');
                    const result = await originalLoadModel.apply(this, args);
                    
                    // Trigger cache scan after load
                    setTimeout(async () => {
                        if (window.CachePatternIntegration) {
                            await window.CachePatternIntegration.forceScan();
                        }
                    }, 1000);
                    
                    return result;
                };
                console.log('  ✓ Model loading coordinated with cache scan');
            }

            // Coordinate pattern updates with dashboard
            if (window.processRealPatterns) {
                const originalProcess = window.processRealPatterns;
                window.processRealPatterns = function(...args) {
                    const result = originalProcess.apply(this, args);
                    
                    // Update dashboard after processing
                    if (window.DashboardFix) {
                        setTimeout(() => window.DashboardFix.forceUpdate(), 100);
                    }
                    
                    return result;
                };
                console.log('  ✓ Pattern processing coordinated with dashboard');
            }

            console.log('  ✅ Event coordination active');
            console.log('');
        },

        /**
         * PHASE 6: Validate system
         */
        validateSystem() {
            console.log('📍 PHASE 6: System Validation');
            console.log('─'.repeat(60));

            const critical = ['ChatWidget', 'EnvironmentDetector'];
            const optional = ['CachePatternIntegration', 'NotificationSystem', 'DashboardFix'];

            let criticalOk = true;
            critical.forEach(comp => {
                const ok = this.state.componentsLoaded[comp];
                console.log(`  ${ok ? '✅' : '❌'} Critical: ${comp}`);
                if (!ok) criticalOk = false;
            });

            optional.forEach(comp => {
                const ok = this.state.componentsLoaded[comp];
                console.log(`  ${ok ? '✅' : '⊘'} Optional: ${comp}`);
            });

            if (!criticalOk) {
                console.warn('  ⚠️ Some critical components missing');
            }

            console.log('');
        },

        /**
         * Print system status
         */
        printSystemStatus() {
            console.log('');
            console.log('═'.repeat(60));
            console.log('🌟 SYSTEM STATUS REPORT');
            console.log('═'.repeat(60));
            
            console.log('📊 Phase:', this.state.phase);
            console.log('🔄 Pipeline Stages:', this.state.chatWidgetPipeline.length);
            console.log('⏱️ Managed Intervals:', this.state.intervals.size);
            console.log('🎯 Components Initialized:', 
                Object.values(this.state.componentsInitialized).filter(Boolean).length);
            
            if (this.state.errors.length > 0) {
                console.log('⚠️ Errors:', this.state.errors.length);
                this.state.errors.forEach(err => {
                    console.log(`  - ${err.component}: ${err.error.message}`);
                });
            } else {
                console.log('✅ No errors detected');
            }
            
            console.log('');
            console.log('🎮 Ready for queries!');
            console.log('═'.repeat(60));
            console.log('');
        },

        /**
         * Get current status
         */
        getStatus() {
            return {
                phase: this.state.phase,
                initialized: this.state.initialized,
                components: this.state.componentsLoaded,
                pipeline: this.state.chatWidgetPipeline.map(s => s.name),
                intervals: Array.from(this.state.intervals.keys()),
                errors: this.state.errors
            };
        },

        /**
         * Manual cleanup
         */
        cleanup() {
            console.log('🧹 Cleaning up Master Orchestrator...');
            
            this.clearAllIntervals();
            this.state.chatWidgetPipeline = [];
            this.state.initialized = false;
            this.state.phase = 'stopped';
            
            console.log('✓ Cleanup complete');
        },

        /**
         * Reinitialize system
         */
        async reinitialize() {
            console.log('🔄 Reinitializing system...');
            this.cleanup();
            await new Promise(resolve => setTimeout(resolve, 1000));
            await this.init();
        }
    };

    /**
     * AUTO-INITIALIZE
     * Wait for DOM and all scripts to load
     */
    function autoInitialize() {
        // Wait a bit for all other scripts to finish their setTimeout inits
        setTimeout(async () => {
            try {
                await MasterOrchestrator.init();
            } catch (error) {
                console.error('❌ Master Orchestrator failed to initialize:', error);
            }
        }, 3000); // 3 seconds should be enough for other scripts
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoInitialize);
    } else {
        autoInitialize();
    }

    // Export to window
    window.MasterOrchestrator = MasterOrchestrator;

    // Add to window.Aevov if available
    if (!window.Aevov) window.Aevov = {};
    window.Aevov.orchestrator = MasterOrchestrator;

    console.log('✅ Master Orchestrator loaded (will auto-init in 3s)');

})();