/**
 * Premise Field JS
 *
 * PremiseField object is required for Premise WP fields to work properly
 * but it is not required for Premise WP core functionality.
 *
 * @since 1.2
 * 
 * @package Premise WP JS
 * @subpackage PremiseField
 */




/**
 * PremiseField
 *
 * Holds properties and methods needed for all premise fields.
 *
 * @type {Object}
 */
var PremiseField = {

	/**
	 * Holds jQuery object for tooltip elements
	 * 
	 * @type {object}
	 */
	tooltip: null,




	/**
	 * Holds jQuery object for fa_icon button to open icons.
	 * 
	 * @type {object}
	 */
	faShowIconsBtn: null,




	/**
	 * Holds jQuery object for fa_icon button to close icons.
	 * 
	 * @type {object}
	 */
	faHideIconsBtn: null,




	/**
	 * Holds the jQuery object for fa_icon input field
	 * 
	 * @type {object}
	 */
	faInputField: null,




	/**
	 * Initiate the PremiseField object
	 *
	 * Constructs our object. Will eventually instantiate certain objects
	 * based on the fields being used.
	 * 
	 * @return {void} 
	 */
	init: function() {

		// tooltips
		this.tooltip = jQuery('.premise-field .premise-tooltip');

		// The show icons button
		this.faShowIconsBtn = jQuery('.premise-field-fa_icon .premise-choose-icon');

		// The hide icons button
		this.faHideIconsBtn = jQuery('.premise-field-fa_icon .premise-remove-icon');

		// Each icon selector
		this.faSelectIconBtn = jQuery('.premise-field-fa-icon-anchor');

		// The input field 
		this.faInputField = jQuery('.premise-field-fa_icon .premise-fa_icon');

		this.bindEvents();

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

		if ( jQuery('.premise-field-type-wp_media').length > 0 ) {
			PremiseField.WPMedia.bindPreview();
		}

		// bind tooltip
		if ( this.tooltip.length > 0 ) {
			this.tooltip.mouseenter(this.adjustTooltip);
		}

		// Display FA icons when btn is clicked or
		// when the field itself is clicked on
		this.faShowIconsBtn.click(PremiseField.faIcon.showIcons);
		this.faInputField.focus(PremiseField.faIcon.showIcons);

		// Hide FA icons when the delete btn is clicked on
		// passing the argument true deletes the field's value
		this.faHideIconsBtn.click(function(){PremiseField.faIcon.hideIcons(true)});

		this.faInputField.keyup(PremiseField.faIcon.filterIcons);

		// bind event for icons slection
		this.faSelectIconBtn.click(PremiseField.faIcon.insertIcon);

		// Bind success message
		jQuery(document).on('premiseFieldAfterInit', function(){console.log('PremiseField Object Initited successfully.')});
	},




	adjustTooltip: function() {
		var self = PremiseField;

		var W = jQuery(window).width(),
		H = jQuery(window).height(),
		$this = jQuery(this),
		tip = $this.find('.premise-tooltip-inner'),
		arrow = $this.find('.premise-tooltip-inner:after'),
		w = tip.outerWidth(true),
		h = tip.outerHeight(true),
		adjust;

		var position = ( tip.offset().top - h > h ) ? 'top' : 'bottom';
		
		if ( tip.offset().left < 0 ) {
			adjust = tip.offset().left * -1;
		}
		else if ( tip.offset().left + w > W ) {
			adjust =  '-'+( tip.offset().left + w ) - W;
		}

		console.log(adjust);
		
		$this.addClass('premise-tooltip-'+position);
		tip.css('margin-left', adjust+'px');

		$this.mouseleave(function(){
			$this.removeClass('premise-tooltip-'+position);
			tip.removeAttr('style');
		});

		return false;
	}
}




/**
 * FA Icon Object
 *
 * Holds methods needed for the 'fa_icon' field to function properly
 * 
 * @type {Object}
 */
