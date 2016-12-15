<?php
/**
 * Model Premise Field
 *
 * @see library/premise-field-library.php For functions that that this class depends on
 *
 * @package Premise WP
 * @subpackage Model
 */

// Block direct access to this file.
defined( 'ABSPATH' ) or die();

/**
 * PremiseField Class
 *
 * Powers Premise WP options system.
 */
class PremiseField {


	/**
	 * Holds type attribute for field
	 *
	 * @var string
	 */
	protected $type = 'text';




	/**
	 * Defaults for each field
	 *
	 * Reserved Arguments - The following arguments are reserved and should not be used as your own
	 * arguments but as they were intended. Please read the list of reserved arguments below to avoid
	 * using any of them in your own code. These arguments either serve a specific purpose within this
	 * class and will not be added to the field as other attributes are added.
	 *
	 * Public Arguments - These aregumets you can use as your own because they are directly passed to the
	 * field itself.
	 *
	 * @var array
	 *
	 * @since 1.2 Moved type oustide of arguments and other changes
	 */
	public $defaults = array(
		/**
		 * Reseved Arguments
		 */
		'label'      => '',      // Wraps label element around field. uses id for for attribute if id not empty.
		'tooltip'    => '',      // Adds a tooltip and tooltip functionality to field.
		'context'    => '',      // Used to let Premise know where to retrieve values from ( post, user ).
		'wrapper_class' => '',   // Add additional classes to the fields wrapper.
		'default'    => '',      // If value is empty and premise_get_value() returns false we use this as the value
		'value_att'  => '',      // print a value attribute on the field. Used for checkboxes and radio.
		'attribute'  => '',      // HTML attributes to add to element i.e. onchange="doSomethingCool()".
		'options'    => array(), // Options for select fields in this format ( 'Option Text' => 'Option Value' ).
		'add_filter' => array(), // Add filter(s) to this field.
		/**
		 * Public Arguments
		 */
		'name'       => '',      // Name attribute. if empty fills from id.
		'id'         => '',      // ID attribute. if empty fills from name (if name not empty).
		'value'      => '',      // Value attribute. by default tries to premise_get_value( name ).
	);




	/**
	 * Holds initial agrumnets passed to the class
	 *
	 * @var array
	 */
	protected $args = array();




	/**
	 * Parsed arguments for field
	 *
	 * @var array
	 */
	protected $field = array();




	/**
	 * Holds the html for this field
	 *
	 * @var string
	 */
	public $html = '';




	/**
	 * Holds the field label including tooltip
	 *
	 * @var string
	 */
	public $label = '';




	/**
	 * Holds the field raw html
	 *
	 * @var string
	 */
	public $field_html = '';




	/**
	 * Will hold our button markup to upload wp media
	 *
	 * @var string
	 */
	protected $btn_upload_file = '<a
		class="premise-btn-upload"
		href="javascript:void(0);"
		><i class="fa fa-fw fa-upload"></i></a>';




	/**
	 * Holds the button for removing wp media uploaded
	 *
	 * @var string
	 */
	protected $btn_remove_file = '<a
		class="premise-btn-remove"
		href="javascript:void(0);"
		><i class="fa fa-fw fa-times"></i></a>';




	/**
	 * Holds our fa_icon insert btn
	 *
	 * @var string
	 */
	protected $btn_insert_icon = '<a
		href="javascript:void(0);"
		class="premise-choose-icon"
		><i class="fa fa-fw fa-th"></i></a>';





	/**
	 * Holds our fa_icon remove btn
	 *
	 * @var string
	 */
	protected $btn_remove_icon = '<a
		href="javascript:void(0);"
		class="premise-remove-icon"
		><i class="fa fa-fw fa-times"></i></a>';




	/**
	 * Holds our fontawesome icons. assigned on prepare_field();
	 *
	 * @var array
	 */
	public $fa_icons = array();




	/**
	 * Stores all filters that were used for a particular field
	 *
	 * @since 1.2 added to remove filters at the end
	 *
	 * @see remove_filters() runs at the end to make sure no filters repeat
	 *
	 * @var array
	 */
	protected $filters_used = array();




