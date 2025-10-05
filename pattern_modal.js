/**
 * PATTERN GENERATOR MODAL
 * Standalone popup system for pattern generation
 * Triggered by Ctrl+Shift+P
 * 
 * Features:
 * - Independent of Advanced Extractor tab
 * - Works from anywhere in the app
 * - Complete pattern generation workflow
 * - Beautiful modal UI
 * 
 * Load this instead of integrated_pattern_system.js if you want modal version
 */

(function() {
    'use strict';

    console.log('🎯 Loading Pattern Generator Modal...');

    const PatternModal = {
        // State
        isOpen: false,
        customQueries: {},
        stats: {
            patternsExtracted: 0,
            queriesLoaded: 0,
            lastUpdate: null
        },

        // Templates (same as before)
        templates: {
            web_development: {
                actions: ['Build', 'Create', 'Implement', 'Design', 'Develop', 'Setup', 'Configure', 'Make'],
                subjects: ['React app', 'Vue component', 'Angular service', 'Next.js page', 'web application', 'SPA', 'PWA', 'dashboard'],
                features: ['with authentication', 'with routing', 'with state management', 'with API integration', 'with real-time updates', 'with dark mode', 'with responsive design'],
                technologies: ['using TypeScript', 'using Tailwind', 'using Redux', 'using GraphQL', 'using REST API', 'using WebSockets']
            },
            backend: {
                actions: ['Build', 'Create', 'Implement', 'Design', 'Setup', 'Deploy', 'Configure'],
                subjects: ['REST API', 'GraphQL API', 'microservice', 'serverless function', 'API endpoint', 'backend service', 'web server'],
                features: ['with authentication', 'with database integration', 'with caching', 'with rate limiting', 'with error handling', 'with logging'],
                technologies: ['using Node.js', 'using Express', 'using NestJS', 'using FastAPI', 'using Django']
            },
            database: {
                actions: ['Design', 'Implement', 'Optimize', 'Create', 'Setup', 'Migrate', 'Configure'],
                subjects: ['database schema', 'data model', 'relational database', 'NoSQL database', 'database connection', 'ORM layer'],
                features: ['with indexing', 'with transactions', 'with replication', 'with sharding', 'with backup strategy'],
                technologies: ['using PostgreSQL', 'using MongoDB', 'using Redis', 'using MySQL', 'using Prisma']
            },
            mobile_development: {
                actions: ['Build', 'Create', 'Develop', 'Design', 'Implement', 'Setup'],
                subjects: ['mobile app', 'iOS app', 'Android app', 'cross-platform app', 'native app', 'mobile screen'],
                features: ['with push notifications', 'with offline support', 'with camera integration', 'with geolocation', 'with biometric auth'],
                technologies: ['using React Native', 'using Flutter', 'using Swift', 'using Kotlin', 'using Expo']
            },
            devops: {
                actions: ['Setup', 'Configure', 'Deploy', 'Implement', 'Build', 'Create', 'Automate'],
                subjects: ['CI/CD pipeline', 'deployment workflow', 'container orchestration', 'infrastructure', 'monitoring system'],
                features: ['with automated testing', 'with blue-green deployment', 'with auto-scaling', 'with load balancing', 'with health checks'],
                technologies: ['using Docker', 'using Kubernetes', 'using GitHub Actions', 'using Jenkins', 'using Terraform']
            }
        },

        /**
         * INITIALIZE
         */
        init() {
            console.log('⚡ Initializing Pattern Generator Modal...');

            // Load saved data
            this.loadSavedData();

            // Create modal HTML
            this.createModal();

            // Setup keyboard shortcut (Ctrl+Shift+P)
            this.setupKeyboardShortcut();

            // Setup auto-save
            this.setupAutoSave();

            console.log('✅ Pattern Modal ready! Press Ctrl+Shift+P to open');
            this.showNotification('🎯 Pattern Generator Ready', 'Press Ctrl+Shift+P to open');
        },

        /**
         * SETUP KEYBOARD SHORTCUT
         */
        setupKeyboardShortcut() {
            document.addEventListener('keydown', (e) => {
                // Ctrl+Shift+P (or Cmd+Shift+P on Mac)
                if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
                    e.preventDefault();
                    this.toggle();
                }
            });

            console.log('⌨️ Keyboard shortcut registered: Ctrl+Shift+P');
        },

        /**
         * CREATE MODAL
         */
        createModal() {
            const modalHTML = `
                <div id="patternGeneratorModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.9); z-index: 10000; overflow-y: auto; backdrop-filter: blur(10px);">
                    <div style="min-height: 100%; display: flex; align-items: center; justify-content: center; padding: 40px 20px;">
                        <div style="background: linear-gradient(135deg, #0a192f 0%, #1a2744 100%); border: 2px solid #00d4ff; border-radius: 20px; width: 100%; max-width: 1200px; box-shadow: 0 20px 60px rgba(0, 212, 255, 0.3); position: relative;">
                            
                            <!-- Close Button -->
                            <button onclick="window.PatternModal.close()" style="position: absolute; top: 20px; right: 20px; background: rgba(255, 107, 107, 0.2); border: 2px solid #ff6b6b; color: #ff6b6b; width: 40px; height: 40px; border-radius: 50%; font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s;">
                                ✕
                            </button>

                            <!-- Header -->
                            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 20px 20px 0 0; text-align: center;">
                                <h1 style="color: white; margin: 0 0 15px 0; font-size: 36px; text-shadow: 0 4px 15px rgba(0,0,0,0.5);">
                                    🚀 Aevov Pattern Generator
                                </h1>
                                <p style="color: rgba(255,255,255,0.95); font-size: 18px; margin: 0; line-height: 1.6;">
                                    Generate and extract patterns instantly • Press <kbd style="background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 4px; font-family: monospace;">Ctrl+Shift+P</kbd> to toggle
                                </p>
                            </div>

                            <!-- Content -->
                            <div style="padding: 40px;">

                                <!-- Quick Actions -->
                                <div style="background: linear-gradient(135deg, rgba(0, 255, 136, 0.15) 0%, rgba(0, 212, 255, 0.15) 100%); padding: 30px; border-radius: 15px; border: 2px solid #00ff88; margin-bottom: 30px;">
                                    <h2 style="color: #00ff88; margin: 0 0 20px 0; font-size: 24px;">⚡ Quick Start</h2>
                                    
                                    <!-- Generate All -->
                                    <div style="background: rgba(102, 126, 234, 0.2); padding: 20px; border-radius: 12px; border: 2px solid #667eea; margin-bottom: 15px;">
                                        <div style="display: flex; justify-content: space-between; align-items: center; gap: 20px;">
                                            <div style="flex: 1;">
                                                <div style="color: #667eea; font-weight: 700; font-size: 18px; margin-bottom: 8px;">
                                                    🌟 Generate All Categories
                                                </div>
                                                <div style="color: rgba(255,255,255,0.8); font-size: 14px;">
                                                    Creates 500 diverse patterns across 5 categories (30 seconds)
                                                </div>
                                            </div>
                                            <button onclick="window.PatternModal.quickStartAll()" 
                                                    style="padding: 18px 35px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 10px; font-weight: 700; font-size: 16px; cursor: pointer; box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4); white-space: nowrap; transition: transform 0.2s;">
                                                🚀 Generate All
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Generate Single -->
                                    <div style="background: rgba(0, 212, 255, 0.2); padding: 20px; border-radius: 12px; border: 2px solid #00d4ff;">
                                        <div style="color: #00d4ff; font-weight: 700; font-size: 18px; margin-bottom: 12px;">
                                            🎯 Generate Single Category
                                        </div>
                                        <div style="display: grid; grid-template-columns: 2fr 1fr auto; gap: 12px; align-items: end;">
                                            <div>
                                                <label style="color: rgba(255,255,255,0.9); font-size: 13px; display: block; margin-bottom: 6px;">Category:</label>
                                                <select id="modalQuickCategory" style="width: 100%; padding: 12px; background: rgba(10, 25, 47, 0.8); color: #fff; border: 2px solid #00d4ff; border-radius: 8px; font-size: 15px;">
                                                    <option value="web_development">🌐 Web Development</option>
                                                    <option value="backend">⚙️ Backend</option>
                                                    <option value="database">🗄️ Database</option>
                                                    <option value="mobile_development">📱 Mobile</option>
                                                    <option value="devops">🔧 DevOps</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label style="color: rgba(255,255,255,0.9); font-size: 13px; display: block; margin-bottom: 6px;">Count:</label>
                                                <input type="number" id="modalQuickCount" value="100" min="20" max="500" 
                                                       style="width: 100%; padding: 12px; background: rgba(10, 25, 47, 0.8); color: #fff; border: 2px solid #00d4ff; border-radius: 8px; font-size: 15px;">
                                            </div>
                                            <button onclick="window.PatternModal.quickStartSingle()" 
                                                    style="padding: 12px 28px; background: linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%); color: white; border: none; border-radius: 8px; font-weight: 700; font-size: 15px; cursor: pointer; box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3); white-space: nowrap;">
                                                ⚡ Generate
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Progress -->
                                    <div id="modalProgress" style="display: none; margin-top: 20px;">
                                        <div style="background: rgba(0,0,0,0.3); border-radius: 10px; overflow: hidden; height: 40px; margin-bottom: 12px; border: 1px solid rgba(0, 212, 255, 0.3);">
                                            <div id="modalProgressFill" style="height: 100%; background: linear-gradient(90deg, #00ff88 0%, #00d4ff 100%); display: flex; align-items: center; justify-content: center; color: #0a192f; font-weight: 700; font-size: 16px; transition: width 0.3s ease; width: 0%;">0%</div>
                                        </div>
                                        <div id="modalStatus" style="color: #00d4ff; font-size: 15px; text-align: center;"></div>
                                    </div>

                                    <!-- Success -->
                                    <div id="modalSuccess" style="display: none; margin-top: 20px; padding: 25px; background: rgba(0, 255, 136, 0.2); border: 2px solid #00ff88; border-radius: 12px;">
                                        <div style="font-size: 20px; color: #00ff88; font-weight: 700; margin-bottom: 12px;">
                                            ✅ Patterns Ready!
                                        </div>
                                        <div id="modalSuccessDetails" style="color: rgba(255,255,255,0.9); font-size: 15px; line-height: 1.8;"></div>
                                        <button onclick="window.PatternModal.goToChat()" 
                                                style="margin-top: 15px; padding: 14px 28px; background: linear-gradient(135deg, #00ff88 0%, #00d4aa 100%); color: #0a192f; border: none; border-radius: 8px; font-weight: 700; font-size: 15px; cursor: pointer;">
                                            💬 Start Chatting
                                        </button>
                                    </div>
                                </div>

                                <!-- Stats -->
                                <div style="background: rgba(0, 212, 255, 0.1); padding: 25px; border-radius: 15px; border: 2px solid #00d4ff;">
                                    <h3 style="color: #00d4ff; margin: 0 0 20px 0; font-size: 20px;">📊 Pattern Database</h3>
                                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                                        <div style="background: rgba(0, 0, 0, 0.3); padding: 20px; border-radius: 10px; border: 1px solid rgba(0, 212, 255, 0.3); text-align: center;">
                                            <div style="font-size: 36px; font-weight: 700; color: #00ff88;" id="modalStatsPatterns">0</div>
                                            <div style="font-size: 13px; color: rgba(255,255,255,0.7); margin-top: 5px;">Patterns Extracted</div>
                                        </div>
                                        <div style="background: rgba(0, 0, 0, 0.3); padding: 20px; border-radius: 10px; border: 1px solid rgba(0, 212, 255, 0.3); text-align: center;">
                                            <div style="font-size: 36px; font-weight: 700; color: #667eea;" id="modalStatsQueries">0</div>
                                            <div style="font-size: 13px; color: rgba(255,255,255,0.7); margin-top: 5px;">Queries Saved</div>
                                        </div>
                                        <div style="background: rgba(0, 0, 0, 0.3); padding: 20px; border-radius: 10px; border: 1px solid rgba(0, 212, 255, 0.3); text-align: center;">
                                            <div style="font-size: 36px; font-weight: 700; color: #ff9f0a;" id="modalStatsCategories">0</div>
                                            <div style="font-size: 13px; color: rgba(255,255,255,0.7); margin-top: 5px;">Categories</div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <!-- Footer -->
                            <div style="padding: 20px 40px; border-top: 1px solid rgba(0, 212, 255, 0.2); display: flex; justify-content: space-between; align-items: center;">
                                <div style="color: rgba(255,255,255,0.6); font-size: 13px;">
                                    Press <kbd style="background: rgba(255,255,255,0.1); padding: 3px 6px; border-radius: 3px; font-family: monospace;">Ctrl+Shift+P</kbd> or <kbd style="background: rgba(255,255,255,0.1); padding: 3px 6px; border-radius: 3px; font-family: monospace;">Esc</kbd> to close
                                </div>
                                <button onclick="window.PatternModal.close()" style="padding: 10px 20px; background: rgba(255, 107, 107, 0.2); border: 2px solid #ff6b6b; color: #ff6b6b; border-radius: 6px; font-weight: 600; cursor: pointer;">
                                    Close
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', modalHTML);

            // Setup ESC key to close
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            });

            console.log('✅ Modal created');
        },

        /**
         * MODAL CONTROLS
         */
        open() {
            const modal = document.getElementById('patternGeneratorModal');
            if (modal) {
                modal.style.display = 'block';
                this.isOpen = true;
                this.updateStats();
                console.log('📖 Modal opened');
            }
        },

        close() {
            const modal = document.getElementById('patternGeneratorModal');
            if (modal) {
                modal.style.display = 'none';
                this.isOpen = false;
                console.log('📕 Modal closed');
            }
        },

        toggle() {
            if (this.isOpen) {
                this.close();
            } else {
                this.open();
            }
        },

        /**
         * QUICK START ALL
         */
        async quickStartAll() {
            console.log('🚀 Quick Start ALL...');

            const progressDiv = document.getElementById('modalProgress');
            const statusDiv = document.getElementById('modalStatus');
            const fillDiv = document.getElementById('modalProgressFill');
            const successDiv = document.getElementById('modalSuccess');

            progressDiv.style.display = 'block';
            successDiv.style.display = 'none';
            statusDiv.textContent = 'Generating queries...';
            fillDiv.style.width = '10%';
            fillDiv.textContent = '10%';

            try {
                const categories = ['web_development', 'backend', 'database', 'mobile_development', 'devops'];
                let totalPatterns = 0;

                // Generate
                for (let i = 0; i < categories.length; i++) {
                    const category = categories[i];
                    const progress = 10 + ((i + 1) / categories.length * 40);
                    
                    statusDiv.textContent = `Generating ${category.replace(/_/g, ' ')}...`;
                    fillDiv.style.width = progress + '%';
                    fillDiv.textContent = Math.round(progress) + '%';

                    const queries = this.generateQueries(category, 100);
                    this.customQueries[category] = queries;

                    await this.sleep(100);
                }

                // Extract
                statusDiv.textContent = 'Extracting patterns...';
                fillDiv.style.width = '60%';
                fillDiv.textContent = '60%';

                for (let i = 0; i < categories.length; i++) {
                    const category = categories[i];
                    const progress = 60 + ((i + 1) / categories.length * 35);
                    
                    statusDiv.textContent = `Extracting ${category.replace(/_/g, ' ')}... (${i + 1}/${categories.length})`;
                    fillDiv.style.width = progress + '%';
                    fillDiv.textContent = Math.round(progress) + '%';

                    const patterns = await this.extractPatterns(category, this.customQueries[category]);
                    totalPatterns += patterns.length;

                    await this.sleep(200);
                }

                // Complete
                fillDiv.style.width = '100%';
                fillDiv.textContent = '100%';
                statusDiv.textContent = '✅ Complete!';

                await this.sleep(500);

                progressDiv.style.display = 'none';
                successDiv.style.display = 'block';
                document.getElementById('modalSuccessDetails').innerHTML = `
                    • Generated <strong>${totalPatterns} patterns</strong> across <strong>5 categories</strong><br>
                    • NLU learned <strong>${this.getTotalKeywords()}+ keywords</strong><br>
                    • System ready for natural language queries<br><br>
                    <em>Try: "Build a React app with authentication"</em>
                `;

                this.saveToLocalStorage();
                this.updateStats();

                console.log(`✅ Generated ${totalPatterns} patterns`);

            } catch (error) {
                statusDiv.textContent = `❌ Error: ${error.message}`;
                console.error('Error:', error);
            }
        },

        /**
         * QUICK START SINGLE
         */
        async quickStartSingle() {
            const category = document.getElementById('modalQuickCategory').value;
            const count = parseInt(document.getElementById('modalQuickCount').value);

            console.log(`⚡ Quick Start: ${category} (${count})`);

            const progressDiv = document.getElementById('modalProgress');
            const statusDiv = document.getElementById('modalStatus');
            const fillDiv = document.getElementById('modalProgressFill');
            const successDiv = document.getElementById('modalSuccess');

            progressDiv.style.display = 'block';
            successDiv.style.display = 'none';

            try {
                statusDiv.textContent = `Generating ${count} queries...`;
                fillDiv.style.width = '30%';
                fillDiv.textContent = '30%';

                const queries = this.generateQueries(category, count);
                this.customQueries[category] = queries;

                await this.sleep(300);

                statusDiv.textContent = 'Extracting patterns...';
                fillDiv.style.width = '70%';
                fillDiv.textContent = '70%';

                const patterns = await this.extractPatterns(category, queries);

                fillDiv.style.width = '100%';
                fillDiv.textContent = '100%';
                statusDiv.textContent = '✅ Complete!';

                await this.sleep(500);

                progressDiv.style.display = 'none';
                successDiv.style.display = 'block';
                document.getElementById('modalSuccessDetails').innerHTML = `
                    • Generated <strong>${patterns.length} patterns</strong><br>
                    • Category: <strong>${category.replace(/_/g, ' ')}</strong><br>
                    • Ready to use in chat!
                `;

                this.saveToLocalStorage();
                this.updateStats();

                console.log(`✅ Generated ${patterns.length} patterns`);

            } catch (error) {
                statusDiv.textContent = `❌ Error: ${error.message}`;
                console.error('Error:', error);
            }
        },

        /**
         * PATTERN GENERATION (same as before)
         */
        generateQueries(category, count) {
            const template = this.templates[category];
            if (!template) return [];

            const queries = new Set();

            while (queries.size < count) {
                const action = this.randomChoice(template.actions);
                const subject = this.randomChoice(template.subjects);
                const feature = this.randomChoice(template.features);
                const includeTech = Math.random() > 0.3;
                const tech = includeTech ? this.randomChoice(template.technologies) : '';

                let query = `${action} ${subject} ${feature}`;
                if (tech) query += ` ${tech}`;

                queries.add(query);

                if (queries.size < count) {
                    queries.add(`${action} ${subject} ${feature}`);
                }
                if (queries.size < count && Math.random() > 0.7) {
                    queries.add(`${action} ${subject}`);
                }
            }

            return Array.from(queries).slice(0, count);
        },

        async extractPatterns(category, queries) {
            const patterns = [];

            for (const query of queries) {
                const pattern = this.createPattern(query, category);
                patterns.push(pattern);
            }

            if (!window.advancedPatterns) window.advancedPatterns = {};
            if (!window.advancedPatterns[category]) window.advancedPatterns[category] = [];

            window.advancedPatterns[category].push(...patterns);
            this.stats.patternsExtracted += patterns.length;

            if (typeof window.updateAdvancedStats === 'function') {
                window.updateAdvancedStats();
            }

            return patterns;
        },

        createPattern(query, category) {
            const keywords = this.extractKeywords(query);
            const embedding = this.createEmbedding(keywords);

            return {
                id: `modal_${category}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                category: category,
                categoryName: category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                keywords: keywords,
                sourceQuery: query,
                template: btoa(`// Generated from: ${query}\n// TODO: Implement`),
                embedding: embedding,
                confidence: 0.88,
                intent: this.inferIntent(query),
                votes: 5,
                synthetic: false,
                custom: true,
                timestamp: Date.now()
            };
        },

        extractKeywords(query) {
            const stopWords = new Set(['a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he', 'in', 'is', 'it', 'of', 'on', 'that', 'the', 'to', 'was', 'will', 'with']);
            const tokens = query.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter(t => t.length > 2 && !stopWords.has(t));
            return [...new Set(tokens)];
        },

        createEmbedding(keywords) {
            const embedding = new Array(128).fill(0);
            keywords.forEach(word => {
                let h = 0;
                for (let i = 0; i < word.length; i++) {
                    h = ((h << 5) - h) + word.charCodeAt(i);
                }
                h = Math.abs(h);
                embedding[h % 128] += 1.0;
            });
            const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
            return magnitude > 0 ? embedding.map(v => v / magnitude) : embedding;
        },

        inferIntent(query) {
            const lower = query.toLowerCase();
            if (/^(build|create|make|implement|design)/.test(lower)) return 'code_generation';
            if (/^(what|explain|how does|tell me)/.test(lower)) return 'explanation';
            if (/^(optimize|improve|enhance)/.test(lower)) return 'optimization';
            if (/^(debug|fix|solve)/.test(lower)) return 'debugging';
            return 'general';
        },

        /**
         * NAVIGATION
         */
        goToChat() {
            this.close();
            const chatTab = document.querySelector('.tab[onclick*="convo"]');
            if (chatTab) chatTab.click();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },

        /**
         * PERSISTENCE
         */
        loadSavedData() {
            try {
                const queries = localStorage.getItem('aevov_modal_queries');
                const stats = localStorage.getItem('aevov_modal_stats');
                if (queries) this.customQueries = JSON.parse(queries);
                if (stats) this.stats = JSON.parse(stats);
            } catch (e) {
                console.warn('Could not load saved data');
            }
        },

        saveToLocalStorage() {
            try {
                localStorage.setItem('aevov_modal_queries', JSON.stringify(this.customQueries));
                localStorage.setItem('aevov_modal_stats', JSON.stringify(this.stats));
            } catch (e) {
                console.warn('Could not save');
            }
        },

        setupAutoSave() {
            setInterval(() => this.saveToLocalStorage(), 30000);
        },

        /**
         * STATS
         */
        updateStats() {
            const totalPatterns = this.getTotalPatterns();
            const totalQueries = Object.values(this.customQueries).reduce((sum, q) => sum + q.length, 0);
            const categories = Object.keys(this.customQueries).length;

            document.getElementById('modalStatsPatterns').textContent = totalPatterns;
            document.getElementById('modalStatsQueries').textContent = totalQueries;
            document.getElementById('modalStatsCategories').textContent = categories;
        },

        getTotalPatterns() {
            let total = 0;
            if (window.advancedPatterns) {
                for (const category in window.advancedPatterns) {
                    if (Array.isArray(window.advancedPatterns[category])) {
                        total += window.advancedPatterns[category].length;
                    }
                }
            }
            return total;
        },

        getTotalKeywords() {
            const keywords = new Set();
            if (window.advancedPatterns) {
                for (const category in window.advancedPatterns) {
                    if (Array.isArray(window.advancedPatterns[category])) {
                        window.advancedPatterns[category].forEach(p => {
                            if (p.keywords) p.keywords.forEach(k => keywords.add(k));
                        });
                    }
                }
            }
            return keywords.size;
        },

        /**
         * UTILITIES
         */
        randomChoice(array) {
            return array[Math.floor(Math.random() * array.length)];
        },

        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },

        showNotification(title, message) {
            if (window.UnifiedChatSystem && window.UnifiedChatSystem.notify) {
                window.UnifiedChatSystem.notify('success', title, message);
            } else {
                console.log(`📢 ${title}: ${message}`);
            }
        }
    };

    // Export globally
    window.PatternModal = PatternModal;

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => PatternModal.init(), 1000);
        });
    } else {
        setTimeout(() => PatternModal.init(), 1000);
    }

    console.log('✅ Pattern Generator Modal loaded');
    console.log('⌨️ Press Ctrl+Shift+P to open modal');

})();
