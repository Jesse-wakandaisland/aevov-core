/**
 * REAL-TIME NOTIFICATION SYSTEM
 * Typebot-style notifications for every system process
 * Shows progress, status, and completion of all operations
 */

(function() {
    'use strict';

    console.log('📢 Loading Real-Time Notification System...');

    const NotificationSystem = {
        container: null,
        notifications: new Map(),
        idCounter: 0,

        /**
         * Initialize notification system
         */
        init() {
            this.createContainer();
            this.hookIntoSystemEvents();
            this.addStyles();
            console.log('✅ Real-Time Notifications ready');
        },

        /**
         * Create notification container
         */
        createContainer() {
            const container = document.createElement('div');
            container.id = 'aevovNotificationContainer';
            container.className = 'aevov-notification-container';
            document.body.appendChild(container);
            this.container = container;
        },

        /**
         * Add styles
         */
        addStyles() {
            const style = document.createElement('style');
            style.textContent = `
                .aevov-notification-container {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 999999;
                    display: flex;
                    flex-direction: column-reverse;
                    gap: 10px;
                    max-width: 400px;
                    pointer-events: none;
                }

                .aevov-notification {
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                    border: 2px solid #00d2ff;
                    border-radius: 12px;
                    padding: 16px 20px;
                    color: #fff;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    font-size: 14px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 210, 255, 0.2);
                    animation: slideIn 0.3s ease-out;
                    pointer-events: auto;
                    min-width: 350px;
                    position: relative;
                    overflow: hidden;
                }

                .aevov-notification::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 4px;
                    height: 100%;
                    background: linear-gradient(180deg, #00ff88 0%, #00d2ff 100%);
                }

                .aevov-notification.success::before {
                    background: linear-gradient(180deg, #00ff88 0%, #00d2ff 100%);
                }

                .aevov-notification.warning::before {
                    background: linear-gradient(180deg, #ff9f0a 0%, #ff6b6b 100%);
                }

                .aevov-notification.error::before {
                    background: linear-gradient(180deg, #ff6b6b 0%, #ee5a6f 100%);
                }

                .aevov-notification.processing::before {
                    background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
                    animation: processingPulse 2s infinite;
                }

                @keyframes processingPulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(100px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                .aevov-notification.exit {
                    animation: slideOut 0.3s ease-in forwards;
                }

                @keyframes slideOut {
                    to {
                        opacity: 0;
                        transform: translateX(100px);
                    }
                }

                .aevov-notification-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                }

                .aevov-notification-title {
                    font-weight: 700;
                    font-size: 15px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .aevov-notification-icon {
                    font-size: 20px;
                }

                .aevov-notification-close {
                    width: 24px;
                    height: 24px;
                    border: none;
                    background: rgba(255, 255, 255, 0.1);
                    color: #fff;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .aevov-notification-close:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: scale(1.1);
                }

                .aevov-notification-body {
                    color: rgba(255, 255, 255, 0.9);
                    line-height: 1.5;
                }

                .aevov-notification-progress {
                    margin-top: 12px;
                    height: 4px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 2px;
                    overflow: hidden;
                }

                .aevov-notification-progress-bar {
                    height: 100%;
                    background: linear-gradient(90deg, #00ff88 0%, #00d2ff 100%);
                    border-radius: 2px;
                    transition: width 0.3s ease;
                }

                .aevov-notification-meta {
                    margin-top: 8px;
                    font-size: 12px;
                    color: rgba(255, 255, 255, 0.6);
                    display: flex;
                    justify-content: space-between;
                }

                .aevov-notification-spinner {
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-top-color: #00d2ff;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        },

        /**
         * Show notification
         */
        show(options) {
            const id = this.idCounter++;
            const {
                type = 'info',
                title = 'Notification',
                message = '',
                icon = '📢',
                duration = 5000,
                progress = null,
                persistent = false
            } = options;

            const notification = document.createElement('div');
            notification.className = `aevov-notification ${type}`;
            notification.dataset.id = id;

            const iconSpinner = type === 'processing' ? 
                '<span class="aevov-notification-spinner"></span>' : icon;

            notification.innerHTML = `
                <div class="aevov-notification-header">
                    <div class="aevov-notification-title">
                        <span class="aevov-notification-icon">${iconSpinner}</span>
                        ${title}
                    </div>
                    <button class="aevov-notification-close" onclick="window.NotificationSystem.close(${id})">✕</button>
                </div>
                <div class="aevov-notification-body">${message}</div>
                ${progress !== null ? `
                    <div class="aevov-notification-progress">
                        <div class="aevov-notification-progress-bar" style="width: ${progress}%"></div>
                    </div>
                ` : ''}
                <div class="aevov-notification-meta">
                    <span>${new Date().toLocaleTimeString()}</span>
                    ${type === 'processing' ? '<span>Processing...</span>' : ''}
                </div>
            `;

            this.container.appendChild(notification);
            this.notifications.set(id, { element: notification, type, persistent });

            // Auto-remove if not persistent
            if (!persistent && duration > 0) {
                setTimeout(() => this.close(id), duration);
            }

            return id;
        },

        /**
         * Update notification
         */
        update(id, options) {
            const notif = this.notifications.get(id);
            if (!notif) return;

            const { message, progress, type } = options;

            if (message) {
                const body = notif.element.querySelector('.aevov-notification-body');
                if (body) body.textContent = message;
            }

            if (progress !== undefined) {
                let progressBar = notif.element.querySelector('.aevov-notification-progress-bar');
                if (!progressBar) {
                    const progressContainer = document.createElement('div');
                    progressContainer.className = 'aevov-notification-progress';
                    progressContainer.innerHTML = '<div class="aevov-notification-progress-bar" style="width: 0%"></div>';
                    notif.element.querySelector('.aevov-notification-body').after(progressContainer);
                    progressBar = progressContainer.querySelector('.aevov-notification-progress-bar');
                }
                if (progressBar) progressBar.style.width = progress + '%';
            }

            if (type && type !== notif.type) {
                notif.element.className = `aevov-notification ${type}`;
                notif.type = type;
            }
        },

        /**
         * Close notification
         */
        close(id) {
            const notif = this.notifications.get(id);
            if (!notif) return;

            notif.element.classList.add('exit');
            setTimeout(() => {
                notif.element.remove();
                this.notifications.delete(id);
            }, 300);
        },

        /**
         * Hook into system events
         */
        hookIntoSystemEvents() {
            console.log('🔗 Hooking into system events...');

            // Environment Detection
            this.hookEnvironmentDetection();

            // Cache Integration
            this.hookCacheIntegration();

            // Pattern Extraction
            this.hookPatternExtraction();

            // JSON Loader
            this.hookJsonLoader();

            // Inference Engine
            this.hookInferenceEngine();
        },

        /**
         * Hook environment detection
         */
        hookEnvironmentDetection() {
            if (!window.EnvironmentDetector) return;

            const original = window.EnvironmentDetector.detect;
            window.EnvironmentDetector.detect = async function() {
                const notifId = NotificationSystem.show({
                    type: 'processing',
                    title: 'Environment Detection',
                    message: 'Detecting local vs cloud environment...',
                    persistent: true
                });

                const result = await original.apply(this, arguments);

                NotificationSystem.update(notifId, {
                    type: 'success',
                    message: `Detected: ${result.toUpperCase()} mode`
                });

                setTimeout(() => NotificationSystem.close(notifId), 3000);

                return result;
            };
        },

        /**
         * Hook cache integration
         */
        hookCacheIntegration() {
            if (!window.CachePatternIntegration) return;

            const originalScan = window.CachePatternIntegration.scanCache;
            window.CachePatternIntegration.scanCache = async function() {
                const notifId = NotificationSystem.show({
                    type: 'processing',
                    title: 'Cache Scan',
                    message: 'Scanning IndexedDB for cached chunks...',
                    persistent: true
                });

                const result = await originalScan.apply(this, arguments);

                NotificationSystem.update(notifId, {
                    type: 'success',
                    message: `Found ${result.length} cached chunks`
                });

                setTimeout(() => NotificationSystem.close(notifId), 3000);

                return result;
            };
        },

        /**
         * Hook pattern extraction
         */
        hookPatternExtraction() {
            if (!window.CachePatternIntegration) return;

            const originalExtract = window.CachePatternIntegration.extractPatternsFromCache;
            window.CachePatternIntegration.extractPatternsFromCache = async function() {
                const stats = this.getStats();
                
                const notifId = NotificationSystem.show({
                    type: 'processing',
                    title: 'Pattern Extraction',
                    message: `Analyzing ${stats.cachedChunks} chunks with tensor analysis...`,
                    progress: 0,
                    persistent: true
                });

                // Monitor progress
                const progressInterval = setInterval(() => {
                    const currentStats = this.getStats();
                    const progress = stats.cachedChunks > 0 ? 
                        (currentStats.processedChunks / stats.cachedChunks) * 100 : 0;
                    
                    NotificationSystem.update(notifId, {
                        progress: progress,
                        message: `Processed ${currentStats.processedChunks}/${stats.cachedChunks} chunks`
                    });
                }, 500);

                const result = await originalExtract.apply(this, arguments);

                clearInterval(progressInterval);

                NotificationSystem.update(notifId, {
                    type: 'success',
                    message: `Extracted ${result.length} real patterns from tensor analysis`,
                    progress: 100
                });

                setTimeout(() => NotificationSystem.close(notifId), 4000);

                return result;
            };
        },

        /**
         * Hook JSON loader
         */
        hookJsonLoader() {
            if (!window.loadModel) return;

            const original = window.loadModel;
            window.loadModel = async function() {
                const notifId = NotificationSystem.show({
                    type: 'processing',
                    title: 'Model Loading',
                    message: 'Downloading and caching model chunks...',
                    progress: 0,
                    persistent: true
                });

                // Monitor progress
                const progressInterval = setInterval(() => {
                    const progressBar = document.getElementById('progressFill');
                    if (progressBar) {
                        const progress = parseInt(progressBar.textContent) || 0;
                        NotificationSystem.update(notifId, { progress });
                    }
                }, 500);

                const result = await original.apply(this, arguments);

                clearInterval(progressInterval);

                NotificationSystem.update(notifId, {
                    type: 'success',
                    message: 'Model loaded and cached successfully',
                    progress: 100
                });

                setTimeout(() => NotificationSystem.close(notifId), 3000);

                return result;
            };
        },

        /**
         * Hook inference engine
         */
        hookInferenceEngine() {
            // Show notifications for query processing
            if (window.ChatWidget && window.ChatWidget.processQuery) {
                const original = window.ChatWidget.processQuery;
                window.ChatWidget.processQuery = function(query) {
                    const notifId = NotificationSystem.show({
                        type: 'processing',
                        title: 'Inference Processing',
                        message: `Analyzing query with real patterns...`,
                        duration: 2000
                    });

                    const result = original.apply(this, arguments);

                    // Don't show success notification for every query (too noisy)
                    NotificationSystem.close(notifId);

                    return result;
                };
            }
        },

        /**
         * Custom notifications for specific events
         */
        notifyPatternQuality(realCount, fakeCount) {
            if (fakeCount > 0) {
                this.show({
                    type: 'warning',
                    title: 'Pattern Quality Alert',
                    icon: '⚠️',
                    message: `Blocked ${fakeCount} fake patterns. Using ${realCount} real patterns only.`,
                    duration: 5000
                });
            }
        },

        notifySystemReady() {
            this.show({
                type: 'success',
                title: 'System Ready',
                icon: '✅',
                message: 'All components initialized. Real pattern system active.',
                duration: 4000
            });
        },

        notifyError(title, message) {
            this.show({
                type: 'error',
                title: title,
                icon: '❌',
                message: message,
                duration: 7000
            });
        }
    };

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            NotificationSystem.init();
        });
    } else {
        NotificationSystem.init();
    }

    // Export
    window.NotificationSystem = NotificationSystem;

    console.log('✅ Real-Time Notification System loaded');

})();