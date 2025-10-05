/**
 * AEVOV UNIFIED INTEGRATION
 * Compatible with the existing Aevov pattern system
 * 
 * ADD THIS SCRIPT AT THE VERY END OF YOUR fixed_convobuilder 3.html FILE
 * Place it AFTER all inline scripts, right before </body>
 * 
 * This script waits for ChatWidget to be fully initialized by the inline scripts
 * before adding the unified enhancements.
 */

(function() {
    'use strict';

    console.log('🔗 Loading Aevov Unified Integration...');

    const AevovUnifiedSystem = {
        // State
        state: {
            initialized: false,
            chatWidgetReady: false,
            enhancementsApplied: false
        },

        // Config
        config: {
            maxWaitTime: 30000,  // 30 seconds (longer for inline scripts)
            checkInterval: 200,   // Check every 200ms
            enableNotifications: true,
            debugMode: true
        },

        /**
         * MAIN INITIALIZATION
         */
        async init() {
            if (this.state.initialized) {
                console.warn('⚠️ Aevov Unified System already initialized');
                return;
            }

            console.log('🚀 Initializing Aevov Unified System...');

            try {
                // Step 1: Wait for ChatWidget to exist AND be initialized
                await this.waitForChatWidget();

                // Step 2: Apply unified enhancements
                this.applyEnhancements();

                // Step 3: Setup notifications
                this.setupNotifications();

                // Step 4: Setup dashboard enhancements
                this.setupDashboard();

                this.state.initialized = true;
                console.log('✅ Aevov Unified System Ready!');
                
                this.notify('success', 'System Enhanced', 'Unified conversational AI is now active!');

            } catch (error) {
                console.error('❌ Aevov Unified System initialization failed:', error);
                this.notify('error', 'Initialization Failed', error.message);
            }
        },

        /**
         * Wait for ChatWidget to be available AND initialized
         */
        async waitForChatWidget() {
            console.log('⏳ Waiting for ChatWidget to be ready...');
            
            const startTime = Date.now();
            let lastLog = 0;

            while (true) {
                const elapsed = Date.now() - startTime;
                
                // Log progress every 2 seconds
                if (elapsed - lastLog > 2000) {
                    console.log(`  ⏳ Still waiting... (${(elapsed/1000).toFixed(1)}s)`);
                    lastLog = elapsed;
                }

                // Check if timeout
                if (elapsed >= this.config.maxWaitTime) {
                    throw new Error(`ChatWidget not ready after ${this.config.maxWaitTime/1000}s. Make sure inline scripts are running.`);
                }

                // Check if ChatWidget exists
                if (window.ChatWidget) {
                    // Check if it's initialized (has the sendMessage or processQuery method)
                    if (typeof window.ChatWidget.sendMessage === 'function' || 
                        typeof window.ChatWidget.processQuery === 'function') {
                        
                        // Check if DOM elements are created
                        const chatContainer = document.getElementById('chatContainer') || 
                                            document.getElementById('aiChatMessages');
                        
                        if (chatContainer) {
                            console.log(`✅ ChatWidget ready (${(elapsed/1000).toFixed(1)}s)`);
                            this.state.chatWidgetReady = true;
                            return;
                        }
                    }
                }

                // Wait before checking again
                await new Promise(resolve => setTimeout(resolve, this.config.checkInterval));
            }
        },

        /**
         * Apply unified enhancements to existing ChatWidget
         */
        applyEnhancements() {
            console.log('🔧 Applying unified enhancements...');

            // Store original methods
            const originalSendMessage = window.sendMessage;
            const originalProcessQuery = window.ChatWidget ? window.ChatWidget.processQuery : null;

            // Enhanced sendMessage function
            window.sendMessage = () => {
                const input = document.getElementById('chatInput');
                if (!input) {
                    console.warn('⚠️ Chat input not found');
                    if (originalSendMessage) originalSendMessage();
                    return;
                }

                const query = input.value.trim();
                if (!query) return;

                const chat = document.getElementById('chatContainer');
                if (!chat) {
                    console.warn('⚠️ Chat container not found');
                    if (originalSendMessage) originalSendMessage();
                    return;
                }

                // Show notification
                if (this.config.enableNotifications) {
                    this.notify('processing', 'Processing', 'Analyzing your query...', 2000);
                }

                // Use original function with enhancement
                if (originalSendMessage) {
                    originalSendMessage();
                } else {
                    this.fallbackSendMessage(query, chat, input);
                }
            };

            // If ChatWidget has processQuery, enhance it
            if (window.ChatWidget && typeof window.ChatWidget.processQuery === 'function') {
                const original = window.ChatWidget.processQuery;
                
                window.ChatWidget.processQuery = (query) => {
                    if (this.config.enableNotifications) {
                        this.notify('processing', 'Processing', 'Analyzing patterns...', 2000);
                    }

                    try {
                        return original.call(window.ChatWidget, query);
                    } catch (error) {
                        console.error('Error in processQuery:', error);
                        return `Error: ${error.message}`;
                    }
                };
            }

            this.state.enhancementsApplied = true;
            console.log('✅ Enhancements applied');
        },

        /**
         * Fallback sendMessage if original doesn't exist
         */
        fallbackSendMessage(query, chat, input) {
            // Add user message
            const userMsg = document.createElement('div');
            userMsg.className = 'message user';
            userMsg.textContent = query;
            chat.appendChild(userMsg);

            input.value = '';

            // Show thinking
            const thinkingMsg = document.createElement('div');
            thinkingMsg.className = 'message assistant';
            thinkingMsg.innerHTML = '<em>🤔 Processing...</em>';
            chat.appendChild(thinkingMsg);
            chat.scrollTop = chat.scrollHeight;

            // Get response
            setTimeout(() => {
                chat.removeChild(thinkingMsg);

                const response = this.generateResponse(query);
                
                const assistantMsg = document.createElement('div');
                assistantMsg.className = 'message assistant';
                assistantMsg.innerHTML = response;
                chat.appendChild(assistantMsg);
                chat.scrollTop = chat.scrollHeight;
            }, 500);
        },

        /**
         * Generate response using existing pattern system
         */
        generateResponse(query) {
            // Use existing ComparatorEngine if available
            if (window.ComparatorEngine) {
                const patterns = this.getAllPatterns();
                if (patterns.length === 0) {
                    return '⚠️ No patterns available. Go to <strong>Advanced Extractor</strong> or <strong>JSON Loader</strong> to load patterns first.';
                }

                const result = window.ComparatorEngine.compare(query, patterns);
                
                if (result.success && result.topMatch) {
                    const match = result.topMatch;
                    const pattern = match.pattern;
                    const confidence = match.confidence || match.similarity || 0;

                    let response = '';
                    
                    if (confidence > 0.7) {
                        response += '✅ Found a strong match!<br><br>';
                    } else {
                        response += '🔍 Found a partial match:<br><br>';
                    }

                    if (pattern.template) {
                        try {
                            const decoded = atob(pattern.template);
                            response += `<pre style="background: #2d2d2d; color: #f8f8f2; padding: 10px; border-radius: 4px; overflow-x: auto;">${this.escapeHtml(decoded)}</pre>`;
                        } catch {
                            response += `<pre style="background: #2d2d2d; color: #f8f8f2; padding: 10px; border-radius: 4px; overflow-x: auto;">${this.escapeHtml(pattern.template)}</pre>`;
                        }
                    }

                    if (pattern.keywords) {
                        response += `<br><strong>Keywords:</strong> ${pattern.keywords.slice(0, 5).join(', ')}`;
                    }

                    response += `<br><strong>Confidence:</strong> ${(confidence * 100).toFixed(1)}%`;

                    return response;
                }
            }

            // Fallback if ComparatorEngine not available
            const patterns = this.getAllPatterns();
            if (patterns.length === 0) {
                return '⚠️ No patterns loaded. Please load a model or extract patterns first.';
            }

            return `I found ${patterns.length} patterns available. However, I need the ComparatorEngine to perform proper matching. Please ensure all systems are loaded.`;
        },

        /**
         * Get all patterns from all sources (compatible with Aevov)
         */
        getAllPatterns() {
            const allPatterns = [];

            // From main patterns database
            if (window.patterns) {
                Object.entries(window.patterns).forEach(([domain, pats]) => {
                    if (Array.isArray(pats)) {
                        pats.forEach(p => allPatterns.push({ ...p, domain }));
                    }
                });
            }

            // From advanced patterns
            if (window.advancedPatterns) {
                Object.entries(window.advancedPatterns).forEach(([category, pats]) => {
                    if (Array.isArray(pats)) {
                        pats.forEach(p => allPatterns.push({ ...p, category }));
                    }
                });
            }

            return allPatterns;
        },

        /**
         * Setup notification system
         */
        setupNotifications() {
            console.log('🔔 Setting up notifications...');

            // Create notification container if it doesn't exist
            if (!document.getElementById('unified-notifications')) {
                const container = document.createElement('div');
                container.id = 'unified-notifications';
                container.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 999999;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    pointer-events: none;
                `;
                document.body.appendChild(container);
            }

            // Add notification styles
            if (!document.getElementById('unified-notification-styles')) {
                const style = document.createElement('style');
                style.id = 'unified-notification-styles';
                style.textContent = `
                    @keyframes slideInNotif {
                        from { transform: translateX(400px); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                    @keyframes slideOutNotif {
                        from { transform: translateX(0); opacity: 1; }
                        to { transform: translateX(400px); opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }

            console.log('✅ Notifications ready');
        },

        /**
         * Show notification
         */
        notify(type, title, message, duration = 4000) {
            if (!this.config.enableNotifications) return;

            const container = document.getElementById('unified-notifications');
            if (!container) return;

            const notification = document.createElement('div');
            notification.style.cssText = `
                background: ${type === 'success' ? 'linear-gradient(135deg, #00d4ff 0%, #0099ff 100%)' :
                             type === 'error' ? 'linear-gradient(135deg, #ff4444 0%, #cc0000 100%)' :
                             type === 'warning' ? 'linear-gradient(135deg, #ffaa00 0%, #ff6600 100%)' :
                             'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)'}; 
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                min-width: 300px;
                max-width: 400px;
                pointer-events: auto;
                animation: slideInNotif 0.3s ease-out;
            `;

            const icon = type === 'success' ? '✅' : 
                        type === 'error' ? '❌' : 
                        type === 'warning' ? '⚠️' : 
                        type === 'processing' ? '⏳' : '💬';

            notification.innerHTML = `
                <div style="display: flex; align-items: start; gap: 10px;">
                    <span style="font-size: 24px;">${icon}</span>
                    <div style="flex: 1;">
                        <strong style="display: block; margin-bottom: 5px;">${title}</strong>
                        <div style="font-size: 13px; opacity: 0.9;">${message}</div>
                    </div>
                </div>
            `;

            container.appendChild(notification);

            // Auto-remove
            setTimeout(() => {
                notification.style.animation = 'slideOutNotif 0.3s ease-in';
                setTimeout(() => notification.remove(), 300);
            }, duration);
        },

        /**
         * Setup dashboard enhancements
         */
        setupDashboard() {
            console.log('📊 Setting up dashboard enhancements...');

            // Don't override existing dashboard updater, just enhance it
            if (typeof window.updateStats === 'function') {
                const original = window.updateStats;
                window.updateStats = () => {
                    original();
                    this.updateDashboardExtras();
                };
            }

            // Initial update
            this.updateDashboardExtras();
            console.log('✅ Dashboard enhancements ready');
        },

        /**
         * Update extra dashboard info
         */
        updateDashboardExtras() {
            // Update system status if element exists
            const systemStatus = document.getElementById('systemStatus');
            if (systemStatus) {
                const patterns = this.getAllPatterns();
                systemStatus.textContent = patterns.length > 0 ? '✅ Ready' : '⏳ Loading';
            }
        },

        /**
         * Escape HTML for safe display
         */
        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        },

        /**
         * Get system status
         */
        getStatus() {
            return {
                initialized: this.state.initialized,
                chatWidgetReady: this.state.chatWidgetReady,
                enhancementsApplied: this.state.enhancementsApplied,
                patternsAvailable: this.getAllPatterns().length,
                config: this.config
            };
        }
    };

    // Auto-initialize after a short delay to ensure inline scripts finish
    function autoInit() {
        setTimeout(() => {
            AevovUnifiedSystem.init().catch(error => {
                console.error('Auto-init failed:', error);
            });
        }, 2000); // 2 second delay to let inline scripts finish
    }

    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoInit);
    } else {
        autoInit();
    }

    // Export to window
    window.AevovUnifiedSystem = AevovUnifiedSystem;

    // Global command for manual initialization
    window.initUnifiedSystem = () => {
        AevovUnifiedSystem.init().catch(console.error);
    };

    // Global status check
    window.checkUnifiedStatus = () => {
        console.log('📊 Unified System Status:');
        console.log(AevovUnifiedSystem.getStatus());
        return AevovUnifiedSystem.getStatus();
    };

    console.log('✅ Aevov Unified Integration loaded');
    console.log('💡 Will auto-initialize in 2 seconds');
    console.log('💡 Or manually call: initUnifiedSystem()');

})();
