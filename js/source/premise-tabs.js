/**
 * Plugin JS
 *
 * @package Premise Tabs
 */
(function ($) {

	$(document).ready(function(){
		if ( 0 < $('.ptabs-wrapper').length ) $('.ptabs-wrapper').premiseTabs();
	});

	if ( $.fn.premiseTabs ) {
		return false;
	}

	$.fn.premiseTabs = function() {

		var tabs = this.find('.ptabs-tab'),
		tab = this.find('.ptabs-tab a'),
		activeTab = this.find('.ptabs-tab.ptabs-active');

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

})(jQuery);

