/**
 * CUBBIT MANAGER UI
 * Comprehensive interface for Cubbit cloud storage
 * Inject this into your HTML to get full Cubbit functionality
 */

(function() {
    'use strict';

    console.log('🎨 Loading Cubbit Manager UI...');

    // Wait for DOM and CubbitManager
    const initUI = () => {
        if (!window.CubbitManager) {
            console.warn('⚠️ CubbitManager not loaded yet, waiting...');
            setTimeout(initUI, 500);
            return;
        }

        injectUI();
    };

    function injectUI() {
        // Find insertion point (architect tab)
        const architectTab = document.getElementById('architect');
        
        if (!architectTab) {
            console.warn('⚠️ Architect tab not found');
            return;
        }

        // Create Cubbit UI section
        const cubbitSection = document.createElement('div');
        cubbitSection.className = 'section';
        cubbitSection.id = 'cubbitManagerSection';
        cubbitSection.innerHTML = `
            <h2>☁️ Cubbit Cloud Manager</h2>
            <div class="info-box">
                <strong>Professional Cloud Storage:</strong> Full-featured Cubbit S3-compatible storage manager with bulk operations, 
                auto-upload, and .aev domain support. Connect your Cubbit bucket and manage all your AI models in the cloud.
            </div>

            <!-- Connection Panel -->
            <div class="card" style="margin-bottom: 20px;">
                <h3 style="color: #00d4ff; margin-bottom: 15px;">🔌 Connection</h3>
                
                <div id="cubbitConnectionStatus" style="margin-bottom: 15px;">
                    <div class="status-message info">
                        <strong>Status:</strong> Not connected
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div class="input-group">
                        <label>Access Key ID</label>
                        <input type="text" id="cubbitAccessKey" placeholder="Your access key">
                    </div>
                    <div class="input-group">
                        <label>Secret Access Key</label>
                        <input type="password" id="cubbitSecretKey" placeholder="Your secret key">
                    </div>
                </div>

                <div class="input-group">
                    <label>Bucket Name</label>
                    <input type="text" id="cubbitBucket" placeholder="my-ai-models">
                </div>

                <div style="display: flex; gap: 10px;">
                    <button class="btn btn-success" onclick="connectCubbit()">
                        🔌 Connect
                    </button>
                    <button class="btn btn-warning" onclick="disconnectCubbit()" id="cubbitDisconnectBtn" disabled>
                        🔌 Disconnect
                    </button>
                    <button class="btn" onclick="testCubbitConnection()">
                        🧪 Test Connection
                    </button>
                </div>
            </div>

            <!-- File Browser -->
            <div class="card" style="margin-bottom: 20px;">
                <h3 style="color: #00d4ff; margin-bottom: 15px;">📁 File Browser</h3>
                
                <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                    <input type="text" id="cubbitCurrentPath" placeholder="/" readonly style="flex: 1;">
                    <button class="btn" onclick="refreshCubbitFiles()">
                        🔄 Refresh
                    </button>
                    <button class="btn" onclick="cubbitGoUp()">
                        ⬆️ Up
                    </button>
                </div>

                <div id="cubbitFileList" style="background: rgba(0,0,0,0.3); border-radius: 8px; padding: 15px; min-height: 200px; max-height: 400px; overflow-y: auto;">
                    <div style="text-align: center; opacity: 0.5; padding: 40px;">
                        Connect to Cubbit to browse files
                    </div>
                </div>
            </div>

            <!-- Actions Panel -->
            <div class="card" style="margin-bottom: 20px;">
                <h3 style="color: #00d4ff; margin-bottom: 15px;">⚡ Actions</h3>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
                    <button class="btn btn-success" onclick="uploadFilesToCubbit()">
                        📤 Upload Files
                    </button>
                    <button class="btn btn-warning" onclick="downloadSelectedFiles()">
                        📥 Download Selected
                    </button>
                    <button class="btn btn-danger" onclick="deleteSelectedFiles()">
                        🗑️ Delete Selected
                    </button>
                    <button class="btn" onclick="setPermissionsDialog()">
                        🔐 Set Permissions
                    </button>
                    <button class="btn" onclick="createFolderDialog()">
                        📁 Create Folder
                    </button>
                    <button class="btn" onclick="bulkOperationsDialog()">
                        📦 Bulk Operations
                    </button>
                </div>
            </div>

            <!-- Auto-Upload Panel -->
            <div class="card" style="margin-bottom: 20px;">
                <h3 style="color: #00ff88; margin-bottom: 15px;">🔄 Auto-Upload</h3>
                
                <div class="info-box" style="background: rgba(0, 255, 136, 0.1); border-color: #00ff88;">
                    <strong>Automatic Pattern Upload:</strong> When enabled, patterns generated by Advanced Extractor 
                    and JSON Loader will automatically upload to your Cubbit bucket.
                </div>

                <div style="display: flex; gap: 10px; align-items: center; margin-top: 15px;">
                    <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                        <input type="checkbox" id="cubbitAutoUpload" onchange="toggleAutoUpload(this.checked)" style="width: auto; transform: scale(1.5);">
                        <span style="font-weight: 600;">Enable Auto-Upload</span>
                    </label>
                </div>

                <div id="cubbitAutoUploadStatus" style="margin-top: 10px; font-size: 13px; opacity: 0.8;">
                    Status: Disabled
                </div>
            </div>

            <!-- Stats Panel -->
            <div class="stats-grid">
                <div class="stat-card" style="background: linear-gradient(135deg, #00d4ff 0%, #0099ff 100%);">
                    <div class="stat-value" id="cubbitTotalFiles">0</div>
                    <div class="stat-label">Files</div>
                </div>
                <div class="stat-card" style="background: linear-gradient(135deg, #00ff88 0%, #00cc70 100%);">
                    <div class="stat-value" id="cubbitTotalSize">0 MB</div>
                    <div class="stat-label">Total Size</div>
                </div>
                <div class="stat-card" style="background: linear-gradient(135deg, #ff9f0a 0%, #ff6b35 100%);">
                    <div class="stat-value" id="cubbitUploaded">0</div>
                    <div class="stat-label">Uploaded</div>
                </div>
                <div class="stat-card" style="background: linear-gradient(135deg, #ff453a 0%, #ff375f 100%);">
                    <div class="stat-value" id="cubbitFailed">0</div>
                    <div class="stat-label">Failed</div>
                </div>
            </div>

            <!-- Progress Indicator -->
            <div id="cubbitProgress" style="display: none; margin-top: 20px;">
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill" id="cubbitProgressFill">0%</div>
                    </div>
                </div>
                <div id="cubbitProgressStatus" class="status-message info"></div>
            </div>
        `;

        // Insert before existing sections
        const firstSection = architectTab.querySelector('.section');
        if (firstSection) {
            architectTab.insertBefore(cubbitSection, firstSection);
        } else {
            architectTab.appendChild(cubbitSection);
        }

        console.log('✅ Cubbit Manager UI injected');
    }

    // Global UI functions
    window.connectCubbit = async () => {
        const accessKey = document.getElementById('cubbitAccessKey').value.trim();
        const secretKey = document.getElementById('cubbitSecretKey').value.trim();
        const bucket = document.getElementById('cubbitBucket').value.trim();

        if (!accessKey || !secretKey || !bucket) {
            alert('Please fill in all connection details');
            return;
        }

        try {
            const result = await window.CubbitManager.connect(accessKey, secretKey, bucket);
            
            if (result.success) {
                document.getElementById('cubbitConnectionStatus').innerHTML = `
                    <div class="status-message success">
                        <strong>✅ Connected to:</strong> ${bucket}
                    </div>
                `;
                document.getElementById('cubbitDisconnectBtn').disabled = false;
                updateStats();
                refreshCubbitFiles();
            } else {
                alert(`Connection failed: ${result.error}`);
            }
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    window.disconnectCubbit = () => {
        window.CubbitManager.disconnect();
        document.getElementById('cubbitConnectionStatus').innerHTML = `
            <div class="status-message info">
                <strong>Status:</strong> Not connected
            </div>
        `;
        document.getElementById('cubbitDisconnectBtn').disabled = true;
        document.getElementById('cubbitFileList').innerHTML = `
            <div style="text-align: center; opacity: 0.5; padding: 40px;">
                Connect to Cubbit to browse files
            </div>
        `;
    };

    window.refreshCubbitFiles = async () => {
        try {
            const path = window.CubbitManager.state.currentPath;
            const result = await window.CubbitManager.listFiles(path);
            
            displayFiles(result);
            updateStats();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    function displayFiles(result) {
        const listDiv = document.getElementById('cubbitFileList');
        let html = '';

        // Display folders
        if (result.folders.length > 0) {
            html += '<h4 style="color: #00d4ff; margin-bottom: 10px;">📁 Folders</h4>';
            result.folders.forEach(folder => {
                html += `
                    <div class="pattern-item" onclick="openFolder('${folder.prefix}')" style="cursor: pointer;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 24px;">📁</span>
                            <span style="font-weight: 600;">${folder.name}</span>
                        </div>
                    </div>
                `;
            });
        }

        // Display files
        if (result.files.length > 0) {
            html += '<h4 style="color: #00d4ff; margin: 20px 0 10px 0;">📄 Files</h4>';
            result.files.forEach(file => {
                html += `
                    <div class="pattern-item">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <input type="checkbox" class="file-select" data-key="${file.key}" style="transform: scale(1.3);">
                            <span style="font-size: 20px;">📄</span>
                            <div style="flex: 1;">
                                <div style="font-weight: 600;">${file.name}</div>
                                <div style="font-size: 12px; opacity: 0.7;">
                                    ${formatBytes(file.size)} • ${new Date(file.lastModified).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        if (result.files.length === 0 && result.folders.length === 0) {
            html = '<div style="text-align: center; opacity: 0.5; padding: 40px;">No files or folders</div>';
        }

        listDiv.innerHTML = html;
        document.getElementById('cubbitCurrentPath').value = window.CubbitManager.state.currentPath || '/';
    }

    window.openFolder = async (prefix) => {
        try {
            const result = await window.CubbitManager.listFiles(prefix);
            displayFiles(result);
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    window.cubbitGoUp = async () => {
        const current = window.CubbitManager.state.currentPath;
        if (!current) return;

        const parts = current.split('/').filter(p => p);
        parts.pop();
        const parent = parts.join('/');

        await openFolder(parent);
    };

    window.uploadFilesToCubbit = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        
        input.onchange = async (e) => {
            const files = Array.from(e.target.files);
            if (files.length === 0) return;

            const progressDiv = document.getElementById('cubbitProgress');
            const statusDiv = document.getElementById('cubbitProgressStatus');
            const progressFill = document.getElementById('cubbitProgressFill');

            progressDiv.style.display = 'block';

            try {
                const results = await window.CubbitManager.uploadFiles(
                    files,
                    window.CubbitManager.state.currentPath,
                    (progress) => {
                        progressFill.style.width = progress.percentage + '%';
                        progressFill.textContent = progress.percentage + '%';
                        statusDiv.textContent = `Uploading ${progress.current}... (${progress.completed}/${progress.total})`;
                    }
                );

                const successful = results.filter(r => r.success).length;
                alert(`Upload complete: ${successful}/${files.length} files uploaded`);

                refreshCubbitFiles();

            } catch (error) {
                alert(`Error: ${error.message}`);
            } finally {
                progressDiv.style.display = 'none';
            }
        };

        input.click();
    };

    window.deleteSelectedFiles = async () => {
        const selected = getSelectedFiles();
        if (selected.length === 0) {
            alert('No files selected');
            return;
        }

        if (!confirm(`Delete ${selected.length} file(s)?`)) return;

        try {
            const results = await window.CubbitManager.deleteFiles(selected, (progress) => {
                console.log(`Deleting: ${progress.current} (${progress.completed}/${progress.total})`);
            });

            const successful = results.filter(r => r.success).length;
            alert(`Delete complete: ${successful}/${selected.length} files deleted`);

            refreshCubbitFiles();

        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    window.toggleAutoUpload = (enabled) => {
        window.CubbitManager.setAutoUpload(enabled);
        document.getElementById('cubbitAutoUploadStatus').textContent = 
            `Status: ${enabled ? '✅ Enabled' : '❌ Disabled'}`;
    };

    function getSelectedFiles() {
        const checkboxes = document.querySelectorAll('.file-select:checked');
        return Array.from(checkboxes).map(cb => cb.dataset.key);
    }

    function updateStats() {
        const stats = window.CubbitManager.stats;
        document.getElementById('cubbitTotalFiles').textContent = stats.totalFiles;
        document.getElementById('cubbitTotalSize').textContent = formatBytes(stats.totalSize);
        document.getElementById('cubbitUploaded').textContent = stats.uploadedFiles;
        document.getElementById('cubbitFailed').textContent = stats.failedUploads;
    }

    function formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Initialize when ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUI);
    } else {
        initUI();
    }

    console.log('✅ Cubbit Manager UI loaded');

})();
