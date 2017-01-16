<?php
/**
 * Register a meta box
 *
 * @package Premise WP
 * @subpackage Model
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
     * Constructor
     */
    public function __construct( $mb_args = array() ) {

        $this->nonce = 'pwp-metabox-nonce';
        $this->nonce_action = premise_rand_str( 8 );

        if ( is_admin() ) {
            $this->mb = wp_parse_args( $mb_args, $this->defaults );

            if ( empty( $this->mb['callback'] ) ) {
                $this->mb['callback'] = array( $this, 'render_metabox' );
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
        add_action( 'save_post'      , array( $this , 'save_metabox' ), 10 );
    }

    /**
     * Check if we should load the metabox, and load it if we should. This checks for the post type to see  if it matches the screen param sent.
     */
    public function maybe_load_mb( $post_type ) {
        if ( ( is_array( $this->mb['screen'] ) && in_array( $post_type, $this->mb['screen'] ) )
             || ( is_string( $this->mb['screen'] ) && $post_type == $this->mb['screen'] ) ) {

            add_meta_box(
                $this->mb['id'],
                __( $this->mb['title'], 'textdomain' ),
                $this->mb['callback'],
                $post_type,
                $this->mb['context'],
                $this->mb['priority']
            );
        }
    }

    /**
     * Renders the meta box.
     */
    public function render_metabox( $post ) {
        // Add nonce for security and authentication.
        wp_nonce_field( $this->nounce_action, $this->nonce );

        if ( ! empty( $this->mb['fields'] ) && is_array( $this->mb['fields'] ) ) {
            pwp_form( $this->mb['fields'], true );
        }
        else {
            echo 'This content is loaded by default by the PWP_Metabox class since no fields were submitted.';
        }
    }

    /**
     * Handles saving the meta box.
     *
     * @param int     $post_id Post ID.
     * @param WP_Post $post    Post object.
     * @return null
     */
    public function save_metabox( $post_id, $post ) {
        // Add nonce for security and authentication.
        $nonce_name   = isset( $_POST[ $this->nonce ] ) ? $_POST[ $this->nonce ] : '';
        $nonce_action = $this->nounce_action;
        // Check if nonce is set.
        if ( ! isset( $nonce_name ) ) {
            return;
        }

        // Check if nonce is valid.
        if ( ! wp_verify_nonce( $nonce_name, $nonce_action ) ) {
            return;
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
    }
}