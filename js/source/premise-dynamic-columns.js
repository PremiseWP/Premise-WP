(function($){

	/**
	 * Display dynamic columns
	 *
	 * This plugin will take all the direct children of an element and assign them column sizes
	 * based on the number of elements. It tries to set the least number of rows while attempting to
	 * set an even number of columns per row.
	 */
	$.fn.premiseDynamicColumns = function( options ) {

		if ( this.length === 0 ) {
			return this;
		}

		// as of now, we dont take any options
		var opts = $.extend( {}, $.fn.premiseDynamicColumns.defaults, options );

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

			if ( ! el.is ( '.premise-dynamic-row' ) ) el.addClass( 'premise-dynamic-row' );

			// set type of grid - row or inline
			( 'row' == opts.grid ) ? el.addClass( 'premise-row' ) : el.addClass( 'premise-inline' );

			var columns = [2,3,4,5,6],
			children = el.children(),
			childCount = 0,
			cols = 6;

			if ( children.length ) {
				childCount = children.length
				for (var i = columns.length - 1; i >= 0; i--) {
					// find the best column size to use
					if ( childCount % columns[i] === 0 ) {
						cols = columns[i];
						children.addClass( 'premise-dyn-col col'+cols );
						return;
					}
				}
				children.addClass( 'premise-dyn-col col'+cols );
			}
			return;
		}

		init();

		return this;
	}

	// Defaults.
	$.fn.premiseDynamicColumns.defaults = {
		grid: 'row', // row or inline grid
	}

}(jQuery));