# jCarouselLite

By [Karl Swedberg](http://www.learningjquery.com/), based on the original by [Ganeshji Marwaha](gmarwaha.com).

This jQuery plugin creates a carousel-style navigation widget for images, or any content, from simple HTML markup. Check out a [bare-bones demo](http://plugins.learningjquery.com/jcarousellite/demo/).

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

All you need to do is call the carousel component on the `div` element that represents it and pass in the
navigation buttons as options.

```javascript
$('div.carousel').jCarouselLite({
  btnNext: '.next',
  btnPrev: '.prev'
});
```

There are quite a few other options that you can use to customize it. Each will be explained with an example below.

## Options

You can specify all the options shown below as object properties.

### `responsive` : Boolean - default is true

New as of jCarouselLite 1.8. Allows the height and width of the carousel and its list items to be reset when the window size changes. Adds an event handler on the window resize event to be fired when the window stops being resized. Requires CSS media queries.

### `swipe` : Boolean - default is true

New as of jCarouselLite 1.8. Enables the carousel to respond to touch input — namely single-touch swiping motions.

### swipeThresholds : Object - default is { x: 80, y: 120, time: 150 }

New as of jCarouselLite 1.8 The three swipeThresholds properties refer to movement along the x and y axes (in pixels) and the duration of that movement (in milliseconds) from touch start to touch end. The combination of these properties determine when a directional swipe has occurred and, thus, when the carousel should scroll.

### `btnPrev`, `btnNext` : String - no defaults

Creates a basic carousel. Clicking "btnPrev" navigates backwards and "btnNext" navigates forward.

example:

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

example

```javascript
$('div.carousel').jCarouselLite({
  btnNext: '.next',
  btnPrev: '.prev',
  btnGo: ['.one', '.two', '.three']
});
```

In the following example, clicking a link within `#carousel-nav` will slide the carousel to the item with an index matching the link's index among the other links.

example

```javascript
$('div.carousel').jCarouselLite({
  btnGo: $('#carousel-nav a')
});
```

### `autoCSS` : Boolean - default is true

When the `autoCSS` option is set to `false`, the plugin does *not* set any of the initial styles on the carousel elements, allowing you to apply these styles (or a subset of them) yourself in a stylesheet.

example

```javascript
$('div.carousel').jCarouselLite({
  autoCSS: false
});
```

The following is a generic example of styles set by the plugin when the default `autoCSS: true` is used.

```css
/* the selectors here (div, ul, li) are meant only for example.
   you would,of course, use more specific selectors
   to target your actual carousel elements */

div {
  visibility: visible;
  overflow: hidden;
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

### `activeClass` : String - default is "active"

The `activeClass` value is automatically added to the active slide's class. This allows customized animations within the `beforeStart` and `beforeEnd` callback options.

When the `btnGo` option is set, the element in the `btnGo` set that corresponds to the first currently visible carousel item will have a class added to it. The default `activeClass` is "active," but this can be overridden as shown in the following example:

example

```javascript
$('div.carousel').jCarouselLite({
  btnGo: $('#carousel-nav a'),
  visible: 2,
  activeClass: 'current'
});
```


### `visibleClass` : String - default is "vis"

When the `btnGo` option is set, the element in the `btnGo` set that corresponds to the currently visible carousel item(s) will have a class added to them. The default `visibleClass` is "vis," but this can be overridden as shown in the following example:

example

```javascript
$('div.carousel').jCarouselLite({
  btnGo: $('#carousel-nav a'),
  visible: 2,
  visibleClass: 'highlight'
});
```


### `auto` : Boolean | Number - default is false, meaning automatic scrolling is disabled by default

The carousel will navigate by itself if this option is set to `true` or a number greater than 0. If `true`, the carousel will scroll by the number of slides indicated by the `scroll` option (default is 1). If a positive number, it will auto-scroll by that number instead, although clicks on the previous/next button will still cause it to scroll by the `scroll` option's number.

example

```javascript
$('div.carousel').jCarouselLite({
  auto: true,
  speed: 500
});
```
example

```javascript
$('div.carousel').jCarouselLite({
  auto: 2,
  scroll: 1,
  visible: 2,
  btnNext: '.next',
  btnPrev: '.prev'
});
```

### `timeout` : Number - default is 4000

When the `auto` option is set to `true` (or a number greater than 0), the carousel automatically transitions after the amount of time specified by the `timeout` option.

example

```javascript
$('div.carousel').jCarouselLite({
  auto: true,
  timeout: 8000
});
```

### `speed` : Number - default is 200

Specifying a speed will slow down or speed up the sliding speed of your carousel. Providing 0 will remove the slide effect.

example

```javascript
$('div.carousel').jCarouselLite({
  btnNext: '.next',
  btnPrev: '.prev',
  speed: 800
});
```

### `easing` : String - no easing effects by default.

The default easing of jQuery core, "swing," is used if no easing is specified in the options. You will need an easing plugin if you wish to specify an easing effect other than jQuery's own "swing" or "linear."

example

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

example

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

example

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

example

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

example

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

example

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

example

```javascript
$('div.carousel').jCarouselLite({
  mouseWheel: true
});
```

To use the previous/next buttons as well as the scroll wheel, just supply the options required for both:

example

```javascript
$('div.carousel').jCarouselLite({
  btnNext: '.next',
  btnPrev: '.prev',
  mouseWheel: true
});
```

## Callback Options

### `init` : Function - callback

The init callback function allows you to do some logic for each carousel div before any of the carousel behavior and styles are applied to it.
The function will be passed two arguments:

1. Object representing the result of merging the default settings with the options object passed in when calling .jCarousellite()
2. jQuery Object containing the top-level `<li>` elements in the carousel (useful for checking their length against number of items to be visible at once)

If the function returns `false`, the plugin will skip all the carousel magic for that carousel `<div>`.

example

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

example

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

If you want to do some logic before the slide starts and after the slide ends, you can register these 2 callbacks.
The functions will be passed two arguments:

1. Array of elements that are visible at the time of callback.
2. Boolean indicating whether the direction is forward (`true`) or backward (`false`);

example

```javascript
$('div.carousel').jCarouselLite({
  btnNext: '.next',
  btnPrev: '.prev',
  beforeStart: function(a, direction) {
    alert('Before animation starts:' + a);
  },
  afterEnd: function(a, , direction) {
    alert('After animation ends:' + a);
  }
});
```

## Events

The plugin binds a few custom event handlers to the wrapping `div` element. They can be triggered at any time by using jQuery's event triggering mechanism. If other custom events are bound to the same elements, you may wish to trigger these using the `.jc` namespace. For example, instead of `.trigger("pauseCarousel")`, you could write `.trigger("pauseCarousel.jc")`.

### `pauseCarousel`

Pauses an autoscrolling carousel until `resumeCarousel` is triggered. Note: if the `pause` option is set to `true`, then the `resumeCarousel` event is automatically triggered when the mouse leaves the carousel div.

example

```javascript
$('div.carousel').trigger('pauseCarousel')
```

###  `resumeCarousel`

Resumes an autoscrolling carousel after having been paused.

example

```javascript
$('div.carousel').trigger('resumeCarousel')
```

### `endCarousel`

Stops the carousel from functioning and removes all events and data bound by the plugin.

example

```javascript
$('div.carousel').trigger('endCarousel')
```

### `go`

When triggering the `go` custom event, you can pass in a number or a string representing a relative number ("+=n" or "-=n") to specify which item in the carousel to go to. The default is "+=1" (i.e. the next item).

example

```javascript
$('div.carousel').trigger('go', 3)
```

```javascript
$('div.carousel').trigger('go', '+=2')
```
