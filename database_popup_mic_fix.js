/**
 * DATABASE POPUP + MICROPHONE NOTIFICATION FIX
 */

(function() {
    'use strict';

    // ========================================
    // PART 1: AGGRESSIVE MIC NOTIFICATION FIX
    // ========================================

    const MicNotificationKiller = {
        init() {
            console.log('🎤 Applying aggressive mic notification fix...');

            // Block ALL mic prompts immediately
            this.blockNotifications();
            this.blockGetUserMedia();
            this.blockSpeechRecognition();
            this.blockAnnyang();

            console.log('✅ Mic notifications blocked aggressively');
        },

        blockNotifications() {
            // Override Notification API
            if (window.Notification) {
                const originalNotification = window.Notification;
                window.Notification = function(...args) {
                    const message = args[1]?.body || args[0] || '';
                    if (message.toLowerCase().includes('microphone') || 
                        message.toLowerCase().includes('audio') ||
                        message.toLowerCase().includes('permission')) {
                        console.log('🚫 Blocked mic notification:', message);
                        return { close: () => {} };
                    }
                    return new originalNotification(...args);
                };
                window.Notification.permission = 'denied';
                window.Notification.requestPermission = () => Promise.resolve('denied');
            }

            // Block browser prompts
            if (window.navigator.permissions) {
                const originalQuery = window.navigator.permissions.query;
                window.navigator.permissions.query = async function(descriptor) {
                    if (descriptor.name === 'microphone') {
                        return { state: 'denied', onchange: null };
                    }
                    return originalQuery.call(window.navigator.permissions, descriptor);
                };
            }
        },

        blockGetUserMedia() {
            // Completely block getUserMedia
            if (navigator.mediaDevices) {
                navigator.mediaDevices.getUserMedia = async function(constraints) {
                    if (constraints?.audio) {
                        console.log('🚫 Blocked getUserMedia audio request');
                        throw new DOMException('Microphone access blocked by user', 'NotAllowedError');
                    }
                    return null;
                };
            }
        },

        blockSpeechRecognition() {
            // Block SpeechRecognition
            if (window.SpeechRecognition || window.webkitSpeechRecognition) {
                const SpeechRecognitionBlocked = function() {
                    console.log('🚫 SpeechRecognition blocked');
                    this.start = () => {
                        console.log('🚫 SpeechRecognition.start() blocked');
                        throw new DOMException('Microphone blocked', 'NotAllowedError');
                    };
                };
                window.SpeechRecognition = SpeechRecognitionBlocked;
                window.webkitSpeechRecognition = SpeechRecognitionBlocked;
            }
        },

        blockAnnyang() {
            // Block annyang
            if (window.annyang) {
                window.annyang.start = () => {
                    console.log('🚫 Annyang blocked');
                };
                window.annyang.abort();
            }
        }
    };

    // Apply immediately
    MicNotificationKiller.init();

    // ========================================
    // PART 2: DATABASE POPUP (Ctrl+Shift+B)
    // ========================================

    const DatabasePopup = {
        isOpen: false,

        init() {
            // Register keyboard shortcut
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.shiftKey && e.key === 'B') {
                    e.preventDefault();
                    this.toggle();
                }
            });

            console.log('✅ Database Popup ready (Ctrl+Shift+B)');
        },

        toggle() {
            if (this.isOpen) {
                this.close();
            } else {
                this.open();
            }
        },

        async open() {
            this.isOpen = true;

            // Remove existing popup
            const existing = document.getElementById('databasePopup');
            if (existing) existing.remove();

            // Get database stats
            const stats = await this.getStats();

            const popup = document.createElement('div');
            popup.id = 'databasePopup';
            popup.innerHTML = `
                <div style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.5);
                    z-index: 99999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                " onclick="if(event.target === this) window.DatabasePopup.close()">
                    <div style="
                        width: 700px;
                        max-width: 90%;
                        max-height: 80vh;
                        background: linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%);
                        border-radius: 15px;
                        border: 2px solid #00d4ff;
                        overflow: hidden;
                    " onclick="event.stopPropagation()">
                        <!-- Header -->
                        <div style="
                            background: linear-gradient(135deg, #00d4ff 0%, #3a47d5 100%);
                            padding: 15px 20px;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                        ">
                            <h2 style="margin: 0; color: white; font-size: 18px;">🗄️ AEVOV Database Manager</h2>
                            <button onclick="window.DatabasePopup.close()" style="
                                background: rgba(255,255,255,0.2);
                                border: none;
                                color: white;
                                width: 30px;
                                height: 30px;
                                border-radius: 50%;
                                cursor: pointer;
                                font-size: 20px;
                            ">✕</button>
                        </div>

                        <!-- Content -->
                        <div style="padding: 20px; max-height: calc(80vh - 60px); overflow-y: auto; color: white;">
                            
                            <!-- Database Status -->
                            <div style="background: rgba(0, 212, 255, 0.1); padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #00d4ff;">
                                <h3 style="margin: 0 0 10px 0; color: #00d4ff;">Database Status</h3>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 13px;">
                                    <div><strong>PGlite:</strong> ${stats.pglite ? '✅ Active' : '❌ Offline'}</div>
                                    <div><strong>Electric SQL:</strong> ${stats.electric ? '✅ Syncing' : '⚠️ Local Only'}</div>
                                    <div><strong>Patterns:</strong> ${stats.patterns || 0}</div>
                                    <div><strong>Chunks:</strong> ${stats.chunks || 0}</div>
                                </div>
                            </div>

                            <!-- Quick Actions -->
                            <div style="margin-bottom: 20px;">
                                <h3 style="color: #00d4ff; margin-bottom: 15px;">Quick Actions</h3>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                                    <button onclick="window.DatabasePopup.exportDB()" style="
                                        padding: 12px;
                                        background: linear-gradient(135deg, #00ff88 0%, #00cc70 100%);
                                        border: none;
                                        color: white;
                                        border-radius: 6px;
                                        cursor: pointer;
                                        font-weight: 600;
                                    ">📥 Export Database</button>
                                    
                                    <button onclick="window.DatabasePopup.importDB()" style="
                                        padding: 12px;
                                        background: linear-gradient(135deg, #ff9f0a 0%, #ff6b35 100%);
                                        border: none;
                                        color: white;
                                        border-radius: 6px;
                                        cursor: pointer;
                                        font-weight: 600;
                                    ">📤 Import Database</button>
                                    
                                    <button onclick="window.DatabasePopup.syncCubbit()" style="
                                        padding: 12px;
                                        background: linear-gradient(135deg, #a78bfa 0%, #667eea 100%);
                                        border: none;
                                        color: white;
                                        border-radius: 6px;
                                        cursor: pointer;
                                        font-weight: 600;
                                    ">☁️ Sync to Cubbit</button>
                                    
                                    <button onclick="window.DatabasePopup.clearDB()" style="
                                        padding: 12px;
                                        background: rgba(255, 107, 107, 0.3);
                                        border: 1px solid #ff6b6b;
                                        color: white;
                                        border-radius: 6px;
                                        cursor: pointer;
                                        font-weight: 600;
                                    ">🗑️ Clear Database</button>
                                </div>
                            </div>

                            <!-- Database Tables -->
                            <div style="margin-bottom: 20px;">
                                <h3 style="color: #00d4ff; margin-bottom: 15px;">Tables</h3>
                                <div style="background: rgba(0,0,0,0.3); border-radius: 6px; padding: 15px;">
                                    ${stats.tables.map(t => `
                                        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                                            <span>${t.name}</span>
                                            <span style="color: #00ff88;">${t.rows} rows</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            <!-- SQL Console -->
                            <div>
                                <h3 style="color: #00d4ff; margin-bottom: 15px;">SQL Console</h3>
                                <textarea id="sqlQuery" placeholder="SELECT * FROM patterns LIMIT 10;" style="
                                    width: 100%;
                                    height: 100px;
                                    padding: 10px;
                                    background: rgba(0,0,0,0.3);
                                    border: 1px solid rgba(255,255,255,0.2);
                                    border-radius: 6px;
                                    color: white;
                                    font-family: monospace;
                                    resize: vertical;
                                "></textarea>
                                <button onclick="window.DatabasePopup.runQuery()" style="
                                    margin-top: 10px;
                                    padding: 10px 20px;
                                    background: linear-gradient(135deg, #00d4ff 0%, #3a47d5 100%);
                                    border: none;
                                    color: white;
                                    border-radius: 6px;
                                    cursor: pointer;
                                    font-weight: 600;
                                ">▶️ Run Query</button>
                                <div id="sqlResult" style="
                                    margin-top: 15px;
                                    padding: 10px;
                                    background: rgba(0,0,0,0.3);
                                    border-radius: 6px;
                                    font-family: monospace;
                                    font-size: 12px;
                                    max-height: 200px;
                                    overflow-y: auto;
                                    display: none;
                                "></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(popup);
            console.log('✅ Database popup opened');
        },

        close() {
            const popup = document.getElementById('databasePopup');
            if (popup) popup.remove();
            this.isOpen = false;
        },

        async getStats() {
            const stats = {
                pglite: !!window.AevovDB?.state?.pglite,
                electric: !!window.AevovDB?.state?.electricClient,
                patterns: 0,
                chunks: 0,
                tables: []
            };

            if (window.AevovDB?.state?.pglite) {
                try {
                    // Get pattern count
                    const pResult = await window.AevovDB.state.pglite.query('SELECT COUNT(*) as count FROM patterns');
                    stats.patterns = pResult.rows[0]?.count || 0;

                    // Get chunk count
                    const cResult = await window.AevovDB.state.pglite.query('SELECT COUNT(*) as count FROM chunk_registry');
                    stats.chunks = cResult.rows[0]?.count || 0;

                    // Get all tables
                    const tables = ['patterns', 'chunk_registry', 'evolution_history', 'litespeed_cache', 'pattern_cache'];
                    for (const table of tables) {
                        try {
                            const result = await window.AevovDB.state.pglite.query(`SELECT COUNT(*) as count FROM ${table}`);
                            stats.tables.push({ name: table, rows: result.rows[0]?.count || 0 });
                        } catch (e) {
                            // Table doesn't exist
                        }
                    }
                } catch (error) {
                    console.error('Error getting stats:', error);
                }
            }

            return stats;
        },

        async exportDB() {
            if (!window.AevovDB?.state?.pglite) {
                alert('Database not initialized');
                return;
            }

            try {
                const patterns = await window.AevovDB.state.pglite.query('SELECT * FROM patterns');
                const chunks = await window.AevovDB.state.pglite.query('SELECT * FROM chunk_registry');

                const exportData = {
                    version: '1.0',
                    exported_at: new Date().toISOString(),
                    patterns: patterns.rows,
                    chunks: chunks.rows
                };

                const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `aevov-db-export-${Date.now()}.json`;
                a.click();
                URL.revokeObjectURL(url);

                alert(`Exported ${patterns.rows.length} patterns and ${chunks.rows.length} chunks`);
            } catch (error) {
                alert('Export failed: ' + error.message);
            }
        },

        async importDB() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = async (e) => {
                const file = e.target.files[0];
                const text = await file.text();
                const data = JSON.parse(text);

                if (!window.AevovDB?.insertPattern) {
                    alert('Database not ready');
                    return;
                }

                for (const pattern of data.patterns || []) {
                    await window.AevovDB.insertPattern(pattern);
                }

                alert(`Imported ${data.patterns?.length || 0} patterns`);
                this.close();
                this.open(); // Refresh
            };
            input.click();
        },

        async syncCubbit() {
            if (window.LiteSpeedAevov?.syncToCubbit) {
                await window.LiteSpeedAevov.syncToCubbit();
                alert('Synced to Cubbit successfully');
            } else {
                alert('LiteSpeed integration not available');
            }
        },

        async clearDB() {
            if (!confirm('Clear entire database? This cannot be undone!')) return;

            if (window.AevovDB?.state?.pglite) {
                await window.AevovDB.state.pglite.exec('DELETE FROM patterns');
                await window.AevovDB.state.pglite.exec('DELETE FROM chunk_registry');
                alert('Database cleared');
                this.close();
            }
        },

        async runQuery() {
            const query = document.getElementById('sqlQuery').value;
            const resultDiv = document.getElementById('sqlResult');

            if (!query || !window.AevovDB?.state?.pglite) {
                alert('Invalid query or database not ready');
                return;
            }

            try {
                const result = await window.AevovDB.state.pglite.query(query);
                resultDiv.textContent = JSON.stringify(result.rows, null, 2);
                resultDiv.style.display = 'block';
            } catch (error) {
                resultDiv.textContent = 'Error: ' + error.message;
                resultDiv.style.display = 'block';
                resultDiv.style.color = '#ff6b6b';
            }
        }
    };

    // Initialize both
    DatabasePopup.init();

    // Export globally
    window.DatabasePopup = DatabasePopup;

    console.log('✅ Database Popup + Mic Fix loaded');
    console.log('⌨️ Press Ctrl+Shift+B to open database');

})();
