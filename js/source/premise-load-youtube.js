(function($){

	/**
	 * Load a YouTube video
	 * 
	 * @param  {Object} options options object to build a youtube player
	 * @return {Object}         Node in context
	 */
	$.fn.premiseLoadYouTube = function( options ) {

		if ( this.length === 0 ) {
			return this;
		}

		// Parse the default options
		var opts = $.extend( {}, $.fn.premiseLoadYouTube.defaults, options );

		// reference our element and global variables
		var el = this,
		player;

		// support multiple elements
		if ( this.length > 1 ) {
			this.each( function() {
				$( this ).premiseLoadYouTube( options );
			});
			return this;
		}

		// Initiate the plugin
		var init = function() {
			// build plugin options
			buildOptions();
			// build player if YT API exists, otherwise load YT API first
			( 'undefined' === typeof YT ) ? loadAPI() : buildPlayer();
		}

		// Build Plugin options and validate them
		var buildOptions = function() {
			// if video ID was not passed in options, get it form the element
			if ( 0 === opts.videoId.length ) {
				if ( '' !== el.attr( 'data-video-id' ) ) {
					opts.videoId = el.attr( 'data-video-id' );
				}
				else {
					console.error( 'premiseLoadYouTube a valid videoID is required.' );
					return false;
				}
			}

			// Parse quick options 
			opts.playerVars.autoplay = opts.playerVars.autoplay || opts.autoplay;
			opts.playerVars.playlist = opts.playerVars.playlist || opts.playlist;
			opts.playerVars.loop     = opts.playerVars.loop     || opts.loop;
			
			// if loop option is true, make sure our video/s is/are passed as a playlist
			if ( opts.playerVars.loop && ( 0 === opts.playerVars.playlist.length ) ) {
				opts.playerVars.playlist = [opts.videoId];
			}

			opts.events.onReady = opts.events.onReady || ready;
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

		// on player ready
		var ready = function() {
			// set the volume 
			if ( -1 !== opts.volume ) player.setVolume( opts.volume );

			// mute if mute option is true
			if ( opts.mute ) player.mute();

			// pass the player as part of our object
			el.player = player;

			// log that this function ran.
			console.log( 'premiseLoadYouTube Player Ready' );
		}

		init();

		return this;
	}

	// Defaults.
	$.fn.premiseLoadYouTube.defaults = {
		videoId: [],
		height: '390', 
		width: '640', 
		playerVars: {}, 
		events: {
			// onReady: $.fn.premiseLoadYouTube.ready,
		}, 
		// quick options - for commonly used settings
		autoplay: 0,
		loop: 0,
		playlist: [], 
		mute: false,
		volume: -1,
	}

}(jQuery));