	/**
	 * Construct our object
	 *
	 * @param string $type Field type.
	 * @param array  $args array holding one or more fields.
	 */
	function __construct( $type = '', $args ) {

		if ( ! empty( $type ) && is_string( $type ) ) {

			$this->type = $type;
		}

		if ( ! empty( $args ) && is_array( $args ) ) {

			$this->args = $args;
		}

		if ( ( empty( $type ) && is_array( $args ) ) && array_key_exists( 'type', $args ) ) {

			$this->type = $args['type'];
			unset( $args['type'] );
			$this->args = $args;
		}

		// Initiate the field.
		$this->field_init();

	}




	/**
	 * Begin processing the field
	 */
	protected function field_init() {

		// Parse defaults and arguments.
		$this->set_defaults();

		// Get everything ready to build the field.
		$this->prepare_field();

		// Build the field.
		$this->build_field();
	}






	/**
	 * Merge defaults with arguments passed to our object
	 *
	 * Saves all arguments into one array of arrays held by $field property.
	 *
	 * @return array all arguments. array of arrays.
	 */
	protected function set_defaults() {

		/**
		 * Parse defaults and arguments
		 *
		 * @see https://codex.wordpress.org/Function_Reference/wp_parse_args documentation for wp_parse_args()
		 *
		 * @var array
		 */
		$field = wp_parse_args( $this->args, $this->defaults );

		/**
		 * Make sure our field has its necessary attributes - name, id, value
		 * Get the name field first since it is needed for the value field to be retreived.
		 */
		$field['name']  = $this->get_name();
		$field['value'] = $this->get_db_value();
		$field['id']    = $this->get_id_att();

		/**
		 * Assign common attributes
		 *
		 * For commonly (repetitive) attributes like required="required" you can simply pass required => true. We
		 * know, is not a big deal, but why not make things easier?
		 *
		 * These params are also used in some places in our class to insert or add additioinal functionality to a field.
		 * On the select field if 'multiple' is true it adds multiple="multiple" to the field but also adds '[]' at end of the
		 * name attribute to ensure that the value is saved as an array. At the same time, when the value is retrieved and Premise
		 * tries to find which options were selected it will loop through the array to find multiple options as expected.
		 *
		 * @since 1.2
		 */
		$field['required'] = ( isset( $field['required'] ) && $field['required'] ) ? 'required' : '';
		$field['multiple'] = ( isset( $field['multiple'] ) && $field['multiple'] ) ? 'multiple' : '';
		$field['disabled'] = ( isset( $field['disabled'] ) && $field['disabled'] ) ? 'disabled' : '';

		$this->field = $field;
	}






	/**
	 * Prepare the field
	 */
	protected function prepare_field() {

		// Add filters before we do anything else.
		$this->add_filters();

		// Prep the label.
		$this->the_label();

		// Prep the field.
		$this->the_field();
	}





	/**
	 * Add filters
	 *
	 * This has to run first to make sure that our filters get hooked before they are called.
	 * Unsets the filter argument at the end to avoid conflicts when printing attributes on field.
	 *
	 * Filters are passed arrays containing the name of the filter and the function to call separated
	 *
	 * @example 'add_filter' => array( 'premise_field_input', array( $this, 'my_field_input' ) )
	 *
	 * @example 'add_filter' => array(
	 *              array( 'premise_field_input', array( $this, 'my_field_input' ) ), // Filter 1
	 *              array( 'premise_field_input', array( $this, 'my_field_input2' ) ), // Filter 2
	 *          )
	 *
	 * @since 1.2
	 */
	protected function add_filters() {

		if ( ! empty( $this->field['add_filter'] )
			&& is_array( $this->field['add_filter'] ) ) {

			// Array of arrays (multiple filters).
			if ( is_array( $this->field['add_filter'][0] ) ) {

				foreach ( $this->field['add_filter'] as $filter ) {

					add_filter( $filter[0], $filter[1] );

					array_push( $this->filters_used, $filter[0] );
				}
			} else { // 1 filter.

				add_filter( $this->field['add_filter'][0], $this->field['add_filter'][1] );

				array_push( $this->filters_used, $this->field['add_filter'][0] );
			}
		}

		if ( 'wp_media' == $this->type ) {

			wp_enqueue_media();
		}

		unset( $this->field['add_filter'] );
	}





