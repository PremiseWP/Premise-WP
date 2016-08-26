/**
 * Load Premise WP core JS
 *
 * @package Premise WP
 * @subpackage JS
 */
jQuery(function($){

	$(document).ready(function(){
		Premise.init();
	});

});



/**
 * Main Premise JS Object
 *
 * @type {Object}
 */
var Premise = {


	/**
	 * Initiate the main Premise Objcect
	 */
	init: function() {

		jQuery( '.premise-dynamic-row' ).premiseDynamicColumns();


		/**
		 * Initiate the Premise Field Object
		 */
		PremiseField.init();
	}
}