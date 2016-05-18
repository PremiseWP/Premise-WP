# Premise WP JS Library #

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