	/**
	 * Saves and returns the label html element
	 *
	 * @since 1.2
	 *
	 * @return string HTML for label element
	 */
	protected function the_label() {
		$label = '';

		if ( ! empty( $this->field['label'] ) ) {
			$label .= '<label';
			$label .= ! empty( $this->field['id'] )       ? ' for="' . esc_attr( $this->field['id'] ) . '">'                                                                                      : '>';
			$label .= esc_attr( $this->field['label'] );
			$label .= ! empty( $this->field['required'] ) ? ' <span class="premise-required">*</span>'                                                                                        : '';
			$label .= premise_tooltip( $this->field['tooltip'] );
			$label .= '</label>';
		}

		/**
		 * Alter the label html
		 *
		 * This filter allows you to change the html of the label element for a field.
		 * It passes the generated html to the function. additionally, it passes the
		 * field's arguments and its type.
		 *
		 * @since 1.2 Added with new premise field class
		 *
		 * @premise-hook premise_field_label_html do hook for label html string
		 *
		 * @var string
		 */
		$this->label = apply_filters( 'premise_field_label_html', $label, $this->field, $this->type );
	}




	/**
	 * The field's raw html
	 *
	 * Builds the fields raw html - without the div wrappers. This returns  only the
	 * minimum elements necessary for a field to work. Common fields don't require any
	 * additional elements, but fields like a media uploader require a button to upload
	 * and one to remove whatever was already uploaded. So this function will return the
	 * field plus the upload and remove buttons, nothing else.
	 *
	 * @var string $this->field_html holds the string for the raw field
	 *
	 * @return string html for the raw field
	 */
	protected function the_field() {

		$html = ''; // Start with a clean HTML string.

		/**
		 * Build field depending on the type passed
		 */
		switch ( $this->type ) {

			case 'select':

				$html .= $this->select_field();
				break;

			case 'textarea':

				$html .= $this->textarea();
				break;

			case 'checkbox':

				$html .= $this->checkbox();
				break;

			case 'radio':

				$html .= $this->radio();
				break;

			case 'wp_media':

				$html .= $this->wp_media();
				break;

			case 'fa_icon':

				$html .= $this->fa_icon();
				break;

			case 'video':

				$html .= $this->video();
				break;

			case 'wp_color':

				$html .= $this->wp_color();
				break;

			default:

				$html .= $this->input_field();
				break;
		}

		/**
		 * Filter the field's html
		 *
		 * Allows you to change the html passed to the field element
		 *
		 * @since 1.2    added to allow even more control over the markup
		 *
		 * @premise-hook premise_field_raw_html filter the html for the field itself
		 *
		 * @var string
		 */
		$this->field_html = apply_filters( 'premise_field_raw_html', $html, $this->field, $this->type );
	}






	/**
	 * Builds our field and saves the html for it in our object
	 *
	 * @return string HTML for field
	 */
	protected function build_field() {

		// Sanitize wrapper CSS classes.
		$wrapper_class = implode(
			' ',
			array_map( 'sanitize_html_class', explode( ' ', $this->get_wrapper_class() ) )
		);

		/**
		 * HTML for actual field
		 *
		 * @var string
		 */
		$html = '<div class="' . $wrapper_class . '">';

			$html .= ( 'checkbox' !== $this->type && 'radio' !== $this->type ) ? $this->label : '';

			$html .= '<div class="premise-field-' . sanitize_html_class( $this->type ) . '">';

				$html .= $this->field_html;

			$html .= '</div>';

			$html .= ( 'checkbox' !== $this->type && 'radio' !== $this->type ) ? '' : $this->label;

			/**
			 * Insert your own markup after the field
			 *
			 * @since 1.2
			 *
			 * @premise-hook premise_field_html_after_wrapper insert html after the field wrapper
			 *
			 * @var string has to return html string
			 */
			$html .= apply_filters( 'premise_field_html_after_wrapper', '', $this->field, $this->type );

		$html .= '</div>';

		/**
		 * Filter the entire html
		 *
		 * Allows you to change the html passed to the field element
		 *
		 * @since 1.2
		 *
		 * @premise-hook premise_field_html filter the html for the whole field
		 *
		 * @var string
		 */
		$this->html = apply_filters( 'premise_field_html', $html, $this->field, $this->type );

		/**
		 * Remove filters
		 *
		 * @since 1.2 remove filters used to avoid any conflicts
		 */
		$this->remove_filters();
	}




