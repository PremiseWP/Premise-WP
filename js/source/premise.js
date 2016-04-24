/**
 * Load Premise WP core JS
 * 
 * @package Premise WP
 * @subpackage JS
 */
jQuery(function($){

	$(document).ready(function(){
		Premise.init();
	});

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