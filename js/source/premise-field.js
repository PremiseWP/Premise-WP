/**
 * Premise Field JS
 *
 * PremiseField object is required for Premise WP fields to work properly
 * but it is not required for Premise WP core functionality.
 *
 * @since 1.2
 *
 * @package Premise WP
 * @subpackage JS / PremiseField
 */






/**
 * On Youtube iframe API ready.
 *
 * @link https://developers.google.com/youtube/iframe_api_reference
 *
 * @see premise_video_output()
 */
/*function onYouTubeIframeAPIReady() {
	console.log('YT run!');
	var ytVideos = jQuery('.premise-youtube-video'),
		ytPlayers = [];

	if ( ytVideos.length <= 0 ) {
		return;
	}

	// Begin YouTube Player when needed
	ytVideos.each(function(i,v){
		var el = jQuery(this);

		ytPlayers[i] = new YT.Player( el.attr('id'), {
			height: el.css('height'),
			width: el.css('width'),
			videoId: el.attr('data-premise-youtube-video-id'),
			/*events: {
				'onReady': '',
				'onStateChange': ''
			}*/
		/*});
	});
}*/



/**
 * PremiseField
 *
 * Holds properties and methods needed for all premise fields.
 *
 * @type {Object}
 */
var PremiseField = {




	/**
	 * Initiate the PremiseField object
	 *
	 * Constructs our object. Will eventually instantiate certain objects
	 * based on the fields being used.
	 *
	 * @return {void}
	 */
	init: function() {

		this.bindEvents();

		/**
		 * This code loads the IFrame Player API code asynchronously.
		 */
		var tag = document.createElement("script");
		tag.src = "https://www.youtube.com/iframe_api";

		var firstScriptTag = document.getElementsByTagName("script")[0];

		var tag2 = document.createElement("script");
		tag2.innerHTML = 'function onYouTubeIframeAPIReady(){return ( jQuery( \'.premise-youtube-video\' ).length ) ? PremiseField.YTPlayer.init() : false;}';

		firstScriptTag.parentNode.insertBefore(tag2, firstScriptTag);
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


		/**
		 * premiseFieldAfterInit
		 *
		 * @premise-hook premiseFieldAfterInit do hook after PremiseField object inits
		 *
		 * @since 1.2
		 *
		 * @param {object} this passes the object as parameter
		 */
		jQuery(document).trigger('premiseFieldAfterInit', this);
	},




	/**
	 * Bind Events needed for Fields to work properly
	 *
	 * @return {void} Binds events
	 */
	bindEvents: function() {

		// bind media preview if using media
		jQuery('.premise-field-type-wp_media').premiseFieldWpMedia();

		jQuery('.premise-field-type-fa_icon').premiseFieldFaIcon();

		// Bind success message
		jQuery(document).on('premiseFieldAfterInit', function(){console.log('PremiseField Object Initited successfully.');});
	},


};




/**
 * PremiseField WPMedia Object
 *
 * Holds methods needed for the 'wp_media' field to work porperly.
 *
 * @type {object}
 */