PremiseField.faIcon = {

	/**
	 * Display the icons
	 * 
	 * @return {void} displays fa icons container
	 */
	showIcons: function() {
		var self = PremiseField.faIcon,
		parent   = jQuery(this).parents('.premise-field'),
		icons    = parent.find('.premise-field-fa-icons-container');

		jQuery(icons).show('fast');
		jQuery('body').addClass('premise-field-fa-icon-container-visible');

		/**
		 * premiseFieldAfterFaIconsOpen
		 * 
		 * @premise-hook premiseFieldAfterFaIconsOpen do hook after icons box opens
		 *
		 * @since  1.2
		 *
		 * @param {object} icons jQuery object for element holding all icons
		 * @param {object} parent jQuery object for field main element
		 */
		jQuery(document).trigger('premiseFieldAfterFaIconsOpen', icons, parent );

		return false;
	},




	/**
	 * Hide the Icons
	 *
	 * @param {boolean} empty if true will empty the field. default false
	 * @return {void}   hides icons
	 */
	hideIcons: function(empty) {
		empty = 'boolean' === typeof empty ? empty : false;
		
		var e  = window.event,
		parent = jQuery(e.target).parents('.premise-field'),
		icons  = parent.find('.premise-field-fa-icons-container');

		// empty the field if argument 'empty' is true
		if ( true === empty ) {
			parent.find('input.premise-fa_icon').val('');
		}

		jQuery(icons).hide('fast');
		jQuery('body').removeClass('premise-field-fa-icon-container-visible');

		/**
		 * premiseFieldAfterFaIconsClose
		 * 
		 * @premise-hook premiseFieldAfterFaIconsClose do hook after icons close
		 *
		 * @since  1.2
		 *
		 * @param {object} icons jQuery object for element holding all icons
		 * @param {object} parent jQuery object for field main element
		 */
		jQuery(document).trigger('premiseFieldAfterFaIconsClose', icons, parent );

		return false;
	},




	/**
	 * insert selected icon into our field
	 * 
	 * @return {string} icon class to use
	 */
	insertIcon: function() {
		var icon = jQuery(this).attr('data-icon');
		
		jQuery(this).parents('.premise-field').find('input.premise-fa_icon').val(icon);
		
		// close icons
		PremiseField.faIcon.hideIcons();
	},




	/**
	 * display icons based on what the user types into the field
	 *
	 * Will display only icons that match the string submitted.
	 * 
	 * @param  {object} e event
	 * @return {void}     hides or display icons that match the string submitted
	 */
	filterIcons: function(e) {
		e = e || window.event;

		var self = PremiseField.faIcon,
		field    = jQuery(this),
		parent   = field.parents('.premise-field'),
		icons    = parent.find('.premise-field-fa-icons-container .premise-field-fa-icon-li'),
		s        = field.val();

		// Filter icons
		icons.each(function(i,v) {
			var a = jQuery(this).find('.premise-field-fa-icon-anchor').attr('data-icon');
			
			if ( ! a.match(s) ) {
				jQuery(this).hide();
			}
			else {
				jQuery(this).show();
			}
		});
	}
}




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




	previewContainers: [],



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
		// this.bindPreview();
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
	        console.log(attachment);
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
		return false;
	},




	setPreview: function() {
		var self = PremiseField.WPMedia;

		self.previewContainers.each(function(){
			var $this = jQuery(this),
			img = $this.find('.premise-file-url').val();
			if ( img && '' !== img ) {
				self.insertPreview($this, img);
			}
		});
	},


	insertPreview: function(container, media) {
		var $this = PremiseField.WPMedia;
		
		var cont = container;

		cont.find('.premise-wp_media-preview').remove();

		if ( jQuery.isArray(media) && media.length > 1 ) {
			var count = media.length,
			str = '<div class="premise-wp_media-preview"><div class="premise-wp_media-preview-inner">';
			for ( var i = 0; i < count; i++ ) {
				str += '<span class="premise-preview-thumb" style="background-image: url('+media[i]+');"></span>';
			}
			str += '</div></div>';
			cont.append(str);
		}
		else {
			cont.append('<div class="premise-wp_media-preview" style="background-image: url('+media+');">');
		}
	}
}










