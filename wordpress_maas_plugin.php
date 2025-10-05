<?php
/**
 * Plugin Name: AEVOV Models-as-a-Service
 * Plugin URI: https://aevov.ai/wordpress-plugin
 * Description: Complete AEVOV pattern system with Models-as-a-Service pricing integration. JS bundled in PHP WASM for proprietary protection.
 * Version: 2.0.0
 * Author: AEVOV Team
 * Author URI: https://aevov.ai
 * License: Proprietary
 * Requires at least: 6.0
 * Requires PHP: 8.0
 * Text Domain: aevov-maas
 * 
 * This plugin provides:
 * - Complete AEVOV pattern system
 * - Models-as-a-Service with tiered pricing
 * - PHP WASM JS obfuscation
 * - Pattern Sync Protocol integration
 * - Review-based free access
 * - Cloudflare Workers sync
 * - Advanced Query Builder
 * - Perpetual free conversational AI
 */

if (!defined('ABSPATH')) {
    exit;
}

// Plugin constants
define('AEVOV_MAAS_VERSION', '2.0.0');
define('AEVOV_MAAS_PATH', plugin_dir_path(__FILE__));
define('AEVOV_MAAS_URL', plugin_dir_url(__FILE__));
define('AEVOV_MAAS_API_ENDPOINT', 'https://api.aevov.ai/v1');

class AEVOV_MaaS_Plugin {
    
    private $version = AEVOV_MAAS_VERSION;
    private $php_wasm_loaded = false;
    
