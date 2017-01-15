<?php
/**
 * Premise Field Library
 *
 * These functions are related only to the PremiseField class. Without this file
 * said class will not work properly but the rest of Premise WP will not be affected.
 *
 * @see Premise-WP/model/model-premise-field.php PremiseField class lives here.
 *
 * @since 1.2 began to separate libraries
 *
 * @package Premise WP
 * @subpackage Library
 */

// Block direct access to this file.
defined( 'ABSPATH' ) or die();




/**
 * Premise Field
 *
 * Create any form field quickly by simply passing a few arguments to this function. The first
 * argument is the type of element you are trying to create i.e. 'text', 'password', 'select'.
 * The second argument is an array of options that help build your form field. The options basically adds
 * attributes to the field as well as tell Premise how to treat it in the backend of Wordpress.
 * For example passing the 'name' attribute will add 'name="your_value"' to your field but it will also tell
 * Premise where to save the value and how to retrieve it after a value has been saved.
 *
 * @since 1.2 Parameters order changed, new parameter added:
 *            Old params: (array) arguments, (boolean) echo
 *            New params: (string) type, (array) arguments, (boolean) echo
 *
 * @param string  $type the type of field to print or return. i.e. text, textarea, checkbox, wp_media, video.
 * @param array   $args array of arguments to buid a field.
 * @param boolean $echo true outputs the html on to the page. false returns it as a string.
 *
 * @return string       html markup for a form field
 */
function premise_field( $type = 'text', $args = array(), $echo = true ) {

	if ( is_array( $type ) ) {
		$_args = $type;
	}
	else {
		$_args = $args;
		// do not allow an empty type for backward compatibility
		$_args['type'] = ( ! empty( $type ) ) ? esc_attr( $type ) : 'text';
	}

	// backward compatibility for tooltip
	if ( isset( $_args['tooltip'] ) && ! empty( $_args['tooltip'] ) ) {
		$_args['before_field'] = '<br><i>'.strip_tags( $_args['tooltip'], '<span>,<p>,<b>,<strong>,<br>' ).'</i>';
		unset( $_args['tooltip'] );
	}

	// make the field
	pwp_field( $_args, $echo );
}

/**
 * output a field
 *
 * @since  2.0.0         added to replace premise_field. for backward compatibility premise_field became a wrapper for this function.
 *
 * @param  string  $args arguments can be a string - the 'type' param, or an array - argument for field
 * @param  boolean $echo whether to echo ro return the thml
 * @return string        html for field
 */
function pwp_field( $args = '', $echo = true ) {
	// allow args to be an array of args or string for 'type'
	$_args = is_array( $args ) ? $args : array( 'type' => (string) $args );
	// build the field
	$_f = new PWP_Field_Controller( $_args );
	// echo or return
	if ( (boolean) $echo ) {
		echo $_f->html;
	}
	else {
		return $_f->html;
	}
}

/**
 * output a form or field section
 *
 * @since  2.0.0         added to replace premise_fieldSection().
 *
 * @param  array   $args array of fields and attributes
 * @param  boolean $echo true to echo. false to return html
 * @return string        the html for the form or field section
 */
function pwp_form( $args = '', $echo = true ) {
	// build the form
	$_f = new PWP_Form( $args );
	// echo or return
	if ( $_f && (boolean) $echo ) {
		echo $_f->form;
	}
	else {
		return $_f->form;
	}
}

/**
 * Premise field section
 *
 * Group of fields wrapped within one parent element.
 *
 * @since  1.2     Simplified parameters. You can no longer use 'container' parameters.
 *                 instead, use the 'premise_field_section_html' filter.
 *
 * @param  array   $args array of arrays. The fields to insert.
 * @param  boolean $echo whether to echo ro return the string.
 *
 * @return string  html for field section
 */
function premise_field_section( $args = array(), $echo = true ) {

	$html = pwp_form( $args, false );

	/**
	 * premise_field_section_html filter
	 *
	 * Control the way your field section is displayed. This filter will pass the field section
	 * html to the function that you hook to it.
	 *
	 * @see https://codex.wordpress.org/Function_Reference/add_filter Form instructions on how to add a filter.
	 *
	 * @since  1.2 replaces the 'container' params from old function. use to alter section's html
	 *
	 * @premise-hook premise_field_section_html do hook for field section html
	 *
	 * @var string
	 */
	$html = apply_filters( 'premise_field_section_html', $html );

	remove_all_filters( 'premise_field_section_html' );

	if ( ! $echo ) {

		return $html;

	} else {

		echo (string) $html;
	}
}




