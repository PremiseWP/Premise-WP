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
			return;
		}

		// Reference variables.
		var $el = $(this),
		fields  = [],
		requiredFields = [],

		cloneBtn  = '<button class="button pwpfd-button pwpfd-clone"><i class="fa fa-clone"></i> Clone</button>',
		removeBtn = '<button class="button button-wraning pwpfd-button pwpfd-remove"><i class="fa fa-close"></i> Remove</button>';

		// Make sure we have everything we need to work with.
		var _construct = function() {
			// build our default element
			buildDuplicator();
			// get required and non required fields
			findFields();
			// add index to each fields container and add remove button if needed
			resetCountIndex();
			// make sure fields are being serialized
			// serializeFieldsIntoArray();
			// bind our actions based on the options passed
			( opts.autoDuplicate )    ? requiredFields.change( tryClone )            : false;
			( opts.displayAddButton ) ? $el.find( '.pwpfd-clone' ).click( tryClone ) : false;
		},

		// try to clone
		tryClone = function( e ) {
			e.preventDefault();
			if ( ! reqFieldsEmpty() ) {
				_clone();
			}
			return false;
		},

		// clone the fields
		_clone = function() {
			var subject = $el.find( '.pwpfd-duplicate-this' ),
			_count      = subject.attr( 'data-duplicate-count' ),
			clone       = subject.clone(),
			count       = ( +_count + 1 );

			subject.attr( 'data-duplicate-count', count );

			fields.each( function() {
				$(this).val('');
			} );

			serializeFieldsIntoArray( fields, _count, count );

			$el.before( clone.addClass( 'pwpfd-duplicated' ).append( removeBtn ) );

			maybeBindRemove();
		};

		// run our code
		_construct();

		return this;

		// build our main element to clone from
		function buildDuplicator() {
			$el.addClass( 'pwpfd-duplicator' );
			$el.children().wrapAll( '<div class="pwpfd-duplicate-this"></div>' );
			if ( ! $el.parents( '.pwpfd-wrapper' ).length ) $el.wrap( '<div class="pwpfd-wrapper"></div>' );
			if ( opts.displayAddButton && ! $el.find( '.pwpfd-clone' ).length ) $el.append( cloneBtn );
		}

		// get all fields and required fields as well
		function findFields() {
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
		}

		// resets the data duplicate count attribute in our duplicate containers
		function resetCountIndex() {
			var _index =  opts.startCount;
			$el.parents( '.pwpfd-wrapper' ).find( '.pwpfd-duplicate-this' ).each( function() {
				var $this = $( this ),
				oldIndex  = $this.attr( 'data-duplicate-count' ) ? $this.attr( 'data-duplicate-count' ) : _index,
				fields    = $this.find( 'select, input, textarea' );

				serializeFieldsIntoArray( fields, oldIndex, _index );

				if ( ! $this.find( '.pwpfd-remove' ).length && ! $this.parents( '.pwpfd-duplicator' ).length ) $this.append( removeBtn );

				$this.attr( 'data-duplicate-count', _index );
				_index++;
			} );
			maybeBindRemove();
		}

		// make sure that fields and labels are serialized properly
		function serializeFieldsIntoArray( fields, index, replace ) {
			fields = fields || [];
			// index  = index  || $el.find( '.pwpfd-duplicate-this' ).attr( 'data-duplicate-count' );

			var _match = new RegExp( "(["+index+"])", "gi" ),
			_idmacth   = new RegExp( "(-"+index+")$", "gi" );

			fields.each( function( i, v ) {

				var $this = $(this),
				_id       = $this.attr( 'id' ),
				_name     = $this.attr( 'name' );

				if ( _name && '' !== _name ) {
					// if the name is already serialized in an array
					if ( _name.match( /^.*(\[|\]).*$/g ) ) {
						// if we have a replace index try replacing
						if ( 'undefined' !== typeof replace ) {
							$this.attr( 'name', _name.replace( _match, replace ) );
						}
						// no replace index, parse to the end
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
						$el.parents( '.pwpfd-wrapper' ).find( 'label[for="'+_id+'"]' ).attr( 'for', _id.replace( _idmacth, replace ) );
						$this.attr( 'id', _id.replace( _idmacth, replace ) );
					}
					else {
						$el.parents( '.pwpfd-wrapper' ).find( 'label[for="'+_id+'"]' ).prop( 'for', _id + '-' + index );
						$this.attr( 'id', _id + '-' + index );
					}
				}

			} );
		}

		// check if any of the required fields is empty
		function reqFieldsEmpty() {
			if ( opts.allowEmptyFields ) return false;
			var a = false;
			requiredFields.each( function() {
				var $this = $(this);
				if ( ! $this.val() || '' == $this.val() ) {
					$this.focus();
					a = true;
					return false;
				}
			} );
			return a;
		}

		// bind remove button if any exist
		function maybeBindRemove() {
			var btn = $el.parents( '.pwpfd-wrapper' ).find( '.pwpfd-remove' );
			if ( btn.length ) {
				btn.off().click( function( e ) {
					e.preventDefault();
					$(this).parent( '.pwpfd-duplicate-this' ).hide( 'fast', function() {
						$(this).remove();
						resetCountIndex();
					} );
					return false;
				} );
			}
		}
	};


	// Defaults: onCopy & onRemove callback functions.
	$.fn.premiseFieldDuplicate.defaults = {
		// options
		displayAddButton: true,  // displays and bind the add button
		autoDuplicate:    true,  // if true, when all required fields are filled out it will automatically duplicate
		allowEmptyFields: false, // allow to clone with empty fields whther required or not
		startCount:       0,     // begin the count at a different number than 0

		// callbacks
		onCopy :   function() { return true }, // currently does not do anything
		onRemove : function() { return true }, // currently does not do anything
	};

}(jQuery));
