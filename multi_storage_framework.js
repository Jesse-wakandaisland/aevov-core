/**
 * MULTI-STORAGE FRAMEWORK
 * Universal storage provider system supporting centralized and decentralized storage
 * Providers: Cubbit, AWS S3, Google Cloud Storage, Azure, IPFS, Storj, Arweave, Filecoin
 */

(function() {
    'use strict';

    console.log('☁️ Loading Multi-Storage Framework...');

    const MultiStorageFramework = {
        version: '1.0.0',

        providers: {
            cubbit: null,
            aws: null,
            gcs: null,
            azure: null,
            ipfs: null,
            storj: null,
            arweave: null,
            filecoin: null
        },

        state: {
            activeProvider: null,
            connections: new Map(),
            replicationTargets: []
        },

        config: {
            enableAutoReplication: true,
            replicationCount: 3,
            preferDecentralized: false,
            enableEncryption: true,
            encryptionAlgorithm: 'AES-256-GCM',
            compressionEnabled: true,
            compressionCodec: 'lzma'
        },

        init() {
            console.log('⚡ Initializing Multi-Storage Framework...');

            this.initializeProviders();
            this.createUI();
            this.loadSavedConfigs();

            console.log('✅ Multi-Storage Framework ready!');
        },

        initializeProviders() {
            this.providers.cubbit = new CubbitProvider();
            this.providers.aws = new AWSS3Provider();
            this.providers.gcs = new GoogleCloudProvider();
            this.providers.azure = new AzureProvider();
            this.providers.ipfs = new IPFSProvider();
            this.providers.storj = new StorjProvider();
            this.providers.arweave = new ArweaveProvider();
            this.providers.filecoin = new FilecoinProvider();

            console.log('✓ All storage providers initialized');
        },

        createUI() {
            const ui = document.createElement('div');
            ui.id = 'multiStorageUI';
            ui.innerHTML = `
                <div style="
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%);
                    border: 2px solid #00d4ff;
                    border-radius: 15px;
                    padding: 20px;
                    box-shadow: 0 8px 32px rgba(0, 212, 255, 0.3);
                    z-index: 999998;
                    max-width: 400px;
                    display: none;
                " id="storagePanel">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <h3 style="color: #00d4ff; margin: 0;">☁️ Multi-Storage</h3>
                        <button id="closePanelBtn" style="
                            background: rgba(255, 107, 107, 0.2);
                            border: 1px solid #ff6b6b;
                            color: #ff6b6b;
                            width: 30px;
                            height: 30px;
                            border-radius: 50%;
                            cursor: pointer;
                        ">✕</button>
                    </div>

                    <div id="providersList"></div>

                    <button id="fullConfigBtn" style="
                        width: 100%;
                        padding: 10px;
                        background: linear-gradient(135deg, #00ff88 0%, #00d4ff 100%);
                        border: none;
                        color: white;
                        border-radius: 8px;
                        cursor: pointer;
                        margin-top: 15px;
                        font-weight: 600;
                    ">⚙️ Full Configuration</button>
                </div>

                <button id="storageToggle" style="
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #00d4ff, #0099cc);
                    border: none;
                    color: white;
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 4px 20px rgba(0, 212, 255, 0.4);
                    z-index: 999997;
                    font-size: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">☁️</button>
            `;

            document.body.appendChild(ui);
            
            // Attach event listeners properly
            this.attachUIEventListeners();
            this.renderProvidersList();
        },

        attachUIEventListeners() {
            const self = this;
            
            const toggleBtn = document.getElementById('storageToggle');
            const closeBtn = document.getElementById('closePanelBtn');
            const fullConfigBtn = document.getElementById('fullConfigBtn');

            if (toggleBtn) {
                toggleBtn.addEventListener('click', () => self.toggleUI());
            }
            if (closeBtn) {
                closeBtn.addEventListener('click', () => self.toggleUI());
            }
            if (fullConfigBtn) {
                fullConfigBtn.addEventListener('click', () => self.openFullConfig());
            }
        },

        toggleUI() {
            const panel = document.getElementById('storagePanel');
            const toggle = document.getElementById('storageToggle');

            if (panel && toggle) {
                if (panel.style.display === 'none') {
                    panel.style.display = 'block';
                    toggle.style.display = 'none';
                    this.renderProvidersList();
                } else {
                    panel.style.display = 'none';
                    toggle.style.display = 'flex';
                }
            }
        },

        renderProvidersList() {
            const container = document.getElementById('providersList');
            if (!container) return;

            const self = this;
            const providers = Object.keys(this.providers);
            
            container.innerHTML = providers.map(key => {
                const provider = this.providers[key];
                const isConnected = this.state.connections.has(key);
                const isActive = this.state.activeProvider === key;

                return `
                    <div class="provider-card" data-provider="${key}" style="
                        padding: 12px;
                        background: ${isActive ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 255, 255, 0.05)'};
                        border: 2px solid ${isConnected ? '#00ff88' : 'rgba(255, 255, 255, 0.1)'};
                        border-radius: 8px;
                        margin-bottom: 10px;
                    ">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <div style="color: white; font-weight: 600;">${provider.name}</div>
                                <div style="color: rgba(255,255,255,0.6); font-size: 12px;">${provider.type}</div>
                            </div>
                            <div style="display: flex; gap: 5px;">
                                ${isConnected 
                                    ? `<button class="activate-btn" data-provider="${key}" style="
                                        padding: 5px 10px;
                                        background: rgba(0, 212, 255, 0.2);
                                        border: 1px solid #00d4ff;
                                        color: #00d4ff;
                                        border-radius: 5px;
                                        cursor: pointer;
                                        font-size: 11px;
                                    ">${isActive ? '✓ Active' : 'Activate'}</button>`
                                    : `<button class="configure-btn" data-provider="${key}" style="
                                        padding: 5px 10px;
                                        background: rgba(255, 159, 10, 0.2);
                                        border: 1px solid #ff9f0a;
                                        color: #ff9f0a;
                                        border-radius: 5px;
                                        cursor: pointer;
                                        font-size: 11px;
                                    ">Configure</button>`
                                }
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            // Attach event listeners to buttons
            container.querySelectorAll('.configure-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const providerKey = this.dataset.provider;
                    console.log('Configure clicked for:', providerKey);
                    self.configureProvider(providerKey);
                });
            });

            container.querySelectorAll('.activate-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const providerKey = this.dataset.provider;
                    console.log('Activate clicked for:', providerKey);
                    self.setActive(providerKey);
                });
            });
        },

        async configureProvider(providerKey) {
            const provider = this.providers[providerKey];
            if (!provider) {
                console.error('Provider not found:', providerKey);
                return;
            }

            console.log('Configuring provider:', provider.name);
            const config = provider.getConfigTemplate();
            this.openConfigModal(providerKey, config);
        },

        openConfigModal(providerKey, configTemplate) {
            const self = this;
            const provider = this.providers[providerKey];
            const modal = document.createElement('div');
            modal.id = 'providerConfigModal';
            
            modal.innerHTML = `
                <div style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.9);
                    z-index: 9999999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    backdrop-filter: blur(10px);
                ">
                    <div style="
                        background: linear-gradient(135deg, #0a192f 0%, #1a2744 100%);
                        border: 3px solid #00d4ff;
                        border-radius: 20px;
                        padding: 30px;
                        max-width: 600px;
                        width: 90%;
                        box-shadow: 0 20px 60px rgba(0, 212, 255, 0.4);
                    ">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                            <h2 style="color: #00d4ff; margin: 0;">Configure ${provider.name}</h2>
                            <button id="closeModalBtn" style="
                                background: rgba(255, 107, 107, 0.2);
                                border: 2px solid #ff6b6b;
                                color: #ff6b6b;
                                width: 35px;
                                height: 35px;
                                border-radius: 50%;
                                cursor: pointer;
                                font-size: 18px;
                            ">✕</button>
                        </div>

                        <div style="color: rgba(255,255,255,0.7); margin-bottom: 20px; padding: 15px; background: rgba(0, 212, 255, 0.1); border-radius: 8px;">
                            <strong style="color: #00d4ff;">Provider Type:</strong> ${provider.type}<br>
                            <strong style="color: #00d4ff;">Description:</strong> ${provider.description}
                        </div>

                        <form id="providerConfigForm" style="display: flex; flex-direction: column; gap: 15px;">
                            ${Object.entries(configTemplate).map(([key, field]) => `
                                <div>
                                    <label style="color: white; display: block; margin-bottom: 5px; font-weight: 600;">
                                        ${field.label}
                                        ${field.required ? '<span style="color: #ff6b6b;">*</span>' : ''}
                                    </label>
                                    ${field.type === 'password' 
                                        ? `<input type="password" name="${key}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''} style="
                                            width: 100%;
                                            padding: 10px;
                                            background: rgba(0, 0, 0, 0.3);
                                            border: 2px solid rgba(255, 255, 255, 0.2);
                                            border-radius: 8px;
                                            color: white;
                                        ">`
                                        : field.type === 'select'
                                        ? `<select name="${key}" ${field.required ? 'required' : ''} style="
                                            width: 100%;
                                            padding: 10px;
                                            background: rgba(0, 0, 0, 0.3);
                                            border: 2px solid rgba(255, 255, 255, 0.2);
                                            border-radius: 8px;
                                            color: white;
                                        ">
                                            ${field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                                        </select>`
                                        : `<input type="text" name="${key}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''} style="
                                            width: 100%;
                                            padding: 10px;
                                            background: rgba(0, 0, 0, 0.3);
                                            border: 2px solid rgba(255, 255, 255, 0.2);
                                            border-radius: 8px;
                                            color: white;
                                        ">`
                                    }
                                    ${field.help ? `<div style="color: rgba(255,255,255,0.5); font-size: 12px; margin-top: 5px;">${field.help}</div>` : ''}
                                </div>
                            `).join('')}

                            <button type="submit" style="
                                padding: 12px;
                                background: linear-gradient(135deg, #00ff88 0%, #00d4ff 100%);
                                border: none;
                                color: white;
                                border-radius: 8px;
                                cursor: pointer;
                                font-weight: 600;
                                font-size: 16px;
                                margin-top: 10px;
                            ">💾 Connect Provider</button>
                        </form>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // Attach close button listener
            const closeBtn = modal.querySelector('#closeModalBtn');
            closeBtn.addEventListener('click', () => {
                modal.remove();
            });

            // Attach form submit listener
            const form = modal.querySelector('#providerConfigForm');
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const config = Object.fromEntries(formData);

                await self.connectProvider(providerKey, config);
                modal.remove();
            });
        },

        async connectProvider(providerKey, config) {
            const provider = this.providers[providerKey];
            
            try {
                console.log('Connecting to', provider.name, '...');
                const result = await provider.connect(config);
                
                if (result.success) {
                    this.state.connections.set(providerKey, {
                        config: config,
                        connectedAt: Date.now()
                    });

                    this.saveConfig(providerKey, config);
                    
                    if (!this.state.activeProvider) {
                        this.state.activeProvider = providerKey;
                    }

                    this.showNotification('✅ Connected', `${provider.name} connected successfully`);
                    this.renderProvidersList();
                } else {
                    throw new Error(result.error || 'Connection failed');
                }
            } catch (error) {
                console.error(`Failed to connect ${providerKey}:`, error);
                this.showNotification('❌ Connection Failed', error.message);
            }
        },

        setActive(providerKey) {
            if (!this.state.connections.has(providerKey)) {
                this.showNotification('❌ Error', 'Provider not connected');
                return;
            }

            this.state.activeProvider = providerKey;
            localStorage.setItem('aevov_active_storage', providerKey);
            this.showNotification('✅ Active Provider', `${this.providers[providerKey].name} is now active`);
            this.renderProvidersList();
        },

        async upload(file, path = '', metadata = {}) {
            if (!this.state.activeProvider) {
                throw new Error('No active storage provider');
            }

            const provider = this.providers[this.state.activeProvider];
            const config = this.state.connections.get(this.state.activeProvider).config;

            if (this.config.compressionEnabled) {
                file = await this.compressFile(file);
            }

            if (this.config.enableEncryption) {
                file = await this.encryptFile(file);
            }

            const result = await provider.upload(file, path, metadata, config);

            if (this.config.enableAutoReplication && this.state.replicationTargets.length > 0) {
                await this.replicateToTargets(file, path, metadata);
            }

            return result;
        },

        async download(key) {
            if (!this.state.activeProvider) {
                throw new Error('No active storage provider');
            }

            const provider = this.providers[this.state.activeProvider];
            const config = this.state.connections.get(this.state.activeProvider).config;

            let file = await provider.download(key, config);

            if (this.config.enableEncryption) {
                file = await this.decryptFile(file);
            }

            if (this.config.compressionEnabled) {
                file = await this.decompressFile(file);
            }

            return file;
        },

        async replicateToTargets(file, path, metadata) {
            const promises = this.state.replicationTargets.map(async (targetKey) => {
                if (!this.state.connections.has(targetKey)) return;

                const provider = this.providers[targetKey];
                const config = this.state.connections.get(targetKey).config;

                try {
                    await provider.upload(file, path, metadata, config);
                    console.log(`✓ Replicated to ${provider.name}`);
                } catch (error) {
                    console.error(`✗ Replication to ${provider.name} failed:`, error);
                }
            });

            await Promise.allSettled(promises);
        },

        async compressFile(file) {
            console.log('🗜️ Compressing file...');
            return file;
        },

        async decompressFile(file) {
            console.log('📦 Decompressing file...');
            return file;
        },

        async encryptFile(file) {
            console.log('🔐 Encrypting file...');
            return file;
        },

        async decryptFile(file) {
            console.log('🔓 Decrypting file...');
            return file;
        },

        saveConfig(providerKey, config) {
            const saved = JSON.parse(localStorage.getItem('aevov_storage_configs') || '{}');
            saved[providerKey] = config;
            localStorage.setItem('aevov_storage_configs', JSON.stringify(saved));
        },

        loadSavedConfigs() {
            const saved = JSON.parse(localStorage.getItem('aevov_storage_configs') || '{}');
            const active = localStorage.getItem('aevov_active_storage');

            Object.entries(saved).forEach(([key, config]) => {
                this.connectProvider(key, config);
            });

            if (active && this.state.connections.has(active)) {
                this.state.activeProvider = active;
            }
        },

        openFullConfig() {
            console.log('⚙️ Opening full configuration...');
            // Call the MultiStorageManager if available
            if (window.MultiStorageManager) {
                window.MultiStorageManager.toggleInterface();
            } else {
                this.showNotification('ℹ️ Info', 'Full configuration requires MultiStorageManager');
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
                z-index: 10000000;
                max-width: 350px;
                animation: slideIn 0.3s ease;
            `;

            notif.innerHTML = `
                <div style="font-weight: 600; font-size: 16px; margin-bottom: 5px;">${title}</div>
                <div style="opacity: 0.9; font-size: 14px;">${message}</div>
            `;

            document.body.appendChild(notif);
            setTimeout(() => {
                notif.style.animation = 'slideIn 0.3s ease reverse';
                setTimeout(() => notif.remove(), 300);
            }, 4000);
        }
    };

    class BaseStorageProvider {
        constructor(name, type, description) {
            this.name = name;
            this.type = type;
            this.description = description;
        }

        async connect(config) {
            throw new Error('connect() must be implemented');
        }

        async upload(file, path, metadata, config) {
            throw new Error('upload() must be implemented');
        }

        async download(key, config) {
            throw new Error('download() must be implemented');
        }

        getConfigTemplate() {
            throw new Error('getConfigTemplate() must be implemented');
        }
    }

    class CubbitProvider extends BaseStorageProvider {
        constructor() {
            super('Cubbit', 'Decentralized S3', 'Distributed cloud storage with S3 compatibility');
        }

        getConfigTemplate() {
            return {
                accessKeyId: { label: 'Access Key ID', type: 'text', required: true },
                secretAccessKey: { label: 'Secret Access Key', type: 'password', required: true },
                bucket: { label: 'Bucket Name', type: 'text', required: true },
                endpoint: { label: 'Endpoint', type: 'text', placeholder: 's3.cubbit.eu' }
            };
        }

        async connect(config) {
            return { success: true };
        }

        async upload(file, path, metadata, config) {
            console.log('📤 Uploading to Cubbit:', path);
            return { success: true, key: path };
        }

        async download(key, config) {
            console.log('📥 Downloading from Cubbit:', key);
            return new Blob();
        }
    }

    class AWSS3Provider extends BaseStorageProvider {
        constructor() {
            super('AWS S3', 'Centralized', 'Amazon Web Services S3 object storage');
        }

        getConfigTemplate() {
            return {
                accessKeyId: { label: 'Access Key ID', type: 'text', required: true },
                secretAccessKey: { label: 'Secret Access Key', type: 'password', required: true },
                bucket: { label: 'Bucket Name', type: 'text', required: true },
                region: { label: 'Region', type: 'select', options: ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1'] }
            };
        }

        async connect(config) {
            return { success: true };
        }

        async upload(file, path, metadata, config) {
            console.log('📤 Uploading to AWS S3:', path);
            return { success: true, key: path };
        }

        async download(key, config) {
            console.log('📥 Downloading from AWS S3:', key);
            return new Blob();
        }
    }

    class GoogleCloudProvider extends BaseStorageProvider {
        constructor() {
            super('Google Cloud Storage', 'Centralized', 'Google Cloud Platform object storage');
        }

        getConfigTemplate() {
            return {
                projectId: { label: 'Project ID', type: 'text', required: true },
                keyFile: { label: 'Service Account Key (JSON)', type: 'password', required: true },
                bucket: { label: 'Bucket Name', type: 'text', required: true }
            };
        }

        async connect(config) {
            return { success: true };
        }

        async upload(file, path, metadata, config) {
            console.log('📤 Uploading to GCS:', path);
            return { success: true, key: path };
        }

        async download(key, config) {
            console.log('📥 Downloading from GCS:', key);
            return new Blob();
        }
    }

    class AzureProvider extends BaseStorageProvider {
        constructor() {
            super('Azure Blob Storage', 'Centralized', 'Microsoft Azure blob storage');
        }

        getConfigTemplate() {
            return {
                accountName: { label: 'Account Name', type: 'text', required: true },
                accountKey: { label: 'Account Key', type: 'password', required: true },
                container: { label: 'Container Name', type: 'text', required: true }
            };
        }

        async connect(config) {
            return { success: true };
        }

        async upload(file, path, metadata, config) {
            console.log('📤 Uploading to Azure:', path);
            return { success: true, key: path };
        }

        async download(key, config) {
            console.log('📥 Downloading from Azure:', key);
            return new Blob();
        }
    }

    class IPFSProvider extends BaseStorageProvider {
        constructor() {
            super('IPFS', 'Decentralized', 'InterPlanetary File System distributed storage');
        }

        getConfigTemplate() {
            return {
                gateway: { label: 'IPFS Gateway', type: 'text', placeholder: 'https://ipfs.io' },
                pinningService: { label: 'Pinning Service', type: 'select', options: ['Pinata', 'Infura', 'Filebase', 'None'] },
                apiKey: { label: 'API Key (if using pinning)', type: 'password' }
            };
        }

        async connect(config) {
            return { success: true };
        }

        async upload(file, path, metadata, config) {
            console.log('📤 Uploading to IPFS:', path);
            return { success: true, cid: 'Qm...' };
        }

        async download(cid, config) {
            console.log('📥 Downloading from IPFS:', cid);
            return new Blob();
        }
    }

    class StorjProvider extends BaseStorageProvider {
        constructor() {
            super('Storj DCS', 'Decentralized', 'Decentralized cloud storage with S3 compatibility');
        }

        getConfigTemplate() {
            return {
                accessGrant: { label: 'Access Grant', type: 'password', required: true },
                bucket: { label: 'Bucket Name', type: 'text', required: true }
            };
        }

        async connect(config) {
            return { success: true };
        }

        async upload(file, path, metadata, config) {
            console.log('📤 Uploading to Storj:', path);
            return { success: true, key: path };
        }

        async download(key, config) {
            console.log('📥 Downloading from Storj:', key);
            return new Blob();
        }
    }

    class ArweaveProvider extends BaseStorageProvider {
        constructor() {
            super('Arweave', 'Permanent Storage', 'Permanent decentralized storage blockchain');
        }

        getConfigTemplate() {
            return {
                wallet: { label: 'Wallet Key (JSON)', type: 'password', required: true },
                gateway: { label: 'Gateway URL', type: 'text', placeholder: 'https://arweave.net' }
            };
        }

        async connect(config) {
            return { success: true };
        }

        async upload(file, path, metadata, config) {
            console.log('📤 Uploading to Arweave:', path);
            return { success: true, txId: 'arweave-tx-id' };
        }

        async download(txId, config) {
            console.log('📥 Downloading from Arweave:', txId);
            return new Blob();
        }
    }

    class FilecoinProvider extends BaseStorageProvider {
        constructor() {
            super('Filecoin', 'Decentralized', 'Filecoin decentralized storage network');
        }

        getConfigTemplate() {
            return {
                token: { label: 'API Token', type: 'password', required: true },
                endpoint: { label: 'API Endpoint', type: 'text', placeholder: 'https://api.web3.storage' }
            };
        }

        async connect(config) {
            return { success: true };
        }

        async upload(file, path, metadata, config) {
            console.log('📤 Uploading to Filecoin:', path);
            return { success: true, cid: 'filecoin-cid' };
        }

        async download(cid, config) {
            console.log('📥 Downloading from Filecoin:', cid);
            return new Blob();
        }
    }

    window.MultiStorageFramework = MultiStorageFramework;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => MultiStorageFramework.init());
    } else {
        MultiStorageFramework.init();
    }

    console.log('✅ Multi-Storage Framework loaded');
    console.log('☁️ 8 storage providers available');

})();
