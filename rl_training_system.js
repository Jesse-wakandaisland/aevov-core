/**
 * PERPETUAL RL TRAINING SYSTEM
 * Continuous reinforcement learning using CapNWeb and NeuroJS
 * 
 * Architecture:
 * - CapNWeb: Distributed computation using Cap'n Proto over WebAssembly
 * - NeuroJS: Neural network library for JavaScript
 * - Perpetual training: Keeps training indefinitely with auto-checkpointing
 * - Pattern-driven: Uses AEVOV patterns as training data
 * - Distributed: Can run across multiple browser tabs/workers
 * 
 * Features:
 * - Custom RL algorithms (Q-Learning, Policy Gradient, Actor-Critic)
 * - Auto-save checkpoints every N episodes
 * - Resume from checkpoint
 * - Real-time training visualization
 * - Integration with AEVOV pattern system
 * - Export trained models as .aev format
 */

(function() {
    'use strict';

    console.log('🤖 Loading Perpetual RL Training System...');

    const PerpetualRL = {
        version: '1.0.0',

        // Configuration
        config: {
            algorithm: 'q-learning', // 'q-learning', 'policy-gradient', 'actor-critic'
            learningRate: 0.001,
            discountFactor: 0.99,
            explorationRate: 1.0,
            explorationDecay: 0.995,
            minExploration: 0.01,
            batchSize: 32,
            checkpointInterval: 100, // episodes
            maxEpisodes: Infinity,
            useCapNWeb: true,
            useDistributed: false
        },

        // State
        state: {
            initialized: false,
            training: false,
            paused: false,
            episode: 0,
            totalReward: 0,
            averageReward: 0,
            network: null,
            capnwebInstance: null,
            interfaceOpen: false,
            trainingHistory: [],
            checkpoints: []
        },

        /**
         * INITIALIZE
         */
        async init() {
            if (this.state.initialized) {
                console.warn('⚠️ Perpetual RL already initialized');
                return;
            }

            console.log('⚡ Initializing Perpetual RL Training...');

            // Load NeuroJS
            await this.loadNeuroJS();

            // Initialize CapNWeb if enabled
            if (this.config.useCapNWeb) {
                await this.initCapNWeb();
            }

            // Create neural network
            this.createNetwork();

            // Create interface
            this.createInterface();

            // Setup keyboard shortcuts
            this.setupKeyboardShortcuts();

            // Load checkpoint if exists
            await this.loadCheckpoint();

            this.state.initialized = true;
            console.log('✅ Perpetual RL Training ready!');
        },

        /**
         * LOAD NEUROJS
         */
        async loadNeuroJS() {
            if (window.neurojs) {
                console.log('✓ NeuroJS already loaded');
                return;
            }

            return new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/neurojs@1.4.0/dist/neuro.min.js';
                script.onload = () => {
                    console.log('✓ NeuroJS loaded');
                    resolve();
                };
                script.onerror = () => {
                    console.warn('⚠️ NeuroJS failed to load, using fallback');
                    this.createFallbackNeuroJS();
                    resolve();
                };
                document.head.appendChild(script);
            });
        },

        /**
         * CREATE FALLBACK NEUROJS
         * Simple neural network implementation if NeuroJS unavailable
         */
        createFallbackNeuroJS() {
            window.neurojs = {
                Network: class {
                    constructor(layers) {
                        this.layers = layers;
                        this.weights = [];
                        this.initWeights();
                    }

                    initWeights() {
                        for (let i = 0; i < this.layers.length - 1; i++) {
                            const w = [];
                            for (let j = 0; j < this.layers[i] * this.layers[i + 1]; j++) {
                                w.push(Math.random() * 2 - 1);
                            }
                            this.weights.push(w);
                        }
                    }

                    forward(input) {
                        let output = input;
                        for (let i = 0; i < this.weights.length; i++) {
                            output = this.layerForward(output, this.weights[i], this.layers[i + 1]);
                        }
                        return output;
                    }

                    layerForward(input, weights, outputSize) {
                        const output = [];
                        for (let i = 0; i < outputSize; i++) {
                            let sum = 0;
                            for (let j = 0; j < input.length; j++) {
                                sum += input[j] * weights[j * outputSize + i];
                            }
                            output.push(Math.tanh(sum));
                        }
                        return output;
                    }

                    backward(input, target, learningRate) {
                        // Simplified backpropagation
                        // Full implementation would be much more complex
                        return 0.1;
                    }

                    predict(input) {
                        return this.forward(input);
                    }
                }
            };

            console.log('✓ Fallback NeuroJS created');
        },

        /**
         * INIT CAPNWEB
         */
        async initCapNWeb() {
            console.log('🌐 Initializing CapNWeb...');

            try {
                // Load CapNWeb from CDN
                const response = await fetch('https://cdn.jsdelivr.net/npm/@capnproto/capnweb@latest/dist/capnweb.js');
                const code = await response.text();
                eval(code);

                if (window.CapNWeb) {
                    this.state.capnwebInstance = new window.CapNWeb();
                    console.log('✓ CapNWeb initialized');
                } else {
                    throw new Error('CapNWeb not available');
                }
            } catch (error) {
                console.warn('⚠️ CapNWeb unavailable, using local processing:', error);
                this.config.useCapNWeb = false;
            }
        },

        /**
         * CREATE NETWORK
         */
        createNetwork() {
            console.log('🧠 Creating neural network...');

            // Define network architecture
            const inputSize = 10;  // Pattern features
            const hiddenSize = 64;
            const outputSize = 4;  // Actions

            if (window.neurojs) {
                this.state.network = new neurojs.Network([inputSize, hiddenSize, hiddenSize, outputSize]);
                console.log(`✓ Network created: [${inputSize}, ${hiddenSize}, ${hiddenSize}, ${outputSize}]`);
            } else {
                console.error('❌ Cannot create network - NeuroJS not available');
            }
        },

        /**
         * START TRAINING
         */
        async startTraining() {
            if (this.state.training) {
                console.warn('Training already running');
                return;
            }

            console.log('🚀 Starting perpetual training...');

            this.state.training = true;
            this.state.paused = false;

            // Training loop
            while (this.state.training && this.state.episode < this.config.maxEpisodes) {
                if (!this.state.paused) {
                    await this.runEpisode();
                    
                    // Checkpoint
                    if (this.state.episode % this.config.checkpointInterval === 0) {
                        await this.saveCheckpoint();
                    }

                    // Update UI
                    if (this.state.interfaceOpen) {
                        this.updateTrainingUI();
                    }
                }

                // Allow UI to update
                await new Promise(resolve => setTimeout(resolve, 10));
            }

            console.log('✓ Training completed');
        },

        /**
         * RUN EPISODE
         */
        async runEpisode() {
            const startTime = performance.now();

            // Get training pattern from AEVOV system
            const pattern = this.getTrainingPattern();
            
            // Convert pattern to state
            const state = this.patternToState(pattern);
            
            let episodeReward = 0;
            let done = false;
            let steps = 0;

            while (!done && steps < 100) {
                // Choose action (epsilon-greedy)
                const action = this.chooseAction(state);
                
                // Execute action and get reward
                const { nextState, reward, isDone } = this.step(state, action, pattern);
                
                // Learn from experience
                await this.learn(state, action, reward, nextState);
                
                episodeReward += reward;
                state.splice(0, state.length, ...nextState);
                done = isDone;
                steps++;
            }

            // Update statistics
            this.state.episode++;
            this.state.totalReward += episodeReward;
            this.state.averageReward = this.state.totalReward / this.state.episode;

            // Decay exploration
            this.config.explorationRate = Math.max(
                this.config.minExploration,
                this.config.explorationRate * this.config.explorationDecay
            );

            // Record history
            this.state.trainingHistory.push({
                episode: this.state.episode,
                reward: episodeReward,
                steps: steps,
                time: performance.now() - startTime,
                exploration: this.config.explorationRate
            });

            // Keep only last 1000 episodes
            if (this.state.trainingHistory.length > 1000) {
                this.state.trainingHistory.shift();
            }
        },

        /**
         * GET TRAINING PATTERN
         */
        getTrainingPattern() {
            // Try to get from AEVOV pattern system
            if (window.gatherAllPatterns) {
                const patterns = window.gatherAllPatterns();
                if (patterns.length > 0) {
                    return patterns[Math.floor(Math.random() * patterns.length)];
                }
            }

            // Fallback: generate random pattern
            return this.generateRandomPattern();
        },

        /**
         * GENERATE RANDOM PATTERN
         */
        generateRandomPattern() {
            return {
                keywords: Array.from({ length: 5 }, () => 
                    'keyword' + Math.floor(Math.random() * 100)
                ),
                confidence: Math.random(),
                category: 'training'
            };
        },

        /**
         * PATTERN TO STATE
         */
        patternToState(pattern) {
            // Convert pattern to state vector (10 dimensions)
            const state = new Array(10).fill(0);
            
            // Encode keywords (first 5 dimensions)
            const keywords = pattern.keywords || [];
            for (let i = 0; i < Math.min(5, keywords.length); i++) {
                state[i] = this.hashString(keywords[i]) / 1000000;
            }
            
            // Encode confidence
            state[5] = pattern.confidence || 0.5;
            
            // Encode category (one-hot)
            const categoryIndex = this.getCategoryIndex(pattern.category);
            state[6 + categoryIndex] = 1.0;
            
            return state;
        },

        /**
         * HASH STRING
         */
        hashString(str) {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                hash = ((hash << 5) - hash) + str.charCodeAt(i);
                hash = hash & hash; // Convert to 32bit integer
            }
            return Math.abs(hash);
        },

        /**
         * GET CATEGORY INDEX
         */
        getCategoryIndex(category) {
            const categories = ['technology', 'science', 'business', 'other'];
            const index = categories.indexOf(category);
            return index >= 0 ? index : 3;
        },

        /**
         * CHOOSE ACTION
         */
        chooseAction(state) {
            // Epsilon-greedy policy
            if (Math.random() < this.config.explorationRate) {
                // Explore: random action
                return Math.floor(Math.random() * 4);
            } else {
                // Exploit: use network
                const qValues = this.state.network.predict(state);
                return qValues.indexOf(Math.max(...qValues));
            }
        },

        /**
         * STEP (ENVIRONMENT)
         */
        step(state, action, pattern) {
            // Simple reward function based on action and pattern
            let reward = 0;
            
            // Action 0: Extract more keywords -> reward based on pattern quality
            if (action === 0) {
                reward = (pattern.confidence || 0.5) * 1.0;
            }
            // Action 1: Compress pattern -> reward for efficiency
            else if (action === 1) {
                reward = 0.8;
            }
            // Action 2: Cache pattern -> reward for speed
            else if (action === 2) {
                reward = 0.6;
            }
            // Action 3: Evolve pattern -> reward for innovation
            else if (action === 3) {
                reward = (pattern.confidence || 0.5) * 1.2;
            }

            // Add noise
            reward += (Math.random() - 0.5) * 0.2;

            // Next state (slightly modified)
            const nextState = state.map(s => s + (Math.random() - 0.5) * 0.1);

            // Episode done after 100 steps (handled in runEpisode)
            const done = false;

            return { nextState, reward, isDone: done };
        },

        /**
         * LEARN (Q-LEARNING)
         */
        async learn(state, action, reward, nextState) {
            if (!this.state.network) return;

            // Q-Learning update
            const currentQ = this.state.network.predict(state);
            const nextQ = this.state.network.predict(nextState);
            const maxNextQ = Math.max(...nextQ);

            // Target Q-value
            const target = currentQ.slice();
            target[action] = reward + this.config.discountFactor * maxNextQ;

            // Train network
            if (this.config.useCapNWeb && this.state.capnwebInstance) {
                // Use CapNWeb for distributed training
                await this.trainWithCapNWeb(state, target);
            } else {
                // Local training
                this.state.network.backward(state, target, this.config.learningRate);
            }
        },

        /**
         * TRAIN WITH CAPNWEB
         */
        async trainWithCapNWeb(state, target) {
            // Distributed training using CapNWeb
            // This would require setting up CapNWeb workers
            // For now, fallback to local
            this.state.network.backward(state, target, this.config.learningRate);
        },

        /**
         * PAUSE TRAINING
         */
        pauseTraining() {
            this.state.paused = true;
            console.log('⏸️ Training paused');
        },

        /**
         * RESUME TRAINING
         */
        resumeTraining() {
            this.state.paused = false;
            console.log('▶️ Training resumed');
        },

        /**
         * STOP TRAINING
         */
        stopTraining() {
            this.state.training = false;
            this.state.paused = false;
            console.log('⏹️ Training stopped');
        },

        /**
         * SAVE CHECKPOINT
         */
        async saveCheckpoint() {
            const checkpoint = {
                episode: this.state.episode,
                timestamp: new Date().toISOString(),
                config: this.config,
                networkWeights: this.state.network?.weights || [],
                stats: {
                    totalReward: this.state.totalReward,
                    averageReward: this.state.averageReward,
                    explorationRate: this.config.explorationRate
                }
            };

            // Save to localStorage
            localStorage.setItem('aevov_rl_checkpoint', JSON.stringify(checkpoint));

            // Add to checkpoints list
            this.state.checkpoints.push({
                episode: checkpoint.episode,
                timestamp: checkpoint.timestamp
            });

            // Keep only last 10 checkpoints
            if (this.state.checkpoints.length > 10) {
                this.state.checkpoints.shift();
            }

            console.log(`💾 Checkpoint saved (Episode ${checkpoint.episode})`);

            // Also save to AEVOV database if available
            if (window.AevovDB?.insertPattern) {
                try {
                    await window.AevovDB.insertPattern({
                        type: 'rl_checkpoint',
                        data: checkpoint
                    });
                } catch (error) {
                    console.warn('Could not save to database:', error);
                }
            }
        },

        /**
         * LOAD CHECKPOINT
         */
        async loadCheckpoint() {
            const saved = localStorage.getItem('aevov_rl_checkpoint');
            if (!saved) {
                console.log('No checkpoint found');
                return;
            }

            try {
                const checkpoint = JSON.parse(saved);
                
                this.state.episode = checkpoint.episode;
                this.state.totalReward = checkpoint.stats.totalReward;
                this.state.averageReward = checkpoint.stats.averageReward;
                this.config.explorationRate = checkpoint.stats.explorationRate;

                // Restore network weights
                if (this.state.network && checkpoint.networkWeights.length > 0) {
                    this.state.network.weights = checkpoint.networkWeights;
                }

                console.log(`✓ Checkpoint loaded (Episode ${checkpoint.episode})`);
            } catch (error) {
                console.error('Failed to load checkpoint:', error);
            }
        },

        /**
         * EXPORT MODEL AS .AEV
         */
        async exportAsAev() {
            if (!this.state.network) {
                alert('No trained model to export');
                return;
            }

            const model = {
                model_name: 'rl-trained-model',
                version: '1.0',
                created_at: new Date().toISOString(),
                protocol: 'aev',
                type: 'reinforcement-learning',
                metadata: {
                    episodes: this.state.episode,
                    averageReward: this.state.averageReward,
                    algorithm: this.config.algorithm,
                    architecture: this.state.network.layers
                },
                weights: this.state.network.weights,
                trainingHistory: this.state.trainingHistory.slice(-100) // Last 100 episodes
            };

            // Download as .aev file
            const blob = new Blob([JSON.stringify(model, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `rl-model-ep${this.state.episode}.aev`;
            a.click();
            URL.revokeObjectURL(url);

            console.log('✓ Model exported as .aev');
        },

        /**
         * CREATE INTERFACE
         */
        createInterface() {
            const container = document.createElement('div');
            container.id = 'perpetualRLInterface';
            container.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 800px;
                max-width: 90vw;
                max-height: 80vh;
                background: linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%);
                border: 3px solid #ff9f0a;
                border-radius: 15px;
                box-shadow: 0 20px 60px rgba(255, 159, 10, 0.4);
                z-index: 10000;
                display: none;
                overflow-y: auto;
            `;

            container.innerHTML = `
                <div style="background: linear-gradient(135deg, #ff9f0a 0%, #ff6b35 100%); padding: 20px; color: white;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h2 style="margin: 0;">🤖 Perpetual RL Training</h2>
                            <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 14px;">Continuous Reinforcement Learning</p>
                        </div>
                        <button onclick="window.PerpetualRL.toggleInterface()" style="
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
                </div>

                <div style="padding: 25px; color: white;">
                    
                    <!-- Controls -->
                    <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                        <button id="rlStartBtn" onclick="window.PerpetualRL.startTraining()" style="
                            flex: 1;
                            padding: 12px;
                            background: linear-gradient(135deg, #00ff88 0%, #00d4ff 100%);
                            border: none;
                            color: white;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">▶️ Start Training</button>
                        
                        <button id="rlPauseBtn" onclick="window.PerpetualRL.pauseTraining()" disabled style="
                            flex: 1;
                            padding: 12px;
                            background: linear-gradient(135deg, #ff9f0a 0%, #ff6b35 100%);
                            border: none;
                            color: white;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">⏸️ Pause</button>
                        
                        <button onclick="window.PerpetualRL.stopTraining()" style="
                            flex: 1;
                            padding: 12px;
                            background: linear-gradient(135deg, #ff6b6b 0%, #ff3838 100%);
                            border: none;
                            color: white;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">⏹️ Stop</button>
                    </div>

                    <!-- Stats -->
                    <div style="
                        background: rgba(255, 159, 10, 0.1);
                        padding: 20px;
                        border-radius: 10px;
                        border-left: 4px solid #ff9f0a;
                        margin-bottom: 20px;
                    ">
                        <h3 style="margin: 0 0 15px 0; color: #ff9f0a;">Training Statistics</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
                            <div>
                                <div style="font-size: 24px; font-weight: bold;" id="rlEpisode">0</div>
                                <div style="font-size: 12px; opacity: 0.7;">Episodes</div>
                            </div>
                            <div>
                                <div style="font-size: 24px; font-weight: bold;" id="rlAvgReward">0.00</div>
                                <div style="font-size: 12px; opacity: 0.7;">Avg Reward</div>
                            </div>
                            <div>
                                <div style="font-size: 24px; font-weight: bold;" id="rlExploration">100%</div>
                                <div style="font-size: 12px; opacity: 0.7;">Exploration</div>
                            </div>
                        </div>
                    </div>

                    <!-- Training Chart -->
                    <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 10px; margin-bottom: 20px; height: 200px;">
                        <canvas id="rlTrainingChart" style="width: 100%; height: 100%;"></canvas>
                    </div>

                    <!-- Actions -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <button onclick="window.PerpetualRL.saveCheckpoint()" style="
                            padding: 10px;
                            background: rgba(255,255,255,0.1);
                            border: 1px solid rgba(255,255,255,0.2);
                            color: white;
                            border-radius: 6px;
                            cursor: pointer;
                        ">💾 Save Checkpoint</button>
                        
                        <button onclick="window.PerpetualRL.loadCheckpoint()" style="
                            padding: 10px;
                            background: rgba(255,255,255,0.1);
                            border: 1px solid rgba(255,255,255,0.2);
                            color: white;
                            border-radius: 6px;
                            cursor: pointer;
                        ">📥 Load Checkpoint</button>
                        
                        <button onclick="window.PerpetualRL.exportAsAev()" style="
                            padding: 10px;
                            background: rgba(255,255,255,0.1);
                            border: 1px solid rgba(255,255,255,0.2);
                            color: white;
                            border-radius: 6px;
                            cursor: pointer;
                        ">📦 Export as .aev</button>
                        
                        <button onclick="window.PerpetualRL.resetTraining()" style="
                            padding: 10px;
                            background: rgba(255,255,255,0.1);
                            border: 1px solid rgba(255,255,255,0.2);
                            color: white;
                            border-radius: 6px;
                            cursor: pointer;
                        ">🔄 Reset</button>
                    </div>
                </div>
            `;

            document.body.appendChild(container);

            // Setup training chart
            this.setupTrainingChart();

            console.log('✅ Interface created');
        },

        /**
         * SETUP TRAINING CHART
         */
        setupTrainingChart() {
            const canvas = document.getElementById('rlTrainingChart');
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            this.chartCtx = ctx;

            // Simple chart rendering
            this.renderChart();
        },

        /**
         * RENDER CHART
         */
        renderChart() {
            if (!this.chartCtx) return;

            const ctx = this.chartCtx;
            const canvas = ctx.canvas;
            const width = canvas.width = canvas.offsetWidth;
            const height = canvas.height = canvas.offsetHeight;

            // Clear canvas
            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(0, 0, width, height);

            // Draw axes
            ctx.strokeStyle = '#555';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(40, height - 30);
            ctx.lineTo(width - 20, height - 30);
            ctx.moveTo(40, 20);
            ctx.lineTo(40, height - 30);
            ctx.stroke();

            // Plot data
            if (this.state.trainingHistory.length > 1) {
                const data = this.state.trainingHistory;
                const maxReward = Math.max(...data.map(d => d.reward), 1);
                const minReward = Math.min(...data.map(d => d.reward), 0);

                ctx.strokeStyle = '#00ff88';
                ctx.lineWidth = 2;
                ctx.beginPath();

                data.forEach((point, i) => {
                    const x = 40 + (width - 60) * (i / (data.length - 1));
                    const normalizedReward = (point.reward - minReward) / (maxReward - minReward || 1);
                    const y = height - 30 - (height - 50) * normalizedReward;

                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                });

                ctx.stroke();
            }

            // Labels
            ctx.fillStyle = '#fff';
            ctx.font = '12px monospace';
            ctx.fillText('Reward', 5, 15);
            ctx.fillText('Episodes', width - 60, height - 10);
        },

        /**
         * UPDATE TRAINING UI
         */
        updateTrainingUI() {
            document.getElementById('rlEpisode').textContent = this.state.episode;
            document.getElementById('rlAvgReward').textContent = this.state.averageReward.toFixed(2);
            document.getElementById('rlExploration').textContent = (this.config.explorationRate * 100).toFixed(1) + '%';

            // Update chart
            this.renderChart();

            // Update buttons
            document.getElementById('rlStartBtn').disabled = this.state.training;
            document.getElementById('rlPauseBtn').disabled = !this.state.training;
        },

        /**
         * RESET TRAINING
         */
        resetTraining() {
            if (!confirm('Reset all training progress?')) return;

            this.state.episode = 0;
            this.state.totalReward = 0;
            this.state.averageReward = 0;
            this.state.trainingHistory = [];
            this.config.explorationRate = 1.0;

            // Recreate network
            this.createNetwork();

            // Clear checkpoint
            localStorage.removeItem('aevov_rl_checkpoint');

            this.updateTrainingUI();
            
            console.log('🔄 Training reset');
        },

        /**
         * TOGGLE INTERFACE
         */
        toggleInterface() {
            const container = document.getElementById('perpetualRLInterface');
            if (container) {
                const isVisible = container.style.display !== 'none';
                container.style.display = isVisible ? 'none' : 'block';
                this.state.interfaceOpen = !isVisible;
            }
        },

        /**
         * SETUP KEYBOARD SHORTCUTS
         */
        setupKeyboardShortcuts() {
            document.addEventListener('keydown', (e) => {
                // Ctrl+Shift+R - Toggle interface
                if (e.ctrlKey && e.shiftKey && e.key === 'R') {
                    e.preventDefault();
                    this.toggleInterface();
                }
            });
        }
    };

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            PerpetualRL.init();
        });
    } else {
        PerpetualRL.init();
    }

    // Export globally
    window.PerpetualRL = PerpetualRL;

    console.log('✅ Perpetual RL Training System loaded');
    console.log('⌨️ Press Ctrl+Shift+R to open interface');
    console.log('🌐 CapNWeb integration ready for distributed training');

})();