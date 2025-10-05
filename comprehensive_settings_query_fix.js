/**
 * COMPREHENSIVE SETTINGS + QUERY ENGINE + CHAT FIX
 */

(function() {
    'use strict';

    // ========================================
    // PART 1: DOCK CONTEXT MENU & SETTINGS
    // ========================================

    const SettingsSystem = {
        init() {
            this.hookDockSettings();
            this.createSettingsPanel();
        },

        hookDockSettings() {
            // Replace dock settings click with context menu
            setTimeout(() => {
                const settingsIcon = document.querySelector('[data-action="settings"]');
                if (!settingsIcon) return;

                settingsIcon.onclick = (e) => {
                    e.stopPropagation();
                    this.showContextMenu(e);
                };
            }, 1000);
        },

        showContextMenu(event) {
            // Remove existing menu
            const existing = document.getElementById('dockContextMenu');
            if (existing) existing.remove();

            const menu = document.createElement('div');
            menu.id = 'dockContextMenu';
            menu.innerHTML = `
                <div class="context-menu-item" onclick="window.SettingsSystem.openFullSettings()">
                    ⚙️ Open Settings Panel
                </div>
                <div class="context-menu-item" onclick="window.SettingsSystem.moveDock()">
                    📍 Move Dock Position
                </div>
                <div class="context-menu-divider"></div>
                <div class="context-menu-item" onclick="window.WorkflowTester.open()">
                    🔬 Workflow Tester
                </div>
                <div class="context-menu-item" onclick="window.SettingsSystem.showAbout()">
                    ℹ️ About AEVOV
                </div>
            `;

            const style = document.createElement('style');
            style.innerHTML = `
                #dockContextMenu {
                    position: fixed;
                    background: rgba(26, 26, 46, 0.98);
                    border: 2px solid #00d4ff;
                    border-radius: 8px;
                    padding: 8px;
                    z-index: 9999999;
                    min-width: 200px;
                    backdrop-filter: blur(10px);
                }

                .context-menu-item {
                    padding: 10px 15px;
                    color: white;
                    cursor: pointer;
                    border-radius: 4px;
                    font-size: 14px;
                    transition: background 0.2s;
                }

                .context-menu-item:hover {
                    background: rgba(0, 212, 255, 0.2);
                }

                .context-menu-divider {
                    height: 1px;
                    background: rgba(255, 255, 255, 0.1);
                    margin: 5px 0;
                }
            `;
            document.head.appendChild(style);

            // Position menu near cursor
            menu.style.left = event.clientX + 'px';
            menu.style.top = event.clientY + 'px';

            document.body.appendChild(menu);

            // Close on click outside
            setTimeout(() => {
                document.addEventListener('click', () => menu.remove(), { once: true });
            }, 100);
        },

        createSettingsPanel() {
            const panel = document.createElement('div');
            panel.id = 'settingsPanel';
            panel.innerHTML = `
                <div class="settings-overlay" onclick="window.SettingsSystem.closeSettings()"></div>
                <div class="settings-container">
                    <div class="settings-header">
                        <h2>⚙️ AEVOV Settings</h2>
                        <button onclick="window.SettingsSystem.closeSettings()">✕</button>
                    </div>
                    <div class="settings-tabs">
                        <button class="tab-btn active" onclick="window.SettingsSystem.switchTab('general')">General</button>
                        <button class="tab-btn" onclick="window.SettingsSystem.switchTab('search')">Search</button>
                        <button class="tab-btn" onclick="window.SettingsSystem.switchTab('database')">Database</button>
                        <button class="tab-btn" onclick="window.SettingsSystem.switchTab('performance')">Performance</button>
                    </div>
                    <div class="settings-content">
                        <div id="tab-general" class="tab-content active">
                            <h3>General Settings</h3>
                            <label class="setting-row">
                                <span>Enable Semantic Search</span>
                                <input type="checkbox" id="setting-semantic" checked onchange="window.SettingsSystem.saveSetting('semantic', this.checked)">
                            </label>
                            <label class="setting-row">
                                <span>Enable NLP Processing</span>
                                <input type="checkbox" id="setting-nlp" checked onchange="window.SettingsSystem.saveSetting('nlp', this.checked)">
                            </label>
                            <label class="setting-row">
                                <span>Enable ARMsquare Reasoning</span>
                                <input type="checkbox" id="setting-armsquare" checked onchange="window.SettingsSystem.saveSetting('armsquare', this.checked)">
                            </label>
                            <label class="setting-row">
                                <span>Auto-extract queries as patterns</span>
                                <input type="checkbox" id="setting-auto-extract" checked onchange="window.SettingsSystem.saveSetting('autoExtract', this.checked)">
                            </label>
                        </div>
                        <div id="tab-search" class="tab-content">
                            <h3>Search Settings</h3>
                            <label class="setting-row">
                                <span>Keyword Weight (%)</span>
                                <input type="range" min="0" max="100" value="60" onchange="window.SettingsSystem.saveSetting('keywordWeight', this.value/100)">
                                <span id="keywordWeightValue">60%</span>
                            </label>
                            <label class="setting-row">
                                <span>Semantic Weight (%)</span>
                                <input type="range" min="0" max="100" value="40" onchange="window.SettingsSystem.saveSetting('semanticWeight', this.value/100)">
                                <span id="semanticWeightValue">40%</span>
                            </label>
                            <label class="setting-row">
                                <span>Minimum Confidence Threshold</span>
                                <input type="range" min="0" max="100" value="30" onchange="window.SettingsSystem.saveSetting('minConfidence', this.value/100)">
                                <span id="minConfidenceValue">30%</span>
                            </label>
                        </div>
                        <div id="tab-database" class="tab-content">
                            <h3>Database Settings</h3>
                            <label class="setting-row">
                                <span>Enable Database Caching</span>
                                <input type="checkbox" id="setting-db-cache" checked>
                            </label>
                            <label class="setting-row">
                                <span>Auto-sync to Cubbit</span>
                                <input type="checkbox" id="setting-auto-sync" checked>
                            </label>
                            <label class="setting-row">
                                <span>Compression Level</span>
                                <select onchange="window.SettingsSystem.saveSetting('compression', this.value)">
                                    <option value="low">Low (Fast)</option>
                                    <option value="medium" selected>Medium</option>
                                    <option value="high">High (Slow)</option>
                                </select>
                            </label>
                        </div>
                        <div id="tab-performance" class="tab-content">
                            <h3>Performance Settings</h3>
                            <label class="setting-row">
                                <span>Max Concurrent Workers</span>
                                <input type="number" min="1" max="8" value="4" onchange="window.SettingsSystem.saveSetting('maxWorkers', this.value)">
                            </label>
                            <label class="setting-row">
                                <span>Cache Size Limit (MB)</span>
                                <input type="number" min="10" max="1000" value="100" onchange="window.SettingsSystem.saveSetting('cacheLimit', this.value)">
                            </label>
                            <button onclick="window.SettingsSystem.clearAllCaches()" style="margin-top: 10px; padding: 10px; background: #ff6b6b; color: white; border: none; border-radius: 6px; cursor: pointer; width: 100%;">
                                🗑️ Clear All Caches
                            </button>
                        </div>
                    </div>
                </div>
            `;

            const style = document.createElement('style');
            style.innerHTML = `
                #settingsPanel {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 999999;
                }

                .settings-overlay {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                }

                .settings-container {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 600px;
                    max-width: 90%;
                    max-height: 80vh;
                    background: linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%);
                    border: 2px solid #00d4ff;
                    border-radius: 15px;
                    overflow: hidden;
                }

                .settings-header {
                    background: linear-gradient(135deg, #00d4ff 0%, #3a47d5 100%);
                    padding: 15px 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .settings-header h2 {
                    margin: 0;
                    color: white;
                    font-size: 18px;
                }

                .settings-header button {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 24px;
                    cursor: pointer;
                }

                .settings-tabs {
                    display: flex;
                    background: rgba(0, 0, 0, 0.3);
                    padding: 0;
                }

                .tab-btn {
                    flex: 1;
                    padding: 12px;
                    background: none;
                    border: none;
                    color: rgba(255, 255, 255, 0.6);
                    cursor: pointer;
                    font-size: 14px;
                    border-bottom: 2px solid transparent;
                }

                .tab-btn:hover {
                    background: rgba(255, 255, 255, 0.05);
                }

                .tab-btn.active {
                    color: #00d4ff;
                    border-bottom-color: #00d4ff;
                }

                .settings-content {
                    padding: 20px;
                    max-height: 60vh;
                    overflow-y: auto;
                    color: white;
                }

                .tab-content {
                    display: none;
                }

                .tab-content.active {
                    display: block;
                }

                .tab-content h3 {
                    color: #00d4ff;
                    margin-top: 0;
                }

                .setting-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 0;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .setting-row span:first-child {
                    font-size: 14px;
                }

                .setting-row input[type="checkbox"] {
                    width: 20px;
                    height: 20px;
                    cursor: pointer;
                }

                .setting-row input[type="range"] {
                    flex: 1;
                    margin: 0 15px;
                }

                .setting-row select {
                    padding: 6px;
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: white;
                    border-radius: 4px;
                }
            `;
            document.head.appendChild(style);
            document.body.appendChild(panel);
        },

        openFullSettings() {
            document.getElementById('settingsPanel').style.display = 'block';
        },

        closeSettings() {
            document.getElementById('settingsPanel').style.display = 'none';
        },

        switchTab(tabName) {
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            event.target.classList.add('active');
            document.getElementById(`tab-${tabName}`).classList.add('active');
        },

        saveSetting(key, value) {
            const settings = JSON.parse(localStorage.getItem('aevov_settings') || '{}');
            settings[key] = value;
            localStorage.setItem('aevov_settings', JSON.stringify(settings));
            console.log(`Setting saved: ${key} = ${value}`);
        },

        moveDock() {
            if (window.AevovDock?.showSettings) {
                window.AevovDock.showSettings();
            }
        },

        clearAllCaches() {
            if (confirm('Clear all caches? This cannot be undone.')) {
                localStorage.clear();
                if (window.AevovCache) window.AevovCache.clear();
                if (window.SemanticSearch) window.SemanticSearch.state.embeddings.clear();
                alert('All caches cleared');
                location.reload();
            }
        },

        showAbout() {
            alert('AEVOV Pattern System v2.0\n\nAetherally Enigmatic Vertex Of Voids\n\nAdvanced pattern recognition with ARMsquare reasoning');
        }
    };

    // ========================================
    // PART 2: SOPHISTICATED QUERY ENGINE
    // ========================================

    const QueryEngine = {
        init() {
            console.log('⚡ Initializing Query Engine...');
            this.extractedQueries = [];
            this.hookChatSystems();
        },

        extractQueryFeatures(query) {
            if (!window.nlp) {
                console.warn('Compromise NLP not available');
                return this.basicExtraction(query);
            }

            const doc = nlp(query);

            return {
                original: query,
                entities: {
                    people: doc.people().out('array'),
                    places: doc.places().out('array'),
                    organizations: doc.organizations().out('array'),
                    topics: doc.topics().out('array')
                },
                intent: this.detectIntent(doc),
                keywords: this.extractKeywords(doc),
                questionType: this.detectQuestionType(query),
                complexity: this.calculateComplexity(doc)
            };
        },

        detectIntent(doc) {
            const text = doc.out('text').toLowerCase();
            
            if (/^(what|who|where|when|why|how)/.test(text)) return 'question';
            if (/^(create|build|make|generate)/.test(text)) return 'creation';
            if (/^(explain|describe|define)/.test(text)) return 'explanation';
            if (/^(compare|difference|vs)/.test(text)) return 'comparison';
            if (/^(find|search|look)/.test(text)) return 'search';
            
            return 'general';
        },

        extractKeywords(doc) {
            const nouns = doc.nouns().out('array');
            const verbs = doc.verbs().toInfinitive().out('array');
            const adjectives = doc.adjectives().out('array');
            
            return [...new Set([...nouns, ...verbs, ...adjectives])];
        },

        detectQuestionType(query) {
            const q = query.toLowerCase();
            if (q.startsWith('what')) return 'definition';
            if (q.startsWith('how')) return 'process';
            if (q.startsWith('why')) return 'reason';
            if (q.startsWith('where')) return 'location';
            if (q.startsWith('when')) return 'time';
            if (q.startsWith('who')) return 'person';
            if (q.includes('difference')) return 'comparison';
            return 'unknown';
        },

        calculateComplexity(doc) {
            const words = doc.terms().out('array');
            const sentences = doc.sentences().out('array');
            return {
                wordCount: words.length,
                sentenceCount: sentences.length,
                avgWordsPerSentence: words.length / Math.max(sentences.length, 1)
            };
        },

        basicExtraction(query) {
            const words = query.toLowerCase().split(/\s+/);
            return {
                original: query,
                keywords: words.filter(w => w.length > 3),
                intent: 'general',
                questionType: 'unknown',
                complexity: { wordCount: words.length }
            };
        },

        async saveQueryAsPattern(query, features) {
            const pattern = {
                id: `query_${Date.now()}`,
                query: query,
                keywords: features.keywords,
                category: 'extracted_queries',
                categoryName: 'Extracted Queries',
                intent: features.intent,
                questionType: features.questionType,
                confidence: 0.8,
                timestamp: Date.now()
            };

            this.extractedQueries.push(pattern);

            // Add to pattern system
            if (!window.advancedPatterns) window.advancedPatterns = {};
            if (!window.advancedPatterns.extracted_queries) {
                window.advancedPatterns.extracted_queries = [];
            }
            window.advancedPatterns.extracted_queries.push(pattern);

            // Save to database
            if (window.AevovDB?.insertPattern) {
                await window.AevovDB.insertPattern(pattern);
            }

            // Reindex semantic search
            if (window.SemanticSearch?.reindex) {
                window.SemanticSearch.reindex();
            }

            console.log(`✅ Query saved as pattern: ${query}`);
        },

        hookChatSystems() {
            // Hook into unified chat
            if (window.UnifiedChatSystem) {
                const originalProcess = window.UnifiedChatSystem.processQuery;
                if (originalProcess) {
                    window.UnifiedChatSystem.processQuery = async function(query) {
                        // Extract and save query
                        const features = QueryEngine.extractQueryFeatures(query);
                        
                        const autoExtract = JSON.parse(localStorage.getItem('aevov_settings') || '{}').autoExtract !== false;
                        if (autoExtract) {
                            await QueryEngine.saveQueryAsPattern(query, features);
                        }

                        return await originalProcess.call(this, query);
                    };
                }
            }
        }
    };

    // ========================================
    // PART 3: FIX BROKEN CHAT/NLP
    // ========================================

    const ChatFix = {
        init() {
            console.log('🔧 Fixing broken chat systems...');
            this.fixNLPBox();
            this.fixSupernovaChat();
            this.fixPatternMatching();
        },

        fixNLPBox() {
            // The NLP box exists but isn't wired up properly
            setTimeout(() => {
                const testBtn = document.querySelector('#nlpTestQuery')?.parentElement?.querySelector('button');
                if (testBtn && !testBtn.onclick) {
                    testBtn.onclick = () => window.NLPPopup?.testQuery();
                }
            }, 2000);
        },

        fixSupernovaChat() {
            // Supernova isn't sending text
            setTimeout(() => {
                const textInput = document.querySelector('#textInputField, #supernovaTextInput, [placeholder*="type"]');
                const sendBtn = document.querySelector('#sendTextBtn, button:contains("Send")');

                if (textInput && sendBtn) {
                    sendBtn.onclick = () => {
                        const text = textInput.value;
                        if (text && window.UnifiedChatSystem) {
                            window.UnifiedChatSystem.processQuery(text);
                            textInput.value = '';
                        }
                    };

                    textInput.onkeypress = (e) => {
                        if (e.key === 'Enter') sendBtn.click();
                    };
                }
            }, 2000);
        },

        fixPatternMatching() {
            // The main issue: queries not finding patterns
            // Create fallback pattern matcher
            window.fallbackPatternMatch = function(query) {
                const allPatterns = [];
                
                if (window.advancedPatterns) {
                    Object.values(window.advancedPatterns).forEach(cat => {
                        if (Array.isArray(cat)) allPatterns.push(...cat);
                    });
                }

                if (allPatterns.length === 0) {
                    return {
                        found: false,
                        message: 'No patterns in database. Press Ctrl+Shift+P to generate patterns first.'
                    };
                }

                // Use semantic search if available
                if (window.SemanticSearch?.search) {
                    const results = window.SemanticSearch.search(query, 3);
                    if (results.length > 0) {
                        return {
                            found: true,
                            match: results[0],
                            alternatives: results.slice(1)
                        };
                    }
                }

                // Fallback: basic keyword match
                const queryWords = query.toLowerCase().split(/\s+/);
                const matches = allPatterns.map(p => {
                    const keywords = (p.keywords || []).map(k => k.toLowerCase());
                    const score = queryWords.filter(qw => 
                        keywords.some(kw => kw.includes(qw) || qw.includes(kw))
                    ).length / queryWords.length;

                    return { pattern: p, similarity: score, confidence: score };
                }).filter(m => m.similarity > 0);

                matches.sort((a, b) => b.similarity - a.similarity);

                if (matches.length > 0) {
                    return {
                        found: true,
                        match: matches[0],
                        alternatives: matches.slice(1, 3)
                    };
                }

                return {
                    found: false,
                    message: `No matches for "${query}". Try: "React component", "Python function", "database query"`
                };
            };

            // Patch UnifiedChatSystem to use fallback
            if (window.UnifiedChatSystem) {
                window.UnifiedChatSystem.findBestMatch = window.fallbackPatternMatch;
            }
        }
    };

    // Initialize all systems
    SettingsSystem.init();
    QueryEngine.init();
    ChatFix.init();

    window.SettingsSystem = SettingsSystem;
    window.QueryEngine = QueryEngine;

    console.log('✅ Settings + Query Engine + Chat Fix loaded');

})();
