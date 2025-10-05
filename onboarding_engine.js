/**
 * AEVOV ONBOARDING ENGINE
 * Comprehensive multi-workflow onboarding system
 * Integrates with workflow tester for end-goal validation
 * 
 * Features:
 * - Multiple workflow paths (Pattern Extraction, Model Evolution, Streaming, etc.)
 * - Step-by-step guidance with validation
 * - Progress tracking and saving
 * - Integration with existing systems
 * - Visual feedback and tooltips
 * - Keyboard shortcuts support
 */

(function() {
    'use strict';

    console.log('🎓 Loading AEVOV Onboarding Engine...');

    const OnboardingEngine = {
        // Configuration
        config: {
            enabled: true,
            showWelcomeOnFirstVisit: true,
            saveProgress: true,
            validateSteps: true,
            tooltipDelay: 500
        },

        // State
        state: {
            initialized: false,
            currentWorkflow: null,
            currentStep: 0,
            completedWorkflows: [],
            userProgress: {},
            isActive: false
        },

        // Workflows definition
        workflows: {
            'getting_started': {
                id: 'getting_started',
                name: 'Getting Started with AEVOV',
                description: 'Learn the basics of the AEVOV Pattern System',
                estimatedTime: '5 minutes',
                icon: '🚀',
                steps: [
                    {
                        id: 'welcome',
                        title: 'Welcome to AEVOV',
                        description: 'AEVOV is an advanced pattern evolution and reasoning system',
                        action: 'continue',
                        validate: () => true
                    },
                    {
                        id: 'understand_architecture',
                        title: 'Understanding the Architecture',
                        description: 'AEVOV uses ARMsquare (Aevov Reasoning Multidimensional Model) with Goldilocks validation',
                        target: '#architect',
                        highlight: true,
                        action: 'click_tab',
                        validate: () => document.querySelector('#architect.active') !== null
                    },
                    {
                        id: 'explore_neuro_architect',
                        title: 'Explore Neuro Architect',
                        description: 'The Neuro Architect synthesizes patterns into .aev models',
                        target: '#neuroArchitectSection',
                        highlight: true,
                        scrollTo: true,
                        action: 'continue',
                        validate: () => true
                    },
                    {
                        id: 'keyboard_shortcuts',
                        title: 'Master Keyboard Shortcuts',
                        description: 'Press Ctrl+Shift+N to open NLP popup, Ctrl+Shift+P for Pattern Generator',
                        action: 'test_shortcut',
                        validate: () => this.state.shortcutTested
                    }
                ]
            },

            'pattern_extraction': {
                id: 'pattern_extraction',
                name: 'Pattern Extraction Workflow',
                description: 'Extract and store patterns from categories',
                estimatedTime: '10 minutes',
                icon: '🔍',
                prerequisite: 'getting_started',
                steps: [
                    {
                        id: 'open_advanced_extractor',
                        title: 'Open Advanced Extractor',
                        description: 'Navigate to the Advanced Extractor tab',
                        target: '#extractorTab',
                        highlight: true,
                        action: 'click',
                        validate: () => document.querySelector('#extractor.active') !== null
                    },
                    {
                        id: 'select_category',
                        title: 'Select a Category',
                        description: 'Choose a domain (e.g., Technology, Web Development)',
                        target: '#categorySelect',
                        highlight: true,
                        action: 'select',
                        validate: () => document.getElementById('categorySelect')?.value !== ''
                    },
                    {
                        id: 'select_subcategory',
                        title: 'Select Subcategory',
                        description: 'Choose a specific subcategory to extract patterns from',
                        target: '#subcategorySelect',
                        highlight: true,
                        action: 'select',
                        validate: () => document.getElementById('subcategorySelect')?.value !== ''
                    },
                    {
                        id: 'extract_patterns',
                        title: 'Extract Patterns',
                        description: 'Click "Extract Patterns" to generate patterns with WordNet uniqueness',
                        target: '#extractPatternsBtn',
                        highlight: true,
                        action: 'click',
                        validate: () => window.extractionComplete === true
                    },
                    {
                        id: 'verify_uniqueness',
                        title: 'Verify Keyword Uniqueness',
                        description: 'Check the diagnostics to ensure high uniqueness score (>85%)',
                        action: 'check_diagnostics',
                        validate: () => {
                            const score = window.WordNetUniquenessEngine?.state?.uniquenessScore || 0;
                            return score > 0.85;
                        }
                    },
                    {
                        id: 'import_to_evolution',
                        title: 'Import to Pattern Evolution Lab',
                        description: 'Use the "Import to Evolution Lab" button to prepare for model creation',
                        target: '#importToEvolutionBtn',
                        highlight: true,
                        action: 'click',
                        validate: () => window.patternsImportedToEvolution === true
                    }
                ]
            },

            'model_evolution': {
                id: 'model_evolution',
                name: 'Model Evolution & .aev Creation',
                description: 'Evolve patterns and create .aev models',
                estimatedTime: '15 minutes',
                icon: '🧬',
                prerequisite: 'pattern_extraction',
                steps: [
                    {
                        id: 'open_pattern_evolution',
                        title: 'Open Pattern Evolution Lab',
                        description: 'Navigate to the Pattern Evolution section in Neuro Architect',
                        target: '#patternEvolutionSection',
                        highlight: true,
                        scrollTo: true,
                        action: 'continue',
                        validate: () => true
                    },
                    {
                        id: 'select_strategy',
                        title: 'Choose Evolution Strategy',
                        description: 'Select: Similarity, Genetic, Hybrid (recommended), or Radical',
                        target: '#evolutionStrategy',
                        highlight: true,
                        action: 'select',
                        validate: () => document.getElementById('evolutionStrategy')?.value !== ''
                    },
                    {
                        id: 'configure_armsquare',
                        title: 'Enable ARMsquare Reasoning',
                        description: 'Enable ARMsquare for 5-dimensional reasoning validation',
                        target: '#armsquareEnabled',
                        highlight: true,
                        action: 'checkbox',
                        validate: () => document.getElementById('armsquareEnabled')?.checked === true
                    },
                    {
                        id: 'set_domains',
                        title: 'Select Target Domains',
                        description: 'Choose which domains to include in the evolved model',
                        target: '#targetDomains',
                        highlight: true,
                        action: 'multiselect',
                        validate: () => {
                            const select = document.getElementById('targetDomains');
                            return select && select.selectedOptions.length > 0;
                        }
                    },
                    {
                        id: 'start_evolution',
                        title: 'Start Pattern Evolution',
                        description: 'Click "Start Pattern Evolution" to create your .aev model',
                        target: '#startEvolutionBtn',
                        highlight: true,
                        action: 'click',
                        validate: () => window.evolutionComplete === true
                    },
                    {
                        id: 'download_aev',
                        title: 'Download .aev Model',
                        description: 'Your evolved model is ready! Download the .aev file',
                        target: '#downloadAevBtn',
                        highlight: true,
                        action: 'click',
                        validate: () => window.aevDownloaded === true
                    }
                ]
            },

            'cubbit_integration': {
                id: 'cubbit_integration',
                name: 'Cubbit Cloud Integration',
                description: 'Connect to Cubbit and manage cloud storage',
                estimatedTime: '8 minutes',
                icon: '☁️',
                steps: [
                    {
                        id: 'open_cubbit_manager',
                        title: 'Open Cubbit Manager',
                        description: 'Navigate to Cubbit Cloud Manager in Neuro Architect',
                        target: '#cubbitManagerSection',
                        highlight: true,
                        scrollTo: true,
                        action: 'continue',
                        validate: () => true
                    },
                    {
                        id: 'enter_credentials',
                        title: 'Enter Cubbit Credentials',
                        description: 'Enter your Cubbit Access Key, Secret Key, and Bucket Name',
                        target: '#cubbitAccessKey',
                        highlight: true,
                        action: 'input',
                        validate: () => {
                            const ak = document.getElementById('cubbitAccessKey')?.value;
                            const sk = document.getElementById('cubbitSecretKey')?.value;
                            const bucket = document.getElementById('cubbitBucket')?.value;
                            return ak && sk && bucket;
                        }
                    },
                    {
                        id: 'connect_cubbit',
                        title: 'Connect to Cubbit',
                        description: 'Click "Connect" to establish connection',
                        target: '#connectCubbitBtn',
                        highlight: true,
                        action: 'click',
                        validate: () => window.CubbitManager?.state?.connected === true
                    },
                    {
                        id: 'bulk_operations',
                        title: 'Learn Bulk Operations',
                        description: 'Use bulk permissions, bulk copy URLs, and bulk delete features',
                        target: '#bulkOperationsBtn',
                        highlight: true,
                        action: 'click',
                        validate: () => window.bulkDialogOpened === true
                    },
                    {
                        id: 'chunk_registry_import',
                        title: 'Import to Chunk Registry',
                        description: 'After bulk copying URLs, import them to Chunk Registry for Neuro Architect',
                        target: '#importToChunkRegistryBtn',
                        highlight: true,
                        action: 'click',
                        validate: () => window.chunksImported === true
                    }
                ]
            },

            'video_streaming': {
                id: 'video_streaming',
                name: 'Aevmer Streamer Setup',
                description: 'Configure video streaming with Aevmer Streamer Engine',
                estimatedTime: '12 minutes',
                icon: '🎥',
                steps: [
                    {
                        id: 'understand_aevmer',
                        title: 'Understanding Aevmer Streamer',
                        description: 'Aevmer Streamer uses web workers for optimized video chunk processing',
                        action: 'continue',
                        validate: () => true
                    },
                    {
                        id: 'open_streamer_interface',
                        title: 'Open Aevmer Streamer',
                        description: 'Press Ctrl+Shift+V or click the dock icon',
                        action: 'open_interface',
                        validate: () => window.AevmerStreamer?.state?.interfaceOpen === true
                    },
                    {
                        id: 'configure_model',
                        title: 'Configure Video Model',
                        description: 'Select the .aev model to use for video processing',
                        target: '#streamerModelSelect',
                        highlight: true,
                        action: 'select',
                        validate: () => document.getElementById('streamerModelSelect')?.value !== ''
                    },
                    {
                        id: 'test_streaming',
                        title: 'Test Streaming',
                        description: 'Upload a test video to verify the streaming pipeline',
                        target: '#streamerVideoInput',
                        highlight: true,
                        action: 'file_upload',
                        validate: () => window.testVideoUploaded === true
                    }
                ]
            },

            'database_setup': {
                id: 'database_setup',
                name: 'Database Integration',
                description: 'Set up PGLite and Electric SQL for distributed sync',
                estimatedTime: '10 minutes',
                icon: '🗄️',
                steps: [
                    {
                        id: 'open_database',
                        title: 'Open Database Manager',
                        description: 'Press Ctrl+Shift+B to open the database popup',
                        action: 'keyboard',
                        validate: () => window.DatabasePopup?.isOpen === true
                    },
                    {
                        id: 'verify_pglite',
                        title: 'Verify PGLite Connection',
                        description: 'Check that PGLite is active (green status)',
                        action: 'check_status',
                        validate: () => window.AevovDB?.state?.pglite !== null
                    },
                    {
                        id: 'enable_compression',
                        title: 'Enable LiteSpeed Compression',
                        description: 'Turn on LiteSpeed compression for optimal storage',
                        target: '#litespeedEnabled',
                        highlight: true,
                        action: 'checkbox',
                        validate: () => window.LiteSpeedAevov?.config?.enabled === true
                    },
                    {
                        id: 'sync_patterns',
                        title: 'Sync Patterns to Database',
                        description: 'Patterns will automatically sync when extracted',
                        action: 'continue',
                        validate: () => true
                    }
                ]
            }
        },

        /**
         * INITIALIZE
         */
        async init() {
            if (this.state.initialized) {
                console.warn('⚠️ Onboarding Engine already initialized');
                return;
            }

            console.log('⚡ Initializing Onboarding Engine...');

            // Load user progress
            this.loadProgress();

            // Create UI
            this.createUI();

            // Setup keyboard shortcuts
            this.setupKeyboardShortcuts();

            // Hook into workflow tester
            this.integrateWithWorkflowTester();

            // Check if first visit
            if (this.config.showWelcomeOnFirstVisit && !this.hasVisited()) {
                setTimeout(() => this.showWelcome(), 1000);
            }

            this.state.initialized = true;
            console.log('✅ Onboarding Engine ready!');
        },

        /**
         * CREATE UI
         */
        createUI() {
            // Main onboarding container
            const container = document.createElement('div');
            container.id = 'onboardingContainer';
            container.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 600px;
                max-width: 90vw;
                max-height: 80vh;
                background: linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%);
                border: 3px solid #00d4ff;
                border-radius: 15px;
                box-shadow: 0 20px 60px rgba(0, 212, 255, 0.4);
                z-index: 10000;
                display: none;
                overflow: hidden;
            `;

            container.innerHTML = `
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #00d4ff 0%, #3a47d5 100%); padding: 20px; color: white;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h2 style="margin: 0; font-size: 24px;" id="onboardingTitle">🎓 AEVOV Onboarding</h2>
                            <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 14px;" id="onboardingSubtitle">Let's get you started</p>
                        </div>
                        <button onclick="window.OnboardingEngine.close()" style="
                            background: rgba(255,255,255,0.2);
                            border: none;
                            color: white;
                            width: 35px;
                            height: 35px;
                            border-radius: 50%;
                            cursor: pointer;
                            font-size: 20px;
                        ">✕</button>
                    </div>
                    
                    <!-- Progress bar -->
                    <div style="margin-top: 15px; background: rgba(0,0,0,0.2); height: 8px; border-radius: 4px; overflow: hidden;">
                        <div id="onboardingProgress" style="
                            height: 100%;
                            background: linear-gradient(90deg, #00ff88 0%, #00d4ff 100%);
                            width: 0%;
                            transition: width 0.3s ease;
                        "></div>
                    </div>
                    <div style="margin-top: 5px; font-size: 12px; opacity: 0.8;" id="onboardingProgressText">Step 0 of 0</div>
                </div>

                <!-- Content -->
                <div id="onboardingContent" style="padding: 25px; color: white; overflow-y: auto; max-height: 500px;">
                    <!-- Dynamic content here -->
                </div>

                <!-- Footer -->
                <div style="padding: 20px; background: rgba(0,0,0,0.2); display: flex; justify-content: space-between; align-items: center;">
                    <button onclick="window.OnboardingEngine.previous()" id="onboardingPrevBtn" style="
                        padding: 10px 20px;
                        background: rgba(255,255,255,0.1);
                        border: 1px solid rgba(255,255,255,0.2);
                        color: white;
                        border-radius: 6px;
                        cursor: pointer;
                        font-weight: 600;
                    " disabled>← Previous</button>
                    
                    <button onclick="window.OnboardingEngine.skip()" style="
                        padding: 10px 20px;
                        background: transparent;
                        border: none;
                        color: rgba(255,255,255,0.6);
                        cursor: pointer;
                    ">Skip for now</button>
                    
                    <button onclick="window.OnboardingEngine.next()" id="onboardingNextBtn" style="
                        padding: 10px 25px;
                        background: linear-gradient(135deg, #00ff88 0%, #00d4ff 100%);
                        border: none;
                        color: white;
                        border-radius: 6px;
                        cursor: pointer;
                        font-weight: 600;
                    ">Next →</button>
                </div>
            `;

            document.body.appendChild(container);

            // Create overlay
            const overlay = document.createElement('div');
            overlay.id = 'onboardingOverlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                z-index: 9999;
                display: none;
            `;
            document.body.appendChild(overlay);

            console.log('✅ Onboarding UI created');
        },

        /**
         * SHOW WELCOME
         */
        showWelcome() {
            const content = document.getElementById('onboardingContent');
            const container = document.getElementById('onboardingContainer');
            const overlay = document.getElementById('onboardingOverlay');

            content.innerHTML = `
                <div style="text-align: center;">
                    <div style="font-size: 64px; margin-bottom: 20px;">🚀</div>
                    <h2 style="color: #00d4ff; margin-bottom: 15px;">Welcome to AEVOV</h2>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px; opacity: 0.9;">
                        The Advanced Aevov Reasoning Multidimensional Pattern Evolution System
                    </p>
                    
                    <div style="background: rgba(0, 212, 255, 0.1); padding: 20px; border-radius: 10px; border-left: 4px solid #00d4ff; text-align: left; margin-bottom: 25px;">
                        <h3 style="color: #00d4ff; margin-top: 0;">Key Features:</h3>
                        <ul style="margin: 10px 0; padding-left: 20px;">
                            <li>🔍 Pattern Extraction with WordNet Uniqueness</li>
                            <li>🧬 Model Evolution with ARMsquare Reasoning</li>
                            <li>☁️ Cubbit Cloud Integration</li>
                            <li>🎥 Aevmer Video Streaming</li>
                            <li>🗄️ PGLite + Electric SQL Database</li>
                            <li>🤖 RL Training System</li>
                        </ul>
                    </div>

                    <h3 style="color: #00d4ff; margin-bottom: 15px;">Choose Your Path:</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        ${Object.entries(this.workflows).map(([id, workflow]) => `
                            <div onclick="window.OnboardingEngine.startWorkflow('${id}')" style="
                                padding: 20px;
                                background: rgba(255,255,255,0.05);
                                border: 2px solid rgba(0, 212, 255, 0.3);
                                border-radius: 10px;
                                cursor: pointer;
                                transition: all 0.3s ease;
                            " onmouseover="this.style.background='rgba(0, 212, 255, 0.2)'; this.style.borderColor='#00d4ff';" 
                               onmouseout="this.style.background='rgba(255,255,255,0.05)'; this.style.borderColor='rgba(0, 212, 255, 0.3)';">
                                <div style="font-size: 32px; margin-bottom: 10px;">${workflow.icon}</div>
                                <div style="font-weight: 600; margin-bottom: 5px;">${workflow.name}</div>
                                <div style="font-size: 12px; opacity: 0.7;">${workflow.estimatedTime}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

            document.getElementById('onboardingTitle').textContent = '🎓 Welcome to AEVOV';
            document.getElementById('onboardingSubtitle').textContent = 'Choose your learning path';
            document.getElementById('onboardingPrevBtn').style.display = 'none';
            document.getElementById('onboardingNextBtn').textContent = 'Get Started';
            document.getElementById('onboardingNextBtn').onclick = () => this.startWorkflow('getting_started');

            container.style.display = 'block';
            overlay.style.display = 'block';
            this.state.isActive = true;
            
            this.markVisited();
        },

        /**
         * START WORKFLOW
         */
        startWorkflow(workflowId) {
            const workflow = this.workflows[workflowId];
            if (!workflow) {
                console.error('Unknown workflow:', workflowId);
                return;
            }

            // Check prerequisite
            if (workflow.prerequisite && !this.state.completedWorkflows.includes(workflow.prerequisite)) {
                alert(`Please complete "${this.workflows[workflow.prerequisite].name}" first`);
                return;
            }

            this.state.currentWorkflow = workflowId;
            this.state.currentStep = 0;
            
            this.renderStep();
        },

        /**
         * RENDER STEP
         */
        renderStep() {
            const workflow = this.workflows[this.state.currentWorkflow];
            const step = workflow.steps[this.state.currentStep];
            const totalSteps = workflow.steps.length;

            // Update header
            document.getElementById('onboardingTitle').textContent = `${workflow.icon} ${workflow.name}`;
            document.getElementById('onboardingSubtitle').textContent = step.title;
            
            // Update progress
            const progress = ((this.state.currentStep + 1) / totalSteps) * 100;
            document.getElementById('onboardingProgress').style.width = progress + '%';
            document.getElementById('onboardingProgressText').textContent = 
                `Step ${this.state.currentStep + 1} of ${totalSteps}`;

            // Update content
            const content = document.getElementById('onboardingContent');
            content.innerHTML = `
                <div>
                    <h3 style="color: #00ff88; margin-bottom: 15px;">${step.title}</h3>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 25px;">${step.description}</p>
                    
                    ${step.target ? `
                        <div style="background: rgba(255, 159, 10, 0.1); padding: 15px; border-radius: 8px; border-left: 4px solid #ff9f0a; margin-bottom: 20px;">
                            <strong>👉 Action Required:</strong> ${this.getActionText(step.action)}
                        </div>
                    ` : ''}
                    
                    <div style="margin-top: 20px;">
                        <button onclick="window.OnboardingEngine.validateCurrentStep()" style="
                            padding: 12px 30px;
                            background: linear-gradient(135deg, #00d4ff 0%, #3a47d5 100%);
                            border: none;
                            color: white;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                            font-size: 14px;
                        ">✓ Validate Step</button>
                    </div>
                </div>
            `;

            // Highlight target element
            if (step.highlight && step.target) {
                this.highlightElement(step.target);
            }

            // Scroll to target
            if (step.scrollTo && step.target) {
                setTimeout(() => {
                    const el = document.querySelector(step.target);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            }

            // Update buttons
            document.getElementById('onboardingPrevBtn').disabled = this.state.currentStep === 0;
            document.getElementById('onboardingPrevBtn').style.display = 'block';
        },

        /**
         * GET ACTION TEXT
         */
        getActionText(action) {
            const actions = {
                'click': 'Click on the highlighted element',
                'select': 'Select an option from the dropdown',
                'input': 'Fill in the required information',
                'checkbox': 'Enable the checkbox',
                'multiselect': 'Select one or more options',
                'file_upload': 'Upload a file',
                'continue': 'Review the information and continue',
                'keyboard': 'Use the keyboard shortcut',
                'click_tab': 'Click on the highlighted tab',
                'test_shortcut': 'Test the keyboard shortcut',
                'check_status': 'Verify the status indicator',
                'check_diagnostics': 'Check the diagnostics panel',
                'open_interface': 'Open the interface using the shortcut or dock'
            };
            return actions[action] || 'Complete the required action';
        },

        /**
         * HIGHLIGHT ELEMENT
         */
        highlightElement(selector) {
            // Remove previous highlights
            document.querySelectorAll('.onboarding-highlight').forEach(el => {
                el.classList.remove('onboarding-highlight');
            });

            // Add new highlight
            const el = document.querySelector(selector);
            if (el) {
                el.classList.add('onboarding-highlight');
                
                // Add CSS if not exists
                if (!document.getElementById('onboardingHighlightStyles')) {
                    const style = document.createElement('style');
                    style.id = 'onboardingHighlightStyles';
                    style.textContent = `
                        .onboarding-highlight {
                            position: relative;
                            z-index: 10001 !important;
                            box-shadow: 0 0 0 4px #00d4ff, 0 0 20px rgba(0, 212, 255, 0.5) !important;
                            animation: onboarding-pulse 2s infinite;
                        }
                        
                        @keyframes onboarding-pulse {
                            0%, 100% { box-shadow: 0 0 0 4px #00d4ff, 0 0 20px rgba(0, 212, 255, 0.5); }
                            50% { box-shadow: 0 0 0 8px #00d4ff, 0 0 40px rgba(0, 212, 255, 0.8); }
                        }
                    `;
                    document.head.appendChild(style);
                }
            }
        },

        /**
         * VALIDATE CURRENT STEP
         */
        async validateCurrentStep() {
            const workflow = this.workflows[this.state.currentWorkflow];
            const step = workflow.steps[this.state.currentStep];

            const isValid = await step.validate();

            if (isValid) {
                this.showNotification('✅ Step completed!', 'success');
                setTimeout(() => this.next(), 500);
            } else {
                this.showNotification('⚠️ Please complete the required action first', 'warning');
            }
        },

        /**
         * NEXT STEP
         */
        next() {
            const workflow = this.workflows[this.state.currentWorkflow];
            
            if (this.state.currentStep < workflow.steps.length - 1) {
                this.state.currentStep++;
                this.renderStep();
                this.saveProgress();
            } else {
                // Workflow complete
                this.completeWorkflow();
            }
        },

        /**
         * PREVIOUS STEP
         */
        previous() {
            if (this.state.currentStep > 0) {
                this.state.currentStep--;
                this.renderStep();
            }
        },

        /**
         * COMPLETE WORKFLOW
         */
        completeWorkflow() {
            const workflow = this.workflows[this.state.currentWorkflow];
            
            if (!this.state.completedWorkflows.includes(this.state.currentWorkflow)) {
                this.state.completedWorkflows.push(this.state.currentWorkflow);
            }

            const content = document.getElementById('onboardingContent');
            content.innerHTML = `
                <div style="text-align: center;">
                    <div style="font-size: 64px; margin-bottom: 20px;">🎉</div>
                    <h2 style="color: #00ff88; margin-bottom: 15px;">Workflow Complete!</h2>
                    <p style="font-size: 16px; margin-bottom: 30px;">
                        You've completed <strong>${workflow.name}</strong>
                    </p>
                    
                    <div style="display: flex; gap: 15px; justify-content: center;">
                        <button onclick="window.OnboardingEngine.showWelcome()" style="
                            padding: 12px 25px;
                            background: linear-gradient(135deg, #00d4ff 0%, #3a47d5 100%);
                            border: none;
                            color: white;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">Choose Another Path</button>
                        
                        <button onclick="window.OnboardingEngine.close()" style="
                            padding: 12px 25px;
                            background: rgba(255,255,255,0.1);
                            border: 1px solid rgba(255,255,255,0.2);
                            color: white;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">Start Using AEVOV</button>
                    </div>
                </div>
            `;

            this.saveProgress();
        },

        /**
         * SKIP
         */
        skip() {
            if (confirm('Are you sure you want to skip this tutorial?')) {
                this.close();
            }
        },

        /**
         * CLOSE
         */
        close() {
            document.getElementById('onboardingContainer').style.display = 'none';
            document.getElementById('onboardingOverlay').style.display = 'none';
            this.state.isActive = false;
            
            // Remove highlights
            document.querySelectorAll('.onboarding-highlight').forEach(el => {
                el.classList.remove('onboarding-highlight');
            });
        },

        /**
         * SHOW NOTIFICATION
         */
        showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 25px;
                background: ${type === 'success' ? 'linear-gradient(135deg, #00ff88 0%, #00cc70 100%)' : 
                             type === 'warning' ? 'linear-gradient(135deg, #ff9f0a 0%, #ff6b35 100%)' :
                             'linear-gradient(135deg, #00d4ff 0%, #3a47d5 100%)'};
                color: white;
                border-radius: 8px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                z-index: 10002;
                font-weight: 600;
                animation: slideInRight 0.3s ease;
            `;
            notification.textContent = message;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, 3000);

            // Add animation styles if not exists
            if (!document.getElementById('onboardingAnimations')) {
                const style = document.createElement('style');
                style.id = 'onboardingAnimations';
                style.textContent = `
                    @keyframes slideInRight {
                        from { transform: translateX(400px); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                    @keyframes slideOutRight {
                        from { transform: translateX(0); opacity: 1; }
                        to { transform: translateX(400px); opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }
        },

        /**
         * SETUP KEYBOARD SHORTCUTS
         */
        setupKeyboardShortcuts() {
            document.addEventListener('keydown', (e) => {
                // Ctrl+Shift+O - Open onboarding
                if (e.ctrlKey && e.shiftKey && e.key === 'O') {
                    e.preventDefault();
                    this.showWelcome();
                }
            });
        },

        /**
         * INTEGRATE WITH WORKFLOW TESTER
         */
        integrateWithWorkflowTester() {
            if (window.WorkflowTester) {
                console.log('✅ Integrated with Workflow Tester');
                
                // Hook workflow tester to validate onboarding steps
                const original = window.WorkflowTester.simulateWorkflow;
                if (original) {
                    window.WorkflowTester.simulateWorkflow = (workflowId) => {
                        // Run original
                        original.call(window.WorkflowTester, workflowId);
                        
                        // Update onboarding if active
                        if (this.state.isActive && this.state.currentWorkflow) {
                            console.log('Workflow tester synced with onboarding');
                        }
                    };
                }
            }
        },

        /**
         * SAVE PROGRESS
         */
        saveProgress() {
            if (!this.config.saveProgress) return;

            const progress = {
                completedWorkflows: this.state.completedWorkflows,
                currentWorkflow: this.state.currentWorkflow,
                currentStep: this.state.currentStep,
                lastVisit: new Date().toISOString()
            };

            localStorage.setItem('aevov_onboarding_progress', JSON.stringify(progress));
        },

        /**
         * LOAD PROGRESS
         */
        loadProgress() {
            try {
                const saved = localStorage.getItem('aevov_onboarding_progress');
                if (saved) {
                    const progress = JSON.parse(saved);
                    this.state.completedWorkflows = progress.completedWorkflows || [];
                    console.log(`✓ Loaded progress: ${this.state.completedWorkflows.length} workflows completed`);
                }
            } catch (error) {
                console.warn('Could not load onboarding progress:', error);
            }
        },

        /**
         * HAS VISITED
         */
        hasVisited() {
            return localStorage.getItem('aevov_visited') === 'true';
        },

        /**
         * MARK VISITED
         */
        markVisited() {
            localStorage.setItem('aevov_visited', 'true');
        }
    };

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            OnboardingEngine.init();
        });
    } else {
        OnboardingEngine.init();
    }

    // Export globally
    window.OnboardingEngine = OnboardingEngine;

    console.log('✅ Onboarding Engine loaded');
    console.log('⌨️ Press Ctrl+Shift+O to open onboarding');

})();