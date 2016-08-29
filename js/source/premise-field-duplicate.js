(function($){

	/**
	 * jQuery plugin that duplicates an input field
	 * Adds a + (clone/add) button to the last input of the same type
	 * and a x (remove) button to the others.
	 *
	 * @param  {object} option  onCopy & onRemove callbacks + addButton & removeButton HTML.
	 * @return {object}         returns the jQuery object in scope
	 */
	$.fn.premiseFieldDuplicate = function( option ) {

		// Parse the default options.
		var options = $.extend( {}, $.fn.premiseFieldDuplicate.defaults, option );

		if (this.length === 0) {
			return this;
		}

		// Support multiple elements.
		else if (this.length > 1) {
			this.each(function() {
				$(this).premiseFieldDuplicate( options );
			});
			return this;
		}

		// Reference variables.
		var $el = $(this);

		// Make sure we have everything we need to work with.
		var _construct = function() {

			/**
			 * Add replaceLast function to String.prototype.
			 * Replace last occurence in a string.
			 *
			 * @link http://stackoverflow.com/questions/2729666/javascript-replace-last-occurence-of-text-in-a-string
			 */
			if (!String.prototype.replaceLast) {
				String.prototype.replaceLast = function(find, replace) {
					var findStr = find.toString(),
						replaceStr = replace.toString(),
						index = this.lastIndexOf(findStr);

					if (index >= 0) {
						return this.substring(0, index) + replaceStr + this.substring(index + findStr.length);
					}

					return this.toString();
				};
			}

			// First, prepend remove (.premise-field-duplicate-remove-button)
			// & add (.premise-field-duplicate-add-button) buttons if none found.
			if ( ! $el.children('.premise-field-duplicate-add-button').length ) {

				$el.prepend( options.addButton );
			}
			if ( ! $el.children('.premise-field-duplicate-remove-button').length ) {

				$el.prepend( options.removeButton );
			}

			addListener($el);

			// Then, clone field if value is set AND last element.
			if ( ! $el.next( $el.selector ).length &&
				( $el.find('input, textarea').val() ||
					( $el.find('select option[selected=selected]').val() && // Select input: 1 option selected.
						$el.find('select option[value=""]').val() ) ) ) { // Select input: 1 empty value exists.

				copy( $el );
			}
		};

		// Copy the field.
		var copy = function($elem) {
			var $clone = $elem.clone();
			$clone.removeClass('clone');
			var selectVal = $elem.find('select').val();
			$clone.find('select').val(selectVal);

			addListener($clone);

			// Reset to default value.
			// Text(area) + radio inputs: empty value.
			$elem.find('input, textarea').val('');
			// (multiple) Select inputs.
			$elem.find('select').val( function(){
				var $this = $(this);

				if ( $this.prop('multiple') ) {

					// Multiple select: unselect all.
					return [];
				}

				// Select: first value.
				return $(this).find('option').first().val();
			});
			// Checkboxes: uncheck.
			$elem.find('input[type=checkbox]').prop("checked", false);
			$elem.before($clone);
			options.onCopy.call($elem, $clone);
		};

		// Remove the field.
		var remove = function($elem) {
			var prevField = $elem.prev( $elem.selector );
			$elem.remove();
			options.onRemove.call($elem, prevField);
		};

		// Add listener for when add/remove buttons are clicked.
		var addListener = function($elem) {
			$elem.on('click', '.premise-field-duplicate-add-button', function(e){ copy($elem); e.preventDefault(); } );
			$elem.on('click', '.premise-field-duplicate-remove-button', function(e){ remove($elem); e.preventDefault(); });
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


	/**
	 * Increment Field text if .increment CSS class found.
	 * @public
	 *
	 * @example $.fn.premiseFieldDuplicate.incrementText( this );
	 *
	 * @param {string} text Text.
	 *
	 * @return {int} Incremented integer.
	 */
	$.fn.premiseFieldDuplicate.incrementText = function( text ) {

		var textInt = parseInt( text, 10 );

		if ( textInt.toString() !== text ) {

			// Not an integer, nothing to increment!
			return text;
		}

		return textInt + 1;
	};


	// Defaults: onCopy & onRemove callback functions + addButton & removeButton HTML.
	$.fn.premiseFieldDuplicate.defaults = {
		onCopy : function(clone){
			// Try to increment the ID of the input (name & id attributes).
			this.find('input, select, textarea').each(function() {

				$.fn.premiseFieldDuplicate.incrementInputNameAndId( this );

			});

			this.find('.increment').text(function(i, text) {

				return $.fn.premiseFieldDuplicate.incrementText( text );

			});

			// Remove the Add button.
			clone.find('.premise-field-duplicate-add-button').toggle();
		},
		onRemove : function(prevField){

			if ( ! prevField.length ) {

				return;
			}

			// Previous field classes (".class-1.class-2").
			var prevClasses = '.' + prevField.attr("class").split(' ').join('.');

			// We did not remove the last input, so do not show clone button!
			if ( prevField.parent().find( prevClasses + ' .premise-field-duplicate-add-button:visible' ).length ) {

				return;
			}

			prevField.find('.premise-field-duplicate-add-button').toggle();
		},
		addButton : '<i class="premise-field-duplicate-add-button fa fa-plus"></i>',
		removeButton : '<i class="premise-field-duplicate-remove-button fa fa-remove"></i>'
	};

}(jQuery));
