<?php
// Block direct access to this file.
defined( 'ABSPATH' ) or die();

/**
* Premise Fields Model
*
* @package Premise WP
*/
class PWP_Field {

	/**
	 * Holds param defaults
	 *
	 * @var array
	 */
	protected $_defaults = array(
		'tag'           => '',
		'type'          => '',
		'name'          => '',
		'id'            => '',
		'value'         => '',
		'value_att'     => '1',
		'options'       => array(),
		'context'       => '',
		'default'       => '',
	);

	/**
	 * holds args
	 *
	 * @var array
	 */
	public $args = array();

	/**
	 * holds tag
	 *
	 * @var array
	 */
	public $tag = 'input';

	/**
	 * holds type
	 *
	 * @var array
	 */
	public $type = '';

	/**
	 * holds name
	 *
	 * @var array
	 */
	public $name = '';

	/**
	 * holds id
	 *
	 * @var array
	 */
	public $id = '';

	/**
	 * build our object
	 *
	 * @param string $args [description]
	 */
	function __construct( $args = '' ) {

		$this->args = wp_parse_args( $args, $this->_defaults );

		$this->extract_args();

		$this->build_field();
	}

	/**
	 * build an input field
	 *
	 * @return string html for input field
	 */
	protected function input() {
		return '<input type="'.$this->type.'" '.$this->field_atts().'/>';
	}

	/**
	 * build an textarea field
	 *
	 * @return string html for textarea field
	 */
	protected function textarea() {
		return '<textarea '.$this->field_atts( array( 'type', 'value' ) ).'>'.$this->value.'</textarea>';
	}

	/**
	 * build an select field
	 *
	 * @return string html for select field
	 */
	protected function select() {
		return '<select '.$this->field_atts().'>'.$this->options.'</select>';
	}

	/**
	 * build a custom field
	 *
	 * @return string html for custom field
	 */
	protected function build_tag() {
		return '<'.$this->tag.' '.$this->field_atts().'>'.$this->value.'</'.$this->tag.'>';
	}

	/**
	 * Build the field. This creates the field based on the tag
	 *
	 * @return void saves and buiild the field.
	 */
	protected function build_field() {
		$_field = '';
		// build the field
		switch ( $this->tag ) {
			case 'select':
				$_field = $this->select();
				break;

			case 'textarea':
				$_field = $this->textarea();
				break;

			case 'input':
				$_field = $this->input();
				break;

			default:
				$_field = $this->build_tag();
				break;
		}
		// if ( 'checkbox' == $this->type ) var_dump( $_field );
		// add a filter here
		$this->field = $_field;
	}

	/**
	 * get the field attributes in a string separated by space
	 *
	 * @param  string $exclude attributes to be excluded. can be a string or an array
	 * @return string          attributes to be inserted into field.
	 */
	protected function field_atts( $exclude = '' ) {
		$atts = '';

		$exc = (array) $exclude;

		$atts .= ( ! empty( $this->type )
			&& ! in_array( 'type', $exc ) )
			? ' type="'.$this->type.'"'   : '';

		$atts .= ( ! empty( $this->name )
			&& ! in_array( 'name', $exc ) )
			? ' name="'.$this->name.'"'   : '';

		$atts .= ( ! empty( $this->id )
			&& ! in_array( 'id', $exc ) )
			? ' id="'.$this->id.'"'       : '';

		if ( 'checkbox' == $this->type || 'radio' == $this->type ) {
			$atts .= ' value="' . esc_attr( $this->args['value_att'] ) . '" '.
			checked( $this->args['value_att'], $this->value, false );
			unset( $this->args['value_att'] );
		}
		else {
			$atts .= ( ! empty( $this->value )
				&& ! in_array( 'value', $exc ) )
				? ' value="'.$this->value.'"' : '';
			unset( $this->args['value_att'] );
		}

		// backward compatibility for attribute
		if ( isset( $this->args['attribute'] ) && ! empty( $this->args['attribute'] ) ) {
			$atts .= ' ' . $this->args['attribute'];
			unset( $this->args['attribute'] );
		}

		foreach ($this->args as $key => $value) {
			if ( ! in_array( $key, $exc ) && $value ) {
				$atts .= ' '.$key.'="'.$value.'"';
			}
		}

		return $atts;
	}

