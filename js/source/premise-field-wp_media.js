(function($){

	/**
	 * Bind WP Media uploader to an input field
	 *
	 * @param  {Object} options [description]
	 * @return {Object}         Node in context
	 */
	$.fn.premiseFieldWpMedia = function( options ) {
console.log( 'ran' );
		if ( this.length === 0 ) {
			return this;
		}

		// Parse the default options
		var opts = $.extend( {}, $.fn.premiseFieldWpMedia.defaults, options );

		// reference our element
		var el = this;

		// reference all our global variables
		var $el = $(el),
		wrapper,
		btnUpload,
		btnDelete,
		uploader,
		mediaUploaded = [];

		// support multiple elements
		if ( this.length > 1 ) {
			this.each( function() {
				$( this ).premiseFieldWpMedia( options );
			});
			return this;
		}

		// Initiate the plugin
		var init = function() {
			// check that we have the correct type of element
			if ( ! $el.is( 'input[type="text"]' ) ) {
				console.error( 'premiseFieldWpMedia() must be called on an input element with type="text".' );
				return false;
			}

			// wrap container around element
			if ( opts.wrap ) $el.wrap( '<div class="premise-field-wp_media"></div>' );

			// set the parent container
			wrapper = $el.parent();

			if ( opts.preview && '' !== $el.val() ) {
				var media = $el.val().split( ',' );
				for (var i = media.length - 1; i >= 0; i--) {
					if ( media[i].match(/(jpg|png|gif|jpeg)/gi) ) {
						mediaUploaded.push( media[i] );
					}
				}
				setPreview();
			}

			// Override options if submitted inline via 'data-options'
			var inlineOptions = $el.attr( 'data-options' );
			if ( '' !== inlineOptions ) {
				var optionsObj = $.parseJSON( inlineOptions );
				opts = $.extend( {}, opts, optionsObj );
			}

			// now that we have our $el ready, insert buttons.
			insertBtns();
		}

		// open uploader thickbox when upload button is clicked
		var openUploader = function() {
			console.log( 'clicked' );
			// exit if the is no wordpress media uploader
			if ( ! wp.media ) {
				console.error( 'wp.media object is undefined. Make sure Wordpress Media Uploader Scripts are enqueued.' );
				return false;
			}

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

			// bind selection of media in uploader
			uploader.on('select', function() {
				// get array of attachment objects
				var attachment = uploader.state().get('selection').toJSON();

				mediaUploaded = [];
				// Loop through images selected and save them to our mediaUploaded var
				$(attachment).each(function(i, v){
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

		// handle files
		var handleFiles = function() {
			$el.val( mediaUploaded.join() );
			if ( opts.preview && 'url' == opts.return ) setPreview();
		}

		// empty field when delet btn is clicked
		var clearField = function() {
			$el.val('');
			return false;
		}

		// sets the preiview for images.
		var setPreview = function() {
			if ( mediaUploaded.length > 0 ) {
				var preview = wrapper.find('.premise-wp_media-preview'),
				count = mediaUploaded.length;

				if ( ! preview.length ) {
					wrapper.append( $( '<div class="premise-wp_media-preview"></div>' ) );
					preview = wrapper.find('.premise-wp_media-preview');
				}

				preview.html( insertPreview() );
			}
		}

		// insert the media
		var insertPreview = function() {
			var str = '<div class="premise-row premise-wp_media-preview-inner">';
			// process more than one uploaded file
			if ( mediaUploaded.length > 1 ) {
				for ( var i = 0; i < mediaUploaded.length; i++ ) {
					var col = ( 6 > mediaUploaded.length ) ? mediaUploaded.length : 6;
					str += '<span class="premise-preview-thumb col'+col+'" style="background-image: url('+mediaUploaded[i]+');"></span>';
				}
			}
			// process only one file
			else {
				str += '<span class="premise-preview-thumb span12" style="background-image: url('+mediaUploaded[0]+');"></span>';
			}
			str += '</div>';

			console.log( str );
			return str;
		}

		// Insert buttons to upload and remove files if they dont exist already
		var insertBtns = function() {
			btnDelete = $el.siblings('.premise-btn-remove');
			btnUpload = $el.siblings('.premise-btn-upload');

			if ( ! btnDelete.length ) {
				btnDelete = $('<a class="premise-btn-remove" href="javascript:void(0);"><i class="fa fa-fw fa-times"></i></a>');
				// $el.parentNode.insertBefore( btnDelete[0], field[0].nextSibling );
				wrapper.append( btnDelete );
			}

			if ( ! btnUpload.length ) {
				btnUpload = $('<a class="premise-btn-upload" href="javascript:void(0);"><i class="fa fa-fw fa-upload"></i></a>');
				// $el.parentNode.insertBefore( btnUpload[0], field[0].nextSibling );
				wrapper.append( btnUpload );
			}
			// Bind upload button
			btnUpload.click(function(){
console.log( btnUpload );
				openUploader();
			});

			// Bind delete button
			btnDelete.click(function(){
				console.log( 'delete btn clicked' );
				clearField();
			});
		}

		init();

		return this;
	}

	// Defaults.
	$.fn.premiseFieldWpMedia.defaults = {
		multiple: false,
		imageSize: 'full',
		return: 'url',
		preview: false,
		wrap: true,
	}

}(jQuery));