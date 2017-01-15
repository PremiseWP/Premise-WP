<?php
/**
* Premise Forms Controller
*
* @package Premise WP
*/
class PWP_Form extends PWP_Field {

	public $name    = '';

	protected $action  = null;

	protected $method  = '';

	protected $enctype = '';

	protected $fields  = array();

	public $form       = 'the form has not been built.';

	function __construct( $args = '' ) {
		// if there is no explicit fields array
		// we assume they are all fields
		if ( ! isset( $args['fields'] ) ) {
			$this->fields = $args;
		}
		else {
			if ( is_array( $args['fields'] ) ) {
				if ( isset( $args['name'] ) && ! empty( $args['name'] ) ) {
					$this->name = esc_attr( $args['name'] );
				}

				if ( isset( $args['action'] ) && ! empty( $args['action'] ) ) {
					$this->action = esc_attr( $args['action'] );
				}

				if ( isset( $args['method'] ) && ! empty( $args['method'] ) ) {
					$this->method = esc_attr( $args['method'] );
				}

				if ( isset( $args['enctype'] ) && ! empty( $args['enctype'] ) ) {
					$this->enctype = esc_attr( $args['enctype'] );
				}

				$this->fields = $args['fields'];
			}
		}

		if ( ! empty( $this->fields ) ) {
			$this->build_form();
		}
		else {
			return false;
		}
	}

	protected function build_form() {
		$form = '';
		foreach ( $this->fields as $k => $field ) {
			$form .= pwp_field( $field, false );
		}
		$this->form = $form;

		echo $this->form;
	}

}