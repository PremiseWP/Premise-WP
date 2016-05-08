(function($){

	/**
	 * Insert a YouTube video
	 * 
	 * @param  {Object} options [description]
	 * @return {Object}         Node in context
	 */
	$.fn.premiseFieldYouTube = function( options ) {

		if ( this.length === 0 ) {
			return this;
		}

		// Parse the default options
		var opts = $.extend( {}, $.fn.premiseFieldYouTube.defaults, options );

		// reference our element and global variables
		var el = this,
		player;

		// support multiple elements
		if ( this.length > 1 ) {
			this.each( function() {
				$( this ).premiseFieldYouTube( options );
			});
			return this;
		}

		opts.videoId = ( opts.videoId.length ) ? opts.videoId : el.attr( 'data-premise-youtube-video-id' );

		// opts.playerVars.autoplay
		// opts.playerVars.playlist
		// opts.playerVars.loop

		// Initiate the plugin
		var init = function() {
			player = new YT.Player( el[0], {
				height: opts.height,
				width: opts.width,
				videoId: opts.videoId,
				playerVars: opts.playerVars, //{ 'autoplay': 1, 'playlist': [id], 'loop': 1 }
				events: opts.events,
			});
		}

		// on player ready
		var ready = function() {
			console.log( 'ready' );
		}

		init();

		return this;
	}

	// Defaults.
	$.fn.premiseFieldYouTube.defaults = {
		videoId: [],
		height: '390', 
		width: '640', 
		playerVars: {}, 
		events: {
			onReady: $.fn.premiseFieldYouTube.ready,
		}, 

		autoplay: 1,
		loop: 1,
		playlist: [], 
	}

}(jQuery));