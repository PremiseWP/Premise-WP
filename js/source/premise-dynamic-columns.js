(function($){

	/**
	 * Display dynamic columns
	 */
	$.fn.premiseDynamicColumns = function( options ) {

		if ( this.length === 0 ) {
			return this;
		}

		// as of now, we dont take any options
		// var opts = $.extend( {}, $.fn.premiseDynamicColumns.defaults, options );

		// reference our element
		var el = this;

		// support multiple elements
		if ( this.length > 1 ) {
			this.each( function() {
				$( this ).premiseDynamicColumns( options );
			});
			return this;
		}

		// Initiate the plugin
		var init = function() {

		}

		init();

		return this;
	}

	// Defaults.no defaults for now
	$.fn.premiseDynamicColumns.defaults = {}

}(jQuery));