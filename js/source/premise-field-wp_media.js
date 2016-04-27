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
		field,
		btnUpload,
		btnDelete,
		uploader,
		mediaUploaded = [];

		// Initiate the plugin
		var init = function() {

			// if the plugin was called directly on to an input element
			if ( $el.is( 'input[type="text"]' ) ) {
				field = $el;

				$el.addClass('premise-file-url');

				if ( ! btnDelete ) {
					btnDelete = $('<a class="premise-btn-remove" href="javascript:void(0);"><i class="fa fa-fw fa-times"></i></a>');
					field[0].parentNode.insertBefore( btnDelete[0], field[0].nextSibling );
				}

				if ( ! btnUpload ) {
					btnUpload = $('<a class="premise-btn-upload" href="javascript:void(0);"><i class="fa fa-fw fa-upload"></i></a>');
					field[0].parentNode.insertBefore( btnUpload[0], field[0].nextSibling );
				}
			}
			else {
				field = $el.find('.premise-file-url');
				btnUpload = $el.find('.premise-btn-upload').length;
				btnDelete = $el.find('.premise-btn-remove').length;
			}
			
			// Bind upload button
			btnUpload.click(openUploader);

			// Bind delete button
			btnDelete.click(clearField);
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
						// include image subtype in logic. Some file types such as SVG may be of type image and throw an error, since there is no sizes.
						var url = ( 'image' == v.type && v.subtype.match(/(jpg|png|gif|jpeg)/gi) ) ? v.sizes[opts.imageSize].url : v.url;
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


		var clearField = function() {
			field.val('');
			return false;
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