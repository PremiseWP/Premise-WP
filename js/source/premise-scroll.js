(function($){

	// if the plugin has already loaded, forget 'bout it..
	if ( $.fn.premiseScroll )
		return false;

	/**
	 * premiseScroll binds an event to a node in the DOM. This event only triggers
	 * when the user is scrolling and the criteria passed in the options argument
	 * is met.
	 *
	 * @version  1.1.2
	 *
	 * @see $.fn.premiseScroll.defaults for more information on options
	 *
	 * @param  {object} options options object
	 * @return {object}         the node in context
	 */
	$.fn.premiseScroll = function( options ) {

		// Parse the default options
		var opts = $.extend( {}, $.fn.premiseScroll.defaults, options );

		// Default offsetIn and offsetOut to offset if empty
		opts.offsetIn  = opts.offsetIn || opts.offset;
		opts.offsetOut = opts.offsetOut || opts.offset;

		if ( this.length === 0 ) {
			return this;
		}

		// get reference of element
		var el = this,

		elm = $(el),

		// records amount document has scrolled
		scrolled = 0,

		// direction in which the user scrolled
		directionScrolled = '',

		// amount of pixels scrolled per event
		pixelsScrolled = 0,

		// record the total amount scrolled since the event first triggered
		totalScrolled,

		// when set to true prevents event from triggering
		scrollStopped = false,

		// The window height
		wHeight = $(window).height(),

		// this will hld the lement's position in pixels relative to the document
		elemPos = 0;

		/*
			PRIVATE METHODS
		 */

		/**
		 * initiate our plugin
		 *
		 * constructs our ibject
		 *
		 * @return {void}
		 */
		var init = function() {

			// set totalScrolled in case the user has already scrolled and the page is refreshed
			totalScrolled = getTotalScrolled();

			// Bind Scroll animation on window load
			$(window).load(bindScroll);

			return this;
		};

		/**
		 * bindScroll on scroll
		 *
		 * @return {void}
		 */
		var bindScroll = function() {
			$(this).scroll(doScroll);
		};

		/**
		 * doScroll is where the magic happens.
		 *
		 * This function gets called while the user is scrolling.
		 *
		 * @return {boolean} false
		 */
		var doScroll = function() {

			if ( ! elm ||
				elm.isPaused() ||
					'function' !== typeof opts.onScroll ) {
						return false;
			}

			// reset the element's positoin in case it moved
			elemPos = Math.round( elm.offset().top );

			var newScroll     = getNewScroll();
			totalScrolled     = getTotalScrolled();
			directionScrolled = ( scrolled < newScroll ) ? 'down' : 'up';

			if ( opts.inView ) {

				if ( -1 !== opts.offsetOut ) {
					if ( ( newScroll + wHeight >= elemPos + opts.offsetIn ) &&
						( newScroll - elm.height() <= elemPos + opts.offsetOut ) ) {
						opts.onScroll.call( elm );
					}
				}
				else {
					if ( ( newScroll + wHeight >= elemPos + opts.offsetIn ) ) {
						opts.onScroll.call( elm );
					}
				}
			}
			else {
				opts.onScroll.call( elm );
			}

			pixelsScrolled = newScroll - scrolled;

			scrolled = newScroll;

			// record how much this element has scrolled
			elm.totalScrolled = totalScrolled;


			return false;
		};

		/**
		 * returns the amount scrolled at any given time
		 *
		 * @return {integer} amount scrolled in pixels
		 */
		var getNewScroll = function() {
			var newScroll;
			if ( browserMobile() ) {
				newScroll = $(window).scrollTop();
			}
			else {
				if ( getUA() == 'Safari' || getUA() == 'Chrome' ) {
					newScroll = $('body').scrollTop();
				}
				else {
					newScroll = $('html,body').scrollTop();
				}
			}
			return newScroll;
		};

		/**
		 * getTotalScrolled returns the total amount scrolled since the event first triggered.
		 *
		 * @return {Integer} number of pixels scrolled
		 */
		var getTotalScrolled = function() {
			return Math.round( getNewScroll() + $(window).height() - elm.offset().top - opts.offsetIn );
		};

		/**
		 * get Browser's User Agent
		 *
		 * @private
		 *
		 * @return {string} returns the browser's name
		 */
		var getUA = function() {
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
		};

		/**
		 * check if the browser is mobile.. duh!
		 *
		 * @private
		 * @return {boolean} true if browser is mobile. Defaults to false.
		 */
		var browserMobile = function() {
			var check = false;
			(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true;})(navigator.userAgent||navigator.vendor||window.opera);
			return check;
		};

		/*
			PUBLIC METHODS
		 */

		// prevents the animation from happening again
		el.stopScroll = function() {
			scrollStopped = true;
		};

		// allows the animation to trigger.
		el.startScroll = function() {
			scrollStopped = false;
		};

		// direction in which the user scrolled
		el.directionScrolled = function() {
			return directionScrolled;
		};

		// amount of pixels scrolled per event
		el.pixelsScrolled = function() {
			return pixelsScrolled;
		};

		// records amount document has scrolled
		el.scrolled = function() {
			return scrolled;
		};

		// record the total amount scrolled since the event first triggered
		el.totalScrolled = function() {
			return totalScrolled;
		};

		// when set to true prevents event from triggering
		el.scrollStopped = function() {
			return scrollStopped;
		};

		// check if browser is a mobile browser
		el.browserMobile = function() {
			return browserMobile();
		};

		//

		elm.pauseScroll = function( bool ) {
			bool = bool || true;
			elm.scrollStopped = bool;
		};

		elm.isPaused = function() {
			if ( 'undefined' == typeof elm.scrollStopped ) {
				elm.scrollStopped = false;
			}
			return elm.scrollStopped;
		};

		// support multiple elements
		if (this.length > 1) {
			this.each(function( i, v ) {
				$(v).premiseScroll( options );
			});
		}
		else {
			init();
		}
	};

	/**
	 * premiseScroll defaults object. This is decalred publicly to allow
	 * developers to change the defaults once for the whole project.
	 *
	 * @type {Object}
	 */
	$.fn.premiseScroll.defaults = {

		inView: true,  // whether to trigger the event when element comes into view
		offset: 0,     // number of pixels to delay the trigger
		offsetIn: '',  // number of pixels to delay the trigger when the element comes into view. Defaults to offset value
		offsetOut: '', // number to pixels to delay stopping the animation when the element comes out of view. Defaults to offset value

		/**
		 * onScroll is called when the node meets the criteria specified in the options
		 *
		 * @param  {object}  node the element in context.
		 * @return {boolean}      true
		 */
		onScroll: function( node ) { return true; },
	};

}(jQuery));