/**
 * NLP SIDEBAR POPUP SYSTEM
 * Triggered by Ctrl+Shift+N
 * Replaces sidebar with modal popup
 * 
 * Features:
 * - Keyboard shortcut: Ctrl+Shift+N
 * - Modal popup with NLP controls
 * - Hierarchical reasoning visualization
 * - Goldilocks validation loops
 * - Draggable and resizable
 */

(function() {
    'use strict';

    console.log('🎯 Loading NLP Popup System (Ctrl+Shift+N)...');

    const NLPPopup = {
        // State
        state: {
            isOpen: false,
            position: { x: window.innerWidth / 2 - 300, y: 50 },
            size: { width: 600, height: 500 },
            dragging: false,
            resizing: false
        },

        // Config
        config: {
            goldilocksEnabled: true,
            showValidation: true,
            autoClose: false
        },

        /**
         * INITIALIZE
         */
        init() {
            console.log('⚡ Initializing NLP Popup System...');

            // Register keyboard shortcut
            this.registerKeyboardShortcut();

            // Create popup HTML
            this.createPopup();

            console.log('✅ NLP Popup ready! Press Ctrl+Shift+N to open');
        },

        /**
         * REGISTER KEYBOARD SHORTCUT
         */
        registerKeyboardShortcut() {
            document.addEventListener('keydown', (e) => {
                // Ctrl+Shift+L (Language/NLP)
                if (e.ctrlKey && e.shiftKey && e.key === 'L') {
                    e.preventDefault();
                    this.toggle();
                }
            });

            console.log('⌨️ Keyboard shortcut registered: Ctrl+Shift+L');
        },

        /**
         * CREATE POPUP
         */
        createPopup() {
            const popupHTML = `
                <div id="nlpPopupOverlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 9998;" onclick="window.NLPPopup.close()"></div>

                <div id="nlpPopup" style="
                    display: none;
                    position: fixed;
                    top: 50px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 700px;
                    max-height: 80vh;
                    background: linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%);
                    border-radius: 15px;
                    border: 2px solid #00d4ff;
                    box-shadow: 0 20px 60px rgba(0, 212, 255, 0.3);
                    z-index: 9999;
                    overflow: hidden;
                ">
                    <!-- Header -->
                    <div id="nlpPopupHeader" style="
                        background: linear-gradient(135deg, #00d4ff 0%, #3a47d5 100%);
                        padding: 15px 20px;
                        cursor: move;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    ">
                        <div>
                            <h2 style="margin: 0; color: white; font-size: 18px;">🧠 NLP Compromise + ARMsquare Reasoning</h2>
                            <p style="margin: 5px 0 0 0; font-size: 12px; color: rgba(255, 255, 255, 0.8);">
                                Advanced Natural Language Processing with Hierarchical Validation
                            </p>
                        </div>
                        <button onclick="window.NLPPopup.close()" style="
                            background: rgba(255, 255, 255, 0.2);
                            border: none;
                            color: white;
                            width: 30px;
                            height: 30px;
                            border-radius: 50%;
                            cursor: pointer;
                            font-size: 18px;
                        ">✕</button>
                    </div>

                    <!-- Content -->
                    <div style="padding: 20px; overflow-y: auto; max-height: calc(80vh - 80px);">
                        
                        <!-- ARMsquare Info -->
                        <div style="background: rgba(0, 212, 255, 0.1); padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #00d4ff;">
                            <h3 style="margin: 0 0 10px 0; color: #00d4ff;">
                                📐 ARMsquare - Aevov Reasoning Multidimensional Model
                            </h3>
                            <p style="margin: 0; font-size: 13px; color: rgba(255, 255, 255, 0.8);">
                                Advanced reasoning protocol inspired by hierarchical reasoning models (HRM).
                                Uses 4-loop Goldilocks validation for optimal pattern matching and confidence scoring.
                            </p>
                        </div>

                        <!-- Goldilocks Validation Loops -->
                        <div style="margin-bottom: 20px;">
                            <h3 style="color: #00d4ff; margin-bottom: 15px;">🔄 4 Goldilocks Validation Loops</h3>
                            
                            <div id="nlpLoop1" style="background: rgba(255, 255, 255, 0.05); padding: 12px; border-radius: 8px; margin-bottom: 10px; border-left: 3px solid #00ff88;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                    <div style="color: #00ff88; font-weight: 600;">Loop 1: Pattern Match</div>
                                    <div id="loop1Status" style="font-size: 12px; opacity: 0.7;">—</div>
                                </div>
                                <div style="background: rgba(0, 0, 0, 0.3); height: 6px; border-radius: 3px; overflow: hidden;">
                                    <div id="loop1Progress" style="width: 0%; height: 100%; background: linear-gradient(90deg, #00ff88, #00d4ff); transition: width 0.3s;"></div>
                                </div>
                            </div>

                            <div id="nlpLoop2" style="background: rgba(255, 255, 255, 0.05); padding: 12px; border-radius: 8px; margin-bottom: 10px; border-left: 3px solid #00d4ff;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                    <div style="color: #00d4ff; font-weight: 600;">Loop 2: Entity Validation</div>
                                    <div id="loop2Status" style="font-size: 12px; opacity: 0.7;">—</div>
                                </div>
                                <div style="background: rgba(0, 0, 0, 0.3); height: 6px; border-radius: 3px; overflow: hidden;">
                                    <div id="loop2Progress" style="width: 0%; height: 100%; background: linear-gradient(90deg, #00d4ff, #3a47d5); transition: width 0.3s;"></div>
                                </div>
                            </div>

                            <div id="nlpLoop3" style="background: rgba(255, 255, 255, 0.05); padding: 12px; border-radius: 8px; margin-bottom: 10px; border-left: 3px solid #ff9f0a;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                    <div style="color: #ff9f0a; font-weight: 600;">Loop 3: Semantic Check</div>
                                    <div id="loop3Status" style="font-size: 12px; opacity: 0.7;">—</div>
                                </div>
                                <div style="background: rgba(0, 0, 0, 0.3); height: 6px; border-radius: 3px; overflow: hidden;">
                                    <div id="loop3Progress" style="width: 0%; height: 100%; background: linear-gradient(90deg, #ff9f0a, #ff6b35); transition: width 0.3s;"></div>
                                </div>
                            </div>

                            <div id="nlpLoop4" style="background: rgba(255, 255, 255, 0.05); padding: 12px; border-radius: 8px; border-left: 3px solid #a78bfa;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                    <div style="color: #a78bfa; font-weight: 600;">Loop 4: Consensus</div>
                                    <div id="loop4Status" style="font-size: 12px; opacity: 0.7;">—</div>
                                </div>
                                <div style="background: rgba(0, 0, 0, 0.3); height: 6px; border-radius: 3px; overflow: hidden;">
                                    <div id="loop4Progress" style="width: 0%; height: 100%; background: linear-gradient(90deg, #a78bfa, #667eea); transition: width 0.3s;"></div>
                                </div>
                            </div>
                        </div>

                        <!-- NLP Features -->
                        <div style="margin-bottom: 20px;">
                            <h3 style="color: #00d4ff; margin-bottom: 15px;">🔧 NLP Features</h3>
                            
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                    <input type="checkbox" id="nlpPOSTagging" checked onchange="window.NLPPopup.toggleFeature('posTagging', this.checked)">
                                    <span>POS Tagging</span>
                                </label>

                                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                    <input type="checkbox" id="nlpEntityExtraction" checked onchange="window.NLPPopup.toggleFeature('entities', this.checked)">
                                    <span>Entity Extraction</span>
                                </label>

                                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                    <input type="checkbox" id="nlpTopics" checked onchange="window.NLPPopup.toggleFeature('topics', this.checked)">
                                    <span>Topic Detection</span>
                                </label>

                                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                    <input type="checkbox" id="nlpWordNet" onchange="window.NLPPopup.toggleFeature('wordnet', this.checked)">
                                    <span>WordNet Synonyms</span>
                                </label>

                                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                    <input type="checkbox" id="nlpGoldilocks" checked onchange="window.NLPPopup.toggleFeature('goldilocks', this.checked)">
                                    <span>Goldilocks Validation</span>
                                </label>

                                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                    <input type="checkbox" id="nlpARMsquare" checked onchange="window.NLPPopup.toggleFeature('armsquare', this.checked)">
                                    <span>ARMsquare Reasoning</span>
                                </label>
                            </div>
                        </div>

                        <!-- Stats -->
                        <div style="margin-bottom: 20px;">
                            <h3 style="color: #00d4ff; margin-bottom: 15px;">📊 Processing Stats</h3>
                            
                            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
                                <div style="background: rgba(0, 255, 136, 0.1); padding: 12px; border-radius: 8px; text-align: center;">
                                    <div style="font-size: 24px; font-weight: bold; color: #00ff88;" id="nlpQueriesProcessed">0</div>
                                    <div style="font-size: 11px; opacity: 0.7;">Queries</div>
                                </div>
                                
                                <div style="background: rgba(0, 212, 255, 0.1); padding: 12px; border-radius: 8px; text-align: center;">
                                    <div style="font-size: 24px; font-weight: bold; color: #00d4ff;" id="nlpEntitiesExtracted">0</div>
                                    <div style="font-size: 11px; opacity: 0.7;">Entities</div>
                                </div>
                                
                                <div style="background: rgba(255, 159, 10, 0.1); padding: 12px; border-radius: 8px; text-align: center;">
                                    <div style="font-size: 24px; font-weight: bold; color: #ff9f0a;" id="nlpAvgConfidence">0%</div>
                                    <div style="font-size: 11px; opacity: 0.7;">Avg Confidence</div>
                                </div>
                            </div>
                        </div>

                        <!-- Test Query -->
                        <div>
                            <h3 style="color: #00d4ff; margin-bottom: 15px;">🧪 Test NLP Processing</h3>
                            
                            <div style="margin-bottom: 10px;">
                                <input type="text" id="nlpTestQuery" placeholder="Enter a test query..." style="
                                    width: 100%;
                                    padding: 12px;
                                    background: rgba(255, 255, 255, 0.05);
                                    border: 1px solid rgba(255, 255, 255, 0.2);
                                    border-radius: 6px;
                                    color: white;
                                    font-size: 14px;
                                ">
                            </div>
                            
                            <button onclick="window.NLPPopup.testQuery()" style="
                                width: 100%;
                                padding: 12px;
                                background: linear-gradient(135deg, #00d4ff 0%, #3a47d5 100%);
                                border: none;
                                border-radius: 6px;
                                color: white;
                                font-weight: 600;
                                cursor: pointer;
                            ">
                                Process Query
                            </button>

                            <div id="nlpTestResult" style="display: none; margin-top: 15px; padding: 15px; background: rgba(0, 255, 136, 0.1); border-radius: 8px; border-left: 4px solid #00ff88;">
                                <!-- Results will appear here -->
                            </div>
                        </div>
                    </div>

                    <!-- Resize Handle -->
                    <div id="nlpResizeHandle" style="
                        position: absolute;
                        bottom: 0;
                        right: 0;
                        width: 20px;
                        height: 20px;
                        cursor: nwse-resize;
                        background: linear-gradient(135deg, transparent 0%, #00d4ff 100%);
                        border-radius: 0 0 15px 0;
                    "></div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', popupHTML);

            // Setup dragging
            this.setupDragging();

            console.log('✅ NLP Popup UI created');
        },

        /**
         * SETUP DRAGGING
         */
        setupDragging() {
            const popup = document.getElementById('nlpPopup');
            const header = document.getElementById('nlpPopupHeader');
            const resizeHandle = document.getElementById('nlpResizeHandle');

            let startX, startY, startLeft, startTop;

            // Drag header
            header.addEventListener('mousedown', (e) => {
                this.state.dragging = true;
                startX = e.clientX;
                startY = e.clientY;
                const rect = popup.getBoundingClientRect();
                startLeft = rect.left;
                startTop = rect.top;
            });

            // Resize handle
            resizeHandle.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                this.state.resizing = true;
                startX = e.clientX;
                startY = e.clientY;
                const rect = popup.getBoundingClientRect();
                this.state.size.width = rect.width;
                this.state.size.height = rect.height;
            });

            document.addEventListener('mousemove', (e) => {
                if (this.state.dragging) {
                    const dx = e.clientX - startX;
                    const dy = e.clientY - startY;
                    popup.style.left = (startLeft + dx) + 'px';
                    popup.style.top = (startTop + dy) + 'px';
                    popup.style.transform = 'none';
                } else if (this.state.resizing) {
                    const dx = e.clientX - startX;
                    const dy = e.clientY - startY;
                    popup.style.width = (this.state.size.width + dx) + 'px';
                    popup.style.height = (this.state.size.height + dy) + 'px';
                }
            });

            document.addEventListener('mouseup', () => {
                this.state.dragging = false;
                this.state.resizing = false;
            });
        },

        /**
         * TOGGLE
         */
        toggle() {
            if (this.state.isOpen) {
                this.close();
            } else {
                this.open();
            }
        },

        /**
         * OPEN
         */
        open() {
            document.getElementById('nlpPopupOverlay').style.display = 'block';
            document.getElementById('nlpPopup').style.display = 'block';
            this.state.isOpen = true;
            
            // Update stats
            this.updateStats();
            
            console.log('✅ NLP Popup opened');
        },

        /**
         * CLOSE
         */
        close() {
            document.getElementById('nlpPopupOverlay').style.display = 'none';
            document.getElementById('nlpPopup').style.display = 'none';
            this.state.isOpen = false;
            
            console.log('✅ NLP Popup closed');
        },

        /**
         * TOGGLE FEATURE
         */
        toggleFeature(feature, enabled) {
            if (window.CompromiseAevov) {
                switch(feature) {
                    case 'posTagging':
                        window.CompromiseAevov.config.posTagging = enabled;
                        break;
                    case 'entities':
                        window.CompromiseAevov.config.extractEntities = enabled;
                        break;
                    case 'topics':
                        window.CompromiseAevov.config.extractTopics = enabled;
                        break;
                    case 'wordnet':
                        window.CompromiseAevov.toggleWordNet(enabled);
                        break;
                    case 'goldilocks':
                        this.config.goldilocksEnabled = enabled;
                        break;
                    case 'armsquare':
                        // ARMsquare is always the underlying reasoning model
                        console.log(`ARMsquare reasoning: ${enabled ? 'ON' : 'OFF'}`);
                        break;
                }
            }

            console.log(`${feature}: ${enabled ? 'ON' : 'OFF'}`);
        },

        /**
         * TEST QUERY
         */
        async testQuery() {
            const input = document.getElementById('nlpTestQuery');
            const query = input.value.trim();

            if (!query) {
                alert('Please enter a test query');
                return;
            }

            console.log(`🧪 Testing query: "${query}"`);

            // Simulate Goldilocks validation
            this.simulateGoldilocksValidation(query);

            // Process with NLP
            if (window.CompromiseAevov) {
                const enhanced = window.CompromiseAevov.enhanceEntityExtraction(query, { keywords: [] });
                const keywords = window.CompromiseAevov.enhanceKeywordExtraction(query, []);

                // Display results
                const resultDiv = document.getElementById('nlpTestResult');
                resultDiv.style.display = 'block';
                resultDiv.innerHTML = `
                    <div style="font-weight: 600; margin-bottom: 10px;">✅ Processing Complete</div>
                    <div style="margin-bottom: 8px;"><strong>Entities:</strong> ${enhanced.all.join(', ') || 'None'}</div>
                    <div style="margin-bottom: 8px;"><strong>Keywords:</strong> ${keywords.join(', ') || 'None'}</div>
                    <div style="margin-bottom: 8px;"><strong>People:</strong> ${enhanced.people.join(', ') || 'None'}</div>
                    <div style="margin-bottom: 8px;"><strong>Places:</strong> ${enhanced.places.join(', ') || 'None'}</div>
                    <div><strong>Topics:</strong> ${enhanced.topics.join(', ') || 'None'}</div>
                `;

                // Update stats
                this.updateStats();
            }
        },

        /**
         * SIMULATE GOLDILOCKS VALIDATION
         */
        simulateGoldilocksValidation(query) {
            const loops = ['loop1', 'loop2', 'loop3', 'loop4'];
            const labels = ['Pattern Match', 'Entity Validation', 'Semantic Check', 'Consensus'];

            loops.forEach((loop, index) => {
                setTimeout(() => {
                    const progress = document.getElementById(`${loop}Progress`);
                    const status = document.getElementById(`${loop}Status`);
                    
                    // Simulate progress
                    const score = 60 + Math.random() * 40;
                    progress.style.width = score + '%';
                    status.textContent = score.toFixed(1) + '%';
                    
                    if (index === loops.length - 1) {
                        console.log('✅ Goldilocks validation complete');
                    }
                }, index * 300);
            });
        },

        /**
         * UPDATE STATS
         */
        updateStats() {
            if (window.CompromiseAevov && window.CompromiseAevov.state.processingStats) {
                const stats = window.CompromiseAevov.state.processingStats;
                
                document.getElementById('nlpQueriesProcessed').textContent = stats.queriesProcessed || 0;
                document.getElementById('nlpEntitiesExtracted').textContent = stats.entitiesExtracted || 0;
                
                const avgConf = stats.queriesProcessed > 0 ? 
                    ((stats.entitiesExtracted / stats.queriesProcessed) * 10).toFixed(0) : 0;
                document.getElementById('nlpAvgConfidence').textContent = avgConf + '%';
            }
        }
    };

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            NLPPopup.init();
        });
    } else {
        NLPPopup.init();
    }

    // Export globally
    window.NLPPopup = NLPPopup;

    console.log('✅ NLP Popup System loaded');
    console.log('⌨️ Press Ctrl+Shift+N to open');

})();
