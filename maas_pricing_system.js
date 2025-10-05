/**
 * MODELS-AS-A-SERVICE (MaaS) PLATFORM
 * Complete pricing, licensing, and distribution system
 * 
 * Features:
 * - Tiered pricing (Free, Pro, Enterprise)
 * - License key generation and validation
 * - Usage tracking and metering
 * - Automatic model updates
 * - Pattern sync protocol integration
 * - Review-based free access
 * - Stripe/PayPal integration ready
 * - Offline license caching
 */

(function() {
    'use strict';

    console.log('💰 Loading MaaS Pricing System...');

    const MaaSPlatform = {
        version: '1.0.0',

        // Configuration
        config: {
            apiEndpoint: 'https://api.aevov.ai/v1',
            syncProtocolEndpoint: 'wss://sync.aevov.ai',
            enableOfflineMode: true,
            checkUpdatesInterval: 86400000, // 24 hours
            requireLicenseForPro: true
        },

        // Pricing tiers
        tiers: {
            free: {
                name: 'Free (Conversational AI)',
                price: 0,
                features: [
                    'Generalized conversational AI models',
                    'Basic pattern matching',
                    'Community support',
                    'Perpetual access'
                ],
                limits: {
                    modelsPerMonth: 5,
                    queriesPerDay: 1000,
                    storageGB: 1
                },
                models: ['conversation-basic', 'chat-general', 'qa-simple']
            },
            'free-reviewer': {
                name: 'Free (AlgorithmPress Reviewer)',
                price: 0,
                features: [
                    'All conversational AI models',
                    'Advanced NS models',
                    'Priority support',
                    'Free model updates',
                    'Pattern sync enabled'
                ],
                limits: {
                    modelsPerMonth: 50,
                    queriesPerDay: 10000,
                    storageGB: 10
                },
                models: 'all',
                requirements: {
                    reviewRequired: true,
                    platforms: ['algorithmpress', 'wordpress-reviews', 'producthunt']
                }
            },
            pro: {
                name: 'Pro',
                price: 29,
                currency: 'USD',
                billing: 'monthly',
                features: [
                    'All .aev models',
                    'Unlimited queries',
                    'Priority support',
                    'Pattern sync protocol',
                    'API access',
                    'Custom models'
                ],
                limits: {
                    modelsPerMonth: 100,
                    queriesPerDay: 100000,
                    storageGB: 50
                },
                models: 'all'
            },
            enterprise: {
                name: 'Enterprise',
                price: 299,
                currency: 'USD',
                billing: 'monthly',
                features: [
                    'All Pro features',
                    'Unlimited everything',
                    'On-premise deployment',
                    'White-label options',
                    'SLA guarantees',
                    'Dedicated support',
                    'Custom training'
                ],
                limits: {
                    modelsPerMonth: Infinity,
                    queriesPerDay: Infinity,
                    storageGB: Infinity
                },
                models: 'all'
            }
        },

        // State
        state: {
            initialized: false,
            currentTier: 'free',
            licenseKey: null,
            userId: null,
            usageStats: {
                modelsUsed: 0,
                queriesToday: 0,
                storageUsed: 0
            },
            syncConnection: null,
            lastSync: null,
            availableModels: []
        },

        /**
         * INITIALIZE
         */
        async init() {
            if (this.state.initialized) {
                console.warn('⚠️ MaaS Platform already initialized');
                return;
            }

            console.log('⚡ Initializing MaaS Platform...');

            // Load saved license
            await this.loadLicense();

            // Validate license
            await this.validateLicense();

            // Load available models
            await this.loadAvailableModels();

            // Setup sync protocol
            await this.setupSyncProtocol();

            // Check for updates
            await this.checkForUpdates();

            // Setup periodic update checks
            this.setupUpdateScheduler();

            this.state.initialized = true;
            console.log('✅ MaaS Platform ready!');
            console.log(`📊 Current Tier: ${this.state.currentTier}`);
        },

        /**
         * LOAD LICENSE
         */
        async loadLicense() {
            const saved = localStorage.getItem('aevov_license');
            if (saved) {
                try {
                    const license = JSON.parse(saved);
                    this.state.licenseKey = license.key;
                    this.state.userId = license.userId;
                    this.state.currentTier = license.tier || 'free';
                    
                    console.log('✓ License loaded from storage');
                } catch (error) {
                    console.warn('Failed to load license:', error);
                }
            }
        },

        /**
         * VALIDATE LICENSE
         */
        async validateLicense() {
            if (!this.state.licenseKey) {
                console.log('No license key - using free tier');
                this.state.currentTier = 'free';
                return;
            }

            console.log('🔐 Validating license...');

            try {
                // In production, this would call your API
                const response = await this.mockAPICall('/licenses/validate', {
                    key: this.state.licenseKey
                });

                if (response.valid) {
                    this.state.currentTier = response.tier;
                    this.state.userId = response.userId;
                    
                    // Save validated license
                    this.saveLicense();
                    
                    console.log(`✓ License valid - ${this.state.currentTier} tier`);
                } else {
                    console.warn('Invalid license - reverting to free tier');
                    this.state.currentTier = 'free';
                    this.state.licenseKey = null;
                }
            } catch (error) {
                console.error('License validation failed:', error);
                
                // Use cached license if offline
                if (this.config.enableOfflineMode) {
                    console.log('📴 Offline mode - using cached license');
                } else {
                    this.state.currentTier = 'free';
                }
            }
        },

        /**
         * MOCK API CALL (replace with real API in production)
         */
        async mockAPICall(endpoint, data) {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Mock response
            if (endpoint === '/licenses/validate') {
                return {
                    valid: true,
                    tier: data.key.includes('pro') ? 'pro' : 'free',
                    userId: 'user_' + Date.now()
                };
            } else if (endpoint === '/models/available') {
                return {
                    models: [
                        { id: 'conversation-basic', tier: 'free', version: '1.0' },
                        { id: 'chat-general', tier: 'free', version: '1.0' },
                        { id: 'advanced-ns', tier: 'pro', version: '2.1' },
                        { id: 'enterprise-custom', tier: 'enterprise', version: '3.0' }
                    ]
                };
            }
            
            return {};
        },

        /**
         * SAVE LICENSE
         */
        saveLicense() {
            const license = {
                key: this.state.licenseKey,
                userId: this.state.userId,
                tier: this.state.currentTier,
                validated: new Date().toISOString()
            };
            
            localStorage.setItem('aevov_license', JSON.stringify(license));
        },

        /**
         * ACTIVATE LICENSE
         */
        async activateLicense(licenseKey) {
            console.log('🔑 Activating license...');

            try {
                const response = await this.mockAPICall('/licenses/activate', {
                    key: licenseKey
                });

                if (response.valid) {
                    this.state.licenseKey = licenseKey;
                    this.state.userId = response.userId;
                    this.state.currentTier = response.tier;
                    
                    this.saveLicense();
                    
                    // Reload available models
                    await this.loadAvailableModels();
                    
                    console.log(`✓ License activated - ${this.state.currentTier} tier`);
                    return { success: true, tier: this.state.currentTier };
                } else {
                    throw new Error('Invalid license key');
                }
            } catch (error) {
                console.error('License activation failed:', error);
                return { success: false, error: error.message };
            }
        },

        /**
         * CHECK REVIEW STATUS
         * For free access to reviewers
         */
        async checkReviewStatus(platform, username) {
            console.log(`📝 Checking review status on ${platform}...`);

            try {
                // In production, verify review exists
                const response = await this.mockAPICall('/reviews/verify', {
                    platform,
                    username
                });

                if (response.verified) {
                    // Grant reviewer tier
                    this.state.currentTier = 'free-reviewer';
                    this.state.userId = username;
                    
                    // Generate reviewer license
                    const reviewerLicense = `REVIEWER-${platform.toUpperCase()}-${Date.now()}`;
                    this.state.licenseKey = reviewerLicense;
                    
                    this.saveLicense();
                    await this.loadAvailableModels();
                    
                    console.log('✓ Reviewer access granted!');
                    return { success: true, tier: 'free-reviewer' };
                } else {
                    return { success: false, error: 'Review not found' };
                }
            } catch (error) {
                console.error('Review verification failed:', error);
                return { success: false, error: error.message };
            }
        },

        /**
         * LOAD AVAILABLE MODELS
         */
        async loadAvailableModels() {
            console.log('📦 Loading available models...');

            try {
                const response = await this.mockAPICall('/models/available', {
                    tier: this.state.currentTier
                });

                // Filter models based on tier
                const tierConfig = this.tiers[this.state.currentTier];
                
                if (tierConfig.models === 'all') {
                    this.state.availableModels = response.models;
                } else {
                    this.state.availableModels = response.models.filter(m => 
                        tierConfig.models.includes(m.id) || m.tier === 'free'
                    );
                }

                console.log(`✓ ${this.state.availableModels.length} models available`);
            } catch (error) {
                console.error('Failed to load models:', error);
            }
        },

        /**
         * CAN USE MODEL
         */
        canUseModel(modelId) {
            // Check if model is available in current tier
            const model = this.state.availableModels.find(m => m.id === modelId);
            if (!model) return false;

            // Check usage limits
            const limits = this.tiers[this.state.currentTier].limits;
            
            if (this.state.usageStats.modelsUsed >= limits.modelsPerMonth) {
                return false;
            }

            return true;
        },

        /**
         * TRACK USAGE
         */
        trackUsage(type, amount = 1) {
            switch(type) {
                case 'model':
                    this.state.usageStats.modelsUsed += amount;
                    break;
                case 'query':
                    this.state.usageStats.queriesToday += amount;
                    break;
                case 'storage':
                    this.state.usageStats.storageUsed += amount;
                    break;
            }

            // Check limits
            this.checkUsageLimits();
        },

        /**
         * CHECK USAGE LIMITS
         */
        checkUsageLimits() {
            const limits = this.tiers[this.state.currentTier].limits;
            const stats = this.state.usageStats;

            if (stats.queriesToday >= limits.queriesPerDay) {
                console.warn('⚠️ Daily query limit reached');
                // Optionally show upgrade prompt
            }

            if (stats.storageUsed >= limits.storageGB * 1024) {
                console.warn('⚠️ Storage limit reached');
            }
        },

        /**
         * SETUP SYNC PROTOCOL
         * Connect to AEVOV Pattern Sync Protocol
         */
        async setupSyncProtocol() {
            if (this.state.currentTier === 'free') {
                console.log('Pattern sync not available in free tier');
                return;
            }

            console.log('🔄 Connecting to Pattern Sync Protocol...');

            try {
                // Connect to WebSocket
                this.state.syncConnection = new WebSocket(this.config.syncProtocolEndpoint);

                this.state.syncConnection.onopen = () => {
                    console.log('✓ Connected to Pattern Sync Protocol');
                    
                    // Authenticate
                    this.state.syncConnection.send(JSON.stringify({
                        type: 'auth',
                        licenseKey: this.state.licenseKey,
                        userId: this.state.userId
                    }));
                };

                this.state.syncConnection.onmessage = (event) => {
                    this.handleSyncMessage(JSON.parse(event.data));
                };

                this.state.syncConnection.onerror = (error) => {
                    console.error('Sync protocol error:', error);
                };

                this.state.syncConnection.onclose = () => {
                    console.log('Sync protocol disconnected');
                    
                    // Reconnect after 5 seconds
                    setTimeout(() => this.setupSyncProtocol(), 5000);
                };
            } catch (error) {
                console.error('Failed to setup sync protocol:', error);
            }
        },

        /**
         * HANDLE SYNC MESSAGE
         */
        handleSyncMessage(message) {
            switch(message.type) {
                case 'update-available':
                    console.log(`📥 Model update available: ${message.model}`);
                    this.notifyUpdateAvailable(message.model);
                    break;

                case 'pattern-sync':
                    console.log('🔄 Syncing patterns...');
                    this.syncPatterns(message.patterns);
                    break;

                case 'license-updated':
                    console.log('🔐 License updated');
                    this.validateLicense();
                    break;
            }

            this.state.lastSync = new Date().toISOString();
        },

        /**
         * SYNC PATTERNS
         */
        async syncPatterns(patterns) {
            // Sync patterns to local database
            if (window.ComprehensiveDB) {
                for (const pattern of patterns) {
                    await window.ComprehensiveDB.insertPattern(pattern);
                }
                console.log(`✓ Synced ${patterns.length} patterns`);
            }
        },

        /**
         * CHECK FOR UPDATES
         */
        async checkForUpdates() {
            console.log('🔍 Checking for model updates...');

            try {
                const response = await this.mockAPICall('/models/check-updates', {
                    tier: this.state.currentTier,
                    currentVersions: this.getCurrentModelVersions()
                });

                if (response.updates && response.updates.length > 0) {
                    console.log(`📥 ${response.updates.length} updates available`);
                    
                    // Notify user
                    this.notifyUpdatesAvailable(response.updates);
                } else {
                    console.log('✓ All models up to date');
                }
            } catch (error) {
                console.error('Failed to check for updates:', error);
            }
        },

        /**
         * GET CURRENT MODEL VERSIONS
         */
        getCurrentModelVersions() {
            // Return currently installed model versions
            return this.state.availableModels.map(m => ({
                id: m.id,
                version: m.version
            }));
        },

        /**
         * SETUP UPDATE SCHEDULER
         */
        setupUpdateScheduler() {
            setInterval(() => {
                this.checkForUpdates();
            }, this.config.checkUpdatesInterval);
        },

        /**
         * NOTIFY UPDATE AVAILABLE
         */
        notifyUpdateAvailable(model) {
            // Show notification
            if (window.Notification && Notification.permission === 'granted') {
                new Notification('AEVOV Model Update', {
                    body: `Update available for ${model}`,
                    icon: '/aevov-icon.png'
                });
            }
        },

        /**
         * NOTIFY UPDATES AVAILABLE
         */
        notifyUpdatesAvailable(updates) {
            const updateList = updates.map(u => u.model).join(', ');
            console.log(`Updates: ${updateList}`);
            
            // Show UI notification
            // In production, integrate with your notification system
        },

        /**
         * DOWNLOAD MODEL UPDATE
         */
        async downloadModelUpdate(modelId) {
            if (!this.canUseModel(modelId)) {
                throw new Error('Model not available in current tier');
            }

            console.log(`📥 Downloading ${modelId}...`);

            try {
                // In production, download from CDN
                const response = await this.mockAPICall('/models/download', {
                    modelId,
                    licenseKey: this.state.licenseKey
                });

                // Save to local storage
                if (window.ComprehensiveDB) {
                    await window.ComprehensiveDB.state.pglite.query(
                        'INSERT INTO aev_models (model_name, version, model_data) VALUES ($1, $2, $3)',
                        [modelId, response.version, JSON.stringify(response.data)]
                    );
                }

                this.trackUsage('model');
                
                console.log(`✓ Downloaded ${modelId} v${response.version}`);
                return response;
            } catch (error) {
                console.error('Failed to download model:', error);
                throw error;
            }
        },

        /**
         * GET PRICING INFO
         */
        getPricingInfo(tier) {
            return this.tiers[tier];
        },

        /**
         * UPGRADE TO PRO
         */
        async upgradeToPro(paymentMethod = 'stripe') {
            console.log('💳 Initiating Pro upgrade...');

            // In production, integrate with Stripe/PayPal
            const checkoutUrl = `https://checkout.aevov.ai/pro?method=${paymentMethod}`;
            
            window.open(checkoutUrl, '_blank');
            
            // Wait for payment confirmation via webhook
            // Then activate license
        },

        /**
         * GENERATE INVOICE
         */
        generateInvoice(tier, period) {
            const tierConfig = this.tiers[tier];
            const amount = tierConfig.price;
            
            return {
                invoiceNumber: `INV-${Date.now()}`,
                date: new Date().toISOString(),
                tier,
                amount,
                currency: tierConfig.currency,
                period,
                status: 'paid'
            };
        }
    };

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            MaaSPlatform.init();
        });
    } else {
        MaaSPlatform.init();
    }

    // Export globally
    window.MaaSPlatform = MaaSPlatform;

    console.log('✅ MaaS Pricing System loaded');
    console.log('💰 Tier: Free | Pro ($29/mo) | Enterprise ($299/mo)');
    console.log('🎁 Free for AlgorithmPress reviewers!');

})();