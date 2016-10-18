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
		var opts = $.extend( {}, $.fn.premiseFieldDuplicate.defaults, option );

		// Support multiple elements.
		if (this.length > 1) {
			this.each(function() {
				$(this).premiseFieldDuplicate( options );
			});
		}

		// Reference variables.
		var $el = $(this),
		fields  = [],
		requiredFields = [],

		cloneBtn  = '<button class="button pwpfd-button pwpfd-clone"><i class="fa fa-clone"></i> Clone</button>',
		removeBtn = '<button class="button button-wraning pwpfd-button pwpfd-remove"><i class="fa fa-close"></i> Remove</button>';

		// Make sure we have everything we need to work with.
		var _construct = function() {

			// prepare our element
			if ( ! $el.parents( '.pwpfd-wrapper' ).length ) $el.wrap( '<div class="pwpfd-wrapper"></div>' );
			$el.children().wrapAll( '<div class="pwpfd-duplicate-this" data-duplicate-count="'+opts.startCount+'"></div>' );
			$el.addClass( 'pwpfd-duplicator' );

			// diplay the add button if applicable and does not exist
			if ( opts.displayAddButton && ! $el.children( '.pwpfd-clone' ).length ) $el.append( cloneBtn );

			fields = $el.find( 'select, input, textarea' );

			if ( fields.prop( 'required' ) ) {
				fields.each( function( i, v ) {
					( $(this).prop( 'required' ) ) ? $(this).addClass( 'pwpfd-field' ) : false;
				} );
			}
			else {
				fields.addClass( 'pwpfd-field' );
			}

			requiredFields = $el.find( '.pwpfd-field' );

			serializeFieldsIntoArray();

			if ( opts.autoDuplicate ) requiredFields.change( tryClone );

			if ( opts.displayAddButton ) $el.find( '.pwpfd-clone' ).click( tryClone );
		},


		_clone = function() {
			var subject = $el.find( '.pwpfd-duplicate-this' ),
			_count      = subject.attr( 'data-duplicate-count' ),
			clone       = subject.clone();

			var count = ( +_count + 1 );

			subject.attr( 'data-duplicate-count', count );

			fields.each( function() {
				$(this).val('');
			} );

			serializeFieldsIntoArray( _count, count );

			$el.before( clone.addClass( 'pwpfd-duplicated' ).append( removeBtn ) );

			$( '.pwpfd-remove' ).click( function( e ) {
				e.preventDefault();
				$(this).parent( '.pwpfd-duplicated' ).hide( 'fast', function() {
					$(this).remove();
				} );

				// TODO reset all fields arrays

				return false;
			} );
		},


		tryClone = function( e ) {
			e.preventDefault();
			if ( ! reqFieldsEmpty() ) {
				_clone();
			}
			return false;
		};

		/**
		 * Pivate Helpers
		 */

		// make sure that fields and labels are serialized properly
		function serializeFieldsIntoArray( index, replace ) {
			index   = index || opts.startCount;

			var _match = new RegExp( "(\["+index+"\])", "g" ),
			_idmacth   = new RegExp( "(-"+index+")$", "g" );

			fields.each( function( i, v ) {

				var $this = $(this),
				_id       = $this.attr( 'id' ),
				_name     = $this.attr( 'name' );

				if ( _name && '' !== _name ) {
					// if the name is already serialized in an array
					if ( _name.match( /^.*(\[|\]).*$/g ) ) {
						if ( replace ) {
							$this.attr( 'name', _name.replace( _match, replace ) );
						}
						else if ( ! _name.match( _match ) ) {
							$this.attr( 'name', _name + '['+index+']' );
						}
					}
					// not in an array, put it in an array and follow the sequence of starting count
					else {
						$this.attr( 'name', _name + '['+index+']' );
					}
				}

				if ( _id && '' !== _id ) {
					if ( _id.match( _idmacth ) ) {
						$this.attr( 'id', _id.replace( _idmacth, replace ) );
					}
					else {
						$this.attr( 'id', _id + '-' + index );
					}
				}

			} );

			$el.find( 'label' ).each( function() {
				var $this = $(this),
				_for      = $this.attr( 'for' );
				if ( _for && '' !== _for ) {
					if ( _for.match( _idmacth ) ) {
						$this.attr( 'for', _for.replace( _idmacth, replace ) );
					}
					else {
						$this.attr( 'for', _for + '-' + index );
					}
				}
			} );
		}


		function reqFieldsEmpty() {
			var a = false;
			requiredFields.each( function() {
				if ( ! $(this).val() || '' == $(this).val() ) {
					a = true;
					return false;
				}
			} );
			return a;
		}

		_construct();

		return this;
	};


	// Defaults: onCopy & onRemove callback functions.
	$.fn.premiseFieldDuplicate.defaults = {
		// options
		displayAddButton: true, // displays and bind the add button
		autoDuplicate:    true, // if true, when all required fields are filled out it will automatically duplicate
		startCount:       1,    // begin the count at a different number than 0

		// callbacks
		onCopy :   function() { return true }, // currently does not do anything
		onRemove : function() { return true }, // currently does not do anything
	};

}(jQuery));