/**
 * Get font awesome icons
 *
 * @return array array of icons
 */
function premise_get_fa_icons() {

	return array( 'fa-adjust','fa-adn','fa-align-center','fa-align-justify','fa-align-left','fa-align-right','fa-ambulance','fa-anchor','fa-android','fa-angellist','fa-angle-double-down','fa-angle-double-left','fa-angle-double-right','fa-angle-double-up','fa-angle-down','fa-angle-left','fa-angle-right','fa-angle-up','fa-apple','fa-archive','fa-area-chart','fa-arrow-circle-down','fa-arrow-circle-left','fa-arrow-circle-o-down','fa-arrow-circle-o-left','fa-arrow-circle-o-right','fa-arrow-circle-o-up','fa-arrow-circle-right','fa-arrow-circle-up','fa-arrow-down','fa-arrow-left','fa-arrow-right','fa-arrow-up','fa-arrows','fa-arrows-alt','fa-arrows-h','fa-arrows-v','fa-asterisk','fa-at','fa-automobile','fa-backward','fa-ban','fa-bank','fa-bar-chart','fa-bar-chart-o','fa-barcode','fa-bars','fa-beer','fa-behance','fa-behance-square','fa-bell','fa-bell-o','fa-bell-slash','fa-bell-slash-o','fa-bicycle','fa-binoculars','fa-birthday-cake','fa-bitbucket','fa-bitbucket-square','fa-bitcoin','fa-bold','fa-bolt','fa-bomb','fa-book','fa-bookmark','fa-bookmark-o','fa-briefcase','fa-btc','fa-bug','fa-building','fa-building-o','fa-bullhorn','fa-bullseye','fa-bus','fa-cab','fa-calculator','fa-calendar','fa-calendar-o','fa-camera','fa-camera-retro','fa-car','fa-caret-down','fa-caret-left','fa-caret-right','fa-caret-square-o-down','fa-caret-square-o-left','fa-caret-square-o-right','fa-caret-square-o-up','fa-caret-up','fa-cc','fa-cc-amex','fa-cc-discover','fa-cc-mastercard','fa-cc-paypal','fa-cc-stripe','fa-cc-visa','fa-certificate','fa-chain','fa-chain-broken','fa-check','fa-check-circle','fa-check-circle-o','fa-check-square','fa-check-square-o','fa-chevron-circle-down','fa-chevron-circle-left','fa-chevron-circle-right','fa-chevron-circle-up','fa-chevron-down','fa-chevron-left','fa-chevron-right','fa-chevron-up','fa-child','fa-circle','fa-circle-o','fa-circle-o-notch','fa-circle-thin','fa-clipboard','fa-clock-o','fa-close','fa-cloud','fa-cloud-download','fa-cloud-upload','fa-cny','fa-code','fa-code-fork','fa-codepen','fa-coffee','fa-cog','fa-cogs','fa-columns','fa-comment','fa-comment-o','fa-comments','fa-comments-o','fa-compass','fa-compress','fa-copy','fa-copyright','fa-credit-card','fa-crop','fa-crosshairs','fa-css3','fa-cube','fa-cubes','fa-cut','fa-cutlery','fa-dashboard','fa-database','fa-dedent','fa-delicious','fa-desktop','fa-deviantart','fa-digg','fa-dollar','fa-dot-circle-o','fa-download','fa-dribbble','fa-dropbox','fa-drupal','fa-edit','fa-eject','fa-ellipsis-h','fa-ellipsis-v','fa-empire','fa-envelope','fa-envelope-o','fa-envelope-square','fa-eraser','fa-eur','fa-euro','fa-exchange','fa-exclamation','fa-exclamation-circle','fa-exclamation-triangle','fa-expand','fa-external-link','fa-external-link-square','fa-eye','fa-eye-slash','fa-eyedropper','fa-facebook','fa-facebook-square','fa-fast-backward','fa-fast-forward','fa-fax','fa-female','fa-fighter-jet','fa-file','fa-file-archive-o','fa-file-audio-o','fa-file-code-o','fa-file-excel-o','fa-file-image-o','fa-file-movie-o','fa-file-o','fa-file-pdf-o','fa-file-photo-o','fa-file-picture-o','fa-file-powerpoint-o','fa-file-sound-o','fa-file-text','fa-file-text-o','fa-file-video-o','fa-file-word-o','fa-file-zip-o','fa-files-o','fa-film','fa-filter','fa-fire','fa-fire-extinguisher','fa-flag','fa-flag-checkered','fa-flag-o','fa-flash','fa-flask','fa-flickr','fa-floppy-o','fa-folder','fa-folder-o','fa-folder-open','fa-folder-open-o','fa-font','fa-forward','fa-foursquare','fa-frown-o','fa-futbol-o','fa-gamepad','fa-gavel','fa-gbp','fa-ge','fa-gear','fa-gears','fa-gift','fa-git','fa-git-square','fa-github','fa-github-alt','fa-github-square','fa-gittip','fa-glass','fa-globe','fa-google','fa-google-plus','fa-google-plus-square','fa-google-wallet','fa-graduation-cap','fa-group','fa-h-square','fa-hacker-news','fa-hand-o-down','fa-hand-o-left','fa-hand-o-right','fa-hand-o-up','fa-hdd-o','fa-header','fa-headphones','fa-heart','fa-heart-o','fa-history','fa-home','fa-hospital-o','fa-html5','fa-ils','fa-image','fa-inbox','fa-indent','fa-info','fa-info-circle','fa-inr','fa-instagram','fa-institution','fa-ioxhost','fa-italic','fa-joomla','fa-jpy','fa-jsfiddle','fa-key','fa-keyboard-o','fa-krw','fa-language','fa-laptop','fa-lastfm','fa-lastfm-square','fa-leaf','fa-legal','fa-lemon-o','fa-level-down','fa-level-up','fa-life-bouy','fa-life-buoy','fa-life-ring','fa-life-saver','fa-lightbulb-o','fa-line-chart','fa-link','fa-linkedin','fa-linkedin-square','fa-linux','fa-list','fa-list-alt','fa-list-ol','fa-list-ul','fa-location-arrow','fa-lock','fa-long-arrow-down','fa-long-arrow-left','fa-long-arrow-right','fa-long-arrow-up','fa-magic','fa-magnet','fa-mail-forward','fa-mail-reply','fa-mail-reply-all','fa-male','fa-map-marker','fa-maxcdn','fa-meanpath','fa-medkit','fa-meh-o','fa-microphone','fa-microphone-slash','fa-minus','fa-minus-circle','fa-minus-square','fa-minus-square-o','fa-mobile','fa-mobile-phone','fa-money','fa-moon-o','fa-mortar-board','fa-music','fa-navicon','fa-newspaper-o','fa-openid','fa-outdent','fa-pagelines','fa-paint-brush','fa-paper-plane','fa-paper-plane-o','fa-paperclip','fa-paragraph','fa-paste','fa-pause','fa-paw','fa-paypal','fa-pencil','fa-pencil-square','fa-pencil-square-o','fa-phone','fa-phone-square','fa-photo','fa-picture-o','fa-pie-chart','fa-pied-piper','fa-pied-piper-alt','fa-pinterest','fa-pinterest-square','fa-plane','fa-play','fa-play-circle','fa-play-circle-o','fa-plug','fa-plus','fa-plus-circle','fa-plus-square','fa-plus-square-o','fa-power-off','fa-print','fa-puzzle-piece','fa-qq','fa-qrcode','fa-question','fa-question-circle','fa-quote-left','fa-quote-right','fa-ra','fa-random','fa-rebel','fa-recycle','fa-reddit','fa-reddit-square','fa-refresh','fa-remove','fa-renren','fa-reorder','fa-repeat','fa-reply','fa-reply-all','fa-retweet','fa-rmb','fa-road','fa-rocket','fa-rotate-left','fa-rotate-right','fa-rouble','fa-rss','fa-rss-square','fa-rub','fa-ruble','fa-rupee','fa-save','fa-scissors','fa-search','fa-search-minus','fa-search-plus','fa-send','fa-send-o','fa-share','fa-share-alt','fa-share-alt-square','fa-share-square','fa-share-square-o','fa-shekel','fa-sheqel','fa-shield','fa-shopping-cart','fa-sign-in','fa-sign-out','fa-signal','fa-sitemap','fa-skype','fa-slack','fa-sliders','fa-slideshare','fa-smile-o','fa-soccer-ball-o','fa-sort','fa-sort-alpha-asc','fa-sort-alpha-desc','fa-sort-amount-asc','fa-sort-amount-desc','fa-sort-asc','fa-sort-desc','fa-sort-down','fa-sort-numeric-asc','fa-sort-numeric-desc','fa-sort-up','fa-soundcloud','fa-space-shuttle','fa-spinner','fa-spoon','fa-spotify','fa-square','fa-square-o','fa-stack-exchange','fa-stack-overflow','fa-star','fa-star-half','fa-star-half-empty','fa-star-half-full','fa-star-half-o','fa-star-o','fa-steam','fa-steam-square','fa-step-backward','fa-step-forward','fa-stethoscope','fa-stop','fa-strikethrough','fa-stumbleupon','fa-stumbleupon-circle','fa-subscript','fa-suitcase','fa-sun-o','fa-superscript','fa-support','fa-table','fa-tablet','fa-tachometer','fa-tag','fa-tags','fa-tasks','fa-taxi','fa-tencent-weibo','fa-terminal','fa-text-height','fa-text-width','fa-th','fa-th-large','fa-th-list','fa-thumb-tack','fa-thumbs-down','fa-thumbs-o-down','fa-thumbs-o-up','fa-thumbs-up','fa-ticket','fa-times','fa-times-circle','fa-times-circle-o','fa-tint','fa-toggle-down','fa-toggle-left','fa-toggle-off','fa-toggle-on','fa-toggle-right','fa-toggle-up','fa-trash','fa-trash-o','fa-tree','fa-trello','fa-trophy','fa-truck','fa-try','fa-tty','fa-tumblr','fa-tumblr-square','fa-turkish-lira','fa-twitch','fa-twitter','fa-twitter-square','fa-umbrella','fa-underline','fa-undo','fa-university','fa-unlink','fa-unlock','fa-unlock-alt','fa-unsorted','fa-upload','fa-usd','fa-user','fa-user-md','fa-users','fa-video-camera','fa-vimeo-square','fa-vine','fa-vk','fa-volume-down','fa-volume-off','fa-volume-up','fa-warning','fa-wechat','fa-weibo','fa-weixin','fa-wheelchair','fa-wifi','fa-windows','fa-won','fa-wordpress','fa-wrench','fa-xing','fa-xing-square','fa-yahoo','fa-yelp','fa-yen','fa-youtube','fa-youtube-play','fa-youtube-square' );
}




