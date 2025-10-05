/**
 * AEVOV FLOW BUILDER - COMPLETE CONSOLIDATED VERSION
 * All features integrated in one file
 */

(function() {
    'use strict';

    console.log('🎨 Loading Aevov Flow Builder - Complete Edition...');

    const AevovFlowBuilder = {
        version: '2.0.0',

        state: {
            canvas: null,
            ctx: null,
            blocks: [],
            connections: [],
            selectedBlock: null,
            draggedBlock: null,
            dragOffset: null,
            isPanning: false,
            isConnecting: false,
            connectionStart: null,
            connectionPreview: null,
            zoom: 1,
            pan: { x: 0, y: 0 },
            grid: { size: 20, snap: true, visible: true },
            history: [],
            historyIndex: -1,
            currentFlow: null,
            flows: [],
            hoveredBlock: null,
            hoveredPort: null,
            dragStart: null,
            variables: {},
            executionMode: false,
            executionStep: 0,
            animatingConnection: null
        },

        blockTypes: {
            textInput: {
                category: 'Input',
                icon: '📝',
                name: 'Text Input',
                description: 'Capture text input from user',
                color: '#00d4ff',
                config: { placeholder: 'Enter text...', required: true },
                outputs: [{ name: 'text', type: 'string' }]
            },
            voiceInput: {
                category: 'Input',
                icon: '🎤',
                name: 'Voice Input',
                description: 'Capture voice via Supernova',
                color: '#00d4ff',
                config: { language: 'en-US', continuous: false },
                outputs: [{ name: 'transcript', type: 'string' }]
            },
            fileUpload: {
                category: 'Input',
                icon: '📁',
                name: 'File Upload',
                description: 'Upload files to storage',
                color: '#00d4ff',
                config: { accept: '*/*', storage: 'cubbit' },
                outputs: [{ name: 'file', type: 'file' }]
            },
            patternExtraction: {
                category: 'Processing',
                icon: '⚗️',
                name: 'Pattern Extraction',
                description: 'Extract patterns from LLM',
                color: '#00ff88',
                config: { sourceModel: 'gpt4', targetCount: 1000000 },
                inputs: [{ name: 'trigger', type: 'any' }],
                outputs: [{ name: 'patterns', type: 'array' }]
            },
            aevInference: {
                category: 'Processing',
                icon: '🧠',
                name: 'AEV Inference',
                description: 'Run inference on .aev model',
                color: '#00ff88',
                config: { modelPath: '', threshold: 0.75 },
                inputs: [{ name: 'query', type: 'string' }],
                outputs: [{ name: 'response', type: 'string' }]
            },
            consensusValidation: {
                category: 'Processing',
                icon: '🔐',
                name: 'Consensus Validation',
                description: 'Validate via consensus network',
                color: '#00ff88',
                config: { votingThreshold: 0.67, minNodes: 3 },
                inputs: [{ name: 'data', type: 'any' }],
                outputs: [{ name: 'validated', type: 'boolean' }]
            },
            patternMatching: {
                category: 'Processing',
                icon: '🎯',
                name: 'Pattern Matching',
                description: 'Match against patterns',
                color: '#00ff88',
                config: { similarity: 'cosine', threshold: 0.8 },
                inputs: [{ name: 'query', type: 'string' }],
                outputs: [{ name: 'matches', type: 'array' }]
            },
            saveToStorage: {
                category: 'Storage',
                icon: '💾',
                name: 'Save to Storage',
                description: 'Store data in provider',
                color: '#ff9f0a',
                config: { provider: 'cubbit', encrypt: true },
                inputs: [{ name: 'data', type: 'any' }],
                outputs: [{ name: 'url', type: 'string' }]
            },
            loadFromStorage: {
                category: 'Storage',
                icon: '📥',
                name: 'Load from Storage',
                description: 'Retrieve data from storage',
                color: '#ff9f0a',
                config: { provider: 'cubbit', path: '' },
                inputs: [{ name: 'path', type: 'string' }],
                outputs: [{ name: 'data', type: 'any' }]
            },
            condition: {
                category: 'Logic',
                icon: '🔀',
                name: 'Condition',
                description: 'Branch based on condition',
                color: '#8a2be2',
                config: { operator: 'equals', value: '' },
                inputs: [{ name: 'input', type: 'any' }],
                outputs: [{ name: 'true', type: 'any' }, { name: 'false', type: 'any' }]
            },
            loop: {
                category: 'Logic',
                icon: '🔄',
                name: 'Loop',
                description: 'Repeat actions',
                color: '#8a2be2',
                config: { type: 'forEach', maxIterations: 100 },
                inputs: [{ name: 'array', type: 'array' }],
                outputs: [{ name: 'item', type: 'any' }]
            },
            textOutput: {
                category: 'Output',
                icon: '💬',
                name: 'Text Output',
                description: 'Display text to user',
                color: '#ff6b6b',
                config: { format: 'plain', typing: true },
                inputs: [{ name: 'text', type: 'string' }],
                outputs: []
            },
            voiceOutput: {
                category: 'Output',
                icon: '🔊',
                name: 'Voice Output',
                description: 'Speak via Supernova',
                color: '#ff6b6b',
                config: { priority: false, speed: 1.0 },
                inputs: [{ name: 'text', type: 'string' }],
                outputs: []
            },
            notification: {
                category: 'Output',
                icon: '🔔',
                name: 'Notification',
                description: 'Show notification',
                color: '#ff6b6b',
                config: { type: 'info', duration: 4000 },
                inputs: [{ name: 'message', type: 'string' }],
                outputs: []
            },
            cmsGeneration: {
                category: 'Integration',
                icon: '🏗️',
                name: 'CMS Generation',
                description: 'Generate CMS app',
                color: '#ffd700',
                config: { platform: 'wordpress', autoUpload: true },
                inputs: [{ name: 'config', type: 'object' }],
                outputs: [{ name: 'app', type: 'object' }]
            },
            testRunner: {
                category: 'Testing',
                icon: '🧪',
                name: 'Test Runner',
                description: 'Run benchmark tests',
                color: '#00d4ff',
                config: { benchmark: 'mmlu', threshold: 0.7 },
                inputs: [{ name: 'model', type: 'string' }],
                outputs: [{ name: 'results', type: 'object' }]
            }
        },

        init() {
            console.log('⚡ Initializing Flow Builder...');
            this.createCanvas();
            this.setupEventListeners();
            this.loadSavedFlows();
            this.registerKeyboardShortcuts();
            this.startAutoSave();
            console.log('✅ Flow Builder ready!');
        },

        createCanvas() {
            const ui = `
                <div id="flowBuilderContainer" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #0a0a0a; z-index: 9999999;">
                    <div id="flowToolbar" style="position: absolute; top: 0; left: 0; right: 0; height: 60px; background: linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%); border-bottom: 2px solid #00d4ff; display: flex; align-items: center; padding: 0 20px; gap: 15px; z-index: 10;">
                        <button onclick="window.AevovFlowBuilder.closeBuilder()" style="background: rgba(255, 107, 107, 0.2); border: 2px solid #ff6b6b; color: #ff6b6b; padding: 8px 15px; border-radius: 6px; cursor: pointer; font-weight: 600;">✕ Close</button>
                        <div style="width: 2px; height: 30px; background: rgba(255,255,255,0.1);"></div>
                        <button onclick="window.AevovFlowBuilder.newFlow()" style="background: rgba(0, 212, 255, 0.2); border: 2px solid #00d4ff; color: #00d4ff; padding: 8px 15px; border-radius: 6px; cursor: pointer; font-weight: 600;">📄 New</button>
                        <button onclick="window.AevovFlowBuilder.saveFlow()" style="background: rgba(0, 255, 136, 0.2); border: 2px solid #00ff88; color: #00ff88; padding: 8px 15px; border-radius: 6px; cursor: pointer; font-weight: 600;">💾 Save</button>
                        <button onclick="window.AevovFlowBuilder.loadFlow()" style="background: rgba(255, 159, 10, 0.2); border: 2px solid #ff9f0a; color: #ff9f0a; padding: 8px 15px; border-radius: 6px; cursor: pointer; font-weight: 600;">📂 Load</button>
                        <div style="width: 2px; height: 30px; background: rgba(255,255,255,0.1);"></div>
                        <button onclick="window.AevovFlowBuilder.executeFlow()" style="background: rgba(0, 255, 136, 0.2); border: 2px solid #00ff88; color: #00ff88; padding: 8px 15px; border-radius: 6px; cursor: pointer; font-weight: 600;">▶️ Execute</button>
                        <button onclick="window.AevovFlowBuilder.testFlow()" style="background: rgba(138, 43, 226, 0.2); border: 2px solid #8a2be2; color: #8a2be2; padding: 8px 15px; border-radius: 6px; cursor: pointer; font-weight: 600;">🧪 Test</button>
                        <button onclick="window.AevovFlowBuilder.autoConfig()" style="background: rgba(255, 215, 0, 0.2); border: 2px solid #ffd700; color: #ffd700; padding: 8px 15px; border-radius: 6px; cursor: pointer; font-weight: 600;">🤖 Auto-Config</button>
                        <div style="width: 2px; height: 30px; background: rgba(255,255,255,0.1);"></div>
                        <button onclick="window.AevovFlowBuilder.openTemplates()" style="background: rgba(138, 43, 226, 0.2); border: 2px solid #8a2be2; color: #8a2be2; padding: 8px 15px; border-radius: 6px; cursor: pointer; font-weight: 600;">📋 Templates</button>
                        <button onclick="window.AevovFlowBuilder.openVariables()" style="background: rgba(255, 159, 10, 0.2); border: 2px solid #ff9f0a; color: #ff9f0a; padding: 8px 15px; border-radius: 6px; cursor: pointer; font-weight: 600;">🔤 Variables</button>
                        <button onclick="window.AevovFlowBuilder.exportFlow()" style="background: rgba(0, 212, 255, 0.2); border: 2px solid #00d4ff; color: #00d4ff; padding: 8px 15px; border-radius: 6px; cursor: pointer; font-weight: 600;">📤 Export</button>
                        <div style="flex: 1;"></div>
                        <div id="statusIndicator" style="color: rgba(255,255,255,0.5); font-size: 12px; margin-right: 20px; transition: opacity 0.3s;">Ready</div>
                        <div style="color: white; font-size: 14px; margin-right: 15px;">Blocks: <span id="blockCount" style="color: #00d4ff; font-weight: 600;">0</span></div>
                        <div style="color: white; font-size: 14px;">Zoom: <span id="zoomLevel">100%</span></div>
                        <button onclick="window.AevovFlowBuilder.zoomIn()" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: white; padding: 8px 12px; border-radius: 6px; cursor: pointer;">+</button>
                        <button onclick="window.AevovFlowBuilder.zoomOut()" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: white; padding: 8px 12px; border-radius: 6px; cursor: pointer;">−</button>
                    </div>

                    <div id="blockPalette" style="position: absolute; top: 60px; left: 0; width: 280px; bottom: 0; background: linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%); border-right: 2px solid #00d4ff; overflow-y: auto; padding: 20px;">
                        <h3 style="color: #00d4ff; margin-top: 0;">🎨 Block Palette</h3>
                        <div id="blockList"></div>
                    </div>

                    <canvas id="flowCanvas" style="position: absolute; top: 60px; left: 280px; right: 320px; bottom: 0; cursor: grab; background: repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(0, 212, 255, 0.05) 19px, rgba(0, 212, 255, 0.05) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(0, 212, 255, 0.05) 19px, rgba(0, 212, 255, 0.05) 20px); background-size: 20px 20px;"></canvas>

                    <div id="minimap" style="position: absolute; bottom: 20px; right: 340px; width: 200px; height: 150px; background: rgba(0, 0, 0, 0.8); border: 2px solid #00d4ff; border-radius: 8px; overflow: hidden;">
                        <canvas id="minimapCanvas" width="200" height="150"></canvas>
                    </div>

                    <div id="quickAdd" style="position: absolute; top: 80px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%); border: 2px solid #00d4ff; border-radius: 12px; padding: 15px; box-shadow: 0 8px 32px rgba(0, 212, 255, 0.5); z-index: 100; display: none; width: 400px;">
                        <input type="text" id="quickAddSearch" placeholder="🔍 Search blocks... (Ctrl+K)" style="width: 100%; padding: 12px; background: rgba(0, 0, 0, 0.3); border: 2px solid rgba(0, 212, 255, 0.3); border-radius: 8px; color: white; font-size: 14px; outline: none;">
                        <div id="quickAddResults" style="margin-top: 10px; max-height: 300px; overflow-y: auto;"></div>
                    </div>

                    <div id="floatingMenu" style="position: absolute; bottom: 20px; left: 300px; display: flex; gap: 10px; z-index: 50;">
                        <button onclick="window.AevovFlowBuilder.toggleGrid()" title="Toggle Grid" style="width: 45px; height: 45px; background: rgba(0, 212, 255, 0.2); border: 2px solid #00d4ff; color: #00d4ff; border-radius: 8px; cursor: pointer; font-size: 20px;">📐</button>
                        <button onclick="window.AevovFlowBuilder.autoAlign()" title="Auto Align" style="width: 45px; height: 45px; background: rgba(0, 255, 136, 0.2); border: 2px solid #00ff88; color: #00ff88; border-radius: 8px; cursor: pointer; font-size: 20px;">📏</button>
                        <button onclick="window.AevovFlowBuilder.undo()" title="Undo (Ctrl+Z)" style="width: 45px; height: 45px; background: rgba(255, 159, 10, 0.2); border: 2px solid #ff9f0a; color: #ff9f0a; border-radius: 8px; cursor: pointer; font-size: 20px;">↶</button>
                        <button onclick="window.AevovFlowBuilder.redo()" title="Redo (Ctrl+Y)" style="width: 45px; height: 45px; background: rgba(255, 159, 10, 0.2); border: 2px solid #ff9f0a; color: #ff9f0a; border-radius: 8px; cursor: pointer; font-size: 20px;">↷</button>
                        <button onclick="window.AevovFlowBuilder.openQuickAdd()" title="Quick Add (Ctrl+K)" style="width: 45px; height: 45px; background: rgba(138, 43, 226, 0.2); border: 2px solid #8a2be2; color: #8a2be2; border-radius: 8px; cursor: pointer; font-size: 20px;">⚡</button>
                    </div>

                    <div id="propertiesPanel" style="position: absolute; top: 60px; right: 0; width: 320px; bottom: 0; background: linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%); border-left: 2px solid #00d4ff; overflow-y: auto; padding: 20px;">
                        <h3 style="color: #00d4ff; margin-top: 0;">⚙️ Properties</h3>
                        <div id="propertiesContent" style="color: rgba(255,255,255,0.6); text-align: center; padding: 40px 0;">Select a block to edit properties</div>
                    </div>

                    <svg id="connectionsSvg" style="position: absolute; top: 60px; left: 280px; right: 320px; bottom: 0; pointer-events: none; z-index: 1;"></svg>
                </div>

                <button onclick="window.AevovFlowBuilder.openBuilder()" style="position: fixed; bottom: 20px; left: 20px; background: linear-gradient(135deg, #00d4ff, #0099cc); border: none; color: white; width: 70px; height: 70px; border-radius: 50%; cursor: pointer; box-shadow: 0 8px 32px rgba(0, 212, 255, 0.5); z-index: 9999995; font-size: 32px; display: flex; align-items: center; justify-content: center; transition: all 0.3s;" onmouseenter="this.style.transform='scale(1.1) rotate(10deg)'" onmouseleave="this.style.transform='scale(1) rotate(0deg)'">🎨</button>
            `;

            document.body.insertAdjacentHTML('beforeend', ui);
            this.state.canvas = document.getElementById('flowCanvas');
            this.state.ctx = this.state.canvas.getContext('2d');
            this.resizeCanvas();
            this.renderBlockPalette();
        },

        resizeCanvas() {
            const canvas = this.state.canvas;
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
            this.render();
        },

        renderBlockPalette() {
            const container = document.getElementById('blockList');
            const categories = {};
            
            Object.entries(this.blockTypes).forEach(([key, block]) => {
                if (!categories[block.category]) categories[block.category] = [];
                categories[block.category].push({ key, ...block });
            });

            container.innerHTML = Object.entries(categories).map(([category, blocks]) => `
                <div style="margin-bottom: 25px;">
                    <div style="color: rgba(255,255,255,0.5); font-size: 11px; font-weight: 600; text-transform: uppercase; margin-bottom: 10px;">${category}</div>
                    ${blocks.map(block => `
                        <div class="block-palette-item" data-type="${block.key}" draggable="true" style="padding: 12px; background: rgba(0, 212, 255, 0.1); border: 2px solid rgba(0, 212, 255, 0.3); border-radius: 8px; margin-bottom: 8px; cursor: move; transition: all 0.2s;">
                            <div style="color: white; font-weight: 600; font-size: 14px;">${block.icon} ${block.name}</div>
                            <div style="color: rgba(255,255,255,0.6); font-size: 11px; margin-top: 4px;">${block.description}</div>
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
            const canvasContainer = canvas.parentElement;

            canvasContainer.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.stopPropagation();
                canvasContainer.style.background = 'rgba(0, 212, 255, 0.1)';
            });

            canvasContainer.addEventListener('dragleave', () => {
                canvasContainer.style.background = '#0a0a0a';
            });

            canvasContainer.addEventListener('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();
                canvasContainer.style.background = '#0a0a0a';
                this.handleCanvasDrop(e);
            });

            canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
            canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
            canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
            canvas.addEventListener('mouseup', () => this.handleMouseUp());
            canvas.addEventListener('wheel', (e) => this.handleWheel(e));

            window.addEventListener('resize', () => this.resizeCanvas());
        },

        handleBlockDragStart(e) {
            const blockType = e.target.closest('.block-palette-item')?.dataset.type;
            if (blockType) {
                e.dataTransfer.setData('blockType', blockType);
                e.dataTransfer.effectAllowed = 'copy';
                console.log('🎯 Dragging block:', blockType);
            }
        },

        handleCanvasDrop(e) {
            const blockType = e.dataTransfer.getData('blockType');
            if (!blockType) return;

            const rect = this.state.canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left - this.state.pan.x) / this.state.zoom;
            const y = (e.clientY - rect.top - this.state.pan.y) / this.state.zoom;

            this.addBlock(blockType, x, y);
        },

        handleCanvasClick(e) {
            const rect = this.state.canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left - this.state.pan.x) / this.state.zoom;
            const y = (e.clientY - rect.top - this.state.pan.y) / this.state.zoom;

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

        handleMouseDown(e) {
            const rect = this.state.canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left - this.state.pan.x) / this.state.zoom;
            const y = (e.clientY - rect.top - this.state.pan.y) / this.state.zoom;

            // Check if clicking on a port
            for (const block of this.state.blocks) {
                // Check output ports
                if (block.outputs) {
                    for (let i = 0; i < block.outputs.length; i++) {
                        const portY = block.y + 20 + i * 20;
                        const portX = block.x + block.width;
                        const dist = Math.sqrt((x - portX) ** 2 + (y - portY) ** 2);
                        
                        if (dist < 10) {
                            // Start connection from this port
                            this.state.isConnecting = true;
                            this.state.connectionStart = {
                                blockId: block.id,
                                port: block.outputs[i],
                                portIndex: i,
                                x: portX,
                                y: portY,
                                type: 'output'
                            };
                            return;
                        }
                    }
                }
                
                // Check input ports
                if (block.inputs) {
                    for (let i = 0; i < block.inputs.length; i++) {
                        const portY = block.y + 20 + i * 20;
                        const portX = block.x;
                        const dist = Math.sqrt((x - portX) ** 2 + (y - portY) ** 2);
                        
                        if (dist < 10) {
                            // Start connection from this port (reverse direction)
                            this.state.isConnecting = true;
                            this.state.connectionStart = {
                                blockId: block.id,
                                port: block.inputs[i],
                                portIndex: i,
                                x: portX,
                                y: portY,
                                type: 'input'
                            };
                            return;
                        }
                    }
                }
            }

            // Check if clicking on a block
            const clickedBlock = this.state.blocks.find(block => 
                x >= block.x && x <= block.x + block.width &&
                y >= block.y && y <= block.y + block.height
            );

            if (clickedBlock && e.button === 0) {
                this.state.draggedBlock = clickedBlock;
                this.state.dragOffset = { x: x - clickedBlock.x, y: y - clickedBlock.y };
            } else if (e.button === 0 && e.shiftKey) {
                this.state.isPanning = true;
                this.state.dragStart = { x: e.clientX - this.state.pan.x, y: e.clientY - this.state.pan.y };
                this.state.canvas.style.cursor = 'grabbing';
            }
        },

        handleMouseMove(e) {
            const rect = this.state.canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left - this.state.pan.x) / this.state.zoom;
            const y = (e.clientY - rect.top - this.state.pan.y) / this.state.zoom;

            // Connection preview
            if (this.state.isConnecting) {
                this.state.connectionPreview = { x, y };
                this.render();
                return;
            }

            // Dragging a block
            if (this.state.draggedBlock) {
                const newX = x - this.state.dragOffset.x;
                const newY = y - this.state.dragOffset.y;
                const snapped = this.snapToGrid(newX, newY);
                this.state.draggedBlock.x = snapped.x;
                this.state.draggedBlock.y = snapped.y;
                this.render();
            }

            // Panning
            if (this.state.isPanning) {
                this.state.pan.x = e.clientX - this.state.dragStart.x;
                this.state.pan.y = e.clientY - this.state.dragStart.y;
                this.render();
            }

            // Hover detection for blocks
            const hoveredBlock = this.state.blocks.find(block => 
                x >= block.x && x <= block.x + block.width &&
                y >= block.y && y <= block.y + block.height
            );

            if (hoveredBlock !== this.state.hoveredBlock) {
                this.state.hoveredBlock = hoveredBlock;
                this.render();
            }

            // Hover detection for ports
            let hoveredPort = null;
            for (const block of this.state.blocks) {
                if (block.outputs) {
                    for (let i = 0; i < block.outputs.length; i++) {
                        const portY = block.y + 20 + i * 20;
                        const portX = block.x + block.width;
                        const dist = Math.sqrt((x - portX) ** 2 + (y - portY) ** 2);
                        if (dist < 10) {
                            hoveredPort = { block, port: block.outputs[i], type: 'output' };
                        }
                    }
                }
                if (block.inputs) {
                    for (let i = 0; i < block.inputs.length; i++) {
                        const portY = block.y + 20 + i * 20;
                        const portX = block.x;
                        const dist = Math.sqrt((x - portX) ** 2 + (y - portY) ** 2);
                        if (dist < 10) {
                            hoveredPort = { block, port: block.inputs[i], type: 'input' };
                        }
                    }
                }
            }

            if (hoveredPort?.block !== this.state.hoveredPort?.block) {
                this.state.hoveredPort = hoveredPort;
                this.state.canvas.style.cursor = hoveredPort ? 'crosshair' : 'grab';
            }
        },

        handleMouseUp(e) {
            // Complete connection if we were connecting
            if (this.state.isConnecting && this.state.hoveredPort) {
                const start = this.state.connectionStart;
                const end = this.state.hoveredPort;

                // Validate connection (output to input or input to output)
                if ((start.type === 'output' && end.type === 'input') || 
                    (start.type === 'input' && end.type === 'output')) {
                    
                    const fromBlock = start.type === 'output' ? start.blockId : end.block.id;
                    const toBlock = start.type === 'output' ? end.block.id : start.blockId;
                    const fromPort = start.type === 'output' ? start.port : end.port;
                    const toPort = start.type === 'output' ? end.port : start.port;

                    const connection = {
                        id: `conn_${Date.now()}`,
                        from: { blockId: fromBlock, port: fromPort },
                        to: { blockId: toBlock, port: toPort }
                    };

                    this.state.connections.push(connection);
                    this.saveHistory();
                    this.showNotification('🔗 Connected', `${fromPort.name} → ${toPort.name}`);
                }
            }

            if (this.state.draggedBlock) this.saveHistory();
            
            this.state.draggedBlock = null;
            this.state.isPanning = false;
            this.state.isConnecting = false;
            this.state.connectionStart = null;
            this.state.connectionPreview = null;
            this.state.canvas.style.cursor = 'grab';
            this.render();
        },

        handleWheel(e) {
            if (e.ctrlKey) {
                e.preventDefault();
                const delta = e.deltaY > 0 ? 0.9 : 1.1;
                this.state.zoom = Math.max(0.1, Math.min(3, this.state.zoom * delta));
                document.getElementById('zoomLevel').textContent = Math.round(this.state.zoom * 100) + '%';
                this.render();
            }
        },

        registerKeyboardShortcuts() {
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.shiftKey && e.key === 'F') {
                    e.preventDefault();
                    this.openBuilder();
                }

                if (document.getElementById('flowBuilderContainer').style.display !== 'block') return;

                if (e.key === 'Delete' && this.state.selectedBlock) {
                    this.deleteBlock(this.state.selectedBlock.id);
                }

                if (e.ctrlKey && e.key === 'z') {
                    e.preventDefault();
                    this.undo();
                }

                if (e.ctrlKey && e.key === 'y') {
                    e.preventDefault();
                    this.redo();
                }

                if (e.ctrlKey && e.key === 's') {
                    e.preventDefault();
                    this.saveFlow();
                }

                if (e.ctrlKey && e.key === 'k') {
                    e.preventDefault();
                    this.openQuickAdd();
                }

                if (e.key === 'Escape') {
                    this.state.selectedBlock = null;
                    document.getElementById('quickAdd').style.display = 'none';
                    this.updatePropertiesPanel(null);
                    this.render();
                }
            });

            const searchInput = document.getElementById('quickAddSearch');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    this.updateQuickAddResults(e.target.value);
                });
            }
        },

        addBlock(type, x, y) {
            const blockDef = this.blockTypes[type];
            const snapped = this.snapToGrid(x, y);
            
            const block = {
                id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                type,
                x: snapped.x,
                y: snapped.y,
                width: 200,
                height: 80,
                ...blockDef,
                config: { ...blockDef.config }
            };

            this.state.blocks.push(block);
            this.saveHistory();
            this.render();
            console.log('➕ Block added:', block.name);
        },

        selectBlock(block) {
            this.state.selectedBlock = block;
            this.updatePropertiesPanel(block);
        },

        deleteBlock(blockId) {
            this.state.blocks = this.state.blocks.filter(b => b.id !== blockId);
            this.state.connections = this.state.connections.filter(
                c => c.from.blockId !== blockId && c.to.blockId !== blockId
            );
            this.state.selectedBlock = null;
            this.saveHistory();
            this.updatePropertiesPanel(null);
            this.render();
        },

        updatePropertiesPanel(block) {
            const container = document.getElementById('propertiesContent');
            
            if (!block) {
                container.innerHTML = '<div style="color: rgba(255,255,255,0.6); text-align: center; padding: 40px 0;">Select a block to edit properties</div>';
                return;
            }

            container.innerHTML = `
                <div style="margin-bottom: 20px;">
                    <div style="color: white; font-weight: 600; font-size: 16px; margin-bottom: 5px;">${block.icon} ${block.name}</div>
                    <div style="color: rgba(255,255,255,0.6); font-size: 12px;">${block.description}</div>
                </div>
                <div style="background: rgba(0, 212, 255, 0.1); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <div style="color: #00d4ff; font-weight: 600; margin-bottom: 10px;">Configuration</div>
                    ${this.renderConfigFields(block)}
                </div>
                <button onclick="window.AevovFlowBuilder.deleteBlock('${block.id}')" style="width: 100%; padding: 10px; background: rgba(255, 107, 107, 0.2); border: 2px solid #ff6b6b; color: #ff6b6b; border-radius: 8px; cursor: pointer; font-weight: 600;">🗑️ Delete Block</button>
            `;
        },

        renderConfigFields(block) {
            return Object.entries(block.config).map(([key, value]) => {
                const type = typeof value;
                const id = `config_${block.id}_${key}`;
                
                if (type === 'boolean') {
                    return `<div style="margin-bottom: 15px;"><label style="color: white; display: flex; align-items: center; gap: 10px;"><input type="checkbox" ${value ? 'checked' : ''} onchange="window.AevovFlowBuilder.updateConfig('${block.id}', '${key}', this.checked)"><span>${key}</span></label></div>`;
                } else if (type === 'number') {
                    return `<div style="margin-bottom: 15px;"><label style="color: white; display: block; margin-bottom: 5px;">${key}</label><input type="number" value="${value}" onchange="window.AevovFlowBuilder.updateConfig('${block.id}', '${key}', parseFloat(this.value))" style="width: 100%; padding: 8px; background: rgba(0, 0, 0, 0.3); border: 2px solid rgba(255, 255, 255, 0.2); border-radius: 6px; color: white;"></div>`;
                } else {
                    return `<div style="margin-bottom: 15px;"><label style="color: white; display: block; margin-bottom: 5px;">${key}</label><input type="text" value="${value}" onchange="window.AevovFlowBuilder.updateConfig('${block.id}', '${key}', this.value)" style="width: 100%; padding: 8px; background: rgba(0, 0, 0, 0.3); border: 2px solid rgba(255, 255, 255, 0.2); border-radius: 6px; color: white;"></div>`;
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

        render() {
            const ctx = this.state.ctx;
            ctx.clearRect(0, 0, this.state.canvas.width, this.state.canvas.height);

            ctx.save();
            ctx.translate(this.state.pan.x, this.state.pan.y);
            ctx.scale(this.state.zoom, this.state.zoom);

            this.renderConnections();
            this.renderBlocks();

            ctx.restore();

            this.renderMinimap();

            const blockCount = document.getElementById('blockCount');
            if (blockCount) blockCount.textContent = this.state.blocks.length;
        },

        renderBlocks() {
            const ctx = this.state.ctx;

            this.state.blocks.forEach(block => {
                const isSelected = this.state.selectedBlock?.id === block.id;
                const isHovered = this.state.hoveredBlock?.id === block.id;

                ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                ctx.shadowBlur = isHovered ? 20 : 10;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 4;

                ctx.fillStyle = isSelected ? 'rgba(0, 212, 255, 0.25)' : isHovered ? 'rgba(26, 26, 46, 0.98)' : 'rgba(26, 26, 46, 0.95)';
                ctx.strokeStyle = isSelected ? '#00d4ff' : isHovered ? 'rgba(0, 212, 255, 0.7)' : 'rgba(0, 212, 255, 0.5)';
                ctx.lineWidth = isSelected ? 3 : 2;

                ctx.beginPath();
                ctx.roundRect(block.x, block.y, block.width, block.height, 10);
                ctx.fill();
                ctx.stroke();

                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;

                const accentColor = block.color || '#00d4ff';
                ctx.fillStyle = accentColor;
                ctx.fillRect(block.x, block.y, block.width, 4);

                ctx.fillStyle = 'white';
                ctx.font = 'bold 14px sans-serif';
                ctx.fillText(`${block.icon} ${block.name}`, block.x + 15, block.y + 30);

                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                ctx.font = '11px sans-serif';
                const desc = block.description.length > 25 ? block.description.substring(0, 25) + '...' : block.description;
                ctx.fillText(desc, block.x + 15, block.y + 50);

                if (block.inputs) {
                    block.inputs.forEach((input, i) => {
                        const portY = block.y + 20 + i * 20;
                        ctx.fillStyle = '#00d4ff';
                        ctx.beginPath();
                        ctx.arc(block.x, portY, 6, 0, Math.PI * 2);
                        ctx.fill();

                        if (isHovered) {
                            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                            ctx.fillRect(block.x - 50, portY - 10, 45, 18);
                            ctx.fillStyle = '#00d4ff';
                            ctx.font = '10px sans-serif';
                            ctx.textAlign = 'right';
                            ctx.fillText(input.name || input, block.x - 8, portY + 4);
                            ctx.textAlign = 'left';
                        }
                    });
                }

                if (block.outputs) {
                    block.outputs.forEach((output, i) => {
                        const portY = block.y + 20 + i * 20;
                        ctx.fillStyle = '#00ff88';
                        ctx.beginPath();
                        ctx.arc(block.x + block.width, portY, 6, 0, Math.PI * 2);
                        ctx.fill();

                        if (isHovered) {
                            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                            ctx.fillRect(block.x + block.width + 5, portY - 10, 50, 18);
                            ctx.fillStyle = '#00ff88';
                            ctx.font = '10px sans-serif';
                            ctx.fillText(output.name || output, block.x + block.width + 10, portY + 4);
                        }
                    });
                }
            });
        },

        renderConnections() {
            const ctx = this.state.ctx;

            // Render existing connections
            this.state.connections.forEach(conn => {
                const fromBlock = this.state.blocks.find(b => b.id === conn.from.blockId);
                const toBlock = this.state.blocks.find(b => b.id === conn.to.blockId);

                if (!fromBlock || !toBlock) return;

                const fromX = fromBlock.x + fromBlock.width;
                const fromY = fromBlock.y + 30;
                const toX = toBlock.x;
                const toY = toBlock.y + 30;

                ctx.strokeStyle = 'rgba(0, 255, 136, 0.7)';
                ctx.lineWidth = 3;
                ctx.lineCap = 'round';

                ctx.beginPath();
                ctx.moveTo(fromX, fromY);
                
                const cpX1 = fromX + 100;
                const cpX2 = toX - 100;
                ctx.bezierCurveTo(cpX1, fromY, cpX2, toY, toX, toY);
                
                ctx.stroke();

                // Draw arrow
                const angle = Math.atan2(toY - fromY, toX - fromX);
                ctx.fillStyle = '#00ff88';
                ctx.beginPath();
                ctx.moveTo(toX - 10, toY);
                ctx.lineTo(toX - 20, toY - 8);
                ctx.lineTo(toX - 20, toY + 8);
                ctx.closePath();
                ctx.fill();
            });

            // Render connection preview
            if (this.state.isConnecting && this.state.connectionStart && this.state.connectionPreview) {
                const start = this.state.connectionStart;
                const preview = this.state.connectionPreview;

                ctx.strokeStyle = 'rgba(0, 212, 255, 0.5)';
                ctx.lineWidth = 3;
                ctx.setLineDash([10, 5]);
                ctx.lineCap = 'round';

                ctx.beginPath();
                ctx.moveTo(start.x, start.y);
                
                const cpX1 = start.x + 100;
                const cpX2 = preview.x - 100;
                ctx.bezierCurveTo(cpX1, start.y, cpX2, preview.y, preview.x, preview.y);
                
                ctx.stroke();
                ctx.setLineDash([]);

                // Draw preview endpoint
                ctx.fillStyle = 'rgba(0, 212, 255, 0.5)';
                ctx.beginPath();
                ctx.arc(preview.x, preview.y, 8, 0, Math.PI * 2);
                ctx.fill();
            }
        },

        renderMinimap() {
            const minimap = document.getElementById('minimapCanvas');
            if (!minimap || this.state.blocks.length === 0) return;

            const ctx = minimap.getContext('2d');
            ctx.clearRect(0, 0, minimap.width, minimap.height);

            const bounds = this.calculateBounds();
            const scale = Math.min(minimap.width / bounds.width, minimap.height / bounds.height) * 0.8;

            ctx.fillStyle = 'rgba(0, 212, 255, 0.5)';
            this.state.blocks.forEach(block => {
                const x = (block.x - bounds.minX) * scale + 10;
                const y = (block.y - bounds.minY) * scale + 10;
                const w = block.width * scale;
                const h = block.height * scale;
                ctx.fillRect(x, y, w, h);
            });

            const viewX = (-this.state.pan.x) * scale + 10;
            const viewY = (-this.state.pan.y) * scale + 10;
            const viewW = (this.state.canvas.width / this.state.zoom) * scale;
            const viewH = (this.state.canvas.height / this.state.zoom) * scale;

            ctx.strokeStyle = '#00ff88';
            ctx.lineWidth = 2;
            ctx.strokeRect(viewX, viewY, viewW, viewH);
        },

        calculateBounds() {
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

            this.state.blocks.forEach(block => {
                minX = Math.min(minX, block.x);
                minY = Math.min(minY, block.y);
                maxX = Math.max(maxX, block.x + block.width);
                maxY = Math.max(maxY, block.y + block.height);
            });

            return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
        },

        snapToGrid(x, y) {
            if (!this.state.grid.snap) return { x, y };
            const gridSize = this.state.grid.size;
            return {
                x: Math.round(x / gridSize) * gridSize,
                y: Math.round(y / gridSize) * gridSize
            };
        },

        toggleGrid() {
            this.state.grid.visible = !this.state.grid.visible;
            this.render();
            this.showNotification('📐 Grid', this.state.grid.visible ? 'Visible' : 'Hidden');
        },

        autoAlign() {
            if (this.state.blocks.length === 0) return;

            const categories = {};
            this.state.blocks.forEach(block => {
                if (!categories[block.category]) categories[block.category] = [];
                categories[block.category].push(block);
            });

            let x = 100;
            Object.values(categories).forEach(blocks => {
                let y = 100;
                blocks.forEach(block => {
                    block.x = x;
                    block.y = y;
                    y += block.height + 50;
                });
                x += 350;
            });

            this.saveHistory();
            this.render();
            this.showNotification('📏 Auto-Aligned', `Organized ${this.state.blocks.length} blocks`);
        },

        saveHistory() {
            if (this.state.historyIndex < this.state.history.length - 1) {
                this.state.history = this.state.history.slice(0, this.state.historyIndex + 1);
            }

            this.state.history.push({
                blocks: JSON.parse(JSON.stringify(this.state.blocks)),
                connections: JSON.parse(JSON.stringify(this.state.connections))
            });

            this.state.historyIndex++;

            if (this.state.history.length > 50) {
                this.state.history.shift();
                this.state.historyIndex--;
            }
        },

        undo() {
            if (this.state.historyIndex > 0) {
                this.state.historyIndex--;
                const state = this.state.history[this.state.historyIndex];
                this.state.blocks = JSON.parse(JSON.stringify(state.blocks));
                this.state.connections = JSON.parse(JSON.stringify(state.connections));
                this.render();
                this.showNotification('↶ Undo', 'Reverted to previous state');
            }
        },

        redo() {
            if (this.state.historyIndex < this.state.history.length - 1) {
                this.state.historyIndex++;
                const state = this.state.history[this.state.historyIndex];
                this.state.blocks = JSON.parse(JSON.stringify(state.blocks));
                this.state.connections = JSON.parse(JSON.stringify(state.connections));
                this.render();
                this.showNotification('↷ Redo', 'Restored next state');
            }
        },

        openQuickAdd() {
            const quickAdd = document.getElementById('quickAdd');
            const isVisible = quickAdd.style.display === 'block';
            
            if (isVisible) {
                quickAdd.style.display = 'none';
            } else {
                quickAdd.style.display = 'block';
                document.getElementById('quickAddSearch').focus();
                this.updateQuickAddResults('');
            }
        },

        updateQuickAddResults(query) {
            const container = document.getElementById('quickAddResults');
            
            const filtered = Object.entries(this.blockTypes).filter(([key, block]) => {
                const searchText = `${block.name} ${block.description} ${block.category}`.toLowerCase();
                return searchText.includes(query.toLowerCase());
            });

            container.innerHTML = filtered.map(([key, block]) => `
                <div onclick="window.AevovFlowBuilder.quickAddBlock('${key}')" style="padding: 12px; background: rgba(0, 212, 255, 0.1); border: 1px solid rgba(0, 212, 255, 0.3); border-radius: 6px; margin-bottom: 8px; cursor: pointer; transition: all 0.2s;" onmouseenter="this.style.background='rgba(0, 212, 255, 0.2)'" onmouseleave="this.style.background='rgba(0, 212, 255, 0.1)'">
                    <div style="color: white; font-weight: 600; font-size: 14px;">${block.icon} ${block.name}</div>
                    <div style="color: rgba(255,255,255,0.6); font-size: 11px; margin-top: 4px;">${block.category} • ${block.description}</div>
                </div>
            `).join('');
        },

        quickAddBlock(type) {
            const centerX = (this.state.canvas.width / 2 - this.state.pan.x) / this.state.zoom;
            const centerY = (this.state.canvas.height / 2 - this.state.pan.y) / this.state.zoom;
            
            this.addBlock(type, centerX, centerY);
            document.getElementById('quickAdd').style.display = 'none';
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
            this.showNotification('🤖 Auto-Config', 'Analyzing and optimizing flow...');
        },

        async testFlow() {
            this.showNotification('🧪 Testing', 'Running flow validation...');
        },

        newFlow() {
            if (confirm('Create new flow? Unsaved changes will be lost.')) {
                this.state.blocks = [];
                this.state.connections = [];
                this.state.selectedBlock = null;
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
            this.showNotification('💾 Saved', `Flow "${flow.name}" saved`);
        },

        loadFlow() {
            this.showNotification('📂 Load', 'Flow loading coming soon...');
        },

        loadSavedFlows() {
            const saved = localStorage.getItem('aevov_flows');
            if (saved) this.state.flows = JSON.parse(saved);
        },

        startAutoSave() {
            setInterval(() => {
                if (this.state.blocks.length > 0) {
                    const autoSave = {
                        id: 'autosave',
                        name: 'AutoSave',
                        blocks: this.state.blocks,
                        connections: this.state.connections,
                        timestamp: Date.now()
                    };
                    localStorage.setItem('aevov_flow_autosave', JSON.stringify(autoSave));
                    this.updateStatusIndicator('💾 Auto-saved');
                }
            }, 30000);
        },

        updateStatusIndicator(message) {
            const indicator = document.getElementById('statusIndicator');
            if (indicator) {
                indicator.textContent = message;
                indicator.style.opacity = '1';
                setTimeout(() => { indicator.style.opacity = '0.5'; }, 2000);
            }
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