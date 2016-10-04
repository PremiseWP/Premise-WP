(function($){

	/**
	 * Display a google map on any page
	 *
	 * @see https://developers.google.com/maps/documentation/javascript/tutorial
	 *
	 * @param  {Object} options Options object to build the map.
	 * @return {Object}         Node in context
	 */
	$.fn.premiseGoogleMap = function( options ) {

		if ( this.length === 0 ) {
			return this;
		}

		// Parse the default options.
		var opts = $.extend( {}, $.fn.premiseGoogleMap.defaults, options );

		// Reference our element and global variables.
		var el = this,
		map,
		geocoder,
		markers = [];

		// Support multiple elements.
		if ( this.length > 1 ) {
			this.each( function() {
				$( this ).premiseGoogleMap( options );
			});
			return this;
		}

		/**
		 * Private Methods
		 */

		/**
		 * Initiate the plugin
		 *
		 * @return {void} Does not return anything
		 */
		var init = function() {
			el.css( 'min-height', opts.minHeight );
			if ( ! $.fn.premiseGoogleMap.APILoaded ) {
				loadAPI();
			} else {
				createMap();
			}
		},

		/**
		 * Load the api if it has not been loaded already and if we have a key
		 *
		 * @return {void} Does not return anything
		 */
		loadAPI = function() {
			if ( '' !== opts.key ) {
				// Load the gmaps api.
				var gmAPI  = document.createElement('script'),
				firstTag   = document.getElementsByTagName('script')[0];
				gmAPI.src  = "https://maps.googleapis.com/maps/api/js?key="; // Base URL.
				gmAPI.src += opts.key;                                       // API Key.
				gmAPI.src += "&callback=jQuery.fn.premiseGoogleMap.loadMap"; // The callback.

				firstTag.parentNode.insertBefore(gmAPI, firstTag);

				// Prevent it from being loaded again.
				$.fn.premiseGoogleMap.APILoaded = true;

			}
			else {
				console.error( 'premiseGoogleMap(): Please provide a Google Maps API Key.');
				return false;
			}
		},

		/**
		 * Creates the map given a center
		 *
		 * @return {void} Does not return anything.
		 */
		createMap = function() {
			if ( ! opts.center || '' === opts.center ) {
				console.error( 'premiseGoogleMap() - @param center is required.' );
				return false;
			}

			if ( ! geocoder ) {

				return false;
			}

			// Get lat and lng from center address.
			geocoder.geocode( { 'address': opts.center }, function( results, status ) {

				if ( status !== 'OK' ) {
					console.error( 'premiseGoogleMap() - Geocode was not successful for the following reason: ' + status );
					return false;
				}

				// Save the location if successful.
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
			});
		},

		/**
		 * Places a pin on the map
		 *
		 * @param  {marker} marker     The marker object.
		 * @param  {object} infowindow An infowindow object. Optional.
		 * @return {object}            Pin object.
		 */
		placeMarker = function( marker, infowindow ) {
			marker = ( 'object' === typeof marker ) ? marker : defaultMarker();

			infowindow = infowindow || false;

			if ( ! marker.map )      marker['map']      = map;
			if ( ! marker.position ) marker['position'] = el.location;

			if ( marker.animation && '' !== marker.animation )  marker.animation = google.maps.Animation[cleanUpAnimation( marker.animation )];

			var _pin = new google.maps.Marker( marker );

			// save a reference of all markers created
			markers.push( _pin );

			if ( infowindow ) attachInfowindow( infowindow, _pin );

			return _pin;
		},

		/**
		 * Add an infowindow to a marker
		 *
		 * @param  {object} infowindow The infowindow object. Refer to google maps docs.
		 * @param  {merker} marker     The marker obect already created.
		 * @return {void}              Adds infowindow to marker and binds click event on marker.
		 */
		attachInfowindow = function( infowindow, marker ) {
			infowindow = infowindow || {};
			marker     = marker || false;

			if ( marker && infowindow && ! $.isEmptyObject( infowindow ) ) {
				// Create the infowindow.
				var _window = new google.maps.InfoWindow( infowindow );

				// this opens the infowindow when the pin is clicked.
				google.maps.event.addListener( marker, 'click', function() {
				  	_window.open( map, marker );
				});

				return _window;
			}

			return false;
		},

		/**
		 * Returns a default marker to add to the center of the map
		 *
		 * @return {object} Marker object to use to create the marker.
		 */
		defaultMarker = function() {
			return {
				map:      map,
				position: el.location,
				title:    el.center
			};
		},

		/**
		 * Ensures the animation is in uppercase to work properly
		 *
		 * @param  {string} string A string in upper or lower case.
		 * @return {sring}         The same string in upper case if the string is equal to drop or bounce
		 */
		cleanUpAnimation = function( string ) {
			return ( 'drop' == string.toLowerCase() || 'bounce' == string.toLowerCase() ) ? string.toUpperCase() : '';
		};

		/**
		 * This function is called when the API has loaded on the DOM
		 *
		 * @return {void} Does not return anything
		 */
		$.fn.premiseGoogleMap.loadMap = function() {
			geocoder = new google.maps.Geocoder();
			createMap();
		};

		/**
		 * Public Methods
		 */

		/**
		 * Add a marker to a map
		 *
		 * @param {object} marker     The marker object. see google API docs for more details.
		 * @param {object} infowindow The infow window object if you want to add an infowindow.
		 */
		el.addMarker = function( marker, infowindow ) {
			marker = marker || {};
			var _pin = {};

			if ( 'object' !== typeof marker.position ) {
				// Get lat and lng from center address.
				geocoder.geocode( { 'address': marker.position }, function( results, status ) {
					if ( status === 'OK' ) {
						// Save the location if successful.
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

		el.getMarkers = function() {
			return markers;
		};

		// run our plugin
		init();

		return this;
	};

	/**
	 * APILoaded prevents the Google Maps API to load twice.
	 *
	 * True if the API has already loaded. False otherwise
	 *
	 * @type {Boolean}
	 */
	$.fn.premiseGoogleMap.APILoaded = false;

	/**
	 * Our plugin defaults
	 *
	 * @param {string}  key        Required. Google Maps API Key.
	 * @param {string}  center     Required. An address to use as the center of the map
	 * @param {mixed}   marker     Optional. Boolean value to display default marker or not. Object builds a custom marker.
	 * @param {object}  infowindow Optional. Object to build infowindow for marker
	 * @param {integer} zoom       Optional. Set the default zoom for the map.
	 * @param {integer} minHeight  Optional. Set the min-height for the map.
	 * @param {object}  onMapLoad  This callback is called right after tha map loads.
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
		onMapLoad:  function() { return true; }
	};

}(jQuery));
