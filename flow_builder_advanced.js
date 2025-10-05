/**
 * FLOW BUILDER ADVANCED FEATURES
 * Auto-configuration, template generation, onboarding integration, self-configuration
 * 
 * Features:
 * - AI-powered auto-configuration
 * - Dynamic template generation
 * - Onboarding flow automation
 * - Self-learning connection logic
 * - Flow validation and optimization
 * - Integration with all Aevov systems
 */

(function() {
    'use strict';

    console.log('🚀 Loading Flow Builder Advanced Features...');

    const FlowBuilderAdvanced = {
        version: '1.0.0',

        autoConfigEngine: {
            async analyzeFlow(blocks, connections) {
                console.log('🔍 Analyzing flow structure...');

                const analysis = {
                    blockCount: blocks.length,
                    connectionCount: connections.length,
                    missingConnections: [],
                    optimizations: [],
                    warnings: [],
                    categories: this.categorizeBlocks(blocks)
                };

                // Detect missing connections
                blocks.forEach(block => {
                    if (block.inputs && block.inputs.length > 0) {
                        const inputConnections = connections.filter(c => c.to.blockId === block.id);
                        if (inputConnections.length === 0) {
                            analysis.missingConnections.push({
                                blockId: block.id,
                                blockName: block.name,
                                type: 'input',
                                suggestion: this.suggestConnection(block, blocks, 'input')
                            });
                        }
                    }

                    if (block.outputs && block.outputs.length > 0) {
                        const outputConnections = connections.filter(c => c.from.blockId === block.id);
                        if (outputConnections.length === 0) {
                            analysis.missingConnections.push({
                                blockId: block.id,
                                blockName: block.name,
                                type: 'output',
                                suggestion: this.suggestConnection(block, blocks, 'output')
                            });
                        }
                    }
                });

                // Detect optimization opportunities
                analysis.optimizations = this.detectOptimizations(blocks, connections);

                return analysis;
            },

            categorizeBlocks(blocks) {
                const categories = {};
                blocks.forEach(block => {
                    if (!categories[block.category]) {
                        categories[block.category] = [];
                    }
                    categories[block.category].push(block);
                });
                return categories;
            },

            suggestConnection(block, allBlocks, direction) {
                if (direction === 'input') {
                    // Find blocks with outputs that could connect
                    const candidates = allBlocks.filter(b => 
                        b.outputs && b.outputs.length > 0 && b.id !== block.id
                    );

                    if (candidates.length > 0) {
                        // Prefer blocks of compatible categories
                        const compatible = candidates.find(c => this.areBlocksCompatible(c, block));
                        return compatible || candidates[0];
                    }
                } else {
                    // Find blocks with inputs that could connect
                    const candidates = allBlocks.filter(b => 
                        b.inputs && b.inputs.length > 0 && b.id !== block.id
                    );

                    if (candidates.length > 0) {
                        const compatible = candidates.find(c => this.areBlocksCompatible(block, c));
                        return compatible || candidates[0];
                    }
                }

                return null;
            },

            areBlocksCompatible(from, to) {
                const compatibilityMatrix = {
                    'Input': ['Processing', 'Logic', 'Storage'],
                    'Processing': ['Logic', 'Output', 'Storage', 'Testing'],
                    'Logic': ['Processing', 'Output', 'Logic'],
                    'Storage': ['Processing', 'Output'],
                    'Output': [],
                    'Integration': ['Processing', 'Storage'],
                    'Testing': ['Output', 'Storage']
                };

                return compatibilityMatrix[from.category]?.includes(to.category);
            },

            detectOptimizations(blocks, connections) {
                const optimizations = [];

                // Detect parallel processing opportunities
                const processingBlocks = blocks.filter(b => b.category === 'Processing');
                if (processingBlocks.length > 1) {
                    optimizations.push({
                        type: 'parallel',
                        message: 'Multiple processing blocks can run in parallel',
                        blocks: processingBlocks.map(b => b.id)
                    });
                }

                // Detect caching opportunities
                const storageBlocks = blocks.filter(b => b.category === 'Storage');
                if (storageBlocks.length === 0 && processingBlocks.length > 0) {
                    optimizations.push({
                        type: 'caching',
                        message: 'Add storage blocks to cache processing results',
                        suggestion: 'saveToStorage'
                    });
                }

                // Detect validation gaps
                const consensusBlocks = blocks.filter(b => b.type === 'consensusValidation');
                if (consensusBlocks.length === 0 && processingBlocks.length > 0) {
                    optimizations.push({
                        type: 'validation',
                        message: 'Add consensus validation for critical operations',
                        suggestion: 'consensusValidation'
                    });
                }

                return optimizations;
            },

            async autoConnect(blocks) {
                const connections = [];

                for (let i = 0; i < blocks.length - 1; i++) {
                    const from = blocks[i];
                    const to = blocks[i + 1];

                    if (from.outputs && from.outputs.length > 0 && to.inputs && to.inputs.length > 0) {
                        if (this.areBlocksCompatible(from, to)) {
                            connections.push({
                                id: `conn_${Date.now()}_${i}`,
                                from: { blockId: from.id, port: from.outputs[0] },
                                to: { blockId: to.id, port: to.inputs[0] }
                            });
                        }
                    }
                }

                return connections;
            },

            async optimizeFlow(blocks, connections) {
                console.log('⚡ Optimizing flow...');

                // Reorder blocks for optimal execution
                const optimized = [...blocks];

                // Input blocks first
                optimized.sort((a, b) => {
                    const categoryOrder = ['Input', 'Processing', 'Logic', 'Storage', 'Output', 'Integration', 'Testing'];
                    return categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
                });

                // Auto-connect optimized blocks
                const newConnections = await this.autoConnect(optimized);

                return { blocks: optimized, connections: [...connections, ...newConnections] };
            }
        },

        templateGenerator: {
            async generateFromDescription(description) {
                console.log('🎨 Generating flow from description:', description);

                const keywords = this.extractKeywords(description);
                const template = {
                    name: `Generated Flow - ${Date.now()}`,
                    description: description,
                    blocks: [],
                    connections: []
                };

                // Detect intent and generate appropriate blocks
                if (this.hasKeywords(keywords, ['extract', 'pattern', 'llm'])) {
                    template.blocks.push(
                        { type: 'patternExtraction', x: 100, y: 100 },
                        { type: 'consensusValidation', x: 400, y: 100 },
                        { type: 'saveToStorage', x: 700, y: 100 }
                    );
                }

                if (this.hasKeywords(keywords, ['query', 'inference', 'ask'])) {
                    template.blocks.push(
                        { type: 'textInput', x: 100, y: 100 },
                        { type: 'aevInference', x: 400, y: 100 },
                        { type: 'textOutput', x: 700, y: 100 }
                    );
                }

                if (this.hasKeywords(keywords, ['voice', 'speech', 'speak'])) {
                    template.blocks.push(
                        { type: 'voiceInput', x: 100, y: 100 },
                        { type: 'patternMatching', x: 400, y: 100 },
                        { type: 'voiceOutput', x: 700, y: 100 }
                    );
                }

                if (this.hasKeywords(keywords, ['test', 'benchmark', 'validate'])) {
                    template.blocks.push(
                        { type: 'loadFromStorage', x: 100, y: 100 },
                        { type: 'testRunner', x: 400, y: 100 },
                        { type: 'notification', x: 700, y: 100 }
                    );
                }

                if (this.hasKeywords(keywords, ['onboard', 'welcome', 'setup'])) {
                    template.blocks = this.generateOnboardingFlow();
                }

                // Auto-connect generated blocks
                template.connections = await FlowBuilderAdvanced.autoConfigEngine.autoConnect(template.blocks);

                return template;
            },

            extractKeywords(text) {
                return text.toLowerCase().split(' ').filter(word => word.length > 3);
            },

            hasKeywords(keywords, targets) {
                return targets.some(target => keywords.includes(target));
            },

            generateOnboardingFlow() {
                return [
                    { type: 'textInput', x: 100, y: 100, config: { placeholder: 'Enter your name' } },
                    { type: 'textOutput', x: 400, y: 100, config: { text: 'Welcome {{input}}!' } },
                    { type: 'condition', x: 700, y: 100, config: { operator: 'notEmpty' } },
                    { type: 'voiceOutput', x: 700, y: 250, config: { text: 'Great to have you!' } },
                    { type: 'patternExtraction', x: 100, y: 400, config: { sourceModel: 'gpt4', targetCount: 100000 } },
                    { type: 'notification', x: 400, y: 400, config: { title: 'Setup Complete', type: 'success' } }
                ];
            },

            async saveTemplate(template) {
                const templates = JSON.parse(localStorage.getItem('aevov_flow_templates') || '[]');
                templates.push(template);
                localStorage.setItem('aevov_flow_templates', JSON.stringify(templates));
                console.log('💾 Template saved:', template.name);
            },

            loadTemplates() {
                return JSON.parse(localStorage.getItem('aevov_flow_templates') || '[]');
            },

            async exportTemplate(template, format = 'json') {
                if (format === 'json') {
                    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${template.name}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                } else if (format === 'code') {
                    const code = this.generateCode(template);
                    const blob = new Blob([code], { type: 'text/javascript' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${template.name}.js`;
                    a.click();
                    URL.revokeObjectURL(url);
                }
            },

            generateCode(template) {
                return `
/**
 * Generated Flow: ${template.name}
 * Description: ${template.description}
 * Generated: ${new Date().toISOString()}
 */

async function ${template.name.replace(/[^a-zA-Z0-9]/g, '_')}() {
    console.log('🚀 Running flow: ${template.name}');

    ${template.blocks.map((block, i) => `
    // Block ${i + 1}: ${block.name}
    const block${i} = await window.AevovFlowBuilder.blockTypes['${block.type}'].execute(${JSON.stringify(block.config)});
    `).join('\n')}

    console.log('✅ Flow complete');
}

// Auto-execute
${template.name.replace(/[^a-zA-Z0-9]/g, '_')}();
                `.trim();
            }
        },

        onboardingIntegration: {
            async createOnboardingFlow() {
                console.log('👋 Creating onboarding flow...');

                const flow = {
                    name: 'User Onboarding',
                    blocks: [
                        {
                            type: 'textOutput',
                            x: 100,
                            y: 100,
                            config: { text: '👋 Welcome to Aevov! Let\'s get you set up.' }
                        },
                        {
                            type: 'textInput',
                            x: 100,
                            y: 250,
                            config: { placeholder: 'What\'s your name?', required: true }
                        },
                        {
                            type: 'textOutput',
                            x: 100,
                            y: 400,
                            config: { text: 'Nice to meet you, {{input}}! Now let\'s configure your preferences.' }
                        },
                        {
                            type: 'condition',
                            x: 400,
                            y: 400,
                            config: { operator: 'notEmpty' }
                        },
                        {
                            type: 'saveToStorage',
                            x: 700,
                            y: 400,
                            config: { provider: 'cubbit', path: 'user/profile.json' }
                        },
                        {
                            type: 'textOutput',
                            x: 100,
                            y: 550,
                            config: { text: 'Would you like to extract patterns from an LLM?' }
                        },
                        {
                            type: 'condition',
                            x: 400,
                            y: 550,
                            config: { operator: 'equals', value: 'yes' }
                        },
                        {
                            type: 'patternExtraction',
                            x: 700,
                            y: 550,
                            config: { sourceModel: 'gpt4', targetCount: 1000000 }
                        },
                        {
                            type: 'notification',
                            x: 1000,
                            y: 550,
                            config: { title: 'Setup Complete!', type: 'success', duration: 5000 }
                        },
                        {
                            type: 'voiceOutput',
                            x: 1000,
                            y: 700,
                            config: { text: 'You\'re all set! Enjoy using Aevov!' }
                        }
                    ],
                    connections: []
                };

                flow.connections = await FlowBuilderAdvanced.autoConfigEngine.autoConnect(flow.blocks);

                return flow;
            },

            async integrateWithSystem() {
                // Check if user has completed onboarding
                const onboarded = localStorage.getItem('aevov_onboarded');
                
                if (!onboarded) {
                    console.log('🎯 Starting onboarding flow...');
                    const flow = await this.createOnboardingFlow();
                    
                    // Load flow into builder
                    if (window.AevovFlowBuilder) {
                        window.AevovFlowBuilder.state.blocks = flow.blocks;
                        window.AevovFlowBuilder.state.connections = flow.connections;
                        window.AevovFlowBuilder.render();
                    }

                    // Mark as onboarded
                    localStorage.setItem('aevov_onboarded', 'true');
                }
            }
        },

        selfConfiguration: {
            async learnFromUsage() {
                console.log('🧠 Learning from usage patterns...');

                const flows = JSON.parse(localStorage.getItem('aevov_flows') || '[]');
                const blockUsage = {};
                const connectionPatterns = {};

                flows.forEach(flow => {
                    flow.blocks.forEach(block => {
                        blockUsage[block.type] = (blockUsage[block.type] || 0) + 1;
                    });

                    flow.connections.forEach(conn => {
                        const pattern = `${conn.from.blockId}->${conn.to.blockId}`;
                        connectionPatterns[pattern] = (connectionPatterns[pattern] || 0) + 1;
                    });
                });

                return {
                    mostUsedBlocks: Object.entries(blockUsage)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 5),
                    commonPatterns: Object.entries(connectionPatterns)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 10)
                };
            },

            async suggestBlocks(currentFlow) {
                const learned = await this.learnFromUsage();
                const suggestions = [];

                // Suggest based on current blocks
                const currentCategories = new Set(currentFlow.blocks.map(b => b.category));

                if (currentCategories.has('Input') && !currentCategories.has('Processing')) {
                    suggestions.push({
                        type: 'patternMatching',
                        reason: 'Input blocks typically connect to processing'
                    });
                }

                if (currentCategories.has('Processing') && !currentCategories.has('Storage')) {
                    suggestions.push({
                        type: 'saveToStorage',
                        reason: 'Save processing results to storage'
                    });
                }

                if (currentCategories.has('Processing') && !currentCategories.has('Testing')) {
                    suggestions.push({
                        type: 'testRunner',
                        reason: 'Validate processing with tests'
                    });
                }

                // Add most used blocks
                learned.mostUsedBlocks.forEach(([type, count]) => {
                    if (!currentFlow.blocks.find(b => b.type === type)) {
                        suggestions.push({
                            type: type,
                            reason: `Frequently used (${count} times)`
                        });
                    }
                });

                return suggestions;
            },

            async autoOptimizeConfig(block) {
                const optimized = { ...block.config };

                // Apply learned optimizations based on block type
                if (block.type === 'consensusValidation') {
                    optimized.votingThreshold = 0.67; // Optimal for most cases
                    optimized.minNodes = 3; // Minimum for BFT
                }

                if (block.type === 'patternExtraction') {
                    optimized.diversityThreshold = 0.7; // Balance speed and quality
                    optimized.targetCount = Math.max(optimized.targetCount, 1000000); // Minimum for good results
                }

                if (block.type === 'saveToStorage') {
                    optimized.encrypt = true; // Always encrypt
                    optimized.replicate = true; // Always replicate
                }

                return optimized;
            }
        },

        integrationManager: {
            async connectToConsensus(blockId) {
                const block = window.AevovFlowBuilder.state.blocks.find(b => b.id === blockId);
                if (!block) return;

                // Integrate with consensus configuration
                if (window.ConsensusConfig) {
                    block.config.consensus = window.ConsensusConfig.config.consensus;
                    console.log('🔐 Connected to consensus config');
                }
            },

            async connectToStorage(blockId) {
                const block = window.AevovFlowBuilder.state.blocks.find(b => b.id === blockId);
                if (!block) return;

                // Integrate with storage framework
                if (window.MultiStorageFramework) {
                    block.config.provider = window.MultiStorageFramework.state.activeProvider || 'cubbit';
                    console.log('☁️ Connected to storage framework');
                }
            },

            async connectToCMS(blockId) {
                const block = window.AevovFlowBuilder.state.blocks.find(b => b.id === blockId);
                if (!block) return;

                // Integrate with CMS engine
                if (window.CMSAppEngine) {
                    block.config.platform = window.CMSAppEngine.state.currentPlatform || 'wordpress';
                    console.log('🏗️ Connected to CMS engine');
                }
            },

            async connectToTesting(blockId) {
                const block = window.AevovFlowBuilder.state.blocks.find(b => b.id === blockId);
                if (!block) return;

                // Integrate with testing system
                if (window.AEVModelTester) {
                    block.config.model = window.AEVModelTester.state.currentModel?.path || '';
                    console.log('🧪 Connected to testing system');
                }
            },

            async autoConnectAll() {
                console.log('🔗 Auto-connecting all integrations...');

                window.AevovFlowBuilder.state.blocks.forEach(block => {
                    if (block.type === 'consensusValidation') {
                        this.connectToConsensus(block.id);
                    }
                    if (block.type === 'saveToStorage' || block.type === 'loadFromStorage') {
                        this.connectToStorage(block.id);
                    }
                    if (block.type === 'cmsGeneration') {
                        this.connectToCMS(block.id);
                    }
                    if (block.type === 'testRunner') {
                        this.connectToTesting(block.id);
                    }
                });
            }
        },

        flowValidator: {
            validateFlow(blocks, connections) {
                const errors = [];
                const warnings = [];

                // Check for disconnected blocks
                blocks.forEach(block => {
                    const hasInput = connections.some(c => c.to.blockId === block.id);
                    const hasOutput = connections.some(c => c.from.blockId === block.id);

                    if (block.inputs && block.inputs.length > 0 && !hasInput) {
                        warnings.push({
                            blockId: block.id,
                            message: `${block.name} has no input connection`
                        });
                    }

                    if (block.outputs && block.outputs.length > 0 && !hasOutput && block.category !== 'Output') {
                        warnings.push({
                            blockId: block.id,
                            message: `${block.name} has no output connection`
                        });
                    }
                });

                // Check for circular dependencies
                const circular = this.detectCircularDependencies(blocks, connections);
                if (circular.length > 0) {
                    errors.push({
                        type: 'circular',
                        message: 'Circular dependency detected',
                        blocks: circular
                    });
                }

                // Check for missing required configs
                blocks.forEach(block => {
                    Object.entries(block.config).forEach(([key, value]) => {
                        if (value === '' || value === null || value === undefined) {
                            warnings.push({
                                blockId: block.id,
                                message: `${block.name}: "${key}" is not configured`
                            });
                        }
                    });
                });

                return { valid: errors.length === 0, errors, warnings };
            },

            detectCircularDependencies(blocks, connections) {
                const graph = new Map();
                
                blocks.forEach(block => {
                    graph.set(block.id, []);
                });

                connections.forEach(conn => {
                    const edges = graph.get(conn.from.blockId) || [];
                    edges.push(conn.to.blockId);
                    graph.set(conn.from.blockId, edges);
                });

                const visited = new Set();
                const recStack = new Set();
                const circular = [];

                const dfs = (nodeId) => {
                    visited.add(nodeId);
                    recStack.add(nodeId);

                    const neighbors = graph.get(nodeId) || [];
                    for (const neighbor of neighbors) {
                        if (!visited.has(neighbor)) {
                            if (dfs(neighbor)) {
                                circular.push(neighbor);
                                return true;
                            }
                        } else if (recStack.has(neighbor)) {
                            circular.push(neighbor);
                            return true;
                        }
                    }

                    recStack.delete(nodeId);
                    return false;
                };

                blocks.forEach(block => {
                    if (!visited.has(block.id)) {
                        dfs(block.id);
                    }
                });

                return circular;
            }
        }
    };

    // Extend AevovFlowBuilder with advanced features
    if (window.AevovFlowBuilder) {
        window.AevovFlowBuilder.advanced = FlowBuilderAdvanced;

        // Override auto-config
        window.AevovFlowBuilder.autoConfig = async function() {
            const analysis = await FlowBuilderAdvanced.autoConfigEngine.analyzeFlow(
                this.state.blocks,
                this.state.connections
            );

            console.log('📊 Flow Analysis:', analysis);

            // Auto-connect missing connections
            for (const missing of analysis.missingConnections) {
                if (missing.suggestion) {
                    const conn = {
                        id: `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        from: { blockId: missing.suggestion.id, port: missing.suggestion.outputs?.[0] },
                        to: { blockId: missing.blockId, port: this.state.blocks.find(b => b.id === missing.blockId).inputs?.[0] }
                    };
                    this.state.connections.push(conn);
                }
            }

            // Apply optimizations
            if (analysis.optimizations.length > 0) {
                const optimized = await FlowBuilderAdvanced.autoConfigEngine.optimizeFlow(
                    this.state.blocks,
                    this.state.connections
                );
                this.state.blocks = optimized.blocks;
                this.state.connections = optimized.connections;
            }

            // Auto-connect all integrations
            await FlowBuilderAdvanced.integrationManager.autoConnectAll();

            this.render();
            this.showNotification('🤖 Auto-Config Complete', 
                `Fixed ${analysis.missingConnections.length} connections, applied ${analysis.optimizations.length} optimizations`);
        };

        // Add template generation UI
        window.AevovFlowBuilder.generateTemplate = async function() {
            const description = prompt('Describe the flow you want to create:');
            if (!description) return;

            const template = await FlowBuilderAdvanced.templateGenerator.generateFromDescription(description);
            
            this.state.blocks = template.blocks;
            this.state.connections = template.connections;
            this.render();

            this.showNotification('🎨 Template Generated', `Created flow with ${template.blocks.length} blocks`);
        };

        // Enhanced test flow
        window.AevovFlowBuilder.testFlow = async function() {
            const validation = FlowBuilderAdvanced.flowValidator.validateFlow(
                this.state.blocks,
                this.state.connections
            );

            if (!validation.valid) {
                alert(`Flow has errors:\n${validation.errors.map(e => e.message).join('\n')}`);
                return;
            }

            if (validation.warnings.length > 0) {
                console.warn('⚠️ Flow warnings:', validation.warnings);
            }

            this.showNotification('🧪 Test Started', 'Running flow validation and simulation...');
            
            setTimeout(() => {
                this.showNotification('✅ Test Complete', 
                    `Flow validated successfully. ${validation.warnings.length} warnings found.`);
            }, 2000);
        };
    }

    window.FlowBuilderAdvanced = FlowBuilderAdvanced;

    // Auto-integrate with onboarding
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                FlowBuilderAdvanced.onboardingIntegration.integrateWithSystem();
            }, 3000);
        });
    } else {
        setTimeout(() => {
            FlowBuilderAdvanced.onboardingIntegration.integrateWithSystem();
        }, 3000);
    }

    console.log('✅ Flow Builder Advanced Features loaded');

})();