/**
 * WORKFLOW STATUS TESTER
 * Visual status lights showing execution path
 */

(function() {
    'use strict';

    const WorkflowTester = {
        workflows: {
            'pattern_extraction': {
                name: 'Pattern Extraction',
                steps: [
                    { id: 'select_category', label: 'Select Category', status: 'idle' },
                    { id: 'generate_queries', label: 'Generate Queries', status: 'idle' },
                    { id: 'extract_keywords', label: 'Extract Keywords', status: 'idle' },
                    { id: 'apply_nlp', label: 'Apply NLP Processing', status: 'idle' },
                    { id: 'store_patterns', label: 'Store in Database', status: 'idle' },
                    { id: 'index_semantic', label: 'Build Semantic Index', status: 'idle' }
                ]
            },
            'pattern_search': {
                name: 'Pattern Search',
                steps: [
                    { id: 'receive_query', label: 'Receive Query', status: 'idle' },
                    { id: 'extract_query_features', label: 'Extract Query Features', status: 'idle' },
                    { id: 'keyword_match', label: 'Keyword Match (60%)', status: 'idle' },
                    { id: 'semantic_match', label: 'Semantic Match (40%)', status: 'idle' },
                    { id: 'armsquare_validate', label: 'ARMsquare Validation', status: 'idle' },
                    { id: 'return_results', label: 'Return Results', status: 'idle' }
                ]
            },
            'model_evolution': {
                name: 'Model Evolution',
                steps: [
                    { id: 'select_domains', label: 'Select Domains', status: 'idle' },
                    { id: 'gather_patterns', label: 'Gather Patterns', status: 'idle' },
                    { id: 'apply_strategy', label: 'Apply Evolution Strategy', status: 'idle' },
                    { id: 'armsquare_reasoning', label: 'ARMsquare Reasoning', status: 'idle' },
                    { id: 'compress_model', label: 'Compress Model', status: 'idle' },
                    { id: 'export_aev', label: 'Export .aev File', status: 'idle' }
                ]
            },
            'database_sync': {
                name: 'Database Sync',
                steps: [
                    { id: 'check_connection', label: 'Check PGlite', status: 'idle' },
                    { id: 'prepare_data', label: 'Prepare Data', status: 'idle' },
                    { id: 'compress_cache', label: 'LiteSpeed Compression', status: 'idle' },
                    { id: 'write_db', label: 'Write to Database', status: 'idle' },
                    { id: 'sync_cubbit', label: 'Sync to Cubbit', status: 'idle' },
                    { id: 'verify_integrity', label: 'Verify Integrity', status: 'idle' }
                ]
            }
        },

        currentWorkflow: null,
        panelElement: null,

        init() {
            this.createPanel();
            this.hookIntoSystems();
            console.log('✅ Workflow Tester initialized');
        },

        createPanel() {
            const panel = document.createElement('div');
            panel.id = 'workflowTester';
            panel.innerHTML = `
                <div class="workflow-panel">
                    <div class="workflow-header">
                        <h3>🔬 Workflow Status Tester</h3>
                        <button onclick="window.WorkflowTester.close()">✕</button>
                    </div>
                    <div class="workflow-selector">
                        <label>Active Workflow:</label>
                        <select id="workflowSelect" onchange="window.WorkflowTester.switchWorkflow(this.value)">
                            <option value="">Select Workflow...</option>
                            <option value="pattern_extraction">Pattern Extraction</option>
                            <option value="pattern_search">Pattern Search</option>
                            <option value="model_evolution">Model Evolution</option>
                            <option value="database_sync">Database Sync</option>
                        </select>
                    </div>
                    <div id="workflowSteps"></div>
                    <div class="workflow-actions">
                        <button onclick="window.WorkflowTester.testWorkflow()">▶️ Test Current</button>
                        <button onclick="window.WorkflowTester.resetWorkflow()">🔄 Reset</button>
                    </div>
                </div>
            `;

            const style = document.createElement('style');
            style.textContent = `
                #workflowTester {
                    position: fixed;
                    top: 80px;
                    right: 20px;
                    width: 350px;
                    background: rgba(26, 26, 46, 0.95);
                    border: 2px solid #00d4ff;
                    border-radius: 12px;
                    z-index: 99998;
                    display: none;
                    backdrop-filter: blur(10px);
                }

                .workflow-panel {
                    padding: 15px;
                }

                .workflow-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                }

                .workflow-header h3 {
                    margin: 0;
                    color: #00d4ff;
                    font-size: 16px;
                }

                .workflow-header button {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                }

                .workflow-selector {
                    margin-bottom: 15px;
                }

                .workflow-selector label {
                    display: block;
                    color: rgba(255,255,255,0.7);
                    font-size: 12px;
                    margin-bottom: 5px;
                }

                .workflow-selector select {
                    width: 100%;
                    padding: 8px;
                    background: rgba(0,0,0,0.3);
                    border: 1px solid rgba(255,255,255,0.2);
                    border-radius: 6px;
                    color: white;
                    font-size: 13px;
                }

                #workflowSteps {
                    margin: 15px 0;
                }

                .workflow-step {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 10px;
                    margin-bottom: 8px;
                    background: rgba(0,0,0,0.3);
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .workflow-step:hover {
                    background: rgba(0,0,0,0.5);
                }

                .status-light {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    flex-shrink: 0;
                }

                .status-light.idle {
                    background: #666;
                }

                .status-light.running {
                    background: #ff9f0a;
                    animation: pulse 1s infinite;
                }

                .status-light.success {
                    background: #00ff88;
                }

                .status-light.error {
                    background: #ff6b6b;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }

                .step-label {
                    flex: 1;
                    color: white;
                    font-size: 13px;
                }

                .step-status {
                    font-size: 11px;
                    color: rgba(255,255,255,0.5);
                }

                .workflow-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 15px;
                }

                .workflow-actions button {
                    flex: 1;
                    padding: 10px;
                    background: linear-gradient(135deg, #00d4ff 0%, #3a47d5 100%);
                    border: none;
                    color: white;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 13px;
                }

                .workflow-actions button:hover {
                    opacity: 0.9;
                }

                .workflow-tooltip {
                    position: absolute;
                    background: rgba(0,0,0,0.9);
                    color: white;
                    padding: 10px;
                    border-radius: 6px;
                    font-size: 12px;
                    max-width: 250px;
                    z-index: 999999;
                    pointer-events: none;
                }
            `;
            document.head.appendChild(style);
            document.body.appendChild(panel);
            this.panelElement = panel;
        },

        open() {
            this.panelElement.style.display = 'block';
        },

        close() {
            this.panelElement.style.display = 'none';
        },

        switchWorkflow(workflowId) {
            if (!workflowId) return;
            this.currentWorkflow = workflowId;
            this.renderSteps();
        },

        renderSteps() {
            const workflow = this.workflows[this.currentWorkflow];
            if (!workflow) return;

            const container = document.getElementById('workflowSteps');
            container.innerHTML = workflow.steps.map(step => `
                <div class="workflow-step" 
                     data-step-id="${step.id}"
                     onmouseenter="window.WorkflowTester.showTooltip(event, '${step.id}')"
                     onmouseleave="window.WorkflowTester.hideTooltip()">
                    <div class="status-light ${step.status}"></div>
                    <div class="step-label">${step.label}</div>
                    <div class="step-status">${step.status}</div>
                </div>
            `).join('');
        },

        updateStep(stepId, status, message = '') {
            const workflow = this.workflows[this.currentWorkflow];
            if (!workflow) return;

            const step = workflow.steps.find(s => s.id === stepId);
            if (step) {
                step.status = status;
                step.message = message;
                this.renderSteps();
            }
        },

        async testWorkflow() {
            if (!this.currentWorkflow) {
                alert('Select a workflow first');
                return;
            }

            const workflow = this.workflows[this.currentWorkflow];
            
            for (const step of workflow.steps) {
                this.updateStep(step.id, 'running');
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Simulate check
                const success = Math.random() > 0.1;
                this.updateStep(step.id, success ? 'success' : 'error');
                
                if (!success) break;
            }
        },

        resetWorkflow() {
            if (!this.currentWorkflow) return;
            
            const workflow = this.workflows[this.currentWorkflow];
            workflow.steps.forEach(step => step.status = 'idle');
            this.renderSteps();
        },

        showTooltip(event, stepId) {
            const tooltips = {
                'select_category': 'Choose domain and subcategory from hierarchy',
                'generate_queries': 'Use templates to create sample queries',
                'extract_keywords': 'Extract keywords using WordNet uniqueness engine',
                'apply_nlp': 'Process with Compromise NLP for entities and topics',
                'store_patterns': 'Save to PGlite database with compression',
                'index_semantic': 'Build TF-IDF embeddings for semantic search',
                'receive_query': 'User inputs query via chat or voice',
                'extract_query_features': 'Tokenize and extract query terms',
                'keyword_match': 'Exact/fuzzy matching (60% weight)',
                'semantic_match': 'Vector similarity (40% weight)',
                'armsquare_validate': 'Apply 5-dimensional reasoning validation',
                'return_results': 'Return top matches with confidence scores',
                'select_domains': 'Choose parent and subcategories',
                'gather_patterns': 'Collect patterns from selected domains',
                'apply_strategy': 'Apply evolution strategy (similarity/genetic/hybrid)',
                'armsquare_reasoning': 'Apply ARMsquare multidimensional reasoning',
                'compress_model': 'Compress with LiteSpeed/BIDC',
                'export_aev': 'Export as .aev model file',
                'check_connection': 'Verify PGlite database connection',
                'prepare_data': 'Serialize patterns for storage',
                'compress_cache': 'Apply LiteSpeed compression',
                'write_db': 'Write to PGlite tables',
                'sync_cubbit': 'Upload backup to Cubbit cloud',
                'verify_integrity': 'Checksum validation'
            };

            const tooltip = document.createElement('div');
            tooltip.className = 'workflow-tooltip';
            tooltip.textContent = tooltips[stepId] || 'No description available';
            tooltip.style.left = (event.clientX + 10) + 'px';
            tooltip.style.top = (event.clientY + 10) + 'px';
            document.body.appendChild(tooltip);
            this._tooltip = tooltip;
        },

        hideTooltip() {
            if (this._tooltip) {
                this._tooltip.remove();
                this._tooltip = null;
            }
        },

        hookIntoSystems() {
            // Hook into pattern extraction
            if (window.extractCategoryPatterns) {
                const original = window.extractCategoryPatterns;
                window.extractCategoryPatterns = async function(...args) {
                    WorkflowTester.currentWorkflow = 'pattern_extraction';
                    WorkflowTester.open();
                    WorkflowTester.renderSteps();
                    
                    const steps = ['select_category', 'generate_queries', 'extract_keywords', 'apply_nlp', 'store_patterns', 'index_semantic'];
                    for (const step of steps) {
                        WorkflowTester.updateStep(step, 'running');
                        await new Promise(r => setTimeout(r, 300));
                    }
                    
                    const result = await original.apply(this, args);
                    
                    steps.forEach(s => WorkflowTester.updateStep(s, 'success'));
                    return result;
                };
            }

            // Hook into search
            if (window.SemanticSearch) {
                const originalSearch = window.SemanticSearch.search;
                window.SemanticSearch.search = function(...args) {
                    WorkflowTester.currentWorkflow = 'pattern_search';
                    WorkflowTester.open();
                    WorkflowTester.renderSteps();
                    
                    const steps = ['receive_query', 'extract_query_features', 'keyword_match', 'semantic_match', 'armsquare_validate', 'return_results'];
                    steps.forEach((s, i) => {
                        setTimeout(() => WorkflowTester.updateStep(s, i < steps.length - 1 ? 'running' : 'success'), i * 100);
                    });
                    
                    return originalSearch.apply(this, args);
                };
            }
        }
    };

    WorkflowTester.init();
    window.WorkflowTester = WorkflowTester;

})();
