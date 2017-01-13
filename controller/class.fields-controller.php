<?php
/**
* Premise Fields Controller
*
* @package Premise WP
*/
class PWP_Field_Controller {

	protected $defaults = array(
		'tag'           => '',
		'type'          => 'text',
		'name'          => '',
		'id'            => '',
		'value'         => '',
		'value_att'     => '',
		'default'       => '',
		'options'       => array(),
		'before_field'  => '',
		'after_field'   => '',
		'context'       => '',
	);

	protected $args = array();

	public $tag = 'input';

	public $type = 'text';

	public $name = '';

	public $id = '';

	function __construct( $args = '' ) {

		$this->args = wp_parse_args( $args, $this->defaults );

		$this->tag  = $this->get_tag();

		$this->type  = $this->get_type();

		$this->name = $this->get_name();

		$this->id   = $this->get_id();

		$this->build_field();
	}


	public function input() {
		return '<input type="'.$this->type.'" name="'.$this->name.'" id="'.$this->id.'">';
	}


	public function select() {
		return '<select name="'.$this->name.'" id="'.$this->id.'">'.''.'</select>';
	}

	public function build_tag() {
		return '<'.$this->tag.' name="'.$this->name.'" id="'.$this->id.'">'.''.'</'.$this->tag.'>';
	}


	protected function build_field() {
		$_field = '';
		// build the field
		switch ( $this->tag ) {
			case 'select':
				$_field = $this->select();
				break;

			case 'input':
				$_field = $this->input();
				break;

			default:
				$_field = $this->build_tag();
				break;
		}
		// build the field's html
		$html  = ( isset( $this->args['before_field'] )
			 && ! empty( $this->args['before_field'] ) ) ? $this->args['before_field'] : '';
		$html .= $_field;
		$html .= ( isset( $this->args['after_field'] )
			 && ! empty( $this->args['after_field'] ) ) ? $this->args['after_field'] : '';
		// add a filter here
		$this->field = $html;
	}


	private function get_tag() {
		if ( ! empty( $this->args['tag'] ) ) {
			$_tag = esc_attr( $this->args['tag'] );
		}
		else {
			switch ( $this->args['type'] ) {
				case 'select':
				case 'textarea':
					$_tag = esc_attr( $this->args['type'] );
					break;

				default:
					$_tag = 'input';
					break;
			}
		}
		return $_tag;
	}


	private function get_type() {
		$_type = ( ! empty( $this->args['type'] ) ) ? esc_attr( $this->args['type'] ) : 'text';
		return $_type;
	}


	private function get_name() {
		$name = ( ! empty( $this->args['name'] ) ) ? esc_attr( $this->args['name'] ) : '';
		// if no name, try getting from id
		if ( empty( $name ) && ! empty( $this->args['id'] ) ) {
			$name = preg_replace( '/[^-_a-z0-9]/', '', esc_attr( $this->args['id'] ) );
		}
		// If the field's 'multiple' attribute is true,
		// and the name does not already have '[]' at the end of it, then add it.
		$name = ( isset( $this->args['multiple'] )
			&& $this->args['multiple'] )
			&& ! preg_match( '/\[\]$/', $this->args['name'] ) ? $name . '[]' : $name;
		return esc_attr( $name );
	}


	private function get_id() {
		$id_att = '';
		if ( ! empty( $this->args['id'] ) ) {
			$id_att = esc_attr( $this->args['id'] );
		} elseif ( ! empty( $this->args['name'] ) ) {
			$name = esc_attr( $this->args['name'] );
			// If values are stored in an array
			if ( preg_match( '/\[|\]/', $name ) ) {
				$id_att = preg_replace( array( '/\[/', '/\]/' ), array( '-', '' ), $name );
			} else {
				$id_att = $name;
			}
		}
		return esc_attr( $id_att );
	}
}