	/**
	 * Create an input field
	 *
	 * @return string html for an input element
	 */
	protected function input_field() {

		$field  = '<input type="'. esc_attr( $this->type ) .'"';

		$field .= $this->get_atts();

		$field .= '>';

		/**
		 * Filter to alter html of input field after creating it
		 *
		 * @since 1.2 added to offer more control over markup
		 *
		 * @premise-hook premise_field_input filter the input field html
		 */
		return apply_filters( 'premise_field_input', $field, $this->field, $this->type );
	}







	/**
	 * Textarea element
	 *
	 * @return string html for textarea
	 */
	protected function textarea() {

		$field = '<textarea';

		$field .= $this->get_atts();

		$field .= '>' . $this->field['value'] . '</textarea>';

		/**
		 * Premise_field_textarea filter
		 *
		 * @premise-hook premise_field_textarea filter the textarea field html
		 *
		 * @since 1.2
		 */
		return apply_filters( 'premise_field_textarea', $field, $this->field, $this->type );
	}






	/**
	 * Create a checkbox field
	 *
	 * @return string html for checkbox field
	 */
	protected function checkbox() {

		$field  = '<input type="' . esc_attr( $this->type ) . '"';

		$field .= ! $this->empty_value( $this->field['value_att'] ) ?
			' value="' . esc_attr( $this->field['value_att'] ) . '"' :
			' value="1"';

		$field .= $this->get_atts();

		$field .= '>';

		return $field;
	}






	/**
	 * Create a radio field
	 *
	 * @return string html for radio element
	 */
	protected function radio() {

		$field  = '<input type="' . $this->type . '"';

		$field .= ! $this->empty_value( $this->field['value_att'] ) ?
			' value="' . esc_attr( $this->field['value_att'] ) . '"' :
			' value="1"';

		$field .= $this->get_atts();

		$field .= '>';

		return $field;
	}





	/**
	 * Create select field
	 *
	 * @return string html for select field
	 */
	protected function select_field() {

		$field  = '<select';

		$field .= $this->get_atts();

		$field .= '>' . $this->select_options() . '</select>';

		return $field;
	}






	/**
	 * Create select field options
	 *
	 * @return string option elements for select dropdown
	 */
	protected function select_options() {

		$options = '';

		foreach ( (array) $this->field['options'] as $key => $value ) {

			$options .= '<option  value="' . esc_attr( $value ) . '"';

			if ( is_array( $this->field['value'] ) ) {

				$options .= in_array( $value, $this->field['value'] ) ? 'selected="selected"' : '';

			} else {

				$options .= selected( $this->field['value'], $value, false );
			}

			$options .= '>' . esc_html( $key ) . '</option>';
		}

		return $options;
	}






	/**
	 * Create wp media upload field
	 *
	 * This field allows you to upload files using Wordpress
	 * own media upload ui.
	 *
	 * @since 1.2 replace the file type since now you can use that independently HTML5
	 *
	 * @return string html for wp media upload field
	 */
	protected function wp_media() {

		/**
		 * We add our own filter to build the media field off our input field
		 */
		add_filter( 'premise_field_input', array( $this, 'wp_media_input' ) );

		/**
		 * Call the input field.
		 *
		 * This will be altered due to our hook above
		 *
		 * @var string
		 */
		$field = $this->input_field();

		/**
		 * Filter to alter the html on the media upload btn
		 *
		 * @since 1.2
		 *
		 * @premise-hook premise_field_upload_btn filter the wp media upload button
		 */
		$field .= apply_filters( 'premise_field_upload_btn', $this->btn_upload_file, $this->field );

		/**
		 * Filter to alter the html on the media remove button
		 *
		 * @since 1.2
		 *
		 * @premise-hook premise_field_remove_btn filter the wp media remove button
		 */
		$field .= apply_filters( 'premise_field_remove_btn', $this->btn_remove_file, $this->field );

		/**
		 * Filter to alter the html wp media field
		 *
		 * @since 1.2
		 *
		 * @premise-hook premise_field_wp_media_html filter the wp media field
		 */
		return apply_filters( 'premise_field_wp_media_html', $field, $this->field, $this->type );
	}




