<?php
/**
 * Metabox Model
 *
 * @package Premise WP
 * @subpackage Model
 */

// Block direct access to this file.
defined( 'ABSPATH' ) or die();

/**
 * Register a meta box to any post, page or custon post type.
 */
class PWP_Metabox {

    /**
     * Holds default arguments
     *
     * @var array
     */
    protected $defaults = array(
        'id'            => '',
        'title'         => 'Metabox Created with Premise WP',
        'callback'      => '',
        'screen'        => 'post',     // post type. Default post
        'context'       => 'advanced', // normal | side | advanced. Default advanced
        'priority'      => 'default',  // high | low | default
        'callback_args' => '',         // Data that should be set as the $args property of the box array (which is the second parameter passed to your callback).
        'fields'        => array(),    // any fields to display in the metabox
    );

    /**
     * Holds parsed arguments
     *
     * @var array
     */
    protected $mb = array();

    /**
     * Holds the error code and its message
     *
     * @var array
     */
    private $error_codes = array(
        'pwp_metabox_no_option_names' => 'No option_names parameter was supplied to the PWP_Metabox class. This must be a string or an array.',
        'pwp_metabox_no_fields'       => 'No fields were passed to the PWP_Metabox class.',
    );

    /**
     * Holds the errors. Instantiates WP_Error class if an error is found.
     *
     * @var string
     */
    private $errors = '';

    /**
     * Holds the nonce
     *
     * @var string
     */
    private $nonce = 'pwp-metabox-nonce';

    /**
     * Holds the nonce_action
     *
     * @var string
     */
    private $nonce_action = '';

    /**
     * Constructor
     *
     * @param array  $mb_args      the arguments to build the metabox
     * @param string $option_names the option names being used in the metabox.
     */
    public function __construct( $mb_args = array(), $option_names = '' ) {

        if ( is_admin() ) {
            $this->option_names = ( ! empty( $option_names ) ) ? (array) $option_names : '';

            // do not allow empty option names or we cannot save data
            if ( empty( $this->option_names ) ) {
                $this->new_error( 'pwp_metabox_no_option_names' );
            }

            $this->mb = wp_parse_args( $mb_args, $this->defaults );

            if ( empty( $this->mb['fields'] ) ) {
                $this->new_error( 'pwp_metabox_no_fields' );
            }

            if ( empty( $this->mb['callback'] ) ) {
                $this->mb['callback'] = array( $this, 'render_metabox' );
                // $this->nonce_action = premise_rand_str( 8 );
            }

            add_action( 'load-post.php',     array( $this, 'init' ) );
            add_action( 'load-post-new.php', array( $this, 'init' ) );
        }

    }

    /**
     * Meta box initialization.
     */
    public function init() {
        add_action( 'add_meta_boxes' , array( $this , 'maybe_load_mb'  ) );
        add_action( 'save_post'      , array( $this , 'save_metabox' ), 10, 2 );
    }

    /**
     * Check if we should load the metabox, and load it if we should. This checks for the post type to see  if it matches the screen param sent.
     *
     * @param string $post_type the post type being used
     */
    public function maybe_load_mb( $post_type ) {
        add_meta_box(
            $this->mb['id'],
            __( $this->mb['title'] ),
            $this->mb['callback'],
            $this->mb['screen'],
            $this->mb['context'],
            $this->mb['priority']
        );
    }

    /**
     * Renders the meta box.
     *
     * @param object $post the post object for the post being viewed
     */
    public function render_metabox( $post ) {
        // if there are errors. show them instead of the fields
        if ( is_wp_error( $this->errors ) ) {
            foreach ( (array) $this->errors->get_error_codes() as $code ) {
                echo '<p style="color: red;">' . $this->errors->get_error_message( $code ) . '</p>';
            }
            return false;
        }

        // Add nonce for security and authentication.
        $this->nonce_action = premise_rand_str( 8 );
        wp_nonce_field( $this->nonce_action, $this->nonce );

        pwp_form( $this->mb['fields'], true );
    }

    /**
     * Handles saving the meta box.
     *
     * @todo   find a way to set your own custom nonce and nocen action to check against when using custom callback
     *
     * @param  int     $post_id Post ID.
     * @param  WP_Post $post    Post object.
     * @return null
     */
    public function save_metabox( $post_id, $post ) {
        // if we are not dealing with the same post type we have on our screen then dont do anything.
        if ( ! in_array( $post->post_type, (array) $this->mb['screen'] ) ) {
            return;
        }

        // fix for not having a nonce action to check when using a custom callback
        if ( isset( $_POST[ $this->nonce ] ) && ! empty( $this->nonce_action ) ) {
            // Check if nonce is valid.
            if ( ! wp_verify_nonce( $_POST[ $this->nonce ], $this->nonce_action ) ) {
                return;
            }
        }

        // Check if user has permissions to save data.
        if ( ! current_user_can( 'edit_post', $post_id ) ) {
            return;
        }

        // Check if not an autosave.
        if ( wp_is_post_autosave( $post_id ) ) {
            return;
        }

        // Check if not a revision.
        if ( wp_is_post_revision( $post_id ) ) {
            return;
        }
        foreach ( (array) $this->option_names as $option ) {
            /**
             * allows you to validate your own data.
             *
             * @var mixed
             */
            $data = ( isset( $_POST[ $option ] ) ) ? apply_filters( 'pwp_metabox_sanitize_option', $_POST[ $option ], $post ) : false;

            // save the option
            if ( $data ) {
                update_post_meta( $post_id, $option, $data );
            }
        }
    }

    /**
     * add an error to be handed later
     *
     * @param  string $error_code the error "slug" to know what error message to display
     * @return void               saves the error, does not return anything
     */
    private function new_error( $error_code = '' ) {
        $e = ( ! empty( $error_code ) && array_key_exists( $error_code, $this->error_codes ) ) ? $this->error_codes[ $error_code ] : '';
        if ( is_wp_error( $this->errors ) ) {
            $this->errors->add( $error_code, $e );
        }
        else {
            $this->errors = new WP_Error( $error_code, __( $e ) );
        }
    }
}