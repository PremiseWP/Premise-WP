(function($){

	/**
	 * jQuery plugin that inserts a UI into an input field for users to select an icon from a list of font awesome icons.
	 *
	 * @param  {object} options currently does not take any options
	 * @return {object}         returns the jQuery object in scope
	 */
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

		// reference variables
		var el       = this,
		$el          = $(el),
		wrapper      = $el.parent( '.premise-field-fa_icon' ),
		btnInsert    = ( wrapper.length ) ? wrapper.find( '.premise-choose-icon' ) : {},
		btnRemove    = ( wrapper.length ) ? wrapper.find( '.premise-remove-icon' ) : {},
		iconsWrapper = ( wrapper.length ) ? wrapper.find( '.premise-field-fa-icons-container' ) : {},
		icon         = ( iconsWrapper.length ) ? iconsWrapper.find('.premise-field-fa-icon-anchor') : {},
		body         = $('body'),
		dom          = $(document),
		iconsVisible = false;

		// build object. bind events
		var init = function() {
			// Build our object
			_construct();
			// run the plugin
			bindEvents();
		}

		// make sure we have everything we need to work with
		var _construct = function() {
			if ( ! $el.is( '.premise-fa_icon' ) ) $el.addClass( 'premise-fa_icon' );

			if ( ! wrapper.length ) wrapElement();

			if ( ! btnInsert.length ) buildInsertBtn();

			if ( ! btnRemove.length ) buildRemoveBtn();

			if ( ! iconsWrapper.length ) buildIconsWrapper();
		}

		// bind buttons and field to activate the icon lookup ui
		var bindEvents = function() {
			btnInsert.click( toggleIcons );
			btnRemove.click( clearField );
			$el.keyup( filterIcons );
		}

		// wrap the field in a div so we can scope things properly
		var wrapElement = function() {
			$el.wrap( '<div class="premise-field-fa_icon"></div>' );
			wrapper = $el.parent( '.premise-field-fa_icon' );
		}

		// build and insert the "insert button"
		var buildInsertBtn = function() {
			var btn = $( '<a href="javascript:void(0);" class="premise-choose-icon"><i class="fa fa-fw fa-th"></i></a>' );
			wrapper.append( btn );
			btnInsert = wrapper.find('.premise-choose-icon');
		};

		// build and insert the "remove button"
		var buildRemoveBtn = function() {
			var btn = $( '<a href="javascript:void(0);" class="premise-remove-icon"><i class="fa fa-fw fa-times"></i></a>' );
			wrapper.append( btn );
			btnRemove = wrapper.find('.premise-remove-icon');
		};

		// build and insert the icons wrapper. Ajax the html for all icons.
		var buildIconsWrapper = function() {
			$.post( '/wp-admin/admin-ajax.php', { action: 'premise_field_load_fa_icons_ajax' }, function( r ) {
				wrapper.append( r );
				iconsWrapper = wrapper.find( '.premise-field-fa-icons-container' );
				icon         = iconsWrapper.find('.premise-field-fa-icon-anchor');
			} );
		}

		// toggle the icons container
		var toggleIcons = function() {
			iconsWrapper.slideToggle( 'fast', function(){
				( ! iconsVisible && iconsWrapper.is(':visible') ) ? iconsOpened() : iconsClosed();
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
			 * @param {object} icons  jQuery object for element holding all icons
			 * @param {object} parent jQuery object for field main element
			 */
			dom.trigger('premiseFieldAfterFaIconsOpen', [ iconsWrapper, $(el) ] );

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
			 * @param {object} icons  jQuery object for element holding all icons
			 * @param {object} parent jQuery object for field main element
			 */
			dom.trigger('premiseFieldAfterFaIconsClose', [ iconsWrapper, $(el) ] );

			iconsVisible = false;
		}

		// clear the field.
		var clearField = function() {
			$el.val('');
		}

		// bind selection of icon on click
		var bindIcon = function() {
			icon.off().click(function(){
				var a = $(this).attr('data-icon');
				$el.val(a);
				toggleIcons();
				return false;
			});
		}

		// filter icons when user types directly on field
		var filterIcons = function() {
			var s = $el.val();

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