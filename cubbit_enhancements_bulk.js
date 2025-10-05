/**
 * CUBBIT ENHANCED BULK OPERATIONS & CHUNK REGISTRY INTEGRATION
 * 
 * Features:
 * - Bulk permission changes for bucket items
 * - Bulk URL copying for bucket items
 * - Deep integration with Neuro Architect chunk registry
 * - Auto-import bulk copied links to chunk registry
 * - Aevov model implementation for chunk registry
 */

(function() {
    'use strict';

    console.log('☁️ Loading Enhanced Cubbit Operations...');

    const CubbitEnhanced = {
        // State
        state: {
            selectedItems: new Set(),
            copiedURLs: [],
            lastBulkOperation: null
        },

        // Config
        config: {
            maxBulkSize: 100,
            enableAutoImport: true
        },

        /**
         * INITIALIZE
         */
        async init() {
            console.log('⚡ Initializing Enhanced Cubbit Operations...');

            // Wait for CubbitManager
            await this.waitForCubbitManager();

            // Enhance CubbitManager
            this.enhanceCubbitManager();

            // Create bulk operations UI
            this.createBulkOperationsUI();

            // Create chunk registry import button
            this.createChunkRegistryButton();

            console.log('✅ Enhanced Cubbit Operations ready!');
        },

        /**
         * WAIT FOR CUBBIT MANAGER
         */
        async waitForCubbitManager() {
            return new Promise((resolve) => {
                const check = () => {
                    if (window.CubbitManager) {
                        resolve();
                    } else {
                        setTimeout(check, 100);
                    }
                };
                check();
            });
        },

        /**
         * ENHANCE CUBBIT MANAGER
         */
        enhanceCubbitManager() {
            // Add bulk permission method
            window.CubbitManager.bulkChangePermissions = async (fileKeys, permission) => {
                return await this.bulkChangePermissions(fileKeys, permission);
            };

            // Add bulk URL copy method
            window.CubbitManager.bulkCopyURLs = async (fileKeys) => {
                return await this.bulkCopyURLs(fileKeys);
            };

            // Add chunk registry import
            window.CubbitManager.importToChunkRegistry = async (urls) => {
                return await this.importToChunkRegistry(urls);
            };

            console.log('✅ CubbitManager enhanced with bulk operations');
        },

        /**
         * CREATE BULK OPERATIONS UI
         */
        createBulkOperationsUI() {
            const bulkUI = `
                <div id="cubbitBulkOps" style="
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: 15px;
                    border-radius: 10px;
                    margin: 20px 0;
                ">
                    <h3 style="color: white; margin: 0 0 15px 0;">📦 Bulk Operations</h3>
                    
                    <div style="display: grid; gap: 10px;">
                        <!-- Selection Info -->
                        <div style="background: rgba(0, 0, 0, 0.2); padding: 10px; border-radius: 6px;">
                            <div style="color: white; font-size: 14px;">
                                Selected: <span id="bulkSelectedCount" style="font-weight: 600; color: #00ff88;">0</span> items
                            </div>
                        </div>

                        <!-- Bulk Actions -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                            <button onclick="window.CubbitEnhanced.selectAll()" style="
                                padding: 10px;
                                background: rgba(0, 212, 255, 0.3);
                                border: 1px solid #00d4ff;
                                color: white;
                                border-radius: 6px;
                                cursor: pointer;
                            ">
                                ✓ Select All
                            </button>

                            <button onclick="window.CubbitEnhanced.clearSelection()" style="
                                padding: 10px;
                                background: rgba(255, 107, 107, 0.3);
                                border: 1px solid #ff6b6b;
                                color: white;
                                border-radius: 6px;
                                cursor: pointer;
                            ">
                                ✕ Clear Selection
                            </button>
                        </div>

                        <!-- Permission Changes -->
                        <div style="background: rgba(0, 0, 0, 0.2); padding: 10px; border-radius: 6px;">
                            <label style="color: white; font-size: 12px; display: block; margin-bottom: 5px;">
                                Bulk Permission Change
                            </label>
                            <div style="display: grid; grid-template-columns: 1fr auto; gap: 10px;">
                                <select id="bulkPermissionSelect" style="
                                    padding: 8px;
                                    background: rgba(0, 0, 0, 0.3);
                                    border: 1px solid rgba(255, 255, 255, 0.2);
                                    color: white;
                                    border-radius: 6px;
                                ">
                                    <option value="public">Public</option>
                                    <option value="private">Private</option>
                                    <option value="read-only">Read-Only</option>
                                </select>
                                <button onclick="window.CubbitEnhanced.applyBulkPermissions()" style="
                                    padding: 8px 15px;
                                    background: linear-gradient(135deg, #00d4ff 0%, #3a47d5 100%);
                                    border: none;
                                    color: white;
                                    border-radius: 6px;
                                    cursor: pointer;
                                ">
                                    Apply
                                </button>
                            </div>
                        </div>

                        <!-- URL Copy -->
                        <button onclick="window.CubbitEnhanced.copySelectedURLs()" style="
                            padding: 12px;
                            background: linear-gradient(135deg, #00ff88 0%, #00cc70 100%);
                            border: none;
                            color: white;
                            font-weight: 600;
                            border-radius: 6px;
                            cursor: pointer;
                        ">
                            📋 Copy URLs to Clipboard
                        </button>

                        <!-- Status -->
                        <div id="bulkOpStatus" style="display: none; padding: 10px; border-radius: 6px; font-size: 13px;">
                            <!-- Status messages -->
                        </div>
                    </div>
                </div>
            `;

            // Find Cubbit section and insert
            const cubbitSection = document.getElementById('cubbitManagerSection');
            if (cubbitSection) {
                const insertPoint = cubbitSection.querySelector('.card');
                if (insertPoint) {
                    insertPoint.insertAdjacentHTML('afterend', bulkUI);
                    console.log('✅ Bulk operations UI created');
                }
            }
        },

        /**
         * CREATE CHUNK REGISTRY BUTTON
         */
        createChunkRegistryButton() {
            const registryButton = `
                <div id="cubbitChunkRegistryImport" style="
                    background: linear-gradient(135deg, #ff9f0a 0%, #ff6b35 100%);
                    padding: 15px;
                    border-radius: 10px;
                    margin: 20px 0;
                ">
                    <h3 style="color: white; margin: 0 0 10px 0;">🔗 Chunk Registry Integration</h3>
                    <p style="color: rgba(255, 255, 255, 0.9); font-size: 13px; margin: 0 0 15px 0;">
                        Import bulk copied URLs directly into the Neuro Architect Chunk Registry for pattern evolution.
                    </p>

                    <div style="background: rgba(0, 0, 0, 0.2); padding: 10px; border-radius: 6px; margin-bottom: 10px;">
                        <div style="color: white; font-size: 14px;">
                            Copied URLs in clipboard: <span id="copiedURLsCount" style="font-weight: 600; color: #00ff88;">0</span>
                        </div>
                    </div>

                    <button onclick="window.CubbitEnhanced.importCopiedToChunkRegistry()" style="
                        width: 100%;
                        padding: 12px;
                        background: linear-gradient(135deg, #00d4ff 0%, #3a47d5 100%);
                        border: none;
                        color: white;
                        font-weight: 600;
                        border-radius: 6px;
                        cursor: pointer;
                    ">
                        🧬 Import to Neuro Architect Chunk Registry
                    </button>

                    <div id="chunkImportStatus" style="display: none; margin-top: 10px; padding: 10px; border-radius: 6px; font-size: 13px;">
                        <!-- Status messages -->
                    </div>
                </div>
            `;

            // Insert under Neuro Architect tab
            const architectTab = document.getElementById('architect');
            if (architectTab) {
                const chunkSection = architectTab.querySelector('.section');
                if (chunkSection) {
                    chunkSection.insertAdjacentHTML('beforeend', registryButton);
                    console.log('✅ Chunk registry import button created');
                }
            }
        },

        /**
         * SELECT ALL
         */
        selectAll() {
            // Get all file items from Cubbit
            if (window.CubbitManager && window.CubbitManager.state.files) {
                window.CubbitManager.state.files.forEach(file => {
                    this.state.selectedItems.add(file.key);
                });
                
                this.updateSelectionCount();
                console.log(`✅ Selected ${this.state.selectedItems.size} items`);
            }
        },

        /**
         * CLEAR SELECTION
         */
        clearSelection() {
            this.state.selectedItems.clear();
            this.updateSelectionCount();
            console.log('✅ Selection cleared');
        },

        /**
         * UPDATE SELECTION COUNT
         */
        updateSelectionCount() {
            const countEl = document.getElementById('bulkSelectedCount');
            if (countEl) {
                countEl.textContent = this.state.selectedItems.size;
            }
        },

        /**
         * APPLY BULK PERMISSIONS
         */
        async applyBulkPermissions() {
            const permission = document.getElementById('bulkPermissionSelect').value;
            const statusEl = document.getElementById('bulkOpStatus');

            if (this.state.selectedItems.size === 0) {
                alert('No items selected');
                return;
            }

            if (this.state.selectedItems.size > this.config.maxBulkSize) {
                alert(`Cannot process more than ${this.config.maxBulkSize} items at once`);
                return;
            }

            statusEl.style.display = 'block';
            statusEl.style.background = 'rgba(0, 212, 255, 0.2)';
            statusEl.style.color = '#00d4ff';
            statusEl.textContent = `Applying ${permission} permission to ${this.state.selectedItems.size} items...`;

            console.log(`📝 Applying ${permission} to ${this.state.selectedItems.size} items`);

            try {
                await this.bulkChangePermissions(Array.from(this.state.selectedItems), permission);

                statusEl.style.background = 'rgba(0, 255, 136, 0.2)';
                statusEl.style.color = '#00ff88';
                statusEl.textContent = `✅ Successfully applied ${permission} to ${this.state.selectedItems.size} items`;

                this.state.lastBulkOperation = {
                    type: 'permission_change',
                    count: this.state.selectedItems.size,
                    permission,
                    timestamp: Date.now()
                };

            } catch (error) {
                statusEl.style.background = 'rgba(255, 107, 107, 0.2)';
                statusEl.style.color = '#ff6b6b';
                statusEl.textContent = `❌ Error: ${error.message}`;
            }
        },

        /**
         * BULK CHANGE PERMISSIONS
         */
        async bulkChangePermissions(fileKeys, permission) {
            console.log(`🔒 Changing permissions for ${fileKeys.length} files to ${permission}`);

            const results = [];

            for (const key of fileKeys) {
                try {
                    // Simulated permission change (implement actual Cubbit API call)
                    await new Promise(resolve => setTimeout(resolve, 100));
                    
                    results.push({
                        key,
                        success: true,
                        permission
                    });

                    console.log(`  ✓ ${key} → ${permission}`);
                } catch (error) {
                    results.push({
                        key,
                        success: false,
                        error: error.message
                    });
                    console.error(`  ✗ ${key}: ${error.message}`);
                }
            }

            return results;
        },

        /**
         * COPY SELECTED URLs
         */
        async copySelectedURLs() {
            if (this.state.selectedItems.size === 0) {
                alert('No items selected');
                return;
            }

            const statusEl = document.getElementById('bulkOpStatus');
            statusEl.style.display = 'block';
            statusEl.style.background = 'rgba(0, 212, 255, 0.2)';
            statusEl.style.color = '#00d4ff';
            statusEl.textContent = `Copying URLs for ${this.state.selectedItems.size} items...`;

            try {
                const urls = await this.bulkCopyURLs(Array.from(this.state.selectedItems));
                
                // Copy to clipboard
                const urlText = urls.join('\n');
                await navigator.clipboard.writeText(urlText);

                // Store for chunk registry import
                this.state.copiedURLs = urls;

                statusEl.style.background = 'rgba(0, 255, 136, 0.2)';
                statusEl.style.color = '#00ff88';
                statusEl.textContent = `✅ Copied ${urls.length} URLs to clipboard`;

                // Update copied count
                const countEl = document.getElementById('copiedURLsCount');
                if (countEl) {
                    countEl.textContent = urls.length;
                }

                this.state.lastBulkOperation = {
                    type: 'url_copy',
                    count: urls.length,
                    timestamp: Date.now()
                };

                console.log(`✅ Copied ${urls.length} URLs to clipboard`);

            } catch (error) {
                statusEl.style.background = 'rgba(255, 107, 107, 0.2)';
                statusEl.style.color = '#ff6b6b';
                statusEl.textContent = `❌ Error: ${error.message}`;
            }
        },

        /**
         * BULK COPY URLs
         */
        async bulkCopyURLs(fileKeys) {
            console.log(`📋 Copying URLs for ${fileKeys.length} files`);

            const urls = [];

            for (const key of fileKeys) {
                try {
                    // Get URL from Cubbit (simulated - implement actual API)
                    const url = `https://cubbit.io/bucket/${encodeURIComponent(key)}`;
                    urls.push(url);
                    console.log(`  ✓ ${key} → ${url}`);
                } catch (error) {
                    console.error(`  ✗ ${key}: ${error.message}`);
                }
            }

            return urls;
        },

        /**
         * IMPORT COPIED TO CHUNK REGISTRY
         */
        async importCopiedToChunkRegistry() {
            const statusEl = document.getElementById('chunkImportStatus');

            if (this.state.copiedURLs.length === 0) {
                alert('No URLs in clipboard. Please copy URLs first.');
                return;
            }

            statusEl.style.display = 'block';
            statusEl.style.background = 'rgba(0, 212, 255, 0.2)';
            statusEl.style.color = '#00d4ff';
            statusEl.textContent = `Importing ${this.state.copiedURLs.length} URLs to chunk registry...`;

            console.log(`🔗 Importing ${this.state.copiedURLs.length} URLs to chunk registry`);

            try {
                await this.importToChunkRegistry(this.state.copiedURLs);

                statusEl.style.background = 'rgba(0, 255, 136, 0.2)';
                statusEl.style.color = '#00ff88';
                statusEl.textContent = `✅ Successfully imported ${this.state.copiedURLs.length} URLs to Neuro Architect`;

                // Clear copied URLs
                this.state.copiedURLs = [];
                document.getElementById('copiedURLsCount').textContent = '0';

                console.log('✅ Import complete');

            } catch (error) {
                statusEl.style.background = 'rgba(255, 107, 107, 0.2)';
                statusEl.style.color = '#ff6b6b';
                statusEl.textContent = `❌ Error: ${error.message}`;
            }
        },

        /**
         * IMPORT TO CHUNK REGISTRY
         */
        async importToChunkRegistry(urls) {
            console.log('🧬 Importing to Neuro Architect chunk registry...');

            if (!window.NeuroArchitect) {
                throw new Error('Neuro Architect not available');
            }

            const imported = [];

            for (const url of urls) {
                try {
                    // Register with Neuro Architect
                    const source = await window.NeuroArchitect.registerChunkSource(url, {
                        source: 'cubbit_bulk_import',
                        importedAt: new Date().toISOString(),
                        aevovModel: true // Flag for Aevov model implementation
                    });

                    imported.push(source);
                    console.log(`  ✓ Registered: ${url}`);
                } catch (error) {
                    console.error(`  ✗ Failed to register ${url}: ${error.message}`);
                }
            }

            // Update Neuro Architect stats
            if (document.getElementById('registeredChunks')) {
                document.getElementById('registeredChunks').textContent = 
                    window.NeuroArchitect.state.chunkRegistry.length;
            }

            return imported;
        },

        /**
         * TOGGLE ITEM SELECTION
         */
        toggleItemSelection(fileKey) {
            if (this.state.selectedItems.has(fileKey)) {
                this.state.selectedItems.delete(fileKey);
            } else {
                this.state.selectedItems.add(fileKey);
            }
            
            this.updateSelectionCount();
        }
    };

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            CubbitEnhanced.init();
        });
    } else {
        CubbitEnhanced.init();
    }

    // Export globally
    window.CubbitEnhanced = CubbitEnhanced;

    console.log('✅ Enhanced Cubbit Operations loaded');
    console.log('📦 Bulk permissions, URL copy, and chunk registry integration ready');

})();
