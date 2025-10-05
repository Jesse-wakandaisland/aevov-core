/**
 * COMPREHENSIVE BUG FIXES
 * - Fix microphone popup keeps showing
 * - Fix real-time drag and drop ability
 * 
 * Solutions:
 * - Properly manage microphone permissions
 * - Implement true real-time drag-drop with live preview
 */

(function() {
    'use strict';

    console.log('🔧 Loading Comprehensive Bug Fixes...');

    const BugFixes = {
        /**
         * INITIALIZE
         */
        init() {
            console.log('⚡ Applying bug fixes...');

            // Fix 1: Microphone popup
            this.fixMicrophonePopup();

            // Fix 2: Drag and drop
            this.fixDragDrop();

            console.log('✅ Bug fixes applied!');
        },

        /**
         * FIX MICROPHONE POPUP
         */
        fixMicrophonePopup() {
            console.log('🎤 Fixing microphone popup issue...');

            // Store permission state
            const micState = {
                permissionGranted: false,
                askedBefore: false,
                suppressPopup: false
            };

            // Check if permission was previously granted
            if (navigator.permissions && navigator.permissions.query) {
                navigator.permissions.query({ name: 'microphone' })
                    .then(result => {
                        micState.permissionGranted = result.state === 'granted';
                        micState.suppressPopup = result.state === 'denied';

                        console.log(`  Microphone permission: ${result.state}`);

                        // Listen for changes
                        result.onchange = () => {
                            micState.permissionGranted = result.state === 'granted';
                            micState.suppressPopup = result.state === 'denied';
                        };
                    })
                    .catch(err => {
                        console.warn('  Could not query microphone permission:', err);
                    });
            }

            // Patch Supernova voice system
            if (window.AevovSupernova) {
                const originalInit = window.AevovSupernova.initSpeechRecognition;

                window.AevovSupernova.initSpeechRecognition = function() {
                    // Only ask for mic if not already denied
                    if (micState.suppressPopup) {
                        console.log('  ⚠️ Microphone access denied, skipping...');
                        return;
                    }

                    // Only ask once per session
                    if (micState.askedBefore && !micState.permissionGranted) {
                        console.log('  ℹ️ Already asked for microphone, skipping...');
                        return;
                    }

                    micState.askedBefore = true;

                    if (originalInit) {
                        originalInit.call(this);
                    }
                };
            }

            // Intercept getUserMedia calls
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);

                navigator.mediaDevices.getUserMedia = async function(constraints) {
                    // Check if microphone is requested
                    if (constraints && constraints.audio) {
                        // Don't request if previously denied
                        if (micState.suppressPopup) {
                            console.log('  ⚠️ Microphone blocked by user, not requesting');
                            throw new DOMException('Permission denied', 'NotAllowedError');
                        }

                        // Check if already granted
                        if (micState.permissionGranted) {
                            console.log('  ✓ Using existing microphone permission');
                            return await originalGetUserMedia(constraints);
                        }

                        // Ask user with clear explanation
                        const userConsent = confirm(
                            'This app would like to use your microphone for voice commands.\n\n' +
                            'Click OK to enable voice features, or Cancel to use text-only mode.'
                        );

                        if (!userConsent) {
                            micState.suppressPopup = true;
                            throw new DOMException('User denied microphone access', 'NotAllowedError');
                        }
                    }

                    return await originalGetUserMedia(constraints);
                };
            }

            console.log('✅ Microphone popup fix applied');
        },

        /**
         * FIX DRAG AND DROP
         */
        fixDragDrop() {
            console.log('🖱️ Fixing real-time drag and drop...');

            // Enhanced drag-drop system with live preview
            const DragDropManager = {
                state: {
                    dragging: false,
                    dragElement: null,
                    ghost: null,
                    startX: 0,
                    startY: 0,
                    currentX: 0,
                    currentY: 0
                },

                /**
                 * MAKE DRAGGABLE
                 */
                makeDraggable(element, options = {}) {
                    const {
                        handle = element,
                        containment = null,
                        ghostOpacity = 0.7,
                        onDragStart = null,
                        onDrag = null,
                        onDragEnd = null
                    } = options;

                    handle.style.cursor = 'move';
                    handle.setAttribute('draggable', 'true');

                    // Mouse down - start drag
                    handle.addEventListener('mousedown', (e) => {
                        if (e.button !== 0) return; // Only left click

                        e.preventDefault();
                        this.startDrag(element, e, { onDragStart, onDrag, onDragEnd, ghostOpacity });
                    });

                    // Touch support
                    handle.addEventListener('touchstart', (e) => {
                        e.preventDefault();
                        const touch = e.touches[0];
                        this.startDrag(element, touch, { onDragStart, onDrag, onDragEnd, ghostOpacity });
                    }, { passive: false });
                },

                /**
                 * START DRAG
                 */
                startDrag(element, event, options) {
                    this.state.dragging = true;
                    this.state.dragElement = element;
                    this.state.startX = event.clientX;
                    this.state.startY = event.clientY;

                    // Get initial position
                    const rect = element.getBoundingClientRect();
                    const initialLeft = rect.left;
                    const initialTop = rect.top;

                    // Create ghost element for live preview
                    this.state.ghost = element.cloneNode(true);
                    this.state.ghost.style.position = 'fixed';
                    this.state.ghost.style.left = initialLeft + 'px';
                    this.state.ghost.style.top = initialTop + 'px';
                    this.state.ghost.style.width = rect.width + 'px';
                    this.state.ghost.style.height = rect.height + 'px';
                    this.state.ghost.style.opacity = options.ghostOpacity;
                    this.state.ghost.style.pointerEvents = 'none';
                    this.state.ghost.style.zIndex = '10000';
                    this.state.ghost.style.transition = 'none';
                    document.body.appendChild(this.state.ghost);

                    // Make original semi-transparent
                    element.style.opacity = '0.3';

                    // Call start callback
                    if (options.onDragStart) {
                        options.onDragStart(element, event);
                    }

                    // Setup move and end listeners
                    const moveHandler = (e) => this.onDrag(e, element, options);
                    const endHandler = (e) => this.endDrag(e, element, options, moveHandler, endHandler);

                    document.addEventListener('mousemove', moveHandler);
                    document.addEventListener('mouseup', endHandler);
                    document.addEventListener('touchmove', moveHandler, { passive: false });
                    document.addEventListener('touchend', endHandler);

                    // Store handlers for cleanup
                    this.state.moveHandler = moveHandler;
                    this.state.endHandler = endHandler;
                },

                /**
                 * ON DRAG (real-time movement)
                 */
                onDrag(event, element, options) {
                    if (!this.state.dragging) return;

                    event.preventDefault();

                    const clientX = event.clientX || (event.touches && event.touches[0].clientX);
                    const clientY = event.clientY || (event.touches && event.touches[0].clientY);

                    this.state.currentX = clientX;
                    this.state.currentY = clientY;

                    const deltaX = clientX - this.state.startX;
                    const deltaY = clientY - this.state.startY;

                    // Update ghost position in real-time
                    if (this.state.ghost) {
                        const rect = element.getBoundingClientRect();
                        this.state.ghost.style.left = (rect.left + deltaX) + 'px';
                        this.state.ghost.style.top = (rect.top + deltaY) + 'px';
                    }

                    // Call drag callback
                    if (options.onDrag) {
                        options.onDrag(element, deltaX, deltaY, event);
                    }
                },

                /**
                 * END DRAG
                 */
                endDrag(event, element, options, moveHandler, endHandler) {
                    if (!this.state.dragging) return;

                    const deltaX = this.state.currentX - this.state.startX;
                    const deltaY = this.state.currentY - this.state.startY;

                    // Apply final position
                    const rect = element.getBoundingClientRect();
                    element.style.position = 'fixed';
                    element.style.left = (rect.left + deltaX) + 'px';
                    element.style.top = (rect.top + deltaY) + 'px';
                    element.style.opacity = '1';

                    // Remove ghost
                    if (this.state.ghost) {
                        document.body.removeChild(this.state.ghost);
                        this.state.ghost = null;
                    }

                    // Call end callback
                    if (options.onDragEnd) {
                        options.onDragEnd(element, deltaX, deltaY, event);
                    }

                    // Cleanup listeners
                    document.removeEventListener('mousemove', moveHandler);
                    document.removeEventListener('mouseup', endHandler);
                    document.removeEventListener('touchmove', moveHandler);
                    document.removeEventListener('touchend', endHandler);

                    this.state.dragging = false;
                    this.state.dragElement = null;
                }
            };

            // Apply to existing draggable elements
            setTimeout(() => {
                // Fix Supernova overlay
                const supernovaOverlay = document.getElementById('aevovSupernovaOverlay');
                if (supernovaOverlay) {
                    DragDropManager.makeDraggable(supernovaOverlay, {
                        handle: supernovaOverlay.querySelector('div'),
                        onDragStart: () => console.log('🎤 Dragging Supernova overlay'),
                        onDragEnd: (el, dx, dy) => console.log(`  Moved by ${dx}px, ${dy}px`)
                    });
                    console.log('  ✓ Fixed Supernova overlay drag');
                }

                // Fix NLP popup
                const nlpPopup = document.getElementById('nlpPopup');
                if (nlpPopup) {
                    const header = document.getElementById('nlpPopupHeader');
                    if (header) {
                        DragDropManager.makeDraggable(nlpPopup, {
                            handle: header,
                            onDragStart: () => console.log('🧠 Dragging NLP popup'),
                            onDragEnd: (el, dx, dy) => console.log(`  Moved by ${dx}px, ${dy}px`)
                        });
                        console.log('  ✓ Fixed NLP popup drag');
                    }
                }

                // Fix ML5 neural panel
                const ml5Panel = document.getElementById('ml5NeuralPanel');
                if (ml5Panel) {
                    DragDropManager.makeDraggable(ml5Panel, {
                        onDragStart: () => console.log('🤖 Dragging ML5 panel'),
                        onDragEnd: (el, dx, dy) => console.log(`  Moved by ${dx}px, ${dy}px`)
                    });
                    console.log('  ✓ Fixed ML5 panel drag');
                }

                // Fix Aevmer Streamer interface
                const streamerInterface = document.getElementById('aevmerStreamerInterface');
                if (streamerInterface) {
                    DragDropManager.makeDraggable(streamerInterface, {
                        onDragStart: () => console.log('🎬 Dragging Aevmer Streamer'),
                        onDragEnd: (el, dx, dy) => console.log(`  Moved by ${dx}px, ${dy}px`)
                    });
                    console.log('  ✓ Fixed Aevmer Streamer drag');
                }
            }, 2000);

            // Export globally
            window.DragDropManager = DragDropManager;

            console.log('✅ Real-time drag-drop fix applied');
        }
    };

    // Auto-apply fixes
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            BugFixes.init();
        });
    } else {
        BugFixes.init();
    }

    // Export globally
    window.BugFixes = BugFixes;

    console.log('✅ Comprehensive Bug Fixes loaded');
    console.log('🎤 Microphone popup fixed');
    console.log('🖱️ Real-time drag-drop fixed');

})();
