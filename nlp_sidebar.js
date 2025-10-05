/**
 * NLP COMPROMISE SIDEBAR WITH HIERARCHICAL REASONING
 * Sophisticated sidebar with SVG icon that expands on hover
 * 
 * Features:
 * - Collapsible sidebar with animated SVG icon
 * - Deep NLP Compromise integration
 * - 4 Goldilocks Validation Loops (inspired by HRM)
 * - Hierarchical reasoning process
 * - Real-time validation visualization
 * - Pattern consensus engine
 * 
 * Requires: compromise.js
 */

(function() {
    'use strict';

    console.log('📚 Loading NLP Compromise Sidebar with Hierarchical Reasoning...');

    const NLPSidebar = {
        // Configuration
        config: {
            expanded: false,
            goldilocksEnabled: true,
            showValidation: true,
            autoCollapse: true,
            collapseDelay: 3000
        },

        // State
        state: {
            compromiseReady: false,
            currentValidation: null,
            validationHistory: [],
            stats: {
                totalValidations: 0,
                passedValidations: 0,
                averageConfidence: 0,
                loopStats: [0, 0, 0, 0] // Stats for each loop
            }
        },

        /**
         * INITIALIZE
         */
        async init() {
            console.log('⚡ Initializing NLP Sidebar...');

            // Check Compromise
            if (typeof nlp === 'undefined') {
                console.error('❌ Compromise not loaded!');
                return;
            }

            this.state.compromiseReady = true;

            // Create sidebar UI
            this.createSidebar();

            // Integrate with Aevov
            this.integrateHierarchicalReasoning();

            console.log('✅ NLP Sidebar with Hierarchical Reasoning ready!');
        },

        /**
         * CREATE SIDEBAR UI
         */
        createSidebar() {
            const sidebarHTML = `
                <!-- Sidebar Container -->
                <div id="nlpSidebar" class="nlp-sidebar collapsed">
                    
                    <!-- SVG Icon Button -->
                    <div id="nlpSidebarIcon" class="nlp-sidebar-icon">
                        <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                            <!-- Brain icon with animated neurons -->
                            <defs>
                                <radialGradient id="brainGradient">
                                    <stop offset="0%" stop-color="#60a5fa" />
                                    <stop offset="100%" stop-color="#3b82f6" />
                                </radialGradient>
                                <filter id="glow">
                                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                                    <feMerge>
                                        <feMergeNode in="coloredBlur"/>
                                        <feMergeNode in="SourceGraphic"/>
                                    </feMerge>
                                </filter>
                            </defs>
                            
                            <!-- Brain outline -->
                            <path d="M 15 25 Q 15 15, 25 15 Q 35 15, 35 25 Q 35 35, 25 35 Q 15 35, 15 25" 
                                  fill="none" stroke="url(#brainGradient)" stroke-width="2" filter="url(#glow)">
                                <animate attributeName="stroke-dasharray" from="0,100" to="100,0" dur="3s" repeatCount="indefinite"/>
                            </path>
                            
                            <!-- Neural nodes -->
                            <circle cx="20" cy="20" r="2" fill="#60a5fa" class="neuron-pulse">
                                <animate attributeName="r" values="2;3;2" dur="1.5s" repeatCount="indefinite"/>
                                <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite"/>
                            </circle>
                            <circle cx="30" cy="20" r="2" fill="#60a5fa" class="neuron-pulse">
                                <animate attributeName="r" values="2;3;2" dur="1.5s" begin="0.3s" repeatCount="indefinite"/>
                                <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" begin="0.3s" repeatCount="indefinite"/>
                            </circle>
                            <circle cx="25" cy="25" r="2" fill="#3b82f6" class="neuron-pulse">
                                <animate attributeName="r" values="2;3.5;2" dur="1.5s" begin="0.6s" repeatCount="indefinite"/>
                                <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" begin="0.6s" repeatCount="indefinite"/>
                            </circle>
                            <circle cx="20" cy="30" r="2" fill="#60a5fa" class="neuron-pulse">
                                <animate attributeName="r" values="2;3;2" dur="1.5s" begin="0.9s" repeatCount="indefinite"/>
                                <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" begin="0.9s" repeatCount="indefinite"/>
                            </circle>
                            <circle cx="30" cy="30" r="2" fill="#60a5fa" class="neuron-pulse">
                                <animate attributeName="r" values="2;3;2" dur="1.5s" begin="1.2s" repeatCount="indefinite"/>
                                <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" begin="1.2s" repeatCount="indefinite"/>
                            </circle>
                            
                            <!-- Connection lines -->
                            <line x1="20" y1="20" x2="30" y2="20" stroke="#60a5fa" stroke-width="1" opacity="0.3">
                                <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite"/>
                            </line>
                            <line x1="20" y1="20" x2="25" y2="25" stroke="#60a5fa" stroke-width="1" opacity="0.3">
                                <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" begin="0.5s" repeatCount="indefinite"/>
                            </line>
                            <line x1="30" y1="20" x2="25" y2="25" stroke="#60a5fa" stroke-width="1" opacity="0.3">
                                <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" begin="1s" repeatCount="indefinite"/>
                            </line>
                            <line x1="25" y1="25" x2="20" y2="30" stroke="#60a5fa" stroke-width="1" opacity="0.3">
                                <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" begin="1.5s" repeatCount="indefinite"/>
                            </line>
                            <line x1="25" y1="25" x2="30" y2="30" stroke="#60a5fa" stroke-width="1" opacity="0.3">
                                <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" begin="2s" repeatCount="indefinite"/>
                            </line>
                        </svg>
                        <div class="nlp-badge">NLP</div>
                    </div>

                    <!-- Expanded Panel -->
                    <div id="nlpSidebarPanel" class="nlp-sidebar-panel">
                        
                        <!-- Header -->
                        <div class="nlp-sidebar-header">
                            <h2>🧠 NLP Compromise</h2>
                            <p>Hierarchical Reasoning Engine</p>
                            <button class="nlp-close-btn" onclick="window.NLPSidebar.collapse()">✕</button>
                        </div>

                        <!-- Goldilocks Validation Section -->
                        <div class="nlp-section">
                            <h3>🔄 4 Goldilocks Validation Loops</h3>
                            <p class="nlp-desc">Inspired by HRM - Hierarchical validation for optimal confidence</p>
                            
                            <!-- Loop Indicators -->
                            <div class="validation-loops">
                                <div class="loop-indicator" id="loop1">
                                    <div class="loop-number">1</div>
                                    <div class="loop-label">Pattern Match</div>
                                    <div class="loop-status">—</div>
                                    <div class="loop-bar"><div class="loop-progress"></div></div>
                                </div>
                                <div class="loop-indicator" id="loop2">
                                    <div class="loop-number">2</div>
                                    <div class="loop-label">Entity Validation</div>
                                    <div class="loop-status">—</div>
                                    <div class="loop-bar"><div class="loop-progress"></div></div>
                                </div>
                                <div class="loop-indicator" id="loop3">
                                    <div class="loop-number">3</div>
                                    <div class="loop-label">Semantic Check</div>
                                    <div class="loop-status">—</div>
                                    <div class="loop-bar"><div class="loop-progress"></div></div>
                                </div>
                                <div class="loop-indicator" id="loop4">
                                    <div class="loop-number">4</div>
                                    <div class="loop-label">Consensus</div>
                                    <div class="loop-status">—</div>
                                    <div class="loop-bar"><div class="loop-progress"></div></div>
                                </div>
                            </div>
                        </div>

                        <!-- Real-time Validation Display -->
                        <div class="nlp-section">
                            <h3>📊 Current Validation</h3>
                            <div id="currentValidation" class="validation-display">
                                <div class="validation-empty">No active validation</div>
                            </div>
                        </div>

                        <!-- NLP Features -->
                        <div class="nlp-section">
                            <h3>⚙️ NLP Features</h3>
                            <div class="nlp-features">
                                <label class="nlp-checkbox">
                                    <input type="checkbox" id="nlpEntityExtraction" checked onchange="window.NLPSidebar.toggleFeature('entities', this.checked)">
                                    <span>Entity Extraction</span>
                                </label>
                                <label class="nlp-checkbox">
                                    <input type="checkbox" id="nlpPosTagging" checked onchange="window.NLPSidebar.toggleFeature('pos', this.checked)">
                                    <span>POS Tagging</span>
                                </label>
                                <label class="nlp-checkbox">
                                    <input type="checkbox" id="nlpTopicExtraction" checked onchange="window.NLPSidebar.toggleFeature('topics', this.checked)">
                                    <span>Topic Extraction</span>
                                </label>
                                <label class="nlp-checkbox">
                                    <input type="checkbox" id="nlpGoldilocksValidation" checked onchange="window.NLPSidebar.toggleFeature('goldilocks', this.checked)">
                                    <span>Goldilocks Validation</span>
                                </label>
                            </div>
                        </div>

                        <!-- Stats -->
                        <div class="nlp-section">
                            <h3>📈 Statistics</h3>
                            <div class="nlp-stats">
                                <div class="stat-row">
                                    <span>Total Validations:</span>
                                    <span id="totalValidations">0</span>
                                </div>
                                <div class="stat-row">
                                    <span>Passed:</span>
                                    <span id="passedValidations">0</span>
                                </div>
                                <div class="stat-row">
                                    <span>Average Confidence:</span>
                                    <span id="avgConfidence">0%</span>
                                </div>
                                <div class="stat-row">
                                    <span>Success Rate:</span>
                                    <span id="successRate">0%</span>
                                </div>
                            </div>
                        </div>

                        <!-- Validation History -->
                        <div class="nlp-section">
                            <h3>📜 Recent Validations</h3>
                            <div id="validationHistory" class="validation-history">
                                <div class="history-empty">No validations yet</div>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- Styles -->
                <style>
                    .nlp-sidebar {
                        position: fixed;
                        right: 0;
                        top: 0;
                        height: 100vh;
                        z-index: 9996;
                        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    }

                    .nlp-sidebar-icon {
                        position: absolute;
                        right: 0;
                        top: 50%;
                        transform: translateY(-50%);
                        width: 60px;
                        height: 120px;
                        background: linear-gradient(135deg, rgba(59, 130, 246, 0.95) 0%, rgba(37, 99, 235, 0.95) 100%);
                        border-radius: 12px 0 0 12px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        box-shadow: -4px 0 20px rgba(59, 130, 246, 0.4);
                        transition: all 0.3s;
                        backdrop-filter: blur(10px);
                    }

                    .nlp-sidebar-icon:hover {
                        transform: translateY(-50%) translateX(-5px);
                        box-shadow: -8px 0 30px rgba(59, 130, 246, 0.6);
                    }

                    .nlp-sidebar.collapsed .nlp-sidebar-icon:hover ~ .nlp-sidebar-panel {
                        transform: translateX(0);
                        opacity: 1;
                        pointer-events: all;
                    }

                    .nlp-badge {
                        margin-top: 8px;
                        font-size: 11px;
                        font-weight: 700;
                        color: white;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    }

                    .nlp-sidebar-panel {
                        position: absolute;
                        right: 60px;
                        top: 0;
                        width: 450px;
                        height: 100vh;
                        background: linear-gradient(135deg, rgba(10, 25, 47, 0.98) 0%, rgba(26, 39, 68, 0.98) 100%);
                        border-left: 2px solid #3b82f6;
                        box-shadow: -10px 0 40px rgba(0, 0, 0, 0.5);
                        overflow-y: auto;
                        transform: translateX(100%);
                        opacity: 0;
                        pointer-events: none;
                        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                        backdrop-filter: blur(20px);
                    }

                    .nlp-sidebar.expanded .nlp-sidebar-panel {
                        transform: translateX(0);
                        opacity: 1;
                        pointer-events: all;
                    }

                    .nlp-sidebar-header {
                        padding: 30px;
                        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                        border-bottom: 2px solid #60a5fa;
                        position: relative;
                    }

                    .nlp-sidebar-header h2 {
                        margin: 0 0 8px 0;
                        color: white;
                        font-size: 24px;
                    }

                    .nlp-sidebar-header p {
                        margin: 0;
                        color: rgba(255, 255, 255, 0.8);
                        font-size: 13px;
                    }

                    .nlp-close-btn {
                        position: absolute;
                        top: 20px;
                        right: 20px;
                        background: rgba(255, 255, 255, 0.2);
                        border: none;
                        color: white;
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                        cursor: pointer;
                        font-size: 18px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.2s;
                    }

                    .nlp-close-btn:hover {
                        background: rgba(255, 255, 255, 0.3);
                        transform: rotate(90deg);
                    }

                    .nlp-section {
                        padding: 20px 30px;
                        border-bottom: 1px solid rgba(59, 130, 246, 0.2);
                    }

                    .nlp-section h3 {
                        margin: 0 0 15px 0;
                        color: #60a5fa;
                        font-size: 16px;
                    }

                    .nlp-desc {
                        margin: 0 0 15px 0;
                        color: rgba(255, 255, 255, 0.7);
                        font-size: 12px;
                        line-height: 1.5;
                    }

                    /* Validation Loops */
                    .validation-loops {
                        display: flex;
                        flex-direction: column;
                        gap: 12px;
                    }

                    .loop-indicator {
                        background: rgba(0, 0, 0, 0.3);
                        padding: 12px;
                        border-radius: 8px;
                        border-left: 3px solid #4b5563;
                        transition: all 0.3s;
                    }

                    .loop-indicator.active {
                        border-left-color: #60a5fa;
                        box-shadow: 0 0 20px rgba(96, 165, 250, 0.3);
                    }

                    .loop-indicator.passed {
                        border-left-color: #10b981;
                    }

                    .loop-indicator.failed {
                        border-left-color: #ef4444;
                    }

                    .loop-number {
                        display: inline-block;
                        width: 24px;
                        height: 24px;
                        background: #3b82f6;
                        color: white;
                        border-radius: 50%;
                        text-align: center;
                        line-height: 24px;
                        font-weight: 700;
                        font-size: 12px;
                        margin-right: 10px;
                    }

                    .loop-label {
                        display: inline-block;
                        color: white;
                        font-weight: 600;
                        font-size: 13px;
                    }

                    .loop-status {
                        float: right;
                        color: rgba(255, 255, 255, 0.6);
                        font-size: 12px;
                    }

                    .loop-bar {
                        margin-top: 8px;
                        height: 4px;
                        background: rgba(59, 130, 246, 0.2);
                        border-radius: 2px;
                        overflow: hidden;
                    }

                    .loop-progress {
                        height: 100%;
                        background: linear-gradient(90deg, #3b82f6, #60a5fa);
                        width: 0%;
                        transition: width 0.3s;
                    }

                    /* Validation Display */
                    .validation-display {
                        background: rgba(0, 0, 0, 0.3);
                        padding: 15px;
                        border-radius: 8px;
                        min-height: 80px;
                    }

                    .validation-empty {
                        color: rgba(255, 255, 255, 0.5);
                        text-align: center;
                        padding: 20px;
                        font-size: 13px;
                    }

                    .validation-content {
                        color: white;
                        font-size: 13px;
                        line-height: 1.6;
                    }

                    .validation-query {
                        color: #60a5fa;
                        font-weight: 600;
                        margin-bottom: 8px;
                    }

                    .validation-result {
                        color: rgba(255, 255, 255, 0.9);
                    }

                    /* Features */
                    .nlp-features {
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                    }

                    .nlp-checkbox {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        color: rgba(255, 255, 255, 0.9);
                        font-size: 13px;
                        cursor: pointer;
                        padding: 8px;
                        border-radius: 6px;
                        transition: background 0.2s;
                    }

                    .nlp-checkbox:hover {
                        background: rgba(59, 130, 246, 0.1);
                    }

                    .nlp-checkbox input {
                        width: 18px;
                        height: 18px;
                        cursor: pointer;
                    }

                    /* Stats */
                    .nlp-stats {
                        display: flex;
                        flex-direction: column;
                        gap: 8px;
                    }

                    .stat-row {
                        display: flex;
                        justify-content: space-between;
                        padding: 8px 12px;
                        background: rgba(0, 0, 0, 0.3);
                        border-radius: 6px;
                        color: rgba(255, 255, 255, 0.9);
                        font-size: 13px;
                    }

                    .stat-row span:last-child {
                        color: #60a5fa;
                        font-weight: 700;
                    }

                    /* History */
                    .validation-history {
                        display: flex;
                        flex-direction: column;
                        gap: 8px;
                        max-height: 200px;
                        overflow-y: auto;
                    }

                    .history-empty {
                        color: rgba(255, 255, 255, 0.5);
                        text-align: center;
                        padding: 20px;
                        font-size: 13px;
                    }

                    .history-item {
                        background: rgba(0, 0, 0, 0.3);
                        padding: 10px;
                        border-radius: 6px;
                        border-left: 3px solid #3b82f6;
                        font-size: 12px;
                    }

                    .history-item.success {
                        border-left-color: #10b981;
                    }

                    .history-item.failed {
                        border-left-color: #ef4444;
                    }

                    .history-query {
                        color: white;
                        margin-bottom: 4px;
                        font-weight: 600;
                    }

                    .history-confidence {
                        color: rgba(255, 255, 255, 0.7);
                    }

                    /* Scrollbar */
                    .nlp-sidebar-panel::-webkit-scrollbar,
                    .validation-history::-webkit-scrollbar {
                        width: 6px;
                    }

                    .nlp-sidebar-panel::-webkit-scrollbar-track,
                    .validation-history::-webkit-scrollbar-track {
                        background: rgba(0, 0, 0, 0.2);
                    }

                    .nlp-sidebar-panel::-webkit-scrollbar-thumb,
                    .validation-history::-webkit-scrollbar-thumb {
                        background: #3b82f6;
                        border-radius: 3px;
                    }
                </style>
            `;

            document.body.insertAdjacentHTML('beforeend', sidebarHTML);

            // Setup hover listener
            const icon = document.getElementById('nlpSidebarIcon');
            const sidebar = document.getElementById('nlpSidebar');
            
            icon.addEventListener('click', () => this.expand());
            
            icon.addEventListener('mouseenter', () => {
                if (!this.config.expanded) {
                    sidebar.classList.remove('collapsed');
                }
            });

            sidebar.addEventListener('mouseleave', () => {
                if (!this.config.expanded && this.config.autoCollapse) {
                    setTimeout(() => {
                        if (!this.config.expanded) {
                            sidebar.classList.add('collapsed');
                        }
                    }, this.config.collapseDelay);
                }
            });

            console.log('✅ NLP Sidebar UI created');
        },

        /**
         * EXPAND/COLLAPSE
         */
        expand() {
            const sidebar = document.getElementById('nlpSidebar');
            sidebar.classList.add('expanded');
            sidebar.classList.remove('collapsed');
            this.config.expanded = true;
        },

        collapse() {
            const sidebar = document.getElementById('nlpSidebar');
            sidebar.classList.remove('expanded');
            sidebar.classList.add('collapsed');
            this.config.expanded = false;
        },

        /**
         * INTEGRATE HIERARCHICAL REASONING
         * This is the core Goldilocks validation system
         */
        integrateHierarchicalReasoning() {
            console.log('🔄 Integrating Hierarchical Reasoning...');

            // Patch Aevov NLU processing
            if (window.AevovNLU && window.AevovNLU.processWithNLU) {
                const original = window.AevovNLU.processWithNLU.bind(window.AevovNLU);

                window.AevovNLU.processWithNLU = async (query, fallback) => {
                    if (!this.config.goldilocksEnabled) {
                        return await original(query, fallback);
                    }

                    // Run through 4 Goldilocks loops
                    return await this.goldilocksValidation(query, original, fallback);
                };

                console.log('✅ Hierarchical reasoning integrated');
            }
        },

        /**
         * GOLDILOCKS VALIDATION
         * 4-loop hierarchical reasoning process (inspired by HRM)
         */
        async goldilocksValidation(query, originalProcess, fallback) {
            console.log('🔄 Starting Goldilocks validation...');

            this.state.currentValidation = {
                query: query,
                startTime: Date.now(),
                loops: []
            };

            this.updateCurrentValidation(`Validating: "${query.substring(0, 40)}..."`);

            try {
                // LOOP 1: Initial Pattern Match
                const loop1 = await this.loop1_PatternMatch(query);
                this.updateLoop(1, loop1.status, loop1.confidence);

                if (loop1.confidence < 0.3) {
                    return this.finishValidation('low_confidence', loop1.response);
                }

                // LOOP 2: Entity Validation
                const loop2 = await this.loop2_EntityValidation(query, loop1);
                this.updateLoop(2, loop2.status, loop2.confidence);

                if (loop2.confidence < 0.5) {
                    return this.finishValidation('entity_failed', loop2.response);
                }

                // LOOP 3: Semantic Check
                const loop3 = await this.loop3_SemanticCheck(query, loop1, loop2);
                this.updateLoop(3, loop3.status, loop3.confidence);

                if (loop3.confidence < 0.65) {
                    return this.finishValidation('semantic_failed', loop3.response);
                }

                // LOOP 4: Final Consensus
                const loop4 = await this.loop4_Consensus(query, loop1, loop2, loop3);
                this.updateLoop(4, loop4.status, loop4.confidence);

                // Generate final response
                const finalResponse = await this.generateValidatedResponse(loop1, loop2, loop3, loop4);

                return this.finishValidation('success', finalResponse, loop4.confidence);

            } catch (error) {
                console.error('Validation error:', error);
                return await originalProcess(query, fallback);
            }
        },

        /**
         * LOOP 1: Pattern Match
         * Find initial pattern matches using Aevov's system
         */
        async loop1_PatternMatch(query) {
            console.log('Loop 1: Pattern matching...');

            let matches = [];
            let confidence = 0;

            // Use existing pattern matching
            if (window.matchPatterns) {
                const result = window.matchPatterns(query, 5);
                if (result.success && result.matches) {
                    matches = result.matches;
                    confidence = matches[0]?.confidence || 0;
                }
            }

            return {
                status: confidence > 0.3 ? 'passed' : 'failed',
                confidence: confidence,
                matches: matches,
                response: matches.length > 0 ? 
                    `Found ${matches.length} pattern matches` : 
                    'No patterns found'
            };
        },

        /**
         * LOOP 2: Entity Validation
         * Validate entities using NLP Compromise
         */
        async loop2_EntityValidation(query, loop1) {
            console.log('Loop 2: Entity validation...');

            const doc = nlp(query);

            // Extract entities
            const entities = {
                people: doc.people().out('array'),
                places: doc.places().out('array'),
                organizations: doc.organizations().out('array'),
                verbs: doc.verbs().out('array'),
                nouns: doc.nouns().out('array'),
                topics: doc.topics().out('array')
            };

            const totalEntities = Object.values(entities).flat().length;

            // Check if entities match pattern keywords
            let entityMatches = 0;
            const bestMatch = loop1.matches[0];
            
            if (bestMatch && bestMatch.pattern.keywords) {
                const patternKeywords = bestMatch.pattern.keywords.map(k => k.toLowerCase());
                Object.values(entities).flat().forEach(entity => {
                    if (patternKeywords.some(k => k.includes(entity.toLowerCase()) || entity.toLowerCase().includes(k))) {
                        entityMatches++;
                    }
                });
            }

            const entityConfidence = totalEntities > 0 ? (entityMatches / totalEntities) : 0.5;
            const combinedConfidence = (loop1.confidence * 0.6) + (entityConfidence * 0.4);

            return {
                status: combinedConfidence > 0.5 ? 'passed' : 'failed',
                confidence: combinedConfidence,
                entities: entities,
                entityMatches: entityMatches,
                response: `Extracted ${totalEntities} entities, ${entityMatches} match pattern`
            };
        },

        /**
         * LOOP 3: Semantic Check
         * Verify semantic coherence
         */
        async loop3_SemanticCheck(query, loop1, loop2) {
            console.log('Loop 3: Semantic checking...');

            const doc = nlp(query);

            // Check query structure
            const hasVerb = doc.verbs().length > 0;
            const hasNoun = doc.nouns().length > 0;
            const hasValidStructure = hasVerb && hasNoun;

            // Check intent alignment
            const queryIntent = this.inferIntent(query);
            const patternIntent = loop1.matches[0]?.pattern.intent || 'general';
            const intentMatch = queryIntent === patternIntent || patternIntent === 'general';

            // Calculate semantic score
            let semanticScore = 0;
            if (hasValidStructure) semanticScore += 0.3;
            if (intentMatch) semanticScore += 0.3;
            if (loop2.entityMatches > 0) semanticScore += 0.4;

            const combinedConfidence = (loop2.confidence * 0.5) + (semanticScore * 0.5);

            return {
                status: combinedConfidence > 0.65 ? 'passed' : 'failed',
                confidence: combinedConfidence,
                hasValidStructure: hasValidStructure,
                intentMatch: intentMatch,
                queryIntent: queryIntent,
                response: `Semantic coherence: ${(semanticScore * 100).toFixed(0)}%`
            };
        },

        /**
         * LOOP 4: Final Consensus
         * Aggregate all loops for final decision
         */
        async loop4_Consensus(query, loop1, loop2, loop3) {
            console.log('Loop 4: Building consensus...');

            // Weighted average of all loops
            const weights = [0.25, 0.25, 0.25, 0.25]; // Equal weight
            const confidences = [loop1.confidence, loop2.confidence, loop3.confidence];

            let finalConfidence = 0;
            for (let i = 0; i < confidences.length; i++) {
                finalConfidence += confidences[i] * weights[i];
            }

            // Bonus for passing all loops
            if (loop1.status === 'passed' && loop2.status === 'passed' && loop3.status === 'passed') {
                finalConfidence = Math.min(finalConfidence + 0.1, 1.0);
            }

            // Goldilocks check: not too low, not too high, just right
            const isGoldilocks = finalConfidence >= 0.65 && finalConfidence <= 0.95;

            return {
                status: isGoldilocks ? 'goldilocks' : (finalConfidence > 0.65 ? 'passed' : 'failed'),
                confidence: finalConfidence,
                allLoopsPassed: loop1.status === 'passed' && loop2.status === 'passed' && loop3.status === 'passed',
                isGoldilocks: isGoldilocks,
                response: `Consensus confidence: ${(finalConfidence * 100).toFixed(0)}%`
            };
        },

        /**
         * GENERATE VALIDATED RESPONSE
         */
        async generateValidatedResponse(loop1, loop2, loop3, loop4) {
            const bestMatch = loop1.matches[0];
            if (!bestMatch) {
                return 'No suitable pattern found after validation.';
            }

            let response = `**Validated Match**: ${bestMatch.pattern.categoryName || bestMatch.pattern.category}\n`;
            response += `**Confidence**: ${(loop4.confidence * 100).toFixed(0)}% `;
            response += loop4.isGoldilocks ? '(🌟 Goldilocks!)' : '';
            response += '\n\n';

            // Add entity information
            if (loop2.entities && Object.values(loop2.entities).flat().length > 0) {
                const allEntities = Object.values(loop2.entities).flat();
                response += `**Entities Found**: ${allEntities.slice(0, 5).join(', ')}\n`;
            }

            // Add semantic info
            response += `**Intent**: ${loop3.queryIntent}\n`;
            response += `**Structure**: ${loop3.hasValidStructure ? 'Valid' : 'Partial'}\n\n`;

            // Pattern keywords
            if (bestMatch.pattern.keywords) {
                response += `**Related Topics**: ${bestMatch.pattern.keywords.slice(0, 6).join(', ')}`;
            }

            return response;
        },

        /**
         * INFER INTENT
         */
        inferIntent(query) {
            const lower = query.toLowerCase();
            if (/^(build|create|make|implement|design)/.test(lower)) return 'code_generation';
            if (/^(what|explain|how does|tell me)/.test(lower)) return 'explanation';
            if (/^(optimize|improve|enhance)/.test(lower)) return 'optimization';
            if (/^(debug|fix|solve)/.test(lower)) return 'debugging';
            return 'general';
        },

        /**
         * UPDATE LOOP DISPLAY
         */
        updateLoop(loopNumber, status, confidence) {
            const loop = document.getElementById(`loop${loopNumber}`);
            if (!loop) return;

            loop.classList.remove('active', 'passed', 'failed');
            
            if (status === 'passed' || status === 'goldilocks') {
                loop.classList.add('passed');
            } else if (status === 'failed') {
                loop.classList.add('failed');
            } else {
                loop.classList.add('active');
            }

            const statusEl = loop.querySelector('.loop-status');
            const progressEl = loop.querySelector('.loop-progress');

            if (statusEl) {
                statusEl.textContent = `${(confidence * 100).toFixed(0)}%`;
            }

            if (progressEl) {
                progressEl.style.width = `${(confidence * 100)}%`;
            }

            this.state.stats.loopStats[loopNumber - 1]++;
        },

        /**
         * UPDATE CURRENT VALIDATION DISPLAY
         */
        updateCurrentValidation(text) {
            const display = document.getElementById('currentValidation');
            if (!display) return;

            display.innerHTML = `
                <div class="validation-content">
                    <div class="validation-query">${text}</div>
                </div>
            `;
        },

        /**
         * FINISH VALIDATION
         */
        finishValidation(result, response, confidence = 0) {
            const validation = this.state.currentValidation;
            validation.result = result;
            validation.confidence = confidence;
            validation.endTime = Date.now();
            validation.duration = validation.endTime - validation.startTime;

            // Update stats
            this.state.stats.totalValidations++;
            if (result === 'success' || result === 'goldilocks') {
                this.state.stats.passedValidations++;
            }

            const totalConf = this.state.stats.averageConfidence * (this.state.stats.totalValidations - 1) + confidence;
            this.state.stats.averageConfidence = totalConf / this.state.stats.totalValidations;

            // Add to history
            this.addToHistory(validation);

            // Update UI
            this.updateStats();
            this.updateCurrentValidation(`Completed: ${result}`);

            // Reset loops after delay
            setTimeout(() => {
                for (let i = 1; i <= 4; i++) {
                    const loop = document.getElementById(`loop${i}`);
                    if (loop) {
                        loop.classList.remove('active', 'passed', 'failed');
                        const status = loop.querySelector('.loop-status');
                        const progress = loop.querySelector('.loop-progress');
                        if (status) status.textContent = '—';
                        if (progress) progress.style.width = '0%';
                    }
                }
            }, 3000);

            return response;
        },

        /**
         * ADD TO HISTORY
         */
        addToHistory(validation) {
            this.state.validationHistory.unshift(validation);
            if (this.state.validationHistory.length > 10) {
                this.state.validationHistory.pop();
            }

            const historyEl = document.getElementById('validationHistory');
            if (!historyEl) return;

            const successClass = validation.result === 'success' ? 'success' : 
                                validation.result === 'goldilocks' ? 'success' : 'failed';

            const item = document.createElement('div');
            item.className = `history-item ${successClass}`;
            item.innerHTML = `
                <div class="history-query">${validation.query.substring(0, 40)}...</div>
                <div class="history-confidence">
                    Confidence: ${(validation.confidence * 100).toFixed(0)}% • 
                    ${validation.duration}ms • 
                    ${validation.result}
                </div>
            `;

            historyEl.innerHTML = '';
            this.state.validationHistory.forEach(v => {
                const sc = v.result === 'success' || v.result === 'goldilocks' ? 'success' : 'failed';
                const itm = document.createElement('div');
                itm.className = `history-item ${sc}`;
                itm.innerHTML = `
                    <div class="history-query">${v.query.substring(0, 40)}...</div>
                    <div class="history-confidence">
                        Confidence: ${(v.confidence * 100).toFixed(0)}% • 
                        ${v.duration}ms • 
                        ${v.result}
                    </div>
                `;
                historyEl.appendChild(itm);
            });
        },

        /**
         * UPDATE STATS
         */
        updateStats() {
            document.getElementById('totalValidations').textContent = this.state.stats.totalValidations;
            document.getElementById('passedValidations').textContent = this.state.stats.passedValidations;
            document.getElementById('avgConfidence').textContent = 
                (this.state.stats.averageConfidence * 100).toFixed(0) + '%';
            
            const successRate = this.state.stats.totalValidations > 0 ?
                (this.state.stats.passedValidations / this.state.stats.totalValidations * 100).toFixed(0) : 0;
            document.getElementById('successRate').textContent = successRate + '%';
        },

        /**
         * TOGGLE FEATURE
         */
        toggleFeature(feature, enabled) {
            switch(feature) {
                case 'entities':
                    this.config.extractEntities = enabled;
                    break;
                case 'pos':
                    this.config.posTagging = enabled;
                    break;
                case 'topics':
                    this.config.extractTopics = enabled;
                    break;
                case 'goldilocks':
                    this.config.goldilocksEnabled = enabled;
                    break;
            }
            console.log(`${feature}: ${enabled ? 'ON' : 'OFF'}`);
        }
    };

    // Export globally
    window.NLPSidebar = NLPSidebar;

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => NLPSidebar.init(), 2000);
        });
    } else {
        setTimeout(() => NLPSidebar.init(), 2000);
    }

    console.log('✅ NLP Sidebar with Hierarchical Reasoning loaded');

})();
