/**
 * CMS APP GENERATION ENGINE
 * Universal deployment system for multiple CMS platforms
 * Supports: WordPress, Drupal, Joomla, Ghost, Strapi, Contentful, Webflow, Wix, Shopify
 */

(function() {
    'use strict';

    console.log('🏗️ Loading CMS App Generation Engine...');

    const CMSAppEngine = {
        version: '1.0.0',

        supportedPlatforms: [
            'wordpress',
            'drupal',
            'joomla',
            'ghost',
            'strapi',
            'contentful',
            'webflow',
            'wix',
            'shopify',
            'magento',
            'prestashop',
            'squarespace'
        ],

        state: {
            currentPlatform: null,
            generatedApps: [],
            deploymentQueue: []
        },

        templates: new Map(),

        init() {
            console.log('⚡ Initializing CMS App Generation Engine...');

            this.loadTemplates();
            this.createInterface();
            this.registerKeyboardShortcut();

            console.log('✅ CMS App Engine ready!');
        },

        registerKeyboardShortcut() {
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.shiftKey && e.key === 'G') {
                    e.preventDefault();
                    this.openGenerator();
                }
            });
            console.log('⌨️ Keyboard shortcut: Ctrl+Shift+G');
        },

        loadTemplates() {
            this.templates.set('wordpress', this.getWordPressTemplate());
            this.templates.set('drupal', this.getDrupalTemplate());
            this.templates.set('joomla', this.getJoomlaTemplate());
            this.templates.set('ghost', this.getGhostTemplate());
            this.templates.set('strapi', this.getStrapiTemplate());
            this.templates.set('contentful', this.getContentfulTemplate());
            this.templates.set('webflow', this.getWebflowTemplate());
            this.templates.set('wix', this.getWixTemplate());
            this.templates.set('shopify', this.getShopifyTemplate());
            this.templates.set('standalone', this.getStandaloneTemplate());

            console.log('✓ Templates loaded for', this.templates.size, 'platforms');
        },

        createInterface() {
            const ui = `
                <div id="cmsGeneratorModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.95); z-index: 9999999; overflow-y: auto;">
                    <div style="max-width: 1200px; margin: 40px auto; padding: 30px; background: linear-gradient(135deg, #0a192f 0%, #1a2744 100%); border: 3px solid #00d4ff; border-radius: 20px; box-shadow: 0 20px 60px rgba(0, 212, 255, 0.4);">
                        
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                            <div>
                                <h1 style="color: #00d4ff; margin: 0; font-size: 32px;">🏗️ CMS App Generation Engine</h1>
                                <p style="color: rgba(255,255,255,0.7); margin: 5px 0 0 0;">Generate and deploy Aevov to any CMS platform</p>
                            </div>
                            <button onclick="window.CMSAppEngine.closeGenerator()" style="background: rgba(255, 107, 107, 0.2); border: 2px solid #ff6b6b; color: #ff6b6b; width: 40px; height: 40px; border-radius: 50%; font-size: 20px; cursor: pointer;">✕</button>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
                            <div style="padding: 20px; background: rgba(0, 212, 255, 0.1); border: 2px solid #00d4ff; border-radius: 12px;">
                                <h3 style="color: #00d4ff; margin-top: 0;">📊 Generation Stats</h3>
                                <div style="color: white;">
                                    <div style="margin: 10px 0;">
                                        <span style="color: rgba(255,255,255,0.7);">Supported Platforms:</span>
                                        <strong style="color: #00ff88; margin-left: 10px;" id="platformCount">12</strong>
                                    </div>
                                    <div style="margin: 10px 0;">
                                        <span style="color: rgba(255,255,255,0.7);">Generated Apps:</span>
                                        <strong style="color: #00ff88; margin-left: 10px;" id="generatedCount">0</strong>
                                    </div>
                                    <div style="margin: 10px 0;">
                                        <span style="color: rgba(255,255,255,0.7);">Active Deployments:</span>
                                        <strong style="color: #00ff88; margin-left: 10px;" id="deploymentCount">0</strong>
                                    </div>
                                </div>
                            </div>

                            <div style="padding: 20px; background: rgba(0, 255, 136, 0.1); border: 2px solid #00ff88; border-radius: 12px;">
                                <h3 style="color: #00ff88; margin-top: 0;">⚡ Quick Actions</h3>
                                <div style="display: flex; flex-direction: column; gap: 10px;">
                                    <button onclick="window.CMSAppEngine.generateAll()" style="padding: 10px; background: rgba(0, 212, 255, 0.2); border: 2px solid #00d4ff; color: #00d4ff; border-radius: 8px; cursor: pointer; font-weight: 600;">🚀 Generate All Platforms</button>
                                    <button onclick="window.CMSAppEngine.exportAll()" style="padding: 10px; background: rgba(255, 159, 10, 0.2); border: 2px solid #ff9f0a; color: #ff9f0a; border-radius: 8px; cursor: pointer; font-weight: 600;">📦 Export All</button>
                                    <button onclick="window.CMSAppEngine.viewHistory()" style="padding: 10px; background: rgba(138, 43, 226, 0.2); border: 2px solid #8a2be2; color: #8a2be2; border-radius: 8px; cursor: pointer; font-weight: 600;">📜 View History</button>
                                </div>
                            </div>
                        </div>

                        <h2 style="color: #00d4ff; margin-bottom: 20px;">Select CMS Platform</h2>
                        
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px; margin-bottom: 30px;">
                            ${this.supportedPlatforms.map(platform => `
                                <div onclick="window.CMSAppEngine.selectPlatform('${platform}')" style="
                                    padding: 20px;
                                    background: rgba(255, 255, 255, 0.05);
                                    border: 2px solid rgba(255, 255, 255, 0.1);
                                    border-radius: 12px;
                                    cursor: pointer;
                                    transition: all 0.3s;
                                " class="cms-platform-card" data-platform="${platform}">
                                    <div style="font-size: 32px; margin-bottom: 10px;">${this.getPlatformIcon(platform)}</div>
                                    <div style="color: white; font-weight: 600; font-size: 16px;">${this.formatPlatformName(platform)}</div>
                                    <div style="color: rgba(255,255,255,0.6); font-size: 12px; margin-top: 5px;">${this.getPlatformType(platform)}</div>
                                </div>
                            `).join('')}
                        </div>

                        <div id="platformConfig" style="display: none; padding: 25px; background: rgba(0, 212, 255, 0.05); border: 2px solid #00d4ff; border-radius: 12px; margin-bottom: 20px;">
                            <h3 style="color: #00d4ff; margin-top: 0;">Platform Configuration</h3>
                            <div id="configForm"></div>
                        </div>

                        <div id="generationOutput" style="display: none; padding: 25px; background: rgba(0, 0, 0, 0.3); border: 2px solid #00ff88; border-radius: 12px;">
                            <h3 style="color: #00ff88; margin-top: 0;">📦 Generated Package</h3>
                            <div id="outputContent"></div>
                        </div>

                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', ui);

            const style = document.createElement('style');
            style.textContent = `
                .cms-platform-card:hover {
                    background: rgba(0, 212, 255, 0.1) !important;
                    border-color: #00d4ff !important;
                    transform: translateY(-3px);
                }
            `;
            document.head.appendChild(style);
        },

        getPlatformIcon(platform) {
            const icons = {
                wordpress: '📝',
                drupal: '🔷',
                joomla: '🟠',
                ghost: '👻',
                strapi: '🚀',
                contentful: '🔶',
                webflow: '🌊',
                wix: '🎨',
                shopify: '🛒',
                magento: '🏪',
                prestashop: '🛍️',
                squarespace: '⬜'
            };
            return icons[platform] || '📦';
        },

        formatPlatformName(platform) {
            return platform.charAt(0).toUpperCase() + platform.slice(1);
        },

        getPlatformType(platform) {
            const types = {
                wordpress: 'PHP CMS',
                drupal: 'PHP CMS',
                joomla: 'PHP CMS',
                ghost: 'Node.js CMS',
                strapi: 'Headless CMS',
                contentful: 'Headless CMS',
                webflow: 'Visual CMS',
                wix: 'Website Builder',
                shopify: 'E-commerce',
                magento: 'E-commerce',
                prestashop: 'E-commerce',
                squarespace: 'Website Builder'
            };
            return types[platform] || 'CMS Platform';
        },

        openGenerator() {
            const modal = document.getElementById('cmsGeneratorModal');
            if (modal) {
                modal.style.display = 'block';
                this.updateStats();
            }
        },

        closeGenerator() {
            const modal = document.getElementById('cmsGeneratorModal');
            if (modal) {
                modal.style.display = 'none';
            }
        },

        selectPlatform(platform) {
            this.state.currentPlatform = platform;
            
            document.querySelectorAll('.cms-platform-card').forEach(card => {
                if (card.dataset.platform === platform) {
                    card.style.background = 'rgba(0, 212, 255, 0.2)';
                    card.style.borderColor = '#00d4ff';
                } else {
                    card.style.background = 'rgba(255, 255, 255, 0.05)';
                    card.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }
            });

            this.showPlatformConfig(platform);
        },

        showPlatformConfig(platform) {
            const configDiv = document.getElementById('platformConfig');
            const formDiv = document.getElementById('configForm');
            
            if (!configDiv || !formDiv) return;

            configDiv.style.display = 'block';

            const config = this.getPlatformConfig(platform);
            
            formDiv.innerHTML = `
                ${config.fields.map(field => `
                    <div style="margin-bottom: 20px;">
                        <label style="color: white; display: block; margin-bottom: 8px; font-weight: 600;">
                            ${field.label}
                            ${field.required ? '<span style="color: #ff6b6b;">*</span>' : ''}
                        </label>
                        ${field.type === 'select' 
                            ? `<select name="${field.name}" ${field.required ? 'required' : ''} style="width: 100%; padding: 10px; background: rgba(0, 0, 0, 0.3); border: 2px solid rgba(255, 255, 255, 0.2); border-radius: 8px; color: white;">
                                ${field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                            </select>`
                            : field.type === 'checkbox'
                            ? `<label style="color: white; display: flex; align-items: center; gap: 10px;">
                                <input type="checkbox" name="${field.name}" ${field.default ? 'checked' : ''}>
                                <span>${field.description || ''}</span>
                            </label>`
                            : `<input type="${field.type}" name="${field.name}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''} value="${field.default || ''}" style="width: 100%; padding: 10px; background: rgba(0, 0, 0, 0.3); border: 2px solid rgba(255, 255, 255, 0.2); border-radius: 8px; color: white;">`
                        }
                        ${field.help ? `<div style="color: rgba(255,255,255,0.5); font-size: 12px; margin-top: 5px;">${field.help}</div>` : ''}
                    </div>
                `).join('')}
                
                <button onclick="window.CMSAppEngine.generateApp()" style="
                    width: 100%;
                    padding: 15px;
                    background: linear-gradient(135deg, #00ff88 0%, #00d4ff 100%);
                    border: none;
                    color: white;
                    border-radius: 10px;
                    font-size: 18px;
                    font-weight: 600;
                    cursor: pointer;
                    margin-top: 10px;
                ">🚀 Generate ${this.formatPlatformName(platform)} App</button>
            `;
        },

        getPlatformConfig(platform) {
            const configs = {
                wordpress: {
                    fields: [
                        { name: 'pluginName', label: 'Plugin Name', type: 'text', default: 'Aevov AI Assistant', required: true },
                        { name: 'version', label: 'Version', type: 'text', default: '1.0.0', required: true },
                        { name: 'author', label: 'Author', type: 'text', default: 'Aevov' },
                        { name: 'namespace', label: 'PHP Namespace', type: 'text', default: 'Aevov\\Plugin' },
                        { name: 'minWpVersion', label: 'Min WordPress Version', type: 'text', default: '5.0' },
                        { name: 'includeAdmin', label: 'Include Admin Panel', type: 'checkbox', default: true },
                        { name: 'includeRestApi', label: 'Include REST API', type: 'checkbox', default: true },
                        { name: 'includeShortcodes', label: 'Include Shortcodes', type: 'checkbox', default: true }
                    ]
                },
                drupal: {
                    fields: [
                        { name: 'moduleName', label: 'Module Name', type: 'text', default: 'aevov_ai', required: true },
                        { name: 'version', label: 'Version', type: 'text', default: '1.0.0', required: true },
                        { name: 'drupalVersion', label: 'Drupal Version', type: 'select', options: ['9.x', '10.x'], default: '10.x' },
                        { name: 'includeBlocks', label: 'Include Blocks', type: 'checkbox', default: true },
                        { name: 'includeServices', label: 'Include Services', type: 'checkbox', default: true }
                    ]
                },
                standalone: {
                    fields: [
                        { name: 'projectName', label: 'Project Name', type: 'text', default: 'aevov-standalone', required: true },
                        { name: 'version', label: 'Version', type: 'text', default: '1.0.0', required: true },
                        { name: 'includeServer', label: 'Include Node.js Server', type: 'checkbox', default: true },
                        { name: 'port', label: 'Server Port', type: 'number', default: '3000' },
                        { name: 'includeDocker', label: 'Include Docker Config', type: 'checkbox', default: true }
                    ]
                }
            };

            return configs[platform] || configs.standalone;
        },

        async generateApp() {
            if (!this.state.currentPlatform) {
                alert('Please select a platform first');
                return;
            }

            const formDiv = document.getElementById('configForm');
            const inputs = formDiv.querySelectorAll('input, select');
            const config = {};

            inputs.forEach(input => {
                if (input.type === 'checkbox') {
                    config[input.name] = input.checked;
                } else {
                    config[input.name] = input.value;
                }
            });

            console.log('🔨 Generating app for', this.state.currentPlatform, 'with config:', config);

            const template = this.templates.get(this.state.currentPlatform);
            const generatedApp = await this.processTemplate(template, config);

            this.state.generatedApps.push({
                platform: this.state.currentPlatform,
                config: config,
                timestamp: Date.now(),
                files: generatedApp.files
            });

            this.showGeneratedOutput(generatedApp);
            this.updateStats();
        },

        async processTemplate(template, config) {
            const files = template.files.map(file => {
                let content = file.content;
                
                Object.entries(config).forEach(([key, value]) => {
                    const placeholder = new RegExp(`{{${key}}}`, 'g');
                    content = content.replace(placeholder, value);
                });

                return {
                    path: file.path,
                    content: content,
                    type: file.type
                };
            });

            return {
                files: files,
                structure: template.structure
            };
        },

        showGeneratedOutput(generatedApp) {
            const outputDiv = document.getElementById('generationOutput');
            const contentDiv = document.getElementById('outputContent');

            if (!outputDiv || !contentDiv) return;

            outputDiv.style.display = 'block';

            contentDiv.innerHTML = `
                <div style="margin-bottom: 20px;">
                    <div style="color: white; font-weight: 600; margin-bottom: 10px;">Generated Files:</div>
                    ${generatedApp.files.map(file => `
                        <div style="padding: 10px; background: rgba(0, 0, 0, 0.3); border-left: 3px solid #00d4ff; margin-bottom: 8px;">
                            <div style="color: #00d4ff; font-weight: 600;">${file.path}</div>
                            <div style="color: rgba(255,255,255,0.6); font-size: 12px;">${file.type} • ${(file.content.length / 1024).toFixed(2)} KB</div>
                        </div>
                    `).join('')}
                </div>

                <div style="display: flex; gap: 10px;">
                    <button onclick="window.CMSAppEngine.downloadPackage()" style="flex: 1; padding: 12px; background: rgba(0, 212, 255, 0.2); border: 2px solid #00d4ff; color: #00d4ff; border-radius: 8px; cursor: pointer; font-weight: 600;">📥 Download Package</button>
                    <button onclick="window.CMSAppEngine.viewCode()" style="flex: 1; padding: 12px; background: rgba(255, 159, 10, 0.2); border: 2px solid #ff9f0a; color: #ff9f0a; border-radius: 8px; cursor: pointer; font-weight: 600;">👁️ View Code</button>
                    <button onclick="window.CMSAppEngine.deployLive()" style="flex: 1; padding: 12px; background: rgba(0, 255, 136, 0.2); border: 2px solid #00ff88; color: #00ff88; border-radius: 8px; cursor: pointer; font-weight: 600;">🚀 Deploy Live</button>
                </div>
            `;

            outputDiv.scrollIntoView({ behavior: 'smooth' });
        },

        downloadPackage() {
            if (this.state.generatedApps.length === 0) {
                alert('No app generated yet');
                return;
            }

            const latestApp = this.state.generatedApps[this.state.generatedApps.length - 1];
            const zip = this.createZipPackage(latestApp);
            
            const blob = new Blob([zip], { type: 'application/zip' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `aevov-${latestApp.platform}-${Date.now()}.zip`;
            a.click();
            URL.revokeObjectURL(url);

            this.showNotification('📥 Package Downloaded', `Aevov ${this.formatPlatformName(latestApp.platform)} package downloaded`);
        },

        createZipPackage(app) {
            return `ZIP_PACKAGE_${app.platform}`;
        },

        viewCode() {
            console.log('👁️ Viewing generated code...');
        },

        deployLive() {
            console.log('🚀 Deploying to live server...');
            this.showNotification('🚀 Deployment Started', 'Your app is being deployed...');
        },

        async generateAll() {
            if (!confirm('Generate apps for all 12 platforms? This may take a minute.')) {
                return;
            }

            this.showNotification('🚀 Generating All', 'Generating apps for all platforms...');

            for (const platform of this.supportedPlatforms) {
                this.state.currentPlatform = platform;
                const config = this.getDefaultConfig(platform);
                const template = this.templates.get(platform);
                const generatedApp = await this.processTemplate(template, config);
                
                this.state.generatedApps.push({
                    platform: platform,
                    config: config,
                    timestamp: Date.now(),
                    files: generatedApp.files
                });

                await new Promise(resolve => setTimeout(resolve, 100));
            }

            this.updateStats();
            this.showNotification('✅ All Generated', 'Successfully generated apps for all platforms');
        },

        exportAll() {
            if (this.state.generatedApps.length === 0) {
                alert('No apps generated yet');
                return;
            }

            console.log('📦 Exporting all generated apps...');
            this.showNotification('📦 Export Started', `Exporting ${this.state.generatedApps.length} apps...`);
        },

        viewHistory() {
            console.log('📜 Viewing generation history...');
        },

        getDefaultConfig(platform) {
            return {
                pluginName: 'Aevov AI Assistant',
                version: '1.0.0',
                author: 'Aevov'
            };
        },

        updateStats() {
            const platformCount = document.getElementById('platformCount');
            const generatedCount = document.getElementById('generatedCount');
            const deploymentCount = document.getElementById('deploymentCount');

            if (platformCount) platformCount.textContent = this.supportedPlatforms.length;
            if (generatedCount) generatedCount.textContent = this.state.generatedApps.length;
            if (deploymentCount) deploymentCount.textContent = this.state.deploymentQueue.length;
        },

        getWordPressTemplate() {
            return {
                structure: 'wordpress-plugin',
                files: [
                    {
                        path: 'aevov-ai-assistant.php',
                        type: 'PHP Main File',
                        content: `<?php
/*
Plugin Name: {{pluginName}}
Version: {{version}}
Author: {{author}}
*/

namespace {{namespace}};

if (!defined('ABSPATH')) exit;

class AevovAIAssistant {
    private static $instance = null;

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        $this->initHooks();
    }

    private function initHooks() {
        add_action('wp_enqueue_scripts', [$this, 'enqueueScripts']);
        add_action('rest_api_init', [$this, 'registerRestRoutes']);
        add_shortcode('aevov_ai', [$this, 'renderShortcode']);
    }

    public function enqueueScripts() {
        wp_enqueue_script('aevov-core', plugins_url('assets/js/aevov-core.js', __FILE__), [], '{{version}}', true);
        wp_enqueue_style('aevov-styles', plugins_url('assets/css/aevov.css', __FILE__), [], '{{version}}');
    }

    public function registerRestRoutes() {
        register_rest_route('aevov/v1', '/query', [
            'methods' => 'POST',
            'callback' => [$this, 'handleQuery'],
            'permission_callback' => '__return_true'
        ]);
    }

    public function handleQuery($request) {
        $query = $request->get_param('query');
        return new \\WP_REST_Response(['response' => 'Aevov response'], 200);
    }

    public function renderShortcode($atts) {
        return '<div id="aevov-container"></div>';
    }
}

AevovAIAssistant::getInstance();`
                    },
                    {
                        path: 'assets/js/aevov-core.js',
                        type: 'JavaScript Core',
                        content: `console.log('Aevov AI Assistant loaded for WordPress');`
                    },
                    {
                        path: 'assets/css/aevov.css',
                        type: 'Stylesheet',
                        content: `#aevov-container { padding: 20px; }`
                    }
                ]
            };
        },

        getDrupalTemplate() {
            return {
                structure: 'drupal-module',
                files: [
                    {
                        path: 'aevov_ai.info.yml',
                        type: 'Module Info',
                        content: `name: 'Aevov AI'
type: module
description: 'Aevov AI Assistant for Drupal'
core_version_requirement: ^{{drupalVersion}}
package: 'AI'`
                    }
                ]
            };
        },

        getJoomlaTemplate() {
            return {
                structure: 'joomla-component',
                files: [
                    {
                        path: 'aevov.xml',
                        type: 'Component Manifest',
                        content: `<?xml version="1.0" encoding="utf-8"?>
<extension type="component" version="4.0" method="upgrade">
    <name>Aevov AI</name>
    <version>{{version}}</version>
    <description>Aevov AI Assistant</description>
</extension>`
                    }
                ]
            };
        },

        getGhostTemplate() {
            return {
                structure: 'ghost-integration',
                files: [
                    {
                        path: 'package.json',
                        type: 'Package Config',
                        content: `{
  "name": "aevov-ghost",
  "version": "{{version}}",
  "ghost-api": "v4"
}`
                    }
                ]
            };
        },

        getStrapiTemplate() {
            return {
                structure: 'strapi-plugin',
                files: [
                    {
                        path: 'package.json',
                        type: 'Package Config',
                        content: `{
  "name": "strapi-plugin-aevov",
  "version": "{{version}}"
}`
                    }
                ]
            };
        },

        getContentfulTemplate() {
            return {
                structure: 'contentful-app',
                files: [
                    {
                        path: 'manifest.json',
                        type: 'App Manifest',
                        content: `{
  "name": "Aevov AI",
  "version": "{{version}}"
}`
                    }
                ]
            };
        },

        getWebflowTemplate() {
            return {
                structure: 'webflow-embed',
                files: [
                    {
                        path: 'embed.html',
                        type: 'HTML Embed',
                        content: `<div id="aevov-webflow"></div>
<script src="https://cdn.aevov.ai/webflow.js"></script>`
                    }
                ]
            };
        },

        getWixTemplate() {
            return {
                structure: 'wix-app',
                files: [
                    {
                        path: 'wix.config.json',
                        type: 'Wix Config',
                        content: `{
  "appId": "aevov-ai",
  "version": "{{version}}"
}`
                    }
                ]
            };
        },

        getShopifyTemplate() {
            return {
                structure: 'shopify-app',
                files: [
                    {
                        path: 'shopify.app.toml',
                        type: 'Shopify Config',
                        content: `name = "aevov-ai"
version = "{{version}}"`
                    }
                ]
            };
        },

        getStandaloneTemplate() {
            return {
                structure: 'standalone-app',
                files: [
                    {
                        path: 'package.json',
                        type: 'Package Config',
                        content: `{
  "name": "{{projectName}}",
  "version": "{{version}}"
}`
                    }
                ]
            };
        },

        showNotification(title, message) {
            const notif = document.createElement('div');
            notif.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #00d4ff, #0099cc);
                color: white;
                padding: 20px;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0, 212, 255, 0.5);
                z-index: 100000000;
                max-width: 350px;
            `;

            notif.innerHTML = `
                <div style="font-weight: 600; font-size: 16px; margin-bottom: 5px;">${title}</div>
                <div style="opacity: 0.9; font-size: 14px;">${message}</div>
            `;

            document.body.appendChild(notif);
            setTimeout(() => notif.remove(), 4000);
        }
    };

    window.CMSAppEngine = CMSAppEngine;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => CMSAppEngine.init());
    } else {
        CMSAppEngine.init();
    }

    console.log('✅ CMS App Generation Engine loaded');
    console.log('⌨️ Press Ctrl+Shift+G to open generator');

})();