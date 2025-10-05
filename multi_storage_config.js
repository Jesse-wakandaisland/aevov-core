/**
 * COMPREHENSIVE MULTI-STORAGE CONFIGURATION
 * Unified S3-compatible storage management system
 * 
 * Supported Providers:
 * - Cubbit (S3-compatible)
 * - AWS S3
 * - DigitalOcean Spaces
 * - Backblaze B2
 * - Wasabi
 * - Cloudflare R2
 * - Vultr Object Storage
 * - Linode Object Storage
 * - OVH Cloud Storage
 * - MinIO (Self-hosted)
 * - Oracle Cloud Storage
 * - IBM Cloud Object Storage
 * - Scaleway Object Storage
 */

(function() {
    'use strict';

    console.log('☁️ Loading Multi-Storage Configuration System...');

    const MultiStorageManager = {
        version: '1.0.0',

        // State
        state: {
            initialized: false,
            activeStorage: null,
            storageConfigs: [],
            connected: false,
            currentUpload: null,
            encryptionKey: null
        },

        // Storage Provider Configurations
        providers: {
            cubbit: {
                name: 'Cubbit',
                endpoint: 's3.cubbit.eu',
                region: 'eu-central-1',
                port: 443,
                useSSL: true,
                pathStyle: false,
                signatureVersion: 'v4',
                icon: '🔷',
                description: 'Distributed cloud storage with geo-redundancy'
            },
            aws: {
                name: 'AWS S3',
                endpoint: 's3.amazonaws.com',
                region: 'us-east-1',
                port: 443,
                useSSL: true,
                pathStyle: false,
                signatureVersion: 'v4',
                icon: '📦',
                description: 'Amazon Web Services S3'
            },
            digitalocean: {
                name: 'DigitalOcean Spaces',
                endpoint: '[region].digitaloceanspaces.com',
                region: 'nyc3',
                port: 443,
                useSSL: true,
                pathStyle: false,
                signatureVersion: 'v4',
                icon: '🌊',
                description: 'S3-compatible object storage from DigitalOcean'
            },
            backblaze: {
                name: 'Backblaze B2',
                endpoint: 's3.[region].backblazeb2.com',
                region: 'us-west-002',
                port: 443,
                useSSL: true,
                pathStyle: false,
                signatureVersion: 'v4',
                icon: '💾',
                description: 'Low-cost B2 cloud storage'
            },
            wasabi: {
                name: 'Wasabi',
                endpoint: 's3.[region].wasabisys.com',
                region: 'us-east-1',
                port: 443,
                useSSL: true,
                pathStyle: false,
                signatureVersion: 'v4',
                icon: '🌶️',
                description: 'Hot cloud storage'
            },
            cloudflare_r2: {
                name: 'Cloudflare R2',
                endpoint: '[account_id].r2.cloudflarestorage.com',
                region: 'auto',
                port: 443,
                useSSL: true,
                pathStyle: false,
                signatureVersion: 'v4',
                icon: '🔶',
                description: 'Zero-egress cloud storage'
            },
            vultr: {
                name: 'Vultr Object Storage',
                endpoint: '[region].vultrobjects.com',
                region: 'ewr1',
                port: 443,
                useSSL: true,
                pathStyle: false,
                signatureVersion: 'v4',
                icon: '⚡',
                description: 'High-performance object storage'
            },
            linode: {
                name: 'Linode Object Storage',
                endpoint: '[region].linodeobjects.com',
                region: 'us-east-1',
                port: 443,
                useSSL: true,
                pathStyle: false,
                signatureVersion: 'v4',
                icon: '🟢',
                description: 'Akamai-powered object storage'
            },
            ovh: {
                name: 'OVH Cloud Storage',
                endpoint: 's3.[region].cloud.ovh.net',
                region: 'gra',
                port: 443,
                useSSL: true,
                pathStyle: false,
                signatureVersion: 'v4',
                icon: '🇫🇷',
                description: 'European cloud storage provider'
            },
            minio: {
                name: 'MinIO',
                endpoint: 'localhost',
                region: 'us-east-1',
                port: 9000,
                useSSL: false,
                pathStyle: true,
                signatureVersion: 'v4',
                icon: '🏠',
                description: 'Self-hosted S3-compatible storage'
            },
            oracle: {
                name: 'Oracle Cloud Storage',
                endpoint: '[namespace].compat.objectstorage.[region].oraclecloud.com',
                region: 'us-phoenix-1',
                port: 443,
                useSSL: true,
                pathStyle: false,
                signatureVersion: 'v4',
                icon: '🔴',
                description: 'Oracle Cloud Infrastructure Object Storage'
            },
            ibm: {
                name: 'IBM Cloud Object Storage',
                endpoint: 's3.[region].cloud-object-storage.appdomain.cloud',
                region: 'us-south',
                port: 443,
                useSSL: true,
                pathStyle: false,
                signatureVersion: 'v4',
                icon: '💙',
                description: 'IBM Cloud storage service'
            },
            scaleway: {
                name: 'Scaleway Object Storage',
                endpoint: 's3.[region].scw.cloud',
                region: 'fr-par',
                port: 443,
                useSSL: true,
                pathStyle: false,
                signatureVersion: 'v4',
                icon: '🇫🇷',
                description: 'European cloud object storage'
            }
        },

        /**
         * INITIALIZE
         */
        async init() {
            if (this.state.initialized) {
                console.warn('⚠️ Multi-Storage Manager already initialized');
                return;
            }

            console.log('⚡ Initializing Multi-Storage Manager...');

            // Add CSS animations
            this.injectStyles();

            // Load saved configurations
            this.loadStorageConfigs();

            // Create UI
            this.createInterface();

            this.state.initialized = true;
            console.log('✅ Multi-Storage Manager ready!');
        },

        /**
         * INJECT STYLES
         */
        injectStyles() {
            if (document.getElementById('multiStorageStyles')) return;

            const style = document.createElement('style');
            style.id = 'multiStorageStyles';
            style.textContent = `
                @keyframes slideIn {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        },

        /**
         * CREATE INTERFACE
         */
        createInterface() {
            const container = document.createElement('div');
            container.id = 'multiStorageInterface';
            container.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 900px;
                max-width: 90vw;
                max-height: 85vh;
                background: linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%);
                border: 3px solid #00ff88;
                border-radius: 15px;
                box-shadow: 0 20px 60px rgba(0, 255, 136, 0.4);
                z-index: 10001;
                display: none;
                overflow-y: auto;
            `;

            container.innerHTML = `
                <div style="background: linear-gradient(135deg, #00ff88 0%, #00d4ff 100%); padding: 20px; color: white; position: sticky; top: 0; z-index: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h2 style="margin: 0;">☁️ Multi-Storage Configuration</h2>
                            <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 14px;">Unified S3-Compatible Storage Management</p>
                        </div>
                        <button onclick="window.MultiStorageManager.toggleInterface()" style="
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
                    
                    <!-- Storage Provider Selection -->
                    <div style="margin-bottom: 25px;">
                        <h3 style="color: #00ff88; margin-bottom: 15px;">📦 Select Storage Provider</h3>
                        <div id="providerGrid" style="
                            display: grid;
                            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                            gap: 12px;
                        "></div>
                    </div>

                    <!-- Configuration Form -->
                    <div id="configForm" style="display: none;">
                        <h3 style="color: #00ff88; margin-bottom: 15px;">⚙️ Configuration</h3>
                        
                        <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                            <div id="providerInfo" style="margin-bottom: 20px;"></div>

                            <div style="display: grid; gap: 15px;">
                                <div>
                                    <label style="display: block; margin-bottom: 5px; font-size: 14px;">Configuration Name</label>
                                    <input type="text" id="configName" placeholder="My Storage Config" style="
                                        width: 100%;
                                        padding: 10px;
                                        background: rgba(255,255,255,0.1);
                                        border: 1px solid rgba(255,255,255,0.2);
                                        color: white;
                                        border-radius: 6px;
                                    ">
                                </div>

                                <div>
                                    <label style="display: block; margin-bottom: 5px; font-size: 14px;">Endpoint URL</label>
                                    <input type="text" id="endpoint" placeholder="s3.provider.com" style="
                                        width: 100%;
                                        padding: 10px;
                                        background: rgba(255,255,255,0.1);
                                        border: 1px solid rgba(255,255,255,0.2);
                                        color: white;
                                        border-radius: 6px;
                                    ">
                                    <small style="color: rgba(255,255,255,0.6); font-size: 12px;" id="endpointHelp"></small>
                                </div>

                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                                    <div>
                                        <label style="display: block; margin-bottom: 5px; font-size: 14px;">Region</label>
                                        <input type="text" id="region" placeholder="us-east-1" style="
                                            width: 100%;
                                            padding: 10px;
                                            background: rgba(255,255,255,0.1);
                                            border: 1px solid rgba(255,255,255,0.2);
                                            color: white;
                                            border-radius: 6px;
                                        ">
                                    </div>
                                    <div>
                                        <label style="display: block; margin-bottom: 5px; font-size: 14px;">Port</label>
                                        <input type="number" id="port" value="443" style="
                                            width: 100%;
                                            padding: 10px;
                                            background: rgba(255,255,255,0.1);
                                            border: 1px solid rgba(255,255,255,0.2);
                                            color: white;
                                            border-radius: 6px;
                                        ">
                                    </div>
                                </div>

                                <div>
                                    <label style="display: block; margin-bottom: 5px; font-size: 14px;">Access Key ID</label>
                                    <input type="text" id="accessKeyId" placeholder="Your access key" style="
                                        width: 100%;
                                        padding: 10px;
                                        background: rgba(255,255,255,0.1);
                                        border: 1px solid rgba(255,255,255,0.2);
                                        color: white;
                                        border-radius: 6px;
                                    ">
                                </div>

                                <div>
                                    <label style="display: block; margin-bottom: 5px; font-size: 14px;">Secret Access Key</label>
                                    <input type="password" id="secretAccessKey" placeholder="Your secret key" style="
                                        width: 100%;
                                        padding: 10px;
                                        background: rgba(255,255,255,0.1);
                                        border: 1px solid rgba(255,255,255,0.2);
                                        color: white;
                                        border-radius: 6px;
                                    ">
                                </div>

                                <div>
                                    <label style="display: block; margin-bottom: 5px; font-size: 14px;">Bucket Name</label>
                                    <input type="text" id="bucketName" placeholder="my-bucket" style="
                                        width: 100%;
                                        padding: 10px;
                                        background: rgba(255,255,255,0.1);
                                        border: 1px solid rgba(255,255,255,0.2);
                                        color: white;
                                        border-radius: 6px;
                                    ">
                                </div>

                                <!-- Advanced Options -->
                                <details style="margin-top: 10px;">
                                    <summary style="cursor: pointer; color: #00d4ff; margin-bottom: 10px;">🔧 Advanced Options</summary>
                                    <div style="display: grid; gap: 12px; margin-top: 10px;">
                                        <label style="display: flex; align-items: center; gap: 10px;">
                                            <input type="checkbox" id="useSSL" checked>
                                            <span>Use SSL/TLS (HTTPS)</span>
                                        </label>
                                        <label style="display: flex; align-items: center; gap: 10px;">
                                            <input type="checkbox" id="pathStyle">
                                            <span>Path-style URLs (for MinIO/legacy)</span>
                                        </label>
                                        <div>
                                            <label style="display: block; margin-bottom: 5px; font-size: 14px;">Signature Version</label>
                                            <select id="signatureVersion" style="
                                                width: 100%;
                                                padding: 10px;
                                                background: rgba(255,255,255,0.1);
                                                border: 1px solid rgba(255,255,255,0.2);
                                                color: white;
                                                border-radius: 6px;
                                            ">
                                                <option value="v4" selected>AWS Signature V4</option>
                                                <option value="v2">AWS Signature V2</option>
                                            </select>
                                        </div>
                                    </div>
                                </details>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
                            <button id="testConnectionBtn" style="
                                padding: 12px;
                                background: rgba(255, 159, 10, 0.2);
                                border: 1px solid #ff9f0a;
                                color: white;
                                border-radius: 6px;
                                cursor: pointer;
                                font-weight: 600;
                            ">🧪 Test Connection</button>
                            
                            <button id="saveConfigBtn" style="
                                padding: 12px;
                                background: linear-gradient(135deg, #00ff88 0%, #00d4ff 100%);
                                border: none;
                                color: white;
                                border-radius: 6px;
                                cursor: pointer;
                                font-weight: 600;
                            ">💾 Save Configuration</button>

                            <button id="cancelConfigBtn" style="
                                padding: 12px;
                                background: rgba(255, 59, 48, 0.2);
                                border: 1px solid #ff3b30;
                                color: white;
                                border-radius: 6px;
                                cursor: pointer;
                                font-weight: 600;
                            ">❌ Cancel</button>
                        </div>
                    </div>

                    <!-- Saved Configurations -->
                    <div id="savedConfigs" style="margin-top: 25px;">
                        <h3 style="color: #00ff88; margin-bottom: 15px;">💾 Saved Configurations</h3>
                        <div id="savedConfigsList"></div>
                    </div>
                </div>
            `;

            document.body.appendChild(container);

            // Create floating button
            this.createFloatingButton();

            // Setup keyboard shortcuts
            this.setupKeyboardShortcuts();

            // Setup button event listeners
            this.setupButtonListeners();

            // Render provider grid
            this.renderProviderGrid();

            // Render saved configs
            this.renderSavedConfigs();

            console.log('✅ Multi-Storage interface created');
        },

        /**
         * CREATE FLOATING BUTTON
         */
        createFloatingButton() {
            const button = document.createElement('button');
            button.id = 'multiStorageFloatingBtn';
            button.innerHTML = '☁️<br><span style="font-size: 10px;">STORAGE</span>';
            button.onclick = () => this.toggleInterface();
            button.style.cssText = `
                position: fixed;
                left: 20px;
                top: calc(50% - 80px);
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #00ff88 0%, #00d4ff 100%);
                border: 3px solid rgba(0, 255, 136, 0.5);
                border-radius: 12px;
                color: white;
                font-size: 20px;
                font-weight: bold;
                cursor: pointer;
                z-index: 9999;
                box-shadow: 0 4px 15px rgba(0, 255, 136, 0.4);
                transition: all 0.3s ease;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                line-height: 1;
                padding: 8px;
            `;

            // Hover effect
            button.onmouseenter = () => {
                button.style.transform = 'scale(1.1)';
                button.style.boxShadow = '0 6px 20px rgba(0, 255, 136, 0.6)';
            };
            
            button.onmouseleave = () => {
                button.style.transform = 'scale(1)';
                button.style.boxShadow = '0 4px 15px rgba(0, 255, 136, 0.4)';
            };

            document.body.appendChild(button);
            console.log('✅ Multi-Storage floating button created');
        },

        /**
         * RENDER PROVIDER GRID
         */
        renderProviderGrid() {
            const grid = document.getElementById('providerGrid');
            if (!grid) {
                console.error('Provider grid element not found!');
                return;
            }

            const self = this;
            console.log('Rendering provider grid with', Object.keys(this.providers).length, 'providers');

            // Build HTML first
            const html = Object.entries(this.providers).map(([key, provider]) => `
                <div class="provider-card" 
                     data-provider="${key}" 
                     id="provider-card-${key}"
                     style="
                    background: rgba(0,0,0,0.3);
                    padding: 15px;
                    border-radius: 8px;
                    border: 2px solid transparent;
                    cursor: pointer;
                    transition: all 0.3s;
                    text-align: center;
                ">
                    <div style="font-size: 32px; margin-bottom: 8px;">${provider.icon}</div>
                    <div style="font-weight: 600; margin-bottom: 5px;">${provider.name}</div>
                    <div style="font-size: 11px; opacity: 0.7;">${provider.description}</div>
                </div>
            `).join('');

            grid.innerHTML = html;

            // Wait for DOM to be ready, then attach events with MULTIPLE methods
            setTimeout(() => {
                // Method 1: Query and attach via addEventListener
                const cards = grid.querySelectorAll('.provider-card');
                console.log('Found', cards.length, 'provider cards to attach events to');

                cards.forEach((card, index) => {
                    const providerKey = card.dataset.provider;
                    console.log(`Attaching events to card ${index}:`, providerKey);

                    // Method 1a: Click event
                    card.addEventListener('click', function(e) {
                        console.log('Click event fired on', providerKey);
                        e.preventDefault();
                        e.stopPropagation();
                        self.selectProvider(providerKey);
                    });

                    // Method 1b: Mousedown as backup
                    card.addEventListener('mousedown', function(e) {
                        console.log('Mousedown event fired on', providerKey);
                    });

                    // Method 1c: Pointer events
                    card.addEventListener('pointerdown', function(e) {
                        console.log('Pointerdown event fired on', providerKey);
                    });

                    // Hover effects
                    card.addEventListener('mouseenter', function() {
                        this.style.borderColor = '#00ff88';
                        this.style.transform = 'scale(1.02)';
                    });
                    
                    card.addEventListener('mouseleave', function() {
                        this.style.borderColor = 'transparent';
                        this.style.transform = 'scale(1)';
                    });

                    // Method 2: Direct onclick as ultimate fallback
                    card.onclick = function(e) {
                        console.log('ONCLICK FALLBACK fired for', providerKey);
                        e.preventDefault();
                        self.selectProvider(providerKey);
                        return false;
                    };
                });

                // Method 3: Event delegation on parent
                grid.addEventListener('click', function(e) {
                    const card = e.target.closest('.provider-card');
                    if (card) {
                        const providerKey = card.dataset.provider;
                        console.log('DELEGATION CLICK on', providerKey);
                        self.selectProvider(providerKey);
                    }
                });

                // Method 4: Global click catcher
                document.addEventListener('click', function(e) {
                    if (e.target.closest('.provider-card')) {
                        const card = e.target.closest('.provider-card');
                        const providerKey = card.dataset.provider;
                        console.log('GLOBAL CLICK CATCHER on', providerKey);
                    }
                });

                console.log('✓ All event listeners attached with multiple redundancies');
            }, 50);

            // Also try immediate attachment
            const immediateCards = grid.querySelectorAll('.provider-card');
            immediateCards.forEach(card => {
                const providerKey = card.dataset.provider;
                card.onclick = function() {
                    console.log('IMMEDIATE ONCLICK for', providerKey);
                    self.selectProvider(providerKey);
                };
            });
        },

        /**
         * SELECT PROVIDER
         */
        selectProvider(providerKey) {
            const provider = this.providers[providerKey];
            if (!provider) {
                console.error('Provider not found:', providerKey);
                return;
            }

            console.log(`📦 Selected provider: ${provider.name}`);

            // Show config form
            const configForm = document.getElementById('configForm');
            if (configForm) {
                configForm.style.display = 'block';
                configForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            // Populate provider info
            const providerInfo = document.getElementById('providerInfo');
            if (providerInfo) {
                providerInfo.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 15px; padding: 15px; background: rgba(0, 255, 136, 0.1); border-radius: 8px;">
                        <div style="font-size: 48px;">${provider.icon}</div>
                        <div>
                            <h4 style="margin: 0 0 5px 0; color: #00ff88;">${provider.name}</h4>
                            <p style="margin: 0; font-size: 13px; opacity: 0.8;">${provider.description}</p>
                        </div>
                    </div>
                `;
            }

            // Populate form with defaults
            const fields = {
                endpoint: document.getElementById('endpoint'),
                region: document.getElementById('region'),
                port: document.getElementById('port'),
                useSSL: document.getElementById('useSSL'),
                pathStyle: document.getElementById('pathStyle'),
                signatureVersion: document.getElementById('signatureVersion')
            };

            if (fields.endpoint) fields.endpoint.value = provider.endpoint;
            if (fields.region) fields.region.value = provider.region;
            if (fields.port) fields.port.value = provider.port;
            if (fields.useSSL) fields.useSSL.checked = provider.useSSL;
            if (fields.pathStyle) fields.pathStyle.checked = provider.pathStyle;
            if (fields.signatureVersion) fields.signatureVersion.value = provider.signatureVersion;

            // Store selected provider
            this.state.selectedProvider = providerKey;

            // Show endpoint help
            const helpText = document.getElementById('endpointHelp');
            if (helpText) {
                helpText.textContent = 'Replace [region], [account_id], or [namespace] with your actual values';
            }

            console.log('✓ Provider configuration form ready');
        },

        /**
         * TEST CONNECTION
         */
        async testConnection() {
            try {
                const config = this.getFormConfig();
                
                if (!this.validateConfig(config)) {
                    this.showNotification('❌ Validation Error', 'Please fill in all required fields', 'error');
                    return;
                }

                console.log('🧪 Testing connection...');
                this.showNotification('🧪 Testing', 'Testing connection to storage provider...', 'info');

                // Try to list bucket contents (minimal operation)
                const signed = await this.signS3Request(config, 'GET', '', { 'max-keys': '1' });

                const response = await fetch(signed.url, {
                    method: 'GET',
                    headers: signed.headers,
                    mode: 'cors'
                });

                if (response.ok) {
                    console.log('✅ Connection test successful');
                    this.showNotification('✅ Success', 'Connection test successful! Credentials are valid.', 'success');
                } else {
                    const errorText = await response.text();
                    console.error('Connection test failed:', response.status, errorText);
                    this.showNotification(
                        '❌ Connection Failed',
                        `Status ${response.status}: ${response.statusText}. Check your credentials and permissions.`,
                        'error'
                    );
                }

            } catch (error) {
                console.error('❌ Connection test failed:', error);
                this.showNotification(
                    '❌ Connection Failed',
                    `${error.message}. This might be a CORS issue - check your bucket CORS policy.`,
                    'error'
                );
            }
        },

        /**
         * SAVE CONFIGURATION
         */
        async saveConfiguration() {
            try {
                const config = this.getFormConfig();
                
                if (!this.validateConfig(config)) {
                    this.showNotification('❌ Validation Error', 'Please fill in all required fields', 'error');
                    return;
                }

                // Encrypt sensitive data
                config.accessKeyId = await this.encryptData(config.accessKeyId);
                config.secretAccessKey = await this.encryptData(config.secretAccessKey);

                // Add metadata
                config.id = Date.now().toString();
                config.provider = this.state.selectedProvider;
                config.providerName = this.providers[this.state.selectedProvider].name;
                config.createdAt = new Date().toISOString();
                config.encrypted = true;

                this.state.storageConfigs.push(config);

                // Save to localStorage
                this.saveStorageConfigs();

                console.log('✅ Configuration saved:', config.name);
                this.showNotification('✅ Success', `Configuration "${config.name}" saved successfully!`, 'success');

                // Reset form
                this.cancelConfig();

                // Re-render saved configs
                this.renderSavedConfigs();
            } catch (error) {
                this.handleError(error, 'saveConfiguration');
            }
        },

        /**
         * GET FORM CONFIG
         */
        getFormConfig() {
            return {
                name: document.getElementById('configName').value,
                endpoint: document.getElementById('endpoint').value,
                region: document.getElementById('region').value,
                port: parseInt(document.getElementById('port').value),
                accessKeyId: document.getElementById('accessKeyId').value,
                secretAccessKey: document.getElementById('secretAccessKey').value,
                bucketName: document.getElementById('bucketName').value,
                useSSL: document.getElementById('useSSL').checked,
                pathStyle: document.getElementById('pathStyle').checked,
                signatureVersion: document.getElementById('signatureVersion').value
            };
        },

        /**
         * VALIDATE CONFIG
         */
        validateConfig(config) {
            return config.name &&
                   config.endpoint &&
                   config.region &&
                   config.accessKeyId &&
                   config.secretAccessKey &&
                   config.bucketName;
        },

        /**
         * CANCEL CONFIG
         */
        cancelConfig() {
            document.getElementById('configForm').style.display = 'none';
            
            // Clear form
            document.getElementById('configName').value = '';
            document.getElementById('accessKeyId').value = '';
            document.getElementById('secretAccessKey').value = '';
            document.getElementById('bucketName').value = '';

            // Scroll to top
            document.getElementById('multiStorageInterface').scrollTop = 0;
        },

        /**
         * RENDER SAVED CONFIGS
         */
        renderSavedConfigs() {
            const list = document.getElementById('savedConfigsList');
            if (!list) return;

            if (this.state.storageConfigs.length === 0) {
                list.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: rgba(255,255,255,0.5);">
                        <p>No saved configurations yet</p>
                    </div>
                `;
                return;
            }

            list.innerHTML = this.state.storageConfigs.map(config => `
                <div style="
                    background: rgba(0,0,0,0.3);
                    padding: 15px;
                    border-radius: 8px;
                    margin-bottom: 12px;
                    border-left: 4px solid ${this.state.activeStorage === config.id ? '#00ff88' : 'transparent'};
                ">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <div style="flex: 1;">
                            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                                <span style="font-size: 24px;">${this.providers[config.provider]?.icon || '☁️'}</span>
                                <div>
                                    <h4 style="margin: 0; color: #00ff88;">${config.name}</h4>
                                    <p style="margin: 3px 0 0 0; font-size: 12px; opacity: 0.7;">${config.providerName}</p>
                                </div>
                            </div>
                            <div style="font-size: 12px; opacity: 0.6;">
                                <div>Bucket: ${config.bucketName}</div>
                                <div>Endpoint: ${config.endpoint}</div>
                                <div>Region: ${config.region}</div>
                            </div>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            <button class="activate-btn" data-config-id="${config.id}" style="
                                padding: 6px 12px;
                                background: ${this.state.activeStorage === config.id ? 'rgba(0, 255, 136, 0.3)' : 'rgba(0, 212, 255, 0.2)'};
                                border: 1px solid ${this.state.activeStorage === config.id ? '#00ff88' : '#00d4ff'};
                                color: white;
                                border-radius: 4px;
                                cursor: pointer;
                                font-size: 12px;
                            ">${this.state.activeStorage === config.id ? '✅ Active' : '🔌 Activate'}</button>
                            <button class="delete-btn" data-config-id="${config.id}" style="
                                padding: 6px 12px;
                                background: rgba(255, 59, 48, 0.2);
                                border: 1px solid #ff3b30;
                                color: white;
                                border-radius: 4px;
                                cursor: pointer;
                                font-size: 12px;
                            ">🗑️ Delete</button>
                        </div>
                    </div>
                </div>
            `).join('');

            // Add event listeners
            document.querySelectorAll('.activate-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.activateStorage(btn.dataset.configId);
                });
            });

            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.deleteStorage(btn.dataset.configId);
                });
            });
        },

        /**
         * ACTIVATE STORAGE
         */
        async activateStorage(configId) {
            try {
                const config = this.state.storageConfigs.find(c => c.id === configId);
                if (!config) return;

                // Decrypt credentials if encrypted
                if (config.encrypted) {
                    config.accessKeyId = await this.decryptData(config.accessKeyId);
                    config.secretAccessKey = await this.decryptData(config.secretAccessKey);
                }

                this.state.activeStorage = configId;
                this.state.connected = true;

                // Save active storage
                localStorage.setItem('multiStorage_active', configId);

                console.log(`✅ Activated storage: ${config.name}`);
                this.showNotification('✅ Activated', `Storage "${config.name}" is now active`, 'success');

                this.renderSavedConfigs();
            } catch (error) {
                this.handleError(error, 'activateStorage');
            }
        },

        /**
         * DELETE STORAGE
         */
        deleteStorage(configId) {
            const config = this.state.storageConfigs.find(c => c.id === configId);
            if (!config) return;

            if (!confirm(`Delete storage configuration "${config.name}"?`)) {
                return;
            }

            this.state.storageConfigs = this.state.storageConfigs.filter(c => c.id !== configId);

            if (this.state.activeStorage === configId) {
                this.state.activeStorage = null;
                this.state.connected = false;
                localStorage.removeItem('multiStorage_active');
            }

            this.saveStorageConfigs();
            this.renderSavedConfigs();

            console.log(`✅ Deleted storage: ${config.name}`);
        },

        /**
         * SAVE STORAGE CONFIGS
         */
        saveStorageConfigs() {
            try {
                localStorage.setItem('multiStorage_configs', JSON.stringify(this.state.storageConfigs));
            } catch (error) {
                console.error('Failed to save configs:', error);
            }
        },

        /**
         * LOAD STORAGE CONFIGS
         */
        loadStorageConfigs() {
            try {
                const saved = localStorage.getItem('multiStorage_configs');
                if (saved) {
                    this.state.storageConfigs = JSON.parse(saved);
                }

                const active = localStorage.getItem('multiStorage_active');
                if (active) {
                    this.state.activeStorage = active;
                    this.state.connected = true;
                }
            } catch (error) {
                console.error('Failed to load configs:', error);
            }
        },

        /**
         * GET ACTIVE CONFIG
         */
        getActiveConfig() {
            return this.state.storageConfigs.find(c => c.id === this.state.activeStorage);
        },

        /**
         * TOGGLE INTERFACE
         */
        toggleInterface() {
            const container = document.getElementById('multiStorageInterface');
            if (container) {
                const isVisible = container.style.display !== 'none';
                container.style.display = isVisible ? 'none' : 'block';
            }
        },

        /**
         * SETUP KEYBOARD SHORTCUTS
         */
        setupKeyboardShortcuts() {
            document.addEventListener('keydown', (e) => {
                // Ctrl+Shift+S - Toggle storage interface
                if (e.ctrlKey && e.shiftKey && e.key === 'S') {
                    e.preventDefault();
                    this.toggleInterface();
                }
            });
        },

        /**
         * SETUP BUTTON LISTENERS
         */
        setupButtonListeners() {
            const self = this;
            // Setup listeners after a short delay to ensure DOM is ready
            setTimeout(() => {
                const testBtn = document.getElementById('testConnectionBtn');
                const saveBtn = document.getElementById('saveConfigBtn');
                const cancelBtn = document.getElementById('cancelConfigBtn');

                if (testBtn) {
                    testBtn.addEventListener('click', () => self.testConnection());
                }
                if (saveBtn) {
                    saveBtn.addEventListener('click', () => self.saveConfiguration());
                }
                if (cancelBtn) {
                    cancelBtn.addEventListener('click', () => self.cancelConfig());
                }
            }, 100);
        },

        /**
         * ENCRYPTION - Generate or get encryption key
         */
        async getEncryptionKey() {
            if (this.state.encryptionKey) {
                return this.state.encryptionKey;
            }

            // Try to get from session storage (not persisted)
            const stored = sessionStorage.getItem('storage_enc_key');
            if (stored) {
                const keyData = JSON.parse(stored);
                this.state.encryptionKey = await crypto.subtle.importKey(
                    'jwk',
                    keyData,
                    { name: 'AES-GCM', length: 256 },
                    true,
                    ['encrypt', 'decrypt']
                );
                return this.state.encryptionKey;
            }

            // Generate new key
            const key = await crypto.subtle.generateKey(
                { name: 'AES-GCM', length: 256 },
                true,
                ['encrypt', 'decrypt']
            );

            // Store in session (cleared on browser close)
            const keyData = await crypto.subtle.exportKey('jwk', key);
            sessionStorage.setItem('storage_enc_key', JSON.stringify(keyData));

            this.state.encryptionKey = key;
            return key;
        },

        /**
         * ENCRYPT DATA
         */
        async encryptData(plaintext) {
            try {
                const key = await this.getEncryptionKey();
                const iv = crypto.getRandomValues(new Uint8Array(12));
                const encoded = new TextEncoder().encode(plaintext);

                const ciphertext = await crypto.subtle.encrypt(
                    { name: 'AES-GCM', iv },
                    key,
                    encoded
                );

                // Combine IV + ciphertext
                const combined = new Uint8Array(iv.length + ciphertext.byteLength);
                combined.set(iv, 0);
                combined.set(new Uint8Array(ciphertext), iv.length);

                // Return as base64
                return btoa(String.fromCharCode(...combined));
            } catch (error) {
                console.error('Encryption failed:', error);
                throw new Error('Failed to encrypt data');
            }
        },

        /**
         * DECRYPT DATA
         */
        async decryptData(encrypted) {
            try {
                const key = await this.getEncryptionKey();
                
                // Decode from base64
                const combined = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0));
                
                // Extract IV and ciphertext
                const iv = combined.slice(0, 12);
                const ciphertext = combined.slice(12);

                const decrypted = await crypto.subtle.decrypt(
                    { name: 'AES-GCM', iv },
                    key,
                    ciphertext
                );

                return new TextDecoder().decode(decrypted);
            } catch (error) {
                console.error('Decryption failed:', error);
                throw new Error('Failed to decrypt data');
            }
        },

        /**
         * AWS SIGNATURE V4 - Calculate signing key
         */
        async getSignatureKey(key, dateStamp, regionName, serviceName) {
            const kDate = await this.hmacSHA256(dateStamp, 'AWS4' + key);
            const kRegion = await this.hmacSHA256(regionName, kDate);
            const kService = await this.hmacSHA256(serviceName, kRegion);
            const kSigning = await this.hmacSHA256('aws4_request', kService);
            return kSigning;
        },

        /**
         * HMAC SHA256
         */
        async hmacSHA256(data, key) {
            const keyData = typeof key === 'string' ? new TextEncoder().encode(key) : key;
            const cryptoKey = await crypto.subtle.importKey(
                'raw',
                keyData,
                { name: 'HMAC', hash: 'SHA-256' },
                false,
                ['sign']
            );
            const signature = await crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(data));
            return new Uint8Array(signature);
        },

        /**
         * SHA256 Hash
         */
        async sha256(data) {
            const encoded = new TextEncoder().encode(data);
            const hash = await crypto.subtle.digest('SHA-256', encoded);
            return Array.from(new Uint8Array(hash))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');
        },

        /**
         * SIGN S3 REQUEST
         */
        async signS3Request(config, method, path, queryParams = {}, payload = '') {
            const now = new Date();
            const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
            const dateStamp = amzDate.slice(0, 8);

            // Hash payload
            const payloadHash = await this.sha256(payload);

            // Build canonical URI
            const canonicalUri = path.startsWith('/') ? path : '/' + path;

            // Build canonical query string
            const sortedParams = Object.keys(queryParams).sort();
            const canonicalQuery = sortedParams
                .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
                .join('&');

            // Build canonical headers
            const host = `${config.bucketName}.${config.endpoint}`;
            const canonicalHeaders = `host:${host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
            const signedHeaders = 'host;x-amz-content-sha256;x-amz-date';

            // Build canonical request
            const canonicalRequest = [
                method,
                canonicalUri,
                canonicalQuery,
                canonicalHeaders,
                signedHeaders,
                payloadHash
            ].join('\n');

            // Build string to sign
            const credentialScope = `${dateStamp}/${config.region}/s3/aws4_request`;
            const requestHash = await this.sha256(canonicalRequest);
            const stringToSign = [
                'AWS4-HMAC-SHA256',
                amzDate,
                credentialScope,
                requestHash
            ].join('\n');

            // Calculate signature
            const signingKey = await this.getSignatureKey(
                config.secretAccessKey,
                dateStamp,
                config.region,
                's3'
            );
            const signature = await this.hmacSHA256(stringToSign, signingKey);
            const signatureHex = Array.from(signature)
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');

            // Build authorization header
            const authorization = `AWS4-HMAC-SHA256 Credential=${config.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signatureHex}`;

            return {
                host,
                headers: {
                    'Host': host,
                    'x-amz-date': amzDate,
                    'x-amz-content-sha256': payloadHash,
                    'Authorization': authorization
                },
                url: `${config.useSSL ? 'https' : 'http'}://${host}:${config.port}${canonicalUri}${canonicalQuery ? '?' + canonicalQuery : ''}`
            };
        },

        /**
         * UPLOAD FILE TO S3
         */
        async uploadFile(file, key, onProgress) {
            const config = await this.getActiveConfigDecrypted();
            if (!config) {
                throw new Error('No active storage configuration');
            }

            try {
                console.log(`📤 Uploading ${file.name} to ${key}...`);
                this.showNotification('📤 Uploading', `Uploading ${file.name}...`, 'info');

                // Read file
                const fileBuffer = await file.arrayBuffer();
                const fileContent = new Uint8Array(fileBuffer);

                // Sign request
                const signed = await this.signS3Request(
                    config,
                    'PUT',
                    key,
                    {},
                    '' // For PUT, we don't hash the body in query string
                );

                // Upload with progress
                return new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();

                    // Track progress
                    xhr.upload.addEventListener('progress', (e) => {
                        if (e.lengthComputable && onProgress) {
                            const percent = (e.loaded / e.total) * 100;
                            onProgress(percent, e.loaded, e.total);
                        }
                    });

                    xhr.addEventListener('load', () => {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            console.log('✅ Upload complete');
                            this.showNotification('✅ Success', `${file.name} uploaded successfully`, 'success');
                            resolve({
                                success: true,
                                key,
                                url: signed.url
                            });
                        } else {
                            const error = new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`);
                            this.handleError(error, 'uploadFile');
                            reject(error);
                        }
                    });

                    xhr.addEventListener('error', () => {
                        const error = new Error('Upload failed: Network error');
                        this.handleError(error, 'uploadFile');
                        reject(error);
                    });

                    xhr.open('PUT', signed.url);
                    
                    // Set headers
                    Object.entries(signed.headers).forEach(([key, value]) => {
                        xhr.setRequestHeader(key, value);
                    });
                    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');

                    xhr.send(fileContent);
                });

            } catch (error) {
                this.handleError(error, 'uploadFile');
                throw error;
            }
        },

        /**
         * DOWNLOAD FILE FROM S3
         */
        async downloadFile(key, onProgress) {
            const config = await this.getActiveConfigDecrypted();
            if (!config) {
                throw new Error('No active storage configuration');
            }

            try {
                console.log(`📥 Downloading ${key}...`);
                this.showNotification('📥 Downloading', `Downloading ${key}...`, 'info');

                // Sign request
                const signed = await this.signS3Request(config, 'GET', key);

                return new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.responseType = 'blob';

                    // Track progress
                    xhr.addEventListener('progress', (e) => {
                        if (e.lengthComputable && onProgress) {
                            const percent = (e.loaded / e.total) * 100;
                            onProgress(percent, e.loaded, e.total);
                        }
                    });

                    xhr.addEventListener('load', () => {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            console.log('✅ Download complete');
                            this.showNotification('✅ Success', `${key} downloaded successfully`, 'success');
                            resolve(xhr.response);
                        } else {
                            const error = new Error(`Download failed: ${xhr.status} ${xhr.statusText}`);
                            this.handleError(error, 'downloadFile');
                            reject(error);
                        }
                    });

                    xhr.addEventListener('error', () => {
                        const error = new Error('Download failed: Network error');
                        this.handleError(error, 'downloadFile');
                        reject(error);
                    });

                    xhr.open('GET', signed.url);
                    
                    // Set headers
                    Object.entries(signed.headers).forEach(([key, value]) => {
                        xhr.setRequestHeader(key, value);
                    });

                    xhr.send();
                });

            } catch (error) {
                this.handleError(error, 'downloadFile');
                throw error;
            }
        },

        /**
         * LIST FILES IN BUCKET
         */
        async listFiles(prefix = '') {
            const config = await this.getActiveConfigDecrypted();
            if (!config) {
                throw new Error('No active storage configuration');
            }

            try {
                console.log(`📋 Listing files with prefix: ${prefix}`);

                // Sign request
                const queryParams = prefix ? { prefix } : {};
                const signed = await this.signS3Request(config, 'GET', '', queryParams);

                const response = await fetch(signed.url, {
                    method: 'GET',
                    headers: signed.headers
                });

                if (!response.ok) {
                    throw new Error(`List failed: ${response.status} ${response.statusText}`);
                }

                const xmlText = await response.text();
                return this.parseS3ListResponse(xmlText);

            } catch (error) {
                this.handleError(error, 'listFiles');
                throw error;
            }
        },

        /**
         * PARSE S3 LIST RESPONSE
         */
        parseS3ListResponse(xml) {
            const files = [];
            const parser = new DOMParser();
            const doc = parser.parseFromString(xml, 'text/xml');

            const contents = doc.getElementsByTagName('Contents');
            for (let i = 0; i < contents.length; i++) {
                const content = contents[i];
                const key = content.getElementsByTagName('Key')[0]?.textContent;
                const size = content.getElementsByTagName('Size')[0]?.textContent;
                const lastModified = content.getElementsByTagName('LastModified')[0]?.textContent;

                if (key) {
                    files.push({
                        key,
                        size: parseInt(size || 0),
                        lastModified: lastModified ? new Date(lastModified) : null,
                        name: key.split('/').pop()
                    });
                }
            }

            return files;
        },

        /**
         * DELETE FILE FROM S3
         */
        async deleteFile(key) {
            const config = await this.getActiveConfigDecrypted();
            if (!config) {
                throw new Error('No active storage configuration');
            }

            try {
                console.log(`🗑️ Deleting ${key}...`);

                // Sign request
                const signed = await this.signS3Request(config, 'DELETE', key);

                const response = await fetch(signed.url, {
                    method: 'DELETE',
                    headers: signed.headers
                });

                if (!response.ok) {
                    throw new Error(`Delete failed: ${response.status} ${response.statusText}`);
                }

                console.log('✅ Delete complete');
                this.showNotification('✅ Success', `${key} deleted successfully`, 'success');
                return { success: true };

            } catch (error) {
                this.handleError(error, 'deleteFile');
                throw error;
            }
        },

        /**
         * ERROR HANDLER
         */
        handleError(error, context) {
            console.error(`❌ Error in ${context}:`, error);

            // Show user-friendly error
            this.showNotification(
                '❌ Error',
                error.message || 'An unexpected error occurred',
                'error'
            );

            // Log for debugging
            if (window.console && console.error) {
                console.error('Full error:', error);
            }

            return null;
        },

        /**
         * SHOW NOTIFICATION
         */
        showNotification(title, message, type = 'info') {
            const notification = document.createElement('div');
            const colors = {
                info: '#00d4ff',
                success: '#00ff88',
                error: '#ff3b30',
                warning: '#ff9f0a'
            };

            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%);
                color: white;
                padding: 20px;
                border-radius: 10px;
                border: 2px solid ${colors[type]};
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
                z-index: 99999;
                max-width: 350px;
                animation: slideIn 0.3s ease;
            `;

            notification.innerHTML = `
                <h3 style="margin: 0 0 10px 0; color: ${colors[type]};">${title}</h3>
                <p style="margin: 0; font-size: 14px; line-height: 1.5;">${message}</p>
            `;

            document.body.appendChild(notification);

            // Auto-remove after 5 seconds
            setTimeout(() => {
                notification.style.animation = 'slideIn 0.3s ease reverse';
                setTimeout(() => notification.remove(), 300);
            }, 5000);
        },
    };

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            MultiStorageManager.init();
        });
    } else {
        MultiStorageManager.init();
    }

    // Export globally
    window.MultiStorageManager = MultiStorageManager;

    // Add convenience methods to window for easy access
    window.uploadToStorage = async (file, path, onProgress) => {
        return await MultiStorageManager.uploadFile(file, path, onProgress);
    };

    window.downloadFromStorage = async (path, onProgress) => {
        return await MultiStorageManager.downloadFile(path, onProgress);
    };

    window.listStorageFiles = async (prefix) => {
        return await MultiStorageManager.listFiles(prefix);
    };

    window.deleteFromStorage = async (path) => {
        return await MultiStorageManager.deleteFile(path);
    };

    console.log('✅ Multi-Storage Manager loaded');
    console.log('⌨️ Press Ctrl+Shift+S to open storage configuration');
    console.log('');
    console.log('🔧 API Methods Available:');
    console.log('   - window.uploadToStorage(file, path, onProgress)');
    console.log('   - window.downloadFromStorage(path, onProgress)');
    console.log('   - window.listStorageFiles(prefix)');
    console.log('   - window.deleteFromStorage(path)');
    console.log('');
    console.log('🔒 Security: All credentials encrypted with AES-256-GCM');
    console.log('✍️ Signatures: AWS Signature V4 for all requests');

})();
