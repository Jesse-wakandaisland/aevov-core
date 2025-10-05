/**
 * ENVIRONMENT DETECTOR
 * Automatically detects whether system is running in local or cloud/distributed mode
 * Adapts system behavior accordingly
 * 
 * Local Mode: Single browser node, IndexedDB, simulated consensus
 * Cloud Mode: Distributed nodes, DHT, real consensus voting
 */

(function() {
    'use strict';

    console.log('🌍 Loading Environment Detector...');

    const EnvironmentDetector = {
        environment: null,
        
        detection: {
            // Detection criteria
            checks: {
                hasWebRTC: null,
                hasPeerConnection: null,
                hasIndexedDB: null,
                hasServiceWorker: null,
                hasWebSocket: null,
                isLocalhost: null,
                hasCloudIndicators: null,
                networkLatency: null,
                canConnectToDHT: null
            },
            
            // Detected features
            features: {
                storage: null,
                consensus: null,
                networking: null,
                deployment: null
            }
        },

        config: {
            // Local mode configuration
            local: {
                storage: 'IndexedDB',
                consensus: 'simulated',
                inferenceTime: '0.1-2ms',
                nodeCount: 1,
                replication: 1,
                networking: 'none'
            },
            
            // Cloud mode configuration
            cloud: {
                storage: 'DHT-distributed',
                consensus: 'real-voting',
                inferenceTime: '5-20ms',
                nodeCount: 'multiple',
                replication: 3,
                networking: 'WebRTC/WebSocket'
            }
        },

        /**
         * Detect environment and configure system
         */
        async detect() {
            console.log('🔍 Starting environment detection...');
            
            try {
                // Run all detection checks
                await this.runDetectionChecks();
                
                // Analyze results and determine environment
                this.analyzeDetectionResults();
                
                // Configure system based on environment
                this.configureSystem();
                
                // Log results
                this.logDetectionResults();
                
                return this.environment;
                
            } catch (error) {
                console.error('❌ Environment detection failed:', error);
                // Default to local mode on error
                this.environment = 'local';
                this.configureSystem();
                return 'local';
            }
        },

        /**
         * Run all detection checks
         */
        async runDetectionChecks() {
            // Check for localhost
            this.detection.checks.isLocalhost = this.checkLocalhost();
            
            // Check browser APIs
            this.detection.checks.hasIndexedDB = this.checkIndexedDB();
            this.detection.checks.hasWebRTC = this.checkWebRTC();
            this.detection.checks.hasPeerConnection = this.checkPeerConnection();
            this.detection.checks.hasServiceWorker = this.checkServiceWorker();
            this.detection.checks.hasWebSocket = this.checkWebSocket();
            
            // Check for cloud indicators
            this.detection.checks.hasCloudIndicators = await this.checkCloudIndicators();
            
            // Measure network latency
            this.detection.checks.networkLatency = await this.measureNetworkLatency();
            
            // Try to connect to DHT
            this.detection.checks.canConnectToDHT = await this.checkDHTConnection();
        },

        /**
         * Check if running on localhost
         */
        checkLocalhost() {
            const hostname = window.location.hostname;
            const isLocal = hostname === 'localhost' || 
                          hostname === '127.0.0.1' || 
                          hostname === '' ||
                          hostname.startsWith('192.168.') ||
                          hostname.startsWith('10.') ||
                          hostname.startsWith('172.');
            
            console.log(`📍 Hostname: ${hostname} (${isLocal ? 'Local' : 'Remote'})`);
            return isLocal;
        },

        /**
         * Check IndexedDB availability
         */
        checkIndexedDB() {
            const available = 'indexedDB' in window;
            console.log(`💾 IndexedDB: ${available ? '✅' : '❌'}`);
            return available;
        },

        /**
         * Check WebRTC availability
         */
        checkWebRTC() {
            const available = 'RTCPeerConnection' in window || 
                            'webkitRTCPeerConnection' in window || 
                            'mozRTCPeerConnection' in window;
            console.log(`🌐 WebRTC: ${available ? '✅' : '❌'}`);
            return available;
        },

        /**
         * Check PeerConnection capability
         */
        checkPeerConnection() {
            try {
                const RTCPeerConnection = window.RTCPeerConnection || 
                                        window.webkitRTCPeerConnection || 
                                        window.mozRTCPeerConnection;
                if (RTCPeerConnection) {
                    const pc = new RTCPeerConnection();
                    pc.close();
                    console.log('🔗 PeerConnection: ✅');
                    return true;
                }
            } catch (error) {
                console.log('🔗 PeerConnection: ❌');
            }
            return false;
        },

        /**
         * Check Service Worker availability
         */
        checkServiceWorker() {
            const available = 'serviceWorker' in navigator;
            console.log(`⚙️ Service Worker: ${available ? '✅' : '❌'}`);
            return available;
        },

        /**
         * Check WebSocket availability
         */
        checkWebSocket() {
            const available = 'WebSocket' in window;
            console.log(`🔌 WebSocket: ${available ? '✅' : '❌'}`);
            return available;
        },

        /**
         * Check for cloud deployment indicators
         */
        async checkCloudIndicators() {
            const indicators = [];
            
            // Check for cloud-specific headers or environment variables
            try {
                // Check for Cloudflare
                if (document.querySelector('meta[name="cf-ray"]')) {
                    indicators.push('Cloudflare');
                }
                
                // Check for AWS CloudFront
                if (document.querySelector('meta[name="x-amz-cf-id"]')) {
                    indicators.push('AWS CloudFront');
                }
                
                // Check URL patterns
                const url = window.location.href;
                if (url.includes('.vercel.app') || 
                    url.includes('.netlify.app') ||
                    url.includes('.cloudflare.com') ||
                    url.includes('.amazonaws.com') ||
                    url.includes('cubbit.io')) {
                    indicators.push('Cloud Platform Detected');
                }
                
                // Check for service worker registration
                if ('serviceWorker' in navigator) {
                    const registrations = await navigator.serviceWorker.getRegistrations();
                    if (registrations.length > 0) {
                        indicators.push('Service Worker Active');
                    }
                }
                
            } catch (error) {
                console.warn('Could not check cloud indicators:', error);
            }
            
            console.log(`☁️ Cloud Indicators: ${indicators.length > 0 ? indicators.join(', ') : 'None'}`);
            return indicators.length > 0;
        },

        /**
         * Measure network latency
         */
        async measureNetworkLatency() {
            try {
                const start = performance.now();
                
                // Try to fetch a small resource
                await fetch(window.location.href, { 
                    method: 'HEAD',
                    cache: 'no-cache'
                });
                
                const latency = performance.now() - start;
                console.log(`⏱️ Network Latency: ${latency.toFixed(2)}ms`);
                
                return latency;
            } catch (error) {
                console.warn('Could not measure network latency:', error);
                return null;
            }
        },

        /**
         * Check DHT connection capability
         */
        async checkDHTConnection() {
            try {
                // Check if we can connect to a known DHT bootstrap node
                // This is a simplified check - in production, you'd try to connect to actual DHT nodes
                
                // Check for WebRTC Data Channel support (required for DHT)
                if (!this.detection.checks.hasWebRTC) {
                    console.log('🌐 DHT Connection: ❌ (No WebRTC)');
                    return false;
                }
                
                // Check if there are any peer discovery mechanisms available
                const hasPeerDiscovery = this.detection.checks.hasWebSocket || 
                                       this.detection.checks.hasPeerConnection;
                
                console.log(`🌐 DHT Connection: ${hasPeerDiscovery ? '✅' : '❌'}`);
                return hasPeerDiscovery;
                
            } catch (error) {
                console.warn('Could not check DHT connection:', error);
                return false;
            }
        },

        /**
         * Analyze detection results and determine environment
         */
        analyzeDetectionResults() {
            const checks = this.detection.checks;
            
            // Score for local environment
            let localScore = 0;
            let cloudScore = 0;
            
            // Scoring logic
            if (checks.isLocalhost) localScore += 3;
            if (checks.hasIndexedDB) localScore += 2;
            if (!checks.hasCloudIndicators) localScore += 2;
            if (checks.networkLatency === null || checks.networkLatency < 50) localScore += 1;
            
            if (!checks.isLocalhost) cloudScore += 3;
            if (checks.hasCloudIndicators) cloudScore += 3;
            if (checks.canConnectToDHT) cloudScore += 3;
            if (checks.hasWebRTC && checks.hasPeerConnection) cloudScore += 2;
            if (checks.networkLatency !== null && checks.networkLatency > 50) cloudScore += 1;
            
            // Determine environment
            if (cloudScore > localScore && cloudScore >= 5) {
                this.environment = 'cloud';
            } else {
                this.environment = 'local';
            }
            
            console.log(`📊 Detection Scores - Local: ${localScore}, Cloud: ${cloudScore}`);
            console.log(`🎯 Detected Environment: ${this.environment.toUpperCase()}`);
            
            // Set features based on environment
            if (this.environment === 'local') {
                this.detection.features = {
                    storage: 'IndexedDB',
                    consensus: 'simulated',
                    networking: 'none',
                    deployment: 'single-node'
                };
            } else {
                this.detection.features = {
                    storage: 'DHT-distributed',
                    consensus: 'real-voting',
                    networking: 'WebRTC/WebSocket',
                    deployment: 'multi-node'
                };
            }
        },

        /**
         * Configure system based on detected environment
         */
        configureSystem() {
            console.log('⚙️ Configuring system for', this.environment, 'mode...');
            
            const config = this.config[this.environment];
            
            // Set global configuration
            window.AEVOV_ENVIRONMENT = this.environment;
            window.AEVOV_CONFIG = {
                environment: this.environment,
                storage: config.storage,
                consensus: config.consensus,
                inferenceTime: config.inferenceTime,
                nodeCount: config.nodeCount,
                replication: config.replication,
                networking: config.networking,
                features: this.detection.features
            };
            
            // Configure specific components
            if (this.environment === 'local') {
                this.configureLocalMode();
            } else {
                this.configureCloudMode();
            }
            
            console.log('✅ System configured for', this.environment, 'mode');
        },

        /**
         * Configure local mode specific settings
         */
        configureLocalMode() {
            console.log('🖥️ Configuring LOCAL mode...');
            
            // Set up IndexedDB
            if (this.detection.checks.hasIndexedDB) {
                console.log('  ✓ Using IndexedDB for local storage');
            }
            
            // Configure simulated consensus
            window.CONSENSUS_MODE = 'simulated';
            console.log('  ✓ Using simulated consensus voting');
            
            // Set inference targets
            window.INFERENCE_TARGET_MS = 1; // 0.1-2ms target
            console.log('  ✓ Target inference time: 0.1-2ms');
            
            // Disable network features
            window.DHT_ENABLED = false;
            window.PEER_DISCOVERY_ENABLED = false;
            console.log('  ✓ Network features disabled');
            
            // Single node configuration
            window.NODE_ID = 'local-node-0';
            window.NODE_COUNT = 1;
            console.log('  ✓ Single node configuration');
        },

        /**
         * Configure cloud mode specific settings
         */
        configureCloudMode() {
            console.log('☁️ Configuring CLOUD mode...');
            
            // Set up DHT
            if (this.detection.checks.canConnectToDHT) {
                window.DHT_ENABLED = true;
                console.log('  ✓ DHT enabled');
            }
            
            // Configure real consensus
            window.CONSENSUS_MODE = 'real';
            console.log('  ✓ Using real consensus voting');
            
            // Set inference targets
            window.INFERENCE_TARGET_MS = 10; // 5-20ms with network latency
            console.log('  ✓ Target inference time: 5-20ms');
            
            // Enable network features
            if (this.detection.checks.hasWebRTC) {
                window.WEBRTC_ENABLED = true;
                console.log('  ✓ WebRTC enabled for P2P');
            }
            
            if (this.detection.checks.hasWebSocket) {
                window.WEBSOCKET_ENABLED = true;
                console.log('  ✓ WebSocket enabled for signaling');
            }
            
            // Enable peer discovery
            window.PEER_DISCOVERY_ENABLED = true;
            console.log('  ✓ Peer discovery enabled');
            
            // Multi-node configuration
            window.NODE_ID = 'cloud-node-' + Math.random().toString(36).substr(2, 9);
            window.REPLICATION_FACTOR = 3;
            console.log('  ✓ Multi-node configuration with 3x replication');
        },

        /**
         * Log detection results
         */
        logDetectionResults() {
            console.log('\n' + '='.repeat(60));
            console.log('🌍 ENVIRONMENT DETECTION RESULTS');
            console.log('='.repeat(60));
            console.log(`Environment: ${this.environment.toUpperCase()}`);
            console.log(`Storage: ${this.detection.features.storage}`);
            console.log(`Consensus: ${this.detection.features.consensus}`);
            console.log(`Networking: ${this.detection.features.networking}`);
            console.log(`Deployment: ${this.detection.features.deployment}`);
            console.log('='.repeat(60) + '\n');
        },

        /**
         * Get current environment
         */
        getEnvironment() {
            return this.environment || 'unknown';
        },

        /**
         * Get current configuration
         */
        getConfig() {
            return window.AEVOV_CONFIG || this.config[this.environment || 'local'];
        },

        /**
         * Check if running in local mode
         */
        isLocal() {
            return this.environment === 'local';
        },

        /**
         * Check if running in cloud mode
         */
        isCloud() {
            return this.environment === 'cloud';
        },

        /**
         * Force environment override (for testing)
         */
        forceEnvironment(env) {
            if (env !== 'local' && env !== 'cloud') {
                console.error('Invalid environment. Must be "local" or "cloud"');
                return false;
            }
            
            console.log(`🔧 Forcing environment to: ${env.toUpperCase()}`);
            this.environment = env;
            this.configureSystem();
            return true;
        }
    };

    // Auto-detect on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', async () => {
            await EnvironmentDetector.detect();
        });
    } else {
        EnvironmentDetector.detect();
    }

    // Export to window
    window.EnvironmentDetector = EnvironmentDetector;

    console.log('✅ Environment Detector loaded');

})();