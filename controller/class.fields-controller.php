<?php
// Block direct access to this file.
defined( 'ABSPATH' ) or die();

/**
* Premise Fields Controller
*
* @package Premise WP
*/
class PWP_Field_Controller extends PWP_Field {

	/**
	 * Holds the fields that are custom to premise
	 *
	 * @var array
	 */
	protected $pwp_field_types = array(
		'video'    => 'text',
		'fa_icon'  => 'text',
		'wp_media' => 'text',
		'wp_color' => 'text',
	);

	/**
	 * holds our defaults
	 *
	 * @var array
	 */
	protected $defaults = array(
		'type'           => '',
		'label'          => '',
		'before_wrapper' => '',
		'after_wrapper'  => '',
		'wrapper_class'  => '',
		'before_field'   => '',
		'after_field'    => '',
	);

	/**
	 * Holds the params property
	 *
	 * @var array
	 */
	public $params         = array();

	/**
	 * Holds the field_type property
	 *
	 * @var array
	 */
	public $field_type     = '';

	/**
	 * Holds the before_wrapper property
	 *
	 * @var array
	 */
	public $before_wrapper = '';

	/**
	 * Holds the after_wrapper property
	 *
	 * @var array
	 */
	public $after_wrapper  = '';

	/**
	 * Holds the wrapper_class property
	 *
	 * @var array
	 */
	public $wrapper_class  = '';

	/**
	 * Holds the before_field property
	 *
	 * @var array
	 */
	public $before_field   = '';

	/**
	 * Holds the after_field property
	 *
	 * @var array
	 */
	public $after_field    = '';

	/**
	 * Holds the label property
	 *
	 * @var array
	 */
	public $label          = '';

	/**
	 * Holds the html property
	 *
	 * @var array
	 */
	public $html           = '';

	/**
	 * construct our object
	 *
	 * @param string $args params for field. can be string or array.
	 */
	function __construct( $args = '' ) {
		// empty args not accepted
		if ( empty( $args ) )
			return false;

		// parse with defaults
		$this->params = wp_parse_args( $args, $this->defaults );

		$this->extract_params();

		if ( 'wp_media' == $this->field_type ) {
			wp_enqueue_media();
		}

		if ( 'wp_color' == $this->field_type ) {
			wp_enqueue_script( 'wp-color-picker' );
			wp_enqueue_style( 'wp-color-picker' );
		}

		parent::__construct( $this->params );

		$this->create_field();
	}

	/**
	 * create the field's html
	 *
	 * @return void saves html into object. does not return anything
	 */
	protected function create_field() {
		// begin with an empty string always
		$_html = '';
		// insert html before wrapper if any
		$_html.= ( ! empty( $this->before_wrapper ) ) ? (string) $this->before_wrapper                                                           : '';
		// begin the wrapper
		$_html.= '<div class="premise-field premise-'.$this->tag;
		// add field type as a class if not empty
		$_html.= ( ! empty( $this->field_type ) )     ? ' premise-'.esc_attr( $this->field_type ).'-field'                                       : '';
		// add field type as a class if not empty
		$_html.= ( ! empty( $this->type ) )           ? ' premise-type-'.esc_attr( $this->type )                                                 : '';
		// add wrapper class and close tag if any, else, close tag
		$_html.= ( ! empty( $this->wrapper_class ) )  ? ' '.esc_attr( $this->wrapper_class ).'">'                                                : '">';
		// begin the label if any
		$_html.= ( ! empty( $this->label ) )          ? '<label for="'.$this->id.'">'.strip_tags( $this->label, '<span>,<p>,<br>,<b>,<strong>' ) : '';
		// insert html before field
		$_html.= ( ! empty( $this->before_field ) )   ? (string) $this->before_field                                                             : '';
		// the field
		$_html.= $this->field;
		// insert html after field
		$_html.= ( ! empty( $this->after_field ) )    ? (string) $this->after_field                                                              : '';
		// close the label if any
		$_html.= ( ! empty( $this->label ) )          ? '</label>'                                                                               : '';
		// close the wrapper
		$_html.= '</div>';
		// insert html after the wrapper
		$_html.= ( ! empty( $this->after_wrapper ) )  ? (string) $this->after_wrapper                                                            : '';
		// save html to object
		$this->html = $_html;
	}

	/**
	 * get all params for this field
	 *
	 * @return void does not return anything
	 */
	private function extract_params() {
		// set the 'type'
		if ( isset( $this->params['type'] ) ) {
			$this->field_type = esc_attr( $this->params['type'] );
			// set the params['type'] to the right field
			$this->params['type'] = ( array_key_exists( $this->field_type, $this->pwp_field_types ) ) ? $this->pwp_field_types[ $this->field_type ] : $this->field_type;
		}
		// set and unset the 'before_wrapper' if exists
		if ( isset( $this->params['before_wrapper'] ) && ! empty( $this->params['before_wrapper'] ) ) {
			$this->before_wrapper = (string) $this->params['before_wrapper'];
			unset( $this->params['before_wrapper'] );
		}
		// set and unset the 'after_wrapper' if exists
		if ( isset( $this->params['after_wrapper'] ) && ! empty( $this->params['after_wrapper'] ) ) {
			$this->after_wrapper = (string) $this->params['after_wrapper'];
			unset( $this->params['after_wrapper'] );
		}
		// set and unset the 'wrapper_class' if exists
		if ( isset( $this->params['wrapper_class'] ) && ! empty( $this->params['wrapper_class'] ) ) {
			$this->wrapper_class = (string) $this->params['wrapper_class'];
			unset( $this->params['wrapper_class'] );
		}
		// set and unset the 'before_field' if exists
		if ( isset( $this->params['before_field'] ) && ! empty( $this->params['before_field'] ) ) {
			$this->before_field = (string) $this->params['before_field'];
			unset( $this->params['before_field'] );
		}
		// set and unset the 'after_field' if exists
		if ( isset( $this->params['after_field'] ) && ! empty( $this->params['after_field'] ) ) {
			$this->after_field = (string) $this->params['after_field'];
			unset( $this->params['after_field'] );
		}
		// set and unset the 'label' if exists
		if ( isset( $this->params['label'] ) && ! empty( $this->params['label'] ) ) {
			$this->label = (string) $this->params['label'];
			unset( $this->params['label'] );
		}

		// allow to pass param as bool - i.e. 'multiple' => true|false
		if ( isset( $this->params['multiple'] ) && $this->params['multiple'] )
			$this->params['multiple'] = 'multiple';
		else unset( $this->params['multiple'] );
		// allow to pass param as bool - i.e. 'required' => true|false
		if ( isset( $this->params['required'] ) && $this->params['required'] )
			$this->params['required'] = 'required';
		else unset( $this->params['required'] );
		// allow to pass param as bool - i.e. 'disabled' => true|false
		if ( isset( $this->params['disabled'] ) && $this->params['disabled'] )
			$this->params['disabled'] = 'disabled';
		else unset( $this->params['disabled'] );
	}
}