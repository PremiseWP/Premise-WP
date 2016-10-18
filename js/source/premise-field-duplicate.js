(function($){

	/**
	 * jQuery plugin that duplicates an input field
	 * Adds a + button to the last input of the same type and a - button to the others.
	 *
	 * @param  {object} option  onCopy & onRemove callbacks.
	 * @return {object}         returns the jQuery object in scope
	 */
	$.fn.premiseFieldDuplicate = function( option ) {

		if (this.length === 0) {
			return this;
		}

		// Parse the default options.
		var options = $.extend( {}, $.fn.premiseFieldDuplicate.defaults, option );

		// Support multiple elements.
		if (this.length > 1) {
			this.each(function() {
				$(this).premiseFieldDuplicate( options );
			});
		}

		// Reference variables.
		var $el = $(this);

		// Make sure we have everything we need to work with.
		var _construct = function() {

			// First, add remove (.pwpfd-remove) & add (.pwpfd-clone) buttons if none found.
			if ( ! $el.children('.pwpfd-clone').length ) {

				$el.append( '<button class="pwpfd-clone">Clone me</button>' );
			}
			if ( ! $el.children('.pwpfd-remove').length ) {

				$el.append( '<button class="pwpfd-remove">Remove me</button>' );
			}

			addListener($el);

			/**
			 * Add replaceLast function to String.prototype.
			 * Replace last occurence in a string.
			 *
			 * @link http://stackoverflow.com/questions/2729666/javascript-replace-last-occurence-of-text-in-a-string
			 */
			if (!String.prototype.replaceLast) {
				String.prototype.replaceLast = function(find, replace) {
					var index = this.lastIndexOf(find);

					if (index >= 0) {
						return this.substring(0, index) + replace + this.substring(index + find.length);
					}

					return this.toString();
				};
			}
		};

		// Copy the field.
		var copy = function($el) {
			var $clone = $el.clone(true, true);
			$clone.removeClass('clone');

			addListener($clone);
			$el.find('input, select, textarea').val('');
			$el.before($clone);
			callback( options.onCopy );
		};

		// Remove the field.
		var remove = function($el) {
			$el.remove();
			callback( options.onRemove );
		};

		// Add listener for when add/remove buttons are clicked.
		var addListener = function($el) {
			$el.on('click', '.pwpfd-clone', function(e){ copy($el); e.preventDefault(); } );
			$el.on('click', '.pwpfd-remove', function(e){ remove($el); e.preventDefault(); });
		};

		var callback = function( func ) {
			if ( typeof func == 'function' ) {
				func.call($el);
			}
		};

		_construct();

		return this;
	};


	/**
	 * Get Input name's array ID.
	 * @public
	 *
	 * @example $.fn.premiseFieldDuplicate.getInputNameArrayId( input.name );
	 *
	 * @param {string} name Input name.
	 *
	 * @return {string} Input ID.
	 */
	$.fn.premiseFieldDuplicate.getInputNameArrayId = function( name ) {

		if ( name.substr( -2 ) === '[]' ) {

			return '';
		}

		if ( name.substr( -1 ) === ']' ) {

			name = name.substr( 0, name.length - 1 );
		}

		var strId = parseInt( name.substr( -1, 1 ), 10 );

		if ( ! strId ) {

			return '';
		}

		// We have an ID, get it!
		for ( var i = -2; ; i-- ) {

			var nextChar = parseInt( name.substr( i, 1 ), 10 );

			if ( nextChar ) {

				strId = nextChar.toString() + strId;
			} else {

				break;
			}
		}

		return strId;
	};


	/**
	 * Increment Input name & id attributes if ID found.
	 * @public
	 *
	 * @example $.fn.premiseFieldDuplicate.incrementInputNameAndId( this );
	 *
	 * @param {string} input Input.
	 */
	$.fn.premiseFieldDuplicate.incrementInputNameAndId = function( input ) {

		console.log(input.name, input.id);

		var strId = $.fn.premiseFieldDuplicate.getInputNameArrayId( input.name );

		if ( ! strId ) {

			return;
		}

		var newStrId = parseInt( strId, 10 ) + 1;

		// Replace ID with new one.
		input.name = input.name.replaceLast( strId, newStrId );

		input.id = input.id.replaceLast( strId, newStrId );
	};


	// Defaults: onCopy & onRemove callback functions.
	$.fn.premiseFieldDuplicate.defaults = {
		onCopy : function(){
			// Try to increment the ID of the input (name & id attributes).
			this.find('input, select, textarea').each(function() {

				$.fn.premiseFieldDuplicate.incrementInputNameAndId( this );
			});
		},
		onRemove : function(){}
	};

}(jQuery));
