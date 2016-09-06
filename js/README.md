# Premise WP JS Library #

This document is meant to explain some of the most useful and common use for Premise WP JS Library. The Premise JS Library offers a series of jQuery plugins and functions that can be used through out your project to help you develop faster.

## premiseFieldFaIcon( options ) ##

`premiseFieldFaIcon()` is a jQuery plugin that inserts the Premise Fa Icon UI into any input field to allow users to select a Font Awesome icon.

#### Options ####

This plugin currently does not support any options.

#### Examples ####

```JS
// Reference our element
$( 'element_selector' ).premiseFieldFaIcon();
```
==========================================================================================================================================

## premiseFieldWpMedia( options ) ##

#### Options ####

**multiple** `(boolean) default: false` Allow multiple files to be uploaded at the same time.
**imageSize** `(boolean) default: 'full' options: 'full', 'medium', 'thumbnail'` The size that you want the image in. Can use custom image sizes created by themes or plugins.
**return** `(boolean) default: 'url' options: 'url', 'id'` Whether to return the url or the id for the file.
**preview** `(boolean) default: false` Whther to preview the image one uploaded.
**wrap** `(boolean) default: true` Whther to wrap the input element in a div.

#### Examples ####

```JS
var inputField = $( 'input_selector' ); // has to be called on an input[type="text"] element

// Allow user to upload multiple images and display a preview of them.
inputField.premiseWpMedia({
	multiple: true,
	preview: true,
});
```

**Note** if nothing happens when you click on the upload button and when you inspect the console you see this error: 'wp.media object is undefined. Make sure Wordpress Media Uploader Scripts are enqueued.', this means that the WP uploader scripts has not loaded. Just call `wp_enqueue_media()` in your php file. This should resolve the issue.

==========================================================================================================================================

## premiseLoadYouTube( options ) ##

`premiseLoadYouTube()` is a jQuery plugin that loads a YouTube video into a `div`.

#### Options ####

Options are passed in the same way you pass options to the [YouTube iframe API](https://developers.google.com/youtube/iframe_api_reference).

#### Quick Options ####

Quick options are additional options that are not included in the YouTube API but that we think should be available for ease of use when playing back a video. These options are meant to make it easy to pass common settings like muting a video, or changing the volume, or enabling the video to loop. Here is a lits of quick options available and what each does.

**autoplay** `(boolean) default: 0` Play video when ready.
**loop** `(boolean) default: 0` Loop video(s).
**playlist** `(array) default: []` Play multiple videos. *Note: You can also pass comma separated video ids directly to the videoId argument.*
**mute** `(boolean) default: false` Whether to mute the video when ready.
**volume** `(integer) default: -1 options: 0 - 100` Set the volume for the video when ready.

#### Examples ####

```JS
// Reference our element. We will use throughout the examples below.
var video = $( 'element_selector' );

// Load and autoplay video
video.premiseLoadYouTube({
	videoId: 'fFdZtJAVlQY',
	autoplay: 1,
});

// Use YouTube API directly
video.premiseLoadYouTube({
	videoId: 'fFdZtJAVlQY',
	height: '390',
	width: '640',
	playerVars: { autoplay: 1 },
	events: {
		onReady: myOnReadyFunction,
		onStateChange: myOnStateChangeFunction,
	}
});
```

==========================================================================================================================================

## premiseFieldDuplicate( options ) ##

#### Options ####

**onCopy** `(function) default: see code` Copy field callback. Tries to increment the ID of the input; Increments the `.increment` integers. Removes the add button from the copied field.
**onRemove** `(function) default: see code` Remove field callback. Tries to show the add button for the last input.
**addButton** `(string) default: <i class="premise-field-duplicate-add-button fa fa-plus"></i>` Add / clone button HTML (Font Awesome plus icon).
**removeButton** `(string) default: <i class="premise-field-duplicate-remove-button fa fa-remove"></i>` Remove button HTML (Font Awesome remove icon).

#### Examples ####

```PHP
premise_field( 'select',
	array(
		'name' => 'input3',
		'value' => 'option2',
		'label' => 'Select input <span class="increment">1</span>',
		'options' => array( 'Option 1' => 'option1', 'Option 2' => 'option2' ),
		'wrapper_class' => 'premise-field-duplicate-select',
	)
);
```

```JS
$('.premise-field-duplicate-select').premiseFieldDuplicate();
```

**Note** if nothing happens when you click on the upload button and when you inspect the console you see this error: 'wp.media object is undefined. Make sure Wordpress Media Uploader Scripts are enqueued.', this means that the WP uploader scripts has not loaded. Just call `wp_enqueue_media()` in your php file. This should resolve the issue.

