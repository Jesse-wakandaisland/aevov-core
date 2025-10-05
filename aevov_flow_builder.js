/**
 * AEVOV FLOW BUILDER
 * Typebot-style visual block system for configuring and connecting all Aevov components
 * 
 * Features:
 * - Drag-and-drop block interface
 * - Deep integration with all Aevov systems
 * - Auto-configuration and self-learning
 * - Template generation and management
 * - Flow testing and simulation
 * - Onboarding automation
 */

(function() {
    'use strict';

    console.log('🎨 Loading Aevov Flow Builder...');

    const AevovFlowBuilder = {
        version: '1.0.0',

        state: {
            canvas: null,
            blocks: [],
            connections: [],
            selectedBlock: null,
            draggedBlock: null,
            isDragging: false,
            zoom: 1,
            pan: { x: 0, y: 0 },
            flows: [],
            currentFlow: null,
            templates: []
        },

        blockTypes: {
            // Input blocks
            textInput: {
                category: 'Input',
                icon: '📝',
                name: 'Text Input',
                description: 'Capture text input from user',
                config: {
                    placeholder: 'Enter text...',
                    multiline: false,
                    validation: 'none',
                    required: true
                },
                outputs: ['text']
            },
            voiceInput: {
                category: 'Input',
                icon: '🎤',
                name: 'Voice Input',
                description: 'Capture voice input via Supernova',
                config: {
                    language: 'en-US',
                    continuous: false,
                    interimResults: true
                },
                outputs: ['transcript', 'confidence']
            },
            fileUpload: {
                category: 'Input',
                icon: '📁',
                name: 'File Upload',
                description: 'Upload files to storage',
                config: {
                    accept: '*/*',
                    maxSize: 10485760,
                    storage: 'cubbit'
                },
                outputs: ['file', 'url']
            },

            // Processing blocks
            patternExtraction: {
                category: 'Processing',
                icon: '⚗️',
                name: 'Pattern Extraction',
                description: 'Extract patterns from LLM',
                config: {
                    sourceModel: 'gpt4',
                    targetCount: 1000000,
                    diversityThreshold: 0.7
                },
                inputs: ['trigger'],
                outputs: ['patterns', 'count', 'model']
            },
            aevInference: {
                category: 'Processing',
                icon: '🧠',
                name: 'AEV Inference',
                description: 'Run inference on .aev model',
                config: {
                    modelPath: '',
                    threshold: 0.75,
                    maxResults: 5
                },
                inputs: ['query', 'model'],
                outputs: ['response', 'confidence', 'patterns']
            },
            consensusValidation: {
                category: 'Processing',
                icon: '🔐',
                name: 'Consensus Validation',
                description: 'Validate via consensus network',
                config: {
                    votingThreshold: 0.67,
                    minNodes: 3,
                    timeout: 5000
                },
                inputs: ['data'],
                outputs: ['validated', 'score', 'votes']
            },
            patternMatching: {
                category: 'Processing',
                icon: '🎯',
                name: 'Pattern Matching',
                description: 'Match against pattern database',
                config: {
                    similarity: 'cosine',
                    threshold: 0.8,
                    topK: 10
                },
                inputs: ['query', 'patterns'],
                outputs: ['matches', 'scores']
            },

            // Storage blocks
            saveToStorage: {
                category: 'Storage',
                icon: '💾',
                name: 'Save to Storage',
                description: 'Store data in configured provider',
                config: {
                    provider: 'cubbit',
                    path: '',
                    encrypt: true,
                    replicate: true
                },
                inputs: ['data', 'metadata'],
                outputs: ['url', 'success']
            },
            loadFromStorage: {
                category: 'Storage',
                icon: '📥',
                name: 'Load from Storage',
                description: 'Retrieve data from storage',
                config: {
                    provider: 'cubbit',
                    path: '',
                    decrypt: true
                },
                inputs: ['path'],
                outputs: ['data', 'metadata']
            },

            // Logic blocks
            condition: {
                category: 'Logic',
                icon: '🔀',
                name: 'Condition',
                description: 'Branch based on condition',
                config: {
                    operator: 'equals',
                    value: '',
                    caseSensitive: false
                },
                inputs: ['input'],
                outputs: ['true', 'false']
            },
            loop: {
                category: 'Logic',
                icon: '🔄',
                name: 'Loop',
                description: 'Repeat actions',
                config: {
                    type: 'forEach',
                    maxIterations: 100
                },
                inputs: ['array'],
                outputs: ['item', 'index', 'done']
            },
            merge: {
                category: 'Logic',
                icon: '🔗',
                name: 'Merge',
                description: 'Combine multiple inputs',
                config: {
                    strategy: 'waitAll',
                    timeout: 10000
                },
                inputs: ['input1', 'input2', 'input3'],
                outputs: ['merged']
            },

            // Output blocks
            textOutput: {
                category: 'Output',
                icon: '💬',
                name: 'Text Output',
                description: 'Display text to user',
                config: {
                    format: 'plain',
                    typing: true,
                    speed: 50
                },
                inputs: ['text'],
                outputs: []
            },
            voiceOutput: {
                category: 'Output',
                icon: '🔊',
                name: 'Voice Output',
                description: 'Speak via Supernova',
                config: {
                    priority: false,
                    speed: 1.0,
                    voice: 'default'
                },
                inputs: ['text'],
                outputs: ['spoken']
            },
            notification: {
                category: 'Output',
                icon: '🔔',
                name: 'Notification',
                description: 'Show notification',
                config: {
                    type: 'info',
                    duration: 4000,
                    position: 'top-right'
                },
                inputs: ['title', 'message'],
                outputs: []
            },

            // Integration blocks
            cmsGeneration: {
                category: 'Integration',
                icon: '🏗️',
                name: 'CMS Generation',
                description: 'Generate CMS app',
                config: {
                    platform: 'wordpress',
                    autoUpload: true,
                    deploy: false
                },
                inputs: ['config'],
                outputs: ['app', 'files']
            },
            webhookTrigger: {
                category: 'Integration',
                icon: '🪝',
                name: 'Webhook',
                description: 'Trigger on webhook',
                config: {
                    method: 'POST',
                    path: '/webhook',
                    auth: 'none'
                },
                inputs: [],
                outputs: ['body', 'headers']
            },
            apiCall: {
                category: 'Integration',
                icon: '🌐',
                name: 'API Call',
                description: 'Make external API request',
                config: {
                    url: '',
                    method: 'GET',
                    headers: {},
                    timeout: 30000
                },
                inputs: ['params', 'body'],
                outputs: ['response', 'status']
            },

            // Testing blocks
            testRunner: {
                category: 'Testing',
                icon: '🧪',
                name: 'Test Runner',
                description: 'Run benchmark tests',
                config: {
                    benchmark: 'mmlu',
                    model: '',
                    threshold: 0.7
                },
                inputs: ['model'],
                outputs: ['results', 'score', 'passed']
            },
            simulator: {
                category: 'Testing',
                icon: '🎮',
                name: 'Simulator',
                description: 'Simulate user interactions',
                config: {
                    scenario: 'default',
                    iterations: 10,
                    randomize: true
                },
                inputs: ['flow'],
                outputs: ['results', 'metrics']
            }
        },

        templates: {
            onboarding: {
                name: 'User Onboarding Flow',
                description: 'Complete onboarding sequence',
                blocks: [
                    { type: 'textInput', x: 100, y: 100, config: { placeholder: 'Enter your name' } },
                    { type: 'textOutput', x: 100, y: 250, config: { text: 'Welcome {{input}}!' } },
                    { type: 'voiceInput', x: 100, y: 400, config: {} },
                    { type: 'consensusValidation', x: 400, y: 400, config: {} },
                    { type: 'notification', x: 700, y: 400, config: { type: 'success' } }
                ]
            },
            patternPipeline: {
                name: 'Pattern Extraction Pipeline',
                description: 'Extract and validate patterns',
                blocks: [
                    { type: 'patternExtraction', x: 100, y: 100, config: {} },
                    { type: 'consensusValidation', x: 400, y: 100, config: {} },
                    { type: 'saveToStorage', x: 700, y: 100, config: {} },
                    { type: 'notification', x: 1000, y: 100, config: {} }
                ]
            },
            inferenceChain: {
                name: 'AEV Inference Chain',
                description: 'Query processing and response',
                blocks: [
                    { type: 'textInput', x: 100, y: 100, config: {} },
                    { type: 'aevInference', x: 400, y: 100, config: {} },
                    { type: 'condition', x: 700, y: 100, config: { operator: 'greaterThan', value: 0.8 } },
                    { type: 'textOutput', x: 700, y: 250, config: {} },
                    { type: 'voiceOutput', x: 700, y: 400, config: {} }
                ]
            }
        },

        init() {
            console.log('⚡ Initializing Aevov Flow Builder...');
            
            this.createCanvas();
            this.setupEventListeners();
            this.loadSavedFlows();
            this.registerKeyboardShortcuts();
            
            console.log('✅ Flow Builder ready!');
        },

        createCanvas() {
            const ui = `
                <div id="flowBuilderContainer" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #0a0a0a; z-index: 9999999;">
                    
                    <!-- Top Toolbar -->
                    <div id="flowToolbar" style="
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        height: 60px;
                        background: linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%);
                        border-bottom: 2px solid #00d4ff;
                        display: flex;
                        align-items: center;
                        padding: 0 20px;
                        gap: 15px;
                        z-index: 10;
                    ">
                        <button onclick="window.AevovFlowBuilder.closeBuilder()" style="
                            background: rgba(255, 107, 107, 0.2);
                            border: 2px solid #ff6b6b;
                            color: #ff6b6b;
                            padding: 8px 15px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">✕ Close</button>

                        <div style="width: 2px; height: 30px; background: rgba(255,255,255,0.1);"></div>

                        <button onclick="window.AevovFlowBuilder.newFlow()" style="
                            background: rgba(0, 212, 255, 0.2);
                            border: 2px solid #00d4ff;
                            color: #00d4ff;
                            padding: 8px 15px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">📄 New</button>

                        <button onclick="window.AevovFlowBuilder.saveFlow()" style="
                            background: rgba(0, 255, 136, 0.2);
                            border: 2px solid #00ff88;
                            color: #00ff88;
                            padding: 8px 15px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">💾 Save</button>

                        <button onclick="window.AevovFlowBuilder.loadFlow()" style="
                            background: rgba(255, 159, 10, 0.2);
                            border: 2px solid #ff9f0a;
                            color: #ff9f0a;
                            padding: 8px 15px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">📂 Load</button>

                        <div style="width: 2px; height: 30px; background: rgba(255,255,255,0.1);"></div>

                        <button onclick="window.AevovFlowBuilder.testFlow()" style="
                            background: rgba(138, 43, 226, 0.2);
                            border: 2px solid #8a2be2;
                            color: #8a2be2;
                            padding: 8px 15px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">🧪 Test Flow</button>

                        <button onclick="window.AevovFlowBuilder.autoConfig()" style="
                            background: rgba(255, 215, 0, 0.2);
                            border: 2px solid #ffd700;
                            color: #ffd700;
                            padding: 8px 15px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">🤖 Auto-Configure</button>

                        <div style="flex: 1;"></div>

                        <div style="color: white; font-size: 14px;">
                            Zoom: <span id="zoomLevel">100%</span>
                        </div>

                        <button onclick="window.AevovFlowBuilder.zoomIn()" style="
                            background: rgba(255, 255, 255, 0.1);
                            border: 1px solid rgba(255, 255, 255, 0.2);
                            color: white;
                            padding: 8px 12px;
                            border-radius: 6px;
                            cursor: pointer;
                        ">+</button>

                        <button onclick="window.AevovFlowBuilder.zoomOut()" style="
                            background: rgba(255, 255, 255, 0.1);
                            border: 1px solid rgba(255, 255, 255, 0.2);
                            color: white;
                            padding: 8px 12px;
                            border-radius: 6px;
                            cursor: pointer;
                        ">−</button>
                    </div>

                    <!-- Left Sidebar - Block Palette -->
                    <div id="blockPalette" style="
                        position: absolute;
                        top: 60px;
                        left: 0;
                        width: 280px;
                        bottom: 0;
                        background: linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%);
                        border-right: 2px solid #00d4ff;
                        overflow-y: auto;
                        padding: 20px;
                    ">
                        <h3 style="color: #00d4ff; margin-top: 0;">🎨 Block Palette</h3>
                        <div id="blockList"></div>
                    </div>

                    <!-- Main Canvas -->
                    <canvas id="flowCanvas" style="
                        position: absolute;
                        top: 60px;
                        left: 280px;
                        right: 320px;
                        bottom: 0;
                        cursor: grab;
                    "></canvas>

                    <!-- Right Sidebar - Properties -->
                    <div id="propertiesPanel" style="
                        position: absolute;
                        top: 60px;
                        right: 0;
                        width: 320px;
                        bottom: 0;
                        background: linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%);
                        border-left: 2px solid #00d4ff;
                        overflow-y: auto;
                        padding: 20px;
                    ">
                        <h3 style="color: #00d4ff; margin-top: 0;">⚙️ Properties</h3>
                        <div id="propertiesContent" style="color: rgba(255,255,255,0.6); text-align: center; padding: 40px 0;">
                            Select a block to edit properties
                        </div>
                    </div>

                    <!-- Connection Line SVG Overlay -->
                    <svg id="connectionsSvg" style="
                        position: absolute;
                        top: 60px;
                        left: 280px;
                        right: 320px;
                        bottom: 0;
                        pointer-events: none;
                        z-index: 1;
                    "></svg>

                </div>

                <button onclick="window.AevovFlowBuilder.openBuilder()" style="
                    position: fixed;
                    top: 50%;
                    right: 80px;
                    transform: translateY(-50%);
                    background: linear-gradient(135deg, #00d4ff, #0099cc);
                    border: none;
                    color: white;
                    padding: 15px;
                    border-radius: 10px 0 0 10px;
                    cursor: pointer;
                    box-shadow: -4px 0 20px rgba(0, 212, 255, 0.4);
                    z-index: 9999995;
                    writing-mode: vertical-rl;
                    font-weight: 600;
                    font-size: 14px;
                ">🎨 FLOW BUILDER</button>
            `;

            document.body.insertAdjacentHTML('beforeend', ui);

            this.state.canvas = document.getElementById('flowCanvas');
            this.state.ctx = this.state.canvas.getContext('2d');

            this.resizeCanvas();
            this.renderBlockPalette();
        },

        resizeCanvas() {
            const canvas = this.state.canvas;
            canvas.width = canvas.offsetWidth * window.devicePixelRatio;
            canvas.height = canvas.offsetHeight * window.devicePixelRatio;
            canvas.style.width = canvas.offsetWidth + 'px';
            canvas.style.height = canvas.offsetHeight + 'px';
            this.state.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            this.render();
        },

        renderBlockPalette() {
            const container = document.getElementById('blockList');
            
            const categories = {};
            Object.entries(this.blockTypes).forEach(([key, block]) => {
                if (!categories[block.category]) {
                    categories[block.category] = [];
                }
                categories[block.category].push({ key, ...block });
            });

            container.innerHTML = Object.entries(categories).map(([category, blocks]) => `
                <div style="margin-bottom: 25px;">
                    <div style="color: rgba(255,255,255,0.5); font-size: 11px; font-weight: 600; text-transform: uppercase; margin-bottom: 10px;">${category}</div>
                    ${blocks.map(block => `
                        <div class="block-palette-item" data-type="${block.key}" draggable="true" style="
                            padding: 12px;
                            background: rgba(0, 212, 255, 0.1);
                            border: 2px solid rgba(0, 212, 255, 0.3);
                            border-radius: 8px;
                            margin-bottom: 8px;
                            cursor: move;
                            transition: all 0.2s;
                        ">
                            <div style="color: white; font-weight: 600; font-size: 14px;">
                                ${block.icon} ${block.name}
                            </div>
                            <div style="color: rgba(255,255,255,0.6); font-size: 11px; margin-top: 4px;">
                                ${block.description}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `).join('');

            document.querySelectorAll('.block-palette-item').forEach(item => {
                item.addEventListener('dragstart', (e) => this.handleBlockDragStart(e));
                item.addEventListener('mouseenter', (e) => {
                    e.target.style.background = 'rgba(0, 212, 255, 0.2)';
                    e.target.style.borderColor = '#00d4ff';
                });
                item.addEventListener('mouseleave', (e) => {
                    e.target.style.background = 'rgba(0, 212, 255, 0.1)';
                    e.target.style.borderColor = 'rgba(0, 212, 255, 0.3)';
                });
            });
        },

        setupEventListeners() {
            const canvas = this.state.canvas;

            canvas.addEventListener('dragover', (e) => {
                e.preventDefault();
            });

            canvas.addEventListener('drop', (e) => this.handleCanvasDrop(e));
            canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
            canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
            canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
            canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));

            window.addEventListener('resize', () => this.resizeCanvas());
        },

        handleBlockDragStart(e) {
            e.dataTransfer.setData('blockType', e.target.dataset.type);
        },

        handleCanvasDrop(e) {
            e.preventDefault();
            
            const blockType = e.dataTransfer.getData('blockType');
            if (!blockType) return;

            const rect = this.state.canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left) / this.state.zoom - this.state.pan.x;
            const y = (e.clientY - rect.top) / this.state.zoom - this.state.pan.y;

            this.addBlock(blockType, x, y);
        },

        addBlock(type, x, y) {
            const blockDef = this.blockTypes[type];
            
            const block = {
                id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                type: type,
                x: x,
                y: y,
                width: 200,
                height: 80,
                ...blockDef,
                config: { ...blockDef.config }
            };

            this.state.blocks.push(block);
            this.render();
            
            console.log('➕ Block added:', block.name);
        },

        render() {
            const ctx = this.state.ctx;
            const canvas = this.state.canvas;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.save();
            ctx.translate(this.state.pan.x, this.state.pan.y);
            ctx.scale(this.state.zoom, this.state.zoom);

            this.renderConnections();
            this.renderBlocks();

            ctx.restore();
        },

        renderBlocks() {
            const ctx = this.state.ctx;

            this.state.blocks.forEach(block => {
                const isSelected = this.state.selectedBlock?.id === block.id;

                ctx.fillStyle = isSelected 
                    ? 'rgba(0, 212, 255, 0.2)' 
                    : 'rgba(26, 26, 46, 0.95)';
                ctx.strokeStyle = isSelected ? '#00d4ff' : 'rgba(0, 212, 255, 0.5)';
                ctx.lineWidth = isSelected ? 3 : 2;

                ctx.beginPath();
                ctx.roundRect(block.x, block.y, block.width, block.height, 10);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = 'white';
                ctx.font = 'bold 14px sans-serif';
                ctx.fillText(`${block.icon} ${block.name}`, block.x + 15, block.y + 30);

                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                ctx.font = '11px sans-serif';
                ctx.fillText(block.description.substring(0, 25) + '...', block.x + 15, block.y + 50);

                if (block.inputs) {
                    block.inputs.forEach((input, i) => {
                        const portY = block.y + 20 + i * 20;
                        ctx.fillStyle = '#00d4ff';
                        ctx.beginPath();
                        ctx.arc(block.x, portY, 6, 0, Math.PI * 2);
                        ctx.fill();
                    });
                }

                if (block.outputs) {
                    block.outputs.forEach((output, i) => {
                        const portY = block.y + 20 + i * 20;
                        ctx.fillStyle = '#00ff88';
                        ctx.beginPath();
                        ctx.arc(block.x + block.width, portY, 6, 0, Math.PI * 2);
                        ctx.fill();
                    });
                }
            });
        },

        renderConnections() {
            const ctx = this.state.ctx;

            this.state.connections.forEach(conn => {
                const fromBlock = this.state.blocks.find(b => b.id === conn.from.blockId);
                const toBlock = this.state.blocks.find(b => b.id === conn.to.blockId);

                if (!fromBlock || !toBlock) return;

                const fromX = fromBlock.x + fromBlock.width;
                const fromY = fromBlock.y + 30;
                const toX = toBlock.x;
                const toY = toBlock.y + 30;

                ctx.strokeStyle = 'rgba(0, 255, 136, 0.6)';
                ctx.lineWidth = 2;

                ctx.beginPath();
                ctx.moveTo(fromX, fromY);
                
                const cpX1 = fromX + 50;
                const cpX2 = toX - 50;
                ctx.bezierCurveTo(cpX1, fromY, cpX2, toY, toX, toY);
                
                ctx.stroke();
            });
        },

        handleCanvasClick(e) {
            const rect = this.state.canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left) / this.state.zoom - this.state.pan.x;
            const y = (e.clientY - rect.top) / this.state.zoom - this.state.pan.y;

            const clickedBlock = this.state.blocks.find(block => 
                x >= block.x && x <= block.x + block.width &&
                y >= block.y && y <= block.y + block.height
            );

            if (clickedBlock) {
                this.selectBlock(clickedBlock);
            } else {
                this.state.selectedBlock = null;
                this.updatePropertiesPanel(null);
            }

            this.render();
        },

        selectBlock(block) {
            this.state.selectedBlock = block;
            this.updatePropertiesPanel(block);
            console.log('📍 Selected:', block.name);
        },

        updatePropertiesPanel(block) {
            const container = document.getElementById('propertiesContent');
            
            if (!block) {
                container.innerHTML = `
                    <div style="color: rgba(255,255,255,0.6); text-align: center; padding: 40px 0;">
                        Select a block to edit properties
                    </div>
                `;
                return;
            }

            container.innerHTML = `
                <div style="margin-bottom: 20px;">
                    <div style="color: white; font-weight: 600; font-size: 16px; margin-bottom: 5px;">
                        ${block.icon} ${block.name}
                    </div>
                    <div style="color: rgba(255,255,255,0.6); font-size: 12px;">
                        ${block.description}
                    </div>
                </div>

                <div style="background: rgba(0, 212, 255, 0.1); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <div style="color: #00d4ff; font-weight: 600; margin-bottom: 10px;">Configuration</div>
                    ${this.renderConfigFields(block)}
                </div>

                <button onclick="window.AevovFlowBuilder.deleteBlock('${block.id}')" style="
                    width: 100%;
                    padding: 10px;
                    background: rgba(255, 107, 107, 0.2);
                    border: 2px solid #ff6b6b;
                    color: #ff6b6b;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                ">🗑️ Delete Block</button>
            `;
        },

        renderConfigFields(block) {
            return Object.entries(block.config).map(([key, value]) => {
                const type = typeof value;
                
                if (type === 'boolean') {
                    return `
                        <div style="margin-bottom: 15px;">
                            <label style="color: white; display: flex; align-items: center; gap: 10px;">
                                <input type="checkbox" ${value ? 'checked' : ''} 
                                    onchange="window.AevovFlowBuilder.updateConfig('${block.id}', '${key}', this.checked)">
                                <span>${key}</span>
                            </label>
                        </div>
                    `;
                } else if (type === 'number') {
                    return `
                        <div style="margin-bottom: 15px;">
                            <label style="color: white; display: block; margin-bottom: 5px;">${key}</label>
                            <input type="number" value="${value}" 
                                onchange="window.AevovFlowBuilder.updateConfig('${block.id}', '${key}', parseFloat(this.value))"
                                style="
                                    width: 100%;
                                    padding: 8px;
                                    background: rgba(0, 0, 0, 0.3);
                                    border: 2px solid rgba(255, 255, 255, 0.2);
                                    border-radius: 6px;
                                    color: white;
                                ">
                        </div>
                    `;
                } else {
                    return `
                        <div style="margin-bottom: 15px;">
                            <label style="color: white; display: block; margin-bottom: 5px;">${key}</label>
                            <input type="text" value="${value}" 
                                onchange="window.AevovFlowBuilder.updateConfig('${block.id}', '${key}', this.value)"
                                style="
                                    width: 100%;
                                    padding: 8px;
                                    background: rgba(0, 0, 0, 0.3);
                                    border: 2px solid rgba(255, 255, 255, 0.2);
                                    border-radius: 6px;
                                    color: white;
                                ">
                        </div>
                    `;
                }
            }).join('');
        },

        updateConfig(blockId, key, value) {
            const block = this.state.blocks.find(b => b.id === blockId);
            if (block) {
                block.config[key] = value;
                console.log(`⚙️ Updated ${block.name}.${key} = ${value}`);
            }
        },

        deleteBlock(blockId) {
            this.state.blocks = this.state.blocks.filter(b => b.id !== blockId);
            this.state.connections = this.state.connections.filter(
                c => c.from.blockId !== blockId && c.to.blockId !== blockId
            );
            this.state.selectedBlock = null;
            this.updatePropertiesPanel(null);
            this.render();
            console.log('🗑️ Block deleted');
        },

        handleMouseDown(e) {
            if (e.button === 1 || e.shiftKey) {
                this.state.isDragging = true;
                this.state.dragStart = { x: e.clientX - this.state.pan.x, y: e.clientY - this.state.pan.y };
                this.state.canvas.style.cursor = 'grabbing';
            }
        },

        handleMouseMove(e) {
            if (this.state.isDragging) {
                this.state.pan.x = e.clientX - this.state.dragStart.x;
                this.state.pan.y = e.clientY - this.state.dragStart.y;
                this.render();
            }
        },

        handleMouseUp() {
            this.state.isDragging = false;
            this.state.canvas.style.cursor = 'grab';
        },

        zoomIn() {
            this.state.zoom = Math.min(this.state.zoom * 1.2, 3);
            document.getElementById('zoomLevel').textContent = Math.round(this.state.zoom * 100) + '%';
            this.render();
        },

        zoomOut() {
            this.state.zoom = Math.max(this.state.zoom / 1.2, 0.3);
            document.getElementById('zoomLevel').textContent = Math.round(this.state.zoom * 100) + '%';
            this.render();
        },

        async autoConfig() {
            console.log('🤖 Auto-configuring flow...');
            
            // Implement auto-configuration logic here
            this.showNotification('🤖 Auto-Config', 'Analyzing flow and optimizing connections...');
        },

        async testFlow() {
            console.log('🧪 Testing flow...');
            
            // Implement flow testing logic here
            this.showNotification('🧪 Test Started', 'Running flow simulation...');
        },

        newFlow() {
            if (confirm('Create new flow? Unsaved changes will be lost.')) {
                this.state.blocks = [];
                this.state.connections = [];
                this.state.selectedBlock = null;
                this.state.currentFlow = null;
                this.updatePropertiesPanel(null);
                this.render();
            }
        },

        saveFlow() {
            const flow = {
                id: this.state.currentFlow?.id || `flow_${Date.now()}`,
                name: prompt('Flow name:', this.state.currentFlow?.name || 'Untitled Flow'),
                blocks: this.state.blocks,
                connections: this.state.connections,
                timestamp: Date.now()
            };

            this.state.flows.push(flow);
            localStorage.setItem('aevov_flows', JSON.stringify(this.state.flows));
            
            this.showNotification('💾 Saved', `Flow "${flow.name}" saved successfully`);
        },

        loadFlow() {
            // Implement flow loading UI
            console.log('📂 Loading flow...');
        },

        loadSavedFlows() {
            const saved = localStorage.getItem('aevov_flows');
            if (saved) {
                this.state.flows = JSON.parse(saved);
            }
        },

        registerKeyboardShortcuts() {
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.shiftKey && e.key === 'F') {
                    e.preventDefault();
                    this.openBuilder();
                }
            });
        },

        openBuilder() {
            document.getElementById('flowBuilderContainer').style.display = 'block';
            this.resizeCanvas();
        },

        closeBuilder() {
            document.getElementById('flowBuilderContainer').style.display = 'none';
        },

        showNotification(title, message) {
            const notif = document.createElement('div');
            notif.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                background: linear-gradient(135deg, #00d4ff, #0099cc);
                color: white;
                padding: 20px;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0, 212, 255, 0.5);
                z-index: 100000003;
                max-width: 350px;
            `;

            notif.innerHTML = `
                <div style="font-weight: 600; font-size: 16px; margin-bottom: 5px;">${title}</div>
                <div style="opacity: 0.9; font-size: 14px;">${message}</div>
            `;

            document.body.appendChild(notif);
            setTimeout(() => notif.remove(), 4000);
        }
    };

    window.AevovFlowBuilder = AevovFlowBuilder;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => AevovFlowBuilder.init());
    } else {
        AevovFlowBuilder.init();
    }

    console.log('✅ Aevov Flow Builder loaded');
    console.log('⌨️ Press Ctrl+Shift+F to open');

})();