PremiseField.WPMedia = {

	/**
	 * holds wp.media object
	 *
	 * @type {object}
	 */
	uploader: null,




	/**
	 * Whether to allow multiple files to be uploaded or not
	 *
	 * @type {boolean}
	 */
	isMulti: false,




	/**
	 * the media that has been selected or uploaded
	 *
	 * @type {Array}
	 */
	mediaUploaded: [],




	/**
	 * holds array of media that was laready saved
	 * to avoid overriding previous uploads
	 *
	 * @type {Array}
	 */
	mediaSaved: [],



	/**
	 * Holds elements that require previews
	 *
	 * @type {Array}
	 */
	previewContainers: [],




	/**
	 * whether the preview param was passed to the field
	 *
	 * @type {Boolean}
	 */
	hasPreview: false,




	/**
	 * construct our object
	 */
	init: function(el) {

		this.mediaField = jQuery(el).parent('.premise-field-wp_media').find('input.premise-file-url');

		this.isMulti = this.mediaField.attr('multiple') ? true : false;

		this.bindEvents();

		this.upload();
	},




	/**
	 * bind events needed for media uploader to work
	 */
	bindEvents: function() {

	},



	/**
	 * Binded preview separately becuase it is the only one that gets called
	 * before init. Needs to be independent.
	 *
	 * @return {void} binds the preview function. does not return anything
	 */
	bindPreview: function() {
		var self = PremiseField.WPMedia;
		if ( jQuery('.premise-field-type-wp_media.premise-field-preview').length > 0 ) {
			self.previewContainers = jQuery('.premise-field-type-wp_media.premise-field-preview');
			self.hasPreview = true;
			self.setPreview();
		}
		return false;
	},




	/**
	 * upload media
	 */
	upload: function() {

		// clear our media array
		PremiseField.WPMedia.mediaUploaded = [];

		// If the uploader object has already been created, open it
		if (PremiseField.WPMedia.uploader) {
			PremiseField.WPMedia.uploader.open();
			return;
		}

		// Extend the wp.media object
		PremiseField.WPMedia.uploader = wp.media.frames.file_frame = wp.media({
			title: 'Upload Media',
			button: {
				text: 'Insert Media'
			},
			multiple: PremiseField.WPMedia.isMulti
		});

		/**
		 * Bind function for when files are inserted
		 *
		 * bind here and not in our bindEvents function because on our
		 * bindEvents function the uploader object has not been created yet.
		 */
		PremiseField.WPMedia.onInsert();

		//Open the uploader dialog
		PremiseField.WPMedia.uploader.open();
	},




	/**
	 * When user clicks insert media
	 */
	onInsert: function() {
		PremiseField.WPMedia.uploader.on('select', function() {

			// get array of attachment objects
			attachment = PremiseField.WPMedia.uploader.state().get('selection').toJSON();

			PremiseField.WPMedia.mediaUploaded = [];
			// Loop through images selected and save them to our mediaUploaded var
			jQuery(attachment).each(function(i, v){
				PremiseField.WPMedia.mediaUploaded.push(attachment[i].url);
			});

			PremiseField.WPMedia.handleFiles();
		});
	},




	/**
	 * handles files uploaded
	 */
	handleFiles: function() {
		var $this = PremiseField.WPMedia;

		$this.mediaField.val($this.mediaUploaded);

		if ( $this.hasPreview ) {
			var container = $this.mediaField.parents('.premise-field-type-wp_media.premise-field-preview');
			$this.insertPreview( container, $this.mediaUploaded );
		}
	},




	/**
	 * Remove a saved or uploaded file from the wp_media field. Empties the value.
	 *
	 * @param  {object} el the button being clicked
	 * @return {void}
	 */
	removeFile: function(el) {

		jQuery(el).parent('.premise-field-wp_media').find('.premise-file-url').val('');

		var $this = PremiseField.WPMedia;
		if ( $this.hasPreview ) {
			$this.removePreview(jQuery(el).parents('.premise-field-type-wp_media.premise-field-preview'));
		}
		return false;
	},




	/**
	 * Gets called on load if there is a preview attribute in one of the
	 * wp_media fields.
	 *
	 * Loops through the wp_media fields and inserts preview if one is needed.
	 */
	setPreview: function() {
		var self = PremiseField.WPMedia;

		self.previewContainers.each(function(){
			var $this = jQuery(this),
			img = $this.find('.premise-file-url').val();

			if ( img && '' !== img ) {
				var media = img.split(',');
				self.insertPreview($this, media);
			}
		});
	},




	/**
	 * Inserts the preview at the end of our wp_media premise field container.
	 *
	 * @param  {object} container the jQuery object for our premise field main wrapper
	 * @param  {mixed}  media     array of urls to use as thumbnails
	 * @return {string}           returns html for our preview thumbnails
	 */
	insertPreview: function(container, media) {
		container = container || {};
		media     = media     || {};

		if ( media.length > 0 ) {
			var $this = PremiseField.WPMedia,
			count     = media.length,
			str = '';

			// Remove previously inserted previews to avoid duplicates
			$this.removePreview(container);

			str = '<div class="premise-wp_media-preview"><div class="premise-wp_media-preview-inner">';
			// process more than one uploaded file
			if ( count > 1 ) {
				for ( var i = 0; i < count; i++ ) {
					str += '<span class="premise-preview-thumb premise-preview-thumb-multi" style="background-image: url('+media[i]+');"></span>';
				}
			}
			// process only one file
			else {
				str += '<span class="premise-preview-thumb" style="background-image: url('+media+');"></span>';
			}
			str += '</div></div>';
			container.append(str);
		}
		return false;
	},




	/**
	 * Removes the preview container from element provided
	 *
	 * @param  {object} container jquery object
	 * @return {void}             romves object if found
	 */
	removePreview: function(container) {
		container.find('.premise-wp_media-preview').remove();
	}
};



/**
 * YouTube JS
 *
 * @package Premise-WP
 */

PremiseField.YTPlayer = {

	init: function() {
		(function($){
			PremiseField.YTPlayer.initPlayer($, YT);
		}(jQuery));
	},


	initPlayer: function($) {
		console.log('YT run !');
		var ytVideos = $('.premise-youtube-video');

		// Begin YouTube Player when needed
		if ( ytVideos.length > 0 ) {

			ytVideos.each(function(i,v){
				var videoId = $(this).attr('data-premise-youtube-video-id'),

				player = new YT.Player( $(this).attr('id'), {
					height: $(this).css('height'),
					width: $(this).css('width'),
					videoId: videoId,
					playerVars: { 'autoplay': 1, 'playlist': [videoId] },
					events: {
						'onReady': PremiseField.YTPlayer.playerReady,
						'onStateChange': ''
					}
				});
				
				player.setLoop = true;
			});
		}
	},


	playerReady: function( event ) {
	  event.target.setVolume(0);
	}
};



/**
 * On Youtube iframe API ready.
 *
 * @link https://developers.google.com/youtube/iframe_api_reference
 *
 * @see premise_video_output()
 */
function onYouTubeIframeAPIReady() {
	console.log('api ready');
}