/**
 * Premise Field Fa Icon field functionality.
 */
(function($){

	$.fn.premiseFieldFaIcon = function( options ) {

		// Parse the default options
		var opts = $.extend( {}, $.fn.premiseFieldFaIcon.defaults, options );

		if (this.length === 0) {
			return this;
		}

		// support multiple elements
		if (this.length > 1) {
			this.each(function() {
				$(this).premiseFieldFaIcon( options );
			});
			return this;
		}

		// reference elements the we use throught the plugin for efficiency
		var el    = this,
		faIcon    = $(el).find('.premise-field-fa_icon'),
		field     = faIcon.find('.premise-fa_icon'),
		btnShow   = faIcon.find('.premise-choose-icon'),
		btnDelete = faIcon.find('.premise-remove-icon'),
		icons     = $(el).find('.premise-field-fa-icons-container'),
		icon = icons.find('.premise-field-fa-icon-anchor'),

		body = $('body'),

		dom = $(document),

		iconsVisible = false;

		// initiate plugin. bind events
		var init = function() {
			btnShow.click(toggleIcons);
			btnDelete.click(clearField);
			field.keyup(filterIcons);
		}

		// toggle the icons container
		var toggleIcons = function() {
			icons.slideToggle('fast', function(){
				( ! iconsVisible && icons.is(':visible') ) ? iconsOpened() : iconsClosed();
			});
		}

		// when icons open, bind icon click and trigger hook.
		var iconsOpened = function() {
			body.addClass('premise-field-fa-icon-container-visible');

			bindIcon();
			
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
			dom.trigger('premiseFieldAfterFaIconsOpen', [ icons, $(el) ] );

			iconsVisible = true;
		}

		// when icons close, trigger hook.
		var iconsClosed = function() {
			body.removeClass('premise-field-fa-icon-container-visible');

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
			dom.trigger('premiseFieldAfterFaIconsClose', [ icons, $(el) ] );

			iconsVisible = false;
		}

		// clear the field.
		var clearField = function() {
			field.val('');
		}

		// bind selection of icon on click
		var bindIcon = function() {
			icon.off().click(function(){
				var a = $(this).attr('data-icon');
				field.val(a);
				toggleIcons();
				return false;
			});
		}

		// filter icons when user types directly on field
		var filterIcons = function() {
			var s = field.val();
			
			if ( ! iconsVisible && 1 >= s.length ) {
				toggleIcons();
			}

			// Filter icons
			icon.each(function(i,v) {
				var $this = $(this),
				a = $this.attr('data-icon'),
				li = $this.parents('.premise-field-fa-icon-li');

				( ! a.match(s) ) ? li.hide() : li.show();
			});
		}

		init();

		return this;
	}

	// Defaults. For now, this plugin does not take any options.
	$.fn.premiseFieldFaIcon.defaults = {}

}(jQuery));