	/**
	 * Build our wp media input field
	 *
	 * @since 1.2
	 *
	 * @param  string $field html for default input field.
	 *
	 * @return string        the new html for the field
	 */
	public function wp_media_input( $field ) {
		$multi = ( isset( $this->field['multiple'] ) && $this->field['multiple'] ) ? 'true' : 'false';
		$preview = ( isset( $this->field['preview'] ) && $this->field['preview'] ) ? 'true' : 'false';

		return str_replace( 'type="wp_media"', 'type="text" class="premise-wp-media-field" data-options=\'{ "wrap": false, "preview": '.$preview.', "multiple": '.$multi.' }\'', $field );
	}





	/**
	 * Build fa_icon field
	 *
	 * @since 1.2
	 *
	 * @return string html for fa_icon field
	 */
	protected function fa_icon() {

		/**
		 * We add our own filter to buuild the field off our own input field
		 */
		add_filter( 'premise_field_input', array( $this, 'fa_icon_input' ) );

		/**
		 * Call the input field.
		 *
		 * This will be altered due to our hook above
		 *
		 * @var string
		 */
		$field = $this->input_field();

		/**
		 * Filter to alter the html on the icon select btn
		 *
		 * @since 1.2
		 *
		 * @premise-hook premise_field_icon_insert_btn do filter for button to show fa icon
		 */
		$field .= apply_filters( 'premise_field_icon_insert_btn', $this->btn_insert_icon, $this->field );

		/**
		 * Filter to alter the html on the icon remove button
		 *
		 * @since 1.2
		 *
		 * @premise-hook premise_field_icon_remove_btn do filter for button to hide fa icon
		 */
		$field .= apply_filters( 'premise_field_icon_remove_btn', $this->btn_remove_icon, $this->field );

		/**
		 * premise_field_fa_icon_html filter
		 *
		 * @since 1.2
		 *
		 * @premise-hook premise_field_fa_icon_html do filter for fa_icon field
		 */
		return apply_filters( 'premise_field_fa_icon_html', $field, $this->field, $this->type );
	}






	/**
	 * Build our fa_icon input element from our own input field
	 *
	 * @since 1.2
	 *
	 * @param  string $field the html for the field default.
	 *
	 * @return string        the new html for the field
	 */
	public function fa_icon_input( $field ) {

		return str_replace( 'type="fa_icon"', 'type="text" class="premise-field-fa_icon-input"', $field );
	}




	/**
	 * Display the fa-icons for user to choose from
	 *
	 * @deprecated 1.4.5 replaced with premise_get_fa_icons_html() which is called by ajax when the fields get loaded in the front end
	 *
	 * @return string html for fa icons
	 */
	public function fa_icons() {

		$icons = '<div class="premise-field-fa-icons-container" style="display:none;">
				  <div class="premise-field-fa-icons-container-inner"><ul class="premise-row">';

		foreach ( (array) premise_get_fa_icons() as $icon ) {

			$icons .= '<li class="premise-field-fa-icon-li premise-inline-block">
				<a href="javascript:;" class="premise-field-fa-icon-anchor premise-block" data-icon="' . $icon . '">
					<i class="fa fa-fw ' . $icon . '"></i>
				</a>
			</li>';

		}

		$icons .= '</ul></div></div>';

		return $icons;
	}




