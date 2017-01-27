<?php
/**
* Insert custom fields in the backend in a user's profile
*
* @package Premise WP\Controller
*/
class PWP_User_Fields {

	/**
	 * holds the title
	 *
	 * @var string
	 */
	public $title  = '';

	/**
	 * holds the description
	 *
	 * @var string
	 */
	public $description = '';

	/**
	 * holds the fields
	 *
	 * @var string
	 */
	public $fields = array();

	/**
	 * holds the option_names
	 *
	 * @var string
	 */
	private $option_names = array();

	/**
	 * parse arguments and register our hooks.
	 *
	 * @param array $args         arguments to display user fields
	 * @param mixed $option_names option names to know what options to save in the database. can be a string with one name or array with multiple.
	 */
	function __construct( $args = array(), $option_names = '' ) {

		if ( isset( $args['title'] ) && ! empty( $args['title'] ) ) {
			$this->title =  esc_html( $args['title'] );
		}

		if ( isset( $args['description'] ) && ! empty( $args['description'] ) ) {
			$this->description =  esc_html( $args['description'] );
		}

		if ( isset( $args['fields'] ) && ! empty( $args['fields'] ) ) {
			$this->fields =  (array) $args['fields'];
		}

		if ( ! empty( $option_names ) ) {
			$this->option_names = (array) $option_names;
		}

		$this->register_hooks();
	}

	/**
	 * Print the use fields in the user profile
	 *
	 * @param  object $user the user object being edited
	 * @return string       the html for the fiedls to display
	 */
	public function fields( $user ) {
		?><h2><?php echo esc_html( $this->title ); ?></h2>
		<p><?php echo esc_html( $this->description ); ?></p>
		<table class="form-table">
			<tbody>
				<?php foreach ( $this->fields as $field ) {
					$f = new PWP_Field_Controller( $field );
					?><tr>
						<th>
							<label for="<?php echo $f->id ?>"><?php echo $f->label; ?></label>
						</th>
						<td>
							<?php echo $f->field; ?>
						</td>
					</tr><?
				} ?>
			</tbody>
		</table><?
	}

	/**
	 * Saves the fields to the user profile if the option_names param was passed.
	 *
	 * @param  integer $user_id the user id for the user neing edited
	 * @return boolean          true on success false on failuer
	 */
	public function save_fields( $user_id ) {
		if ( ! current_user_can( 'edit_user', $user_id ) ) {
	   	 return false;
	    }

	    foreach ( $this->option_names as $option ) {
	    	if ( ! empty( $_POST[ $option ] ) ) {
		    	update_usermeta( $user_id, $option, $_POST[ $option ] );
	    	}
	    	else {
	    		return false;
	    	}
	    }
	}

	/**
	 * register the hooks to show or save the fields
	 *
	 * @return void does not return anything
	 */
	private function register_hooks() {
		// register hooks to display the fields
		add_action( 'show_user_profile', array( $this, 'fields' ) );
		add_action( 'edit_user_profile', array( $this, 'fields' ) );
		// register hooks to save the fields
		add_action( 'personal_options_update', array( $this, 'save_fields' ) );
		add_action( 'edit_user_profile_update', array( $this, 'save_fields' ) );
	}
}