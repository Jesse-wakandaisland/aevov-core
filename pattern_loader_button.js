/**
 * PATTERN LOADER & UNIFIED CHAT INTEGRATION
 * Works with unified_chat.js system
 * Keyboard: Ctrl+Shift+C (not M)
 */

(function() {
    'use strict';

    console.log('🔄 Loading Pattern Loader & Unified Chat Integration...');

    const PatternLoaderSystem = {
        loadedPatterns: new Map(),
        chatReady: false,

        /**
         * Initialize the system
         */
        init() {
            console.log('⚡ Initializing Pattern Loader System...');
            
            this.injectLoadPatternsButton();
            this.setupUnifiedChatIntegration();
            this.setupKeyboardShortcuts();
            
            console.log('✅ Pattern Loader System ready');
        },

        /**
         * Inject "Load Patterns" button in Advanced Extraction tab
         */
        injectLoadPatternsButton() {
            const advExtractorTab = document.getElementById('advExtractor');
            
            if (!advExtractorTab) {
                console.warn('⚠️ Advanced Extractor tab not found');
                return;
            }

            const extractButton = advExtractorTab.querySelector('button[onclick*="extractAdvancedPatterns"]');
            
            if (!extractButton) {
                console.warn('⚠️ Extract button not found');
                return;
            }

            const loadPatternContainer = document.createElement('div');
            loadPatternContainer.id = 'loadPatternContainer';
            loadPatternContainer.style.cssText = 'margin-top: 20px; padding: 20px; background: rgba(0, 212, 255, 0.1); border-radius: 12px; border: 2px solid rgba(0, 212, 255, 0.3); display: none;';
            
            loadPatternContainer.innerHTML = `
                <div style="text-align: center; margin-bottom: 15px;">
                    <div style="font-size: 48px; margin-bottom: 10px;">✅</div>
                    <h3 style="color: #00d4ff; margin-bottom: 10px;">Extraction Complete!</h3>
                    <p style="opacity: 0.8; margin-bottom: 15px;">
                        <span id="extractedPatternCount">0</span> patterns extracted successfully
                    </p>
                </div>
                
                <button 
                    class="btn btn-success" 
                    onclick="PatternLoaderSystem.loadPatternsForChat()"
                    style="width: 100%; padding: 15px; font-size: 16px; font-weight: 600;">
                    🔄 Load Patterns for Conversational Chat
                </button>
                
                <div id="loadPatternStatus" style="margin-top: 15px; text-align: center; display: none;">
                    <div style="color: #00d4ff; font-weight: 600;">
                        ⚡ Patterns loaded and ready for chat!
                    </div>
                    <div style="opacity: 0.8; margin-top: 5px;">
                        Press <kbd style="background: rgba(0,0,0,0.5); padding: 3px 8px; border-radius: 4px;">Ctrl+Shift+C</kbd> to open chat
                    </div>
                </div>
            `;

            extractButton.parentNode.insertBefore(loadPatternContainer, extractButton.nextSibling);
            
            console.log('✅ Load Patterns button injected');
        },

        /**
         * Show load patterns button after extraction
         */
        showLoadButton(patternCount) {
            const container = document.getElementById('loadPatternContainer');
            const countSpan = document.getElementById('extractedPatternCount');
            
            if (container && countSpan) {
                countSpan.textContent = patternCount;
                container.style.display = 'block';
                
                container.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        },

        /**
         * Load patterns for chat
         */
        loadPatternsForChat() {
            console.log('🔄 Loading patterns for Unified Chat System...');

            const allPatterns = this.gatherAllPatterns();
            
            if (allPatterns.length === 0) {
                alert('No patterns available to load. Please extract patterns first.');
                return;
            }

            this.loadedPatterns.clear();
            allPatterns.forEach(pattern => {
                if (!pattern.embedding && pattern.keywords) {
                    pattern.embedding = this.createEmbedding(pattern.keywords);
                }
                this.loadedPatterns.set(pattern.id, pattern);
            });

            window.LOADED_CHAT_PATTERNS = Array.from(this.loadedPatterns.values());

            const statusDiv = document.getElementById('loadPatternStatus');
            if (statusDiv) {
                statusDiv.style.display = 'block';
            }

            this.chatReady = true;

            console.log(`✅ Loaded ${allPatterns.length} patterns for Unified Chat`);
            
            if (window.UnifiedChatSystem) {
                window.UnifiedChatSystem.notify('success', 'Patterns Loaded', 
                    `${allPatterns.length} patterns ready for chat. Press Ctrl+Shift+C to start!`);
            }
            
            this.notifyUser(allPatterns.length);
        },

        /**
         * Gather all patterns from all sources
         */
        gatherAllPatterns() {
            const allPatterns = [];

            if (window.patterns) {
                Object.values(window.patterns).forEach(categoryPatterns => {
                    if (Array.isArray(categoryPatterns)) {
                        allPatterns.push(...categoryPatterns);
                    }
                });
            }

            if (window.advancedPatterns) {
                Object.values(window.advancedPatterns).forEach(categoryPatterns => {
                    if (Array.isArray(categoryPatterns)) {
                        allPatterns.push(...categoryPatterns);
                    }
                });
            }

            return allPatterns;
        },

        /**
         * Create embedding for pattern
         */
        createEmbedding(tokens) {
            const embedding = new Array(128).fill(0);
            
            if (typeof tokens === 'string') {
                tokens = [tokens];
            }

            if (Array.isArray(tokens)) {
                tokens.forEach(token => {
                    const str = String(token).toLowerCase();
                    let hash = 0;
                    for (let i = 0; i < str.length; i++) {
                        hash = ((hash << 5) - hash) + str.charCodeAt(i);
                    }
                    const idx = Math.abs(hash) % 128;
                    embedding[idx] += 1.0;
                });
            }

            const magnitude = Math.sqrt(
                embedding.reduce((sum, val) => sum + val * val, 0)
            );

            return magnitude > 0 ? embedding.map(val => val / magnitude) : embedding;
        },

        /**
         * Notify user of successful load
         */
        notifyUser(count) {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #00d4ff, #0099cc);
                color: white;
                padding: 20px;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0, 212, 255, 0.5);
                z-index: 10000;
                animation: slideInRight 0.3s ease-out;
                max-width: 350px;
            `;

            notification.innerHTML = `
                <div style="font-size: 24px; margin-bottom: 10px;">🎉</div>
                <div style="font-weight: 600; font-size: 16px; margin-bottom: 5px;">
                    Chat Ready!
                </div>
                <div style="opacity: 0.9; font-size: 14px;">
                    ${count} patterns loaded for Unified Chat
                </div>
                <div style="margin-top: 10px; opacity: 0.8; font-size: 13px;">
                    Press Ctrl+Shift+C to start chatting
                </div>
            `;

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(() => notification.remove(), 300);
            }, 4000);
        },

        /**
         * Setup Unified Chat integration
         */
        setupUnifiedChatIntegration() {
            if (!window.UnifiedChatSystem) {
                console.warn('⚠️ UnifiedChatSystem not found, will retry...');
                setTimeout(() => this.setupUnifiedChatIntegration(), 1000);
                return;
            }

            console.log('✅ Unified Chat integration ready');
        },

        /**
         * Setup keyboard shortcuts - Ctrl+Shift+C
         */
        setupKeyboardShortcuts() {
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                    e.preventDefault();
                    this.toggleChatModal();
                }
            });

            console.log('✅ Keyboard shortcuts setup (Ctrl+Shift+C)');
        },

        /**
         * Toggle chat modal
         */
        toggleChatModal() {
            const chatWidget = document.getElementById('unifiedChatWidget');
            const chatToggle = document.getElementById('unifiedChatToggle');
            
            if (chatWidget) {
                if (chatWidget.style.display === 'none' || chatWidget.style.display === '') {
                    chatWidget.style.display = 'flex';
                    if (chatToggle) chatToggle.style.display = 'none';
                    const input = document.getElementById('unifiedChatInput');
                    if (input) input.focus();
                } else {
                    chatWidget.style.display = 'none';
                    if (chatToggle) chatToggle.style.display = 'block';
                }
            } else {
                alert('Chat widget not available. The floating chat will be created when you load the Enhanced Chat UI script.');
            }
        }
    };

    window.PatternLoaderSystem = PatternLoaderSystem;

    const originalExtractAdvanced = window.extractAdvancedPatterns;
    if (originalExtractAdvanced) {
        window.extractAdvancedPatterns = async function() {
            const result = await originalExtractAdvanced.apply(this, arguments);
            
            setTimeout(() => {
                const allPatterns = PatternLoaderSystem.gatherAllPatterns();
                PatternLoaderSystem.showLoadButton(allPatterns.length);
            }, 1000);
            
            return result;
        };
    }

    const originalExtractAll = window.extractAllInParent;
    if (originalExtractAll) {
        window.extractAllInParent = async function() {
            const result = await originalExtractAll.apply(this, arguments);
            
            setTimeout(() => {
                const allPatterns = PatternLoaderSystem.gatherAllPatterns();
                PatternLoaderSystem.showLoadButton(allPatterns.length);
            }, 1000);
            
            return result;
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => PatternLoaderSystem.init(), 1500);
        });
    } else {
        setTimeout(() => PatternLoaderSystem.init(), 1500);
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }

        kbd {
            display: inline-block;
            background: rgba(0, 0, 0, 0.5);
            padding: 3px 8px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 13px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
    `;
    document.head.appendChild(style);

    console.log('✅ Pattern Loader & Unified Chat Integration loaded');

})();
