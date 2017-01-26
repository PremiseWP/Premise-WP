# Premise WP Framework

Build Wordpress themes and plugins faster! Premise WP simplifies the way you do things in the backend of Wordpress while reducing the steps that it takes to get something done.

* [Getting Started](#getting-started)
* Examples
* Uses Grunt
* Changelog

## Getting Started

To begin using Premise WP download and install the plugin in your Wordpress site. Once you activate Premise WP you will automatically have access to a variety of functions and classes that will make your life so much easier as a Wordpress Developer.

**Note:** This plugin does not display options or any sort of UI in the back end. When you activate Premise WP you will NOT see a menu or page in the backend for settings. Premise WP is simply a library of PHP, JS, CSS helpers for you to do things quicker within Wordpress.

It is helpful when using Premise WP to make sure the theme or plugin using it requires it or loads and activates it automatically. We make use of the [TGM Activation Plugin Class](https://github.com/TGMPA/TGM-Plugin-Activation) to accomplish this. Here is how to do it: Copy and paste the code below into your project and edit `Path_To_TGM_Plugin_Activation_Class` and `my_unique_id` with the path to the TGM_Plugin_Activation class and a unique id for your project.

```php
/**
 * Example taken from TGM-Plugin-Activation and modified for Premise WP
 *
 * This file represents an example of the code that themes and other plugins would use to register
 * Premise WP as a required plugin. This functionality requires the use of TGM-Plugin-Activation Class.
 *
 * @see  http://tgmpluginactivation.com/configuration/ for detailed documentation.
 *
 * @link https://github.com/TGMPA/TGM-Plugin-Activation
 */

if ( ! class_exists( 'Premise_WP' ) ) {

	/**
	 * Require the TGM_Plugin_Activation class.
	 */
	require_once Path_To_TGM_Plugin_Activation_Class;

	/**
	 * Register TGM_Plugin_Activation Hook
	 */
	add_action( 'tgmpa_register', 'my_theme_register_required_plugins' );

	/**
	 * This function is hooked into tgmpa_init, which is fired within the
	 * TGM_Plugin_Activation class constructor.
	 */
	function my_theme_register_required_plugins() {
		/*
		 * Array of plugin arrays. Required keys are name and slug.
		 * If the source is NOT from the .org repo, then source is also required.
		 */
		$plugins = array(

			// Make Premise WP required
			array(
				'name'               => 'Premise WP Plugin',                              // The plugin name.
				'slug'               => 'Premise-WP',                                     // The plugin slug (typically the folder name).
				'source'             => plugins_url('Premise-WP/plugins/Premise-WP.zip'), // The plugin source.
				'required'           => true,                                             // If false, the plugin is only 'recommended' instead of required.
				'version'            => '',                                               // E.g. 1.0.0. If set, the active plugin must be this version or higher. If the plugin version is higher than the plugin version installed, the user will be notified to update the plugin.
				'force_activation'   => false,                                            // If true, plugin is activated upon theme activation and cannot be deactivated until theme switch.
				'force_deactivation' => false,                                            // If true, plugin is deactivated upon theme switch, useful for theme-specific plugins.
				'external_url'       => '',                                               // If set, overrides default API URL and points to an external URL.
				'is_callable'        => '',                                               // If set, this callable will be be checked for availability to determine if a plugin is active.
			),

		);

		/*
		 * Array of configuration settings. Amend each line as needed.
		 */
		$config = array(
			'id'           => 'my_unique_id',      // Unique ID for hashing notices for multiple instances of TGMPA.
			'default_path' => '',                  // Default absolute path to bundled plugins.
			'menu'         => 'my_unique_id-slug', // Menu slug.
			'parent_slug'  => 'plugins.php',       // Parent menu slug.
			'capability'   => 'manage_options',    // Capability needed to view plugin install page, should be a capability associated with the parent menu used.
			'has_notices'  => true,                // Show admin notices or not.
			'dismissable'  => true,                // If false, a user cannot dismiss the nag message.
			'dismiss_msg'  => '',                  // If 'dismissable' is false, this message will be output at top of nag.
			'is_automatic' => false,               // Automatically activate plugins after installation or not.
			'message'      => '',                  // Message to output right before the plugins table.
		);

		tgmpa( $plugins, $config );
	}
}
```

## Examples

Here are some of the most common things you will use Premise WP for. Make sure to visit [premisewp.com](https://premisewp.com) for more information.

#### Building options in the backend

`pwp_field( $args = '', $echo = true )`

```php
// Build a text field
pwp_field( array(
	'type' => 'text',
	'name' => 'my_option[in_an_array]',
) );

#### Create an Admin Page

`new PWP_Admin_Page( $title = '', $fields = array(), $option_names = '' )`

```php
// let premise handle the page, you pass the fields
$fields = array(
	'name_prefix' => 'your_option_name', // this is your name attribute. It is prepended to the anem of each field
	array(
		'type' => 'text',
		'name' => '[your_text_field]',
		'label' => 'text',
	),
	array(
		'type' => 'textarea',
		'name' => '[your_textarea_field]',
		'label' => 'textarea',
	),
	array( 'type' => 'submit' ),
);
new PWP_Admin_Page( 'Your Title', $fields, $fields['name_prefix'] );

// Control the params that get passed to add_menu_page()
// your callback function is what controls what is displayed.
$admin_page = array(
	'title'      => 'Your Title',
	'menu_title' => 'Your Menu Title',
	'capability' => 'manage_options',
	'menu_slug'  => 'your_menu_slog',
	'callback'   => 'your_callback_here',
	'icon'       => '',
	'position'   => '59.2',
);

new PWP_Admin_Page( $admin_page, '', 'your_option_name' );
```

#### Add Meta Boxes to Any Post/Page

`pwp_add_metabox( $title = '', $post_type = '', $fields = '', $option_names = '' )`

```php
// add a metabox to posts, pages, and custom post type 'your_cpt'
// that has 4 fields a text, textarea, wp_media, and fa_icon
$fields = array(
	array(
		'type' => 'text',
		'name' => '[text]',
		'context' => 'post',
	),
	array(
		'type' => 'textarea',
		'name' => '[textarea]',
		'context' => 'post',
	),
	array(
		'type' => 'wp_media',
		'name' => '[wp_media]',
		'context' => 'post',
	),
	array(
		'type' => 'fa_icon',
		'name' => '[wp_media]',
		'context' => 'post',
	),
);
$fields['name_prefix']  = 'your_option_name';
pwp_add_metabox( 'MB Title', array( 'post', 'page', 'your_cpt' ), $fields, $fields['name_prefix'] );

// take full control over the metabox arguments using the title param
$metabox = array(
	'id' => 'your_id',
	'title' => 'Your Title',
	'callback' => 'your_callback',
	'screen' => array( 'post', 'page', 'your_cpt' ), // by including this here we can ommit it as the second param to pwp_add_metabox()
	'context' => 'advanced',
	'priority' => 'default',
	'callback_args' => '', // arguments to be passed to your callback if any
);
pwp_add_metabox( $metabox, '', '', 'your_option_name' );
```

#### Insert custom user fields

`new PWP_User_Fields( $args = array(), $option_names = '' )`

```php
// insert custom user fields
// this time, lets also add a condition that look sofr our class
// in case premise wp is not yet installed
if ( class_exists( 'PWP_User_fields' ) ) {
	new PWP_User_fields( array(
		'title' => 'The title for you section',
		'description' => 'This one is a little abvious.',
		'fields' => array(
			array(
				'type' => 'text',
				'name' => 'your_option_name[field-1]',
				'label' => 'Field 1',
				'context' => 'user', // This is importatnt. otherwose fields wont display value after being saved
			),
			array(
				'type' => 'text',
				'name' => 'your_option_name[field-2]',
				'label' => 'Field 2',
				'context' => 'user', // This is importatnt. otherwose fields wont display value after being saved
			),
			array(
				'type' => 'text',
				'name' => 'your_option_name[field-3]',
				'label' => 'Field 3',
				'context' => 'user', // This is importatnt. otherwose fields wont display value after being saved
			),
		),
	), 'your_option_name' );
}
```

## Grunt

Premise WP uses [Gruntjs.com](http://gruntjs.com/) to compile JS and CSS files. If you are not familiar with Grunt go [here](http://gruntjs.com/getting-started) to get started.

## Changelog

#### 2.0.0
* New `PWP_Field` Model - Builds the html element for the field and gets all necessary attributes (name, value, id, etc). It can build other html elements as well; although it is not the intended use for this class, it is a neat option to have.
* New `PWP_Metabox` Model - Adds a metabox to any post page or custom post type.
* New `PWP_Admin_Page` Model - Adds a menu page to the backend of Wordpress.
* New `PWP_Field_Controller` Controller - Extends PWP_Field. This acts as our customizer for the fields ceated by PWP_Field. It also lets us set custom fields and apply custom functionality to them, which is how we build fields types: wp_media, fa_icon, wp_color.
* New `PWP_Form` Controller - Although it does not extend PWP_Field, this class creates HTML forms. You can also use it without actually creating an HTML form (prints only the fields) which is helpful if you want to pass multiple fields to a single function instead of calling pwp_field for each one.
* New `PWP_User_Fields` Controller - Add custom fields into user profiles.
* New `pwp_field` function - Wrapper for PWP_Field
* New `pwp_form` function - Wrapper for PWP_Form
* New `pwp_add_metabox` function - Wrapper for PWP_Metabox
* Removed _includes_ directory. Calling includes from `Premise_WP::do_hooks()` now.
* Fixed not getting a value from `premise_get_value()` when passing param `'context' => 'user'`.
* `premise_field` is now a wrapper of `pwp_field` with backward compatibility for param `tooltip`.
* `premise_field_section` is now a wrapper for `pwp_form`.
* Added `pwp-` prefix to most global CSS classes.
* Reworked the HTML that is output when creating a field to output less markup with more flexibility over what's important.
* Updated CSS for fields.
* Updated CSS for Premise_Tabs.

#### 1.8.0
* New `premiseFieldDuplicate` jQuery plugin. Duplicate a field section.

#### 1.7.0
* New `premiseTabs` jQuery plugin to replace old one. This one can generate accordion tabs as well normal ones.
* Chnages to `Premise_Tabs` model, to match the classes and structure of the new jQuery plugin.
* Added styles for layout `wp-theme-options` to display tabs for theme options.

#### 1.6.2
* Set default class `premise-aspect-ratio` to be the same as `premise-aspect-ratio-16-9`.

#### 1.6.1
* FontAwesome icons version update.

#### 1.6.0
* New jQuery plugin `premiseGoogleMap` allows you to easily insert a google map on any page.

#### 1.5.1
* Added missing styles for classes `span5`, `span6`, `span7`, `span11` and `span12` on mobile.

#### 1.5.0
* Integrated `Premise_Tabs` into Premise WP. Plugin is now deprecated. Having one class in one separate plugin was not very efficient.

------------------------------------------

#### 1.4.11
* new jQuery plugin `premiseScroll` - create animations on scroll easily.

#### 1.4.10
* new jQuery plugin `premiseDynamicColumns` available to build dynamic grids based on number of columns. It is meant to optimize the number of rows while attempting to produc even columns per row.
* Added Readme file for CSS Framework. Also added new CSS classes `premise-aspect-ratio-1-1`, `premise-aspect-ratio-4-3`, `premise-aspect-ratio-16-9` to build elements that are proportionally responsive based on their aspect ratio of 1:1, 4:3, or 16:9 respectively.

#### 1.4.9
* new CSS class `premise-aspect-ratio` to create elements with aspect ratio of 1:1 4:3 or 16:9

#### 1.4.8
* Add Wistia support to `premise_output_video()`
* Updated CSS - responsive Premise Video (embed, ratio of 16:9)

#### 1.4.7
* Updated CSS - replaced old responsive styles on fluid grids. Added premise resets for editor. New premise scroller to ceate horiantal scrollers on the fly

#### 1.4.6
* Updated CSS Grids. - for more informatin see [premise.css](css/source/premise.css)

#### 1.4.5
* Updated `premiseFieldFaIcon` jQuery plugin and the class `PremiseField` so that the plugin can be called anywhere even when the field was not built by premise.

#### 1.4.4
* Updates to fa\_icon field CSS: Removed top arrow - created by applying pseudo elmenents :after & :before to the container. Changed icon list tiems class - item `premise-field-fa-icon-li` changed class from `span1` to `span2`. Other minor CSS changes.

#### 1.4.3
* Update to `premiseFieldWpMedia` jQuery plugin: Fixed issues with buttons not being binded properly.

#### 1.4.2
* Update to `premiseLoadYouTube` jQuery plugin: Passes the `player` object right after it is created rather than on the `onReady` callback. The `onReady` callback can be overwritten which will cause issues as the `player` object would not be parsed.

#### 1.4.1
* New `premiseLoadYouTube()` jQuery plugin to load youtube videos.
* Added Readme to JS folder to document the Premise WP Library.
* Updated `premise_output_video()` to use new `premiseLoadYouTube()` plugin.

#### 1.4.0
* Moved all functionality for the `fa_icon` field to be handled by a small jQuery plugin `premiseFieldFaIcon`.
The plugin is called on all elements with class `.premise-field-type-fa_icon` which is the unique class this field's wrapper gets.
* Moved all functionality for `wp_media` fields to be handled by a small jQuery plugin `premiseFieldWpMedia`. This allows you to insert the
`wp_media` functionality into any element in Wordpress. **NOTE** you must enqueue Wordpress Media Upploader for this plugin to work. Using [premise_field](/library/premise-field-library.php#L22)
will take care of this for you.
* Moved Global functions from `/js/source/premise-field.js` into new file `/js/source/premise-library.js`.
* Removed `premise-ajax.js`

------------------------------------------

#### 1.3.2
* Removed `premise-parallax.js`. This was a beta object that we added to create parallax animations.
Since then, we have built [premiseScroll](https://github.com/PremiseWP/premiseScroll), a jQuery plugin that allows you to easily
bind animations on scroll to any element in the DOM.
* Moved global JS functions to `premise-library.js`. This file will hold the global functions used throughout Premise WP.

#### 1.3.1
* Renamed `call_back` param to `callback` in `Premise_Options` class.
* The `callback` param now overrides the fields param. If a callback is provided, the fields argument will be ignored.

#### 1.3.0
* Added `premise_output_video()` function. Pass a Youtube or Vimeo ID / URL to embed the video.

#### 1.2.0
* Added `premise_tooltip()` function.
* Updated `PremiseField` class. Made it simpler to create fields, added filters, added `video` field.
* Changed parameters for `premise_field()`. This function now takes a string as first param which makes it possible to create a field simpler e.g. `premise_field( 'text' )`.
* Added prefix `premise-` to all classes of Premise WP CSS Framework. Divided CSS into sections each in its own file.
* Started moving Premise WP JS into objects. Still a lot of work left here.
