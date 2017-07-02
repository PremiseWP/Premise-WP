<?php
// Block direct access to this file.
defined( 'ABSPATH' ) or die();

/**
 * Build a page in the backend of wordpress.
 *
 * @since   2.0.0
 *
 * @package Premise WP\Model
 */
class PWP_Admin_Page {

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
	private $option_group = 'premise_option_group';

	/**
	 * Option name to be used for saving option in the database
	 *
	 * @var string Defaults to premise_option
	 */
	private $option_names = 'premise_option';

	/**
	 * Holds the defaults for params to build menu page
	 *
	 * @var array
	 */
	private $_defaults = array(
		'title'      => 'Premise Options Page',
		'menu_title' => 'Premise Options',
		'capability' => 'manage_options',
		'menu_slug'  => 'premise_options_page',
		'callback'   => '',
		'icon'       => '',
		'position'   => '59.2',
	);

	/**
	 * Holds menu page arguments
	 *
	 * @var array
	 */
	public $menu_page_args = array();

	/**
	 * Holds the fields for our top level menu page
	 *
	 * @var string
	 */
	public $fields = array();

	/**
	 * Build our object and register hooks to add menu page.
	 *
	 * @param mixed $title        can be a string with page title, or array with all params that you can pass to add_menu_page
	 * @param array $fields       array of fields to insert into page. must be an array of arrays.
	 * @param mixed $option_names can be a string with option name, or array with multiple names, or array of arrays with option names and option group.
	 */
	function __construct( $title = '', $fields = array(), $option_names = '' ) {

		if ( is_array( $title ) ) {
			$this->menu_page_args = wp_parse_args( $title, $this->_defaults );
		}
		else {
			$title_array['title']      =  strip_tags( (string) $title );
			$title_array['menu_title'] = $title_array['title'];
			$title_array['menu_slug']  = str_replace( ' ', '_', strtolower( $title_array['title'] ) );

			$this->menu_page_args = wp_parse_args( $title_array, $this->_defaults );
			unset( $title_array ); // celar up space
		}

		// if we dont have args to build the page exit.
		if ( empty( $this->menu_page_args ) )
			return false;

		if ( empty( $this->menu_page_args['callback'] ) ) {
			$this->menu_page_args['callback'] = array( $this, 'menu_page' );
			$this->nonce = premise_rand_str( 8 );
			wp_create_nonce( $this->nonce );
		}

		$this->fields = $fields;


		if ( ! empty( $option_names ) ) {
			$this->option_names = (array) $option_names;
		}

		// hook to register option names in the db
		add_action( 'admin_init', array( $this, 'register_option_names' ) );

		// Hook our new page registration
		add_action( 'admin_menu', array( $this, 'add_menu' ) );
	}

	/**
	 * Registers options in the database
	 *
	 * @return void does not return anything
	 */
	public function register_option_names() {

		if ( array_key_exists( 'option_group', $this->option_names ) ) {
			$this->option_group = $this->option_names['option_group'];
			unset( $this->option_names['option_group'] );
		}

		if ( array_key_exists( 'option_names', $this->option_names ) ) {
			$this->option_names = $this->option_names['option_names'];
		}

		foreach ( (array) $this->option_names as $option ) {

			register_setting( $this->option_group, $option );
		}
	}

	/**
	 * Adds menu page to the Wordpress admin
	 *
	 * @link https://codex.wordpress.org/Function_Reference/add_menu_page for more information on add_menu_page()
	 *
	 * @return void does not return anything
	 */
	public function add_menu() {
		add_menu_page(
			$this->menu_page_args['title'],      // $page_title.
			$this->menu_page_args['menu_title'], // $menu_title.
			$this->menu_page_args['capability'], // $capability.
			$this->menu_page_args['menu_slug'],  // $menu_slug.
			$this->menu_page_args['callback'],         // $callback.
			$this->menu_page_args['icon'],       // $icon_url.
			$this->menu_page_args['position']    // $position.
		);
	}

	/**
	 * Display the options page content
	 *
	 * @return string the page content
	 */
	public function menu_page() {
		$action = 'options.php';
		$method = 'post';
		$enctype = 'multipart/form-data';

		// get the action method and enctype if passed
		// remove them from the fields so pwp_form() does handle the form.
		if ( isset( $this->fields['action'] ) ) {
			$action  = esc_attr( $this->fields['action'] );
			unset( $this->fields['action'] );
		}
		if ( isset( $this->fields['method'] ) ) {
			$method  = esc_attr( $this->fields['method'] );
			unset( $this->fields['method'] );
		}
		if ( isset( $this->fields['enctype'] ) ) {
			$enctype = esc_attr( $this->fields['enctype'] );
			unset( $this->fields['enctype'] );
		}

		?><div class="wrap premise-admin-page">
			<h1><?php echo esc_html( $this->menu_page_args['title'] ); ?></h1>
			<form action="<?php echo $action; ?>" method="<?php echo $method; ?>" enctype="<?php echo $enctype; ?>" id="<?php echo esc_attr( $this->menu_page_args['menu_slug'] ); ?>-form"><?
				wp_nonce_field( $this->nonce, $_POST['_wpnonce'], true, true );
				settings_fields( $this->option_group );

				if ( ! empty( $this->fields ) ) {
						pwp_form( (array) $this->fields );
				}
				else {
					echo '<p>No valid callback or fields to display.</p>';
				}

			?></form>
		</div><?
	}
}
?>