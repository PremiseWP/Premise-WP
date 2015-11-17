# Premise WP Framework  

Premise WP is a Wordpress framework for developers who build themes and plugins. It allows you to quickly build options in the backend by doing the heavy lifting and repetitive tasks
for you. Premise WP also comes with a CSS framework readily available on both the backend and frontend that allows you to quickly build responsive markup.

To begin using Premise WP simply download and install the plugin, once you activate it you are all set! You can begin using it in your theme or plugin's code.

**Note:** If downloading from GitHub, rename the folder from `Premise-WP-master` to `Premise-WP` before installing.

---

### Make Premise WP required in your project

To ensure that your theme or plugin runs smoothly and without issues when your users install it, you may want to make Premise WP required by your project. This way, Wordpress will know
that without Premise WP installed and active things may break and it will notify the user to install it. For this functionality we make use of the [TGM Activation Plugin Class](https://github.com/TGMPA/TGM-Plugin-Activation).
To implement, copy and paste the code below into your project and edit `Path_To_TGM_Plugin_Activation_Class` and `my_unique_id`.

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

if ( !class_exists( 'Premise_WP' ) ) {

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

---

### Building options in the backend

To build options in the backend of Wordpress call `premise_field()` and pass it some arguments so it knows the type of form element you wish to use for your option. The function will
output the HTML for the field. The most common arguments you will use are listed in the examples below. The first argument, `text`, lets the function know what type of field you want to
create. *i.e.* _`text` will build an `input` field with attribute `type="text"`, `textarea` will build a `textarea` field._

The second argument is an array of options that builds your field and tells Premise how to treat it.

```php
/**
 * Build a text field
 * 
 * By assigning a 'name' attribute, Premise automatically fills in the id attribute
 * for the field and when the user saves the option, Premise automatically grabs the value
 * from the options table in the database.
 */
premise_field( 'text', array(
	'name' => 'my_option[in_an_array]'
) );

// The code above prints the following text field
<input type="text" name="my_option[in_an_array]" id="my_option-in_an_array">
```

If you want to add a custom field to a user profile or a post (supports pages and custom post types), simply pass a `context` parameter as part of the array of options.

```php
/**
 * Build a text field for a post
 * 
 * The context parameter lets Premise know if the field is meant for a user, post, or option.
 * default is option, so the context para is only required when on a post or user profile.
 */
premise_field( 'text', array(
	'name' => 'my_option[in_an_array]',
	'context' => 'post' // Grab value for current post
) );

// The code above prints the following text field
<input type="text" name="my_option[in_an_array]" id="my_option-in_an_array">
```

Here is a list of arguments
that you can pass and what each does.

```php
$defaults = array(
	/**
	 * Special Parameters
	 */
	'label'      => '',      // Wraps label element around field. uses id for for attribute if id not empty
	'tooltip'    => '',      // Adds a tooltip to field
	'add_filter' => array(), // Add filter(s) to this field. Read documentation for list of filters
	'context'    => '',      // Used to let Premise know where to retrieve values from ( post, user )
	/**
	 * Normal Parameters
	 */
	'name'       => '',      // name attribute. if empty fills from id
	'id'         => '',      // id attribute. if empty fills from name (if name not empty)
	'value'      => '',      // value attribute. if empty tries to get value from get_option(name) unless 'context' is post|user
	'value_att'  => '',      // value attribute. Used for checkboxes and radio to display the default vale="" attribute
	'default'    => '',      // if value is empty displays a default value
	'options'    => array(), // options for select fields in this format ( Text => Value )
	'attribute'  => '',      // html attributes to add to element i.e. onchange="doSomethingCool()"
);
```

**Important:** When creating radio fields make sure you pass an `id` attribute to each one of the fields. Otherwise,
the fields won't work poroperly.

---

### Building quick markup

Premise WP comes with a small yet powerful CSS framework that helps you build markup quickly. Here are some of the most common uses of the framework.

#### Columns

Columns are useful when creating a grid where all columns have equal widths. The example below adds 3 columns in a row. By assigning the class `premise-row` to 
the parent element, we let premise know that we are building a grid. 

```html
<div class="premise-row">
	<div class="col3">
		This column will occupy
		1/3 of it's parent element.
	</div>
	<div class="col3">
		This column will occupy
		1/3 of it's parent element.
	</div>
	<div class="col3">
		This column will occupy
		1/3 of it's parent element.
	</div>
</div>
```

You can also mix `col` classes this way..

```html
<div class="premise-row">
	<div class="col3">
		This column will occupy
		1/3 of it's parent element.
	</div>
	<div class="col3">
		This column will occupy
		1/3 of it's parent element.
	</div>
	<div class="col3">
		This column will occupy
		1/3 of it's parent element.
	</div>
	<div class="col2">
		This column will occupy
		1/2 of it's parent element.
	</div>
	<div class="col2">
		This column will occupy
		1/2 of it's parent element.
	</div>
</div>
```

The code above will produce one row that has 3 columns at the top and 2 at the bottom. Here is a list of all `col` classes:

Class  | Output                                     | 
---    | ---                                        | 
`col2` | 1 column with 1/2 the width of it's parent | 
`col3` | 1 column with 1/3 the width of it's parent | 
`col4` | 1 column with 1/4 the width of it's parent | 
`col5` | 1 column with 1/5 the width of it's parent | 
`col6` | 1 column with 1/6 the width of it's parent | 

**Responsive:** There are 2 breakpoints when it comes to the column grid. The first is at 1000px the second at 600px. In order to maintain
asthetics consistent on a site, the only `col` classes that change at 1000px are `col4` and `col6` - `col4` goes from 4 columns to 2 and `col6`
goes from 6 columns to 3. We don't change `col2`, `col3`, or `col5` at 1000px on purpose - for `col2` is too early and the other 2 cannot be eveny
divided. At 600px every `col` class, except `col6`, goes to 1 column stacked. `col6` goes to 2 columns.

#### Span Grid

To create grids that have different column widths use the class `span` instead of `col`. The number that comes after each `span` class represent the number of columns that element should occupy.
`span` grids are based on a 12 column grid where the `premise-row` element is broken down into 12 columns - _`span1` occupies 1 out of 12 columns, `span4` occupies 4 out of 12 columns, etc_.

```html
<div class="premise-row">
	<div class="span2">
		This column will occupy
		2/12 of it's parent element.
	</div>
	<div class="span2">
		This column will occupy
		2/12 of it's parent element.
	</div>
	<div class="span4">
		This column will occupy
		4/12 of it's parent element.
	</div>
	<div class="span1">
		This column will occupy
		1/12 of it's parent element.
	</div>
	<div class="span3">
		This column will occupy
		3/12 of it's parent element.
	</div>
</div>
```

Here is a list of all `span` classes available:

Class    | Output                        |
---      | ---                           |
`span1`  | Occupies 1 out of 12 columns  |
`span2`  | Occupies 2 out of 12 columns  |
`span3`  | Occupies 3 out of 12 columns  |
`span4`  | Occupies 4 out of 12 columns  |
`span5`  | Occupies 5 out of 12 columns  |
`span6`  | Occupies 6 out of 12 columns  |
`span7`  | Occupies 7 out of 12 columns  |
`span8`  | Occupies 8 out of 12 columns  |
`span9`  | Occupies 9 out of 12 columns  |
`span10` | Occupies 10 out of 12 columns |
`span11` | Occupies 11 out of 12 columns |
`span12` | Occupies 12 out of 12 columns |

#### Other useful classes

Premise's CSS framework also has a series of clases that are meant to speed up the way you apply commonly used CSS properties saving you time and KB since you have to write less CSS. All
of Premise's CSS classes are prefixed with `premise-` to avoid any conflicts with third party stylesheets. Here is a list of some useful classes that come in very handy!

Class                 | Output                                           |
---                   | ---                                              |
`.premise-responsive` | Add this class to an image to make it responsive |
`.premise-border-box` | Assigns `box-sizing:border-box;` to an element   |

For a full list of CSS classes available and the styles each assign take a look at the [source file](css/source/premise.css 'Premise WP core CSS file').

---

## Premise Hooks  

Premise includes a variety of hooks that you can use to change or customize the way Premise behaves in your project. Here is a list of hooks and a brief description of what each hook does.  

Hook                               | Type         | Description                                      |
---------                          | :----------: | ------------------                               |
`premise_field_label_html`         | Filter       | do hook for label html string                    |
`premise_field_raw_html`           | Filter       | filter the html for the field itself             |
`premise_field_html_after_wrapper` | Filter       | insert html after the field wrapper              |
`premise_field_html`               | Filter       | filter the html for the whole field              |
`premise_field_input`              | Filter       | filter the input field html                      |
`premise_field_textarea`           | Filter       | filter the textarea field html                   |
`premise_field_upload_btn`         | Filter       | filter the wp media upload button                |
`premise_field_remove_btn`         | Filter       | filter the wp media remove button                |
`premise_field_icon_insert_btn`    | Filter       | do filter for button to show fa icon             |
`premise_field_icon_remove_btn`    | Filter       | do filter for button to hide fa icon             |
`premise_field_section_html`       | Filter       | filter the field section html                    |
`premise_field_wrapper_class`      | Filter       | filter the classes passed to the wrapper element |
`premise_field_fa_icon_html`       | Trigger      | do filter for fa_icon field                      |
`premiseFieldAfterInit`            | Trigger      | do hook after PremiseField object inits          |
`premiseFieldAfterFaIconsOpen`     | Trigger      | do hook after icons box opens                    |
`premiseFieldAfterFaIconsClose`    | Trigger      | do hook after icons close                        |

===  

## Changelog  

#### 1.2  
* Updated `PremiseField` class. Made it simpler to create fields, added filters, added `video` field.
* Changed parameters for `premise_field()`. This function now takes a string as first param which makes it possible to create a field simpler e.g. `premise_field( 'text' )`.
* Added prefix `premise-` to all classes of Premise WP CSS Framework. Divided CSS into sections each in its own file.
* Started moving Premise WP JS into objects. Still a lot of work left here.