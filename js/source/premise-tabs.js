/**
 * Plugin JS
 *
 * @package Premise Tabs
 */
(function ($) {

	// call the plugin automatically on our default class (.ptabs-wrapper)
	// TODO Update to call the new version of the plugin.
	$(document).ready(function(){
		if ( 0 < $('.ptabs-wrapper').length ) $('.ptabs-wrapper')._deprecated_premiseTabs();

		if ( 0 < $('.pwptabs').length ) $('.pwptabs').premiseTabs();
	});

	if ( $.fn._deprecated_premiseTabs ) {
		return false;
	}

	/**
	 * Deprecated in lieu of premiseTabs
	 *
	 * @since 1.7.2
	 */
	$.fn._deprecated_premiseTabs = function() {

		var tabs  = this.find( '.ptabs-tab' ),
		tab       = this.find( '.ptabs-tab a' ),
		activeTab = this.find( '.ptabs-tab.ptabs-active' );

		// If no active tabs set the first one as active
		if ( 0 == activeTab.length ) {
			tabs.first().addClass('ptabs-active');
			activeTab = tabs.first();
		}

		showContent( activeTab.attr('data-tab-index') );

		tab.click(function(){
			tabs.removeClass('ptabs-active');
			$(this).parent('.ptabs-tab').addClass('ptabs-active');
			$(this).parents('.ptabs-wrapper').find('.ptabs-content').removeClass('ptabs-active');
			showContent( $(this).parent('.ptabs-tab').attr('data-tab-index') );
		});


		function showContent(index) {
			var activeContent = index ? $('.ptabs-content-'+index) : null;
			null !== activeContent ? activeContent.addClass('ptabs-active') : false;
		}
	}


	if ( $.fn.premiseTabs ) {
		return false;
	}

	/**
	 * [premiseTabs description]
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 */
	$.fn.premiseTabs = function( options ) {

		if ( this.length === 0 ) {
			return this;
		}

		// Parse the default options.
		var opts = $.extend( {}, $.fn.premiseTabs.defaults, options );

		var el    = this,
		$el       = $(el),
		tab       = $( opts.tabSelector ),
		activeTab = $( '.'+opts.activeClass ),
		toggle    = $( opts.toggleSelector ),
		content   = $( opts.contentSelector )
		layout    = opts.layout,
		direction = opts.direction || '';

		var init = function() {

			opts.openMultiple = ( 'tabs' !== opts.layout ) ? opts.openMultiple : false;

			if ( ! $el.is( '.pwptabs' ) ) $el.addClass( 'pwptabs' );

			// close all the tabs content first
			content.hide( 1 );

			// make sure we have our wrapper. needed for our css to kick in
			if ( ! $el.parent( '.pwptabs-wrapper' ).length ) $el.wrap( '<div class="'+opts.wrapperClass+'"></div>' );

			$el.addClass( 'pwptabs-layout-'+layout );

			if ( 'accordion' == opts.layout && '' !== direction ) $el.addClass( 'pwptabs-layout-'+direction );

			// If no active tabs set the first one as active
			if ( 0 == activeTab.length || 1 < activeTab.length ) {
				tab.removeClass( opts.activeClass );
				tab.first().addClass( opts.activeClass );
				activeTab = tab.first();
				openActive();
			}

			bindTabs();
		},

		// bind the anchor for each tab
		bindTabs = function() {
			( toggle.length ) ? toggle.click( toggleTabs ) : false;
		},

		// toggle tabs when in accordion layout
		toggleTabs = function( e ) {
			e.preventDefault();

			activeTab = $( this ).parents( opts.tabSelector );

			if ( activeTab.is( '.'+opts.activeClass ) ) {
				if ( 'accordion' == opts.layout ) {
					activeTab.removeClass( opts.activeClass );
					closeTabs();
				}
				else {
					return false
				}
			}
			else {
				if ( ! opts.openMultiple ) tab.removeClass( opts.activeClass );
				activeTab.addClass( opts.activeClass );
				openTabs();
			}

			return false;
		},

		// open the tabs
		openTabs = function() {
			if ( ! opts.openMultiple ) closeTabs();

			if ( 'function' === typeof opts.onTabOpen ) {
				opts.onTabOpen.call( el );
			}
			else {
				openActive();
			}
		},

		// close the tabs
		closeTabs = function() {
			if ( 'function' === typeof opts.onTabClose ) {
				opts.onTabClose.call( el );
			}
			else {
				if ( ! opts.openMultiple ) {
					content.hide( ( 'horizontal' == direction ) ? { width: 0 } : { height: 0 } );
				}
				else {
					activeTab.find( opts.contentSelector ).hide( ( 'horizontal' == direction ) ? { width: 0 } : { height: 0 } );
				}
			}
		},

		// open the active tab
		openActive = function() {
			activeTab.find( opts.contentSelector ).show( ( 'horizontal' == direction ) ? { width: 'auto' } : { height: 'auto' } );
		};

		init();
		return this;
	}

	/**
	 * [defaults description]
	 * @type {Object}
	 */
	$.fn.premiseTabs.defaults = {
		// selectors
		tabSelector:     '.pwptabs-tab',
		toggleSelector:  '.pwptabs-toggle',
		contentSelector: '.pwptabs-content',
		// Special classes
		wrapperClass: 'pwptabs-wrapper',
		activeClass:  'pwptabs-active',
		// Tabs layout options
		layout:    'tabs', // tabs|accordion
		// accordion layout
		direction:    'vertical',
		openMultiple: false,
		// callbacks
		onTabOpen:  null,
		onTabClose: null,
	};

})(jQuery);

(function($){


}(jQuery));