<?php
/**
 * Premise Library
 *
 * Premise Library holds Premise's global functions. These functions are used
 * throught the entire framework and are required for Premise's basic functionality
 * to work properly. This library cannot be excluded from Premise WP.
 *
 * @package Premise WP
 * @subpackage Library
 */

// Block direct access to this file.
defined( 'ABSPATH' ) or die();




/**
 * Get the value from any option, including options from a post or a user.
 *
 * This function allows you to retrieve options saved in the Wordpress database whether they
 * are saved within a post, a user profile or in the 'options' table. You can also retreive
 * options quickly by passing the 'name' attribute used on that particualr field. So if the
 * field's name attribute looks like this: <code>name="option[array1][array2]</code>, by simply
 * calling <code>premise_get_option( 'option[array1][array2]' )</code>, Premise WP will retrieve
 * the value saved in <code>[array2]</code>
 *
 * By passing a context param, you can tell the function where to look for the option. So if
 * you pass the <code>'context' => 'post'</code>, the function will look for the value using Wordpress' built
 * in <code>get_post_meta()</code>, instead of <code>get_option()</code>. At the same time
 * if you pass the <code>'context' => 'user'</code> the function will use <code>get_user_meta()</code> to retreive
 * the data you are looking for.
 *
 * The context param can be an array containing the post or user id and the single param used by
 * both <code>get_post_meta()</code> and <code>get_user_meta()</code>
 *
 * The following will retireve the value <samp>[array2]</samp>, from post ID 78:
 * <pre><code>premise_get_option( 'option[array1][array2]', array(
 * 	'context' => 'post',
 * 	'id'      => '78',
 * ) );
 * </code></pre>
 *
 * @see https://developer.wordpress.org/reference/functions/get_post_meta/ single param is the last param this function takes
 * @see https://developer.wordpress.org/reference/functions/get_user_meta/ single param is the last param this function takes
 *
 * @since 1.2 made it possible to search within posts and users as well as options
 *            This function was created as a helper for the PremiseField class.
 *
 * @param  string $name     name attribute for the field.
 * @param  mixed  $context  string with context. or array with context, id, and single params.
 *
 * @return mixed            Returns the value of the option, or false if nothing was found
 */
function premise_get_value( $name = '', $context = '' ) {

	$value = ''; // Start with a clean value.

	/**
	 * Get the name
	 *
	 * @var array
	 */
	$_name = premise_name_att_to_array( $name );

	// prepare the context
	$id = '';
	$context_type = esc_attr( $context );
	if ( is_array( $context ) ) {
		$context_type = ( isset( $context['context'] ) && ! empty( $context['context'] ) )
			? $context['context']
				: '';

		$id = ( isset( $context['id'] ) && ! empty( $context['id'] ) )
			? $context['id']
				: '';
	}

	/**
	 * Get the value based on the context_type if $context_type is not empty.
	 * Context can only be post or user.
	 */
	if ( empty( $context_type ) ) {

		$value = get_option( $_name[0] );

	} else {

		$value = 'post' == $context_type ? premise_get_post_meta( $id, $_name[0] ) : premise_get_user_meta( $id, $_name[0] );
	}

	/**
	 * If the second array from the name is not empty it means
	 * we have a multilevel value to retrieve. Check that value
	 * is an array as well just to make sure no errors happen.
	 */
	if ( ! empty( $_name[1] ) && is_array( $value ) ) {
		foreach ( $_name[1] as $k => $v ) {
			if ( array_key_exists( $v, (array) $value ) ) {

				$value = $value[ $v ];
			} else {
				// Like get_option(), return FALSE if no value.
				$value = false;
			}
		}
	}

	// Like get_option(), return FALSE if no value.
	return ! empty( $value ) || '0' == $value ? $value : false;
}




/**
 * Premise get Post meta
 *
 * Get_post_meta helper.
 *
 * @since 1.2 added for context param on PremiseField class.
 *
 * @see https://developer.wordpress.org/reference/functions/get_post_meta/
 *
 * @param  mixed   $post_id the post ID (int). if empty the current post ID will be used.
 * @param  mixed   $name    the name of the option to retrieve.
 * @param  boolean $single  whether to return a single value.
 *
 * @return mixed            Returns value from database
 */
function premise_get_post_meta( $post_id = '', $name = '', $single = true ) {

	if ( empty( $post_id ) ) {

		global $post;

		$post_id = $post->ID;
	}

	/**
	 * Get the results from the database
	 *
	 * @var mixed
	 */
	return get_post_meta( $post_id, $name, $single );
}




/**
 * Premise get User meta
 *
 * get_user_meta helper.
 *
 * @since 1.2 added for context param on PremiseField class.
 *
 * @see https://developer.wordpress.org/reference/functions/get_user_meta/
 *
 * @param  mixed   $user_id the user ID (int). if empty the current user ID will be used.
 * @param  mixed   $name    the name of the option to retrieve.
 * @param  boolean $single  whether to return a single value.
 *
 * @return mixed            Returns value from database
 */
