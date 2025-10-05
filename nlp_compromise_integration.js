/**
 * NLP COMPROMISE × AEVOV INTEGRATION
 * Deep integration of Compromise NLP with Aevov's pattern system
 * 
 * Features:
 * - Enhanced entity extraction (People, Places, Organizations, Dates, Numbers)
 * - Better keyword extraction using POS tagging
 * - Intent classification enhancement
 * - Query preprocessing and normalization
 * - Draggable NLP control panel
 * - Optional WordNet.js integration
 * - Compatible with pattern extractor
 * 
 * Requires: compromise.js (MIT licensed)
 * Optional: wordnet.js for semantic enhancements
 */

(function() {
    'use strict';

    console.log('📚 Loading NLP Compromise × Aevov Integration...');

    const CompromiseAevov = {
        // Configuration
        config: {
            enabled: true,
            useForPatternExtraction: true,
            useForNLU: true,
            useForQueryPreprocessing: true,
            extractEntities: true,
            extractTopics: true,
            posTagging: true,
            useWordNet: false, // On-demand loading
            enhanceKeywords: true
        },

        // State
        state: {
            compromiseReady: false,
            wordNetReady: false,
            processingStats: {
                queriesProcessed: 0,
                entitiesExtracted: 0,
                patternsEnhanced: 0
            }
        },

        /**
         * INITIALIZE
         */
        async init() {
            console.log('⚡ Initializing Compromise × Aevov Integration...');

            // Check if Compromise is loaded
            if (typeof nlp === 'undefined') {
                console.error('❌ Compromise not loaded! Please include compromise.js');
                return;
            }

            this.state.compromiseReady = true;
            console.log('✓ Compromise NLP ready');

            // Create draggable control panel
            this.createControlPanel();

            // Integrate with Aevov systems
            this.integrateWithNLU();
            this.integrateWithPatternExtractor();
            this.integrateWithQueryProcessor();

            console.log('✅ Compromise × Aevov Integration complete!');
        },

        /**
         * CREATE DRAGGABLE CONTROL PANEL
         */
        createControlPanel() {
            const panelHTML = `
                <div id="nlpCompromisePanel" style="position: fixed; bottom: 210px; right: 20px; width: 320px; background: linear-gradient(135deg, rgba(59, 130, 246, 0.95) 0%, rgba(37, 99, 235, 0.95) 100%); padding: 20px; border-radius: 15px; border: 2px solid #60a5fa; box-shadow: 0 10px 40px rgba(59, 130, 246, 0.4); z-index: 9997; cursor: move; backdrop-filter: blur(10px);">
                    
                    <!-- Header (Drag Handle) -->
                    <div class="drag-handle" style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px; cursor: move;">
                        <div style="font-size: 24px;">📚</div>
                        <div style="flex: 1;">
                            <div style="color: white; font-weight: 700; font-size: 16px;">NLP Compromise</div>
                            <div style="color: rgba(255,255,255,0.8); font-size: 11px;">Enhanced language processing</div>
                        </div>
                        <div id="nlpStatusDot" style="width: 10px; height: 10px; background: #10b981; border-radius: 50%; box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);"></div>
                    </div>

                    <!-- Core Features -->
                    <div style="background: rgba(0, 0, 0, 0.3); padding: 15px; border-radius: 10px; margin-bottom: 12px;">
                        <label style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; cursor: pointer;">
                            <input type="checkbox" id="nlpEnabled" checked onchange="window.CompromiseAevov.toggle('enabled', this.checked)" style="width: 18px; height: 18px; cursor: pointer;">
                            <div style="flex: 1;">
                                <div style="color: white; font-weight: 600; font-size: 13px;">Enable NLP</div>
                                <div style="color: rgba(255,255,255,0.7); font-size: 10px;">Core processing</div>
                            </div>
                        </label>

                        <label style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; cursor: pointer;">
                            <input type="checkbox" id="nlpPatternExtraction" checked onchange="window.CompromiseAevov.toggle('useForPatternExtraction', this.checked)" style="width: 18px; height: 18px; cursor: pointer;">
                            <div style="flex: 1;">
                                <div style="color: white; font-weight: 600; font-size: 13px;">Pattern Enhancement</div>
                                <div style="color: rgba(255,255,255,0.7); font-size: 10px;">Better keyword extraction</div>
                            </div>
                        </label>

                        <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                            <input type="checkbox" id="nlpEntityExtraction" checked onchange="window.CompromiseAevov.toggle('extractEntities', this.checked)" style="width: 18px; height: 18px; cursor: pointer;">
                            <div style="flex: 1;">
                                <div style="color: white; font-weight: 600; font-size: 13px;">Entity Extraction</div>
                                <div style="color: rgba(255,255,255,0.7); font-size: 10px;">People, Places, Dates</div>
                            </div>
                        </label>
                    </div>

                    <!-- Advanced Features -->
                    <details style="margin-bottom: 12px;">
                        <summary style="color: white; font-weight: 600; font-size: 13px; cursor: pointer; padding: 10px; background: rgba(0, 0, 0, 0.2); border-radius: 6px; user-select: none;">
                            ⚙️ Advanced Options
                        </summary>
                        <div style="background: rgba(0, 0, 0, 0.3); padding: 12px; border-radius: 8px; margin-top: 8px;">
                            <label style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px; cursor: pointer;">
                                <input type="checkbox" id="nlpPosTagging" checked onchange="window.CompromiseAevov.toggle('posTagging', this.checked)" style="width: 16px; height: 16px; cursor: pointer;">
                                <div style="color: rgba(255,255,255,0.9); font-size: 12px;">POS Tagging</div>
                            </label>
                            
                            <label style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px; cursor: pointer;">
                                <input type="checkbox" id="nlpTopics" checked onchange="window.CompromiseAevov.toggle('extractTopics', this.checked)" style="width: 16px; height: 16px; cursor: pointer;">
                                <div style="color: rgba(255,255,255,0.9); font-size: 12px;">Topic Extraction</div>
                            </label>

                            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                <input type="checkbox" id="nlpWordNet" onchange="window.CompromiseAevov.toggleWordNet(this.checked)" style="width: 16px; height: 16px; cursor: pointer;">
                                <div style="color: rgba(255,255,255,0.9); font-size: 12px;">WordNet (on-demand)</div>
                            </label>
                        </div>
                    </details>

                    <!-- Stats -->
                    <div style="background: rgba(0, 0, 0, 0.3); padding: 12px; border-radius: 8px; font-size: 11px; color: rgba(255,255,255,0.8);">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                            <div>
                                <div style="color: rgba(255,255,255,0.6); font-size: 10px;">Queries</div>
                                <div id="nlpQueriesProcessed" style="color: #60a5fa; font-weight: 700; font-size: 16px;">0</div>
                            </div>
                            <div>
                                <div style="color: rgba(255,255,255,0.6); font-size: 10px;">Entities</div>
                                <div id="nlpEntitiesExtracted" style="color: #10b981; font-weight: 700; font-size: 16px;">0</div>
                            </div>
                        </div>
                        <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.1);">
                            <div style="color: rgba(255,255,255,0.6); font-size: 10px;">Patterns Enhanced</div>
                            <div id="nlpPatternsEnhanced" style="color: #f59e0b; font-weight: 700; font-size: 16px;">0</div>
                        </div>
                    </div>

                    <!-- Info -->
                    <div style="margin-top: 10px; padding: 8px; background: rgba(0, 0, 0, 0.2); border-radius: 6px; font-size: 10px; color: rgba(255,255,255,0.7); line-height: 1.4;">
                        <strong style="color: #60a5fa;">💡 What it does:</strong><br>
                        Enhances Aevov with advanced NLP: entity recognition, POS tagging, and semantic analysis.
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', panelHTML);
            this.makeDraggable('nlpCompromisePanel');
            console.log('✅ NLP control panel created');
        },

        /**
         * INTEGRATE WITH AEVOV NLU
         */
        integrateWithNLU() {
            if (!window.AevovNLU) {
                console.warn('⚠️ AevovNLU not available yet');
                return;
            }

            // Enhance entity extraction
            const originalExtractEntities = window.AevovNLU.extractEntities;
            if (originalExtractEntities) {
                window.AevovNLU.extractEntities = (query) => {
                    // Get original entities
                    const original = originalExtractEntities.call(window.AevovNLU, query);

                    // Enhance with Compromise if enabled
                    if (this.config.enabled && this.config.extractEntities) {
                        const enhanced = this.enhanceEntityExtraction(query, original);
                        this.state.processingStats.queriesProcessed++;
                        this.updateStats();
                        return enhanced;
                    }

                    return original;
                };
            }

            console.log('✅ Integrated with AevovNLU');
        },

        /**
         * INTEGRATE WITH PATTERN EXTRACTOR
         */
        integrateWithPatternExtractor() {
            // Enhance pattern keyword extraction
            const originalExtractKeywords = window.PatternModal?.extractKeywords || 
                                           window.IntegratedPatternSystem?.extractKeywords ||
                                           window.CustomExtractor?.extractKeywords;

            if (originalExtractKeywords) {
                const enhanceFunc = (query) => {
                    const original = originalExtractKeywords(query);

                    if (this.config.enabled && this.config.useForPatternExtraction) {
                        const enhanced = this.enhanceKeywordExtraction(query, original);
                        this.state.processingStats.patternsEnhanced++;
                        this.updateStats();
                        return enhanced;
                    }

                    return original;
                };

                // Patch all available systems
                if (window.PatternModal) {
                    window.PatternModal.extractKeywords = enhanceFunc;
                }
                if (window.IntegratedPatternSystem) {
                    window.IntegratedPatternSystem.extractKeywords = enhanceFunc;
                }
                if (window.CustomExtractor) {
                    window.CustomExtractor.extractKeywords = enhanceFunc;
                }

                console.log('✅ Integrated with Pattern Extractor');
            }
        },

        /**
         * INTEGRATE WITH QUERY PROCESSOR
         */
        integrateWithQueryProcessor() {
            // Add preprocessing to chat systems
            if (window.AevovNLU && window.AevovNLU.processWithNLU) {
                const original = window.AevovNLU.processWithNLU.bind(window.AevovNLU);

                window.AevovNLU.processWithNLU = async (query, fallback) => {
                    if (this.config.enabled && this.config.useForQueryPreprocessing) {
                        query = this.preprocessQuery(query);
                    }
                    return await original(query, fallback);
                };

                console.log('✅ Integrated with Query Processor');
            }
        },

        /**
         * ENHANCE ENTITY EXTRACTION
         */
        enhanceEntityExtraction(query, originalEntities) {
            const doc = nlp(query);

            // Extract entities using Compromise
            const people = doc.people().out('array');
            const places = doc.places().out('array');
            const organizations = doc.organizations().out('array');
            const dates = doc.dates && doc.dates().out('array') || [];
            const numbers = doc.numbers && doc.numbers().out('array') || [];
            const topics = this.config.extractTopics ? doc.topics().out('array') : [];

            // Combine with original entities
            const enhanced = {
                ...originalEntities,
                people: people,
                places: places,
                organizations: organizations,
                dates: dates,
                numbers: numbers,
                topics: topics,
                all: [
                    ...originalEntities.keywords || [],
                    ...people,
                    ...places,
                    ...organizations,
                    ...topics
                ]
            };

            this.state.processingStats.entitiesExtracted += 
                people.length + places.length + organizations.length + dates.length;

            return enhanced;
        },

        /**
         * ENHANCE KEYWORD EXTRACTION
         */
        enhanceKeywordExtraction(query, originalKeywords) {
            const doc = nlp(query);

            // Extract nouns, verbs, and adjectives (most meaningful words)
            const nouns = this.config.posTagging ? doc.nouns().out('array') : [];
            const verbs = this.config.posTagging ? doc.verbs().out('array') : [];
            const adjectives = this.config.posTagging ? doc.adjectives().out('array') : [];

            // Get topics
            const topics = this.config.extractTopics ? doc.topics().out('array') : [];

            // Combine and deduplicate
            const enhanced = new Set([
                ...originalKeywords,
                ...nouns,
                ...verbs.map(v => doc.match(v).verbs().toInfinitive().out('array')).flat(), // Convert to base form
                ...adjectives,
                ...topics
            ]);

            // Filter out single characters and common words
            return Array.from(enhanced).filter(kw => 
                kw && kw.length > 2 && !this.isStopWord(kw.toLowerCase())
            );
        },

        /**
         * PREPROCESS QUERY
         */
        preprocessQuery(query) {
            const doc = nlp(query);

            // Normalize contractions
            doc.contractions().expand();

            // Convert to base forms
            if (this.config.posTagging) {
                doc.verbs().toInfinitive();
                doc.nouns().toSingular();
            }

            return doc.out('text');
        },

        /**
         * STOP WORDS
         */
        isStopWord(word) {
            const stopWords = new Set([
                'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
                'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be',
                'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
                'would', 'should', 'could', 'may', 'might', 'must', 'can', 'this',
                'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they'
            ]);
            return stopWords.has(word);
        },

        /**
         * TOGGLE WORDNET
         */
        async toggleWordNet(enabled) {
            this.config.useWordNet = enabled;

            if (enabled && !this.state.wordNetReady) {
                console.log('📚 Loading WordNet.js...');
                
                try {
                    // Load WordNet on demand
                    await this.loadScript('https://cdn.jsdelivr.net/npm/wordnet@0.1.2/lib/wordnet.min.js');
                    this.state.wordNetReady = true;
                    console.log('✓ WordNet loaded');
                    
                    // Show notification
                    this.showNotification('WordNet Ready', 'Semantic enhancements enabled');
                } catch (error) {
                    console.error('Failed to load WordNet:', error);
                    document.getElementById('nlpWordNet').checked = false;
                    this.config.useWordNet = false;
                }
            }

            console.log(`📚 WordNet: ${enabled ? 'ON' : 'OFF'}`);
        },

        /**
         * LOAD SCRIPT DYNAMICALLY
         */
        loadScript(src) {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        },

        /**
         * TOGGLE CONFIG
         */
        toggle(key, value) {
            this.config[key] = value;
            console.log(`📚 ${key}: ${value ? 'ON' : 'OFF'}`);
            
            // Update status indicator
            const dot = document.getElementById('nlpStatusDot');
            if (dot) {
                if (this.config.enabled) {
                    dot.style.background = '#10b981';
                    dot.style.boxShadow = '0 0 8px rgba(16, 185, 129, 0.6)';
                } else {
                    dot.style.background = '#ef4444';
                    dot.style.boxShadow = '0 0 8px rgba(239, 68, 68, 0.6)';
                }
            }
        },

        /**
         * UPDATE STATS
         */
        updateStats() {
            document.getElementById('nlpQueriesProcessed').textContent = 
                this.state.processingStats.queriesProcessed;
            document.getElementById('nlpEntitiesExtracted').textContent = 
                this.state.processingStats.entitiesExtracted;
            document.getElementById('nlpPatternsEnhanced').textContent = 
                this.state.processingStats.patternsEnhanced;
        },

        /**
         * MAKE DRAGGABLE
         */
        makeDraggable(elementId) {
            const element = document.getElementById(elementId);
            if (!element) return;

            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

            const dragHandle = element.querySelector('.drag-handle') || element;

            dragHandle.onmousedown = dragMouseDown;

            function dragMouseDown(e) {
                e.preventDefault();
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
                element.style.cursor = 'grabbing';
            }

            function elementDrag(e) {
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                element.style.top = (element.offsetTop - pos2) + "px";
                element.style.left = (element.offsetLeft - pos1) + "px";
                element.style.bottom = 'auto';
                element.style.right = 'auto';
            }

            function closeDragElement() {
                document.onmouseup = null;
                document.onmousemove = null;
                element.style.cursor = 'move';
            }

            console.log(`✅ Made ${elementId} draggable`);
        },

        /**
         * SHOW NOTIFICATION
         */
        showNotification(title, message) {
            if (window.UnifiedChatSystem && window.UnifiedChatSystem.notify) {
                window.UnifiedChatSystem.notify('success', title, message);
            } else {
                console.log(`📢 ${title}: ${message}`);
            }
        }
    };

    // Export globally
    window.CompromiseAevov = CompromiseAevov;

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => CompromiseAevov.init(), 2000);
        });
    } else {
        setTimeout(() => CompromiseAevov.init(), 2000);
    }

    console.log('✅ NLP Compromise × Aevov Integration loaded');
    console.log('📚 Advanced language processing ready');

})();
