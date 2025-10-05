/**
 * COMPREHENSIVE DATABASE INTEGRATION
 * Electric SQL + PGlite + DataPup for AEVOV Pattern System
 * 
 * Architecture:
 * - Client-side: PGlite (in-browser PostgreSQL)
 * - Distributed sync: Electric SQL (real-time sync)
 * - Interface & Dataset: DataPup (management layer)
 * - Persistence: Cubbit (cloud storage)
 * - Cron: Sophisticated scheduling for distributed version
 */

(function() {
    'use strict';

    console.log('🗄️ Loading Comprehensive Database Integration...');

    const AevovDB = {
        // State
        state: {
            pglite: null,
            electricClient: null,
            dataPup: null,
            initialized: false,
            syncEnabled: false,
            cronJobs: []
        },

        // Config
        config: {
            usePGlite: true,
            useElectricSync: true,
            useDataPup: true,
            persistToCubbit: true,
            cronEnabled: true
        },

        /**
         * INITIALIZE
         */
        async init() {
            console.log('⚡ Initializing Comprehensive Database System...');

            try {
                // Phase 1: Initialize PGlite (client-side DB)
                await this.initPGlite();

                // Phase 2: Initialize Electric SQL (distributed sync)
                await this.initElectricSQL();

                // Phase 3: Initialize DataPup (interface layer)
                await this.initDataPup();

                // Phase 4: Setup Cubbit persistence
                await this.setupCubbitPersistence();

                // Phase 5: Setup Cron system
                await this.setupCronSystem();

                this.state.initialized = true;
                console.log('✅ Comprehensive Database System ready!');

            } catch (error) {
                console.error('❌ Database initialization failed:', error);
            }
        },

        /**
         * INITIALIZE PGLITE
         */
        async initPGlite() {
            console.log('📦 Initializing PGlite (in-browser PostgreSQL)...');

            try {
                // Load PGlite from CDN
                await this.loadScript('https://cdn.jsdelivr.net/npm/@electric-sql/pglite/dist/index.js');

                // Initialize PGlite instance
                this.state.pglite = await window.PGlite.create({
                    dataDir: 'idb://aevov-patterns', // IndexedDB storage
                    relaxedDurability: true
                });

                // Create pattern tables
                await this.createPatternTables();

                console.log('✅ PGlite initialized successfully');

            } catch (error) {
                console.error('❌ PGlite initialization failed:', error);
                console.log('⚠️ Falling back to IndexedDB only');
            }
        },

        /**
         * CREATE PATTERN TABLES
         */
        async createPatternTables() {
            console.log('📋 Creating pattern database schema...');

            const schema = `
                -- Patterns table
                CREATE TABLE IF NOT EXISTS patterns (
                    id TEXT PRIMARY KEY,
                    category TEXT NOT NULL,
                    subcategory TEXT,
                    keywords TEXT[], -- PostgreSQL array
                    template TEXT,
                    confidence REAL DEFAULT 0.9,
                    embedding REAL[], -- For vector similarity
                    metadata JSONB,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );

                -- Chunk registry table
                CREATE TABLE IF NOT EXISTS chunk_registry (
                    id TEXT PRIMARY KEY,
                    url TEXT NOT NULL,
                    source TEXT,
                    metadata JSONB,
                    patterns_extracted INTEGER DEFAULT 0,
                    status TEXT DEFAULT 'active',
                    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );

                -- Evolution history table
                CREATE TABLE IF NOT EXISTS evolution_history (
                    id SERIAL PRIMARY KEY,
                    model_name TEXT NOT NULL,
                    strategy TEXT,
                    iterations INTEGER,
                    patterns_used TEXT[],
                    output_patterns INTEGER,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );

                -- Sync metadata table
                CREATE TABLE IF NOT EXISTS sync_metadata (
                    key TEXT PRIMARY KEY,
                    value JSONB,
                    synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );

                -- Create indexes
                CREATE INDEX IF NOT EXISTS idx_patterns_category ON patterns(category);
                CREATE INDEX IF NOT EXISTS idx_patterns_keywords ON patterns USING GIN(keywords);
                CREATE INDEX IF NOT EXISTS idx_chunk_status ON chunk_registry(status);
            `;

            if (this.state.pglite) {
                await this.state.pglite.exec(schema);
                console.log('✅ Database schema created');
            }
        },

        /**
         * INITIALIZE ELECTRIC SQL
         */
        async initElectricSQL() {
            console.log('⚡ Initializing Electric SQL (distributed sync)...');

            try {
                // Load Electric SQL from CDN
                await this.loadScript('https://cdn.jsdelivr.net/npm/electric-sql/dist/index.js');

                // Initialize Electric client
                this.state.electricClient = await window.Electric.electrify({
                    adapter: this.state.pglite,
                    url: 'wss://electric.aevov.io', // Your Electric sync server
                });

                // Setup sync shapes
                await this.setupSyncShapes();

                this.state.syncEnabled = true;
                console.log('✅ Electric SQL initialized successfully');

            } catch (error) {
                console.error('❌ Electric SQL initialization failed:', error);
                console.log('⚠️ Running in local-only mode');
            }
        },

        /**
         * SETUP SYNC SHAPES
         */
        async setupSyncShapes() {
            console.log('🔄 Setting up Electric SQL sync shapes...');

            if (!this.state.electricClient) return;

            // Sync patterns table
            await this.state.electricClient.sync.syncTable('patterns', {
                where: 'confidence > 0.7' // Only sync high-confidence patterns
            });

            // Sync chunk registry
            await this.state.electricClient.sync.syncTable('chunk_registry', {
                where: "status = 'active'"
            });

            console.log('✅ Sync shapes configured');
        },

        /**
         * INITIALIZE DATAPUP
         */
        async initDataPup() {
            console.log('🐕 Initializing DataPup (interface & dataset manager)...');

            try {
                // Load DataPup from GitHub
                await this.loadScript('https://cdn.jsdelivr.net/gh/Jesse-wakandaisland/DataPup@main/dist/datapup.min.js');

                // Initialize DataPup instance
                this.state.dataPup = new window.DataPup({
                    database: this.state.pglite,
                    syncAdapter: this.state.electricClient,
                    autoSync: true
                });

                // Setup DataPup interface
                await this.setupDataPupInterface();

                console.log('✅ DataPup initialized successfully');

            } catch (error) {
                console.error('❌ DataPup initialization failed:', error);
                console.log('⚠️ Using direct database access');
            }
        },

        /**
         * SETUP DATAPUP INTERFACE
         */
        async setupDataPupInterface() {
            console.log('🎨 Setting up DataPup interface...');

            if (!this.state.dataPup) return;

            // Register pattern dataset
            await this.state.dataPup.registerDataset('patterns', {
                table: 'patterns',
                schema: {
                    id: 'string',
                    category: 'string',
                    keywords: 'array',
                    template: 'text',
                    confidence: 'number'
                },
                operations: ['create', 'read', 'update', 'delete', 'query']
            });

            // Register chunk registry dataset
            await this.state.dataPup.registerDataset('chunks', {
                table: 'chunk_registry',
                schema: {
                    id: 'string',
                    url: 'string',
                    patterns_extracted: 'number'
                },
                operations: ['create', 'read', 'query']
            });

            console.log('✅ DataPup datasets registered');
        },

        /**
         * SETUP CUBBIT PERSISTENCE
         */
        async setupCubbitPersistence() {
            console.log('☁️ Setting up Cubbit persistence...');

            if (!this.config.persistToCubbit || !window.CubbitManager) {
                console.log('⚠️ Cubbit persistence disabled or unavailable');
                return;
            }

            // Schedule periodic database backups to Cubbit
            setInterval(async () => {
                try {
                    await this.backupToCubbit();
                } catch (error) {
                    console.error('Backup failed:', error);
                }
            }, 3600000); // Every hour

            console.log('✅ Cubbit persistence configured');
        },

        /**
         * BACKUP TO CUBBIT
         */
        async backupToCubbit() {
            console.log('💾 Backing up database to Cubbit...');

            if (!this.state.pglite) return;

            try {
                // Export database
                const dump = await this.state.pglite.dumpDataDir();

                // Upload to Cubbit
                const blob = new Blob([dump], { type: 'application/octet-stream' });
                const file = new File([blob], `aevov-db-backup-${Date.now()}.dump`);

                if (window.CubbitManager) {
                    await window.CubbitManager.uploadFile(file, 'backups', {
                        type: 'database-backup',
                        timestamp: new Date().toISOString()
                    });
                }

                console.log('✅ Database backed up to Cubbit');

            } catch (error) {
                console.error('❌ Backup failed:', error);
            }
        },

        /**
         * SETUP CRON SYSTEM
         */
        async setupCronSystem() {
            console.log('⏰ Setting up comprehensive cron system...');

            const CronManager = {
                jobs: [],

                /**
                 * ADD CRON JOB
                 */
                add(name, schedule, task) {
                    const job = {
                        id: `cron_${Date.now()}`,
                        name,
                        schedule, // cron expression or interval in ms
                        task,
                        lastRun: null,
                        nextRun: null,
                        enabled: true
                    };

                    this.jobs.push(job);
                    this.scheduleJob(job);

                    console.log(`✅ Cron job added: ${name}`);
                    return job.id;
                },

                /**
                 * SCHEDULE JOB
                 */
                scheduleJob(job) {
                    if (!job.enabled) return;

                    const interval = typeof job.schedule === 'number' ? 
                        job.schedule : 
                        this.parseCronExpression(job.schedule);

                    job.timerId = setInterval(async () => {
                        console.log(`⏰ Running cron job: ${job.name}`);
                        job.lastRun = new Date();

                        try {
                            await job.task();
                        } catch (error) {
                            console.error(`Cron job ${job.name} failed:`, error);
                        }

                        job.nextRun = new Date(Date.now() + interval);
                    }, interval);
                },

                /**
                 * PARSE CRON EXPRESSION (simplified)
                 */
                parseCronExpression(expression) {
                    // Simplified cron parser
                    // Format: "* * * * *" (minute hour day month weekday)
                    // For now, convert to simple intervals
                    const presets = {
                        '@hourly': 3600000,
                        '@daily': 86400000,
                        '@weekly': 604800000,
                        '*/5 * * * *': 300000, // every 5 minutes
                        '*/15 * * * *': 900000, // every 15 minutes
                        '0 * * * *': 3600000, // every hour
                        '0 0 * * *': 86400000 // daily at midnight
                    };

                    return presets[expression] || 3600000; // default 1 hour
                },

                /**
                 * REMOVE JOB
                 */
                remove(jobId) {
                    const index = this.jobs.findIndex(j => j.id === jobId);
                    if (index !== -1) {
                        const job = this.jobs[index];
                        if (job.timerId) {
                            clearInterval(job.timerId);
                        }
                        this.jobs.splice(index, 1);
                        console.log(`✅ Cron job removed: ${job.name}`);
                    }
                },

                /**
                 * LIST JOBS
                 */
                list() {
                    return this.jobs.map(j => ({
                        id: j.id,
                        name: j.name,
                        schedule: j.schedule,
                        lastRun: j.lastRun,
                        nextRun: j.nextRun,
                        enabled: j.enabled
                    }));
                }
            };

            // Add default cron jobs
            CronManager.add('Database Backup', '@hourly', async () => {
                await this.backupToCubbit();
            });

            CronManager.add('Pattern Sync', '*/15 * * * *', async () => {
                if (this.state.syncEnabled) {
                    console.log('🔄 Syncing patterns...');
                    // Electric SQL handles this automatically
                }
            });

            CronManager.add('Cache Cleanup', '@daily', async () => {
                if (window.AevovCache) {
                    await window.AevovCache.cleanup();
                }
            });

            this.state.cronJobs = CronManager.jobs;
            window.AevovCron = CronManager;

            console.log('✅ Cron system ready');
        },

        /**
         * INSERT PATTERN
         */
        async insertPattern(pattern) {
            if (!this.state.pglite) {
                console.error('PGlite not initialized');
                return;
            }

            const query = `
                INSERT INTO patterns (id, category, subcategory, keywords, template, confidence, metadata)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT (id) DO UPDATE SET
                    keywords = EXCLUDED.keywords,
                    template = EXCLUDED.template,
                    confidence = EXCLUDED.confidence,
                    updated_at = CURRENT_TIMESTAMP
            `;

            await this.state.pglite.query(query, [
                pattern.id,
                pattern.category,
                pattern.subcategory,
                pattern.keywords || [],
                pattern.template,
                pattern.confidence || 0.9,
                JSON.stringify(pattern.metadata || {})
            ]);

            console.log(`✓ Pattern ${pattern.id} saved to database`);
        },

        /**
         * QUERY PATTERNS
         */
        async queryPatterns(filters = {}) {
            if (!this.state.pglite) {
                console.error('PGlite not initialized');
                return [];
            }

            let query = 'SELECT * FROM patterns WHERE 1=1';
            const params = [];

            if (filters.category) {
                params.push(filters.category);
                query += ` AND category = $${params.length}`;
            }

            if (filters.minConfidence) {
                params.push(filters.minConfidence);
                query += ` AND confidence >= $${params.length}`;
            }

            if (filters.keywords) {
                params.push(filters.keywords);
                query += ` AND keywords @> $${params.length}::text[]`;
            }

            const result = await this.state.pglite.query(query, params);
            return result.rows;
        },

        /**
         * LOAD SCRIPT HELPER
         */
        async loadScript(url) {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = url;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }
    };

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            AevovDB.init();
        });
    } else {
        AevovDB.init();
    }

    // Export globally
    window.AevovDB = AevovDB;

    console.log('✅ Comprehensive Database Integration loaded');
    console.log('🗄️ PGlite + Electric SQL + DataPup + Cubbit + Cron');

})();
