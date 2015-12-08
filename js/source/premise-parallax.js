/**
 * 
 */



var PremiseParallax = {


	elements: [],



	inView: {
		offsetIn: 0,
		offsetOut: 0
	},



	init: function() {

		if ( jQuery('.premise-parallax').length > 0 ) {
			// Construct our object
			this.elements = jQuery('.premise-parallax');
			PremiseParallax.prepareParallax();

			console.log('PremiseParallax Initiated successfully!');
		}

		return false;
	},




	prepareParallax: function() {
		var $this = PremiseParallax;

		$this.elements.each(function(i, v) {
			var inView = jQuery(v).attr('data-in-view') ? jQuery(v).attr('data-in-view') : null;
			jQuery(window).scroll( $this.doParallax(jQuery(this), inView ) );
		});
	},




	doParallax: function(el, inView, callback) {
		el       = el         ||  {};
		inView   = inView     ||  false;
		callback = 'function' === typeof callback ? callback : null;

		var self    = PremiseParallax,
		totalScroll = jQuery(document).height() - jQuery(window).height(),
		newScroll, currentScroll;
		
		if(Premise.browserMobile){
			newScroll = jQuery(window).scrollTop();
		} else {
			if(Premise.whichBrs() == 'Safari' || Premise.whichBrs() == 'Chrome'){
				newScroll = jQuery('body').scrollTop();
			}
			else {
				newScroll = jQuery('html,body').scrollTop();
			}
		}
		
		if ( inView ) {
			if ( newScroll + jQuery(window).height() >= jQuery(this).offset().top + inView.offsetIn && currentScroll < newScroll ) {
				self.startAnimation( jQuery(this) );
			}
			if(!self.browserMobile && newScroll + jQuery(window).height() <= jQuery(this).offset().top + inView.offsetOut && currentScroll > newScroll ) {
				self.endAnimation( jQuery(this) );
			}
		}

		if ( callback ) {
			callback(el, inView);
		}

		currentScroll = newScroll;
	},




	scrollNow: function(){}

};