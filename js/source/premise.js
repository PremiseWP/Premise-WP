/**
 * Load Premise WP core JS
 * 
 * @package Premise WP
 * @subpackage JS
 */
jQuery(function($){

	/**
	 * Initiate the Premise Field Object
	 */
	PremiseField.init();

});




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