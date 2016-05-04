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
		 * This code loads the IFrame Player API code asynchronously.
		 */
		var tag = document.createElement("script");
		tag.src = "https://www.youtube.com/iframe_api";

		var firstScriptTag = document.getElementsByTagName("script")[0];

		var tag2 = document.createElement("script");
		tag2.innerHTML = 'function onYouTubeIframeAPIReady(){return ( jQuery( \'.premise-youtube-video\' ).length ) ? PremiseField.YTPlayer.init() : false;}';

		firstScriptTag.parentNode.insertBefore(tag2, firstScriptTag);
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


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

		jQuery('.premise-field-type-fa_icon').premiseFieldFaIcon();

		// Bind success message
		jQuery(document).on('premiseFieldAfterInit', function(){console.log('PremiseField Object Initited successfully.');});
	},


};



/**
 * YouTube JS
 *
 * @package Premise-WP
 */

PremiseField.YTPlayer = {

	init: function() {
		(function($){
			PremiseField.YTPlayer.initPlayer($, YT);
		}(jQuery));
	},


	initPlayer: function($) {
		console.log('YT run !');
		var ytVideos = $('.premise-youtube-video');

		// Begin YouTube Player when needed
		if ( ytVideos.length > 0 ) {

			ytVideos.each(function(i,v){
				var videoId = $(this).attr('data-premise-youtube-video-id'),

				player = new YT.Player( $(this).attr('id'), {
					height: $(this).css('height'),
					width: $(this).css('width'),
					videoId: videoId,
					playerVars: { 'autoplay': 1, 'playlist': [videoId] },
					events: {
						'onReady': PremiseField.YTPlayer.playerReady,
						'onStateChange': ''
					}
				});
				
				player.setLoop = true;
			});
		}
	},


	playerReady: function( event ) {
	  event.target.setVolume(0);
	}
};



/**
 * On Youtube iframe API ready.
 *
 * @link https://developers.google.com/youtube/iframe_api_reference
 *
 * @see premise_video_output()
 */
function onYouTubeIframeAPIReady() {
	console.log('api ready');
}