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

		// reference all our global variables
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

				btnDelete = $el.siblings('.premise-btn-remove');
				btnUpload = $el.siblings('.premise-btn-upload');

				if ( ! btnDelete.length ) {
					btnDelete = $('<a class="premise-btn-remove" href="javascript:void(0);"><i class="fa fa-fw fa-times"></i></a>');
					field[0].parentNode.insertBefore( btnDelete[0], field[0].nextSibling );
				}

				if ( ! btnUpload.length ) {
					btnUpload = $('<a class="premise-btn-upload" href="javascript:void(0);"><i class="fa fa-fw fa-upload"></i></a>');
					field[0].parentNode.insertBefore( btnUpload[0], field[0].nextSibling );
				}
			}
			// if the field is loaded through premise_field()
			else {
				field = $el.find('.premise-file-url');
				btnUpload = $el.find('.premise-btn-upload');
				btnDelete = $el.find('.premise-btn-remove');
			}

			// Override options if submitted inline via 'data-options'
			var inlineOptions = field.attr( 'data-options' );
			if ( '' !== inlineOptions ) {
				var optionsObj = $.parseJSON( inlineOptions );
				opts = $.extend( {}, opts, optionsObj );
			}
console.log(opts);

			// set multiple param in case the element has the property set inline
			// opts.multiple = field.attr( 'multiple' ) ? true : opts.multiple;

			// set multiple param in case the element has the property set inline
			// opts.preview = field.attr( 'preview' ) ? true : opts.preview;

			// Bind upload button
			btnUpload.click(openUploader);

			// Bind delete button
			btnDelete.click(clearField);
		}

		// open uploader thickbox when upload button is clicked
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

			return false;
		}

		// handle files
		var handleFiles = function() {
			field.val( mediaUploaded.join() );
			if ( opts.preview ) setPreview();
		}

		// empty field when delet btn is clicked
		var clearField = function() {
			field.val('');
			return false;
		}


		var setPreview = function() {

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
	}

}(jQuery));