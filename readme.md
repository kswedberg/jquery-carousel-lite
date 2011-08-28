# jCarouselLite

jQuery plugin to navigate images/any content in a carousel style widget.

Created by Ganeshji Marwaha. Enhanced by Karl Swedberg.

Creates a carousel-style navigation widget for images/any-content from a simple HTML markup.

The HTML markup that is used to build the carousel can be as simple as...

```html
<div class="carousel">
   <ul>
       <li><img src="image/1.jpg" alt="1"></li>
       <li><img src="image/2.jpg" alt="2"></li>
       <li><img src="image/3.jpg" alt="3"></li>
   </ul>
</div>
```

As you can see, this snippet is nothing but a simple div containing an unordered list of images.
You don't need any special "class" attribute, or a special "css" file for this plugin.
I am using a class attribute just for the sake of explanation here.

To navigate the elements of the carousel, you need some kind of navigation buttons.
For example, you will need a "previous" button to go backward, and a "next" button to go forward.
This need not be part of the carousel "div" itself. It can be any element in your page.
Let's assume that the following elements in your document can be used as next and prev buttons...

```html
<button class="prev">&lt;&lt;</button>
<button class="next">&gt;&gt;</button>
```

Now, all you need to do is call the carousel component on the div element that represents it, and pass in the
navigation buttons as options.

```javascript
$(".carousel").jCarouselLite({
  btnNext: ".next",
  btnPrev: ".prev"
});
```

That's it, you would have now converted your raw div, into a magnificent carousel.

There are quite a few other options that you can use to customize it though. Each will be explained with an example below.

## Options

You can specify all the options shown below as an options object param.

### `btnPrev`, `btnNext` : string - no defaults

example:

```javascript
$(".carousel").jCarouselLite({
  btnNext: ".next",
  btnPrev: ".prev"
});
```

Creates a basic carousel. Clicking "btnPrev" navigates backwards and "btnNext" navigates forward.

### `btnGo` - array - no defaults

example

```javascript
$(".carousel").jCarouselLite({
  btnNext: ".next",
  btnPrev: ".prev",
  btnGo: [".0", ".1", ".2"]
});
```

If you don't want next and previous buttons for navigation, instead you prefer custom navigation based on
the item number within the carousel, you can use this option. Just supply an array of selectors for each element
in the carousel. The index of the array represents the index of the element. In other words, if the
first element in the array is ".0", when the element represented by ".0" is clicked, the carousel
will slide to the first element and so on and so forth. This feature is very powerful. For example, i made a tabbed
interface out of it by making my navigation elements styled like tabs in css. As the carousel is capable of holding
any content, not just images, you can have a very simple tabbed navigation in minutes without using any other plugin.

The best part is that, the tab will "slide" based on the provided effect.

### `mouseWheel` : boolean - default is false

example

```javascript
$(".carousel").jCarouselLite({
  mouseWheel: true
});
```

The carousel can also be navigated using the mouse wheel interface of a scroll mouse instead of using buttons. To get this feature working, you have to do 2 things.

