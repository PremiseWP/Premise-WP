(function($){

	/**
	 * Insert a YouTube video
	 * 
	 * @param  {Object} options options object to build a youtube player
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

		opts.playerVars.autoplay = opts.playerVars.autoplay || opts.autoplay;
		opts.playerVars.playlist = opts.playerVars.playlist || opts.playlist;
		opts.playerVars.loop     = opts.playerVars.loop     || opts.loop;

		// Initiate the plugin
		var init = function() {
			( 'undefined' === typeof YT ) ? loadAPI() : buildPlayer();
		}

		// build the player if YT object exists
		var buildPlayer = function() {
			player = new YT.Player( el[0], {
				height: opts.height,
				width: opts.width,
				videoId: opts.videoId,
				playerVars: opts.playerVars, 
				events: opts.events,
			});

			( -1 !== opts.volume ) ? player.setVolume( opts.volume ) : console.log(false);
		}

		// load the youtube API asynchronously
		var loadAPI = function() {
			// bind youtube api ready function
			window.onYouTubeIframeAPIReady = buildPlayer;
			// create API script
			var tag = document.createElement("script");
			tag.src = "https://www.youtube.com/iframe_api";
			// Load API code asynchronously
			var firstScriptTag = document.getElementsByTagName("script")[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		}

		init();

		return this;
	}

	// on player ready
	$.fn.premiseFieldYouTube.ready = function() {
		console.log( 'premiseFieldYouTube Player Ready' );
		player.setVolume( opts.volume );
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
		// quick options - for commonly used options
		autoplay: 0,
		loop: 0,
		playlist: [], 
		mute: false,
		volume: -1,
	}

}(jQuery));