/**
 * UNIFIED CHAT INITIALIZATION FIX
 * Ensures proper initialization and integration
 */

(function() {
    'use strict';

    console.log('🔧 Loading Unified Chat Initialization Fix...');

    const ChatInitFix = {
        async init() {
            console.log('⚡ Fixing Unified Chat initialization...');

            // Wait for UnifiedChatSystem
            await this.ensureUnifiedSystem();

            // Verify it's properly initialized
            await this.verifyInitialization();

            // Force re-patch if needed
            this.ensureChatWidgetPatched();

            console.log('✅ Unified Chat initialization verified');
        },

        async ensureUnifiedSystem() {
            let attempts = 0;
            const maxAttempts = 50;

            while (!window.UnifiedChatSystem && attempts < maxAttempts) {
                console.log(`⏳ Waiting for UnifiedChatSystem... (${attempts + 1}/${maxAttempts})`);
                await new Promise(resolve => setTimeout(resolve, 200));
                attempts++;
            }

            if (!window.UnifiedChatSystem) {
                throw new Error('UnifiedChatSystem failed to load after 10 seconds');
            }

            console.log('✅ UnifiedChatSystem detected');
        },

        async verifyInitialization() {
            if (!window.UnifiedChatSystem.state.initialized) {
                console.warn('⚠️ UnifiedChatSystem not initialized, forcing init...');
                await window.UnifiedChatSystem.init();
            }

            const status = window.UnifiedChatSystem.getStatus();
            console.log('📊 UnifiedChatSystem Status:', status);

            if (!status.initialized) {
                throw new Error('UnifiedChatSystem initialization failed');
            }
        },

        ensureChatWidgetPatched() {
            if (!window.ChatWidget || !window.ChatWidget.processQuery) {
                console.error('❌ ChatWidget not found!');
                this.createFallbackChatWidget();
                return;
            }

            // Check if it's the unified version
            const queryStr = window.ChatWidget.processQuery.toString();
            
            if (!queryStr.includes('UnifiedChatSystem') && !queryStr.includes('processPipeline')) {
                console.warn('⚠️ ChatWidget not using UnifiedChatSystem, re-patching...');
                this.repatchChatWidget();
            } else {
                console.log('✅ ChatWidget properly patched with UnifiedChatSystem');
            }
        },

        repatchChatWidget() {
            console.log('🔧 Re-patching ChatWidget...');

            window.ChatWidget.processQuery = async (query) => {
                if (!window.UnifiedChatSystem) {
                    return "❌ UnifiedChatSystem not available";
                }

                if (!window.UnifiedChatSystem.state.initialized) {
                    return "⚠️ UnifiedChatSystem is not initialized. Please refresh the page.";
                }

                if (window.UnifiedChatSystem.state.processing) {
                    return "Please wait, I'm still processing your previous request...";
                }

                window.UnifiedChatSystem.state.processing = true;

                try {
                    window.UnifiedChatSystem.state.conversationHistory.push({
                        role: 'user',
                        content: query,
                        timestamp: Date.now()
                    });

                    const response = await window.UnifiedChatSystem.processPipeline(query);

                    window.UnifiedChatSystem.state.conversationHistory.push({
                        role: 'assistant',
                        content: response,
                        timestamp: Date.now()
                    });

                    return response;

                } catch (error) {
                    console.error('❌ Error in unified chat pipeline:', error);
                    return `I encountered an error: ${error.message}. Please try again.`;

                } finally {
                    window.UnifiedChatSystem.state.processing = false;
                }
            };

            console.log('✅ ChatWidget re-patched successfully');
        },

        createFallbackChatWidget() {
            console.log('🔧 Creating fallback ChatWidget...');

            window.ChatWidget = {
                processQuery: async (query) => {
                    if (!window.UnifiedChatSystem) {
                        return "❌ UnifiedChatSystem not loaded. Please ensure unified_chat.js is included in your HTML.";
                    }

                    if (!window.UnifiedChatSystem.state.initialized) {
                        await window.UnifiedChatSystem.init();
                    }

                    return await window.UnifiedChatSystem.processPipeline(query);
                }
            };

            console.log('✅ Fallback ChatWidget created');
        }
    };

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', async () => {
            // Wait a bit for other scripts to load
            setTimeout(async () => {
                try {
                    await ChatInitFix.init();
                } catch (error) {
                    console.error('❌ ChatInitFix failed:', error);
                }
            }, 3000);
        });
    } else {
        setTimeout(async () => {
            try {
                await ChatInitFix.init();
            } catch (error) {
                console.error('❌ ChatInitFix failed:', error);
            }
        }, 3000);
    }

    window.ChatInitFix = ChatInitFix;

    console.log('✅ Unified Chat Initialization Fix loaded');

})();
