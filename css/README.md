# Build Responsive Markup Quickly

Part of being a Wordpress developer is building layouts and styling things in the front end of a website. Sometimes these things can be tedious and repetitive. So we compiled a library of css classes that will make your life easier - It sure makes ours easier every day!

## Making Grids

There are 2 types of grids - Column Grids and Fluid Grids. Column Grids have same width columns per row while Fluid Grids can have columns width different widths in the same row. Columns Grids can create up to 6 columns in a row. Fluid Grids can create up to 12 columns in a row.

##### Column Grids

Grids intended to use equal width columns per row. Here are some examples..

The code below creates a 3 column grid with all columns being the same width ( 1/3 of the row's width ). The class `col3` determines that there should be '3' columns per row. This class can be used with any number from '2 - 6' .i.e. `col2, col3, col4,  col5, col6`. It will create grids with the corresponding number of columns per row.

```html
<div class="pwp-row">
	<div class="col3">Some content..</div>
	<div class="col3">Some content..</div>
	<div class="col3">Some content..</div>
</div>
```

The code below will make a grid with 2 rows - the first row will have 2 columns each of 1/2 of the row's width, the second row will have 4 columns each of 1/4 of the row's width.

```html
<div class="pwp-row">
	<div class="col2">Some content..</div>
	<div class="col2">Some content..</div>
	<div class="col4">Some content..</div>
	<div class="col4">Some content..</div>
	<div class="col4">Some content..</div>
	<div class="col4">Some content..</div>
</div>
```

##### Fluid Grids

Fluid Grids are based on 12 column grids where you assign each column the number of columns you want it to occupy within a row. So on a 12 column grid, if I assign a column the class `span3`, I am saying that I want that column to occupy the width of 3 columns within a row. That would be the equivalent of 1/4 of the row - `12/3 = 4; 3/12 = 0.25`. This class can be used with any number between '1 - 12'. You can see some examples below.

##### The basic syntax

The code below will outpput a 3 column grid with the first column occupying 2 columns, the second 6, and the third 4 columns.

```html
<div class="pwp-row">
	<div class="span2">Some content..</div>
	<div class="span6">Some content..</div>
	<div class="span4">Some content..</div>
</div>
```

##### Flushed Columns

By default `pwp-row` adds a margin to our columns. To avoid this and create columns that are flushed against each other simply add the class `flush-columns` to the `pwp-row` element. Here is an example that will create 4 columns with no margin between them.

*Note:* `flush-columns` currently only works with the Column Grids. It is not supported on the Fluid Grids due to conflicts with responsive layouts.

```html
<div class="pwp-row flush-columns">
	<div class="col4">Some content..</div>
	<div class="col4">Some content..</div>
	<div class="col4">Some content..</div>
	<div class="col4">Some content..</div>
</div>
```

##### Float Columns Right

Typically when responding down, elements on a grid stack up, elemetns on the left move above the elements on the right. To invert this behavior use the class `float-right` on your grid.

In the example below we illustrate a typical use for this class. You have a section on your site with an image on the right and text on the left. But when you view you site on a mobile deive you want the image to move above the text on the left and not the other way around. This will do it..

```html
<div class="pwp-row float-right">
	<div class="span4">An image</div>
	<div class="span8">Some content..</div>
</div>
```

##### Non Responsive Grids

If you want your grid to not be responsive you can add the class `not-responsive` to your grid. This class works for both grid types. It also works with `flush-columns` on Column Grids.

None of the grids below are responsive.

```html
<div class="pwp-row not-responsive">
	<div class="col3">Some content..</div>
	<div class="col3">Some content..</div>
	<div class="col3">Some content..</div>
</div>
```

```html
<div class="pwp-row not-responsive">
	<div class="span2">Some content..</div>
	<div class="span6">Some content..</div>
	<div class="span4">Some content..</div>
</div>
```

```html
<div class="pwp-row flush-columns not-responsive">
	<div class="col4">Some content..</div>
	<div class="col4">Some content..</div>
	<div class="col4">Some content..</div>
	<div class="col4">Some content..</div>
</div>
```

## Inline Elements

Another useful class in the premise css library in the `pwp-inline`, which creates a row with its child elements displayed `inline-block`. Bydefault this is not responsive and it works with the classes `col` and `span` from the grids to size elements. Here is how to use it.

Create a row with 3 different width elements.

```html
<div class="pwp-inline">
	<div class="span2">Some content..</div>
	<div class="span9">Some content..</div>
	<div class="span1">Some content..</div>
</div>
```

Or ceate a row with 4 same width elements.
```html
<div class="pwp-inline">
	<div class="col4">Some content..</div>
	<div class="col4">Some content..</div>
	<div class="col4">Some content..</div>
	<div class="col4">Some content..</div>
</div>
```

## Scroller

If you want to add a row that does not wrap its content but rather, lets you sroll left and right to see the entore row use the class `pwp-scroller`.

The code below will create a row with ten elements all the size of 1/4 of the row. This will allow me to scroll left and right to see all the lements in the row.

```html
<div class="pwp-scroller">
	<div class="span3">Some content..</div>
	<div class="span3">Some content..</div>
	<div class="span3">Some content..</div>
	<div class="span3">Some content..</div>
	<div class="span3">Some content..</div>
	<div class="span3">Some content..</div>
	<div class="span3">Some content..</div>
	<div class="span3">Some content..</div>
	<div class="span3">Some content..</div>
	<div class="span3">Some content..</div>
</div>
```

## Aspect Ratio

To create elements that hold their aspect ratio and are fully responsive use the class `pwp-aspect-ratio`. By defaut this class creates an aspect ratio of `16:9`, to change this, the built in options are `pwp-asect-ratio-4-3` for an aspect ratio of `4:3` or `pwp-aspect-ratio-1-1` for an aspect ratio of `1:1`. You can also use class `pwp-aspect-ratio-16-9` to produce the same results as `pwp-aspect-ratio`. If you want to use your own aspect ratio then use the class `pwp-aspect-ratio` and in your css change the property `paddin-top`.

`pwp-aspect-ratio` depends on its child element to work properly. If the child element you are using is not a `div` add the class `pwp-aspect-ratio-el`. If the child is a `div` you do not need to add this (`pwp-aspect-ratio-el`) class.

*If child is a div:*

```html
<div class="pwp-aspect-ratio">
	<div>Your content here</div>
</div>
```

*If chid is not a div:*

```html
<div class="pwp-aspect-ratio">
	<span class="pwp-aspect-ratio-el">Your content here</span>
</div>
```

## Useful Classes

These classes are random things that can save time css footprint on your project.

Class | Description |
----- | -----------
`.pwp-absolute` | adds `position: absolute`
`.pwp-relative` | adds `position: relative`
`.pwp-fixed` | adds `position: fixed`
`.pwp-block` | adds `display: block`
`.pwp-inline-block` | adds `display: inline-block`
`.pwp-vertical-align-top` | sets `vertical-align: top`
`.pwp-vertical-align-middle` | sets `vertical-align: middle`
`.pwp-vertical-align-bottom` | sets `vertical-align: bottom`
`.pwp-vertical-align-baseline` | sets `vertical-align: baseline`
`.pwp-vertical-align-texttop` | sets `vertical-align: texttop`
`.pwp-vertical-align-textbottom` | sets `vertical-align: textbottom`
`.pwp-border-box` | adds `box-sizing: border-box`
`.pwp-hidden` | sets`visibility: hidden`
`.pwp-responsive` | Makes an image responsive. add this class directly to the image
`.pwp-float-right` | sets`float:right`
`.pwp-float-left` | sets`float:left`
`.pwp-clear` | sets`clear: both`
`.pwp-clear-float` | prevents children within an element to float out of place
`.pwp-align-center` | sets `text-align: center`
`.pwp-align-left` | sets `text-align: left`
`.pwp-align-right` | sets `text-align: right`
`.pwp-align-justify` | sets `text-align: justify`
`.pwp-uppercase` | converts text to uppercase
`.pwp-underline` | underlines text
`.pwp-not-underline` | removes underline from text