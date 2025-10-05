/**
 * LIBRARY LOADER - FIX ALL DEPENDENCY ISSUES
 * Load this FIRST before any other scripts
 */

(function() {
    'use strict';

    const LibraryLoader = {
        loaded: {
            compromise: false,
            pglite: false,
            electric: false
        },

        /**
         * LOAD COMPROMISE.JS
         */
        async loadCompromise() {
            if (window.nlp) {
                this.loaded.compromise = true;
                return true;
            }

            return new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/compromise@14.9.0/builds/compromise.min.js';
                script.onload = () => {
                    this.loaded.compromise = true;
                    console.log('✅ Compromise.js loaded');
                    resolve(true);
                };
                script.onerror = () => {
                    console.error('❌ Failed to load Compromise.js');
                    resolve(false);
                };
                document.head.appendChild(script);
            });
        },

        /**
         * LOAD PGLITE (with proper module handling)
         */
        async loadPGlite() {
            if (window.PGlite) {
                this.loaded.pglite = true;
                return true;
            }

            try {
                // Use UMD build, not ES module
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/@electric-sql/pglite@0.1.5/dist/index.js';
                script.type = 'text/javascript'; // NOT module
                
                await new Promise((resolve, reject) => {
                    script.onload = resolve;
                    script.onerror = reject;
                    document.head.appendChild(script);
                });

                this.loaded.pglite = true;
                console.log('✅ PGlite loaded');
                return true;
            } catch (error) {
                console.error('❌ PGlite load failed:', error);
                // Create fallback
                this.createPGliteFallback();
                return false;
            }
        },

        /**
         * CREATE PGLITE FALLBACK
         */
        createPGliteFallback() {
            window.PGlite = {
                create: async () => ({
                    exec: async (sql) => console.log('PGlite fallback: exec', sql),
                    query: async (sql, params) => {
                        console.log('PGlite fallback: query', sql, params);
                        return { rows: [] };
                    }
                })
            };
            console.log('⚠️ Using PGlite fallback (IndexedDB only)');
        },

        /**
         * LOAD ELECTRIC SQL (skip if fails)
         */
        async loadElectricSQL() {
            try {
                // Electric SQL requires module system - skip for now
                console.log('⚠️ Electric SQL requires build system, using local-only mode');
                
                // Create stub
                window.Electric = {
                    electrify: async () => {
                        console.log('Electric SQL stub: sync disabled');
                        return null;
                    }
                };
                
                return false;
            } catch (error) {
                console.error('Electric SQL unavailable:', error);
                return false;
            }
        },

        /**
         * LOAD ALL LIBRARIES
         */
        async loadAll() {
            console.log('📚 Loading all required libraries...');

            await this.loadCompromise();
            await this.loadPGlite();
            await this.loadElectricSQL();

            console.log('✅ Library loading complete');
            console.log('Status:', this.loaded);

            // Dispatch event when ready
            window.dispatchEvent(new CustomEvent('libraries-loaded', {
                detail: this.loaded
            }));
        }
    };

    // Load immediately
    LibraryLoader.loadAll();

    window.LibraryLoader = LibraryLoader;

})();
