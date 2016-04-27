(function($){

	/**
	 * Bind WP Media uploader to an input field 
	 * 
	 * @param  {Object} options [description]
	 * @return {Object}         Node in context
	 */
	$.fn.premiseFieldWpMedia = function( options ) {

		if ( this.length === 0 ) {
			return this;
		}

		// Parse the default options
		var opts = $.extend( {}, $.fn.premiseFieldWpMedia.defaults, options );

		// support multiple elements
		if ( this.length > 1 ) {
			this.each( function() {
				$( this ).premiseFieldWpMedia( options );
			});
			return this;
		}

		// reference our element
		var el = this;

		var $el = $(el),
		field = $el.find('.premise-file-url'),
		btnUpload = $el.find('.premise-btn-upload'),
		btnDelete = $el.find('.premise-btn-remove'),
		uploader,
		mediaUploaded = [];

		// Initiate the plugin
		var init = function() {
			btnUpload.click(openUploader);
		}


		var openUploader = function() {
			// If the uploader object has already been created, open it
			if ( uploader ) {
				uploader.open();
				return;
			}

			// Extend the wp.media object
			uploader = wp.media.frames.file_frame = wp.media({
				title: 'Upload Media',
				button: {
					text: 'Insert Media'
				},
				multiple: opts.multiple
			});

			uploader.on('select', function() {

				// get array of attachment objects
				var attachment = uploader.state().get('selection').toJSON();

				mediaUploaded = [];
				// Loop through images selected and save them to our mediaUploaded var
				$(attachment).each(function(i, v){
					console.log(v);
					if ( 'id' === opts.return ) {
						mediaUploaded.push( v.id );
					}
					else if ( 'url' === opts.return ) {
						var url = ( 'image' == v.type ) ? v.sizes[opts.imageSize].url : v.url;
						mediaUploaded.push( url );
					}
				});

				handleFiles();
			});

			uploader.open();
		}


		var handleFiles = function() {
			field.val( mediaUploaded.join() );
		}

		init();

		return this;
	}

	// Defaults.
	$.fn.premiseFieldWpMedia.defaults = {
		multiple: false,
		imageSize: 'full',
		return: 'url',
	}

}(jQuery));