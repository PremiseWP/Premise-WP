/**
 * YouTube JS
 *
 * @package Premise-WP
 */

var PremiseYouTubePlayer = {

	init: function($, YT) {
		console.log('YT run!');
		var ytVideos = $('.premise-youtube-video');

		// Begin YouTube Player when needed
		if ( ytVideos.length > 0 ) {

			ytVideos.each(function(i,v){
				var videoId = $(this).attr('data-premise-youtube-video-id');

				new YT.Player( $(this).attr('id'), {
					height: $(this).css('height'),
					width: $(this).css('width'),
					videoId: videoId,
					/*events: {
						'onReady': '',
						'onStateChange': ''
					}*/
				});
			});
		}
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
	(function($){
		PremiseYouTubePlayer.init($, YT);
	})(jQuery);
}