* you have to include the mouse-wheel plugin from Brandon Aaron (http://github.com/brandonaaron/).
* you will have to set the option "mouseWheel" to true. That's it, now you will be able to navigate your carousel using the mouse wheel. Using buttons and mouseWheel or not mutually exclusive. You can still have buttons for navigation as well. They complement each other. To use both together, just supply the options required for both as shown below.

example

```javascript
$(".carousel").jCarouselLite({
  btnNext: ".next",
  btnPrev: ".prev",
  mouseWheel: true
});
```

### `auto` : number - default is null, meaning autoscroll is disabled by default

example

```javascript
$(".carousel").jCarouselLite({
  auto: 800,
  speed: 500
});
```

You can make your carousel auto-navigate itself by specfying a millisecond value in this option. The value you specify is the amount of time between 2 slides. The default is null, and that disables auto scrolling.
Specify this value and magically your carousel will start auto scrolling.

### `speed` : number - 200 is default

example

```javascript
$(".carousel").jCarouselLite({
  btnNext: ".next",
  btnPrev: ".prev",
  speed: 800
});
```

Specifying a speed will slow-down or speed-up the sliding speed of your carousel. Try it out with
different speeds like 800, 600, 1500 etc. Providing 0, will remove the slide effect.

### `easing` : string - no easing effects by default.

example

```javascript
$(".carousel").jCarouselLite({
  btnNext: ".next",
  btnPrev: ".prev",
  easing: "bounceout"
});
```

You can specify any easing effect. Note: You need easing plugin for that. Once specified,
the carousel will slide based on the provided easing effect.

### `vertical` : boolean - default is false

example

```javascript
$(".carousel").jCarouselLite({
  btnNext: ".next",
  btnPrev: ".prev",
  vertical: true
});
```

Determines the direction of the carousel. true, means the carousel will display vertically. The next and
prev buttons will slide the items vertically as well. The default is false, which means that the carousel will
display horizontally. The next and prev items will slide the items from left-right in this case.

### `circular` : boolean - default is true

example

```javascript
$(".carousel").jCarouselLite({
  btnNext: ".next",
  btnPrev: ".prev",
  circular: false
});
```

Setting it to `true` enables circular navigation. This means, if you click "next" after you reach the last
element, you will automatically slide to the first element and vice versa. If you set circular to false, then
if you click on the "next" button after you reach the last element, you will stay in the last element itself
and similarly for "previous" button and first element.

### `visible` : number - default is 3

example

```javascript
$(".carousel").jCarouselLite({
  btnNext: ".next",
  btnPrev: ".prev",
  visible: 4
});
```

This specifies the number of items visible at all times within the carousel. The default is 3.
You are even free to experiment with real numbers. Eg: "3.5" will have 3 items fully visible and the
last item half visible. This gives you the effect of showing the user that there are more images to the right.

### `start` : number - default is 0

example

```javascript
$(".carousel").jCarouselLite({
  btnNext: ".next",
  btnPrev: ".prev",
  start: 2
});
```

You can specify from which item the carousel should start. Remember, the first item in the carousel
has a start of 0, and so on.

### `scroll` : number - default is 1

example

```javascript
$(".carousel").jCarouselLite({
  btnNext: ".next",
  btnPrev: ".prev",
  scroll: 2
});
```

The number of items that should scroll/slide when you click the next/prev navigation buttons. By
default, only one item is scrolled, but you may set it to any number. Eg: setting it to "2" will scroll
2 items when you click the next or previous buttons.

### `beforeStart`, `afterEnd` : function - callbacks

example

```javascript
$(".carousel").jCarouselLite({
  btnNext: ".next",
  btnPrev: ".prev",
  beforeStart: function(a) {
    alert("Before animation starts:" + a);
  },
  afterEnd: function(a) {
    alert("After animation ends:" + a);
  }
});
```

If you want to do some logic before the slide starts and after the slide ends, you can
register these 2 callbacks. The functions will be passed an argument that represents an array of elements that
are visible at the time of callback.

## Events

The plugin binds a few custom event handlers to the wrapping `div` element. They can be triggered at any time by using jQuery's event triggering mechanism. If other custom events are bound to the same elements, you may wish to trigger these using the `.jc` namespace. For example, instead of `.trigger("pauseCarousel")`, you could write `.trigger("pauseCarousel.jc")`.

### `pauseCarousel`

example

```javascript
$(".carousel").trigger("pauseCarousel")
```

Pauses an autoscrolling carousel until `resumeCarousel` is triggered. Note: if the `pause` option is set to `true`, then the `resumeCarousel` event is automatically triggered when the mouse leaves the carousel div.

###  `resumeCarousel`

example

```javascript
$(".carousel").trigger("pauseCarousel")
```

Resumes an autoscrolling carousel after having been paused.

### `endCarousel`

example

```javascript
$(".carousel").trigger("endCarousel")
```

Stops the carousel from functioning and removes all events and data bound by the plugin.

### `go`

example

```javascript
$(".carousel").trigger("go", 3)
```

```javascript
$(".carousel").trigger("go", "+=2")
```
When triggering the `go` custom event, you can pass in a number or a string representing a relative number ("+=n" or "-=n") to specify which item in the carousel to go to. The default is "+=1" (i.e. the next item).

