<?php
/**
 * Plugin Name: Premise WP
 * Description: Do things faster as a Wordpess developer! Build options in the backedn, create custom post types, add new admin pages or metaboxes, and more.
 * Plugin URI:	https://github.com/PremiseWP/Premise-WP
 * Version:     1.8.0
 * Author:      Premise WP
 * Author URI:  http://premisewp.com
 * License:     GPL
 *
 * @package Premise WP
 */

// Block direct access to this file.
defined( 'ABSPATH' ) or die();

/**
 * Define Premise path
 */
define( 'PREMISE_PATH', plugin_dir_path( __FILE__ ) );

/**
 * Define Premise url
 */
define( 'PREMISE_URL', plugin_dir_url( __FILE__ ) );

// Instantiate our main class and setup Premise WP
// Must use 'plugins_loaded' hook.
add_action( 'plugins_loaded', array( Premise_WP::get_instance(), 'premise_setup' ) );

/**
 * Load Premise WP!
 *
 * This is Premise WP main class.
 */
class Premise_WP {

	/**
	 * Plugin instance.
	 *
	 * @see get_instance()
	 *
	 * @var object
	 */
	protected static $instance = null;

	/**
	 * Plugin url
	 *
	 * @var string
	 */
	public $plugin_url = PREMISE_URL;

	/**
	 * Plugin path
	 *
	 * @var strin
	 */
	public $plugin_path = PREMISE_PATH;

	/**
	 * Constructor. Intentionally left empty and public.
	 *
	 * @see 	premise_setup()
	 * @since 	1.0
	 */
	public function __construct() {}

	/**
	 * Access this plugin’s working instance
	 *
	 * @since   1.0
	 * @return  object instance of this class
	 */
	public static function get_instance() {
		null === self::$instance and self::$instance = new self;

		return self::$instance;
	}

	/**
	 * Setup Premise
	 *
	 * Does includes and registers hooks.
	 *
	 * @since   1.0
	 */
	public function premise_setup() {
		$this->do_includes();
		$this->premise_hooks();
	}

	/**
	 * Includes
	 *
	 * @since 1.0
	 */
	protected function do_includes() {
		// models
		require_once PREMISE_PATH . 'model/model-premise-tabs.php';
		require_once PREMISE_PATH . 'model/class.fields-model.php';
		require_once PREMISE_PATH . 'model/class.metabox-model.php';
		require_once PREMISE_PATH . 'model/class.admin-page-model.php';
		require_once PREMISE_PATH . 'model/model-premise-custom-post-type.php';
		// controllers
		require_once PREMISE_PATH . 'controller/class.forms-controller.php';
		require_once PREMISE_PATH . 'controller/class.fields-controller.php';
		require_once PREMISE_PATH . 'controller/class.user-fields-controller.php';
		// Libraries
		require_once PREMISE_PATH . 'library/premise-library.php';
		require_once PREMISE_PATH . 'library/premise-field-library.php';
		// deprecated
		require_once PREMISE_PATH . 'model/model-premise-field.php';
		require_once PREMISE_PATH . 'model/model-premise-options.php';
	}

	/**
	 * Premise Hooks
	 *
	 * Registers and enqueues scripts, adds classes to the body of DOM
	 */
	public function premise_hooks() {

		// Enqueue scripts.
		add_action( 'wp_enqueue_scripts', array( $this, 'premise_scripts' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'premise_scripts' ) );

		// Add classes to body.
		add_filter( 'body_class', array( $this, 'body_class' ) );

		// Add classes to body.
		add_filter( 'admin_body_class', array( $this, 'body_class' ) );

		add_action( 'wp_ajax_premise_field_load_fa_icons_ajax', 'premise_get_fa_icons_html_ajax' );
		add_action( 'wp_ajax_nopriv_premise_field_load_fa_icons_ajax', 'premise_get_fa_icons_html_ajax' );
	}

	/**
	 * Add premise classes to body of document in the front-end and backend
	 *
	 * @param  array $classes  array of classes being passed to the body.
	 * @return string          array including our new classes
	 */
	public function body_class( $classes ) {
		if ( is_admin() ) {

			return $classes . 'Premise-WP premise-wp-admin';
		}

		$classes[] = 'Premise-WP';
		$classes[] = 'premise-wp-frontend';
		return $classes;
	}

	/**
	 * Premise CSS & JS
	 *
	 * Premise loads 2 main files: Premise-WP.min.css, and Premise-WP.min.js. In addition to these files
	 * Premise also loads FontAwesome - a library of icons by Dave Gandy.
	 *
	 * Filters coming soon to allow more control over what loads
	 *
	 * @author Dvae Gandy http://twitter.com/davegandy
	 * @see http://fontawesome.io/ For more information about FontAwesome
	 *
	 * @since 1.2 removed all other libraries. Replaced minicolors with Wordpress' wp_color and dropped msdropdown
	 */
	public function premise_scripts() {
		// Register styles.
		wp_register_script( 'premise_font_awesome', 'https://use.fontawesome.com/a4c255239f.js' );
		wp_register_style( 'premise_style_css'   , $this->plugin_url . 'css/Premise-WP.min.css' );

		if ( is_admin() ) {

			// Register scripts.
			wp_register_script( 'premise_script_js'  , $this->plugin_url . 'js/Premise-WP.min.js', array( 'jquery', 'wp-color-picker' ) );

			// For color picker to work.
			wp_enqueue_style( 'wp-color-picker' );

		} else {

			// Do not load color picker on frontend.
			// Register scripts.
			wp_register_script( 'premise_script_js'  , $this->plugin_url . 'js/Premise-WP.min.js', array( 'jquery' ) );

			// load jquery independently in case someone deregisters or dequeues it.
			// wp_enqueue_script( 'jquery' );
		}

		// Enqueue our styles and scripts for both admin and frontend.
		wp_enqueue_style( 'premise_style_css' );

		wp_enqueue_script( 'premise_font_awesome' );

		// Enqueue the scripts for front and back end
		wp_enqueue_script( 'premise_script_js' );
	}

	/**
	 * Loads translation file.
	 *
	 * Currently not supported. but here for future integration
	 *
	 * @since   1.0
	 *
	 * @wp-hook init
	 *
	 * @param   string $domain Domain.
	 *
	 * @return  void
	 */
	public function load_language( $domain ) {
		load_plugin_textdomain(
			$domain,
			false,
			$this->plugin_path . 'languages'
		);
	}
}
