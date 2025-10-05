/**
 * INTERACTIVE DOCUMENTATION SYSTEM
 * Hover-based element documentation and help system
 * 
 * Features:
 * - Floating toggle button
 * - Hover tooltips for UI elements
 * - Automatic element detection
 * - Contextual help
 * - Smart positioning
 */

(function() {
    'use strict';

    console.log('📚 Loading Interactive Documentation System...');

    const InteractiveDocSystem = {
        version: '1.0.0',

        // State
        state: {
            initialized: false,
            enabled: false,
            currentTooltip: null,
            documentedElements: new Map(),
            hoverTimeout: null
        },

        // Element documentation database
        elementDocs: {
            // Buttons
            'button': {
                default: 'Click this button to perform an action'
            },
            
            // Inputs
            'input[type="text"]': {
                default: 'Enter text in this field'
            },
            'input[type="number"]': {
                default: 'Enter a numeric value'
            },
            'input[type="password"]': {
                default: 'Enter your password (hidden for security)'
            },
            'input[type="checkbox"]': {
                default: 'Check or uncheck this option'
            },
            'input[type="radio"]': {
                default: 'Select one option from the group'
            },
            'textarea': {
                default: 'Enter multiple lines of text'
            },
            'select': {
                default: 'Choose an option from the dropdown menu'
            },

            // Links
            'a': {
                default: 'Click this link to navigate'
            },

            // Tables
            'table': {
                default: 'Data table with rows and columns'
            },
            'th': {
                default: 'Column header'
            },
            'td': {
                default: 'Table cell containing data'
            }
        },

        // Specific element IDs/classes documentation
        specificDocs: {
            // Query Builder
            '#queryBuilderFloatingBtn': 'Opens the Advanced Query Builder for creating and executing SQL queries',
            '#queryBuilderInterface': 'Advanced SQL Query Builder with visual, natural language, and pattern-based query creation',
            
            // Forms
            '.filter-field': 'Enter the name of the database column to filter by',
            '.filter-operator': 'Select the comparison operator (equals, contains, greater than, etc.)',
            '.filter-value': 'Enter the value to compare against',
            
            // Tabs
            '.qb-tab': 'Click to switch between different query building modes',
            
            // Common patterns
            '[id*="Table"]': 'Table selection input - enter the name of the database table to query',
            '[id*="Columns"]': 'Column selection - specify which columns to retrieve (use * for all)',
            '[id*="Limit"]': 'Maximum number of rows to return - prevents overwhelming results',
            '[id*="OrderBy"]': 'Sorting specification - e.g., "created_at DESC" for newest first',
            
            // Storage related
            '[id*="storage"]': 'Storage configuration settings',
            '[id*="bucket"]': 'Bucket/container name for cloud storage',
            '[id*="region"]': 'Geographic region for storage location',
            '[id*="endpoint"]': 'API endpoint URL for storage service',
            '[id*="accessKey"]': 'Access key ID for authentication',
            '[id*="secretKey"]': 'Secret access key for authentication (keep secure!)',
            
            // Database related
            '[id*="database"]': 'Database connection and configuration',
            '[id*="query"]': 'SQL query input or display area',
            '[id*="result"]': 'Query results display area'
        },

        /**
         * INITIALIZE
         */
        async init() {
            if (this.state.initialized) {
                console.warn('⚠️ Documentation System already initialized');
                return;
            }

            console.log('⚡ Initializing Interactive Documentation System...');

            // Create floating button
            this.createFloatingButton();

            // Setup event listeners
            this.setupEventListeners();

            // Create tooltip container
            this.createTooltipContainer();

            this.state.initialized = true;
            console.log('✅ Interactive Documentation System ready!');
        },

        /**
         * CREATE FLOATING BUTTON
         */
        createFloatingButton() {
            const button = document.createElement('button');
            button.id = 'docSystemFloatingBtn';
            button.innerHTML = '📚<br><span style="font-size: 10px;">HELP</span>';
            button.onclick = () => this.toggleDocMode();
            button.style.cssText = `
                position: fixed;
                left: 20px;
                top: calc(50% + 80px);
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #ff9f0a 0%, #ff6b35 100%);
                border: 3px solid rgba(255, 159, 10, 0.5);
                border-radius: 12px;
                color: white;
                font-size: 20px;
                font-weight: bold;
                cursor: pointer;
                z-index: 9998;
                box-shadow: 0 4px 15px rgba(255, 159, 10, 0.4);
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
                button.style.transform = 'scale(1.1)';
                button.style.boxShadow = '0 6px 20px rgba(255, 159, 10, 0.6)';
            };
            
            button.onmouseleave = () => {
                button.style.transform = 'scale(1)';
                button.style.boxShadow = '0 4px 15px rgba(255, 159, 10, 0.4)';
            };

            document.body.appendChild(button);
            console.log('✅ Documentation button created');
        },

        /**
         * CREATE TOOLTIP CONTAINER
         */
        createTooltipContainer() {
            const tooltip = document.createElement('div');
            tooltip.id = 'docSystemTooltip';
            tooltip.style.cssText = `
                position: fixed;
                background: linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%);
                color: white;
                padding: 12px 16px;
                border-radius: 8px;
                border: 2px solid #ff9f0a;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
                z-index: 99999;
                max-width: 300px;
                font-size: 14px;
                line-height: 1.5;
                display: none;
                pointer-events: none;
            `;

            document.body.appendChild(tooltip);
            this.state.currentTooltip = tooltip;
        },

        /**
         * TOGGLE DOCUMENTATION MODE
         */
        toggleDocMode() {
            this.state.enabled = !this.state.enabled;
            
            const button = document.getElementById('docSystemFloatingBtn');
            if (button) {
                if (this.state.enabled) {
                    button.style.background = 'linear-gradient(135deg, #00ff88 0%, #00d4ff 100%)';
                    button.style.borderColor = 'rgba(0, 255, 136, 0.5)';
                    button.style.boxShadow = '0 4px 15px rgba(0, 255, 136, 0.6)';
                    console.log('📚 Documentation mode ENABLED - Hover over elements to see help');
                    
                    // Show notification
                    this.showNotification('📚 Documentation Mode Active', 'Hover over any element to see its description');
                } else {
                    button.style.background = 'linear-gradient(135deg, #ff9f0a 0%, #ff6b35 100%)';
                    button.style.borderColor = 'rgba(255, 159, 10, 0.5)';
                    button.style.boxShadow = '0 4px 15px rgba(255, 159, 10, 0.4)';
                    console.log('📚 Documentation mode DISABLED');
                    this.hideTooltip();
                }
            }
        },

        /**
         * SETUP EVENT LISTENERS
         */
        setupEventListeners() {
            // Global mouse move to show tooltips
            document.addEventListener('mouseover', (e) => {
                if (!this.state.enabled) return;

                // Clear any pending timeout
                if (this.state.hoverTimeout) {
                    clearTimeout(this.state.hoverTimeout);
                }

                // Delay tooltip appearance slightly
                this.state.hoverTimeout = setTimeout(() => {
                    this.showTooltipForElement(e.target);
                }, 200);
            });

            document.addEventListener('mouseout', (e) => {
                if (!this.state.enabled) return;

                // Clear timeout
                if (this.state.hoverTimeout) {
                    clearTimeout(this.state.hoverTimeout);
                }

                // Hide tooltip with slight delay
                setTimeout(() => {
                    this.hideTooltip();
                }, 100);
            });

            // Track mouse position for tooltip placement
            document.addEventListener('mousemove', (e) => {
                if (!this.state.enabled || !this.state.currentTooltip) return;
                
                if (this.state.currentTooltip.style.display === 'block') {
                    this.positionTooltip(e.clientX, e.clientY);
                }
            });

            // Keyboard shortcut: Ctrl+Shift+H for help
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.shiftKey && e.key === 'H') {
                    e.preventDefault();
                    this.toggleDocMode();
                }
            });
        },

        /**
         * SHOW TOOLTIP FOR ELEMENT
         */
        showTooltipForElement(element) {
            if (!element || element === document.body || element === document.documentElement) {
                this.hideTooltip();
                return;
            }

            // Skip the doc system's own elements
            if (element.id === 'docSystemFloatingBtn' || element.id === 'docSystemTooltip') {
                this.hideTooltip();
                return;
            }

            const doc = this.getDocumentationForElement(element);
            
            if (doc) {
                this.displayTooltip(doc, element);
            } else {
                // Try parent element
                if (element.parentElement) {
                    this.showTooltipForElement(element.parentElement);
                } else {
                    this.hideTooltip();
                }
            }
        },

        /**
         * GET DOCUMENTATION FOR ELEMENT
         */
        getDocumentationForElement(element) {
            // Priority 1: Check specific ID
            if (element.id) {
                const idDoc = this.specificDocs[`#${element.id}`];
                if (idDoc) return idDoc;
            }

            // Priority 2: Check specific class
            if (element.className) {
                const classes = element.className.split(' ');
                for (const cls of classes) {
                    const classDoc = this.specificDocs[`.${cls}`];
                    if (classDoc) return classDoc;
                }
            }

            // Priority 3: Check partial ID match
            if (element.id) {
                for (const [selector, doc] of Object.entries(this.specificDocs)) {
                    if (selector.includes('*')) {
                        const pattern = selector.replace(/\*/g, '.*');
                        const regex = new RegExp(pattern, 'i');
                        if (regex.test(`#${element.id}`)) {
                            return doc;
                        }
                    }
                }
            }

            // Priority 4: Check aria-label or title
            if (element.getAttribute('aria-label')) {
                return element.getAttribute('aria-label');
            }
            if (element.title) {
                return element.title;
            }

            // Priority 5: Check placeholder
            if (element.placeholder) {
                return `Input field: ${element.placeholder}`;
            }

            // Priority 6: Check element type with attributes
            const tagName = element.tagName.toLowerCase();
            const type = element.getAttribute('type');
            
            let selector = tagName;
            if (type) {
                selector = `${tagName}[type="${type}"]`;
            }

            const typeDoc = this.elementDocs[selector];
            if (typeDoc) {
                return typeDoc.default;
            }

            // Priority 7: Generic element type
            const genericDoc = this.elementDocs[tagName];
            if (genericDoc) {
                return genericDoc.default;
            }

            // Priority 8: Check onclick attribute
            if (element.onclick || element.getAttribute('onclick')) {
                const onclickStr = element.getAttribute('onclick') || element.onclick.toString();
                
                // Extract function name
                const functionMatch = onclickStr.match(/(\w+)\(/);
                if (functionMatch) {
                    return `Executes: ${functionMatch[1]}()`;
                }
                return 'Interactive element - click to activate';
            }

            // Priority 9: Check text content for buttons
            if (tagName === 'button' && element.textContent.trim()) {
                return `Button: ${element.textContent.trim()}`;
            }

            // Priority 10: Check data attributes
            for (const attr of element.attributes) {
                if (attr.name.startsWith('data-')) {
                    return `Element with ${attr.name}: ${attr.value}`;
                }
            }

            return null;
        },

        /**
         * DISPLAY TOOLTIP
         */
        displayTooltip(text, element) {
            if (!this.state.currentTooltip) return;

            // Add element info
            const tagName = element.tagName.toLowerCase();
            const id = element.id ? `#${element.id}` : '';
            const className = element.className ? `.${element.className.split(' ')[0]}` : '';
            
            let fullText = `<strong style="color: #ff9f0a;">${tagName}${id}${className}</strong><br>${text}`;

            this.state.currentTooltip.innerHTML = fullText;
            this.state.currentTooltip.style.display = 'block';

            // Highlight the element
            element.style.outline = '2px solid #ff9f0a';
            element.style.outlineOffset = '2px';

            // Store original outline to restore later
            if (!element.dataset.originalOutline) {
                element.dataset.originalOutline = element.style.outline || 'none';
            }
        },

        /**
         * HIDE TOOLTIP
         */
        hideTooltip() {
            if (this.state.currentTooltip) {
                this.state.currentTooltip.style.display = 'none';
            }

            // Remove highlight from previously highlighted element
            document.querySelectorAll('[data-original-outline]').forEach(el => {
                el.style.outline = el.dataset.originalOutline || '';
                el.style.outlineOffset = '';
                delete el.dataset.originalOutline;
            });
        },

        /**
         * POSITION TOOLTIP
         */
        positionTooltip(x, y) {
            if (!this.state.currentTooltip) return;

            const tooltip = this.state.currentTooltip;
            const rect = tooltip.getBoundingClientRect();
            
            let left = x + 15;
            let top = y + 15;

            // Prevent tooltip from going off-screen
            if (left + rect.width > window.innerWidth) {
                left = x - rect.width - 15;
            }
            
            if (top + rect.height > window.innerHeight) {
                top = y - rect.height - 15;
            }

            // Ensure tooltip stays on screen
            left = Math.max(10, Math.min(left, window.innerWidth - rect.width - 10));
            top = Math.max(10, Math.min(top, window.innerHeight - rect.height - 10));

            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${top}px`;
        },

        /**
         * SHOW NOTIFICATION
         */
        showNotification(title, message) {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%);
                color: white;
                padding: 20px;
                border-radius: 10px;
                border: 2px solid #ff9f0a;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
                z-index: 99999;
                max-width: 350px;
                animation: slideIn 0.3s ease;
            `;

            notification.innerHTML = `
                <h3 style="margin: 0 0 10px 0; color: #ff9f0a;">${title}</h3>
                <p style="margin: 0; font-size: 14px; line-height: 1.5;">${message}</p>
            `;

            // Add animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideIn {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);

            document.body.appendChild(notification);

            // Auto-remove after 3 seconds
            setTimeout(() => {
                notification.style.animation = 'slideIn 0.3s ease reverse';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 3000);
        },

        /**
         * ADD CUSTOM DOCUMENTATION
         */
        addDocumentation(selector, documentation) {
            this.specificDocs[selector] = documentation;
            console.log(`✓ Added documentation for ${selector}`);
        },

        /**
         * REGISTER ELEMENT DOCUMENTATION
         */
        registerElement(element, documentation) {
            if (typeof element === 'string') {
                element = document.querySelector(element);
            }
            
            if (element) {
                // Use aria-label for accessibility too
                element.setAttribute('aria-label', documentation);
                console.log(`✓ Registered element documentation`);
            }
        }
    };

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            InteractiveDocSystem.init();
        });
    } else {
        InteractiveDocSystem.init();
    }

    // Export globally
    window.InteractiveDocSystem = InteractiveDocSystem;

    console.log('✅ Interactive Documentation System loaded');
    console.log('⌨️ Press Ctrl+Shift+H to toggle help mode');
    console.log('📚 Click the orange HELP button to enable hover documentation');

})();
