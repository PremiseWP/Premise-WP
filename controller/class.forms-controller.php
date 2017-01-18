<?php
// Block direct access to this file.
defined( 'ABSPATH' ) or die();

/**
* Premise Forms Controller
*
* @package Premise WP
*/
class PWP_Form {

	/**
	 * holds the action property
	 *
	 * @var null
	 */
	protected $action   = null;

	/**
	 * holds the method property
	 *
	 * @var null
	 */
	protected $method   = '';

	/**
	 * holds the enctype property
	 *
	 * @var null
	 */
	protected $enctype  = '';

	/**
	 * holds the fields property
	 *
	 * @var null
	 */
	public $fields      = array();

	/**
	 * holds the form html
	 *
	 * @var null
	 */
	public $form        = 'the form has not been built.';

	/**
	 * holds the name_prefix property
	 *
	 * @var null
	 */
	public $name_prefix = '';

	/**
	 * Build our object
	 *
	 * @param array $args array of params
	 */
	function __construct( $args = '' ) {

		if ( isset( $args['name_prefix'] ) && ! empty( $args['name_prefix'] ) ) {
			$this->name_prefix = esc_attr( $args['name_prefix'] );
			unset( $args['name_prefix'] );
		}

		if ( isset( $args['action'] ) && ! empty( $args['action'] ) ) {
			$this->action = esc_attr( $args['action'] );
			unset( $args['action'] );
		}

		if ( isset( $args['method'] ) && ! empty( $args['method'] ) ) {
			$this->method = esc_attr( $args['method'] );
			unset( $args['method'] );
		}

		if ( isset( $args['enctype'] ) && ! empty( $args['enctype'] ) ) {
			$this->enctype = esc_attr( $args['enctype'] );
			unset( $args['enctype'] );
		}

		if ( isset( $args['fields'] ) && is_array( $args['fields'] ) ) {
			$this->fields = $args['fields'];
		}
		// if there is no explicit fields array
		// we assume they are all fields
		else {
			$this->fields = $args;
		}

		if ( ! empty( $this->fields ) ) {
			// add prefix if any
			if ( ! empty( $this->name_prefix ) ) {
				$this->add_name_prefix();
			}
			// build the form
			$this->build_form();
		}
		else {
			return false;
		}
	}

	/**
	 * Build our form HTML
	 *
	 * @return void saves the form html in our object. does not return anything
	 */
	protected function build_form() {
		$form = '';

		$form.= ( null !== $this->action )
			? '<form action="'.esc_attr( $this->action ).'"
					 method="'.esc_attr( $this->method ).'"
					 enctype="'.esc_attr( $this->enctype ).'">'
			: '';

		foreach ( $this->fields as $field ) {
			$form .= pwp_field( $field, false );
		}

		$form.= ( null !== $this->action ) ? '</form>' : '';

		$this->form = $form;
	}

	/**
	 * Prepend the name prefix to the name attribute. This allows us to easily set repetitive info in our fields.
	 *
	 * @return void updates the fields array in our object. does not return anything
	 */
	private function add_name_prefix() {
		for ($i=0; $i < count( $this->fields ); $i++) {
			if ( isset( $this->fields[$i]['name'] ) ) {
				$this->fields[$i]['name'] = $this->name_prefix.$this->fields[$i]['name'];
			}
			else {
				$this->fields[$i]['name'] = $this->name_prefix;
			}
		}
	}

}