/**
 * INTERACTIVE CONFIGURATION ASSISTANT
 * Real-time system visualization and intelligent onboarding
 * Modal-based for quick access during configuration
 */

(function() {
    'use strict';

    console.log('🗺️ Loading Interactive Configuration Assistant...');

    const ConfigAssistant = {
        state: {
            modalOpen: false,
            currentView: 'overview',
            systemStatus: {},
            draggedElement: null,
            positions: {}
        },

        /**
         * Initialize the assistant
         */
        init() {
            console.log('🚀 Initializing Configuration Assistant...');
            
            // Create modal structure
            this.createModal();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Start monitoring system
            this.startMonitoring();
            
            // Add keyboard shortcut (Ctrl+Shift+M)
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.shiftKey && e.key === 'M') {
                    this.toggle();
                }
            });
            
            console.log('✅ Configuration Assistant ready (Press Ctrl+Shift+M to open)');
        },

        /**
         * Create modal structure
         */
        createModal() {
            const modal = document.createElement('div');
            modal.id = 'configAssistantModal';
            modal.className = 'config-assistant-modal';
            modal.innerHTML = `
                <div class="config-modal-overlay"></div>
                <div class="config-modal-content">
                    <div class="config-modal-header">
                        <div class="config-header-left">
                            <h2>🗺️ Aevov Configuration Assistant</h2>
                            <div class="config-status-badge" id="configStatusBadge">Analyzing...</div>
                        </div>
                        <div class="config-header-right">
                            <button class="config-btn-minimize" onclick="window.ConfigAssistant.minimize()">_</button>
                            <button class="config-btn-close" onclick="window.ConfigAssistant.close()">✕</button>
                        </div>
                    </div>
                    
                    <div class="config-modal-body">
                        <div class="config-sidebar">
                            <div class="config-nav-item active" data-view="overview">
                                📊 System Overview
                            </div>
                            <div class="config-nav-item" data-view="flow">
                                🔄 Technical Flow
                            </div>
                            <div class="config-nav-item" data-view="onboarding">
                                🎓 Onboarding Guide
                            </div>
                            <div class="config-nav-item" data-view="diagnostics">
                                🔍 Diagnostics
                            </div>
                            <div class="config-nav-item" data-view="configuration">
                                ⚙️ Configuration
                            </div>
                        </div>
                        
                        <div class="config-main-content" id="configMainContent">
                            <!-- Dynamic content loads here -->
                        </div>
                    </div>
                    
                    <div class="config-modal-footer">
                        <div class="config-quick-stats">
                            <span id="envStatus">Environment: Checking...</span>
                            <span id="cacheStatus">Cache: Checking...</span>
                            <span id="patternsStatus">Patterns: Checking...</span>
                        </div>
                        <button class="config-btn-action" onclick="window.ConfigAssistant.runQuickFix()">
                            🔧 Quick Fix
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            this.addStyles();
        },

        /**
         * Add comprehensive styles
         */
        addStyles() {
            const style = document.createElement('style');
            style.textContent = `
                .config-assistant-modal {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10000;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                
                .config-assistant-modal.open {
                    display: block;
                }
                
                .config-modal-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(5px);
                }
                
                .config-modal-content {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 90%;
                    max-width: 1400px;
                    height: 85vh;
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    border: 2px solid #00d2ff;
                }
                
                .config-modal-header {
                    padding: 20px 30px;
                    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 2px solid #00d2ff;
                }
                
                .config-header-left {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }
                
                .config-modal-header h2 {
                    margin: 0;
                    color: #fff;
                    font-size: 24px;
                    font-weight: 700;
                }
                
                .config-status-badge {
                    padding: 6px 16px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 20px;
                    font-size: 13px;
                    color: #fff;
                    font-weight: 600;
                }
                
                .config-status-badge.healthy {
                    background: linear-gradient(135deg, #00ff88 0%, #00d2ff 100%);
                    color: #000;
                    animation: pulse-healthy 2s infinite;
                }
                
                .config-status-badge.warning {
                    background: linear-gradient(135deg, #ff9f0a 0%, #ff6b6b 100%);
                }
                
                .config-status-badge.error {
                    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
                    animation: pulse-error 1s infinite;
                }
                
                @keyframes pulse-healthy {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
                
                @keyframes pulse-error {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                
                .config-header-right {
                    display: flex;
                    gap: 10px;
                }
                
                .config-btn-minimize,
                .config-btn-close {
                    width: 36px;
                    height: 36px;
                    border: none;
                    background: rgba(255, 255, 255, 0.2);
                    color: #fff;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 18px;
                    font-weight: bold;
                    transition: all 0.2s;
                }
                
                .config-btn-minimize:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(1.05);
                }
                
                .config-btn-close:hover {
                    background: #ff6b6b;
                    transform: scale(1.05);
                }
                
                .config-modal-body {
                    flex: 1;
                    display: flex;
                    overflow: hidden;
                }
                
                .config-sidebar {
                    width: 250px;
                    background: rgba(0, 0, 0, 0.3);
                    border-right: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 20px 0;
                }
                
                .config-nav-item {
                    padding: 15px 30px;
                    color: rgba(255, 255, 255, 0.7);
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 14px;
                    font-weight: 500;
                }
                
                .config-nav-item:hover {
                    background: rgba(255, 255, 255, 0.05);
                    color: #fff;
                }
                
                .config-nav-item.active {
                    background: linear-gradient(90deg, rgba(0, 210, 255, 0.2) 0%, transparent 100%);
                    color: #00d2ff;
                    border-left: 3px solid #00d2ff;
                }
                
                .config-main-content {
                    flex: 1;
                    padding: 30px;
                    overflow-y: auto;
                    color: #fff;
                }
                
                .config-main-content::-webkit-scrollbar {
                    width: 10px;
                }
                
                .config-main-content::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.2);
                }
                
                .config-main-content::-webkit-scrollbar-thumb {
                    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
                    border-radius: 5px;
                }
                
                .config-modal-footer {
                    padding: 15px 30px;
                    background: rgba(0, 0, 0, 0.3);
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .config-quick-stats {
                    display: flex;
                    gap: 30px;
                    font-size: 13px;
                    color: rgba(255, 255, 255, 0.7);
                }
                
                .config-btn-action {
                    padding: 10px 24px;
                    background: linear-gradient(135deg, #00ff88 0%, #00d2ff 100%);
                    border: none;
                    border-radius: 8px;
                    color: #000;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 14px;
                }
                
                .config-btn-action:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0, 255, 136, 0.4);
                }
                
                /* Flow visualization */
                .flow-canvas {
                    position: relative;
                    width: 100%;
                    height: 600px;
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 10px;
                    overflow: hidden;
                }
                
                .flow-node {
                    position: absolute;
                    padding: 20px;
                    background: linear-gradient(135deg, rgba(118, 75, 162, 0.3) 0%, rgba(102, 126, 234, 0.3) 100%);
                    border: 2px solid rgba(255, 255, 255, 0.2);
                    border-radius: 12px;
                    cursor: move;
                    user-select: none;
                    transition: all 0.2s;
                    min-width: 180px;
                }
                
                .flow-node:hover {
                    border-color: #00d2ff;
                    box-shadow: 0 0 20px rgba(0, 210, 255, 0.3);
                }
                
                .flow-node.active {
                    border-color: #00ff88;
                    background: linear-gradient(135deg, rgba(0, 255, 136, 0.2) 0%, rgba(0, 210, 255, 0.2) 100%);
                    animation: node-pulse 2s infinite;
                }
                
                .flow-node.inactive {
                    opacity: 0.5;
                    border-color: #ff6b6b;
                }
                
                @keyframes node-pulse {
                    0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 136, 0.3); }
                    50% { box-shadow: 0 0 30px rgba(0, 255, 136, 0.6); }
                }
                
                .flow-node-title {
                    font-weight: 600;
                    font-size: 14px;
                    margin-bottom: 8px;
                    color: #fff;
                }
                
                .flow-node-status {
                    font-size: 11px;
                    color: rgba(255, 255, 255, 0.7);
                }
                
                .flow-connection {
                    position: absolute;
                    pointer-events: none;
                }
                
                /* Overview grid */
                .overview-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
                    margin-top: 20px;
                }
                
                .overview-card {
                    padding: 25px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    transition: all 0.2s;
                }
                
                .overview-card:hover {
                    border-color: #00d2ff;
                    transform: translateY(-2px);
                }
                
                .overview-card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                }
                
                .overview-card-title {
                    font-size: 16px;
                    font-weight: 600;
                }
                
                .overview-card-icon {
                    font-size: 24px;
                }
                
                .overview-card-content {
                    font-size: 14px;
                    color: rgba(255, 255, 255, 0.8);
                    line-height: 1.6;
                }
                
                .status-indicator {
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    margin-right: 8px;
                }
                
                .status-indicator.active {
                    background: #00ff88;
                    box-shadow: 0 0 10px #00ff88;
                }
                
                .status-indicator.warning {
                    background: #ff9f0a;
                    box-shadow: 0 0 10px #ff9f0a;
                }
                
                .status-indicator.error {
                    background: #ff6b6b;
                    box-shadow: 0 0 10px #ff6b6b;
                }
                
                /* Onboarding steps */
                .onboarding-step {
                    padding: 25px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    margin-bottom: 20px;
                }
                
                .onboarding-step.completed {
                    border-color: #00ff88;
                    background: rgba(0, 255, 136, 0.05);
                }
                
                .onboarding-step.active {
                    border-color: #00d2ff;
                    background: rgba(0, 210, 255, 0.05);
                }
                
                .onboarding-step-header {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    margin-bottom: 15px;
                }
                
                .onboarding-step-number {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 18px;
                }
                
                .onboarding-step.completed .onboarding-step-number {
                    background: linear-gradient(135deg, #00ff88 0%, #00d2ff 100%);
                }
                
                .onboarding-step-title {
                    font-size: 18px;
                    font-weight: 600;
                }
                
                .onboarding-step-content {
                    margin-left: 55px;
                    color: rgba(255, 255, 255, 0.8);
                    line-height: 1.6;
                }
                
                .onboarding-action-btn {
                    margin-left: 55px;
                    margin-top: 15px;
                    padding: 10px 20px;
                    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
                    border: none;
                    border-radius: 8px;
                    color: #fff;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .onboarding-action-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(118, 75, 162, 0.4);
                }
                
                /* Diagnostics table */
                .diagnostics-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }
                
                .diagnostics-table th,
                .diagnostics-table td {
                    padding: 15px;
                    text-align: left;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .diagnostics-table th {
                    background: rgba(255, 255, 255, 0.05);
                    font-weight: 600;
                    color: #00d2ff;
                }
                
                .diagnostics-table tr:hover {
                    background: rgba(255, 255, 255, 0.02);
                }
            `;
            document.head.appendChild(style);
        },

        /**
         * Set up event listeners
         */
        setupEventListeners() {
            // Navigation
            const navItems = document.querySelectorAll('.config-nav-item');
            navItems.forEach(item => {
                item.addEventListener('click', () => {
                    navItems.forEach(n => n.classList.remove('active'));
                    item.classList.add('active');
                    const view = item.getAttribute('data-view');
                    this.switchView(view);
                });
            });
            
            // Close on overlay click
            const overlay = document.querySelector('.config-modal-overlay');
            overlay.addEventListener('click', () => this.close());
            
            // Draggable nodes setup will be done when rendering flow view
        },

        /**
         * Start monitoring system status
         */
        startMonitoring() {
            this.updateSystemStatus();
            setInterval(() => this.updateSystemStatus(), 3000);
        },

        /**
         * Update system status
         */
        updateSystemStatus() {
            const status = {
                environment: window.AEVOV_ENVIRONMENT || 'unknown',
                cacheChunks: 0,
                patterns: 0,
                componentsReady: 0,
                componentsTotal: 5,
                issues: []
            };
            
            // Check environment
            if (window.EnvironmentDetector) {
                status.environment = window.EnvironmentDetector.getEnvironment();
            } else {
                status.issues.push('Environment Detector not found');
            }
            
            // Check cache
            if (window.CachePatternIntegration) {
                const cacheStats = window.CachePatternIntegration.getStats();
                status.cacheChunks = cacheStats.cachedChunks;
                status.patterns = cacheStats.extractedPatterns;
            } else {
                status.issues.push('Cache Integration not found');
            }
            
            // Check components
            const components = [
                'EnvironmentDetector',
                'CachePatternIntegration',
                'loadModel',
                'processRealPatterns',
                'ComparatorEngine'
            ];
            
            components.forEach(comp => {
                if (typeof window[comp] !== 'undefined') {
                    status.componentsReady++;
                }
            });
            
            // Determine overall health
            if (status.componentsReady === status.componentsTotal && status.issues.length === 0) {
                status.health = 'healthy';
            } else if (status.componentsReady >= 3) {
                status.health = 'warning';
            } else {
                status.health = 'error';
            }
            
            this.state.systemStatus = status;
            this.updateStatusDisplay();
        },

        /**
         * Update status display in modal
         */
        updateStatusDisplay() {
            const status = this.state.systemStatus;
            
            // Update badge
            const badge = document.getElementById('configStatusBadge');
            if (badge) {
                badge.className = `config-status-badge ${status.health}`;
                badge.textContent = status.health === 'healthy' ? '✓ System Healthy' :
                                  status.health === 'warning' ? '⚠ Issues Detected' :
                                  '✕ Configuration Needed';
            }
            
            // Update footer stats
            document.getElementById('envStatus').textContent = 
                `Environment: ${status.environment.toUpperCase()}`;
            document.getElementById('cacheStatus').textContent = 
                `Cache: ${status.cacheChunks} chunks`;
            document.getElementById('patternsStatus').textContent = 
                `Patterns: ${status.patterns}`;
        },

        /**
         * Switch view
         */
        switchView(view) {
            this.state.currentView = view;
            const content = document.getElementById('configMainContent');
            
            switch(view) {
                case 'overview':
                    content.innerHTML = this.renderOverview();
                    break;
                case 'flow':
                    content.innerHTML = this.renderFlow();
                    this.initializeDraggableNodes();
                    break;
                case 'onboarding':
                    content.innerHTML = this.renderOnboarding();
                    break;
                case 'diagnostics':
                    content.innerHTML = this.renderDiagnostics();
                    break;
                case 'configuration':
                    content.innerHTML = this.renderConfiguration();
                    break;
            }
        },

        /**
         * Render overview
         */
        renderOverview() {
            const status = this.state.systemStatus;
            
            return `
                <h3>System Overview</h3>
                <p style="color: rgba(255, 255, 255, 0.7); margin-bottom: 30px;">
                    Real-time status of your Aevov system configuration
                </p>
                
                <div class="overview-grid">
                    <div class="overview-card">
                        <div class="overview-card-header">
                            <span class="overview-card-title">Environment</span>
                            <span class="overview-card-icon">🌍</span>
                        </div>
                        <div class="overview-card-content">
                            <span class="status-indicator ${status.environment !== 'unknown' ? 'active' : 'error'}"></span>
                            Running in <strong>${status.environment.toUpperCase()}</strong> mode
                            <br><br>
                            ${status.environment === 'local' ? 
                                '✓ IndexedDB storage<br>✓ Simulated consensus<br>✓ 0.1-2ms inference' :
                                status.environment === 'cloud' ?
                                '✓ DHT distributed<br>✓ Real consensus<br>✓ 5-20ms inference' :
                                '⚠ Environment not detected'}
                        </div>
                    </div>
                    
                    <div class="overview-card">
                        <div class="overview-card-header">
                            <span class="overview-card-title">Cache & Patterns</span>
                            <span class="overview-card-icon">💾</span>
                        </div>
                        <div class="overview-card-content">
                            <span class="status-indicator ${status.cacheChunks > 0 ? 'active' : 'warning'}"></span>
                            <strong>${status.cacheChunks}</strong> chunks cached
                            <br>
                            <strong>${status.patterns}</strong> patterns extracted
                            <br><br>
                            ${status.cacheChunks === 0 ? 
                                '⚠ No model chunks loaded yet' :
                                '✓ Pattern extraction active'}
                        </div>
                    </div>
                    
                    <div class="overview-card">
                        <div class="overview-card-header">
                            <span class="overview-card-title">Components</span>
                            <span class="overview-card-icon">⚙️</span>
                        </div>
                        <div class="overview-card-content">
                            <span class="status-indicator ${status.componentsReady === status.componentsTotal ? 'active' : 'warning'}"></span>
                            <strong>${status.componentsReady}/${status.componentsTotal}</strong> components ready
                            <br><br>
                            ${this.renderComponentStatus()}
                        </div>
                    </div>
                    
                    <div class="overview-card">
                        <div class="overview-card-header">
                            <span class="overview-card-title">System Health</span>
                            <span class="overview-card-icon">${status.health === 'healthy' ? '✅' : status.health === 'warning' ? '⚠️' : '❌'}</span>
                        </div>
                        <div class="overview-card-content">
                            <span class="status-indicator ${status.health}"></span>
                            ${status.health === 'healthy' ? '<strong>All systems operational</strong>' :
                              status.health === 'warning' ? '<strong>Minor issues detected</strong>' :
                              '<strong>Configuration required</strong>'}
                            <br><br>
                            ${status.issues.length > 0 ? 
                                'Issues: ' + status.issues.join(', ') :
                                'No issues detected'}
                        </div>
                    </div>
                </div>
            `;
        },

        /**
         * Render component status
         */
        renderComponentStatus() {
            const components = {
                'EnvironmentDetector': 'Environment Detector',
                'CachePatternIntegration': 'Cache Integration',
                'loadModel': 'JSON Loader',
                'processRealPatterns': 'Advanced Extractor',
                'ComparatorEngine': 'Inference Engine'
            };
            
            let html = '';
            Object.entries(components).forEach(([key, name]) => {
                const exists = typeof window[key] !== 'undefined';
                html += `${exists ? '✓' : '✕'} ${name}<br>`;
            });
            
            return html;
        },

        /**
         * Render technical flow with draggable nodes
         */
        renderFlow() {
            return `
                <h3>Technical Flow Visualization</h3>
                <p style="color: rgba(255, 255, 255, 0.7); margin-bottom: 20px;">
                    Drag nodes to rearrange. Green = active, Red = inactive, Blue = processing
                </p>
                
                <div class="flow-canvas" id="flowCanvas">
                    <svg id="flowConnections" style="position: absolute; width: 100%; height: 100%; pointer-events: none;">
                        <!-- Connections drawn here -->
                    </svg>
                    <div id="flowNodes">
                        <!-- Nodes rendered here -->
                    </div>
                </div>
                
                <div style="margin-top: 20px; padding: 20px; background: rgba(255, 255, 255, 0.05); border-radius: 10px;">
                    <h4>Current Flow Status</h4>
                    <div id="flowStatus">Loading...</div>
                </div>
            `;
        },

        /**
         * Initialize draggable flow nodes
         */
        initializeDraggableNodes() {
            const nodes = [
                { id: 'env', title: 'Environment Detection', x: 50, y: 50, status: 'active' },
                { id: 'json', title: 'JSON Loader', x: 300, y: 50, status: 'active' },
                { id: 'cache', title: 'Cache Integration', x: 550, y: 50, status: 'active' },
                { id: 'extract', title: 'Pattern Extraction', x: 800, y: 50, status: 'processing' },
                { id: 'advanced', title: 'Advanced Extractor', x: 175, y: 250, status: 'active' },
                { id: 'categorize', title: 'Categorization', x: 425, y: 250, status: 'active' },
                { id: 'synthesize', title: 'Synthesis', x: 675, y: 250, status: 'processing' },
                { id: 'inference', title: 'Inference Engine', x: 425, y: 450, status: 'warning' }
            ];
            
            const connections = [
                ['env', 'json'],
                ['json', 'cache'],
                ['cache', 'extract'],
                ['extract', 'advanced'],
                ['advanced', 'categorize'],
                ['categorize', 'synthesize'],
                ['synthesize', 'inference']
            ];
            
            this.renderFlowNodes(nodes);
            this.renderFlowConnections(nodes, connections);
            this.setupDragHandlers();
            this.updateFlowStatus();
        },

        /**
         * Render flow nodes
         */
        renderFlowNodes(nodes) {
            const container = document.getElementById('flowNodes');
            
            nodes.forEach(node => {
                const div = document.createElement('div');
                div.className = `flow-node ${node.status}`;
                div.id = `node-${node.id}`;
                div.style.left = node.x + 'px';
                div.style.top = node.y + 'px';
                div.setAttribute('data-node-id', node.id);
                
                div.innerHTML = `
                    <div class="flow-node-title">${node.title}</div>
                    <div class="flow-node-status">${node.status}</div>
                `;
                
                container.appendChild(div);
                
                // Store position
                this.state.positions[node.id] = { x: node.x, y: node.y };
            });
        },

        /**
         * Render flow connections
         */
        renderFlowConnections(nodes, connections) {
            const svg = document.getElementById('flowConnections');
            svg.innerHTML = '';
            
            connections.forEach(([from, to]) => {
                const fromPos = this.state.positions[from];
                const toPos = this.state.positions[to];
                
                if (fromPos && toPos) {
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', fromPos.x + 90);
                    line.setAttribute('y1', fromPos.y + 40);
                    line.setAttribute('x2', toPos.x + 90);
                    line.setAttribute('y2', toPos.y + 40);
                    line.setAttribute('stroke', 'rgba(0, 210, 255, 0.3)');
                    line.setAttribute('stroke-width', '2');
                    svg.appendChild(line);
                }
            });
        },

        /**
         * Setup drag handlers for nodes
         */
        setupDragHandlers() {
            const nodes = document.querySelectorAll('.flow-node');
            
            nodes.forEach(node => {
                let isDragging = false;
                let startX, startY, initialX, initialY;
                
                node.addEventListener('mousedown', (e) => {
                    isDragging = true;
                    startX = e.clientX;
                    startY = e.clientY;
                    initialX = parseInt(node.style.left);
                    initialY = parseInt(node.style.top);
                    node.style.cursor = 'grabbing';
                    node.style.zIndex = 1000;
                });
                
                document.addEventListener('mousemove', (e) => {
                    if (!isDragging) return;
                    
                    const dx = e.clientX - startX;
                    const dy = e.clientY - startY;
                    
                    const newX = initialX + dx;
                    const newY = initialY + dy;
                    
                    node.style.left = newX + 'px';
                    node.style.top = newY + 'px';
                    
                    // Update position in state
                    const nodeId = node.getAttribute('data-node-id');
                    this.state.positions[nodeId] = { x: newX, y: newY };
                    
                    // Redraw connections
                    // (Would need to store connections and redraw)
                });
                
                document.addEventListener('mouseup', () => {
                    if (isDragging) {
                        isDragging = false;
                        node.style.cursor = 'move';
                        node.style.zIndex = 'auto';
                    }
                });
            });
        },

        /**
         * Update flow status
         */
        updateFlowStatus() {
            const statusDiv = document.getElementById('flowStatus');
            if (!statusDiv) return;
            
            const status = this.state.systemStatus;
            
            statusDiv.innerHTML = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div>
                        <strong>Environment Detection:</strong> 
                        ${typeof window.EnvironmentDetector !== 'undefined' ? '✓ Active' : '✕ Inactive'}
                    </div>
                    <div>
                        <strong>JSON Loader:</strong> 
                        ${typeof window.loadModel === 'function' ? '✓ Ready' : '✕ Not Found'}
                    </div>
                    <div>
                        <strong>Cache Integration:</strong> 
                        ${typeof window.CachePatternIntegration !== 'undefined' ? '✓ Running' : '✕ Inactive'}
                    </div>
                    <div>
                        <strong>Pattern Extraction:</strong> 
                        ${status.patterns > 0 ? `✓ ${status.patterns} patterns` : '⚠ No patterns yet'}
                    </div>
                    <div>
                        <strong>Advanced Extractor:</strong> 
                        ${typeof window.processRealPatterns === 'function' ? '✓ Available' : '✕ Not Found'}
                    </div>
                    <div>
                        <strong>Inference Engine:</strong> 
                        ${typeof window.ComparatorEngine !== 'undefined' ? '✓ Ready' : '✕ Not Found'}
                    </div>
                </div>
            `;
        },

        /**
         * Render onboarding guide
         */
        renderOnboarding() {
            const steps = this.getOnboardingSteps();
            
            let html = `
                <h3>Onboarding Guide</h3>
                <p style="color: rgba(255, 255, 255, 0.7); margin-bottom: 30px;">
                    Follow these steps to get your Aevov system fully configured
                </p>
            `;
            
            steps.forEach((step, index) => {
                html += `
                    <div class="onboarding-step ${step.completed ? 'completed' : step.current ? 'active' : ''}">
                        <div class="onboarding-step-header">
                            <div class="onboarding-step-number">${step.completed ? '✓' : index + 1}</div>
                            <div class="onboarding-step-title">${step.title}</div>
                        </div>
                        <div class="onboarding-step-content">
                            ${step.description}
                            ${step.action ? `
                                <button class="onboarding-action-btn" onclick="${step.action}">
                                    ${step.actionLabel}
                                </button>
                            ` : ''}
                        </div>
                    </div>
                `;
            });
            
            return html;
        },

        /**
         * Get onboarding steps with completion status
         */
        getOnboardingSteps() {
            const envDetected = typeof window.EnvironmentDetector !== 'undefined';
            const cacheActive = typeof window.CachePatternIntegration !== 'undefined';
            const hasChunks = this.state.systemStatus.cacheChunks > 0;
            const hasPatterns = this.state.systemStatus.patterns > 0;
            const inferenceReady = typeof window.ComparatorEngine !== 'undefined';
            
            return [
                {
                    title: 'Environment Detection',
                    description: 'System automatically detects if running locally or in cloud environment.',
                    completed: envDetected,
                    current: !envDetected
                },
                {
                    title: 'Load Model Chunks',
                    description: 'Use the JSON Loader to load a model. Chunks will be cached automatically.',
                    completed: hasChunks,
                    current: envDetected && !hasChunks,
                    action: 'window.ConfigAssistant.goToTab("loader")',
                    actionLabel: 'Open JSON Loader'
                },
                {
                    title: 'Pattern Extraction',
                    description: 'System extracts real patterns from cached chunks using tensor analysis.',
                    completed: hasPatterns,
                    current: hasChunks && !hasPatterns
                },
                {
                    title: 'Verify Inference Engine',
                    description: 'Ensure the inference engine is properly configured and receiving patterns.',
                    completed: inferenceReady && hasPatterns,
                    current: hasPatterns && !inferenceReady,
                    action: 'window.ConfigAssistant.testInference()',
                    actionLabel: 'Test Inference'
                },
                {
                    title: 'Test System',
                    description: 'Run a test query to verify the entire pipeline is working correctly.',
                    completed: false,
                    current: inferenceReady && hasPatterns,
                    action: 'window.ConfigAssistant.runSystemTest()',
                    actionLabel: 'Run Test'
                }
            ];
        },

        /**
         * Render diagnostics
         */
        renderDiagnostics() {
            const diag = window.Aevov ? window.Aevov.diagnostics() : null;
            
            if (!diag) {
                return '<p>Diagnostics not available. System Integration may not be loaded.</p>';
            }
            
            return `
                <h3>System Diagnostics</h3>
                <p style="color: rgba(255, 255, 255, 0.7); margin-bottom: 20px;">
                    Detailed diagnostic information
                </p>
                
                <table class="diagnostics-table">
                    <thead>
                        <tr>
                            <th>Component</th>
                            <th>Status</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Environment</td>
                            <td><span class="status-indicator active"></span>Detected</td>
                            <td>${diag.environment.detected || 'unknown'}</td>
                        </tr>
                        <tr>
                            <td>Cache Chunks</td>
                            <td><span class="status-indicator ${diag.cache?.cachedChunks > 0 ? 'active' : 'warning'}"></span>
                                ${diag.cache?.cachedChunks || 0} chunks
                            </td>
                            <td>Processed: ${diag.cache?.processedChunks || 0}</td>
                        </tr>
                        <tr>
                            <td>Extracted Patterns</td>
                            <td><span class="status-indicator ${diag.cache?.extractedPatterns > 0 ? 'active' : 'warning'}"></span>
                                ${diag.cache?.extractedPatterns || 0} patterns
                            </td>
                            <td>From tensor analysis</td>
                        </tr>
                        <tr>
                            <td>Pattern Database</td>
                            <td><span class="status-indicator ${diag.patterns?.window_patterns > 0 ? 'active' : 'warning'}"></span>
                                ${diag.patterns?.window_patterns || 0} categories
                            </td>
                            <td>Advanced: ${diag.patterns?.advanced_patterns || 0}</td>
                        </tr>
                        ${Object.entries(diag.components || {}).map(([comp, ready]) => `
                            <tr>
                                <td>${comp.replace(/([A-Z])/g, ' $1').trim()}</td>
                                <td><span class="status-indicator ${ready ? 'active' : 'error'}"></span>
                                    ${ready ? 'Ready' : 'Not Found'}
                                </td>
                                <td>${ready ? '✓ Operational' : '✕ Missing'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div style="margin-top: 20px;">
                    <button class="config-btn-action" onclick="window.Aevov.exportDiagnostics()">
                        📥 Export Full Diagnostics
                    </button>
                </div>
            `;
        },

        /**
         * Render configuration
         */
        renderConfiguration() {
            return `
                <h3>System Configuration</h3>
                <p style="color: rgba(255, 255, 255, 0.7); margin-bottom: 30px;">
                    Adjust system settings and behavior
                </p>
                
                <div class="overview-card" style="margin-bottom: 20px;">
                    <h4>Environment Override</h4>
                    <p style="color: rgba(255, 255, 255, 0.7); margin: 10px 0;">
                        Force a specific environment for testing
                    </p>
                    <button class="onboarding-action-btn" onclick="window.EnvironmentDetector.forceEnvironment('local'); window.ConfigAssistant.updateSystemStatus();">
                        Set to Local Mode
                    </button>
                    <button class="onboarding-action-btn" onclick="window.EnvironmentDetector.forceEnvironment('cloud'); window.ConfigAssistant.updateSystemStatus();">
                        Set to Cloud Mode
                    </button>
                </div>
                
                <div class="overview-card" style="margin-bottom: 20px;">
                    <h4>Cache Management</h4>
                    <p style="color: rgba(255, 255, 255, 0.7); margin: 10px 0;">
                        Manage cached model chunks and extracted patterns
                    </p>
                    <button class="onboarding-action-btn" onclick="window.CachePatternIntegration.forceScan();">
                        Force Cache Scan
                    </button>
                    <button class="onboarding-action-btn" onclick="window.Aevov.extractPatterns();">
                        Extract Patterns Now
                    </button>
                </div>
                
                <div class="overview-card" style="margin-bottom: 20px;">
                    <h4>System Actions</h4>
                    <p style="color: rgba(255, 255, 255, 0.7); margin: 10px 0;">
                        System-wide operations
                    </p>
                    <button class="onboarding-action-btn" onclick="window.Aevov.reinitialize();">
                        Reinitialize System
                    </button>
                    <button class="onboarding-action-btn" onclick="window.location.reload();">
                        Reload Page
                    </button>
                </div>
            `;
        },

        /**
         * Toggle modal
         */
        toggle() {
            if (this.state.modalOpen) {
                this.close();
            } else {
                this.open();
            }
        },

        /**
         * Open modal
         */
        open() {
            const modal = document.getElementById('configAssistantModal');
            modal.classList.add('open');
            this.state.modalOpen = true;
            this.switchView('overview');
            this.updateSystemStatus();
        },

        /**
         * Close modal
         */
        close() {
            const modal = document.getElementById('configAssistantModal');
            modal.classList.remove('open');
            this.state.modalOpen = false;
        },

        /**
         * Minimize modal
         */
        minimize() {
            // Could implement minimize to corner
            this.close();
        },

        /**
         * Run quick fix
         */
        async runQuickFix() {
            console.log('🔧 Running quick fix...');
            
            // Scan cache
            if (window.CachePatternIntegration) {
                await window.CachePatternIntegration.forceScan();
            }
            
            // Extract patterns
            if (window.Aevov) {
                await window.Aevov.extractPatterns();
            }
            
            // Update status
            this.updateSystemStatus();
            
            alert('✓ Quick fix complete! Check the diagnostics tab for results.');
        },

        /**
         * Go to specific tab (helper for onboarding)
         */
        goToTab(tabName) {
            this.close();
            // Trigger tab switch in main UI
            const tab = document.querySelector(`[onclick="switchTab('${tabName}')"]`);
            if (tab) tab.click();
        },

        /**
         * Test inference
         */
        async testInference() {
            if (typeof window.ChatWidget !== 'undefined' && window.ChatWidget.processQuery) {
                const result = window.ChatWidget.processQuery('test query');
                alert(`Inference test result:\n\n${result}`);
            } else {
                alert('Chat Widget not available for testing');
            }
        },

        /**
         * Run system test
         */
        async runSystemTest() {
            const tests = [];
            
            tests.push('Environment: ' + (window.AEVOV_ENVIRONMENT || 'NOT SET'));
            tests.push('Cache: ' + (window.CachePatternIntegration ? 'OK' : 'MISSING'));
            tests.push('Patterns: ' + (this.state.systemStatus.patterns || 0));
            
            alert('System Test Results:\n\n' + tests.join('\n'));
        }
    };

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            ConfigAssistant.init();
        });
    } else {
        ConfigAssistant.init();
    }

    // Export
    window.ConfigAssistant = ConfigAssistant;

    console.log('✅ Interactive Configuration Assistant loaded');
    console.log('💡 Press Ctrl+Shift+M to open the Configuration Assistant');

})();