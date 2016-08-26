# Premise CSS Framework

Write markup and prototype quickly with Premise WP CSS Framework. It consists of a series of classes that apply common CSS styles to your markup. This allows you to write less CSS and cleaner HTML.  Take a look at some examples and use cases below, for full documentation visit [Premise WP CSS Framework](https://premisewp.com/documentation/premise-wp-css-framework/).

## Examples

#### Column Grid

The column grid was designed to build grids where all columns within a row are meant to have the same width.
Using the classes `col2`, `col3`,`col4`,`col5` or `col6` you can build a row that contains up to 6 columns.

The following markup will be styled as a row with 3 columns, where all columns have the same width.

```css
<div class="premise-row">
	<div class="col3"></div>
	<div class="col3"></div>
	<div class="col3"></div>
</div>
```

#### Fluid Grid

Fluid grids allow you style up to 12 columns per row and not all columns need to have the same width.
You can size columns within a fluid row by applying a class from `span1` to `span12`. Each `span` class will determine
how many columns that element should span across.

Take alook at the following example. It creates a row with 3 columns were the middle column occupies half of the row and the first and third columns occupy a quarter of it.

```css
<div class="premise-row">
	<div class="span3"></div>
	<div class="span6"></div>
	<div class="span3"></div>
</div>
```

#### Inline Grid

Inline grids do not use floats like the fluid and row grid do. This is great when you want to do things like center columns.

This example will style a row 3 columns on top and 2 columns centered right below it - all with different size widths.

```css
<div class="premise-inline premise-align-center">
	<div class="span1"></div>
	<div class="span4"></div>
	<div class="span7"></div>
	<!-- Centered columns -->
	<div class="span3"></div>
	<div class="span3"></div>
</div>
```

