/**
 * Load Premise WP core JS
 * 
 * @package Premise WP JS
 * @subpackage Premise
 */
jQuery(function($){

	Premise.init();

});




var Premise = {


	browserMobile: false,




	/**
	 * Initiate the main Premise Objcect
	 */
	init: function() {

		/**
		 * Initiate the Premise Field Object
		 */
		PremiseField.init();



		/**
		 * Initiate the Premise Field Object
		 */
		PremiseParallax.init();
	},




	/**
	 * Returns which browser is being used
	 * 
	 * @return {string} browser
	 */
	whichBrs: function() {
		var agt=navigator.userAgent.toLowerCase();
		if (agt.indexOf("opera")       != -1) return 'Opera';
		if (agt.indexOf("staroffice")  != -1) return 'Star Office';
		if (agt.indexOf("webtv")       != -1) return 'WebTV';
		if (agt.indexOf("beonex")      != -1) return 'Beonex';
		if (agt.indexOf("chimera")     != -1) return 'Chimera';
		if (agt.indexOf("netpositive") != -1) return 'NetPositive';
		if (agt.indexOf("phoenix")     != -1) return 'Phoenix';
		if (agt.indexOf("firefox")     != -1) return 'Firefox';
		if (agt.indexOf("chrome")      != -1) return 'Chrome';
		if (agt.indexOf("safari")      != -1) return 'Safari';
		if (agt.indexOf("skipstone")   != -1) return 'SkipStone';
		if (agt.indexOf("msie")        != -1) return 'Internet Explorer';
		if (agt.indexOf("netscape")    != -1) return 'Netscape';
		if (agt.indexOf("mozilla/5.0") != -1) return 'Mozilla';
		if (agt.indexOf('\/')          != -1) {
			if (agt.substr(0,agt.indexOf('\/')) != 'mozilla') {
				return navigator.userAgent.substr(0,agt.indexOf('\/'));
			} else return 'Netscape';
		} else if (agt.indexOf(' ') != -1)
			return navigator.userAgent.substr(0,agt.indexOf(' '));
		else return navigator.userAgent;
	}
}




/**
 * Premise Same Height
 * 
 * @param  {string} el the class of the elements to set same height
 * @return {mixed}     will set same min-height to elements. bool false if unsuccessful
 */
function premiseSameHeight( el ) {
	el = el || '.premise-same-height';
	
	var heightTallest = 0, setHeight;

	var setUp = jQuery( el ).each(function(){
		if( setHeight ){
			return false;
		}

		setHeight = jQuery(this).attr('data-height');

		if( setHeight ){
			heightTallest = setHeight;
			return false;
		}

		var h = jQuery(this).outerHeight();
		if( h > heightTallest ){
			heightTallest = h;
		}
	});

	var fixHeight = jQuery( el ).css( 'min-height', heightTallest );

	jQuery.when( setUp ).done( fixHeight );
	
	return false;
}




/**
 * Count visible elements within an array
 *
 * Useful little tool. quickly number of visible elements within an array.
 * 
 * @param  {array}   elements array of elements to check if are visible
 * @return {integer}          number of elements that are visible in the front end
 */
function premiseCountVisibleElements(elements) {
	elements = elements || [];
	var visible = 0;

	elements.each(function(i,v){
		if( jQuery(v).is(':visible') ){
			visible++;
		}
	});
	return visible;
}