/**
 * Output a Youtube, Vimeo or Wistia video
 *
 * @see PremiseField 'video' type
 *
 * @link https://developers.google.com/youtube/iframe_api_reference
 * @link http://stackoverflow.com/questions/5830387/how-to-find-all-youtube-video-ids-in-a-string-using-a-regex
 * @link https://developer.vimeo.com/player/embedding
 * @link https://wistia.com/doc/embedding
 *
 * @since 1.3
 *
 * @param  string $video Video URL or ID.
 * @param  array  $args  array of arguments to pass as JS object to the premiseLoadYouTube().
 *
 * @return string        HTML for video
 */
function premise_output_video( $video, $args = array() ) {

	static $video_count = 1,
		$js_included = false;

	if ( empty( $video ) || ! is_string( $video ) ) {
		return '';
	}

	$video_id = '';

	// Extract Youtube video ID from URL.
	if ( strpos( $video, 'youtu' ) ) {

		// http://stackoverflow.com/questions/5830387/how-to-find-all-youtube-video-ids-in-a-string-using-a-regex
		$video_id = preg_replace( '~(?#!js YouTubeId Rev:20160125_1800)
			# Match non-linked youtube URL in the wild. (Rev:20130823)
			https?://          # Required scheme. Either http or https.
			(?:[0-9A-Z-]+\.)?  # Optional subdomain.
			(?:                # Group host alternatives.
			  youtu\.be/       # Either youtu.be,
			| youtube          # or youtube.com or
			  (?:-nocookie)?   # youtube-nocookie.com
			  \.com            # followed by
			  \S*?             # Allow anything up to VIDEO_ID,
			  [^\w\s-]         # but char before ID is non-ID char.
			)                  # End host alternatives.
			([\w-]{11})        # $1: VIDEO_ID is exactly 11 chars.
			(?=[^\w-]|$)       # Assert next char is non-ID or EOS.
			(?!                # Assert URL is not pre-linked.
			  [?=&+%\w.-]*     # Allow URL (query) remainder.
			  (?:              # Group pre-linked alternatives.
			    [\'"][^<>]*>   # Either inside a start tag,
			  | </a>           # or inside <a> element text contents.
			  )                # End recognized pre-linked alts.
			)                  # End negative lookahead assertion.
			[?=&+%\w.-]*       # Consume any URL (query) remainder.
			~ix', '$1',
			$video );

		$video_type = 'youtube';

	} elseif ( strpos( $video, 'vimeo' ) ) {

		if ( preg_match( '~(?<=/)([\d]+)~', $video, $matches ) ) {
			$video_id = $matches[0];
		}

		$video_type = 'vimeo';

	} elseif ( strpos( $video, 'wistia' ) ) {

		if ( preg_match( '~(?<=/)([\w-]{10})~', $video, $matches ) ) {
 			$video_id = $matches[0];
 		}

		$video_type = 'wistia';

	} else {

		$video_id = $video;

		if ( (string) (int) $video_id === $video_id ) {

			// Vimeo ID is integer.
			$video_type = 'vimeo';

		} elseif ( strlen( $video_id ) < 11 ) {

			// Wistia ID is 10 char long.
			$video_type = 'wistia';
		} else {

			// Youtube ID is 11 char long.
			$video_type = 'youtube';
		}
	}

	if ( ! $video_id ) {
		return '';
	}

	if ( $video_type === 'youtube' ) {

		$yt_args = '';

		if ( is_array( $args ) && ( 0 < count( $args ) ) ) {
			$yt_args = json_encode( $args );
		}

		$video_cont_id = $video_count++;

		$html = '<div class="premise-video premise-youtube-video premise-aspect-ratio-el" data-video-id="' . $video_id . '" id="premise-youtube-video-' . $video_cont_id . '"></div>';

	} elseif ( $video_type === 'vimeo' ) {

		$html = '<iframe src="//player.vimeo.com/video/' . $video_id . '" class="premise-video premise-vimeo-video premise-aspect-ratio-el" id="premise-vimeo-video-' . $video_count++ .'" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';

	} else {

		$html = '<iframe src="//fast.wistia.net/embed/iframe/' . $video_id . '"
			class="premise-video premise-wistia-video premise-aspect-ratio-el" id="premise-wistia-video-' . $video_count++ .'"
			width="620" height="349"
			allowtransparency="true" frameborder="0" scrolling="no" name="wistia_embed"
			allowfullscreen mozallowfullscreen webkitallowfullscreen oallowfullscreen msallowfullscreen></iframe>';

		$html .= '<script src="//fast.wistia.net/assets/external/E-v1.js" async></script>';
	}

	return '<div class="premise-aspect-ratio-16-9">' . $html . '</div>';
}




/**
 * Premise tooltip
 *
 * CSS tooltip
 *
 * @see premise-field.css
 *
 * @since 1.2
 *
 * @param  string $tooltip_text Tooltip text.
 *
 * @return string Tooltip HTML or empty string if empty( $tooltip_text )
 */
function premise_tooltip( $tooltip_text ) {

	if ( empty( $tooltip_text ) ) {

		return '';
	}

	return ' <span class="premise-tooltip"><span class="premise-tooltip-inner"><i>' .
		esc_attr( $tooltip_text ) . '</i></span></span>';
}



/**
 * get the html for the font awesome icons including the container. This function is used to load icons on fa_icon field.
 *
 * @return string html for font awesome icons.
 */
function premise_get_fa_icons_html() {
	$icons = '<div class="premise-field-fa-icons-container" style="display:none;">
		<div class="premise-field-fa-icons-container-inner">
			<ul class="premise-field-fa-icons-ul">';
				foreach ( (array) premise_get_fa_icons() as $icon ) {
					$icons .= '<li class="premise-field-fa-icon-li premise-inline-block">
						<a href="javascript:;" class="premise-field-fa-icon-anchor premise-block" data-icon="' . esc_attr( $icon ) . '">
							<i class="fa fa-fw ' . esc_attr( $icon ) . '"></i>
						</a>
					</li>';
				}
			$icons .= '</ul>
		</div>
	</div>';

	return $icons;
}




/**
 * load the font awesome UI via ajax. This function is called by the jQuery pugin premiseFieldFaIcon
 *
 * @return string html for font awesome icons
 */
function premise_get_fa_icons_html_ajax() {
	echo premise_get_fa_icons_html();
	die();
}
