/**
 * PROOF OF CONSENSUS CONFIGURATION PANEL
 * Keyboard: Ctrl+Shift+K
 * Comprehensive consensus mechanism configuration for distributed network
 */

(function() {
    'use strict';

    console.log('🔐 Loading Proof of Consensus Configuration Panel...');

    const ConsensusConfig = {
        version: '1.0.0',

        state: {
            isOpen: false,
            currentConfig: null,
            validationResults: null
        },

        config: {
            consensus: {
                algorithm: 'proof-of-contribution',
                votingThreshold: 0.67,
                minNodes: 3,
                maxNodes: 100,
                timeoutMs: 5000,
                retries: 3,
                quorumPercentage: 0.51
            },
            validation: {
                enableByzantineFaultTolerance: true,
                maxByzantineNodes: 0.33,
                enableSlashing: false,
                slashingPenalty: 0.1
            },
            reputation: {
                initialScore: 100,
                contributionWeight: 1.0,
                accuracyWeight: 2.0,
                uptimeWeight: 0.5,
                decayRate: 0.01
            },
            rewards: {
                baseReward: 10,
                accuracyBonus: 5,
                speedBonus: 2,
                consistencyBonus: 3,
                distributionMethod: 'proportional'
            },
            network: {
                dhtProtocol: 'kademlia',
                replicationFactor: 3,
                chunkSize: 1048576,
                encryptionAlgorithm: 'AES-256-GCM',
                compressionCodec: 'lzma'
            },
            dag: {
                enableDagLedger: true,
                confirmationDepth: 6,
                branchingFactor: 3,
                pruningInterval: 86400000
            }
        },

        init() {
            console.log('⚡ Initializing Consensus Configuration Panel...');
            
            this.registerKeyboardShortcut();
            this.createPanel();
            this.loadSavedConfig();
            
            console.log('✅ Consensus Config ready! Press Ctrl+Shift+K');
        },

        registerKeyboardShortcut() {
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.shiftKey && e.key === 'K') {
                    e.preventDefault();
                    this.toggle();
                }
            });
            console.log('⌨️ Keyboard shortcut: Ctrl+Shift+K');
        },

        toggle() {
            const panel = document.getElementById('consensusConfigPanel');
            if (panel) {
                this.state.isOpen = !this.state.isOpen;
                panel.style.display = this.state.isOpen ? 'flex' : 'none';
                if (this.state.isOpen) {
                    this.renderCurrentConfig();
                    this.runValidation();
                }
            }
        },

        createPanel() {
            const panelHTML = `
                <div id="consensusConfigPanel" style="
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.95);
                    z-index: 999999;
                    overflow-y: auto;
                    backdrop-filter: blur(10px);
                ">
                    <div style="
                        max-width: 1400px;
                        margin: 40px auto;
                        padding: 30px;
                        background: linear-gradient(135deg, #0a192f 0%, #1a2744 100%);
                        border: 3px solid #00d4ff;
                        border-radius: 20px;
                        box-shadow: 0 20px 60px rgba(0, 212, 255, 0.4);
                    ">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                            <div>
                                <h1 style="color: #00d4ff; margin: 0; font-size: 28px;">🔐 Proof of Consensus Configuration</h1>
                                <p style="color: rgba(255,255,255,0.7); margin: 5px 0 0 0;">Comprehensive distributed consensus mechanism settings</p>
                            </div>
                            <button onclick="window.ConsensusConfig.close()" style="
                                background: rgba(255, 107, 107, 0.2);
                                border: 2px solid #ff6b6b;
                                color: #ff6b6b;
                                width: 40px;
                                height: 40px;
                                border-radius: 50%;
                                font-size: 20px;
                                cursor: pointer;
                            ">✕</button>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                            <div id="consensusValidation" style="
                                padding: 20px;
                                background: rgba(0, 212, 255, 0.1);
                                border: 2px solid #00d4ff;
                                border-radius: 12px;
                            ">
                                <h3 style="color: #00d4ff; margin-top: 0;">📊 Validation Status</h3>
                                <div id="validationResults">Running validation...</div>
                            </div>

                            <div style="
                                padding: 20px;
                                background: rgba(0, 255, 136, 0.1);
                                border: 2px solid #00ff88;
                                border-radius: 12px;
                            ">
                                <h3 style="color: #00ff88; margin-top: 0;">⚡ Quick Actions</h3>
                                <div style="display: flex; flex-direction: column; gap: 10px;">
                                    <button onclick="window.ConsensusConfig.resetToDefaults()" style="
                                        padding: 10px;
                                        background: rgba(255, 159, 10, 0.2);
                                        border: 2px solid #ff9f0a;
                                        color: #ff9f0a;
                                        border-radius: 8px;
                                        cursor: pointer;
                                    ">🔄 Reset to Defaults</button>
                                    <button onclick="window.ConsensusConfig.exportConfig()" style="
                                        padding: 10px;
                                        background: rgba(0, 212, 255, 0.2);
                                        border: 2px solid #00d4ff;
                                        color: #00d4ff;
                                        border-radius: 8px;
                                        cursor: pointer;
                                    ">📥 Export Config</button>
                                    <button onclick="window.ConsensusConfig.importConfig()" style="
                                        padding: 10px;
                                        background: rgba(138, 43, 226, 0.2);
                                        border: 2px solid #8a2be2;
                                        color: #8a2be2;
                                        border-radius: 8px;
                                        cursor: pointer;
                                    ">📤 Import Config</button>
                                </div>
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 20px;">
                            ${this.generateConfigSection('Consensus Algorithm', 'consensus', [
                                { key: 'algorithm', type: 'select', options: ['proof-of-contribution', 'proof-of-stake', 'byzantine-consensus', 'raft'] },
                                { key: 'votingThreshold', type: 'range', min: 0.51, max: 1, step: 0.01 },
                                { key: 'minNodes', type: 'number', min: 1, max: 10 },
                                { key: 'maxNodes', type: 'number', min: 10, max: 1000 },
                                { key: 'timeoutMs', type: 'number', min: 1000, max: 30000 },
                                { key: 'retries', type: 'number', min: 0, max: 10 },
                                { key: 'quorumPercentage', type: 'range', min: 0.51, max: 1, step: 0.01 }
                            ])}

                            ${this.generateConfigSection('Validation Rules', 'validation', [
                                { key: 'enableByzantineFaultTolerance', type: 'checkbox' },
                                { key: 'maxByzantineNodes', type: 'range', min: 0, max: 0.5, step: 0.01 },
                                { key: 'enableSlashing', type: 'checkbox' },
                                { key: 'slashingPenalty', type: 'range', min: 0, max: 1, step: 0.01 }
                            ])}

                            ${this.generateConfigSection('Reputation System', 'reputation', [
                                { key: 'initialScore', type: 'number', min: 0, max: 1000 },
                                { key: 'contributionWeight', type: 'range', min: 0, max: 5, step: 0.1 },
                                { key: 'accuracyWeight', type: 'range', min: 0, max: 5, step: 0.1 },
                                { key: 'uptimeWeight', type: 'range', min: 0, max: 5, step: 0.1 },
                                { key: 'decayRate', type: 'range', min: 0, max: 0.1, step: 0.001 }
                            ])}

                            ${this.generateConfigSection('Reward System', 'rewards', [
                                { key: 'baseReward', type: 'number', min: 0, max: 100 },
                                { key: 'accuracyBonus', type: 'number', min: 0, max: 50 },
                                { key: 'speedBonus', type: 'number', min: 0, max: 20 },
                                { key: 'consistencyBonus', type: 'number', min: 0, max: 30 },
                                { key: 'distributionMethod', type: 'select', options: ['proportional', 'equal', 'weighted'] }
                            ])}

                            ${this.generateConfigSection('Network Configuration', 'network', [
                                { key: 'dhtProtocol', type: 'select', options: ['kademlia', 'chord', 'pastry'] },
                                { key: 'replicationFactor', type: 'number', min: 1, max: 10 },
                                { key: 'chunkSize', type: 'number', min: 65536, max: 10485760 },
                                { key: 'encryptionAlgorithm', type: 'select', options: ['AES-256-GCM', 'ChaCha20-Poly1305', 'AES-128-GCM'] },
                                { key: 'compressionCodec', type: 'select', options: ['lzma', 'gzip', 'brotli', 'zstd'] }
                            ])}

                            ${this.generateConfigSection('DAG Ledger', 'dag', [
                                { key: 'enableDagLedger', type: 'checkbox' },
                                { key: 'confirmationDepth', type: 'number', min: 1, max: 20 },
                                { key: 'branchingFactor', type: 'number', min: 2, max: 10 },
                                { key: 'pruningInterval', type: 'number', min: 3600000, max: 604800000 }
                            ])}
                        </div>

                        <div style="margin-top: 30px; display: flex; gap: 15px; justify-content: center;">
                            <button onclick="window.ConsensusConfig.saveConfig()" style="
                                padding: 15px 40px;
                                background: linear-gradient(135deg, #00ff88 0%, #00d4ff 100%);
                                border: none;
                                color: white;
                                border-radius: 10px;
                                font-size: 18px;
                                font-weight: 600;
                                cursor: pointer;
                                box-shadow: 0 4px 15px rgba(0, 255, 136, 0.4);
                            ">💾 Save Configuration</button>
                            
                            <button onclick="window.ConsensusConfig.testConsensus()" style="
                                padding: 15px 40px;
                                background: linear-gradient(135deg, #ff9f0a 0%, #ff6b6b 100%);
                                border: none;
                                color: white;
                                border-radius: 10px;
                                font-size: 18px;
                                font-weight: 600;
                                cursor: pointer;
                                box-shadow: 0 4px 15px rgba(255, 159, 10, 0.4);
                            ">🧪 Test Consensus</button>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', panelHTML);
        },

        generateConfigSection(title, section, fields) {
            const sectionConfig = this.config[section];
            
            return `
                <div style="
                    padding: 20px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                ">
                    <h3 style="color: #00d4ff; margin-top: 0;">${title}</h3>
                    ${fields.map(field => {
                        const value = sectionConfig[field.key];
                        return this.generateField(section, field, value);
                    }).join('')}
                </div>
            `;
        },

        generateField(section, field, value) {
            const id = `config_${section}_${field.key}`;
            
            if (field.type === 'checkbox') {
                return `
                    <label style="display: flex; align-items: center; gap: 10px; margin: 10px 0; color: white;">
                        <input type="checkbox" id="${id}" ${value ? 'checked' : ''} 
                            onchange="window.ConsensusConfig.updateField('${section}', '${field.key}', this.checked)">
                        <span>${this.formatLabel(field.key)}</span>
                    </label>
                `;
            }
            
            if (field.type === 'select') {
                return `
                    <div style="margin: 15px 0;">
                        <label style="color: white; display: block; margin-bottom: 5px;">${this.formatLabel(field.key)}</label>
                        <select id="${id}" onchange="window.ConsensusConfig.updateField('${section}', '${field.key}', this.value)" style="
                            width: 100%;
                            padding: 8px;
                            background: rgba(0, 0, 0, 0.3);
                            border: 1px solid rgba(255, 255, 255, 0.2);
                            border-radius: 6px;
                            color: white;
                        ">
                            ${field.options.map(opt => `<option value="${opt}" ${opt === value ? 'selected' : ''}>${opt}</option>`).join('')}
                        </select>
                    </div>
                `;
            }
            
            if (field.type === 'range') {
                return `
                    <div style="margin: 15px 0;">
                        <label style="color: white; display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <span>${this.formatLabel(field.key)}</span>
                            <span id="${id}_value" style="color: #00d4ff;">${value}</span>
                        </label>
                        <input type="range" id="${id}" min="${field.min}" max="${field.max}" step="${field.step}" value="${value}"
                            oninput="document.getElementById('${id}_value').textContent = this.value; window.ConsensusConfig.updateField('${section}', '${field.key}', parseFloat(this.value))"
                            style="width: 100%;">
                    </div>
                `;
            }
            
            if (field.type === 'number') {
                return `
                    <div style="margin: 15px 0;">
                        <label style="color: white; display: block; margin-bottom: 5px;">${this.formatLabel(field.key)}</label>
                        <input type="number" id="${id}" min="${field.min || 0}" max="${field.max || 999999}" value="${value}"
                            onchange="window.ConsensusConfig.updateField('${section}', '${field.key}', parseInt(this.value))"
                            style="
                                width: 100%;
                                padding: 8px;
                                background: rgba(0, 0, 0, 0.3);
                                border: 1px solid rgba(255, 255, 255, 0.2);
                                border-radius: 6px;
                                color: white;
                            ">
                    </div>
                `;
            }
        },

        formatLabel(key) {
            return key.replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase())
                .trim();
        },

        updateField(section, key, value) {
            this.config[section][key] = value;
            this.runValidation();
        },

        runValidation() {
            const results = {
                valid: true,
                warnings: [],
                errors: []
            };

            if (this.config.consensus.votingThreshold < 0.51) {
                results.errors.push('Voting threshold must be at least 51% for safety');
                results.valid = false;
            }

            if (this.config.consensus.minNodes < 3 && this.config.validation.enableByzantineFaultTolerance) {
                results.warnings.push('Byzantine fault tolerance requires at least 3 nodes');
            }

            const maxByzantine = Math.floor(this.config.consensus.minNodes * this.config.validation.maxByzantineNodes);
            if (maxByzantine >= this.config.consensus.minNodes / 2) {
                results.errors.push('Max Byzantine nodes too high for network security');
                results.valid = false;
            }

            if (this.config.dag.confirmationDepth < 3) {
                results.warnings.push('Low confirmation depth may reduce security');
            }

            this.renderValidation(results);
        },

        renderValidation(results) {
            const container = document.getElementById('validationResults');
            if (!container) return;

            let html = `
                <div style="color: ${results.valid ? '#00ff88' : '#ff6b6b'}; font-weight: 600; margin-bottom: 10px;">
                    ${results.valid ? '✅ Configuration Valid' : '❌ Configuration Invalid'}
                </div>
            `;

            if (results.errors.length > 0) {
                html += `<div style="margin: 10px 0;">
                    <strong style="color: #ff6b6b;">Errors:</strong>
                    <ul style="margin: 5px 0; padding-left: 20px;">
                        ${results.errors.map(e => `<li style="color: #ff6b6b;">${e}</li>`).join('')}
                    </ul>
                </div>`;
            }

            if (results.warnings.length > 0) {
                html += `<div style="margin: 10px 0;">
                    <strong style="color: #ff9f0a;">Warnings:</strong>
                    <ul style="margin: 5px 0; padding-left: 20px;">
                        ${results.warnings.map(w => `<li style="color: #ff9f0a;">${w}</li>`).join('')}
                    </ul>
                </div>`;
            }

            container.innerHTML = html;
            this.state.validationResults = results;
        },

        renderCurrentConfig() {
            console.log('📊 Current Consensus Configuration:', this.config);
        },

        saveConfig() {
            if (this.state.validationResults && !this.state.validationResults.valid) {
                alert('⚠️ Cannot save invalid configuration. Please fix errors first.');
                return;
            }

            localStorage.setItem('aevov_consensus_config', JSON.stringify(this.config));
            console.log('💾 Consensus configuration saved');
            this.showNotification('✅ Configuration Saved', 'Consensus settings saved successfully');
        },

        loadSavedConfig() {
            const saved = localStorage.getItem('aevov_consensus_config');
            if (saved) {
                try {
                    this.config = JSON.parse(saved);
                    console.log('📥 Loaded saved consensus configuration');
                } catch (e) {
                    console.error('Failed to load config:', e);
                }
            }
        },

        resetToDefaults() {
            if (confirm('Reset all consensus settings to defaults?')) {
                localStorage.removeItem('aevov_consensus_config');
                location.reload();
            }
        },

        exportConfig() {
            const dataStr = JSON.stringify(this.config, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `aevov-consensus-config-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
            this.showNotification('📥 Config Exported', 'Configuration downloaded');
        },

        importConfig() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = (e) => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const imported = JSON.parse(event.target.result);
                        this.config = imported;
                        this.saveConfig();
                        this.renderCurrentConfig();
                        this.runValidation();
                        this.showNotification('✅ Config Imported', 'Configuration imported successfully');
                    } catch (err) {
                        alert('Error importing config: ' + err.message);
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        },

        async testConsensus() {
            console.log('🧪 Testing consensus mechanism...');
            
            const testResults = await this.simulateConsensusRound();
            
            alert(`🧪 Consensus Test Results:\n\n` +
                  `Algorithm: ${this.config.consensus.algorithm}\n` +
                  `Simulated Nodes: ${testResults.nodes}\n` +
                  `Voting Threshold: ${(this.config.consensus.votingThreshold * 100).toFixed(0)}%\n` +
                  `Consensus Reached: ${testResults.consensusReached ? '✅ Yes' : '❌ No'}\n` +
                  `Time: ${testResults.timeMs}ms\n` +
                  `Byzantine Failures Handled: ${testResults.byzantineFailures}`);
        },

        async simulateConsensusRound() {
            const nodeCount = Math.floor(Math.random() * (this.config.consensus.maxNodes - this.config.consensus.minNodes)) + this.config.consensus.minNodes;
            const byzantineCount = Math.floor(nodeCount * this.config.validation.maxByzantineNodes);
            
            const startTime = Date.now();
            
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const votes = nodeCount - byzantineCount;
            const threshold = Math.ceil(nodeCount * this.config.consensus.votingThreshold);
            const consensusReached = votes >= threshold;
            
            return {
                nodes: nodeCount,
                votes: votes,
                threshold: threshold,
                consensusReached: consensusReached,
                timeMs: Date.now() - startTime,
                byzantineFailures: byzantineCount
            };
        },

        close() {
            this.state.isOpen = false;
            const panel = document.getElementById('consensusConfigPanel');
            if (panel) {
                panel.style.display = 'none';
            }
        },

        showNotification(title, message) {
            const notif = document.createElement('div');
            notif.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #00d4ff, #0099cc);
                color: white;
                padding: 20px;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0, 212, 255, 0.5);
                z-index: 1000000;
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

    window.ConsensusConfig = ConsensusConfig;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => ConsensusConfig.init());
    } else {
        ConsensusConfig.init();
    }

    console.log('✅ Proof of Consensus Configuration Panel loaded');

})();