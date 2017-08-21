/**
 * Load Premise WP core JS
 *
 * @package Premise WP
 * @subpackage JS
 */
jQuery(function($){

	$(document).ready(function(){

		var dynamicRows = $( '.premise-dynamic-row' ),
		sameHeightEls   = $( '.premise-same-height' ),
		ytVideo = $('.premise-youtube-video');

		function premiseInit() {
			maybeBindElements();
			initPremiseExtensions();
		}

		function maybeBindElements() {
			// bind the youtube videos
			( ytVideo.length ) ? ytVideo.premiseLoadYouTube() : false;
			// bind dynamic rows if used
			( dynamicRows.length )   ? dynamicRows.premiseDynamicColumns() : false;
			// bind premise same height elements
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