	/**
	 * Extract and save the necessary params from the arguments passed to the construct.
	 *
	 * @return void does not return anything. basically builds our object.
	 */
	private function extract_args() {
		$this->context = esc_attr( $this->args['context'] );
		$this->type    = $this->get_type();
		$this->tag     = $this->get_tag();
		$this->name    = $this->get_name();
		$this->id      = $this->get_id();
		$this->value   = $this->get_value();
		$this->options = $this->get_options();

		unset( $this->args['tag'] );
		unset( $this->args['type'] );
		unset( $this->args['name'] );
		unset( $this->args['id'] );
		unset( $this->args['value'] );
		unset( $this->args['options'] );
		unset( $this->args['context'] );
	}

	/**
	 * get the type to use when building our field
	 *
	 * @return string type to use
	 */
	private function get_type() {
		return ( ! empty( $this->args['type'] ) ) ? esc_attr( $this->args['type'] ) : '';
	}

	/**
	 * get the html tag to use for our field
	 *
	 * @return string html tag
	 */
	private function get_tag() {
		if ( ! empty( $this->args['tag'] ) ) {
			$_tag = esc_attr( $this->args['tag'] );
		}
		else {
			switch ( $this->type ) {
				case 'select':
				case 'textarea':
					$_tag = $this->type;
					break;

				default:
					$_tag = 'input';
					break;
			}
		}
		return $_tag;
	}

	/**
	 * get the name attribute for our field
	 *
	 * @return string the name attribute
	 */
	private function get_name() {
		$name = ''; // begin with an empty name
		// if the field is not a button, then get the name
		if ( ! $this->is_btn() ) {
			$name = ( ! empty( $this->args['name'] ) ) ? $this->args['name'] : '';
			// if no name, try getting from id
			if ( empty( $name ) && ! empty( $this->args['id'] ) ) {
				$name = preg_replace( '/[^-_a-z0-9]/', '', $this->args['id'] );
			}
			// If the field's 'multiple' attribute is true,
			// and the name does not already have '[]' at the end of it, then add it.
			$name = ( isset( $this->args['multiple'] )
				&& $this->args['multiple'] )
				&& ! preg_match( '/\[\]$/', $this->args['name'] ) ? $name . '[]' : $name;
		}
		return esc_attr( $name );
	}

	/**
	 * get the id attribute for our field
	 *
	 * @return string id attribute
	 */
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

	/**
	 * get the value attribute for our field
	 *
	 * @return string the value attribute or content if the field does not support value. see buildt_tag() for more info
	 */
	private function get_value() {
		$val = '';
		if ( isset( $this->args['value'] ) && ! empty( $this->args['value'] ) ) {
			$val = esc_attr( $this->args['value'] );
		}
		elseif ( ! empty( $this->name ) ) {
			$val = premise_get_value( $this->name, $this->context );
		}
		else {
			return '';
		}
		if ( is_array( $val ) ) {

			return implode( ',', $val );
		}
		elseif ( ! pwp_empty_value( $val ) ) {

			return esc_attr( $val );
		}
		else {
			// return default
			return ( isset( $this->args['default'] ) && ! empty( $this->args['default'] ) ) ? esc_attr( $this->args['default'] ) : '';
		}
	}

	/**
	 * get the options for the select field. Only applies to the selcet field
	 *
	 * @return string html for options
	 */
	private function get_options() {
		$opts = '';
		if ( isset( $this->args['options'] ) && is_array( $this->args['options'] ) ) {

			foreach ( $this->args['options'] as $k => $v ) {
				if ( ! empty( $k ) ) {
					$opts .= '<option value="'.esc_attr( $v ).'"';

						if ( is_array( $this->value ) ) {

							$opts .= in_array( $v, $this->value ) ? 'selected="selected"' : '';

						} else {

							$opts .= selected( $this->value, $v, false );
						}

					$opts .= '>'.esc_attr( $k ).'</option>';
				}
			}
		}
		return $opts;
	}

	private function is_btn() {
		return ( 'button' !== $this->type
			 && 'submit'  !== $this->type
			 && 'reset'   !== $this->type )
			 ? false : true;
	}
}
