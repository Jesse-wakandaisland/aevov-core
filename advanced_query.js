/**
 * ADVANCED QUERY BUILDER
 * Pattern-driven SQL query generation system
 * 
 * Features:
 * - Visual query building from patterns
 * - Natural language to SQL conversion
 * - Pattern-based query templates
 * - Semantic query optimization
 * - Multi-database support (PostgreSQL, MySQL, SQLite)
 * - Query validation and security
 * - Performance optimization
 */

(function() {
    'use strict';

    console.log('🔍 Loading Advanced Query Builder...');

    const AdvancedQueryBuilder = {
        version: '1.0.0',

        // Configuration
        config: {
            defaultDatabase: 'postgresql',
            enableOptimization: true,
            enableSecurity: true,
            maxQueryComplexity: 100,
            usePatternTemplates: true
        },

        // State
        state: {
            initialized: false,
            currentQuery: null,
            queryHistory: [],
            patternTemplates: new Map(),
            interfaceOpen: false,
            savedQueries: [],
            schemaCache: null,
            lastPerformance: null,
            lastResults: null,
            lastSQL: null
        },

        // Database dialects
        dialects: {
            postgresql: {
                placeholder: (i) => `$${i}`,
                limit: (n) => `LIMIT ${n}`,
                offset: (n) => `OFFSET ${n}`,
                concat: (a, b) => `${a} || ${b}`,
                ilike: 'ILIKE',
                jsonExtract: (field, path) => `${field}->>'${path}'`
            },
            mysql: {
                placeholder: (i) => '?',
                limit: (n) => `LIMIT ${n}`,
                offset: (n) => `OFFSET ${n}`,
                concat: (a, b) => `CONCAT(${a}, ${b})`,
                ilike: 'LIKE',
                jsonExtract: (field, path) => `JSON_EXTRACT(${field}, '$.${path}')`
            },
            sqlite: {
                placeholder: (i) => '?',
                limit: (n) => `LIMIT ${n}`,
                offset: (n) => `OFFSET ${n}`,
                concat: (a, b) => `${a} || ${b}`,
                ilike: 'LIKE',
                jsonExtract: (field, path) => `json_extract(${field}, '$.${path}')`
            }
        },

        /**
         * INITIALIZE
         */
        async init() {
            if (this.state.initialized) {
                console.warn('⚠️ Query Builder already initialized');
                return;
            }

            console.log('⚡ Initializing Advanced Query Builder...');

            // Load pattern templates
            await this.loadPatternTemplates();

            // Load saved queries
            this.loadSavedQueries();

            // Load database schema
            await this.loadSchema();

            // Create interface
            this.createInterface();

            // Setup keyboard shortcuts
            this.setupKeyboardShortcuts();

            this.state.initialized = true;
            console.log('✅ Advanced Query Builder ready!');
        },

        /**
         * LOAD PATTERN TEMPLATES
         * Create query templates from AEVOV patterns
         */
        async loadPatternTemplates() {
            console.log('📋 Loading pattern-based query templates...');

            // Get patterns from system
            let patterns = [];
            if (window.gatherAllPatterns) {
                patterns = window.gatherAllPatterns();
            }

            // Create templates from patterns
            patterns.forEach(pattern => {
                const template = this.patternToQueryTemplate(pattern);
                if (template) {
                    this.state.patternTemplates.set(pattern.id, template);
                }
            });

            console.log(`✓ Loaded ${this.state.patternTemplates.size} query templates`);
        },

        /**
         * PATTERN TO QUERY TEMPLATE
         */
        patternToQueryTemplate(pattern) {
            // Convert pattern to SQL query template
            const keywords = pattern.keywords || [];
            const category = pattern.category || 'general';

            // Create template based on pattern type
            if (category.includes('search') || keywords.some(k => k.includes('find'))) {
                return {
                    type: 'search',
                    template: `SELECT * FROM {table} WHERE {conditions}`,
                    conditions: keywords.map(k => `${k} ILIKE '%{value}%'`),
                    pattern
                };
            } else if (category.includes('aggregate') || keywords.some(k => ['count', 'sum', 'avg'].includes(k))) {
                return {
                    type: 'aggregate',
                    template: `SELECT {aggregates} FROM {table} GROUP BY {groupBy}`,
                    aggregates: ['COUNT(*)', 'SUM({column})', 'AVG({column})'],
                    pattern
                };
            } else if (category.includes('join') || keywords.some(k => k.includes('related'))) {
                return {
                    type: 'join',
                    template: `SELECT * FROM {table1} JOIN {table2} ON {condition}`,
                    pattern
                };
            }

            // Default template
            return {
                type: 'select',
                template: `SELECT * FROM {table} WHERE {conditions}`,
                pattern
            };
        },

        /**
         * BUILD QUERY FROM PATTERN
         */
        buildFromPattern(patternId, params = {}) {
            const template = this.state.patternTemplates.get(patternId);
            if (!template) {
                throw new Error('Pattern template not found');
            }

            let query = template.template;

            // Find all placeholders in template
            const placeholders = query.match(/\{([^}]+)\}/g);
            if (placeholders) {
                const missingParams = [];
                
                placeholders.forEach(placeholder => {
                    const key = placeholder.slice(1, -1); // Remove { and }
                    
                    if (params[key] !== undefined && params[key] !== '') {
                        query = query.replace(new RegExp(`\\{${key}\\}`, 'g'), params[key]);
                    } else {
                        missingParams.push(key);
                    }
                });

                // If there are missing required parameters, throw error
                if (missingParams.length > 0) {
                    throw new Error(`Missing required parameters: ${missingParams.join(', ')}`);
                }
            }

            return query;
        },

        /**
         * NATURAL LANGUAGE TO SQL
         */
        async naturalLanguageToSQL(nlQuery) {
            console.log('🗣️ Converting natural language to SQL:', nlQuery);

            // Check if NLP is available
            if (!window.nlp) {
                console.warn('⚠️ NLP library not available, using simple pattern matching');
                return this.simpleNLParsing(nlQuery);
            }

            const doc = nlp(nlQuery);

            // Extract intent
            const intent = this.extractIntent(doc);

            // Extract entities
            const entities = this.extractEntities(doc);

            // Build SQL query
            const sql = this.buildSQLFromIntent(intent, entities);

            return sql;
        },

        /**
         * SIMPLE NL PARSING (fallback when NLP not available)
         */
        simpleNLParsing(nlQuery) {
            const lower = nlQuery.toLowerCase();
            let sql = '';

            // Extract table name (look for common table-related words)
            let table = 'patterns'; // default
            const tableMatch = lower.match(/from\s+(\w+)|in\s+(\w+)|(\w+)\s+table/);
            if (tableMatch) {
                table = tableMatch[1] || tableMatch[2] || tableMatch[3];
            }

            // Determine query type
            if (lower.includes('count') || lower.includes('how many')) {
                sql = `SELECT COUNT(*) as count FROM ${table}`;
            } else if (lower.includes('sum') || lower.includes('total')) {
                sql = `SELECT SUM(value) as total FROM ${table}`;
            } else if (lower.includes('average') || lower.includes('avg')) {
                sql = `SELECT AVG(value) as average FROM ${table}`;
            } else if (lower.includes('group by') || lower.includes('grouped')) {
                const groupBy = lower.match(/group(?:ed)?\s+by\s+(\w+)/)?.[1] || 'category';
                sql = `SELECT ${groupBy}, COUNT(*) as count FROM ${table} GROUP BY ${groupBy}`;
            } else {
                // Default SELECT
                sql = `SELECT * FROM ${table}`;
            }

            // Add WHERE conditions if found
            const whereMatch = lower.match(/where\s+(\w+)\s+(=|>|<|like)\s+['"]?(\w+)['"]?/);
            if (whereMatch) {
                const [, field, op, value] = whereMatch;
                if (!sql.includes('WHERE')) {
                    sql += ` WHERE ${field} ${op} '${value}'`;
                }
            }

            // Add LIMIT
            if (!sql.includes('LIMIT')) {
                sql += ' LIMIT 100';
            }

            return sql;
        },

        /**
         * EXTRACT INTENT
         */
        extractIntent(doc) {
            const text = doc.text().toLowerCase();

            if (text.includes('find') || text.includes('search') || text.includes('show')) {
                return 'select';
            } else if (text.includes('count') || text.includes('how many')) {
                return 'count';
            } else if (text.includes('sum') || text.includes('total')) {
                return 'sum';
            } else if (text.includes('average') || text.includes('mean')) {
                return 'avg';
            } else if (text.includes('group') || text.includes('by category')) {
                return 'group';
            } else if (text.includes('join') || text.includes('combine')) {
                return 'join';
            }

            return 'select'; // Default
        },

        /**
         * EXTRACT ENTITIES
         */
        extractEntities(doc) {
            const entities = {
                table: null,
                columns: [],
                conditions: [],
                values: []
            };

            // Extract nouns as potential table names
            const nouns = doc.nouns().out('array');
            if (nouns.length > 0) {
                entities.table = nouns[0].toLowerCase() + 's'; // Pluralize for table name
            }

            // Extract values
            const values = doc.values().out('array');
            entities.values = values;

            // Extract conditions from patterns
            if (doc.has('where')) {
                // Simple condition extraction
                entities.conditions.push('1=1'); // Placeholder
            }

            return entities;
        },

        /**
         * BUILD SQL FROM INTENT
         */
        buildSQLFromIntent(intent, entities) {
            const dialect = this.dialects[this.config.defaultDatabase];

            switch (intent) {
                case 'select':
                    return this.buildSelectQuery(entities, dialect);
                case 'count':
                    return this.buildCountQuery(entities, dialect);
                case 'sum':
                    return this.buildAggregateQuery('SUM', entities, dialect);
                case 'avg':
                    return this.buildAggregateQuery('AVG', entities, dialect);
                case 'group':
                    return this.buildGroupQuery(entities, dialect);
                default:
                    return this.buildSelectQuery(entities, dialect);
            }
        },

        /**
         * BUILD SELECT QUERY
         */
        buildSelectQuery(entities, dialect) {
            const columns = entities.columns.length > 0 ? entities.columns.join(', ') : '*';
            const table = entities.table || 'patterns';
            const conditions = entities.conditions.length > 0 ? entities.conditions.join(' AND ') : '1=1';

            return `SELECT ${columns} FROM ${table} WHERE ${conditions}`;
        },

        /**
         * BUILD COUNT QUERY
         */
        buildCountQuery(entities, dialect) {
            const table = entities.table || 'patterns';
            const conditions = entities.conditions.length > 0 ? entities.conditions.join(' AND ') : '1=1';

            return `SELECT COUNT(*) as count FROM ${table} WHERE ${conditions}`;
        },

        /**
         * BUILD AGGREGATE QUERY
         */
        buildAggregateQuery(func, entities, dialect) {
            const table = entities.table || 'patterns';
            const column = entities.columns[0] || 'id';
            const conditions = entities.conditions.length > 0 ? entities.conditions.join(' AND ') : '1=1';

            return `SELECT ${func}(${column}) as result FROM ${table} WHERE ${conditions}`;
        },

        /**
         * BUILD GROUP QUERY
         */
        buildGroupQuery(entities, dialect) {
            const table = entities.table || 'patterns';
            const groupBy = entities.columns[0] || 'category';

            return `SELECT ${groupBy}, COUNT(*) as count FROM ${table} GROUP BY ${groupBy}`;
        },

        /**
         * VISUAL QUERY BUILDER
         */
        buildVisual(config) {
            const query = {
                select: config.columns || ['*'],
                from: config.table,
                where: [],
                groupBy: config.groupBy || [],
                orderBy: config.orderBy || [],
                limit: config.limit,
                offset: config.offset
            };

            // Build WHERE clauses
            if (config.filters) {
                config.filters.forEach(filter => {
                    query.where.push(this.buildCondition(filter));
                });
            }

            return this.assembleQuery(query);
        },

        /**
         * BUILD CONDITION
         */
        buildCondition(filter) {
            const { field, operator, value } = filter;

            switch (operator) {
                case 'equals':
                    return `${field} = '${value}'`;
                case 'not_equals':
                    return `${field} != '${value}'`;
                case 'contains':
                    return `${field} ILIKE '%${value}%'`;
                case 'starts_with':
                    return `${field} ILIKE '${value}%'`;
                case 'ends_with':
                    return `${field} ILIKE '%${value}'`;
                case 'greater_than':
                    return `${field} > ${value}`;
                case 'less_than':
                    return `${field} < ${value}`;
                case 'in':
                    return `${field} IN (${value.map(v => `'${v}'`).join(', ')})`;
                case 'between':
                    return `${field} BETWEEN ${value[0]} AND ${value[1]}`;
                case 'is_null':
                    return `${field} IS NULL`;
                case 'is_not_null':
                    return `${field} IS NOT NULL`;
                default:
                    return `${field} = '${value}'`;
            }
        },

        /**
         * ASSEMBLE QUERY
         */
        assembleQuery(query) {
            let sql = `SELECT ${query.select.join(', ')} FROM ${query.from}`;

            if (query.where.length > 0) {
                sql += ` WHERE ${query.where.join(' AND ')}`;
            }

            if (query.groupBy.length > 0) {
                sql += ` GROUP BY ${query.groupBy.join(', ')}`;
            }

            if (query.orderBy.length > 0) {
                sql += ` ORDER BY ${query.orderBy.join(', ')}`;
            }

            if (query.limit) {
                sql += ` LIMIT ${query.limit}`;
            }

            if (query.offset) {
                sql += ` OFFSET ${query.offset}`;
            }

            return sql;
        },

        /**
         * OPTIMIZE QUERY
         */
        optimizeQuery(sql) {
            if (!this.config.enableOptimization) return sql;

            console.log('⚡ Optimizing query...');

            let optimized = sql;

            // Remove unnecessary SELECT *
            if (optimized.includes('SELECT *') && !optimized.includes('COUNT(*)')) {
                console.log('  💡 Consider selecting specific columns instead of *');
            }

            // Add index hints
            if (optimized.includes('WHERE') && !optimized.includes('INDEX')) {
                console.log('  💡 Consider adding indexes on WHERE clause columns');
            }

            // Limit results if no LIMIT specified
            if (!optimized.includes('LIMIT')) {
                optimized += ' LIMIT 1000';
                console.log('  ✓ Added LIMIT 1000 for safety');
            }

            return optimized;
        },

        /**
         * VALIDATE QUERY
         */
        validateQuery(sql) {
            if (!this.config.enableSecurity) return { valid: true };

            console.log('🔒 Validating query security...');

            const issues = [];

            // Check for SQL injection patterns
            const injectionPatterns = [
                /;\s*(DROP|DELETE|UPDATE|INSERT)/i,
                /--/,
                /\/\*/,
                /xp_/i,
                /sp_/i
            ];

            injectionPatterns.forEach(pattern => {
                if (pattern.test(sql)) {
                    issues.push('Potential SQL injection detected');
                }
            });

            // Check for dangerous operations
            if (/DROP|TRUNCATE|ALTER/i.test(sql)) {
                issues.push('Dangerous DDL operation detected');
            }

            // Check complexity
            const complexity = this.calculateComplexity(sql);
            if (complexity > this.config.maxQueryComplexity) {
                issues.push(`Query too complex (${complexity} > ${this.config.maxQueryComplexity})`);
            }

            return {
                valid: issues.length === 0,
                issues
            };
        },

        /**
         * CALCULATE COMPLEXITY
         */
        calculateComplexity(sql) {
            let complexity = 0;

            // Count JOINs
            complexity += (sql.match(/JOIN/gi) || []).length * 10;

            // Count subqueries
            complexity += (sql.match(/SELECT.*FROM.*SELECT/gi) || []).length * 20;

            // Count WHERE conditions
            complexity += (sql.match(/AND|OR/gi) || []).length * 2;

            // Count GROUP BY
            complexity += (sql.match(/GROUP BY/gi) || []).length * 5;

            return complexity;
        },

        /**
         * EXECUTE QUERY
         */
        async executeQuery(sql, params = []) {
            console.log('🚀 Executing query:', sql);

            // Start performance timer
            const startTime = performance.now();

            // Validate
            const validation = this.validateQuery(sql);
            if (!validation.valid) {
                throw new Error(`Query validation failed: ${validation.issues.join(', ')}`);
            }

            // Optimize
            sql = this.optimizeQuery(sql);

            // Execute using database
            if (window.ComprehensiveDB?.state?.pglite) {
                const result = await window.ComprehensiveDB.state.pglite.query(sql, params);
                
                // Calculate performance metrics
                const endTime = performance.now();
                const executionTime = endTime - startTime;

                // Store performance data
                this.state.lastPerformance = {
                    executionTime: executionTime.toFixed(2),
                    rowCount: result.rows.length,
                    timestamp: new Date().toISOString()
                };

                console.log(`⚡ Query executed in ${executionTime.toFixed(2)}ms, returned ${result.rows.length} rows`);

                // Add to history with performance data
                this.state.queryHistory.push({
                    sql,
                    params,
                    timestamp: new Date().toISOString(),
                    rowCount: result.rows.length,
                    executionTime: executionTime.toFixed(2)
                });

                // Keep only last 50 queries
                if (this.state.queryHistory.length > 50) {
                    this.state.queryHistory.shift();
                }

                return result.rows;
            } else {
                throw new Error('Database not available');
            }
        },

        /**
         * CREATE INTERFACE
         */
        createInterface() {
            const container = document.createElement('div');
            container.id = 'queryBuilderInterface';
            container.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 1000px;
                max-width: 90vw;
                max-height: 85vh;
                background: linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%);
                border: 3px solid #00d4ff;
                border-radius: 15px;
                box-shadow: 0 20px 60px rgba(0, 212, 255, 0.4);
                z-index: 10000;
                display: none;
                overflow-y: auto;
            `;

            container.innerHTML = `
                <div style="background: linear-gradient(135deg, #00d4ff 0%, #3a47d5 100%); padding: 20px; color: white; position: sticky; top: 0; z-index: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h2 style="margin: 0;">🔍 Advanced Query Builder</h2>
                            <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 14px;">Pattern-Driven SQL Generator</p>
                        </div>
                        <button onclick="window.AdvancedQueryBuilder.toggleInterface()" style="
                            background: rgba(255,255,255,0.2);
                            border: none;
                            color: white;
                            width: 35px;
                            height: 35px;
                            border-radius: 50%;
                            cursor: pointer;
                            font-size: 20px;
                        ">✕</button>
                    </div>
                </div>

                <div style="padding: 25px; color: white;">
                    
                    <!-- Tabs -->
                    <div style="display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 2px solid rgba(255,255,255,0.1); flex-wrap: wrap;">
                        <button class="qb-tab active" onclick="window.AdvancedQueryBuilder.switchTab('visual')" style="
                            padding: 10px 20px;
                            background: transparent;
                            border: none;
                            color: white;
                            cursor: pointer;
                            border-bottom: 3px solid #00d4ff;
                        ">Visual Builder</button>
                        <button class="qb-tab" onclick="window.AdvancedQueryBuilder.switchTab('natural')" style="
                            padding: 10px 20px;
                            background: transparent;
                            border: none;
                            color: white;
                            cursor: pointer;
                        ">Natural Language</button>
                        <button class="qb-tab" onclick="window.AdvancedQueryBuilder.switchTab('pattern')" style="
                            padding: 10px 20px;
                            background: transparent;
                            border: none;
                            color: white;
                            cursor: pointer;
                        ">From Pattern</button>
                        <button class="qb-tab" onclick="window.AdvancedQueryBuilder.switchTab('sql')" style="
                            padding: 10px 20px;
                            background: transparent;
                            border: none;
                            color: white;
                            cursor: pointer;
                        ">Raw SQL</button>
                        <button class="qb-tab" onclick="window.AdvancedQueryBuilder.switchTab('schema')" style="
                            padding: 10px 20px;
                            background: transparent;
                            border: none;
                            color: white;
                            cursor: pointer;
                        ">Schema</button>
                        <button class="qb-tab" onclick="window.AdvancedQueryBuilder.switchTab('saved')" style="
                            padding: 10px 20px;
                            background: transparent;
                            border: none;
                            color: white;
                            cursor: pointer;
                        ">Saved (${this.state.savedQueries.length})</button>
                        <button class="qb-tab" onclick="window.AdvancedQueryBuilder.switchTab('history')" style="
                            padding: 10px 20px;
                            background: transparent;
                            border: none;
                            color: white;
                            cursor: pointer;
                        ">History</button>
                    </div>

                    <!-- Tab Content -->
                    <div id="qbTabContent" style="min-height: 400px;"></div>

                    <!-- Results -->
                    <div id="qbResults" style="margin-top: 20px; display: none;">
                        <h3 style="color: #00d4ff;">Results</h3>
                        <div id="qbResultsContent" style="
                            background: rgba(0,0,0,0.3);
                            padding: 15px;
                            border-radius: 8px;
                            max-height: 300px;
                            overflow: auto;
                        "></div>
                    </div>
                </div>
            `;

            document.body.appendChild(container);

            // Create floating button
            this.createFloatingButton();

            // Initialize with visual tab
            this.switchTab('visual');

            console.log('✅ Query Builder interface created');
        },

        /**
         * CREATE FLOATING BUTTON
         */
        createFloatingButton() {
            const button = document.createElement('button');
            button.id = 'queryBuilderFloatingBtn';
            button.innerHTML = '🔍<br><span style="font-size: 10px;">SQL</span>';
            button.onclick = () => this.toggleInterface();
            button.style.cssText = `
                position: fixed;
                left: 20px;
                top: 50%;
                transform: translateY(-50%);
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #00d4ff 0%, #3a47d5 100%);
                border: 3px solid rgba(0, 212, 255, 0.5);
                border-radius: 12px;
                color: white;
                font-size: 20px;
                font-weight: bold;
                cursor: pointer;
                z-index: 9999;
                box-shadow: 0 4px 15px rgba(0, 212, 255, 0.4);
                transition: all 0.3s ease;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                line-height: 1;
                padding: 8px;
            `;

            // Hover effect
            button.onmouseenter = () => {
                button.style.transform = 'translateY(-50%) scale(1.1)';
                button.style.boxShadow = '0 6px 20px rgba(0, 212, 255, 0.6)';
            };
            
            button.onmouseleave = () => {
                button.style.transform = 'translateY(-50%) scale(1)';
                button.style.boxShadow = '0 4px 15px rgba(0, 212, 255, 0.4)';
            };

            document.body.appendChild(button);
            console.log('✅ Query Builder floating button created');
        },

        /**
         * SWITCH TAB
         */
        switchTab(tab) {
            // Update tab buttons
            document.querySelectorAll('.qb-tab').forEach(btn => {
                btn.style.borderBottom = 'none';
                btn.classList.remove('active');
                
                // Highlight the active tab
                const btnText = btn.textContent.toLowerCase();
                const tabMatch = 
                    (tab === 'visual' && btnText.includes('visual')) ||
                    (tab === 'natural' && btnText.includes('natural')) ||
                    (tab === 'pattern' && btnText.includes('pattern')) ||
                    (tab === 'sql' && btnText.includes('raw sql')) ||
                    (tab === 'schema' && btnText.includes('schema')) ||
                    (tab === 'saved' && btnText.includes('saved')) ||
                    (tab === 'history' && btnText.includes('history'));
                
                if (tabMatch) {
                    btn.style.borderBottom = '3px solid #00d4ff';
                    btn.classList.add('active');
                }
            });

            // Render tab content
            const content = document.getElementById('qbTabContent');
            if (!content) return;
            
            switch(tab) {
                case 'visual':
                    content.innerHTML = this.renderVisualBuilder();
                    break;
                case 'natural':
                    content.innerHTML = this.renderNaturalLanguage();
                    break;
                case 'pattern':
                    content.innerHTML = this.renderPatternBuilder();
                    break;
                case 'sql':
                    content.innerHTML = this.renderRawSQL();
                    break;
                case 'schema':
                    content.innerHTML = this.renderSchemaBrowser();
                    break;
                case 'saved':
                    content.innerHTML = this.renderSavedQueries();
                    break;
                case 'history':
                    content.innerHTML = this.renderHistory();
                    break;
            }
        },

        /**
         * RENDER VISUAL BUILDER
         */
        renderVisualBuilder() {
            return `
                <div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 8px;">Table:</label>
                        <input type="text" id="qbTable" value="patterns" style="
                            width: 100%;
                            padding: 10px;
                            background: rgba(255,255,255,0.1);
                            border: 1px solid rgba(255,255,255,0.2);
                            color: white;
                            border-radius: 6px;
                        ">
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 8px;">Columns:</label>
                        <input type="text" id="qbColumns" value="*" placeholder="*, id, name, etc." style="
                            width: 100%;
                            padding: 10px;
                            background: rgba(255,255,255,0.1);
                            border: 1px solid rgba(255,255,255,0.2);
                            color: white;
                            border-radius: 6px;
                        ">
                    </div>

                    <div id="qbFilters">
                        <label style="display: block; margin-bottom: 8px;">Filters:</label>
                        <button onclick="window.AdvancedQueryBuilder.addFilter()" style="
                            padding: 8px 15px;
                            background: rgba(0, 212, 255, 0.2);
                            border: 1px solid #00d4ff;
                            color: white;
                            border-radius: 6px;
                            cursor: pointer;
                        ">+ Add Filter</button>
                        <div id="qbFiltersList" style="margin-top: 10px;"></div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0;">
                        <div>
                            <label style="display: block; margin-bottom: 8px;">Order By:</label>
                            <input type="text" id="qbOrderBy" placeholder="created_at DESC" style="
                                width: 100%;
                                padding: 10px;
                                background: rgba(255,255,255,0.1);
                                border: 1px solid rgba(255,255,255,0.2);
                                color: white;
                                border-radius: 6px;
                            ">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px;">Limit:</label>
                            <input type="number" id="qbLimit" value="100" style="
                                width: 100%;
                                padding: 10px;
                                background: rgba(255,255,255,0.1);
                                border: 1px solid rgba(255,255,255,0.2);
                                color: white;
                                border-radius: 6px;
                            ">
                        </div>
                    </div>

                    <button onclick="window.AdvancedQueryBuilder.executeVisualQuery()" style="
                        width: 100%;
                        padding: 12px;
                        background: linear-gradient(135deg, #00ff88 0%, #00d4ff 100%);
                        border: none;
                        color: white;
                        border-radius: 6px;
                        cursor: pointer;
                        font-weight: 600;
                        font-size: 16px;
                    ">🚀 Execute Query</button>
                </div>
            `;
        },

        /**
         * RENDER NATURAL LANGUAGE
         */
        renderNaturalLanguage() {
            return `
                <div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 8px;">Natural Language Query:</label>
                        <textarea id="qbNLQuery" placeholder="Find all patterns where category is technology" style="
                            width: 100%;
                            height: 100px;
                            padding: 10px;
                            background: rgba(255,255,255,0.1);
                            border: 1px solid rgba(255,255,255,0.2);
                            color: white;
                            border-radius: 6px;
                            resize: vertical;
                        "></textarea>
                    </div>

                    <div style="background: rgba(0, 212, 255, 0.1); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                        <strong>Examples:</strong>
                        <ul style="margin: 10px 0; padding-left: 20px;">
                            <li>Find all patterns in technology category</li>
                            <li>Count patterns where confidence is greater than 0.8</li>
                            <li>Show patterns grouped by category</li>
                            <li>Find patterns with keyword "algorithm"</li>
                        </ul>
                    </div>

                    <button onclick="window.AdvancedQueryBuilder.executeNLQuery()" style="
                        width: 100%;
                        padding: 12px;
                        background: linear-gradient(135deg, #00ff88 0%, #00d4ff 100%);
                        border: none;
                        color: white;
                        border-radius: 6px;
                        cursor: pointer;
                        font-weight: 600;
                        font-size: 16px;
                    ">🗣️ Convert to SQL & Execute</button>
                </div>
            `;
        },

        /**
         * RENDER PATTERN BUILDER
         */
        renderPatternBuilder() {
            const templates = Array.from(this.state.patternTemplates.entries());
            
            const html = `
                <div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 8px;">Select Pattern Template:</label>
                        <select id="qbPatternSelect" onchange="window.AdvancedQueryBuilder.updatePatternPreview()" style="
                            width: 100%;
                            padding: 10px;
                            background: rgba(255,255,255,0.1);
                            border: 1px solid rgba(255,255,255,0.2);
                            color: white;
                            border-radius: 6px;
                        ">
                            <option value="">-- Select Pattern --</option>
                            ${templates.map(([id, template]) => `
                                <option value="${id}">${template.pattern.category || 'Unknown'} - ${template.type}</option>
                            `).join('')}
                        </select>
                    </div>

                    <div id="qbPatternParams" style="margin-bottom: 15px;"></div>

                    <div style="background: rgba(0, 212, 255, 0.1); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                        <strong>Template Preview:</strong>
                        <pre id="qbTemplatePreview" style="margin-top: 10px; color: #00ff88; white-space: pre-wrap;">Select a pattern to see template</pre>
                    </div>

                    <button onclick="window.AdvancedQueryBuilder.executePatternQuery()" style="
                        width: 100%;
                        padding: 12px;
                        background: linear-gradient(135deg, #00ff88 0%, #00d4ff 100%);
                        border: none;
                        color: white;
                        border-radius: 6px;
                        cursor: pointer;
                        font-weight: 600;
                        font-size: 16px;
                    ">🎯 Build from Pattern</button>
                </div>
            `;

            return html;
        },

        /**
         * UPDATE PATTERN PREVIEW
         */
        updatePatternPreview() {
            const select = document.getElementById('qbPatternSelect');
            const preview = document.getElementById('qbTemplatePreview');
            const paramsDiv = document.getElementById('qbPatternParams');
            
            if (!select || !preview || !paramsDiv) return;

            const patternId = select.value;
            if (!patternId) {
                preview.textContent = 'Select a pattern to see template';
                paramsDiv.innerHTML = '';
                return;
            }

            const template = this.state.patternTemplates.get(patternId);
            if (!template) return;

            // Show template
            preview.textContent = template.template;

            // Extract parameters from template
            const paramMatches = template.template.match(/\{([^}]+)\}/g);
            if (paramMatches) {
                const uniqueParams = [...new Set(paramMatches.map(p => p.slice(1, -1)))];
                
                paramsDiv.innerHTML = `
                    <label style="display: block; margin-bottom: 8px;">Template Parameters:</label>
                    ${uniqueParams.map(param => `
                        <div style="margin-bottom: 10px;">
                            <input 
                                type="text" 
                                data-param="${param}"
                                placeholder="${param}"
                                style="
                                    width: 100%;
                                    padding: 8px;
                                    background: rgba(255,255,255,0.1);
                                    border: 1px solid rgba(255,255,255,0.2);
                                    color: white;
                                    border-radius: 4px;
                                "
                            >
                            <small style="color: rgba(255,255,255,0.6); font-size: 12px;">${param}</small>
                        </div>
                    `).join('')}
                `;
            } else {
                paramsDiv.innerHTML = '';
            }
        },

        /**
         * RENDER RAW SQL
         */
        renderRawSQL() {
            return `
                <div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 8px;">SQL Query:</label>
                        <textarea id="qbRawSQL" placeholder="SELECT * FROM patterns WHERE category = 'technology'" style="
                            width: 100%;
                            height: 200px;
                            padding: 10px;
                            background: rgba(0,0,0,0.3);
                            border: 1px solid rgba(255,255,255,0.2);
                            color: #00ff88;
                            border-radius: 6px;
                            font-family: monospace;
                            resize: vertical;
                        "></textarea>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                        <button onclick="window.AdvancedQueryBuilder.validateRawSQL()" style="
                            padding: 10px;
                            background: rgba(255, 159, 10, 0.2);
                            border: 1px solid #ff9f0a;
                            color: white;
                            border-radius: 6px;
                            cursor: pointer;
                        ">🔒 Validate</button>
                        
                        <button onclick="window.AdvancedQueryBuilder.optimizeRawSQL()" style="
                            padding: 10px;
                            background: rgba(0, 255, 136, 0.2);
                            border: 1px solid #00ff88;
                            color: white;
                            border-radius: 6px;
                            cursor: pointer;
                        ">⚡ Optimize</button>

                        <button onclick="window.AdvancedQueryBuilder.analyzeRawSQL()" style="
                            padding: 10px;
                            background: rgba(175, 82, 222, 0.2);
                            border: 1px solid #af52de;
                            color: white;
                            border-radius: 6px;
                            cursor: pointer;
                        ">📊 Analyze</button>
                    </div>

                    <button onclick="window.AdvancedQueryBuilder.executeRawSQL()" style="
                        width: 100%;
                        padding: 12px;
                        background: linear-gradient(135deg, #00ff88 0%, #00d4ff 100%);
                        border: none;
                        color: white;
                        border-radius: 6px;
                        cursor: pointer;
                        font-weight: 600;
                        font-size: 16px;
                    ">🚀 Execute Query</button>

                    <div id="qbAnalysisResults" style="margin-top: 15px; display: none;">
                        <h4 style="color: #00d4ff; margin-bottom: 10px;">Query Analysis:</h4>
                        <div id="qbAnalysisContent" style="
                            background: rgba(0,0,0,0.3);
                            padding: 15px;
                            border-radius: 8px;
                            max-height: 300px;
                            overflow: auto;
                        "></div>
                    </div>
                </div>
            `;
        },

        /**
         * TOGGLE INTERFACE
         */
        toggleInterface() {
            const container = document.getElementById('queryBuilderInterface');
            if (container) {
                const isVisible = container.style.display !== 'none';
                container.style.display = isVisible ? 'none' : 'block';
                this.state.interfaceOpen = !isVisible;
            }
        },

        /**
         * ADD FILTER
         */
        addFilter() {
            const filtersList = document.getElementById('qbFiltersList');
            if (!filtersList) return;

            const filterId = `filter_${Date.now()}`;
            const filterDiv = document.createElement('div');
            filterDiv.id = filterId;
            filterDiv.style.cssText = `
                background: rgba(0,0,0,0.3);
                padding: 10px;
                border-radius: 6px;
                margin-top: 10px;
                display: grid;
                grid-template-columns: 2fr 1.5fr 2fr auto;
                gap: 10px;
                align-items: center;
            `;

            filterDiv.innerHTML = `
                <input type="text" class="filter-field" placeholder="Field name" style="
                    padding: 8px;
                    background: rgba(255,255,255,0.1);
                    border: 1px solid rgba(255,255,255,0.2);
                    color: white;
                    border-radius: 4px;
                ">
                <select class="filter-operator" style="
                    padding: 8px;
                    background: rgba(255,255,255,0.1);
                    border: 1px solid rgba(255,255,255,0.2);
                    color: white;
                    border-radius: 4px;
                ">
                    <option value="equals">=</option>
                    <option value="not_equals">!=</option>
                    <option value="contains">CONTAINS</option>
                    <option value="starts_with">STARTS WITH</option>
                    <option value="ends_with">ENDS WITH</option>
                    <option value="greater_than">></option>
                    <option value="less_than"><</option>
                    <option value="is_null">IS NULL</option>
                    <option value="is_not_null">IS NOT NULL</option>
                </select>
                <input type="text" class="filter-value" placeholder="Value" style="
                    padding: 8px;
                    background: rgba(255,255,255,0.1);
                    border: 1px solid rgba(255,255,255,0.2);
                    color: white;
                    border-radius: 4px;
                ">
                <button onclick="document.getElementById('${filterId}').remove()" style="
                    padding: 8px 12px;
                    background: rgba(255, 59, 48, 0.2);
                    border: 1px solid #ff3b30;
                    color: white;
                    border-radius: 4px;
                    cursor: pointer;
                ">✕</button>
            `;

            filtersList.appendChild(filterDiv);
        },

        /**
         * EXECUTE VISUAL QUERY
         */
        async executeVisualQuery() {
            try {
                const table = document.getElementById('qbTable')?.value || 'patterns';
                const columnsInput = document.getElementById('qbColumns')?.value || '*';
                const orderBy = document.getElementById('qbOrderBy')?.value || '';
                const limit = document.getElementById('qbLimit')?.value || 100;

                const columns = columnsInput.split(',').map(c => c.trim());
                
                // Collect filters
                const filters = [];
                document.querySelectorAll('#qbFiltersList > div').forEach(filterDiv => {
                    const field = filterDiv.querySelector('.filter-field')?.value;
                    const operator = filterDiv.querySelector('.filter-operator')?.value;
                    const value = filterDiv.querySelector('.filter-value')?.value;
                    
                    // Only add filter if field is specified
                    // For NULL operators, value is not required
                    if (field && (operator === 'is_null' || operator === 'is_not_null' || value)) {
                        filters.push({ field, operator, value });
                    }
                });

                const config = {
                    table,
                    columns,
                    filters,
                    orderBy: orderBy ? [orderBy] : [],
                    limit: parseInt(limit)
                };

                const sql = this.buildVisual(config);
                console.log('Generated SQL:', sql);

                const results = await this.executeQuery(sql);
                this.displayResults(results, sql);
            } catch (error) {
                console.error('Query execution failed:', error);
                alert(`Error: ${error.message}`);
            }
        },

        /**
         * EXECUTE NATURAL LANGUAGE QUERY
         */
        async executeNLQuery() {
            try {
                const nlQuery = document.getElementById('qbNLQuery')?.value;
                if (!nlQuery) {
                    alert('Please enter a natural language query');
                    return;
                }

                const sql = await this.naturalLanguageToSQL(nlQuery);
                console.log('Generated SQL:', sql);

                const results = await this.executeQuery(sql);
                this.displayResults(results, sql);
            } catch (error) {
                console.error('NL Query failed:', error);
                alert(`Error: ${error.message}`);
            }
        },

        /**
         * EXECUTE PATTERN QUERY
         */
        async executePatternQuery() {
            try {
                const patternId = document.getElementById('qbPatternSelect')?.value;
                if (!patternId) {
                    alert('Please select a pattern');
                    return;
                }

                // Collect parameters
                const params = { table: 'patterns' };
                document.querySelectorAll('#qbPatternParams input').forEach(input => {
                    params[input.dataset.param] = input.value;
                });

                const sql = this.buildFromPattern(patternId, params);
                console.log('Generated SQL:', sql);

                const results = await this.executeQuery(sql);
                this.displayResults(results, sql);
            } catch (error) {
                console.error('Pattern query failed:', error);
                alert(`Error: ${error.message}`);
            }
        },

        /**
         * VALIDATE RAW SQL
         */
        validateRawSQL() {
            const sql = document.getElementById('qbRawSQL')?.value;
            if (!sql) {
                alert('Please enter a SQL query');
                return;
            }

            const validation = this.validateQuery(sql);
            
            if (validation.valid) {
                alert('✅ Query is valid and secure!');
            } else {
                alert(`⚠️ Validation Issues:\n\n${validation.issues.join('\n')}`);
            }
        },

        /**
         * OPTIMIZE RAW SQL
         */
        optimizeRawSQL() {
            const sqlInput = document.getElementById('qbRawSQL');
            if (!sqlInput || !sqlInput.value) {
                alert('Please enter a SQL query');
                return;
            }

            const optimized = this.optimizeQuery(sqlInput.value);
            sqlInput.value = optimized;
            
            alert('✅ Query optimized! Check console for optimization notes.');
        },

        /**
         * EXECUTE RAW SQL
         */
        async executeRawSQL() {
            try {
                const sql = document.getElementById('qbRawSQL')?.value;
                if (!sql) {
                    alert('Please enter a SQL query');
                    return;
                }

                const results = await this.executeQuery(sql);
                this.displayResults(results, sql);
            } catch (error) {
                console.error('SQL execution failed:', error);
                alert(`Error: ${error.message}`);
            }
        },

        /**
         * ANALYZE RAW SQL
         */
        async analyzeRawSQL() {
            try {
                const sql = document.getElementById('qbRawSQL')?.value;
                if (!sql) {
                    alert('Please enter a SQL query');
                    return;
                }

                const analysisContainer = document.getElementById('qbAnalysisResults');
                const analysisContent = document.getElementById('qbAnalysisContent');
                
                if (!analysisContainer || !analysisContent) return;

                analysisContent.innerHTML = '<p style="color: #00d4ff;">Analyzing query...</p>';
                analysisContainer.style.display = 'block';

                const results = await this.analyzeQuery(sql);
                
                let html = '<pre style="color: #00ff88; font-size: 12px; white-space: pre-wrap;">';
                results.forEach(row => {
                    html += Object.values(row).join(' ') + '\n';
                });
                html += '</pre>';

                analysisContent.innerHTML = html;
            } catch (error) {
                console.error('Query analysis failed:', error);
                const analysisContent = document.getElementById('qbAnalysisContent');
                if (analysisContent) {
                    analysisContent.innerHTML = `<p style="color: #ff3b30;">Analysis failed: ${error.message}</p>`;
                }
            }
        },

        /**
         * DISPLAY RESULTS
         */
        displayResults(results, sql) {
            const resultsContainer = document.getElementById('qbResults');
            const resultsContent = document.getElementById('qbResultsContent');
            
            if (!resultsContainer || !resultsContent) return;

            // Store last results for export
            this.state.lastResults = results;
            this.state.lastSQL = sql;

            resultsContainer.style.display = 'block';

            // Action buttons
            let html = `
                <div style="display: flex; gap: 10px; margin-bottom: 15px; flex-wrap: wrap;">
                    <button onclick="window.AdvancedQueryBuilder.showSaveQueryDialog()" style="
                        padding: 8px 15px;
                        background: rgba(0, 212, 255, 0.2);
                        border: 1px solid #00d4ff;
                        color: white;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 13px;
                    ">💾 Save Query</button>
                    
                    <button onclick="window.AdvancedQueryBuilder.exportResults('csv', window.AdvancedQueryBuilder.state.lastResults)" style="
                        padding: 8px 15px;
                        background: rgba(0, 255, 136, 0.2);
                        border: 1px solid #00ff88;
                        color: white;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 13px;
                    ">📊 Export CSV</button>
                    
                    <button onclick="window.AdvancedQueryBuilder.exportResults('json', window.AdvancedQueryBuilder.state.lastResults)" style="
                        padding: 8px 15px;
                        background: rgba(255, 159, 10, 0.2);
                        border: 1px solid #ff9f0a;
                        color: white;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 13px;
                    ">📋 Export JSON</button>
                    
                    <button onclick="window.AdvancedQueryBuilder.exportResults('sql', window.AdvancedQueryBuilder.state.lastResults)" style="
                        padding: 8px 15px;
                        background: rgba(175, 82, 222, 0.2);
                        border: 1px solid #af52de;
                        color: white;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 13px;
                    ">🗄️ Export SQL</button>
                    
                    <button onclick="navigator.clipboard.writeText(window.AdvancedQueryBuilder.state.lastSQL)" style="
                        padding: 8px 15px;
                        background: rgba(255, 255, 255, 0.1);
                        border: 1px solid rgba(255, 255, 255, 0.3);
                        color: white;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 13px;
                    ">📄 Copy SQL</button>
                </div>
            `;

            // Show executed query
            html += `
                <div style="margin-bottom: 15px;">
                    <strong style="color: #00d4ff;">Executed Query:</strong>
                    <pre style="
                        background: rgba(0,0,0,0.5);
                        padding: 10px;
                        border-radius: 6px;
                        margin-top: 8px;
                        color: #00ff88;
                        overflow-x: auto;
                    ">${sql}</pre>
                </div>
            `;

            // Show results count
            html += `<p><strong style="color: #00ff88;">Results:</strong> ${results.length} row(s)`;
            
            // Show performance metrics if available
            if (this.state.lastPerformance) {
                html += ` • <strong style="color: #00d4ff;">Execution Time:</strong> ${this.state.lastPerformance.executionTime}ms`;
            }
            
            html += `</p>`;

            // Show results table
            if (results.length > 0) {
                const columns = Object.keys(results[0]);
                
                html += `
                    <div style="overflow-x: auto;">
                        <table style="
                            width: 100%;
                            border-collapse: collapse;
                            margin-top: 10px;
                        ">
                            <thead>
                                <tr style="background: rgba(0, 212, 255, 0.2);">
                                    ${columns.map(col => `
                                        <th style="
                                            padding: 10px;
                                            text-align: left;
                                            border-bottom: 2px solid #00d4ff;
                                            font-weight: 600;
                                        ">${col}</th>
                                    `).join('')}
                                </tr>
                            </thead>
                            <tbody>
                                ${results.slice(0, 100).map((row, i) => `
                                    <tr style="
                                        background: ${i % 2 === 0 ? 'rgba(255,255,255,0.05)' : 'transparent'};
                                        border-bottom: 1px solid rgba(255,255,255,0.1);
                                    ">
                                        ${columns.map(col => `
                                            <td style="padding: 10px;">
                                                ${this.formatCellValue(row[col])}
                                            </td>
                                        `).join('')}
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
                
                if (results.length > 100) {
                    html += `<p style="color: #ff9f0a; margin-top: 10px; font-style: italic;">Showing first 100 of ${results.length} rows</p>`;
                }
            } else {
                html += '<p style="color: #ff9f0a; margin-top: 10px;">No results found.</p>';
            }

            resultsContent.innerHTML = html;
        },

        /**
         * FORMAT CELL VALUE
         */
        formatCellValue(value) {
            if (value === null || value === undefined) {
                return '<span style="color: #666; font-style: italic;">NULL</span>';
            }
            
            if (typeof value === 'object') {
                return `<code>${JSON.stringify(value)}</code>`;
            }
            
            if (typeof value === 'boolean') {
                return value ? '✓' : '✗';
            }
            
            const strValue = String(value);
            if (strValue.length > 100) {
                return strValue.substring(0, 100) + '...';
            }
            
            return strValue;
        },

        /**
         * LOAD SCHEMA
         */
        async loadSchema() {
            try {
                console.log('📊 Loading database schema...');
                
                if (!window.ComprehensiveDB?.state?.pglite) {
                    throw new Error('Database not available');
                }

                // Get all tables
                const tablesResult = await window.ComprehensiveDB.state.pglite.query(`
                    SELECT table_name 
                    FROM information_schema.tables 
                    WHERE table_schema = 'public'
                    ORDER BY table_name
                `);

                const schema = {};

                // Get columns for each table
                for (const table of tablesResult.rows) {
                    const tableName = table.table_name;
                    const columnsResult = await window.ComprehensiveDB.state.pglite.query(`
                        SELECT 
                            column_name,
                            data_type,
                            is_nullable,
                            column_default
                        FROM information_schema.columns
                        WHERE table_name = $1
                        ORDER BY ordinal_position
                    `, [tableName]);

                    schema[tableName] = columnsResult.rows;
                }

                this.state.schemaCache = schema;
                console.log(`✓ Loaded schema for ${Object.keys(schema).length} tables`);
                
                return schema;
            } catch (error) {
                console.error('Failed to load schema:', error);
                return null;
            }
        },

        /**
         * RENDER SCHEMA BROWSER
         */
        renderSchemaBrowser() {
            if (!this.state.schemaCache) {
                return `
                    <div style="text-align: center; padding: 40px;">
                        <p style="color: #ff9f0a;">Loading schema...</p>
                        <button onclick="window.AdvancedQueryBuilder.refreshSchema()" style="
                            margin-top: 15px;
                            padding: 10px 20px;
                            background: rgba(0, 212, 255, 0.2);
                            border: 1px solid #00d4ff;
                            color: white;
                            border-radius: 6px;
                            cursor: pointer;
                        ">🔄 Refresh Schema</button>
                    </div>
                `;
            }

            const tables = Object.keys(this.state.schemaCache);
            
            if (tables.length === 0) {
                return `
                    <div style="text-align: center; padding: 40px;">
                        <p style="color: #ff9f0a;">No tables found in database.</p>
                        <button onclick="window.AdvancedQueryBuilder.refreshSchema()" style="
                            margin-top: 15px;
                            padding: 10px 20px;
                            background: rgba(0, 212, 255, 0.2);
                            border: 1px solid #00d4ff;
                            color: white;
                            border-radius: 6px;
                            cursor: pointer;
                        ">🔄 Refresh Schema</button>
                    </div>
                `;
            }

            return `
                <div style="margin-bottom: 15px;">
                    <button onclick="window.AdvancedQueryBuilder.refreshSchema()" style="
                        padding: 8px 15px;
                        background: rgba(0, 212, 255, 0.2);
                        border: 1px solid #00d4ff;
                        color: white;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 13px;
                    ">🔄 Refresh Schema</button>
                    <span style="margin-left: 15px; color: rgba(255,255,255,0.6); font-size: 13px;">
                        ${tables.length} table(s)
                    </span>
                </div>
                <div style="max-height: 500px; overflow-y: auto;">
                    ${tables.map(tableName => {
                        const columns = this.state.schemaCache[tableName];
                        return `
                            <div style="
                                background: rgba(0,0,0,0.3);
                                margin-bottom: 15px;
                                border-radius: 8px;
                                overflow: hidden;
                            ">
                                <div style="
                                    background: rgba(0, 212, 255, 0.2);
                                    padding: 12px;
                                    font-weight: 600;
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                ">
                                    <span>📊 ${tableName}</span>
                                    <button onclick="window.AdvancedQueryBuilder.quickSelectTable('${tableName}')" style="
                                        padding: 5px 12px;
                                        background: rgba(0, 255, 136, 0.2);
                                        border: 1px solid #00ff88;
                                        color: white;
                                        border-radius: 4px;
                                        cursor: pointer;
                                        font-size: 12px;
                                    ">Quick SELECT</button>
                                </div>
                                <div style="padding: 12px;">
                                    <table style="width: 100%; font-size: 13px;">
                                        <thead>
                                            <tr style="color: #00d4ff;">
                                                <th style="text-align: left; padding: 5px;">Column</th>
                                                <th style="text-align: left; padding: 5px;">Type</th>
                                                <th style="text-align: left; padding: 5px;">Nullable</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${columns.map(col => `
                                                <tr style="border-top: 1px solid rgba(255,255,255,0.1);">
                                                    <td style="padding: 5px;">${col.column_name}</td>
                                                    <td style="padding: 5px; color: #00ff88;">${col.data_type}</td>
                                                    <td style="padding: 5px;">${col.is_nullable === 'YES' ? '✓' : '✗'}</td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        },

        /**
         * REFRESH SCHEMA
         */
        async refreshSchema() {
            const content = document.getElementById('qbTabContent');
            if (content) {
                content.innerHTML = '<div style="text-align: center; padding: 40px;"><p style="color: #00d4ff;">Loading schema...</p></div>';
            }
            
            await this.loadSchema();
            this.switchTab('schema');
        },

        /**
         * QUICK SELECT TABLE
         */
        async quickSelectTable(tableName) {
            try {
                const sql = `SELECT * FROM ${tableName} LIMIT 100`;
                const results = await this.executeQuery(sql);
                this.displayResults(results, sql);
            } catch (error) {
                console.error('Quick select failed:', error);
                alert(`Error: ${error.message}`);
            }
        },

        /**
         * SAVE QUERY
         */
        saveQuery(name, sql, description = '') {
            const savedQuery = {
                id: Date.now().toString(),
                name,
                sql,
                description,
                createdAt: new Date().toISOString()
            };

            this.state.savedQueries.push(savedQuery);
            
            // Persist to localStorage
            try {
                const saved = JSON.parse(localStorage.getItem('queryBuilder_savedQueries') || '[]');
                saved.push(savedQuery);
                localStorage.setItem('queryBuilder_savedQueries', JSON.stringify(saved));
                console.log('✓ Query saved:', name);
            } catch (error) {
                console.error('Failed to persist saved query:', error);
            }

            return savedQuery;
        },

        /**
         * LOAD SAVED QUERIES
         */
        loadSavedQueries() {
            try {
                const saved = JSON.parse(localStorage.getItem('queryBuilder_savedQueries') || '[]');
                this.state.savedQueries = saved;
                console.log(`✓ Loaded ${saved.length} saved queries`);
            } catch (error) {
                console.error('Failed to load saved queries:', error);
            }
        },

        /**
         * DELETE SAVED QUERY
         */
        deleteSavedQuery(id) {
            this.state.savedQueries = this.state.savedQueries.filter(q => q.id !== id);
            
            try {
                localStorage.setItem('queryBuilder_savedQueries', JSON.stringify(this.state.savedQueries));
                console.log('✓ Query deleted');
            } catch (error) {
                console.error('Failed to delete saved query:', error);
            }
        },

        /**
         * RENDER SAVED QUERIES
         */
        renderSavedQueries() {
            if (this.state.savedQueries.length === 0) {
                return `
                    <div style="text-align: center; padding: 40px; color: rgba(255,255,255,0.6);">
                        <p style="font-size: 18px; margin-bottom: 10px;">📚 No saved queries yet</p>
                        <p style="font-size: 14px;">Save queries from other tabs to reuse them later</p>
                    </div>
                `;
            }

            return `
                <div style="max-height: 500px; overflow-y: auto;">
                    ${this.state.savedQueries.map(query => `
                        <div style="
                            background: rgba(0,0,0,0.3);
                            padding: 15px;
                            border-radius: 8px;
                            margin-bottom: 12px;
                            border-left: 3px solid #00d4ff;
                        ">
                            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                                <div>
                                    <h4 style="margin: 0 0 5px 0; color: #00d4ff;">${query.name}</h4>
                                    ${query.description ? `<p style="margin: 0; font-size: 13px; color: rgba(255,255,255,0.7);">${query.description}</p>` : ''}
                                    <p style="margin: 5px 0 0 0; font-size: 12px; color: rgba(255,255,255,0.5);">
                                        Saved: ${new Date(query.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div style="display: flex; gap: 8px;">
                                    <button onclick="window.AdvancedQueryBuilder.loadSavedQueryToEditor('${query.id}')" style="
                                        padding: 6px 12px;
                                        background: rgba(0, 255, 136, 0.2);
                                        border: 1px solid #00ff88;
                                        color: white;
                                        border-radius: 4px;
                                        cursor: pointer;
                                        font-size: 12px;
                                    ">Load</button>
                                    <button onclick="window.AdvancedQueryBuilder.executeSavedQuery('${query.id}')" style="
                                        padding: 6px 12px;
                                        background: rgba(0, 212, 255, 0.2);
                                        border: 1px solid #00d4ff;
                                        color: white;
                                        border-radius: 4px;
                                        cursor: pointer;
                                        font-size: 12px;
                                    ">Run</button>
                                    <button onclick="window.AdvancedQueryBuilder.deleteSavedQueryUI('${query.id}')" style="
                                        padding: 6px 12px;
                                        background: rgba(255, 59, 48, 0.2);
                                        border: 1px solid #ff3b30;
                                        color: white;
                                        border-radius: 4px;
                                        cursor: pointer;
                                        font-size: 12px;
                                    ">Delete</button>
                                </div>
                            </div>
                            <pre style="
                                background: rgba(0,0,0,0.5);
                                padding: 10px;
                                border-radius: 4px;
                                margin: 0;
                                color: #00ff88;
                                font-size: 12px;
                                overflow-x: auto;
                            ">${query.sql}</pre>
                        </div>
                    `).join('')}
                </div>
            `;
        },

        /**
         * LOAD SAVED QUERY TO EDITOR
         */
        loadSavedQueryToEditor(id) {
            const query = this.state.savedQueries.find(q => q.id === id);
            if (!query) return;

            const sqlInput = document.getElementById('qbRawSQL');
            if (sqlInput) {
                sqlInput.value = query.sql;
                this.switchTab('sql');
            }
        },

        /**
         * EXECUTE SAVED QUERY
         */
        async executeSavedQuery(id) {
            const query = this.state.savedQueries.find(q => q.id === id);
            if (!query) return;

            try {
                const results = await this.executeQuery(query.sql);
                this.displayResults(results, query.sql);
            } catch (error) {
                console.error('Saved query execution failed:', error);
                alert(`Error: ${error.message}`);
            }
        },

        /**
         * DELETE SAVED QUERY UI
         */
        deleteSavedQueryUI(id) {
            if (confirm('Are you sure you want to delete this saved query?')) {
                this.deleteSavedQuery(id);
                this.switchTab('saved');
            }
        },

        /**
         * EXPORT RESULTS
         */
        exportResults(format, results, filename = 'query_results') {
            if (!results || results.length === 0) {
                alert('No results to export');
                return;
            }

            let content, mimeType, extension;

            switch (format) {
                case 'csv':
                    content = this.convertToCSV(results);
                    mimeType = 'text/csv';
                    extension = 'csv';
                    break;
                case 'json':
                    content = JSON.stringify(results, null, 2);
                    mimeType = 'application/json';
                    extension = 'json';
                    break;
                case 'sql':
                    content = this.convertToSQL(results);
                    mimeType = 'text/plain';
                    extension = 'sql';
                    break;
                default:
                    alert('Unsupported format');
                    return;
            }

            // Create download
            const blob = new Blob([content], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${filename}.${extension}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            console.log(`✓ Exported ${results.length} rows as ${format.toUpperCase()}`);
        },

        /**
         * CONVERT TO CSV
         */
        convertToCSV(results) {
            if (results.length === 0) return '';

            const headers = Object.keys(results[0]);
            const csvRows = [];

            // Add headers
            csvRows.push(headers.join(','));

            // Add data rows
            for (const row of results) {
                const values = headers.map(header => {
                    const value = row[header];
                    if (value === null || value === undefined) return '';
                    if (typeof value === 'object') return JSON.stringify(value);
                    const escaped = String(value).replace(/"/g, '""');
                    return `"${escaped}"`;
                });
                csvRows.push(values.join(','));
            }

            return csvRows.join('\n');
        },

        /**
         * CONVERT TO SQL
         */
        convertToSQL(results, tableName = 'exported_data') {
            if (results.length === 0) return '';

            const columns = Object.keys(results[0]);
            const sqlStatements = [];

            for (const row of results) {
                const values = columns.map(col => {
                    const value = row[col];
                    if (value === null || value === undefined) return 'NULL';
                    if (typeof value === 'number') return value;
                    if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
                    if (typeof value === 'object') return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
                    return `'${String(value).replace(/'/g, "''")}'`;
                });

                sqlStatements.push(
                    `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values.join(', ')});`
                );
            }

            return sqlStatements.join('\n');
        },

        /**
         * ANALYZE QUERY
         */
        async analyzeQuery(sql) {
            try {
                console.log('🔍 Analyzing query performance...');

                if (!window.ComprehensiveDB?.state?.pglite) {
                    throw new Error('Database not available');
                }

                const explainSQL = `EXPLAIN ANALYZE ${sql}`;
                const result = await window.ComprehensiveDB.state.pglite.query(explainSQL);

                return result.rows;
            } catch (error) {
                console.error('Query analysis failed:', error);
                throw error;
            }
        },

        /**
         * RENDER HISTORY
         */
        renderHistory() {
            if (this.state.queryHistory.length === 0) {
                return `
                    <div style="text-align: center; padding: 40px; color: rgba(255,255,255,0.6);">
                        <p style="font-size: 18px; margin-bottom: 10px;">📜 No query history yet</p>
                        <p style="font-size: 14px;">Your executed queries will appear here</p>
                    </div>
                `;
            }

            // Reverse to show most recent first
            const history = [...this.state.queryHistory].reverse();

            return `
                <div style="margin-bottom: 15px;">
                    <button onclick="window.AdvancedQueryBuilder.clearHistory()" style="
                        padding: 8px 15px;
                        background: rgba(255, 59, 48, 0.2);
                        border: 1px solid #ff3b30;
                        color: white;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 13px;
                    ">🗑️ Clear History</button>
                </div>
                <div style="max-height: 500px; overflow-y: auto;">
                    ${history.map((entry, index) => `
                        <div style="
                            background: rgba(0,0,0,0.3);
                            padding: 15px;
                            border-radius: 8px;
                            margin-bottom: 12px;
                            border-left: 3px solid ${entry.rowCount > 0 ? '#00ff88' : '#ff9f0a'};
                        ">
                            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                                <div style="flex: 1;">
                                    <p style="margin: 0 0 5px 0; font-size: 12px; color: rgba(255,255,255,0.6);">
                                        ${new Date(entry.timestamp).toLocaleString()} • ${entry.rowCount} row(s)
                                        ${entry.executionTime ? ` • ${entry.executionTime}ms` : ''}
                                    </p>
                                </div>
                                <div style="display: flex; gap: 8px;">
                                    <button onclick="window.AdvancedQueryBuilder.rerunHistoryQuery(${this.state.queryHistory.length - 1 - index})" style="
                                        padding: 5px 10px;
                                        background: rgba(0, 212, 255, 0.2);
                                        border: 1px solid #00d4ff;
                                        color: white;
                                        border-radius: 4px;
                                        cursor: pointer;
                                        font-size: 11px;
                                    ">Re-run</button>
                                    <button onclick="window.AdvancedQueryBuilder.copyHistoryQuery(${this.state.queryHistory.length - 1 - index})" style="
                                        padding: 5px 10px;
                                        background: rgba(0, 255, 136, 0.2);
                                        border: 1px solid #00ff88;
                                        color: white;
                                        border-radius: 4px;
                                        cursor: pointer;
                                        font-size: 11px;
                                    ">Copy</button>
                                </div>
                            </div>
                            <pre style="
                                background: rgba(0,0,0,0.5);
                                padding: 10px;
                                border-radius: 4px;
                                margin: 0;
                                color: #00ff88;
                                font-size: 12px;
                                overflow-x: auto;
                            ">${entry.sql}</pre>
                        </div>
                    `).join('')}
                </div>
            `;
        },

        /**
         * RERUN HISTORY QUERY
         */
        async rerunHistoryQuery(index) {
            const entry = this.state.queryHistory[index];
            if (!entry) return;

            try {
                const results = await this.executeQuery(entry.sql, entry.params);
                this.displayResults(results, entry.sql);
            } catch (error) {
                console.error('Rerun failed:', error);
                alert(`Error: ${error.message}`);
            }
        },

        /**
         * COPY HISTORY QUERY
         */
        copyHistoryQuery(index) {
            const entry = this.state.queryHistory[index];
            if (!entry) return;

            navigator.clipboard.writeText(entry.sql).then(() => {
                console.log('✓ Query copied to clipboard');
                alert('Query copied to clipboard!');
            }).catch(error => {
                console.error('Copy failed:', error);
            });
        },

        /**
         * SHOW SAVE QUERY DIALOG
         */
        showSaveQueryDialog() {
            const name = prompt('Enter a name for this query:');
            if (!name) return;

            const description = prompt('Enter a description (optional):');

            const savedQuery = this.saveQuery(name, this.state.lastSQL, description || '');
            alert(`✅ Query "${name}" saved successfully!`);
            
            // Update the saved tab count
            const savedTab = Array.from(document.querySelectorAll('.qb-tab')).find(tab => 
                tab.textContent.toLowerCase().includes('saved')
            );
            if (savedTab) {
                savedTab.innerHTML = `Saved (${this.state.savedQueries.length})`;
            }
        },

        /**
         * CLEAR HISTORY
         */
        clearHistory() {
            if (confirm('Are you sure you want to clear all query history?')) {
                this.state.queryHistory = [];
                console.log('✓ Query history cleared');
                this.switchTab('history');
            }
        },

        /**
         * SETUP KEYBOARD SHORTCUTS
         */
        setupKeyboardShortcuts() {
            document.addEventListener('keydown', (e) => {
                // Ctrl+Shift+U - Toggle interface
                if (e.ctrlKey && e.shiftKey && e.key === 'U') {
                    e.preventDefault();
                    this.toggleInterface();
                }
            });
        }
    };

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            AdvancedQueryBuilder.init();
        });
    } else {
        AdvancedQueryBuilder.init();
    }

    // Export globally
    window.AdvancedQueryBuilder = AdvancedQueryBuilder;

    console.log('✅ Advanced Query Builder loaded');
    console.log('⌨️ Press Ctrl+Shift+U to open interface');

})();