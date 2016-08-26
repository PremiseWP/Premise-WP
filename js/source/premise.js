/**
 * Load Premise WP core JS
 *
 * @package Premise WP
 * @subpackage JS
 */
jQuery(function($){

	$(document).ready(function(){

		var dynamicRows = $( '.premise-dynamic-row' ),
		sameHeightEls   = $( '.premise-same-height' );

		function premiseInit() {
			maybeBindElements();
			initPremiseExtensions();
		}

		function maybeBindElements() {
			( dynamicRows.length ) ? dynamicRows.premiseDynamicColumns() : false;
			( sameHeightEls.length ) ? premiseSameHeight() : false;
		}

		function initPremiseExtensions() {
			/**
			 * Initiate the Premise Field Object
			 */
			PremiseField.init();
		}

		premiseInit();
	});
});