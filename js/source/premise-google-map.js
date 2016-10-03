(function($){

	/**
	 * Display a google map on any page
	 *
	 * @see https://developers.google.com/maps/documentation/javascript/tutorial
	 *
	 * @param  {Object} options options object to build the map
	 * @return {Object}         Node in context
	 */
	$.fn.premiseGoogleMap = function( options ) {

		if ( this.length === 0 ) {
			return this;
		}

		// Parse the default options
		var opts = $.extend( {}, $.fn.premiseGoogleMap.defaults, options );

		// reference our element and global variables
		var el = this,
		map,
		geocoder;

		// support multiple elements
		if ( this.length > 1 ) {
			this.each( function() {
				$( this ).premiseGoogleMap( options );
			});
			return this;
		}

		/*
			Private Methods
		 */

		/**
		 * Initiate the plugin
		 *
		 * @return {void} does not return anything
		 */
		var init = function() {
			console.log( opts.minHeight );
			el.css( 'min-height', opts.minHeight );
			( ! $.fn.premiseGoogleMap.APILoaded ) ? loadAPI() : createMap();
		},

		/**
		 * load the api if it has not been loaded already and if we have a key
		 *
		 * @return {void} does not return anything
		 */
		loadAPI = function() {
			if ( ! $.fn.premiseGoogleMap.APILoaded && '' !== opts.key ) {
				// load the gmaps api
				var gmAPI  = document.createElement('script'),
				firstTag   = document.getElementsByTagName('script')[0];
				gmAPI.src  = "https://maps.googleapis.com/maps/api/js?key="; // Base URL
				gmAPI.src += opts.key;                                       // API Key
				gmAPI.src += "&callback=jQuery.fn.premiseGoogleMap.loadMap";                       // The callback

				firstTag.parentNode.insertBefore(gmAPI, firstTag);

				// prevent it from being loaded again
				$.fn.premiseGoogleMap.APILoaded = true;

			}

			if ( ! opts.key.length ) {
				console.error( 'premiseGoogleMap(): Please provide a Google Maps API Key.');
				return false;
			}
		},

		/**
		 * creates the map given a center
		 *
		 * @return {void} does not return anything.
		 */
		createMap = function() {
			if ( opts.center && '' !== opts.center ) {
				// get lat and lng from center address
				geocoder.geocode( { 'address': opts.center }, function( results, status ) {
					if ( status === 'OK' ) {
						// save the location if successful
						el.location = results[0].geometry.location;

						map = new google.maps.Map( el[0], {
							center: el.location,
							zoom:   opts.zoom,
						} );

						if ( opts.marker ) {
							el.marker = placeMarker( opts.marker, opts.infowindow );
						}

						if ( 'function' === typeof opts.onMapLoad ) {
							opts.onMapLoad.call( el );
						}
					}
					else {
						console.error( 'premiseGoogleMap() - Geocode was not successful for the following reason: ' + status );
						return false;
					}
				});
			}
			else {
				console.error( 'premiseGoogleMap() - @param center is required.' );
				return false;
			}
		},

		/**
		 * Places a pin on the map
		 *
		 * @param  {marker} marker     the marker object
		 * @param  {object} infowindow an infowindow object. optional
		 * @return {object}            pin object.
		 */
		placeMarker = function( marker, infowindow ) {
			marker = ( 'object' === typeof marker ) ? marker : defaultMarker();

			infowindow = infowindow || false;

			if ( ! marker.map )      marker['map']      = map;
			if ( ! marker.position ) marker['position'] = el.location;

			if ( marker.animation && '' !== marker.animation )  marker.animation = google.maps.Animation[cleanUpAnimation( marker.animation )];

			var _pin = new google.maps.Marker( marker );

			if ( infowindow ) attachInfowindow( infowindow, _pin );

			return _pin;
		},

		/**
		 * Add an infowindow to a marker
		 *
		 * @param  {object} infowindow the infow window object. refer to google maps docs
		 * @param  {merker} marker     the marker obect alredy created.
		 * @return {void}              adds infow window to marker and bind click event on marker.
		 */
		attachInfowindow = function( infowindow, marker ) {
			infowindow = infowindow || {};
			marker     = marker || false;

			if ( marker && infowindow && ! $.isEmptyObject( infowindow ) ) {
				// create the infowindow
				var _window = new google.maps.InfoWindow( infowindow );

				// this opens the infowindow when the pin is clicked.
				marker.addListener('click', function() {
				  	_window.open( map, marker );
				});

				return _window;
			}

			return false;
		},

		/**
		 * returns a default marker to add to the center of the map
		 *
		 * @return {object} marer object to use to create the marker
		 */
		defaultMarker = function() {
			return {
				map:      map,
				position: el.location,
				title:    el.center,
			};
		},

		/**
		 * Ensures the animation is in uppercase to work properly
		 *
		 * @param  {string} string a string in upper or lower case.
		 * @return {sring}         the same string in upper case if the string is equal to drop or bounce
		 */
		cleanUpAnimation = function( string ) {
			return ( 'drop' == string.toLowerCase() || 'bounce' == string.toLowerCase() ) ? string.toUpperCase() : '';
		};

		/**
		 * ths function is called when the API has loaded on the DOM
		 *
		 * @return {void} does not return anything
		 */
		$.fn.premiseGoogleMap.loadMap = function() {
			geocoder = new google.maps.Geocoder();
			createMap();
		};

		/*
		 	Public Methods
		 */

		/**
		 * Add a marker to a map
		 *
		 * @param {object} marker     the marker object. see google API docs for more details
		 * @param {object} infowindow the infow window object if you want to add an infowindow
		 */
		el.addMarker = function( marker, infowindow ) {
			marker = marker || {};
			var _pin = {};

			if ( 'object' !== typeof marker.position ) {
				// get lat and lng from center address
				geocoder.geocode( { 'address': marker.position }, function( results, status ) {
					if ( status === 'OK' ) {
						// save the location if successful
						marker.position = results[0].geometry.location;
						_pin = placeMarker( marker, infowindow );
					}
					else {
						console.error( 'premiseGoogleMap() - Geocode was not successful for the following reason: ' + status );
						return false;
					}
				});
			}
			else {
				_pin = placeMarker( marker, infowindow );
			}

			return _pin;
		};

		// run our plugin
		init();

		return this;
	}

	/**
	 * APILoaded prevents the Google Maps API to load twice.
	 *
	 * True if the API has already loaded. False otherwise
	 *
	 * @type {Boolean}
	 */
	$.fn.premiseGoogleMap.APILoaded = false;

	/**
	 * our plugin defaults
	 *
	 * @param {string}  key        Required. Google Maps API Key.
	 * @param {string}  center     Required. An address to use as the center of the map
	 * @param {mixed}   marker     Optional. Boolean value to display default marker or not. Object builds a custom marker.
	 * @param {object}  infowindow Optional. Object to build infowindow for marker
	 * @param {integer} zoom       Optional. Set the default zoom for the map.
	 * @param {integer} minHeight  Optional. Set the min-height for the map.
	 * @param {object}  onMapLoad  this callback is called right after tha map loads.
	 *
	 * @type {Object}
	 */
	$.fn.premiseGoogleMap.defaults = {
		center:     '',
		marker:     true,
		infowindow: {},
		key:        '',
		zoom:       15,
		minHeight:  300,
		onMapLoad:  function() { return true; },
	}

}(jQuery));