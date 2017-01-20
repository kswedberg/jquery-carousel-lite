# jCarouselLite

By [Karl Swedberg](https://karlswedberg.com/), based on the original by [Ganeshji Marwaha](gmarwaha.com).

This jQuery plugin creates a carousel-style navigation widget for images, or any content, from simple HTML markup.

## Related Projects

Because jCarouselLite is relatively "light," it doesn't include a number of features that you might want for your project.
Also, the responsive feature is a little hacky. If the plugin doesn't suit your needs, please consider one of the following:

* [Cycle2](http://jquery.malsup.com/cycle2/) by Mike Alsup
* [Slick Carousel](http://kenwheeler.github.io/slick/) by Ken Wheeler

## Installation

Choose one of the following ways to put the plugin in your project:

* Via bower: `bower install jquery-carousel-lite`
* Via npm: `npm install jcarousellite`
* Via github: Download https://github.com/kswedberg/jquery-carousel-lite/blob/master/jcarousellite.js and place it somewhere in your project
* Via rawgit: Directly reference the file with `<script src="https://rawgit.com/kswedberg/jquery-carousel-lite/master/jcarousellite.js">`


## Getting Started

### HTML

The HTML markup to build the carousel can be as simple as the following:

```html
<div class="carousel">
   <ul>
       <li><img src="image/1.jpg" alt="1"></li>
       <li><img src="image/2.jpg" alt="2"></li>
       <li><img src="image/3.jpg" alt="3"></li>
   </ul>
</div>
```

This snippet is nothing but a simple div containing an unordered list of images.
The "carousel" class for the div here is **just for the sake of explanation**.
You can use any class — or none at all — for any of the elements.

To manually navigate the elements of the carousel, you can include some kind of navigation buttons.
For example, you can have a "previous" button to go backward and a "next" button to go forward.
They need not be part of the carousel `div` itself; they can be any element in your document.
For example, let's assume you want the following elements to be used as prev and next buttons:

```html
<button class='prev'> &raquo; </button>
<button class='next'> &laquo; </button>
```

### CSS

With the default settings, the carousel probably needs only a single CSS rule in your stylesheet
(again, using `<div class="carousel">` as our example):

```css
div.carousel {
  overflow: hidden;
}
```

### jQuery

All you need to do is call the carousel component on the `div` element that represents it and pass in the
navigation buttons as options.

```javascript
$('div.carousel').jCarouselLite({
  btnNext: '.next',
  btnPrev: '.prev'
});
```

There are quite a few other settings that you can use to customize it. Each will be explained with an example below.

* [Options](#options)
* [Callback Options](#callbacks)
* [Events](#events)
* [Responsive Carousels](#responsive-carousels)

## Demo

You can view a bare-bones demo at [kswedberg.github.io/jquery-carousel-lite/demo/](https://kswedberg.github.io/jquery-carousel-lite/demo/)

## Options <a id="options">

You can specify all the options shown below as object properties.

### `containerSelector` : string - default is "ul"

*New as of jCarouselLite 1.9.* Allows the "ul" container to be customized using any valid selector expression to match elements against. The plugin will use the *first* element within the carousel div that matches the selector.

```javascript
$('div.carousel').jCarouselLite({
  containerSelector: '.my-slide-container'
});
```

### `itemSelector` : string - default is "li"

*New as of jCarouselLite 1.9.* Allows the "li" slides to be customized using any valid selector expression to match elements against. The plugin will use elements that match the `itemSelector` string **and** are direct children of the `containerSelector`.

```javascript
$('div.carousel').jCarouselLite({
  itemSelector: '.my-slide'
});
```

### `responsive` : Boolean - default is false

New as of jCarouselLite 1.8. Allows the height and width of the carousel and its list items to be reset when the window size changes (if `autoCSS` and/or `autoWidth` set to `true`). Adds an event handler on the window resize event that triggers the `refreshCarousel` custom event when the window stops being resized. See [Responsive Carousels](#responsive-carousels) for more information.

### `swipe` : Boolean - default is true

New as of jCarouselLite 1.8. Enables the carousel to respond to touch input — namely single-touch swiping motions.

### swipeThresholds : Object - default is { x: 80, y: 120, time: 150 }

New as of jCarouselLite 1.8 The three swipeThresholds properties refer to movement along the x and y axes (in pixels) and the duration of that movement (in milliseconds) from touch start to touch end. The combination of these properties determine when a directional swipe has occurred and, thus, when the carousel should scroll.

### `preventTouchWindowScroll`: Boolean - default is true

When true (default), prevents vertical scrolling of the document window when swiping on a horizontal carousel.

### `btnPrev`, `btnNext` : String - no defaults

Creates a basic carousel. Clicking "btnPrev" navigates backwards and "btnNext" navigates forward.

```javascript
$('div.carousel').jCarouselLite({
  btnNext: '.next',
  btnPrev: '.prev'
});
```

### `btnGo` : array | jQuery object - no defaults

You can use the `btnGo` option along with the `btnNext` / `btnPrev` buttons or instead of them.

If you supply an array, the index of each item in the array represents the index of the element in the carousel.
In other words, if the first element in the array is ".one," then clicking the element represented by ".one"
will slide the carousel to the first element.

```javascript
$('div.carousel').jCarouselLite({
  btnNext: '.next',
  btnPrev: '.prev',
  btnGo: ['.one', '.two', '.three']
});
```

In the following example, clicking a link within `#carousel-nav` will slide the carousel to the item with an index matching the link's index among the other links.

```javascript
$('div.carousel').jCarouselLite({
  btnGo: $('#carousel-nav a')
});
```

### `autoCSS` : Boolean - default is true

When the `autoCSS` option is set to `false`, the plugin does *not* set any of the initial styles on the carousel elements, allowing you to apply these styles (or a subset of them) yourself in a stylesheet.

```javascript
$('div.carousel').jCarouselLite({
  autoCSS: false
});
```

The following is a generic example of styles set by the plugin when the default `autoCSS: true` is used.

```css
/* the selectors here (div, ul, li) are meant only for example.
   you would, of course, use more specific selectors
   to target your actual carousel elements */

div {
  visibility: visible;
  position: relative;
  z-index: 2;
  /* if the vertical option is set to true, the following would be height */
  width: XXX /* calculated: width of the first li * number of visible items */;
}

ul {
  margin: 0;
  padding: 0;
  position: relative;
  list-style-type: none;
  z-index: 1;

  /* if the vertical option is set to true, the following would be height */
  /* can be any number larger than total combined width of list items */
  width: XXX /* calculated: width of the first li * total number of list items */;

  /* if the vertical option is set to true, the following would be margin-top */
  margin-left: -XXX /* calculdated: -starting item * width of first li */;
}

li {
  overflow: visible /* if vertical: true, overflow is hidden */;
  float: left /* if vertical: true, float is none */;
  width: XXX /*calculated: width of the first li */
  height: XXX /*calculated: height of the first li */
}
```

### `autoWidth`: Boolean - default is false

When the `autoWidth` option is set to `true`, the plugin sets the width of
the `<li>`s and left/top of the `<ul>` based on the width of the `<div>`

### `btnDisabledClass`: String - default is "disabled"

The `btnDisabledClass` value is automatically added to the `btnPrev` or `btnNext` element when a non-circular carousel is at the first or last slide, respectively.

### `activeClass` : String - default is "active"

The `activeClass` value is automatically added to the active slide's class. This allows customized animations within the `beforeStart` and `beforeEnd` callback options.

When the `btnGo` option is set, the element in the `btnGo` set that corresponds to the first currently visible carousel item will have a class added to it. The default `activeClass` is "active," but this can be overridden as shown in the following example:

```javascript
$('div.carousel').jCarouselLite({
  btnGo: $('#carousel-nav a'),
  visible: 2,
  activeClass: 'current'
});
```


### `visibleClass` : String - default is "vis"

When the `btnGo` option is set, the element in the `btnGo` set that corresponds to the currently visible carousel item(s) will have a class added to them. The default `visibleClass` is "vis," but this can be overridden as shown in the following example:

```javascript
$('div.carousel').jCarouselLite({
  btnGo: $('#carousel-nav a'),
  visible: 2,
  visibleClass: 'highlight'
});
```


### `auto` : Boolean | Number - default is false, meaning automatic scrolling is disabled by default

The carousel will navigate by itself if this option is set to `true` or a number greater than 0. If `true`, the carousel will scroll by the number of slides indicated by the `scroll` option (default is 1). If a positive number, it will auto-scroll by that number instead, although clicks on the previous/next button will still cause it to scroll by the `scroll` option's number.

```javascript
$('div.carousel').jCarouselLite({
  auto: true,
  speed: 500
});
```
```javascript
$('div.carousel').jCarouselLite({
  auto: 2,
  scroll: 1,
  visible: 2,
  btnNext: '.next',
  btnPrev: '.prev'
});
```

### `pause`: Boolean - default is true

When both `pause` and `auto` are `true`, scrolling will pause when the mouse enters the carousel and resume when the mouse leaves the carousel.

### `directional`: Boolean - default is false

If the `directional` option is set to `true`, autoscrolling changes direction  when the user clicks the "previous" or "next" button

### `timeout` : Number - default is 4000

When the `auto` option is set to `true` (or a number greater than 0), the carousel automatically transitions after the amount of time specified by the `timeout` option.

```javascript
$('div.carousel').jCarouselLite({
  auto: true,
  timeout: 8000
});
```

### `autoStop` : Number - default is Infinity

The number of iterations before an auto carousel will stop automatically advancing. If the `circular` option is set to `false`, the carousel will not continue advancing after the last item has been reached, even if the number of iterations has not yet reached the `autoStop` value.

### `speed` : Number - default is 200

Specifying a speed will slow down or speed up the sliding speed of your carousel. Providing 0 will remove the slide effect.

```javascript
$('div.carousel').jCarouselLite({
  btnNext: '.next',
  btnPrev: '.prev',
  speed: 800
});
```

### `easing` : String - no easing effects by default.

The default easing of jQuery core, "swing," is used if no easing is specified in the options. You will need an easing plugin if you wish to specify an easing effect other than jQuery's own "swing" or "linear."

```javascript
$('div.carousel').jCarouselLite({
  btnNext: '.next',
  btnPrev: '.prev',
  easing: 'bounceout'
});
```

### `vertical` : Boolean - default is false

Determines the direction of the carousel. If set to `true`, the carousel will display vertically; the next and
prev buttons will slide the items vertically as well. The default is `false`, which means that the carousel will
display horizontally. The next and prev buttons will slide the items from left to right in this case.

```javascript
$('div.carousel').jCarouselLite({
  btnNext: '.next',
  btnPrev: '.prev',
  vertical: true
});
```

### `circular` : Boolean - default is true

Setting it to `true` enables circular navigation. This means, if you click "next" after you reach the last
element, you will automatically slide to the first element and vice versa. If you set circular to false, then
if you click on the "next" button after you reach the last element, you will stay in the last element itself
and similarly for "previous" button and first element.

```javascript
$('div.carousel').jCarouselLite({
  btnNext: '.next',
  btnPrev: '.prev',
  circular: false
});
```

### `visible` : Number - default is 3

This specifies the number of items visible at all times within the carousel. The default is 3.
You may set this option to a fractional number (such as `3.5`), as well.

```javascript
$('div.carousel').jCarouselLite({
  btnNext: '.next',
  btnPrev: '.prev',
  visible: 4
});
```

### `start` : Number - default is 0

You can specify from which item the carousel should start. Remember, the first item in the carousel
has a start of 0, and so on.

```javascript
$('div.carousel').jCarouselLite({
  btnNext: '.next',
  btnPrev: '.prev',
  // start on the *third* item
  start: 2
});
```

### `scroll` : Number - default is 1

The number of items that should scroll/slide when you click the next/prev navigation buttons. By
default, only one item is scrolled, but you may set it to any number. For example, setting it to `2` will scroll
2 items when you click the next or previous buttons.

```javascript
$('div.carousel').jCarouselLite({
  btnNext: '.next',
  btnPrev: '.prev',
  scroll: 2
});
```

### `mouseWheel` : Boolean - default is false

The carousel can also be navigated using the mouse wheel interface of a scroll mouse instead of (or in addition to) using buttons. To enable this feature, you have to do 2 things:

* include the mouse-wheel plugin from Brandon Aaron (http://github.com/brandonaaron/).
* set the option "mouseWheel" to true.

```javascript
$('div.carousel').jCarouselLite({
  mouseWheel: true
});
```

To use the previous/next buttons as well as the scroll wheel, just supply the options required for both:

```javascript
$('div.carousel').jCarouselLite({
  btnNext: '.next',
  btnPrev: '.prev',
  mouseWheel: true
});
```

## Callback Options<a id="callbacks"></a>

### `init` : Function - callback

The init callback function allows you to do some logic for each carousel div before any of the carousel behavior and styles are applied to it.
The function will be passed two arguments:

1. Object representing the result of merging the default settings with the options object passed in when calling .jCarousellite()
2. jQuery Object containing the top-level `<li>` elements in the carousel (useful for checking their length against number of items to be visible at once)

If the function returns `false`, the plugin will skip all the carousel magic for that carousel `<div>`.

```javascript
$('div.carousel').jCarouselLite({
  btnNext: '.next',
  btnPrev: '.prev',
  init: function(opts, $lis) {
    if ($lis.length > opts.visible) {
      $('div.carousel').append('<a class="prevnext prev">previous</a> <a class="prevnext next">next</a>');
    } else {
      return false;
    }
  }
});
```

### `first`, `last` : Function - callbacks

When the `circular` option is set to false you have the option of doing something once the first or last slide has been reached via callbacks.

```javascript
$('div.carousel').jCarouselLite({
  btnNext: '.next',
  btnPrev: '.prev',
  first: function() {
    alert('This is the first slide');
  },
  last: function() {
    alert('This is the last slide');
  }
});
```

### `beforeStart`, `afterEnd` : Function - callbacks

If you want to do some logic before the slide starts and after the slide ends,
you can register these 2 callbacks. Inside the functions, `this` is the
div on which the .jCarouselLite() method is called.
The functions will be passed three arguments:

1. Array of elements that are visible at the time of callback.
2. Boolean indicating whether the direction is forward (`true`) or backward (`false`);
3. Object containing information that differs depending on what triggered the advance. If triggered by clicking one of the `btnGo` elements, for example, the object has two properties: `btnGo`, which references the clicked DOM element, and `btnGoIndex`, presenting the index of the clicked DOM element in relation to the other "btnGo" buttons.

```javascript
$('div.carousel').jCarouselLite({
  btnNext: '.next',
  btnPrev: '.prev',
  beforeStart: function(a, direction) {
    alert('Before animation starts:' + a);
  },
  afterEnd: function(a, direction) {
    alert('After animation ends:' + a);
  }
});
```

## Events <a id="events"></a>

The plugin binds a few custom event handlers to the wrapping `div` element. They can be triggered at any time by using jQuery's event triggering mechanism. If other custom events are bound to the same elements, you may wish to trigger these using the `.jc` namespace. For example, instead of `.trigger("pauseCarousel")`, you could write `.trigger("pauseCarousel.jc")`.

### `pauseCarousel`

Pauses an autoscrolling carousel until `resumeCarousel` is triggered. Note: if the `pause` option is set to `true`, then the `resumeCarousel` event is automatically triggered when the mouse leaves the carousel div.

```javascript
$('div.carousel').trigger('pauseCarousel')
```

###  `resumeCarousel`

Resumes an autoscrolling carousel after having been paused.

```javascript
$('div.carousel').trigger('resumeCarousel')
```

### `stopCarousel`

Stops an autoscrolling carousel in a similar fashion to `pauseCarousel`, with the exception that  `resumeCarousel` will NOT resume the carousel, and neither will the mouse leaving the carousel div.  To resume automatic movement on the carousel, use `startCarousel`.

```javascript
$('div.carousel').trigger('stopCarousel')
```

### `endCarousel`

Stops the carousel from functioning and removes all events and data bound by the plugin.

### `refreshCarousel`

Updates the dimensions of the carousel and, optionally (as of 1.9.1), the plugin's record of items being used in the carousel. When the `responsive` option is set to `true`, the `refreshCarousel` event is triggered automatically when the window stop resizing (it is "debounced" so it doesn't occur repeatedly during resize).

```javascript
// Insert a slide into the carousel.
// Then...
$('div.carousel').trigger('refreshCarousel', '[all]')
```

To get a better sense of dynamically adding slides to a carousel, see this <a href="http://plugins.learningjquery.com/jcarousellite/demo/refresh.html">example of `refreshCarousel`</a>

```javascript
$('div.carousel').trigger('endCarousel')
```

### `go`

When triggering the `go` custom event, you can pass in an integer representing the item in the carousel to go to.

```javascript
$('div.carousel').trigger('go', 3)
```

You may also pass in a string ("+=n" or "-=n") to specify an item relative to the currently active item.

```javascript
$('div.carousel').trigger('go', '+=2')
```

The default is "+=1" (i.e. the next item).

```javascript
$('div.carousel').trigger('go')
```

## Responsive Carousels<a id="responsive-carousels"></a>

The `responsive` option is set to `false` by default. Once you set it to `true`,
you may want to set a few other options to get the desired effect:

### Everything automatic (`autoCSS` is `true` by default, so no need to add it)

```javascript
$('div.carousel').jCarouselLite({
  // autoCSS: true,
  autoWidth: true,
  responsive: true
});
```

### Everything manual (`autoWidth` is `false` by default, so no need to add it)

Your best bet in this situation is to use CSS media queries.

```javascript
$('div.carousel').jCarouselLite({
  autoCSS: false,
  // autoWidth: false,
  responsive: true
});

// Bind your own handler to the `refreshCarousel` custom event,
// which is triggered when the window stops resizing
$('div.carousel').on('refreshCarousel', function() {
  // do something
});
```
