<?php
/**
 * Premise Options
 *
 * @since 1.2
 *
 * @package Premise WP
 * @subpackage Model
 */

// Block direct access to this file.
defined( 'ABSPATH' ) or die();

/**
 * The main Premise Options class
 */
class Premise_Options {

	/**
	 * Security nonce
	 *
	 * @var string
	 */
	private $nonce = '';

	/**
	 * Option group used for register_setting()
	 *
	 * @var string
	 */
	protected $option_group = 'premise_option_group';




	/**
	 * Option name to be used for saving option in the database
	 *
	 * @var string Defaults to premise_option
	 */
	protected $option_name = 'premise_option';




	/**
	 * Callback function to sanitize values passed to the option
	 *
	 * @var string
	 */
	private $sanitize_callback = '';




	/**
	 * Holds menu page arguments
	 *
	 * @var array
	 */
	public $menu_page_args = array(
		'title' => 'Premise Options Page',
		'menu_title' => 'Premise Options',
		'capability' => 'manage_options',
		'menu_slug' => 'premise_options_page',
		'call_back' => '',
		'icon' => '',
		'position' => '59.2',
	);





	/**
	 * Holds the fields for our top level menu page
	 *
	 * @var string
	 */
	public $fields = array();




	/**
	 * Build our Object
	 *
	 * Register our 2 main hooks <code>admin_init</code> and <code>admin_menu</code>.
	 *
	 * @link https://codex.wordpress.org/Function_Reference/wp_create_nonce for more information on wp_create_nonce()
	 *
	 * @param mixed $title       can be a string with page title, or array with $this->menu_page_args.
	 * @param array $fields      array of fields to insert into page.
	 * @param mixed $option_name can be a string with option name, or array with multiple names.
	 */
	function __construct( $title = '', $fields = array(), $option_name = false ) {

		$this->nonce = premise_rand_str();
		wp_create_nonce( $this->nonce );

		$this->parse_menu_page_args( $title );

		$this->fields = is_array( $fields ) && ! empty( $fields ) ? $fields : array();

		$this->option_name = $option_name ? $option_name : $this->option_name;

		add_action( 'admin_init', array( $this, 'init' ) );

		add_action( 'admin_menu', array( $this, 'add_menu' ) );
	}




	/**
	 * Parse arguments passed with our class defaults
	 *
	 * @param  mixed $title string with page title, or array with page arguments.
	 */
	protected function parse_menu_page_args( $title ) {

		if ( is_string( $title ) && ! empty( $title ) ) {

			$this->menu_page_args['title'] = $title;
			$this->menu_page_args['menu_title'] = $title;
			$this->menu_page_args['menu_slug'] = str_replace( ' ', '_', strtolower( $title ) );

		} elseif ( is_array( $title ) ) {

			$this->menu_page_args = wp_parse_args( $title, $this->menu_page_args );
			if ( '' == $this->menu_page_args['call_back'] )
				$this->menu_page_args['call_back'] = array( $this, 'menu_page' );
		}
	}




	/**
	 * Init our class
	 *
	 * Registers options in the database
	 *
	 * @return boolean false
	 */
	public function init() {

		if ( is_array( $this->option_name ) ) {

			foreach ( $this->option_name as $option ) {

				register_setting( $this->option_group, $option );
			}
		} elseif ( is_string( $this->option_name ) ) {

			register_setting( $this->option_group, $this->option_name );
		}

		return false;
	}




	/**
	 * Adds menu page to the Wordpress admin
	 *
	 * @link https://codex.wordpress.org/Function_Reference/add_menu_page for more information on add_menu_page()
	 *
	 * @return void does not return anything
	 */
	public function add_menu() {
		$this->menu_page_args['call_back'] = 
		add_menu_page(
			$this->menu_page_args['title'],      // $page_title.
			$this->menu_page_args['menu_title'], // $menu_title.
			$this->menu_page_args['capability'], // $capability.
			$this->menu_page_args['menu_slug'],  // $menu_slug.
			$this->menu_page_args['call_back'],  // $function.
			$this->menu_page_args['icon'],       // $icon_url.
			$this->menu_page_args['position']    // $position.
		);
	}




	/**
	 * Display the options page content
	 *
	 * @link https://codex.wordpress.org/Function_Reference/wp_nonce_field  for more information on wp_nonce_field()
	 * @link https://codex.wordpress.org/Function_Reference/settings_fields for more information on settings_fields()
	 *
	 * @return string the page content
	 */
	public function menu_page() {
		$this->start_page();
		
		if ( ! empty( $this->fields ) ) {
			echo '<form action="options.php" method="post" enctype="multipart/form-data" class="premise-admin">';
				wp_nonce_field( $this->nonce, $_POST['_wpnonce'], true, true );
				settings_fields( $this->option_group );

				/**
				 * Display html before fields
				 *
				 * This hook allows you to pass an html string to display anything you want
				 * in the admin page before the fields.
				 *
				 * @wp_hook premise_options_before_fields
				 *
				 * @since 1.2.2
				 */
				echo apply_filters( 'premise_options_before_fields', '', $this->fields );
				
				// echo our fields
				premise_field_section( $this->fields );

			echo '</form>';

		}
		else {

			echo '<p>Looks like the \'fields\' parameter is empty.</p>';
		}
		
		$this->end_page();
	}



	/**
	 * Prints the opening html tag for the this page. Called from menu_page() method
	 *
	 * @see menu_page() this function is called from menu_page() method
	 * 
	 * @return string html for begining of page
	 */
	public function start_page() {
		?>
		<div class="wrap premise-admin-page">
		<h1><?php echo esc_html( $this->menu_page_args['title'] ); ?></h1>
		<?php
	}



	/**
	 * Prints the closing html tag for the this page. Called from menu_page() method
	 *
	 * @see menu_page() this function is called from menu_page() method
	 * 
	 * @return string html for end of page
	 */
	public function end_page() {
		?>
		</div>
		<?php
	}

}
