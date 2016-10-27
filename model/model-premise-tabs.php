<?php
/**
 * Premise Tabs
 *
 * Create HTML fro tabs
 *
 * @since 1.5.0 added this class. it used to an independent plugin
 *
 * @package Premise WP
 * @subpackage Model
 */

// Block direct access to this file.
defined( 'ABSPATH' ) or die();

// if Premise Tabs plugin has not loaded
if ( ! class_exists( 'Load_Premise_Tabs' ) ) {

/**
 * Empty class. Only declared so that we do not have to change
 * all other projects that check if Premise Tabs is installed or not.
 */
class Load_Premise_Tabs {

	function __construct(){}
}

/**
 * Premise Tabs Class
 *
 * This class is supposed to do one thing well - output markup for tabs.
 * That means that this class is meant to provide developers with the markup
 * necessary for creating tabs, but should let the developer control functionality and
 * styles. Of course, by default this class outputs working tabs with basic styles and
 * fucntionality, but the idea is that they can be easily overridden or customized.
 *
 * @example $tabs = array(
 *          	array(
 *          		'title'   => 'Tab 1',
 *          		'content' => 'HTML for content here..',
 *          	),
 *          	array(..
 *          );
 *          new Premise_Tabs( $tabs, 'top' );
 */
class Premise_Tabs {

	/**
	 * The defaults for each tab
	 *
	 * @see constructor
	 *
	 * @var array
	 */
	protected $defaults = array(
		'title'   => '',
		'icon'    => '',
		'content' => '',
		'url'     => 'javascript:;',
	);


	/**
	 * The options.
	 *
	 * For ease of use, the options argument can be a string
	 * simply containing the location of where to place the tabs.
	 * This argument defaults to 'top'. An array can also be passed
	 * as the second argument to give you more control - further documentation
	 * in the constructor function.
	 *
	 * @see constructor
	 *
	 * @var array
	 */
	protected $options = array( 'layout' => 'top' );


	/**
	 * [$options_defaults description]
	 * @var array
	 */
	protected $options_defaults = array(
		'layout'         => '',
		'content_in_tab' => true,
	);


	/**
	 * The tabs
	 *
	 * @var array
	 */
	protected $tabs = array();


	/**
	 * replace the default wrapper class with this one is not empty
	 *
	 * @var string
	 */
	public $wrapper_class = '';


	/**
	 * HTML tags allowed in the tabs title
	 *
	 * @var string
	 */
	protected $allowed_title_tags = '<h1>,<h2>,<h3>,<h4>,<h5>,<h6>,<p>,<span>,<br>';


	/**
	 * Constructor
	 *
	 * @param array         $tabs           Array of tabs title, icon, content, tab_class, content_class.
	 * @param array|string  $params         Tabs options: string => layout|array => see doc.
	 * @param string        $wrapper_class  wrapper class to replace default with
	 */
	public function __construct( $tabs = array(), $params = '', $wrapper_class = '' ) {

		if ( is_array( $tabs ) && ! empty( $tabs ) ) {
			// parse wrapper class
			$this->wrapper_class = ! empty( (string) $wrapper_class ) ? esc_attr( $wrapper_class ) : $this->wrapper_class;

			// parse params
			$this->set_options( $params );

			// Save tabs into our object's tabs property.
			foreach ( $tabs as $k => $tab ) {
				if ( is_array( $tab ) ) {
					$this->tabs[] = wp_parse_args( $tab, $this->defaults );
				}
			}


			$this->load_tabs();

			remove_all_filters( 'pwptabs_before_tabs' );
		}
	}


	/**
	 * Loads the tabs
	 *
	 * Outputs the html for the tabs.
	 */
	public function load_tabs() {

		$html = ( isset( $this->options['content_in_tab'] )
					&& $this->options['content_in_tab'] )
						? $this->tabs_together()
							: $this->tabs_independent();

		// TODO: escape user defined content?
		echo $html;
	}



	/**
	 * Prints out tabs separate from the content.
	 *
	 * Both tabs and contents are output in separate containers within
	 * one wrapper container.
	 *
	 * @return string html for tabs
	 */
	public function tabs_independent() {
		$_tabs = '<div class="pwptabs pwptabs-tabs-container">'; // Begin with an clean tabs container.
		$_cont = '<div class="pwptabs-content-container">'; // Begin with an clean contents container.

		foreach ( $this->tabs as $k => $tab ) {

			if ( ( isset( $tab['title'] ) && ! empty( $tab['title'] ) ) ) {

				/**
				 * pwptabs_before_tabs filter
				 *
				 * allows filtering of the tabs html before the tabs html is parsed
				 *
				 * @wphook pwptabs_before_tabs
				 */
				$_tabs .= apply_filters( 'pwptabs_before_tabs', '' );

				$tab_class = ( isset( $tab['tab_class'] ) && ! empty( $tab['tab_class'] ) ) ?
					' ' . esc_attr( $tab['tab_class'] ) : '';

				// Build the tabs.
				$_tabs .= '<div class="pwptabs-tab pwptabs-tab-' . $k . $tab_class . '">
					<a href="' . $tab['url'] . '" class="pwptabs-toggle" data-tab-index="' . $k . '">';
						// Get icon whether is image or FA.
						$_tabs .= ( isset( $tab['icon'] ) && ! empty( $tab['icon'] ) ) ? $this->get_icon( $tab['icon'] ) : '';
						$_tabs .= '<div class="pwptabs-tab-title">' . $this->stripped_title( $tab['title'] ) . '</div>';
					$_tabs .= '</a>
				</div>';

				$cont_class = ( isset( $tab['content_class'] ) && ! empty( $tab['content_class'] ) ) ?
					' ' . esc_attr( $tab['content_class'] ) : '';

				// Build the content.
				$_cont .= '<div class="pwptabs-content pwptabs-content-' . $k . $cont_class . '">';
					$_cont .= $this->get_content( ( isset( $tab['content'] ) && ! empty( $tab['content'] ) ) ? $tab['content'] : '' );
				$_cont .= '</div>';
			}
		}

		$_tabs .= '</div>'; // End tabs
		$_cont .= '</div>'; // End content

		$_html = '<div class="' . $this->wrapper_class() . ' pwptabs-content-outside-tab">';
			$_html .= ( 'bottom' == $this->options['layout'] ) ? $_cont . $_tabs : $_tabs . $_cont;
		$_html .= '</div>';

		return $_html;
	}


	/**
	 * get the html for the tabs with the content inside the tab
	 *
	 * @return string html for tabs with content inside
	 */
	public function tabs_together() {
		$_tabs = '<div class="pwptabs-tabs-inner">
			<ul class="pwptabs">'; // Begin with an clean tabs container.

		foreach ( $this->tabs as $k => $tab ) {

			if ( ( isset( $tab['title'] ) && ! empty( $tab['title'] ) )
				&& ( isset( $tab['content'] ) && ! empty( $tab['content'] ) ) ) {

				$tab_class = ( isset( $tab['tab_class'] ) && ! empty( $tab['tab_class'] ) ) ?
					' ' . esc_attr( $tab['tab_class'] ) : '';

				// Build the tabs.
				$_tabs .= '<li class="pwptabs-tab pwptabs-tab-' . $k . $tab_class . ' pwptabs-tab-li">
					<a href="' . $tab['url'] . '" class="pwptabs-toggle">';
						// Get icon whether is image or FA.
						$_tabs .= ( isset( $tab['icon'] ) && ! empty( $tab['icon'] ) ) ? $this->get_icon( $tab['icon'] ) : '';
						$_tabs .= '<div class="pwptabs-tab-title">' . $this->stripped_title( $tab['title'] ) . '</div>';
					$_tabs .= '</a>';

						$cont_class = ( isset( $tab['content_class'] ) && ! empty( $tab['content_class'] ) ) ?
							' ' . esc_attr( $tab['content_class'] ) : '';

						// Build the content.
						$_tabs .= '<div class="pwptabs-content pwptabs-content-' . $k . $cont_class . '">';
							$_tabs .= $this->get_content( ( isset( $tab['content'] ) && ! empty( $tab['content'] ) ) ? $tab['content'] : '' );
						$_tabs .= '</div>';

				$_tabs .= '</li>';

			}
		}

		$_tabs .= '</ul></div>'; // End Tabs

		$_html = '<div class="' . $this->wrapper_class() . ' pwptabs-content-inside-tab">';
			// FJ: fix PHP notice $_cont not defined.
			$_html .= $_tabs; //( 'bottom' == $this->options['layout'] ) ? $_cont . $_tabs : $_tabs . $_cont;
		$_html .= '</div>';

		return $_html;
	}


	/**
	 * Returns all the wrapper classes
	 *
	 * @return string wrapper applicable classes
	 */
	public function wrapper_class() {
		// insert defult wrapper if wrapper class is empty
		$class = ! empty( $this->wrapper_class ) ? $this->wrapper_class : 'pwptabs-wrapper';

		// insert the layout as the an additional class
		$class .= isset( $this->options['layout'] ) && ! empty( $this->options['layout'] ) ? ' pwptabs-layout-' . $this->options['layout'] : '';

		return (string) esc_attr( $class );
	}



	/**
	 * get the content for the tab
	 *
	 * @param  string $content the content to insert
	 * @return string          the html for the content
	 */
	public function get_content( $content = '' ) {
		$_html = '<div class="pwptabs-content-inner">';

		if ( is_string( $content ) && ! empty( $content ) ) {
			$_html .= $content;
		}

		$_html .= '</div>';

		return $_html;
	}



	/**
	 * Returns the icon as image or FontAwesome icon
	 *
	 * Uses regexp to identify if the icon is an image or an fa icon or WP dashicon
	 *
	 * @param  string $icon img source or icon name to use.
	 *
	 * @return string       html for tab icon or empty string
	 */
	public function get_icon( $icon = '' ) {
		$_html = '';
		if ( ! empty( $icon ) ) {
			$_html = '<div class="pwptabs-tab-icon">';

			if ( preg_match( '/.*\.png|jpg|jpeg|gif/i', $icon, $match ) ) {

				$_html .= '<img src="' . esc_url( $icon ) . '" class="premise-responsive">';

			} elseif ( preg_match( '/^fa-/i', $icon, $match ) ) {

				$_html .= '<i class="fa ' . esc_attr( strtolower( $icon ) ) . '"></i>';

			} else {

				$_html .= '<span class="dashicons ' . esc_attr( $icon ) . '"></span>';
			}

			$_html .= '</div>';
		}
		return $_html;
	}



	/**
	 * Returns the title tab stripped
	 *
	 * @see Premise_Tabs::allowed_title_tags for a list allowed tags
	 *
	 * @param  string $title Title to strip tags from.
	 *
	 * @return string        title stripped.
	 */
	public function stripped_title( $title = '' ) {
		if ( ! empty( $title ) ) {

			return strip_tags( (string) $title, $this->allowed_title_tags );
		}

		return '';
	}



	/**
	 * parse our options with the params provided
	 *
	 * @param string $params options to control the tabs
	 */
	public function set_options( $params = '' ) {

		if ( is_string( $params ) ) {

			$this->options = wp_parse_args( array( 'layout' => $params ), $this->options_defaults );

		} elseif ( is_array( $params ) ) {

			$this->options = wp_parse_args( $params, $this->options_defaults );
		}
	}
}
}
