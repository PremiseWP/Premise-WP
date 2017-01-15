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
		wpMedia = $('.premise-wp-media-field, .premise-wp_media-field input'),
		faIcons = $('.premise-field-fa_icon-input, .premise-fa_icon-field input'),
		ytVideo = $('.premise-youtube-video');

		function premiseInit() {
			maybeBindElements();
			initPremiseExtensions();
		}

		function maybeBindElements() {
			// bind dynamic rows if used
			( dynamicRows.length )   ? dynamicRows.premiseDynamicColumns() : false;
			// bind premise same height elements
			( sameHeightEls.length ) ? premiseSameHeight() : false;
			// bind media preview if using media
			( wpMedia.length ) ? wpMedia.premiseFieldWpMedia() : false;
			// bind the fa icon fields
			( faIcons.length ) ? faIcons.premiseFieldFaIcon() : false;
			// bind the youtube videos
			( ytVideo.length ) ? ytVideo.premiseLoadYouTube() : false;
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