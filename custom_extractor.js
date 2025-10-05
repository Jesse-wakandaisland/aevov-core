/**
 * CUSTOM PATTERN EXTRACTOR
 * Allows users to provide their own training queries
 * Extends the Advanced Extractor with custom data support
 * 
 * Load this AFTER the existing Advanced Extractor
 */

(function() {
    'use strict';

    console.log('🎯 Loading Custom Pattern Extractor...');

    const CustomExtractor = {
        // Storage for custom queries
        customQueries: {},
        
        // Stats
        stats: {
            customQueriesLoaded: 0,
            patternsFromCustom: 0,
            lastUpdate: null
        },

        /**
         * Initialize the system
         */
        init() {
            console.log('⚡ Initializing Custom Pattern Extractor...');
            
            // Add UI for custom queries
            this.injectCustomUI();
            
            // Load saved custom queries from localStorage
            this.loadSavedQueries();
            
            // Enhance existing extract functions
            this.enhanceExtractor();
            
            console.log('✅ Custom Pattern Extractor ready!');
        },

        /**
         * Inject UI for adding custom queries
         */
        injectCustomUI() {
            // Find the Advanced Extractor section
            const advExtractorDiv = document.getElementById('advancedExtractor');
            if (!advExtractorDiv) {
                console.warn('Advanced Extractor section not found');
                return;
            }

            // Create custom query input section
            const customUI = `
                <div class="section" style="border: 2px solid #00ff88; background: rgba(0, 255, 136, 0.05); margin-top: 20px;">
                    <h3 style="color: #00ff88;">📝 Add Your Own Training Queries</h3>
                    
                    <div class="info-box" style="background: rgba(0, 212, 255, 0.1);">
                        <strong>🎯 Custom Data Input:</strong> Instead of using hardcoded samples, 
                        add your own queries here. The system will extract patterns from YOUR data!
                    </div>

                    <div class="input-group" style="margin-top: 15px;">
                        <label>Select Category for Custom Queries</label>
                        <select id="customQueryCategory" style="width: 100%; padding: 10px; background: rgba(10, 25, 47, 0.8); color: #fff; border: 1px solid #00d4ff; border-radius: 4px;">
                            <option value="">-- Select Category --</option>
                        </select>
                    </div>

                    <div class="input-group">
                        <label>Your Training Queries (one per line)</label>
                        <textarea id="customQueryInput" rows="12" 
                                  placeholder="Enter your own queries here, for example:

Build a Next.js app with authentication
Create a GraphQL API with subscriptions
Implement Redis caching with Bull queues
Design a microservices architecture
Build a serverless Lambda function
Create a Kubernetes deployment pipeline
Implement OAuth2 with refresh tokens
Design a CQRS event sourcing system
Build a real-time WebSocket chat
Create a Docker multi-stage build

Add as many as you want - more queries = better patterns!"
                                  style="width: 100%; padding: 12px; font-family: monospace; font-size: 13px; background: rgba(10, 25, 47, 0.8); color: #00ff88; border: 1px solid #00d4ff; border-radius: 4px; line-height: 1.6;"></textarea>
                    </div>

                    <div style="display: flex; gap: 10px; margin-top: 10px;">
                        <button class="btn btn-success" onclick="window.CustomExtractor.saveCustomQueries()" style="flex: 1;">
                            💾 Save Custom Queries
                        </button>
                        <button class="btn btn-primary" onclick="window.CustomExtractor.extractFromCustom()" style="flex: 1;">
                            🚀 Extract Patterns from Custom Data
                        </button>
                        <button class="btn" onclick="window.CustomExtractor.clearCustomQueries()" style="flex: 0.5; background: rgba(255, 107, 107, 0.2); border-color: #ff6b6b;">
                            🗑️ Clear
                        </button>
                    </div>

                    <div id="customQueryStats" style="margin-top: 15px; padding: 12px; background: rgba(0, 212, 255, 0.1); border-radius: 6px; border: 1px solid #00d4ff;">
                        <strong>📊 Custom Query Stats:</strong>
                        <div style="margin-top: 8px; font-size: 13px;">
                            • Queries loaded: <span id="customQueriesCount">0</span><br>
                            • Patterns extracted: <span id="customPatternsCount">0</span><br>
                            • Categories with custom data: <span id="customCategoriesCount">0</span>
                        </div>
                    </div>

                    <div id="customExtractionProgress" style="display: none; margin-top: 15px;">
                        <div class="progress-container">
                            <div class="progress-bar">
                                <div class="progress-fill" id="customProgressFill">0%</div>
                            </div>
                        </div>
                        <div id="customExtractionStatus" class="status-message info"></div>
                    </div>
                </div>

                <div class="section" style="margin-top: 20px;">
                    <h3>📂 Import Custom Queries from File</h3>
                    
                    <div class="info-box">
                        <strong>Bulk Import:</strong> Upload a text file with queries (one per line) or a JSON file 
                        with structured query data.
                    </div>

                    <div style="display: flex; gap: 10px; align-items: center; margin-top: 15px;">
                        <input type="file" id="customQueryFile" accept=".txt,.json" 
                               style="flex: 1; padding: 10px; background: rgba(10, 25, 47, 0.8); color: #fff; border: 1px solid #00d4ff; border-radius: 4px;">
                        <button class="btn btn-primary" onclick="window.CustomExtractor.importQueriesFromFile()" style="flex: 0.3;">
                            📥 Import
                        </button>
                        <button class="btn" onclick="window.CustomExtractor.exportQueries()" style="flex: 0.3; background: rgba(0, 212, 255, 0.2);">
                            📤 Export
                        </button>
                    </div>
                </div>
            `;

            // Insert before the first section in Advanced Extractor
            const firstSection = advExtractorDiv.querySelector('.section');
            if (firstSection) {
                firstSection.insertAdjacentHTML('beforebegin', customUI);
            } else {
                advExtractorDiv.insertAdjacentHTML('beforeend', customUI);
            }

            // Populate category dropdown
            this.populateCategoryDropdown();

            console.log('✅ Custom UI injected');
        },

        /**
         * Populate category dropdown with all available categories
         */
        populateCategoryDropdown() {
            const select = document.getElementById('customQueryCategory');
            if (!select || !window.AdvancedPatternExtractor) return;

            const hierarchy = window.AdvancedPatternExtractor.categoryHierarchy;
            
            for (const [parentKey, parent] of Object.entries(hierarchy)) {
                for (const [childKey, child] of Object.entries(parent.children)) {
                    const option = document.createElement('option');
                    option.value = childKey;
                    option.textContent = `${parent.name} → ${child.name}`;
                    select.appendChild(option);
                }
            }
        },

        /**
         * Save custom queries to memory and localStorage
         */
        saveCustomQueries() {
            const category = document.getElementById('customQueryCategory').value;
            const queriesText = document.getElementById('customQueryInput').value;

            if (!category) {
                alert('Please select a category first');
                return;
            }

            if (!queriesText.trim()) {
                alert('Please enter at least one query');
                return;
            }

            // Parse queries (one per line)
            const queries = queriesText
                .split('\n')
                .map(q => q.trim())
                .filter(q => q.length > 5); // Minimum 5 characters

            if (queries.length === 0) {
                alert('No valid queries found. Please enter at least one query (minimum 5 characters).');
                return;
            }

            // Store in memory
            this.customQueries[category] = queries;
            this.stats.customQueriesLoaded = this.getTotalCustomQueries();
            this.stats.lastUpdate = Date.now();

            // Save to localStorage
            try {
                localStorage.setItem('aevov_custom_queries', JSON.stringify(this.customQueries));
                localStorage.setItem('aevov_custom_stats', JSON.stringify(this.stats));
            } catch (e) {
                console.warn('Could not save to localStorage:', e);
            }

            // Update stats display
            this.updateStatsDisplay();

            alert(`✅ Saved ${queries.length} custom queries for ${category}!`);
            console.log(`💾 Saved ${queries.length} custom queries for ${category}`);
        },

        /**
         * Extract patterns from custom queries
         */
        async extractFromCustom() {
            const category = document.getElementById('customQueryCategory').value;
            
            if (!category) {
                alert('Please select a category first');
                return;
            }

            if (!this.customQueries[category] || this.customQueries[category].length === 0) {
                alert('No custom queries saved for this category. Please add and save queries first.');
                return;
            }

            const queries = this.customQueries[category];
            console.log(`🚀 Extracting patterns from ${queries.length} custom queries...`);

            // Show progress UI
            const progressDiv = document.getElementById('customExtractionProgress');
            const statusDiv = document.getElementById('customExtractionStatus');
            const progressFill = document.getElementById('customProgressFill');

            progressDiv.style.display = 'block';
            statusDiv.textContent = 'Starting extraction...';
            progressFill.style.width = '0%';
            progressFill.textContent = '0%';

            try {
                const patterns = [];
                const totalQueries = queries.length;

                // Extract patterns from each query
                for (let i = 0; i < totalQueries; i++) {
                    const query = queries[i];
                    const progress = ((i + 1) / totalQueries * 100).toFixed(1);
                    
                    statusDiv.textContent = `Processing query ${i + 1}/${totalQueries}: "${query.substring(0, 40)}..."`;
                    progressFill.style.width = progress + '%';
                    progressFill.textContent = progress + '%';

                    // Generate pattern from this query
                    const pattern = await this.generatePatternFromQuery(query, category);
                    patterns.push(pattern);

                    // Small delay for UI update
                    await new Promise(resolve => setTimeout(resolve, 50));
                }

                // Store patterns in the system
                if (!window.advancedPatterns) {
                    window.advancedPatterns = {};
                }
                if (!window.advancedPatterns[category]) {
                    window.advancedPatterns[category] = [];
                }

                window.advancedPatterns[category].push(...patterns);

                // Update stats
                this.stats.patternsFromCustom += patterns.length;
                
                try {
                    localStorage.setItem('aevov_custom_stats', JSON.stringify(this.stats));
                } catch (e) {
                    console.warn('Could not save stats');
                }

                // Success!
                statusDiv.className = 'status-message success';
                statusDiv.textContent = `✅ Successfully extracted ${patterns.length} patterns from your custom queries!`;
                
                this.updateStatsDisplay();

                // Update global pattern stats if function exists
                if (typeof window.updateAdvancedStats === 'function') {
                    window.updateAdvancedStats();
                }

                console.log(`✅ Extracted ${patterns.length} patterns from custom queries`);

                setTimeout(() => {
                    progressDiv.style.display = 'none';
                }, 3000);

            } catch (error) {
                statusDiv.className = 'status-message error';
                statusDiv.textContent = `❌ Error: ${error.message}`;
                console.error('Extraction error:', error);
            }
        },

        /**
         * Generate a pattern from a single query
         */
        async generatePatternFromQuery(query, category) {
            // Extract keywords from query
            const keywords = this.extractKeywords(query);

            // Create embedding
            const embedding = this.createEmbedding(keywords);

            // Generate pattern object
            const pattern = {
                id: `custom_${category}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                category: category,
                categoryName: category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                keywords: keywords,
                sourceQuery: query,
                template: btoa(`// Generated from: ${query}\n// TODO: Implement this functionality`),
                embedding: embedding,
                confidence: 0.88, // High confidence for user-provided data
                intent: this.inferIntent(query),
                votes: 5,
                synthetic: false,
                custom: true, // Mark as custom
                timestamp: Date.now()
            };

            return pattern;
        },

        /**
         * Extract keywords from a query
         */
        extractKeywords(query) {
            const stopWords = new Set([
                'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
                'has', 'he', 'in', 'is', 'it', 'of', 'on', 'that', 'the', 'to',
                'was', 'will', 'with'
            ]);

            // Tokenize
            const tokens = query
                .toLowerCase()
                .replace(/[^\w\s]/g, ' ')
                .split(/\s+/)
                .filter(t => t.length > 2 && !stopWords.has(t));

            // Remove duplicates
            return [...new Set(tokens)];
        },

        /**
         * Create embedding from keywords
         */
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

            // Normalize
            const magnitude = Math.sqrt(
                embedding.reduce((sum, val) => sum + val * val, 0)
            );
            
            return magnitude > 0 ? embedding.map(v => v / magnitude) : embedding;
        },

        /**
         * Infer intent from query
         */
        inferIntent(query) {
            const lower = query.toLowerCase();
            
            if (/^(build|create|make|implement|design)/.test(lower)) {
                return 'code_generation';
            } else if (/^(what|explain|how does|tell me)/.test(lower)) {
                return 'explanation';
            } else if (/^(optimize|improve|enhance)/.test(lower)) {
                return 'optimization';
            } else if (/^(debug|fix|solve)/.test(lower)) {
                return 'debugging';
            } else {
                return 'general';
            }
        },

        /**
         * Import queries from file
         */
        async importQueriesFromFile() {
            const fileInput = document.getElementById('customQueryFile');
            const file = fileInput.files[0];

            if (!file) {
                alert('Please select a file first');
                return;
            }

            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const content = e.target.result;
                    let queries = [];
                    let category = document.getElementById('customQueryCategory').value;

                    if (!category) {
                        alert('Please select a category first');
                        return;
                    }

                    // Parse based on file type
                    if (file.name.endsWith('.json')) {
                        const data = JSON.parse(content);
                        
                        // Support multiple formats
                        if (Array.isArray(data)) {
                            queries = data;
                        } else if (data.queries) {
                            queries = data.queries;
                            if (data.category) category = data.category;
                        } else {
                            throw new Error('Invalid JSON format. Expected array or {queries: [...]}');
                        }
                    } else {
                        // Text file - one query per line
                        queries = content.split('\n')
                            .map(q => q.trim())
                            .filter(q => q.length > 5);
                    }

                    if (queries.length === 0) {
                        alert('No valid queries found in file');
                        return;
                    }

                    // Store queries
                    this.customQueries[category] = queries;
                    this.stats.customQueriesLoaded = this.getTotalCustomQueries();
                    
                    // Update UI
                    document.getElementById('customQueryInput').value = queries.join('\n');
                    document.getElementById('customQueryCategory').value = category;

                    // Save
                    try {
                        localStorage.setItem('aevov_custom_queries', JSON.stringify(this.customQueries));
                        localStorage.setItem('aevov_custom_stats', JSON.stringify(this.stats));
                    } catch (err) {
                        console.warn('Could not save to localStorage');
                    }

                    this.updateStatsDisplay();

                    alert(`✅ Imported ${queries.length} queries for ${category}!`);
                    console.log(`📥 Imported ${queries.length} queries from ${file.name}`);

                } catch (error) {
                    alert(`Error parsing file: ${error.message}`);
                    console.error('Import error:', error);
                }
            };

            reader.readAsText(file);
        },

        /**
         * Export queries to file
         */
        exportQueries() {
            if (Object.keys(this.customQueries).length === 0) {
                alert('No custom queries to export');
                return;
            }

            const data = {
                version: '1.0',
                exported: new Date().toISOString(),
                queries: this.customQueries
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], {
                type: 'application/json'
            });

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `aevov_custom_queries_${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);

            console.log('📤 Exported custom queries');
        },

        /**
         * Clear custom queries
         */
        clearCustomQueries() {
            const category = document.getElementById('customQueryCategory').value;
            
            if (!category) {
                if (confirm('Clear ALL custom queries from all categories?')) {
                    this.customQueries = {};
                    this.stats.customQueriesLoaded = 0;
                    document.getElementById('customQueryInput').value = '';
                }
            } else {
                if (confirm(`Clear custom queries for ${category}?`)) {
                    delete this.customQueries[category];
                    this.stats.customQueriesLoaded = this.getTotalCustomQueries();
                    document.getElementById('customQueryInput').value = '';
                }
            }

            // Save
            try {
                localStorage.setItem('aevov_custom_queries', JSON.stringify(this.customQueries));
                localStorage.setItem('aevov_custom_stats', JSON.stringify(this.stats));
            } catch (e) {
                console.warn('Could not save');
            }

            this.updateStatsDisplay();
        },

        /**
         * Load saved queries from localStorage
         */
        loadSavedQueries() {
            try {
                const saved = localStorage.getItem('aevov_custom_queries');
                const stats = localStorage.getItem('aevov_custom_stats');

                if (saved) {
                    this.customQueries = JSON.parse(saved);
                    console.log('📂 Loaded saved custom queries');
                }

                if (stats) {
                    this.stats = JSON.parse(stats);
                }

                this.updateStatsDisplay();

            } catch (e) {
                console.warn('Could not load saved queries:', e);
            }
        },

        /**
         * Update stats display
         */
        updateStatsDisplay() {
            const queriesCount = this.getTotalCustomQueries();
            const categoriesCount = Object.keys(this.customQueries).length;

            document.getElementById('customQueriesCount').textContent = queriesCount;
            document.getElementById('customPatternsCount').textContent = this.stats.patternsFromCustom;
            document.getElementById('customCategoriesCount').textContent = categoriesCount;
        },

        /**
         * Get total custom queries
         */
        getTotalCustomQueries() {
            let total = 0;
            for (const category in this.customQueries) {
                total += this.customQueries[category].length;
            }
            return total;
        },

        /**
         * Enhance existing extractor to use custom queries
         */
        enhanceExtractor() {
            // Override the extract function to check for custom queries first
            if (window.extractCategory) {
                const originalExtract = window.extractCategory;
                
                window.extractCategory = async (category, count) => {
                    // Check if custom queries exist for this category
                    if (this.customQueries[category] && this.customQueries[category].length > 0) {
                        console.log(`🎯 Using ${this.customQueries[category].length} custom queries for ${category}`);
                        
                        // Use custom queries instead of hardcoded samples
                        const customCount = Math.min(count, this.customQueries[category].length);
                        const queries = this.customQueries[category].slice(0, customCount);
                        
                        // Generate patterns from custom queries
                        const patterns = [];
                        for (const query of queries) {
                            const pattern = await this.generatePatternFromQuery(query, category);
                            patterns.push(pattern);
                        }
                        
                        // Store patterns
                        if (!window.advancedPatterns) window.advancedPatterns = {};
                        if (!window.advancedPatterns[category]) window.advancedPatterns[category] = [];
                        window.advancedPatterns[category].push(...patterns);
                        
                        this.stats.patternsFromCustom += patterns.length;
                        this.updateStatsDisplay();
                        
                        return patterns;
                    } else {
                        // Fall back to original function (hardcoded samples)
                        return originalExtract(category, count);
                    }
                };

                console.log('✅ Enhanced extractor to use custom queries');
            }
        }
    };

    // Export globally
    window.CustomExtractor = CustomExtractor;

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => CustomExtractor.init(), 1500);
        });
    } else {
        setTimeout(() => CustomExtractor.init(), 1500);
    }

    console.log('✅ Custom Pattern Extractor loaded');
    console.log('📝 Add your own training queries for better patterns!');

})();
