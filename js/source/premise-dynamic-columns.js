(function($){

	/**
	 * Display dynamic columns
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

			( 'row' == opts.grid ) ? el.addClass( 'premise-row' ) : el.addClass( 'premise-inline' );

			var columns = [2,3,4,5,6],
			children = el.children(),
			childCount = 0,
			cols = 6;

			if ( children.length ) {

				childCount = children.length
				console.log( childCount );
				for (var i = columns.length - 1; i >= 0; i--) {
					// if ( 6 > columns ) return false;
					console.log( columns[i] );
					if ( childCount % columns[i] === 0 ) {
						cols = columns[i];
						children.addClass( 'premise-dyn-col col'+cols );
						return false;
					}
				}

			}


		}

		init();

		return this;
	}

	// Defaults. no defaults for now
	$.fn.premiseDynamicColumns.defaults = {
		grid: 'row',
	}

}(jQuery));