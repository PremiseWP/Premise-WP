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

		this.bindEvents();

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




	/**
	 * Bind Events needed for Fields to work properly
	 *
	 * @return {void} Binds events
	 */
	bindEvents: function() {

		// bind media preview if using media
		jQuery('.premise-wp-media-field').premiseFieldWpMedia();

		// bind the fa icon fields
		jQuery('.premise-field-type-fa_icon').premiseFieldFaIcon();

		// Bind success message
		jQuery(document).on('premiseFieldAfterInit', function(){console.log('PremiseField Object Initited successfully.');});
	},


};