	/**
	 * Build video field
	 *
	 * Right now this only returns a textarea with some classes added to it.
	 * Eventually this should have options to search for video to embed and
	 * display the video belo or something.
	 *
	 * @since 1.2
	 */
	protected function video() {

		$field  = '<input type="text" data-type="video"';

		$field .= $this->get_atts();

		$field .= '>';

		/**
		 * Filter to alter html of input field after creating it
		 *
		 * @since 1.2 added to offer more control over markup
		 *
		 * @premise-hook premise_field_input filter the input field html
		 */
		return apply_filters( 'premise_field_input', $field, $this->field, $this->type );
	}





	/**
	 * Build wp_color field
	 *
	 * Implemented
	 * Eventually this should have options to search for wp_color to embed and
	 * display the wp_color below or something.
	 *
	 * @see http://stackoverflow.com/questions/18318537/using-wordpress-color-picker-in-post-options
	 *
	 * @since 1.2
	 */
	protected function wp_color() {

		wp_enqueue_script( 'wp-color-picker' );
		wp_enqueue_style( 'wp-color-picker' );

		/**
		 * We our own filter to alter the html of our input field
		 */
		add_filter( 'premise_field_input', array( $this, 'wp_color_input' ) );

		/**
		 * Call the input field.
		 *
		 * This will be alter due to our hook above
		 *
		 * @var string
		 */
		$field = $this->input_field();

		return $field;
	}





	/**
	 * Filter the textarea for wp_color field
	 *
	 * @since 1.2
	 *
	 * @param  string $field html for textarea field.
	 *
	 * @return string        new html
	 */
	public function wp_color_input( $field ) {

		$js = "<script>
			jQuery(document).ready(function($) {
				$('#" . $this->get_id_att() . "').wpColorPicker();
			});
		</script>";

		$field = str_replace( 'type="wp_color"', 'type="text" data-type="wp_color" class="premise-wp_color"', $field );

		return $js . $field;
	}




	/**
	 * Try to get the option value for a field
	 *
	 * @since 1.2 added before but documented in this version
	 *
	 * @return  mixed       returns the value found or an empty string if nothing was found
	 */
	protected function get_db_value() {

		if ( isset( $this->args['value'] )
			&& ! $this->empty_value( $this->args['value'] ) ) {

			$val = $this->args['value'];

		} else {

			$name = ! empty( $this->args['name'] ) ? $this->args['name'] : $this->get_name();

			if ( empty( $name ) ) {

				return '';
			}

			$context = ! empty( $this->args['context'] ) ? $this->args['context'] : '';

			$val = premise_get_value( $name, $context );
		}

		if ( is_array( $val ) ) {

			return $val;
		}
		elseif ( ! $this->empty_value( $val ) ) {

			return esc_attr( $val );
		}
		else {

			return isset( $this->args['default'] ) && ! $this->empty_value( $this->args['default'] ) ?
				esc_attr( $this->args['default'] ) :
				'';
		}
	}




	/**
	 * Get id attribute for field from name
	 *
	 * @since 1.2 added before but documented in this version
	 *
	 * @return string       filtered string for id
	 */
	protected function get_id_att() {

		$id_att = '';

		if ( ! empty( $this->args['id'] ) ) {

			$id_att = $this->args['id'];

		} elseif ( ! empty( $this->args['name'] ) ) {

			$name = $this->args['name'];

			/**
			 * If values are stored in an array
			 */
			if ( preg_match( '/\[|\]/', $name ) ) {

				/**
				 * Turn html att name into an array of keys
				 *
				 * This will help us get the options from the database
				 *
				 * @var array
				 */
				$id_att = preg_replace( array( '/\[/', '/\]/' ), array( '-', '' ), $name );

			} else {

				$id_att = $name;
			}
		}

		return $this->args['id'] = esc_attr( $id_att );
	}




	/**
	 * Get the name attribute from the id
	 *
	 * @since 1.2 added before but documented in this version
	 *
	 * @return string        filtered string for name
	 */
	protected function get_name() {

		$name = '';

		if ( ! empty( $this->args['name'] ) ) {

			$name = $this->args['name'];

		} elseif ( ! empty( $this->args['id'] ) ) { // If name is empty try getting from id.

			$name = $this->args['id'];
			$name = preg_replace( '/[^-_a-z0-9]/', '', $name );
		}

		// If the field's 'multiple' attribute is true,
		// and the name does not already have '[]' at the end of it, then add it.
		$name = ( isset( $this->args['multiple'] )
			&& $this->args['multiple'] )
			&& ! preg_match( '/\[\]$/', $this->args['name'] ) ? $name . '[]' : $name;

		return $this->args['name'] = esc_attr( $name );
	}