function premise_get_user_meta( $user_id = '', $name = '', $single = true ) {

	if ( empty( $user_id ) ) {

		global $user;

		$user_id = $user->ID;
	}

	/**
	 * Get the results from the database
	 *
	 * @var mixed
	 */
	return get_user_meta( $user_id, $name, $single );
}




/**
 * Premise get Option
 *
 * Get options from wordpress with a little more control. This function lets you get values that are
 * saved within arrays by simply passing the name field string. i.e. premise_get_option( 'option[array1][array2]' )
 * which would output the value for array2 of 'option'.
 *
 * Alternatively, you can also pass the 'option' key as the first parameter and an array of keys to filter within the
 * 'option' array as the second parameter. i.e. premise_get_option( 'option', array( 'array1', 'array2' ) ). This would
 * output the same result as premise_get_option( 'option[array1][array2]' ).
 *
 * @since 1.2 uses premise_get_value. ability to submit an option string like option[array1][array2]
 *            to retrieve the value of array2. keys were used for this before.
 *
 * @param  mixed $option string of option or name field. array of options or name fields.
 * @param  array $key    deprecated. Use string i.e. 'option[array1][array2]' better.
 *
 * @return mixed         array of value, or single value, or false if nothing found
 */
function premise_get_option( $option = '', $key = '' ) {

	if ( empty( $option ) ) {

		return false;
	}

	if ( is_string( $option ) ) {

		if ( ! empty( $key ) ) {

			$_key = is_array( $key ) ? '[\'' . implode( '\'][\'', $key ) . '\']' : '[\'' . (string) $key . '\']';

			$option .= $_key;
		}

		return premise_get_value( $option );
	}

	if ( is_array( $option ) ) {

		$options = array();

		foreach ( $option as $opt ) {

			array_push( $options, premise_get_value( $opt ) );
		}

		return $options;
	}

	return false;
}




/**
 * Premise name to array
 *
 * Converts the name attribute of a field into an array. If the name attribute indicates the value
 * should be saved as an array i.e. 'my_option[array]', this function will return array( 'option', 'array' );
 *
 * @since 1.2
 *
 * @param  string $name the name attribute of a field to convert to an array.
 *
 * @return string       multilevel array with name attribute
 */
function premise_name_att_to_array( $name ) {

	$name_a = array(); // Name array.

	/**
	 * If values are stored in an array
	 */
	if ( preg_match( '/\[|\]/', $name ) ) {

		/**
		 * Turn html attribute name into an array of _keys
		 *
		 * From:
		 * name="my_option[key1][key2][key3]"
		 *
		 * To:
		 * array (size=2)
		 * 0 =>
		 *   array (size=4)
		 *     0 => string 'my_option[' (length=9)
		 *     1 => string 'key1]' (length=5)
		 *     2 => string 'key2]' (length=5)
		 *     3 => string 'key3]' (length=5)
		 * 1 =>
		 *   array (size=4)
		 *     0 => string 'my_option' (length=8)
		 *     1 => string 'key1' (length=4)
		 *     2 => string 'key2' (length=4)
		 *     3 => string 'key3' (length=4)
		 *
		 * @var array $_keys[1] has strings of _keys for each level of the array
		 *
		 * @since 1.2 RegExp that saves each level of array into array
		 *
		 * @var array
		 */
		preg_match_all( '/([0-9a-zA-Z].*?)[\[\]]/', $name, $_keys );

		/**
		 * Set the DB option name and unset it from the _keys array
		 *
		 * @var string
		 */
		$name_a[] = $_keys[1][0];
		unset( $_keys[1][0] );

		if ( ! empty( $_keys[1] ) ) {

			$name_a[] = $_keys[1];
		}
	} else {
		$name_a[] = esc_attr( $name );
	}

	return $name_a;
}




/**
 * Generate a random string
 *
 * Returns a random string with a set number of characters.
 * The string includes only letters and numbers at this point.
 *
 * @since 1.2             useful to generate randome strings, for nonces or other scenarios.
 *
 * @param  int $length number of characters to return in the string. defaults to 8.
 *
 * @return string         string with random characters
 */
function premise_rand_str( $length = '' ) {

	// Set default length if length is empty or not a number.
	$length = ! empty( $length ) && is_numeric( $length ) ? intval( $length ) : 8;

	// Start with empty string.
	$token = '';

	// Define chars to use in random string.
	$chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

	// Count chars and deduct one because we are counting from zero later.
	$num_chars = strlen( $chars ) - 1;

	// Generate random string.
	for ( $i = 0; $i < $length; $i++ ) {

		$pick   = mt_rand( 0, $num_chars );
		$char   = $chars[ $pick ];
		$token .= $char;
	}

	// Return random string.
	return esc_attr( $token );
}