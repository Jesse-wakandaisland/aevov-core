/**
 * AEVOV SYSTEM DOCK
 * Floating dock with icons for all keyboard shortcut functions
 */

(function() {
    'use strict';

    const AevovDock = {
        dockElement: null,
        position: 'bottom', // bottom, left, right, top

        init() {
            this.createDock();
            this.makeInteractive();
            console.log('✅ AEVOV Dock initialized');
        },

        createDock() {
            const dock = document.createElement('div');
            dock.id = 'aevovDock';
            dock.innerHTML = `
                <div class="dock-container">
                    <!-- Pattern Generator -->
                    <div class="dock-icon" data-action="pattern-generator" title="Pattern Generator (Ctrl+Shift+P)">
                        <svg width="40" height="40" viewBox="0 0 40 40">
                            <rect x="8" y="8" width="24" height="24" rx="4" fill="none" stroke="#00d4ff" stroke-width="2"/>
                            <circle cx="20" cy="20" r="4" fill="#00d4ff"/>
                            <line x1="20" y1="12" x2="20" y2="16" stroke="#00d4ff" stroke-width="2"/>
                            <line x1="20" y1="24" x2="20" y2="28" stroke="#00d4ff" stroke-width="2"/>
                            <line x1="12" y1="20" x2="16" y2="20" stroke="#00d4ff" stroke-width="2"/>
                            <line x1="24" y1="20" x2="28" y2="20" stroke="#00d4ff" stroke-width="2"/>
                        </svg>
                        <span class="dock-label">Patterns</span>
                        <span class="dock-shortcut">Ctrl+Shift+P</span>
                    </div>

                    <!-- NLP Popup -->
                    <div class="dock-icon" data-action="nlp-popup" title="NLP Popup (Ctrl+Shift+L)">
                        <svg width="40" height="40" viewBox="0 0 40 40">
                            <path d="M10,25 Q20,10 30,25" fill="none" stroke="#a78bfa" stroke-width="2"/>
                            <circle cx="15" cy="20" r="3" fill="#a78bfa"/>
                            <circle cx="25" cy="20" r="3" fill="#a78bfa"/>
                            <path d="M12,28 L20,32 L28,28" fill="none" stroke="#a78bfa" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                        <span class="dock-label">NLP</span>
                        <span class="dock-shortcut">Ctrl+Shift+L</span>
                    </div>

                    <!-- Video Streamer -->
                    <div class="dock-icon" data-action="video-streamer" title="Video Streamer (Ctrl+Shift+V)">
                        <svg width="40" height="40" viewBox="0 0 40 40">
                            <rect x="6" y="12" width="28" height="16" rx="2" fill="none" stroke="#00ff88" stroke-width="2"/>
                            <polygon points="16,16 16,24 24,20" fill="#00ff88"/>
                        </svg>
                        <span class="dock-label">Streamer</span>
                        <span class="dock-shortcut">Ctrl+Shift+V</span>
                    </div>

                    <!-- RL Training -->
                    <div class="dock-icon" data-action="rl-training" title="RL Training (Ctrl+Shift+R)">
                        <svg width="40" height="40" viewBox="0 0 40 40">
                            <circle cx="20" cy="20" r="12" fill="none" stroke="#ff9f0a" stroke-width="2"/>
                            <path d="M20,8 L20,20 L28,24" stroke="#ff9f0a" stroke-width="2" stroke-linecap="round"/>
                            <circle cx="20" cy="20" r="2" fill="#ff9f0a"/>
                        </svg>
                        <span class="dock-label">Training</span>
                        <span class="dock-shortcut">Ctrl+Shift+R</span>
                    </div>

                    <!-- Database -->
                    <div class="dock-icon" data-action="database" title="Database (Ctrl+Shift+B)">
                        <svg width="40" height="40" viewBox="0 0 40 40">
                            <ellipse cx="20" cy="12" rx="12" ry="4" fill="none" stroke="#ff6b6b" stroke-width="2"/>
                            <path d="M8,12 L8,28 Q8,32 20,32 Q32,32 32,28 L32,12" fill="none" stroke="#ff6b6b" stroke-width="2"/>
                            <ellipse cx="20" cy="28" rx="12" ry="4" fill="none" stroke="#ff6b6b" stroke-width="2"/>
                        </svg>
                        <span class="dock-label">Database</span>
                        <span class="dock-shortcut">Ctrl+Shift+B</span>
                    </div>

                    <!-- Divider -->
                    <div class="dock-divider"></div>

                    <!-- Settings -->
                    <div class="dock-icon" data-action="settings" title="Dock Settings">
                        <svg width="40" height="40" viewBox="0 0 40 40">
                            <circle cx="20" cy="20" r="3" fill="#fff"/>
                            <path d="M20,10 L20,14 M20,26 L20,30 M10,20 L14,20 M26,20 L30,20 M13,13 L15.5,15.5 M24.5,24.5 L27,27 M27,13 L24.5,15.5 M15.5,24.5 L13,27" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                        <span class="dock-label">Settings</span>
                    </div>
                </div>
            `;

            // Add styles
            const style = document.createElement('style');
            style.textContent = `
                #aevovDock {
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 999999;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }

                .dock-container {
                    display: flex;
                    gap: 8px;
                    padding: 12px;
                    background: rgba(26, 26, 46, 0.95);
                    backdrop-filter: blur(20px);
                    border-radius: 16px;
                    border: 2px solid rgba(0, 212, 255, 0.3);
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                }

                .dock-icon {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 8px;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    background: rgba(255, 255, 255, 0.05);
                }

                .dock-icon:hover {
                    background: rgba(255, 255, 255, 0.1);
                    transform: translateY(-5px) scale(1.05);
                }

                .dock-icon:active {
                    transform: translateY(-3px) scale(1.02);
                }

                .dock-icon svg {
                    margin-bottom: 4px;
                }

                .dock-label {
                    font-size: 10px;
                    color: white;
                    font-weight: 600;
                    text-align: center;
                    white-space: nowrap;
                }

                .dock-shortcut {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: rgba(0, 212, 255, 0.9);
                    color: #0a192f;
                    font-size: 8px;
                    font-weight: 700;
                    padding: 2px 4px;
                    border-radius: 4px;
                    opacity: 0;
                    transition: opacity 0.2s;
                    pointer-events: none;
                }

                .dock-icon:hover .dock-shortcut {
                    opacity: 1;
                }

                .dock-divider {
                    width: 2px;
                    background: rgba(255, 255, 255, 0.2);
                    margin: 0 4px;
                }

                /* Position variants */
                #aevovDock.dock-left {
                    left: 20px;
                    top: 50%;
                    transform: translateY(-50%);
                    bottom: auto;
                }

                #aevovDock.dock-left .dock-container {
                    flex-direction: column;
                }

                #aevovDock.dock-right {
                    right: 20px;
                    left: auto;
                    top: 50%;
                    transform: translateY(-50%);
                    bottom: auto;
                }

                #aevovDock.dock-right .dock-container {
                    flex-direction: column;
                }

                #aevovDock.dock-top {
                    top: 20px;
                    bottom: auto;
                }

                /* Animations */
                @keyframes dock-appear {
                    from {
                        opacity: 0;
                        transform: translateX(-50%) translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0);
                    }
                }

                #aevovDock {
                    animation: dock-appear 0.4s ease;
                }

                /* Dragging */
                #aevovDock.dragging {
                    cursor: move;
                }

                #aevovDock.dragging .dock-container {
                    opacity: 0.7;
                }
            `;
            document.head.appendChild(style);

            document.body.appendChild(dock);
            this.dockElement = dock;
        },

        makeInteractive() {
            const icons = this.dockElement.querySelectorAll('.dock-icon');

            icons.forEach(icon => {
                icon.addEventListener('click', (e) => {
                    const action = icon.dataset.action;
                    this.executeAction(action);
                });
            });

            // Make dock draggable
            let isDragging = false;
            let startX, startY, startLeft, startTop;

            this.dockElement.addEventListener('mousedown', (e) => {
                if (e.target.closest('.dock-icon')) return;
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                const rect = this.dockElement.getBoundingClientRect();
                startLeft = rect.left;
                startTop = rect.top;
                this.dockElement.classList.add('dragging');
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                this.dockElement.style.left = (startLeft + dx) + 'px';
                this.dockElement.style.top = (startTop + dy) + 'px';
                this.dockElement.style.transform = 'none';
            });

            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    this.dockElement.classList.remove('dragging');
                    this.snapToEdge();
                }
            });
        },

        executeAction(action) {
            console.log(`🎯 Dock action: ${action}`);

            switch(action) {
                case 'pattern-generator':
                    if (window.PatternModal?.open) {
                        window.PatternModal.open();
                    } else {
                        console.warn('Pattern Generator not available');
                    }
                    break;

                case 'nlp-popup':
                    if (window.NLPPopup?.open) {
                        window.NLPPopup.open();
                    } else {
                        console.warn('NLP Popup not available');
                    }
                    break;

                case 'video-streamer':
                    if (window.AevmerStreamer?.toggleInterface) {
                        window.AevmerStreamer.toggleInterface();
                    } else {
                        console.warn('Video Streamer not available');
                    }
                    break;

                case 'rl-training':
                    if (window.PerpetualRL?.toggleInterface) {
                        window.PerpetualRL.toggleInterface();
                    } else {
                        console.warn('RL Training not available');
                    }
                    break;

                case 'database':
                    if (window.DatabasePopup?.open) {
                        window.DatabasePopup.open();
                    } else {
                        console.warn('Database Popup not available');
                    }
                    break;

                case 'settings':
                    this.showSettings();
                    break;
            }
        },

        snapToEdge() {
            const rect = this.dockElement.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            // Determine closest edge
            const distances = {
                top: centerY,
                bottom: windowHeight - centerY,
                left: centerX,
                right: windowWidth - centerX
            };

            const closest = Object.keys(distances).reduce((a, b) => 
                distances[a] < distances[b] ? a : b
            );

            // Snap to edge
            this.dockElement.className = `dock-${closest}`;
            this.position = closest;

            // Reset position
            this.dockElement.style.left = '';
            this.dockElement.style.top = '';
            this.dockElement.style.right = '';
            this.dockElement.style.bottom = '';

            // Save preference
            localStorage.setItem('aevov_dock_position', closest);
        },

        showSettings() {
            const positions = ['bottom', 'left', 'right', 'top'];
            const currentIndex = positions.indexOf(this.position);
            const nextPosition = positions[(currentIndex + 1) % positions.length];
            
            this.dockElement.className = `dock-${nextPosition}`;
            this.position = nextPosition;
            localStorage.setItem('aevov_dock_position', nextPosition);

            console.log(`Dock moved to ${nextPosition}`);
        },

        loadPosition() {
            const saved = localStorage.getItem('aevov_dock_position');
            if (saved) {
                this.dockElement.className = `dock-${saved}`;
                this.position = saved;
            }
        }
    };

    // Initialize on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => AevovDock.init());
    } else {
        AevovDock.init();
    }

    // Load saved position after initialization
    setTimeout(() => AevovDock.loadPosition(), 100);

    window.AevovDock = AevovDock;

})();