    /**
     * Constructor
     */
    public function __construct() {
        // Core hooks
        add_action('init', array($this, 'init'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('admin_enqueue_scripts', array($this, 'admin_enqueue_scripts'));
        
        // AJAX handlers
        add_action('wp_ajax_aevov_activate_license', array($this, 'ajax_activate_license'));
        add_action('wp_ajax_aevov_check_review', array($this, 'ajax_check_review'));
        add_action('wp_ajax_aevov_sync_patterns', array($this, 'ajax_sync_patterns'));
        add_action('wp_ajax_aevov_download_model', array($this, 'ajax_download_model'));
        
        // REST API
        add_action('rest_api_init', array($this, 'register_rest_routes'));
        
        // Shortcodes
        add_shortcode('aevov_chat', array($this, 'chat_shortcode'));
        add_shortcode('aevov_query_builder', array($this, 'query_builder_shortcode'));
        add_shortcode('aevov_pricing', array($this, 'pricing_shortcode'));
        
        // Cron
        add_action('aevov_check_updates', array($this, 'check_model_updates'));
        add_action('aevov_sync_patterns', array($this, 'sync_patterns_cron'));
        
        // Initialize PHP WASM
        $this->init_php_wasm();
    }
    
    /**
     * Initialize plugin
     */
    public function init() {
        // Register custom post types
        $this->register_post_types();
        
        // Setup cron jobs
        $this->setup_cron_jobs();
        
        // Check license on init
        $this->check_license();
    }
    
    /**
     * Initialize PHP WASM for JS obfuscation
     */
    private function init_php_wasm() {
        // Check if PHP WASM is available
        if (function_exists('wasm_execute')) {
            $this->php_wasm_loaded = true;
            error_log('AEVOV: PHP WASM loaded successfully');
        } else {
            error_log('AEVOV: PHP WASM not available, using standard JS');
        }
    }
    
    /**
     * Bundle and obfuscate JS using PHP WASM
     */
    private function bundle_js_with_wasm($js_files) {
        if (!$this->php_wasm_loaded) {
            // Fallback: standard concatenation
            return $this->bundle_js_standard($js_files);
        }
        
        // Bundle all JS files
        $bundled = '';
        foreach ($js_files as $file) {
            $path = AEVOV_MAAS_PATH . 'assets/js/' . $file;
            if (file_exists($path)) {
                $bundled .= file_get_contents($path) . "\n\n";
            }
        }
        
        // Obfuscate using PHP WASM
        try {
            $wasm_module = AEVOV_MAAS_PATH . 'wasm/obfuscator.wasm';
            
            if (file_exists($wasm_module)) {
                // Execute WASM obfuscation
                $obfuscated = wasm_execute($wasm_module, 'obfuscate', [$bundled]);
                
                // Cache the obfuscated version
                $cache_file = AEVOV_MAAS_PATH . 'cache/bundle-obfuscated.js';
                file_put_contents($cache_file, $obfuscated);
                
                return $obfuscated;
            }
        } catch (Exception $e) {
            error_log('AEVOV WASM obfuscation failed: ' . $e->getMessage());
        }
        
        return $bundled;
    }
    
    /**
     * Standard JS bundling (fallback)
     */
    private function bundle_js_standard($js_files) {
        $bundled = '';
        foreach ($js_files as $file) {
            $path = AEVOV_MAAS_PATH . 'assets/js/' . $file;
            if (file_exists($path)) {
                $bundled .= file_get_contents($path) . "\n\n";
            }
        }
        return $bundled;
    }
    
    /**
     * Enqueue frontend scripts
     */
    public function enqueue_scripts() {
        // Core dependencies
        wp_enqueue_script('compromise', 'https://unpkg.com/compromise@14.9.0/builds/compromise.min.js', array(), null, true);
        wp_enqueue_script('pglite', 'https://cdn.jsdelivr.net/npm/@electric-sql/pglite@0.1.5/dist/index.js', array(), null, true);
        
        // AEVOV bundled and obfuscated JS
        $js_files = array(
            'library_loader_fix.js',
            'wordnet_uniqueness_fix.js',
            'nlp_compromise_integration.js',
            'comprehensive_fixes.js',
            'comprehensive_db_electric.js',
            'neuro_architect_complete.js',
            'cubbit_manager.js',
            'cubbit_enhancements_bulk.js',
            'aevmer_streamer_complete.js',
            'aevmer_gamer_engine.js',
            'perpetual_rl_training.js',
            'comprehensive_cron_distributed.js',
            'advanced_query_builder.js',
            'maas_pricing_system.js',
            'onboarding_engine.js'
        );
        
        // Check if obfuscated version exists in cache
        $cache_file = AEVOV_MAAS_PATH . 'cache/bundle-obfuscated.js';
        $cache_url = AEVOV_MAAS_URL . 'cache/bundle-obfuscated.js';
        
        if (file_exists($cache_file)) {
            wp_enqueue_script('aevov-bundle', $cache_url, array('compromise', 'pglite'), $this->version, true);
        } else {
            // Generate obfuscated bundle
            $bundle = $this->bundle_js_with_wasm($js_files);
            
            // Create cache directory if needed
            if (!file_exists(dirname($cache_file))) {
                mkdir(dirname($cache_file), 0755, true);
            }
            
            file_put_contents($cache_file, $bundle);
            wp_enqueue_script('aevov-bundle', $cache_url, array('compromise', 'pglite'), $this->version, true);
        }
        
        // Localize script with config
        wp_localize_script('aevov-bundle', 'aevovConfig', array(
            'apiEndpoint' => AEVOV_MAAS_API_ENDPOINT,
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('aevov_nonce'),
            'licenseKey' => get_option('aevov_license_key', ''),
            'currentTier' => $this->get_current_tier(),
            'userId' => get_current_user_id()
        ));
        
        // Styles
        wp_enqueue_style('aevov-styles', AEVOV_MAAS_URL . 'assets/css/aevov-styles.css', array(), $this->version);
    }
    
    /**
     * Enqueue admin scripts
     */
    public function admin_enqueue_scripts($hook) {
        if (strpos($hook, 'aevov') === false) {
            return;
        }
        
        $this->enqueue_scripts();
    }
    
    /**
     * Register custom post types
     */
    private function register_post_types() {
        // Patterns
        register_post_type('aevov_pattern', array(
            'labels' => array(
                'name' => 'Patterns',
                'singular_name' => 'Pattern'
            ),
            'public' => false,
            'show_ui' => true,
            'show_in_rest' => true,
            'supports' => array('title', 'editor', 'custom-fields'),
            'menu_icon' => 'dashicons-networking'
        ));
        
        // Models
        register_post_type('aevov_model', array(
            'labels' => array(
                'name' => 'Models',
                'singular_name' => 'Model'
            ),
            'public' => false,
            'show_ui' => true,
            'show_in_rest' => true,
            'supports' => array('title', 'editor', 'custom-fields'),
            'menu_icon' => 'dashicons-performance'
        ));
    }
    
    /**
     * Add admin menu
     */
    public function add_admin_menu() {
        add_menu_page(
            'AEVOV MaaS',
            'AEVOV MaaS',
            'manage_options',
            'aevov-maas',
            array($this, 'render_dashboard'),
            'dashicons-cloud',
            30
        );
        
        add_submenu_page(
            'aevov-maas',
            'Dashboard',
            'Dashboard',
            'manage_options',
            'aevov-maas',
            array($this, 'render_dashboard')
        );
        
        add_submenu_page(
            'aevov-maas',
            'License & Pricing',
            'License & Pricing',
            'manage_options',
            'aevov-license',
            array($this, 'render_license_page')
        );
        
        add_submenu_page(
            'aevov-maas',
            'Models',
            'Models',
            'manage_options',
            'aevov-models',
            array($this, 'render_models_page')
        );
        
        add_submenu_page(
            'aevov-maas',
            'Query Builder',
            'Query Builder',
            'manage_options',
            'aevov-query-builder',
            array($this, 'render_query_builder_page')
        );
        
        add_submenu_page(
            'aevov-maas',
            'Settings',
            'Settings',
            'manage_options',
            'aevov-settings',
            array($this, 'render_settings_page')
        );
    }
    
    /**
     * Register settings
     */
    public function register_settings() {
        register_setting('aevov_maas_settings', 'aevov_license_key');
        register_setting('aevov_maas_settings', 'aevov_current_tier');
        register_setting('aevov_maas_settings', 'aevov_sync_enabled');
        register_setting('aevov_maas_settings', 'aevov_cloudflare_url');
        register_setting('aevov_maas_settings', 'aevov_free_conversational_enabled');
    }
    
    /**
     * Render dashboard
     */
    public function render_dashboard() {
        $tier = $this->get_current_tier();
        $license_key = get_option('aevov_license_key', '');
        
        include AEVOV_MAAS_PATH . 'admin/templates/dashboard.php';
    }
    
    /**
     * Render license page
     */
    public function render_license_page() {
        include AEVOV_MAAS_PATH . 'admin/templates/license.php';
    }
    
    /**
     * Render models page
     */
    public function render_models_page() {
        include AEVOV_MAAS_PATH . 'admin/templates/models.php';
    }
    
    /**
     * Render query builder page
     */
    public function render_query_builder_page() {
        ?>
        <div class="wrap">
            <h1>Advanced Query Builder</h1>
            <div id="queryBuilderApp"></div>
            <script>
                // Query builder will auto-initialize
                document.addEventListener('DOMContentLoaded', function() {
                    if (window.AdvancedQueryBuilder) {
                        window.AdvancedQueryBuilder.toggleInterface();
                    }
                });
            </script>
        </div>
        <?php
    }
    
    /**
     * Render settings page
     */
    public function render_settings_page() {
        include AEVOV_MAAS_PATH . 'admin/templates/settings.php';
    }
    
    /**
     * Register REST API routes
     */
    public function register_rest_routes() {
        register_rest_route('aevov/v1', '/license/validate', array(
            'methods' => 'POST',
            'callback' => array($this, 'rest_validate_license'),
            'permission_callback' => function() {
                return current_user_can('manage_options');
            }
        ));
        
        register_rest_route('aevov/v1', '/models/available', array(
            'methods' => 'GET',
            'callback' => array($this, 'rest_get_available_models')
        ));
        
        register_rest_route('aevov/v1', '/patterns/sync', array(
            'methods' => 'POST',
            'callback' => array($this, 'rest_sync_patterns'),
            'permission_callback' => function() {
                return current_user_can('manage_options');
            }
        ));
        
        register_rest_route('aevov/v1', '/query/execute', array(
            'methods' => 'POST',
            'callback' => array($this, 'rest_execute_query')
        ));
    }
    
    /**
     * REST: Validate license
     */
    public function rest_validate_license($request) {
        $license_key = $request->get_param('license_key');
        
        // Validate with AEVOV API
        $response = wp_remote_post(AEVOV_MAAS_API_ENDPOINT . '/licenses/validate', array(
            'body' => json_encode(array('key' => $license_key)),
            'headers' => array('Content-Type' => 'application/json')
        ));
        
        if (is_wp_error($response)) {
            return new WP_Error('api_error', 'Failed to validate license', array('status' => 500));
        }
        
        $body = json_decode(wp_remote_retrieve_body($response), true);
        
        if ($body['valid']) {
            update_option('aevov_license_key', $license_key);
            update_option('aevov_current_tier', $body['tier']);
        }
        
        return rest_ensure_response($body);
    }
    
    /**
     * REST: Get available models
     */
    public function rest_get_available_models($request) {
        $tier = $this->get_current_tier();
        
        // Get models from API
        $response = wp_remote_get(AEVOV_MAAS_API_ENDPOINT . '/models/available?tier=' . $tier);
        
        if (is_wp_error($response)) {
            return new WP_Error('api_error', 'Failed to fetch models', array('status' => 500));
        }
        
        $body = json_decode(wp_remote_retrieve_body($response), true);
        return rest_ensure_response($body);
    }
    
    /**
     * REST: Sync patterns
     */
    public function rest_sync_patterns($request) {
        // Sync with Cloudflare Workers backend
        $cloudflare_url = get_option('aevov_cloudflare_url', '');
        
        if (empty($cloudflare_url)) {
            return new WP_Error('no_cloudflare', 'Cloudflare URL not configured', array('status' => 400));
        }
        
        $patterns = $request->get_param('patterns');
        
        $response = wp_remote_post($cloudflare_url . '/sync/patterns', array(
            'body' => json_encode(array('patterns' => $patterns)),
            'headers' => array(
                'Content-Type' => 'application/json',
                'Authorization' => 'Bearer ' . get_option('aevov_license_key', '')
            )
        ));
        
        if (is_wp_error($response)) {
            return new WP_Error('sync_error', 'Failed to sync patterns', array('status' => 500));
        }
        
        return rest_ensure_response(array('success' => true, 'synced' => count($patterns)));
    }
    
    /**
     * REST: Execute query
     */
    public function rest_execute_query($request) {
        $sql = $request->get_param('sql');
        $params = $request->get_param('params', array());
        
        // Security check
        if ($this->is_dangerous_query($sql)) {
            return new WP_Error('dangerous_query', 'Query contains dangerous operations', array('status' => 403));
        }
        
        global $wpdb;
        
        // Execute query
        $results = $wpdb->get_results($wpdb->prepare($sql, $params), ARRAY_A);
        
        return rest_ensure_response(array(
            'success' => true,
            'results' => $results,
            'count' => count($results)
        ));
    }
    
    /**
     * AJAX: Activate license
     */
    public function ajax_activate_license() {
        check_ajax_referer('aevov_nonce', 'nonce');
        
        $license_key = sanitize_text_field($_POST['license_key']);
        
        // Validate license
        $response = wp_remote_post(AEVOV_MAAS_API_ENDPOINT . '/licenses/activate', array(
            'body' => json_encode(array('key' => $license_key)),
            'headers' => array('Content-Type' => 'application/json')
        ));
        
        if (is_wp_error($response)) {
            wp_send_json_error(array('message' => 'Failed to validate license'));
            return;
        }
        
        $body = json_decode(wp_remote_retrieve_body($response), true);
        
        if ($body['valid']) {
            update_option('aevov_license_key', $license_key);
            update_option('aevov_current_tier', $body['tier']);
            
            wp_send_json_success(array(
                'message' => 'License activated successfully',
                'tier' => $body['tier']
            ));
        } else {
            wp_send_json_error(array('message' => 'Invalid license key'));
        }
    }
    
    /**
     * AJAX: Check review status
     */
    public function ajax_check_review() {
        check_ajax_referer('aevov_nonce', 'nonce');
        
        $platform = sanitize_text_field($_POST['platform']);
        $username = sanitize_text_field($_POST['username']);
        
        // Check review with API
        $response = wp_remote_post(AEVOV_MAAS_API_ENDPOINT . '/reviews/verify', array(
            'body' => json_encode(array(
                'platform' => $platform,
                'username' => $username
            )),
            'headers' => array('Content-Type' => 'application/json')
        ));
        
        if (is_wp_error($response)) {
            wp_send_json_error(array('message' => 'Failed to verify review'));
            return;
        }
        
        $body = json_decode(wp_remote_retrieve_body($response), true);
        
        if ($body['verified']) {
            // Grant reviewer access
            $reviewer_key = 'REVIEWER-' . strtoupper($platform) . '-' . time();
            update_option('aevov_license_key', $reviewer_key);
            update_option('aevov_current_tier', 'free-reviewer');
            
            wp_send_json_success(array(
                'message' => 'Reviewer access granted!',
                'tier' => 'free-reviewer'
            ));
        } else {
            wp_send_json_error(array('message' => 'Review not found'));
        }
    }
    
    /**
     * Check license validity
     */
    private function check_license() {
        $license_key = get_option('aevov_license_key', '');
        
        if (empty($license_key)) {
            update_option('aevov_current_tier', 'free');
            return;
        }
        
        // Validate with API (once per day)
        $last_check = get_transient('aevov_license_last_check');
        if ($last_check) {
            return;
        }
        
        $response = wp_remote_post(AEVOV_MAAS_API_ENDPOINT . '/licenses/validate', array(
            'body' => json_encode(array('key' => $license_key)),
            'headers' => array('Content-Type' => 'application/json')
        ));
        
        if (!is_wp_error($response)) {
            $body = json_decode(wp_remote_retrieve_body($response), true);
            
            if ($body['valid']) {
                update_option('aevov_current_tier', $body['tier']);
            } else {
                update_option('aevov_current_tier', 'free');
                delete_option('aevov_license_key');
            }
        }
        
        set_transient('aevov_license_last_check', true, DAY_IN_SECONDS);
    }
    
    /**
     * Get current tier
     */
    private function get_current_tier() {
        return get_option('aevov_current_tier', 'free');
    }
    
    /**
     * Setup cron jobs
     */
    private function setup_cron_jobs() {
        if (!wp_next_scheduled('aevov_check_updates')) {
            wp_schedule_event(time(), 'daily', 'aevov_check_updates');
        }
        
        if (!wp_next_scheduled('aevov_sync_patterns')) {
            wp_schedule_event(time(), 'hourly', 'aevov_sync_patterns');
        }
    }
    
    /**
     * Check for model updates
     */
    public function check_model_updates() {
        $tier = $this->get_current_tier();
        
        $response = wp_remote_get(AEVOV_MAAS_API_ENDPOINT . '/models/check-updates?tier=' . $tier);
        
        if (!is_wp_error($response)) {
            $body = json_decode(wp_remote_retrieve_body($response), true);
            
            if (!empty($body['updates'])) {
                // Notify admin
                $this->notify_admin_updates($body['updates']);
            }
        }
    }
    
    /**
     * Notify admin of updates
     */
    private function notify_admin_updates($updates) {
        $admin_email = get_option('admin_email');
        $update_list = implode("\n", array_map(function($u) {
            return "- {$u['model']} (v{$u['version']})";
        }, $updates));
        
        wp_mail(
            $admin_email,
            'AEVOV Model Updates Available',
            "The following model updates are available:\n\n{$update_list}\n\nLogin to your dashboard to download them."
        );
    }
    
    /**
     * Check if query is dangerous
     */
    private function is_dangerous_query($sql) {
        $dangerous = array('DROP', 'TRUNCATE', 'DELETE', 'UPDATE', 'INSERT', 'ALTER', 'CREATE');
        
        foreach ($dangerous as $keyword) {
            if (stripos($sql, $keyword) !== false) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Chat shortcode
     */
    public function chat_shortcode($atts) {
        $atts = shortcode_atts(array(
            'model' => 'conversation-basic',
            'height' => '400px'
        ), $atts);
        
        $tier = $this->get_current_tier();
        
        if ($tier === 'free' && !in_array($atts['model'], array('conversation-basic', 'chat-general', 'qa-simple'))) {
            return '<div class="aevov-upgrade-notice">This model requires a Pro subscription. <a href="' . admin_url('admin.php?page=aevov-license') . '">Upgrade now</a></div>';
        }
        
        ob_start();
        ?>
        <div class="aevov-chat-widget" style="height: <?php echo esc_attr($atts['height']); ?>;">
            <div id="aevov-chat-container"></div>
        </div>
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                if (window.UnifiedChat) {
                    window.UnifiedChat.init('<?php echo esc_js($atts['model']); ?>');
                }
            });
        </script>
        <?php
        return ob_get_clean();
    }
    
    /**
     * Query builder shortcode
     */
    public function query_builder_shortcode($atts) {
        ob_start();
        ?>
        <div class="aevov-query-builder-widget">
            <button onclick="window.AdvancedQueryBuilder.toggleInterface()" class="button button-primary">
                Open Query Builder
            </button>
        </div>
        <?php
        return ob_get_clean();
    }
    
    /**
     * Pricing shortcode
     */
    public function pricing_shortcode($atts) {
        ob_start();
        include AEVOV_MAAS_PATH . 'templates/pricing-table.php';
        return ob_get_clean();
    }
}

// Initialize plugin
new AEVOV_MaaS_Plugin();

/**
 * Activation hook
 */
register_activation_hook(__FILE__, function() {
    // Create necessary directories
    $dirs = array(
        AEVOV_MAAS_PATH . 'cache',
        AEVOV_MAAS_PATH . 'models',
        AEVOV_MAAS_PATH . 'patterns'
    );
    
    foreach ($dirs as $dir) {
        if (!file_exists($dir)) {
            mkdir($dir, 0755, true);
        }
    }
    
    // Set default options
    add_option('aevov_current_tier', 'free');
    add_option('aevov_sync_enabled', 0);
    add_option('aevov_free_conversational_enabled', 1);
    
    // Schedule cron jobs
    if (!wp_next_scheduled('aevov_check_updates')) {
        wp_schedule_event(time(), 'daily', 'aevov_check_updates');
    }
    
    flush_rewrite_rules();
});

/**
 * Deactivation hook
 */
register_deactivation_hook(__FILE__, function() {
    // Clear cron jobs
    wp_clear_scheduled_hook('aevov_check_updates');
    wp_clear_scheduled_hook('aevov_sync_patterns');
    
    flush_rewrite_rules();
});

/**
 * Uninstall hook
 */
register_uninstall_hook(__FILE__, 'aevov_uninstall');

function aevov_uninstall() {
    // Remove options
    delete_option('aevov_license_key');
    delete_option('aevov_current_tier');
    delete_option('aevov_sync_enabled');
    delete_option('aevov_cloudflare_url');
    delete_option('aevov_free_conversational_enabled');
    
    // Remove cache
    $cache_dir = plugin_dir_path(__FILE__) . 'cache';
    if (file_exists($cache_dir)) {
        array_map('unlink', glob("$cache_dir/*.*"));
        rmdir($cache_dir);
    }
}