	/**
	 * Get attributes for input field
	 *
	 * @since 1.2
	 *
	 * @return string    string of attributes
	 */
	protected function get_atts() {

		$field = ! empty( $this->field['attribute'] ) ? ' ' . $this->field['attribute'] : '';

		$_field = $this->field;

		if ( 'select' == $this->type || 'textarea' == $this->type ) {

			unset( $_field['value'] );
		}

		if ( 'radio' == $this->type || 'checkbox' == $this->type ) {

			$field .= ! $this->empty_value( $_field['value'] ) ?
				' ' . checked(
					! $this->empty_value( $_field['value_att'] ) ?
						$_field['value_att'] :
						'1',
					$_field['value'],
					false
				) :
				'';

			// Unset value attribute: already set using value_att.
			unset( $_field['value'] );
		}

		// If it is media field and value is array
		// display comma separated values
		if ( 'wp_media' == $this->type && is_array( $_field['value'] ) )
			$_field['value'] = implode( ',', $_field['value'] );

		unset( $_field['label'] );
		unset( $_field['tooltip'] );
		unset( $_field['add_filter'] );
		unset( $_field['template'] );
		unset( $_field['default'] );
		unset( $_field['options'] );
		unset( $_field['value_att'] );
		unset( $_field['attribute'] );
		unset( $_field['context'] );
		unset( $_field['wrapper_class'] );

		foreach ( $_field as $k => $v ) {

			$field .= ! $this->empty_value( $v ) ? ' ' . esc_attr( $k ) . '="' . esc_attr( $v ) . '"' : '';
		}

		return $field;
	}




	/**
	 * Get the field's wraper classes
	 *
	 * This basically takes every parameter that was passed and adds it as a class
	 * to the wrapper html with premise-field- as a prefix, additionally to the
	 * regular class - premise-field.
	 *
	 * Then, the 'wrapper_class' parameter is appended.
	 *
	 * @return string classes for field wrapper
	 */
	protected function get_wrapper_class() {

		// Start with the main classes.
		$class = 'premise-field premise-field-type-' . $this->type;

		foreach ( $this->field as $k => $v ) {

			$class .= ! empty( $v ) ? ' premise-field-' . esc_attr( $k ) : '';
		}

		// Append 'wrapper_class' parameter.
		if ( ! empty( $this->field['wrapper_class'] ) ) {

			$class .= ' ' . esc_attr( $this->field['wrapper_class'] );
		}

		/**
		 * Filter to alter the classes passed to the wrapper element
		 *
		 * @since 1.2
		 *
		 * @premise-hook premise_field_wrapper_class do filter for wrapper classes
		 */
		return apply_filters( 'premise_field_wrapper_class', $class );
	}




	/**
	 * Remove filters
	 *
	 * After everything runs and we save our HTML for the field
	 * unhook the filters and action hooks
	 *
	 * @since 1.2 removes filters to avoid repetition
	 */
	protected function remove_filters() {

		foreach ( (array) $this->filters_used as $hook ) {

			remove_all_filters( $hook );
		}
	}




	/**
	 * Get the field
	 *
	 * @return string html for complete field
	 */
	public function get_field() {

		return $this->html;
	}




	/**
	 * Is value empty?
	 * Allow '0' values
	 * Prefer empty_value over PHP empty function when checking for empty values
	 * excluding 0, '0' or 0.0 values
	 *
	 * @link http://php.net/empty
	 *
	 * @since 1.2
	 *
	 * @example if ( isset( $value ) && ! $this->empty_value( $value ) )
	 *
	 * @param  string $value Value.
	 *
	 * @return boolean True if empty value & $value !== 0, 0.0, '0', else false
	 */
	public function empty_value( $value ) {

		return empty( $value ) && $value !== 0 && $value !== 0.0 && $value !== '0';
	}
}
