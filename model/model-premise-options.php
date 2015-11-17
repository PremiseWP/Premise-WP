<?php 
/**
 * Premise Options
 *
 * @package Premise WP
 * @subpackage Model
 */




/**
 * The main Premise Options class
 */
class Premise_Options {

	/**
	 * option group used  for register_setting()
	 * 
	 * @var string
	 */
	protected $option_group = '';




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
	 * Register our 2 main hooks 
	 * 
	 * <code>admin_init</code> and <code>admin_menu</code>
	 */
	function __construct(  ) {

		add_action( 'admin_init', array( $this, 'init' ) );

		add_action( 'admin_menu', array( $this, 'add_menu' ) );
	}




	/**
	 * initialize our class
	 *
	 * registers options in the database
	 * 
	 * @return void does not return anything
	 */
	public static function init() {
		add_option(
			'premise_option', // option
			'',               // value
			'',               // deprecated
			''                // autoload
		);
	}




	/**
	 * adds menu page to the Wordpress admin
	 *
	 * @return void does not return anything
	 */
	public function add_menu() {

	}
}
?>