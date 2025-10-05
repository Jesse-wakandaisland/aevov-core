/**
 * COMPLETE SYSTEM INTEGRATION
 * This SINGLE file integrates everything with your EXISTING HTML structure
 * 
 * REPLACES:
 * - initialization_fix.js
 * - unified_init.js  
 * - aevov_unified_integration.js
 * - pattern_loader_system.js
 * - enhanced_chat_engine.js
 * 
 * Load AFTER: unified_chat.js, dynamic_keyword_extractor.js
 * Load BEFORE: Nothing (this goes last!)
 */

(function() {
    'use strict';

    console.log('🎯 Loading Complete System Integration...');

    const SystemIntegration = {
        state: {
            initialized: false,
            chatWidgetCreated: false,
            keywordsEnabled: false,
            loadButtonInjected: false
        },

        async init() {
            console.log('⚡ Starting Complete System Integration...');

            try {
                // PHASE 1: Create ChatWidget from existing inline functions
                this.phase1_WrapExistingFunctions();

                // PHASE 2: Initialize UnifiedChatSystem (now ChatWidget exists!)
                await this.phase2_InitUnifiedSystem();

                // PHASE 3: Enhance existing sendMessage with UnifiedChatSystem
                this.phase3_EnhanceSendMessage();

                // PHASE 4: Setup dynamic keyword extraction
                await this.phase4_SetupKeywordExtraction();

                // PHASE 5: Hook pattern extraction to auto-enhance keywords
                this.phase5_HookPatternExtraction();

                // PHASE 6: Inject load button system
                this.phase6_InjectLoadButton();

                // PHASE 7: Add floating chat UI
                this.phase7_AddFloatingChat();

                // PHASE 8: Setup keyboard shortcuts
                this.phase8_SetupKeyboard();

                this.state.initialized = true;
                console.log('✅ Complete System Integration Ready!');
                
                this.showNotification('✅ System Ready', 'All systems integrated successfully!');

            } catch (error) {
                console.error('❌ Integration failed:', error);
                this.showNotification('❌ Integration Failed', error.message);
            }
        },

        /**
         * PHASE 1: Wrap existing inline functions into ChatWidget object
         */
        phase1_WrapExistingFunctions() {
            console.log('📦 Phase 1: Wrapping existing functions into ChatWidget...');

            // Store reference to existing sendMessage
            const originalSendMessage = window.sendMessage;
            const originalMatchPatterns = window.matchPatterns;

            // Create ChatWidget object from existing functions
            window.ChatWidget = {
                // Wrap existing sendMessage
                sendMessage: originalSendMessage,

                // Create processQuery from matchPatterns
                processQuery: (query) => {
                    if (!originalMatchPatterns) {
                        return "Pattern matching not available. Please ensure all scripts are loaded.";
                    }

                    const result = originalMatchPatterns(query, 5);

                    if (!result.success) {
                        return result.message || "No patterns available.";
                    }

                    // Format response from pattern match
                    const match = result.topMatch || result.matches[0];
                    if (!match) {
                        return "No matching patterns found.";
                    }

                    const pattern = match.pattern;
                    const confidence = (match.confidence * 100).toFixed(1);

                    let response = `**Match Found** (${confidence}% confidence)\n\n`;
                    
                    if (pattern.template) {
                        try {
                            response += `\`\`\`\n${atob(pattern.template)}\n\`\`\`\n\n`;
                        } catch (e) {
                            response += `\`\`\`\n${pattern.template}\n\`\`\`\n\n`;
                        }
                    }

                    response += `**Pattern:** ${pattern.categoryName || pattern.id}\n`;
                    if (pattern.keywords) {
                        response += `**Keywords:** ${pattern.keywords.slice(0, 10).join(', ')}\n`;
                    }

                    return response;
                },

                // Reference to pattern databases
                getPatterns: () => {
                    const all = [];
                    if (window.patterns) {
                        Object.values(window.patterns).forEach(p => {
                            if (Array.isArray(p)) all.push(...p);
                        });
                    }
                    if (window.advancedPatterns) {
                        Object.values(window.advancedPatterns).forEach(p => {
                            if (Array.isArray(p)) all.push(...p);
                        });
                    }
                    return all;
                }
            };

            this.state.chatWidgetCreated = true;
            console.log('  ✅ ChatWidget created from existing functions');
        },

        /**
         * PHASE 2: Initialize UnifiedChatSystem
         */
        async phase2_InitUnifiedSystem() {
            console.log('📦 Phase 2: Initializing UnifiedChatSystem...');

            // Wait for UnifiedChatSystem to exist
            let attempts = 0;
            while (!window.UnifiedChatSystem && attempts < 30) {
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }

            if (!window.UnifiedChatSystem) {
                console.warn('  ⚠️ UnifiedChatSystem not found, skipping...');
                return;
            }

            // Initialize it (ChatWidget now exists!)
            if (!window.UnifiedChatSystem.state.initialized) {
                try {
                    await window.UnifiedChatSystem.init();
                    console.log('  ✅ UnifiedChatSystem initialized');
                } catch (error) {
                    console.warn('  ⚠️ UnifiedChatSystem init failed:', error);
                }
            }
        },

        /**
         * PHASE 3: Enhance existing sendMessage
         */
        phase3_EnhanceSendMessage() {
            console.log('📦 Phase 3: Enhancing sendMessage function...');

            const originalSendMessage = window.sendMessage;

            window.sendMessage = function() {
                // Call original
                if (originalSendMessage) {
                    originalSendMessage();
                }

                // Trigger UnifiedChatSystem if available
                const input = document.getElementById('chatInput');
                if (input && window.UnifiedChatSystem && window.UnifiedChatSystem.processPipeline) {
                    const query = input.value.trim();
                    if (query) {
                        // Process in background for unified system
                        window.UnifiedChatSystem.processPipeline(query).catch(console.error);
                    }
                }
            };

            console.log('  ✅ sendMessage enhanced');
        },

        /**
         * PHASE 4: Setup dynamic keyword extraction
         */
        async phase4_SetupKeywordExtraction() {
            console.log('📦 Phase 4: Setting up dynamic keyword extraction...');

            // Wait for DynamicKeywordExtractor
            let attempts = 0;
            while (!window.DynamicKeywordExtractor && attempts < 30) {
                await new Promise(resolve => setTimeout(resolve), 100);
                attempts++;
            }

            if (!window.DynamicKeywordExtractor) {
                console.warn('  ⚠️ DynamicKeywordExtractor not found');
                return;
            }

            // Create enhancement function
            window.enhancePatternKeywords = (pattern, category = 'general') => {
                if (!pattern || pattern._enhanced) return pattern;

                try {
                    let keywords = [];

                    // Get domain keywords
                    keywords.push(...window.DynamicKeywordExtractor.getDomainKeywords(category));

                    // Add entropy-based keywords
                    if (pattern.metadata?.entropy !== undefined) {
                        keywords.push(...window.DynamicKeywordExtractor.mapEntropyToKeywords(pattern.metadata.entropy));
                    }

                    // Add type and category keywords
                    if (pattern.type) {
                        keywords.push(pattern.type, `${pattern.type}_pattern`, `${pattern.type}_based`);
                    }
                    if (pattern.category) {
                        keywords.push(pattern.category, `${pattern.category}_type`);
                    }
                    if (pattern.categoryName) {
                        keywords.push(pattern.categoryName, `${pattern.categoryName}_category`);
                    }

                    // Merge with existing
                    if (pattern.keywords && Array.isArray(pattern.keywords)) {
                        keywords.push(...pattern.keywords);
                    }

                    // Expand with synonyms
                    if (window.DynamicKeywordExtractor.config.useSynonyms) {
                        const expanded = [];
                        keywords.forEach(kw => {
                            const lower = kw.toLowerCase();
                            if (window.DynamicKeywordExtractor.synonyms[lower]) {
                                expanded.push(...window.DynamicKeywordExtractor.synonyms[lower]);
                            }
                        });
                        keywords.push(...expanded);
                    }

                    // Filter and deduplicate
                    keywords = [...new Set(keywords.map(k => k.toLowerCase()))];
                    keywords = window.DynamicKeywordExtractor.filterAndRank(keywords);

                    // Limit
                    const maxKeywords = window.DynamicKeywordExtractor.config.maxKeywordsPerPattern || 500;
                    pattern.keywords = keywords.slice(0, maxKeywords);
                    pattern._enhanced = true;
                    pattern._keywordCount = pattern.keywords.length;

                    // Create/update embedding
                    if (!pattern.embedding) {
                        pattern.embedding = this.createEmbedding(pattern.keywords);
                    }

                    return pattern;
                } catch (error) {
                    console.warn('Failed to enhance pattern:', error);
                    return pattern;
                }
            };

            this.state.keywordsEnabled = true;
            console.log('  ✅ Dynamic keyword extraction ready');
        },

        /**
         * PHASE 5: Hook pattern extraction
         */
        phase5_HookPatternExtraction() {
            console.log('📦 Phase 5: Hooking pattern extraction functions...');

            // Hook extractAdvancedPatterns
            if (window.extractAdvancedPatterns) {
                const original = window.extractAdvancedPatterns;

                window.extractAdvancedPatterns = async function(...args) {
                    console.log('🔬 Extracting patterns with auto-enhancement...');

                    const result = await original.apply(this, args);

                    // Auto-enhance all extracted patterns
                    setTimeout(() => {
                        SystemIntegration.enhanceAllPatterns();
                        SystemIntegration.showLoadButton();
                    }, 500);

                    return result;
                };

                console.log('  ✅ extractAdvancedPatterns hooked');
            }

            // Hook extractAllInParent
            if (window.extractAllInParent) {
                const original = window.extractAllInParent;

                window.extractAllInParent = async function(...args) {
                    console.log('🔬 Batch extracting patterns with auto-enhancement...');

                    const result = await original.apply(this, args);

                    // Auto-enhance all extracted patterns
                    setTimeout(() => {
                        SystemIntegration.enhanceAllPatterns();
                        SystemIntegration.showLoadButton();
                    }, 500);

                    return result;
                };

                console.log('  ✅ extractAllInParent hooked');
            }

            console.log('  ✅ Pattern extraction hooks installed');
        },

        /**
         * Enhance all existing patterns
         */
        enhanceAllPatterns() {
            console.log('🔄 Enhancing all patterns with keywords...');

            let count = 0;

            if (window.advancedPatterns) {
                Object.keys(window.advancedPatterns).forEach(category => {
                    const patterns = window.advancedPatterns[category];
                    if (Array.isArray(patterns)) {
                        patterns.forEach(p => {
                            window.enhancePatternKeywords(p, category);
                            count++;
                        });
                    }
                });
            }

            if (window.patterns) {
                Object.keys(window.patterns).forEach(domain => {
                    const patterns = window.patterns[domain];
                    if (Array.isArray(patterns)) {
                        patterns.forEach(p => {
                            window.enhancePatternKeywords(p, domain);
                            count++;
                        });
                    }
                });
            }

            console.log(`✅ Enhanced ${count} patterns`);

            // Show sample
            if (count > 0) {
                const sample = window.advancedPatterns ? 
                    Object.values(window.advancedPatterns)[0]?.[0] :
                    Object.values(window.patterns)[0]?.[0];

                if (sample) {
                    console.log(`📝 Sample: ${sample.id} has ${sample.keywords?.length || 0} keywords`);
                }
            }
        },

        /**
         * PHASE 6: Inject load button
         */
        phase6_InjectLoadButton() {
            console.log('📦 Phase 6: Injecting load pattern button...');

            const advTab = document.getElementById('advExtractor') || 
                          document.getElementById('advancedExtractor');

            if (!advTab) {
                console.warn('  ⚠️ Advanced Extractor tab not found');
                return;
            }

            // Find a button to insert after
            const buttons = advTab.querySelectorAll('button');
            const extractButton = Array.from(buttons).find(b => 
                b.textContent.includes('Extract') || 
                b.onclick?.toString().includes('extract')
            );

            if (!extractButton) {
                console.warn('  ⚠️ Extract button not found');
                return;
            }

            // Create container
            const container = document.createElement('div');
            container.id = 'systemLoadPatternContainer';
            container.style.cssText = `
                margin-top: 20px;
                padding: 20px;
                background: rgba(0, 212, 255, 0.1);
                border-radius: 12px;
                border: 2px solid rgba(0, 212, 255, 0.3);
                display: none;
            `;

            container.innerHTML = `
                <div style="text-align: center; margin-bottom: 15px;">
                    <div style="font-size: 48px; margin-bottom: 10px;">✅</div>
                    <h3 style="color: #00d4ff; margin-bottom: 10px;">Extraction Complete!</h3>
                    <p style="opacity: 0.8; margin-bottom: 10px;">
                        <span id="systemPatternCount">0</span> patterns extracted
                        <br>
                        <span id="systemKeywordInfo" style="font-size: 14px; opacity: 0.7;"></span>
                    </p>
                </div>
                
                <button 
                    onclick="SystemIntegration.loadPatternsForChat()"
                    class="btn btn-success"
                    style="width: 100%; padding: 15px; font-size: 16px; font-weight: 600; background: linear-gradient(135deg, #00d4ff, #0099cc); border: none; color: white; border-radius: 8px; cursor: pointer;">
                    🔄 Load Patterns for Chat
                </button>
                
                <div id="systemLoadStatus" style="margin-top: 15px; text-align: center; display: none;">
                    <div style="color: #00d4ff; font-weight: 600; margin-bottom: 5px;">
                        ⚡ Patterns Loaded!
                    </div>
                    <div style="opacity: 0.8; font-size: 14px;">
                        Press <kbd style="background: rgba(0,0,0,0.5); padding: 3px 8px; border-radius: 4px; font-family: monospace;">Ctrl+Shift+C</kbd> to open chat
                    </div>
                </div>
            `;

            extractButton.parentNode.insertBefore(container, extractButton.nextSibling);

            this.state.loadButtonInjected = true;
            console.log('  ✅ Load button injected');
        },

        /**
         * Show load button
         */
        showLoadButton() {
            const container = document.getElementById('systemLoadPatternContainer');
            if (!container) return;

            const patterns = this.getAllPatterns();
            const count = patterns.length;

            if (count === 0) return;

            // Calculate keyword stats
            let totalKeywords = 0;
            let enhancedCount = 0;

            patterns.forEach(p => {
                if (p.keywords) totalKeywords += p.keywords.length;
                if (p._enhanced) enhancedCount++;
            });

            const avgKeywords = Math.floor(totalKeywords / count);

            // Update display
            document.getElementById('systemPatternCount').textContent = count;
            document.getElementById('systemKeywordInfo').textContent = 
                `${enhancedCount} enhanced • Avg ${avgKeywords} keywords/pattern`;

            container.style.display = 'block';
            container.scrollIntoView({ behavior: 'smooth', block: 'center' });

            console.log(`✅ Load button shown: ${count} patterns, ${avgKeywords} avg keywords`);
        },

        /**
         * Load patterns for chat
         */
        loadPatternsForChat() {
            console.log('🔄 Loading patterns for chat...');

            const patterns = this.getAllPatterns();

            if (patterns.length === 0) {
                alert('No patterns available. Extract patterns first.');
                return;
            }

            // Ensure all have embeddings
            patterns.forEach(p => {
                if (!p.embedding && p.keywords) {
                    p.embedding = this.createEmbedding(p.keywords);
                }
            });

            window.LOADED_CHAT_PATTERNS = patterns;

            // Show status
            const statusDiv = document.getElementById('systemLoadStatus');
            if (statusDiv) {
                statusDiv.style.display = 'block';
            }

            this.showNotification('🎉 Patterns Loaded!', 
                `${patterns.length} patterns ready for chat. Press Ctrl+Shift+C!`);

            console.log(`✅ Loaded ${patterns.length} patterns for chat`);
        },

        /**
         * Get all patterns
         */
        getAllPatterns() {
            const all = [];

            if (window.patterns) {
                Object.values(window.patterns).forEach(p => {
                    if (Array.isArray(p)) all.push(...p);
                });
            }

            if (window.advancedPatterns) {
                Object.values(window.advancedPatterns).forEach(p => {
                    if (Array.isArray(p)) all.push(...p);
                });
            }

            return all;
        },

        /**
         * Create embedding
         */
        createEmbedding(tokens) {
            const embedding = new Array(128).fill(0);
            
            if (typeof tokens === 'string') tokens = [tokens];

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
         * PHASE 7: Add floating chat UI
         */
        phase7_AddFloatingChat() {
            console.log('📦 Phase 7: Adding floating chat UI...');

            // Check if already exists
            if (document.getElementById('systemFloatingChat')) {
                console.log('  ✅ Chat UI already exists');
                return;
            }

            const widget = document.createElement('div');
            widget.id = 'systemFloatingChat';
            widget.style.cssText = `
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 420px;
                height: 650px;
                background: linear-gradient(135deg, #1a1a2e, #16213e);
                border-radius: 20px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                display: none;
                flex-direction: column;
                z-index: 9999;
                border: 1px solid rgba(0, 212, 255, 0.3);
            `;

            widget.innerHTML = `
                <div style="padding: 20px; background: linear-gradient(135deg, #00d4ff, #0099cc); border-radius: 20px 20px 0 0; color: white; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-weight: 600; font-size: 18px;">💬 Aevov Chat</div>
                        <div style="opacity: 0.9; font-size: 12px;" id="systemChatStatus">Ready</div>
                    </div>
                    <button onclick="SystemIntegration.toggleChat()" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 18px;">✕</button>
                </div>

                <div id="systemChatMessages" style="flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 15px;">
                    <div style="background: rgba(0, 212, 255, 0.1); padding: 15px; border-radius: 12px; border-left: 3px solid #00d4ff;">
                        <div style="font-weight: 600; margin-bottom: 8px;">👋 Welcome!</div>
                        <div style="opacity: 0.9; font-size: 14px; line-height: 1.5;">
                            I'm your AI assistant powered by extracted patterns. Load patterns and ask me anything!
                        </div>
                    </div>
                </div>

                <div style="padding: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
                    <div style="display: flex; gap: 10px;">
                        <input 
                            type="text" 
                            id="systemChatInput" 
                            placeholder="Ask me anything..." 
                            style="flex: 1; padding: 12px; background: rgba(0,0,0,0.3); border: 1px solid rgba(0,212,255,0.3); border-radius: 8px; color: white; outline: none;"
                            onkeypress="if(event.key === 'Enter') SystemIntegration.sendChatMessage()"
                        />
                        <button 
                            onclick="SystemIntegration.sendChatMessage()" 
                            style="background: linear-gradient(135deg, #00d4ff, #0099cc); border: none; color: white; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                            Send
                        </button>
                    </div>
                    <div style="margin-top: 10px; text-align: center; opacity: 0.6; font-size: 11px;">
                        Press Ctrl+Shift+C to toggle
                    </div>
                </div>
            `;

            document.body.appendChild(widget);

            // Create toggle button
            const btn = document.createElement('button');
            btn.id = 'systemChatToggle';
            btn.style.cssText = `
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #00d4ff, #0099cc);
                border: none;
                border-radius: 50%;
                color: white;
                font-size: 28px;
                cursor: pointer;
                box-shadow: 0 8px 24px rgba(0, 212, 255, 0.4);
                z-index: 9998;
                transition: transform 0.3s ease;
            `;
            btn.innerHTML = '💬';
            btn.onclick = () => this.toggleChat();
            btn.onmouseenter = () => btn.style.transform = 'scale(1.1)';
            btn.onmouseleave = () => btn.style.transform = 'scale(1)';

            document.body.appendChild(btn);

            console.log('  ✅ Floating chat UI added');
        },

        /**
         * Toggle chat
         */
        toggleChat() {
            const widget = document.getElementById('systemFloatingChat');
            const btn = document.getElementById('systemChatToggle');

            if (widget.style.display === 'none' || widget.style.display === '') {
                widget.style.display = 'flex';
                btn.style.display = 'none';
                document.getElementById('systemChatInput')?.focus();

                // Update status
                const patterns = window.LOADED_CHAT_PATTERNS || this.getAllPatterns();
                const statusEl = document.getElementById('systemChatStatus');
                if (statusEl) {
                    statusEl.textContent = patterns.length > 0 ? 
                        `${patterns.length} patterns loaded` : 
                        'Load patterns first';
                }
            } else {
                widget.style.display = 'none';
                btn.style.display = 'block';
            }
        },

        /**
         * Send chat message
         */
        async sendChatMessage() {
            const input = document.getElementById('systemChatInput');
            const query = input?.value.trim();

            if (!query) return;

            this.addChatMessage('user', query);
            input.value = '';

            const thinking = this.addChatMessage('assistant', '🤔 Thinking...');

            try {
                let response;

                // Try UnifiedChatSystem first
                if (window.UnifiedChatSystem && window.UnifiedChatSystem.processPipeline) {
                    response = await window.UnifiedChatSystem.processPipeline(query);
                }
                // Then try ChatWidget.processQuery
                else if (window.ChatWidget && window.ChatWidget.processQuery) {
                    response = await window.ChatWidget.processQuery(query);
                }
                // Fallback to matchPatterns
                else if (window.matchPatterns) {
                    const result = window.matchPatterns(query, 3);
                    if (result.success && result.topMatch) {
                        const match = result.topMatch;
                        response = `**Found:** ${match.pattern.categoryName || match.pattern.id}\n`;
                        response += `**Confidence:** ${(match.confidence * 100).toFixed(1)}%\n\n`;
                        if (match.pattern.keywords) {
                            response += `**Keywords:** ${match.pattern.keywords.slice(0, 10).join(', ')}`;
                        }
                    } else {
                        response = result.message || "No matches found.";
                    }
                } else {
                    response = "Chat system not available. Please ensure all scripts are loaded.";
                }

                const container = document.getElementById('systemChatMessages');
                if (thinking && container) {
                    container.removeChild(thinking);
                }

                this.addChatMessage('assistant', response);

            } catch (error) {
                console.error('Chat error:', error);
                const container = document.getElementById('systemChatMessages');
                if (thinking && container) {
                    container.removeChild(thinking);
                }
                this.addChatMessage('assistant', `Error: ${error.message}`);
            }
        },

        /**
         * Add chat message
         */
        addChatMessage(role, content) {
            const container = document.getElementById('systemChatMessages');
            if (!container) return null;

            const msg = document.createElement('div');

            if (role === 'user') {
                msg.style.cssText = `
                    background: linear-gradient(135deg, #00d4ff, #0099cc);
                    padding: 12px 16px;
                    border-radius: 12px;
                    color: white;
                    max-width: 80%;
                    align-self: flex-end;
                    margin-left: auto;
                    word-wrap: break-word;
                `;
            } else {
                msg.style.cssText = `
                    background: rgba(255, 255, 255, 0.05);
                    padding: 12px 16px;
                    border-radius: 12px;
                    border-left: 3px solid #00d4ff;
                    max-width: 85%;
                    word-wrap: break-word;
                    line-height: 1.6;
                `;
            }

            const formatted = content
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br>')
                .replace(/```([\s\S]*?)```/g, '<pre style="background: #1e1e1e; padding: 12px; border-radius: 6px; overflow-x: auto; margin: 8px 0;"><code>$1</code></pre>')
                .replace(/`([^`]+)`/g, '<code style="background: rgba(0,212,255,0.2); padding: 2px 6px; border-radius: 4px;">$1</code>');

            msg.innerHTML = formatted;
            container.appendChild(msg);
            container.scrollTop = container.scrollHeight;

            return msg;
        },

        /**
         * PHASE 8: Setup keyboard shortcuts
         */
        phase8_SetupKeyboard() {
            console.log('📦 Phase 8: Setting up keyboard shortcuts...');

            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                    e.preventDefault();
                    this.toggleChat();
                }
            });

            console.log('  ✅ Ctrl+Shift+C keyboard shortcut ready');
        },

        /**
         * Show notification
         */
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
                z-index: 10000;
                max-width: 350px;
                animation: slideIn 0.3s ease-out;
            `;

            notif.innerHTML = `
                <div style="font-weight: 600; font-size: 16px; margin-bottom: 5px;">${title}</div>
                <div style="opacity: 0.9; font-size: 14px;">${message}</div>
            `;

            document.body.appendChild(notif);

            setTimeout(() => {
                notif.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => notif.remove(), 300);
            }, 4000);
        }
    };

    // Export to window
    window.SystemIntegration = SystemIntegration;

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => SystemIntegration.init(), 1500);
        });
    } else {
        setTimeout(() => SystemIntegration.init(), 1500);
    }

    // Add CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(400px); opacity: 0; }
        }
        #systemChatMessages::-webkit-scrollbar {
            width: 6px;
        }
        #systemChatMessages::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.2);
            border-radius: 3px;
        }
        #systemChatMessages::-webkit-scrollbar-thumb {
            background: rgba(0,212,255,0.5);
            border-radius: 3px;
        }
    `;
    document.head.appendChild(style);

    console.log('✅ Complete System Integration loaded');

})();
