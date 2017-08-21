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

		// Support multiple elements.
		if (this.length > 1) {
			this.each(function() {
				$(this).premiseFieldDuplicate( option );
			});
			return;
		}

		// reference our variles that do not change in the DOM
		var opts       = $.extend( {}, $.fn.premiseFieldDuplicate.defaults, option ),
		el             = this,
		$el            = $(el),
		// the buttons
		cloneBtn  = '<button class="button pwpfd-button pwpfd-clone"><i class="fa fa-clone"></i> Add</button>',
		removeBtn = '<button class="button button-wraning pwpfd-button pwpfd-remove"><i class="fa fa-close"></i> Remove</button>';

		// Make sure we have everything we need to work with.
		var _construct = function() {
			// build our default element
			buildDuplicator();
			// // add index to each fields container and add remove button if needed
			resetCountIndex();
			// bind our add btn
			$el.find( '.pwpfd-clone' ).click( _tryClone );
		},

		// try to clone
		_tryClone = function( e ) {
			e.preventDefault();
			if ( opts.allowEmptyFields ) {
				_clone();
			}
			else {
				_checkEmptyFields( $(e.target).parents( '.pwp-duplicate-section' ) );
			}
			return false;
		},

		_checkEmptyFields = function( section ) {
			var empty = false;
			section.find( 'select, input, textarea' ).each( function() {
				if ( '' === $(this).val() ) {
					$(this).focus();
					empty = true;
					return false;
				}
			});
			if ( ! empty ) _clone();
			return false;
		},

		// clone the fields
		_clone = function() {
			var subject = $el.find( '.pwp-duplicate-section' ).first(),
			_count      = subject.attr('data-duplicate-count'),
			clone       = subject.clone(),
			count       = ( +_count + 1 );

			// assign the new data count for serialization later
			clone.attr( 'data-duplicate-count', _count );
			// remove clone btn from clone. It is not bound.
			clone.find( '.pwpfd-clone' ).remove();
			// reset our fields in our subject
			subject.find( 'select, input, textarea' ).each( function() {
				$(this).val('');
			} );
			// insert the clone
			subject.after( clone.addClass( 'pwpfd-duplicated' ).append( removeBtn ) );
			subject.find( 'select, input, textarea' ).first().focus();

			resetCountIndex();
			maybeBindRemove();
		};

		// run our code
		_construct();

		return this;

		/*
		 Helpers
		 */

		// inset add/remove buttont to respective section
		function buildDuplicator() {
			$el.find( '.pwp-duplicate-section' ).each( function( i, v ) {
				( 0 !== i) ? $(this).append( removeBtn ) : $(this).append( cloneBtn );
			});
		}

		// return all fields
		function findFields() {
			return $el.find( 'select, input, textarea' );
		}

		// resets the data duplicate count attribute in our duplicate containers
		function resetCountIndex() {
			var _index =  opts.startCount;

			$el.find( '.pwp-duplicate-section' ).each( function() {
				var $this = $( this ),
				oldIndex  = $this.attr( 'data-duplicate-count' ) ? $this.attr( 'data-duplicate-count' ) : _index,
				fields    = $this.find( 'select, input, textarea' );

				serializeFieldsIntoArray( fields, oldIndex, _index );

				if ( ! $this.find( '.pwpfd-remove' ).length
					&& ! $this.find( '.pwpfd-clone' ).length ) {
					$this.append( removeBtn );
				}

				$this.attr( 'data-duplicate-count', _index );
				_index++;
			} );
			maybeBindRemove();
		}

		// make sure that fields and labels are serialized properly
		function serializeFieldsIntoArray( fields, index, replace ) {
			fields = fields || [];
			// index  = index  || $el.find( '.pwp-duplicate-section' ).attr( 'data-duplicate-count' );

			var _nameRegExp = new RegExp( "(["+index+"])", "gi" ),
			_idRegExp       = new RegExp( "(-"+index+")$", "gi" );

			fields.each( function( i, v ) {

				var $this = $(this),
				_id       = $this.attr( 'id' ),
				_name     = $this.attr( 'name' );

				if ( _name && '' !== _name ) {
					// if the name is already serialized in an array
					if ( _name.match( /^.*(\[|\]).*$/g ) ) {
						// if we have a replace index try replacing
						if ( 'undefined' !== typeof replace ) {
							$this.attr( 'name', _name.replace( _nameRegExp, replace ) );
						}
						// no replace index, parse to the end
						else if ( ! _name.match( _nameRegExp ) ) {
							$this.attr( 'name', _name + '['+index+']' );
						}
					}
					// not in an array, put it in an array and follow the sequence of starting count
					else {
						$this.attr( 'name', _name + '['+index+']' );
					}
				}

				if ( _id && '' !== _id ) {
					if ( _id.match( _idRegExp ) && 'undefined' !== typeof replace ) {
						$this.parents( '.pwp-duplicate-section' ).find( 'label[for="'+_id+'"]' ).attr( 'for', _id.replace( _idRegExp, '-'+replace )  );
						$this.attr( 'id', _id.replace( _idRegExp, '-'+replace ) );
					}
					else {
						$this.parents( '.pwp-duplicate-section' ).find( 'label[for="'+_id+'"]' ).prop( 'for', _id + '-' + index );
						$this.attr( 'id', _id + '-' + index );
					}
				}

			} );
		}

		// bind remove button if any exist
		function maybeBindRemove() {
			var btn = $el.find( '.pwpfd-remove' );
			if ( btn.length ) {
				btn.off().click( function( e ) {
					e.preventDefault();
					$(this).parent( '.pwp-duplicate-section' ).hide( 'fast', function() {
						$(this).remove();
						// $el.find( '.pwp-duplicate-section' ).each(function(i,v){
						// 	$(this).attr( 'data-duplicate-count', i );
						// });
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
		// autoDuplicate:    true,  // if true, when all fields are filled out it will automatically duplicate
		allowEmptyFields: false, // allow to clone with empty fields whther required or not
		startCount:       0,     // begin the count at a different number than 0

		// callbacks
		onCopy :   function() { return true }, // COMING SOON
		onRemove : function() { return true }, // COMING SOON
	};

}(jQuery));
