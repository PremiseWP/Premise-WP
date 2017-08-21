(function($){

	/**
	 * Display a google map on any page
	 *
	 * @see https://developers.google.com/maps/documentation/javascript/tutorial
	 *
	 * @param  {Object} options Options object to build the map.
	 * @return {Object}         Node in context
	 */
	$.fn.roamiGmap = function( options ) {

		if ( this.length === 0 ) {
			return this;
		}

		// Parse the default options.
		var opts = $.extend( {}, $.fn.roamiGmap.defaults, options );

		// Load the api if it has not been loaded already and if we have a key
		if ( ! $.fn.roamiGmap.APILoaded && '' !== opts.key ) {
			// Load the gmaps api.
			var gmAPI  = document.createElement('script'),
			firstTag   = document.getElementsByTagName('script')[0];
			gmAPI.src  = "https://maps.googleapis.com/maps/api/js?key="; // Base URL.
			gmAPI.src += opts.key;                                       // API Key.
			gmAPI.src += "&libraries=places&callback=jQuery.fn.roamiGmap.gmapsAPILoaded"; // The callback.

			firstTag.parentNode.insertBefore(gmAPI, firstTag);

			// Prevent it from being loaded again.
			$.fn.roamiGmap.APILoaded = true;
		}

		// Reference our element and global variables.
		var el = this,
		map,
		geocoder,
		places,
		markers = [];

		/**
		 * Private Methods
		 */

		/**
		 * Initiate the plugin
		 *
		 * @return {void} Does not return anything
		 */
		var init = function() {
			// check for api key
			if ( ! opts.key.length ) {
				console.error( 'roamiGmap(): Please provide a Google Maps API Key.');
				return false;
			}
			else {
				// bind map creation when api has loaded
				// must bind on document so that multiple maps
				// can be aware of this event.
				$(document).on( 'apiHasLoaded', createMap );
				// set the min height for our element.
				el.css( 'min-height', opts.minHeight );
			}
		},

		/**
		 * Creates the map given a center
		 *
		 * @return {void} Does not return anything.
		 */
		createMap = function() {

			if (!geocoder) {
				geocoder = new google.maps.Geocoder();
				if (!geocoder) {
					console.error( 'roamiGmap() - could not build the Geocoder object.' );
					return false;
				}
			}

			if ( ! opts.center || '' === opts.center ) {
				console.error( 'roamiGmap() - @param center is required.' );
				return false;
			}

			// Get lat and lng from center address.
			geocoder.geocode( { 'address': opts.center }, function( results, status ) {

				if ( status !== 'OK' ) {
					console.error( 'roamiGmap() - Geocode was not successful for the following reason: ' + status );
					return false;
				}
				else {
					// Save the location for our center
					el.location = results[0].geometry.location;

					var mapOpts = $.extend( {}, {
						center: el.location,
						zoom:   opts.zoom,
					}, opts.mapOptions );

					map = new google.maps.Map( el[0], mapOpts );

					// buid el
					el.gmap       = map;
					el.marker     = ( opts.marker ) ? placeMarker( opts.marker ) : opts.marker;
					el.infowindow = attachInfowindow( opts.infowindow, el.marker );

					// if onMapLoad is a function, call it
					if ( 'function' === typeof opts.onMapLoad ) {
						opts.onMapLoad.call( el );
					}
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

			if ( ! marker.map )      marker['map']      = map;
			if ( ! marker.position ) marker['position'] = el.location;

			if ( marker.animation && '' !== marker.animation )  marker.animation = google.maps.Animation[cleanUpAnimation( marker.animation )];

			var _pin = new google.maps.Marker( marker ),
			_window;

			// save a reference of all markers created
			markers.push( _pin );

			if ( infowindow ) {
				_window = attachInfowindow( infowindow, _pin );
				return { marker: _pin, infowindow: _window };
			}
			else {
				return _pin;
			}
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
			marker     = marker     || false;

			if ( marker && infowindow && ! $.isEmptyObject( infowindow ) ) {
				// Create the infowindow.
				var _window = new google.maps.InfoWindow( infowindow );

				// Bind infowindow if opts.bindInfowindow = true
				if ( opts.bindInfowindow ) {

					// this opens the infowindow when the pin is clicked.
					google.maps.event.addListener( marker, 'click', function() {
						if(opts.autoCloseInfowindow) {
							if (el.infowindows.length) {
								for (var i = el.infowindows.length - 1; i >= 0; i--) {
									if(el.infowindows[i].map) {
										el.infowindows[i].close();
									}
								}
							}
						}
					  _window.open( map, marker );
					});
				}

				if (!el.infowindows || !el.infowindows.length) {
					el.infowindows = [_window];
				}
				else {
					el.infowindows.push(_window);
				}
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
						console.error( 'roamiGmap() - Geocode was not successful for the following reason: ' + status );
						return false;
					}
				});
			}
			else {
				_pin = placeMarker( marker, infowindow );
			}
			// return marker object
			return _pin;
		};

		/**
		 * returns all the markers in an arrray
		 *
		 * @return {array} all markers in a map
		 */
		el.getMarkers = function() {
			return markers;
		};

		/**
		 * Search for places within a map
		 *
		 * @see nearbySearch documentation for more information -
		 * @url https://developers.google.com/maps/documentation/javascript/places#place_search_requests
		 *
		 * @param  {Object}   options  the options for your search.
		 * @param  {Function} callback a callback function to handle results of the search.
		 * @return {void}              does not return anything
		 */
		el.searchPlaces = function( options, callback ) {
			options = options || {};
			// set a default callback if none was passed
			if ('function' !== typeof callback) {
				callback = function(results, status) {
					if (status === google.maps.places.PlacesServiceStatus.OK) {
	          for (var i = 0; i < results.length; i++) {
	          	// console.log(results[i])
	          	// build infowindow HTML
	          	var _iw = '<h4>'+results[i].name+'</h4>';
	          	_iw += (results[i].opening_hours && results[i].opening_hours.open_now)
	          		? '<p>Opened.</p>'
	          		: '<p>Closed.</p>';
	          	// TODO: fix issue with getUrl function to display images
	          	// if (results[i].photos && results[i].photos.length) {
	          	// 	var _imgUrl = results[i].photos[0].getUrl();
	          	// 	_iw += '<img src="'+_imgUrl+'" width="200" height="100" />';
	          	// }

	          	el.addMarker({
	          		position: results[i].geometry.location
	          	},
	          	{
	          		content: _iw,
	          	});
	          }
	        }
				};
			}
			// some basic options that if not provided, we can set
			options.location = options.location || this.location;
			options.radius   = options.radius || 500;
			options.type     = options.type || [];
			// instantiate places and perform search.
			// Build places only once
			if (!places) {
				places = new google.maps.places.PlacesService( el.gmap );
				if (!places) {
					console.error( 'roamiGmap() - could not build the Places object.' );
					return false;
				}
			}
			// search
			places.nearbySearch(options, callback);
		}

		/**
		 * This function is called when the Google Maps Javascript API has loaded. It is made public so that we can use it as the callback on API load.
		 *
		 * @return {void} Does not return anything
		 */
		$.fn.roamiGmap.gmapsAPILoaded = function() {
			$(document).trigger( 'apiHasLoaded' );
			console.log( 'Google API Has Loaded.' );
		};

		/* Run our code */

		if ( 1 < this.length ) {
			$(this).each( function() {
				$(this).roamiGmap( options );
			});
		}

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
	$.fn.roamiGmap.APILoaded = false;

	/**
	 * Our plugin defaults
	 *
	 * @param {string}  key        Required. Google Maps API Key.
	 * @param {string}  center     Required. An address to use as the center of the map. Can be an address, place, or lat,lng coordinates. Must be a string
	 * @param {mixed}   marker     Optional. Boolean value to display default marker or not. Object builds a custom marker. Defaults to true
	 * @param {object}  infowindow Optional. Object to build infowindow for marker
	 * @param {Boolean} autoCloseInfowindow Optional. Whether to close the last opened infowindow before another one is opened. Defaults to true.
	 * @param {mixed}   infowindows Holds an array of infowindows added by the attachInfowindow private method. This is documented here for reference. For example you can call this variable to handle infowindows added via a search.
	 * @param {integer} zoom       Optional. Set the default zoom for the map. Defaults to 15
	 * @param {integer} minHeight  Optional. Set the min-height for the map. Defaults to 300
	 * @param {boolean} bindInfowindow Whether to bind the infowindow open and close action. If false, you can control this.
	 * @param {Object} mapOptions all other map options that you can pass to Google Map Javascript API when creating a `new google.maps.Map(el, options)`. https://developers.google.com/maps/documentation/javascript/3.exp/reference#MapOptions
	 * @param {object}  onMapLoad  This is called right after tha map loads. `this` is set to the map object that just loaded. Makes it easy to do things like: `this.getMarkers()`. Useful to bind a search or other functionality that depend son the map being loaded.
	 *
	 * @type {Object}
	 */
	$.fn.roamiGmap.defaults = {
		center         : '',
		marker         : true,
		infowindow     : {},
		autoCloseInfowindow: true,
		infowindows: false,
		key            : '',
		zoom           : 15,
		minHeight      : 300,
		bindInfowindow : true,
		mapOptions: {},
		onMapLoad      : function() { return true; }
	};

})(jQuery);