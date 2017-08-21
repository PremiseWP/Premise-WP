/**
 * Premise Field JS
 *
 * PremiseField object is required for Premise WP fields to work properly
 * but it is not required for Premise WP core functionality.
 *
 * @since 1.2
 *
 * @package Premise WP
 * @subpackage JS / PremiseField
 */



/**
 * PremiseField
 *
 * Holds properties and methods needed for all premise fields.
 *
 * @type {Object}
 */
var PremiseField = {

	/**
	 * Initiate the PremiseField object
	 *
	 * Constructs our object. Will eventually instantiate certain objects
	 * based on the fields being used.
	 *
	 * @return {void}
	 */
	init: function() {

		this.wpMedia         = jQuery( '.premise-wp-media-field, .premise-wp_media-field input' );
		this.wpColor         = jQuery(  '.premise-wp_color-field input' );
		this.faIcons         = jQuery( '.premise-field-fa_icon-input, .premise-fa_icon-field input' );
		this.duplicateFields = jQuery( '.pwp-duplicate-fields' );

		// bind media preview if using media
		( this.wpMedia.length )         ? this.wpMedia.premiseFieldWpMedia()           : false;
		// bind wp color picker
		( this.wpColor.length )         ? this.wpColor.wpColorPicker()                 : false;
		// bind the fa icon fields
		( this.faIcons.length )         ? this.faIcons.premiseFieldFaIcon()            : false;
		// bind the fa icon fields
		( this.duplicateFields.length ) ? this.duplicateFields.premiseFieldDuplicate() : false;

		/**
		 * premiseFieldAfterInit
		 *
		 * @premise-hook premiseFieldAfterInit do hook after PremiseField object inits
		 *
		 * @since 1.2
		 *
		 * @param {object} this passes the object as parameter
		 */
		jQuery(document).trigger('premiseFieldAfterInit', this);
	},


};