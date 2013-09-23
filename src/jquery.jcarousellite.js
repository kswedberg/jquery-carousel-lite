
(function($) {
$.jCarouselLite = {
  version: '1.8.5',
  curr: 0
};

$.fn.jCarouselLite = function(options) {
  var o = $.extend(true, {}, $.fn.jCarouselLite.defaults, options),
      ceil = Math.ceil,
      mabs = Math.abs;

  this.each(function() {

    var beforeCirc, afterCirc, pageNav, pageNavCount, resize,
        prepResize, touchEvents, $btnsGo,
        isTouch = 'ontouchend' in document,
        styles = { div: {}, ul: {}, li: {} },
        firstCss = true,
        running = false,
        animCss = o.vertical ? 'top': 'left',
        aniProps = {},
        sizeProp = o.vertical ? 'height': 'width',
        outerMethod = o.vertical ? 'outerHeight': 'outerWidth',
        self = this,
        div = $(this),
        ul = div.find('ul').eq(0),
        tLi = ul.children('li'),
        tl = tLi.length,
        visibleNum = o.visible,
        // need visibleCeil and visibleFloor in case we want a fractional number of visible items at a time
        visibleCeil = ceil(visibleNum),
        visibleFloor = Math.floor(visibleNum),
        start = Math.min(o.start, tl - 1),
        direction = 1,
        activeBtnOffset = 0,
        activeBtnTypes = {},
        startTouch = {},
        endTouch = {},
        axisPrimary = o.vertical ? 'y' : 'x',
        axisSecondary = o.vertical ? 'x' : 'y';


    var init = o.init.call(this, o, tLi);
    // bail out for this carousel if the o.init() callback returns `false`
    if ( init === false ) {
      return;
    }

    div.data('dirjc', direction);
    div.data(animCss + 'jc', div.css(animCss));

    if (o.circular) {

      beforeCirc = tLi.slice( tl - visibleCeil ).clone(true).each(fixIds);
      afterCirc = tLi.slice( 0, visibleCeil ).clone(true).each(fixIds);
      ul.prepend( beforeCirc )
        .append( afterCirc );
      start += visibleCeil;
      activeBtnOffset = visibleCeil;

    }

    if (o.btnGo && o.btnGo.length) {

      if ( $.isArray(o.btnGo) && typeof o.btnGo[0] === 'string' ) {
        $btnsGo = $( o.btnGo.join() );
      } else {
        $btnsGo = $(o.btnGo);
      }

      $btnsGo.each(function(i) {
        $(this).bind('click.jc', function(event) {
          event.preventDefault();
          return go(o.circular ? visibleNum + i : i);
        });
      });
      activeBtnTypes.go = 1;
    }

    var setActiveBtn = function(i, types) {
      i = ceil(i);

      var activeBtnIndex = (i - activeBtnOffset) % tl,
          visEnd = activeBtnIndex + visibleFloor;

      if ( types.go ) {
        // remove active and visible classes from all the go buttons
        $btnsGo.removeClass(o.activeClass).removeClass(o.visibleClass);
        // add active class to the go button corresponding to the first visible slide
        $btnsGo.eq(activeBtnIndex).addClass(o.activeClass);
        // add visible class to go buttons corresponding to all visible slides
        $btnsGo.slice(activeBtnIndex, activeBtnIndex + visibleFloor).addClass(o.visibleClass);

        if ( visEnd > $btnsGo.length ) {
          $btnsGo.slice(0, visEnd - $btnsGo.length).addClass(o.visibleClass);
        }
      }

      if ( types.pager ) {
        pageNav.removeClass(o.activeClass);
        pageNav.eq( ceil(activeBtnIndex / visibleNum) ).addClass(o.activeClass);
      }
      return activeBtnIndex;
    };

    var li = ul.children('li'),
        itemLength = li.length,
        curr = start;

    $.jCarouselLite.curr = curr;

    var getDimensions = function(reset) {
      var liSize, ulSize, divSize;

      if (reset) {

        styles.div[sizeProp] = '';
        styles.li = {
          width: '', height: ''
        };
        // bail out with the reset styles
        return styles;
      }

      // Full li size(incl margin)-Used for animation
      liSize = li[outerMethod](true);

      // size of full ul(total length, not just for the visible items)
      ulSize = liSize * itemLength;

      // size of entire div(total length for just the visible items)
      divSize = liSize * visibleNum;

      styles.div[sizeProp] = divSize + 'px';
      styles.ul[sizeProp] = ulSize + 'px';
      styles.ul[animCss] = -(curr * liSize) + 'px';
      styles.li = {
        width: li.width(), height: li.height()
      };
      styles.liSize = liSize;
      return styles;
    };


    var setDimensions = function(reset) {
      var css, tmpDivSize;
      var prelimCss = {
        div: {visibility: 'visible', position: 'relative', zIndex: 2, left: '0'},
        ul: {margin: '0', padding: '0', position: 'relative', listStyleType: 'none', zIndex: 1},
        li: {overflow: o.vertical ? 'hidden' : 'visible', 'float': o.vertical ? 'none' : 'left'}
      };

      if (reset) {
        css = getDimensions(true);
        div.css(css.div);
        ul.css(css.ul);
        li.css(css.li);
      }

      css = getDimensions();

      if (o.autoCSS && firstCss) {
        $.extend(true, css, prelimCss);
        firstCss = false;
      }

      if (o.autoWidth) {
        tmpDivSize = parseInt(div.css(sizeProp), 10);
        styles.liSize = tmpDivSize / o.visible;
        css.li[sizeProp] = styles.liSize - (li[outerMethod](true) - parseInt(li.css(sizeProp), 10));

        // Need to adjust other settings to fit with li width
        css.ul[sizeProp] = (styles.liSize * itemLength) + 'px';
        css.ul[animCss] = -(curr * styles.liSize) + 'px';
        css.div[sizeProp] = tmpDivSize;
      }

      if (o.autoCSS) {
        li.css(css.li);
        ul.css(css.ul);
        div.css(css.div);
      }
    };

    setDimensions();

    // set up timed advancer
    var advanceCounter = 0,
        autoStop = iterations(tl, o),
        autoScrollBy = typeof o.auto === 'number' ? o.auto : o.scroll;

    var advancer = function() {
      self.setAutoAdvance = setTimeout(function() {

        if (!autoStop || autoStop > advanceCounter) {
          direction = div.data('dirjc');
          go( curr + (direction * autoScrollBy), {auto: true} );
          advanceCounter++;
          advancer();
        }
      }, o.timeout);
    };

    // bind click handlers to prev and next buttons, if set
    $.each([ 'btnPrev', 'btnNext' ], function(index, btn) {
      if ( o[btn] ) {
        o['$' + btn] = $.isFunction( o[btn] ) ? o[btn].call( div[0] ) : $( o[btn] );
        o['$' + btn].bind('click.jc', function(event) {
          event.preventDefault();
          var step = index === 0 ? curr - o.scroll : curr + o.scroll;
          if (o.directional) {
            // set direction of subsequent scrolls to:
            //  1 if "btnNext" clicked
            // -1 if "btnPrev" clicked
            div.data( 'dirjc', (index ? 1 : -1) );
          }
          return go( step );
        });
      }
    });

    if (!o.circular) {
      if (o.btnPrev && start === 0) {
        o.$btnPrev.addClass(o.btnDisabledClass);
      }

      if ( o.btnNext && start + visibleFloor >= itemLength ) {
        o.$btnNext.addClass(o.btnDisabledClass);
      }
    }

    if (o.autoPager) {
      pageNavCount = ceil(tl / visibleNum);
      pageNav = [];
      for (var i=0; i < pageNavCount; i++) {
        pageNav.push('<li><a href="#">' + (i+1) + '</a></li>');
      }
      if (pageNav.length > 1) {
        pageNav = $('<ul>' + pageNav.join('') + '</ul>').appendTo(o.autoPager).find('li');
        pageNav.find('a').each(function(i) {
          $(this).bind('click.jc', function(event) {
            event.preventDefault();
            var slide = i * visibleNum;
            if (o.circular) {
              slide += visibleNum;
            }
            return go(slide);
          });
        });
        activeBtnTypes.pager = 1;
      }
    }

    // set the active class on the btn corresponding to the "start" li
    setActiveBtn(start, activeBtnTypes);

    if (o.mouseWheel && div.mousewheel) {
      div.bind('mousewheel.jc', function(e, d) {
        return d > 0 ? go(curr - o.scroll) : go(curr + o.scroll);
      });
    }

    if (o.pause && o.auto && !isTouch) {
      div.bind('mouseenter.jc', function() {
        div.trigger('pauseCarousel.jc');
      }).bind('mouseleave.jc', function() {
        div.trigger('resumeCarousel.jc');
      });
    }

    if (o.auto) {
      advancer();
    }

    function vis() {
      return li.slice(curr).slice(0, visibleCeil);
    }

    $.jCarouselLite.vis = vis;

    function go(to, settings) {
      if (running) { return false; }
      settings = settings || {};
      var prev = curr,
          direction = to > curr,
          speed = settings.speed || o.speed,
          // offset appears if touch moves slides
          offset = settings.offset || 0;


      if (o.beforeStart) {
        o.beforeStart.call(div, vis(), direction);
      }

      li.removeClass(o.activeClass);

      // If circular and we are in first or last, then go to the other end
      if (o.circular) {
        if (to > curr && to > itemLength - visibleCeil) {
          curr = curr % tl;
          to = curr + (settings.auto ? autoScrollBy : o.scroll);
          ul.css(animCss, (-curr * styles.liSize) - offset);
        } else if ( to < curr && to < 0) {
          curr += tl;
          to += tl;
          ul.css(animCss, (-curr * styles.liSize) - offset);
        }

        curr = to + (to % 1);

      // If non-circular and "to" points beyond first or last, we change to first or last.
      } else {
        if (to < 0) {
          to = 0;
        } else if  (to > itemLength - visibleFloor) {
          to = itemLength - visibleFloor;
        }

        curr = to;

        if (curr === 0 && o.first) {
          o.first.call(this, vis(), direction);
        }

        if (curr === itemLength - visibleFloor && o.last) {
          o.last.call(this, vis(), direction);
        }

        // Disable buttons when the carousel reaches the last/first, and enable when not
        if (o.btnPrev) {
          o.$btnPrev.toggleClass(o.btnDisabledClass, curr === 0);
        }
        if (o.btnNext) {
          o.$btnNext.toggleClass(o.btnDisabledClass, curr === itemLength - visibleFloor);
        }
      }

      // if btnGo, set the active class on the btnGo element corresponding to the first visible carousel li
      // if autoPager, set active class on the appropriate autopager element
      setActiveBtn(curr, activeBtnTypes);

      $.jCarouselLite.curr = curr;

      if (prev === curr && !settings.force) {
        if (o.afterEnd) {
          o.afterEnd.call(div, vis(), direction);
        }
        return curr;
      }

      running = true;

      aniProps[animCss] = -(curr * styles.liSize);
      ul.animate(aniProps, speed, o.easing, function() {
        if (o.afterEnd) {
          o.afterEnd.call(div, vis(), direction);
        }
        running = false;
      });

      li.eq(curr).addClass(o.activeClass);

      return curr;
    } // end go function

    // bind custom events so they can be triggered by user
    div
    .bind('go.jc', function(e, to, settings) {

      if (typeof to === 'undefined') {
        to = '+=1';
      }

      var todir = typeof to === 'string' && /(\+=|-=)(\d+)/.exec(to);

      if ( todir ) {
        to = todir[1] === '-=' ? curr - todir[2] * 1 : curr + todir[2] * 1;
      } else {
        to += start;
      }
      go(to, settings);
    })
    .bind('startCarousel.jc', function(event) {
      clearTimeout(self.setAutoAdvance);
      self.setAutoAdvance = undefined;
      div.trigger('go', '+=' + o.scroll);
      advancer();
      div.removeData('pausedjc').removeData('stoppedjc');
    })
    .bind('resumeCarousel.jc', function(event, forceRun) {
      if (self.setAutoAdvance) { return; }
      clearTimeout(self.setAutoAdvance);
      self.setAutoAdvance = undefined;

      var stopped = div.data('stoppedjc');
      if ( forceRun || !stopped ) {
        advancer();
        div.removeData('pausedjc');
        if (stopped) {
          div.removeData('stoppedjc');
        }
      }
    })

    .bind('pauseCarousel.jc', function(event) {
      clearTimeout(self.setAutoAdvance);
      self.setAutoAdvance = undefined;
      div.data('pausedjc', true);
    })
    .bind('stopCarousel.jc', function(event) {
      clearTimeout(self.setAutoAdvance);
      self.setAutoAdvance = undefined;

      div.data('stoppedjc', true);
    })

    .bind('refreshCarousel.jc', function(event) {
      setDimensions(o.autoCSS);
    })

    .bind('endCarousel.jc', function() {
      if (self.setAutoAdvance) {
        clearTimeout(self.setAutoAdvance);
        self.setAutoAdvance = undefined;
      }
      if (o.btnPrev) {
        o.$btnPrev.addClass(o.btnDisabledClass).unbind('.jc');
      }
      if (o.btnNext) {
        o.$btnNext.addClass(o.btnDisabledClass).unbind('.jc');
      }
      if (o.btnGo) {
        $.each(o.btnGo, function(i, val) {
          $(val).unbind('.jc');
        });
      }

      if (o.circular) {
        li.slice(0, visibleCeil).remove();
        li.slice(-visibleCeil).remove();
      }
      $.each([animCss + 'jc', 'pausedjc', 'stoppedjc', 'dirjc'], function(i, d) {
        div.removeData(d);
      });
      div.unbind('.jc');
    });

    // touch gesture support

    touchEvents = {
      touchstart: function(event) {
        endTouch.x = 0;
        endTouch.y = 0;
        startTouch.x = event.targetTouches[0].pageX;
        startTouch.y = event.targetTouches[0].pageY;
        startTouch[animCss] = parseFloat( ul.css(animCss) );
        startTouch.time = +new Date();
      },

      touchmove: function(event) {
        var tlength = event.targetTouches.length;

        if (tlength === 1) {
          event.preventDefault();
          endTouch.x = event.targetTouches[0].pageX;
          endTouch.y = event.targetTouches[0].pageY;
          aniProps[animCss] = startTouch[animCss] + (endTouch[axisPrimary] - startTouch[axisPrimary]);
          ul.css(aniProps);
        } else {
          endTouch.x = startTouch.x;
          endTouch.y = startTouch.y;
        }
      },

      touchend: function(event) {
        // bail out early if there is no touch movement
        if (!endTouch.x) {
          return;
        }

        var pxDelta = startTouch[axisPrimary] - endTouch[axisPrimary],
            pxAbsDelta = mabs( pxDelta ),
            primaryAxisGood = pxAbsDelta > o.swipeThresholds[axisPrimary],
            secondaryAxisGood =  mabs(startTouch[axisSecondary] - endTouch[axisSecondary]) < o.swipeThresholds[axisSecondary],
            timeDelta = +new Date() - startTouch.time,
            quickSwipe = timeDelta < o.swipeThresholds.time,
            operator = pxDelta > 0 ? '+=' : '-=',
            to = operator + o.scroll,
            swipeInfo  = { force: true };

        // quick, clean swipe
        if ( quickSwipe && primaryAxisGood && secondaryAxisGood ) {
          // set animation speed to twice as fast as that set in speed option
          swipeInfo.speed = o.speed / 2;
        }
        else
        // slow swipe < 1/2 slide width, OR
        // not enough movement for swipe, OR
        // too much movement on secondary axis when quick swipe
        if ( (!quickSwipe && pxAbsDelta < styles.liSize / 2) ||
          !primaryAxisGood ||
          (quickSwipe && !secondaryAxisGood)
          ) {
          // revert to same slide
          to = '+=0';
        }
        else
        // slow swipe > 1/2 slide width
        if ( !quickSwipe && pxAbsDelta > styles.liSize / 2 ) {
          to = Math.round(pxAbsDelta / styles.liSize);
          to = operator + (to > o.visible ? o.visible : to);

          // send pxDelta along as offset in case carousel is circular and needs to reset
          swipeInfo.offset = pxDelta;
        }

        div.trigger('go.jc', [to, swipeInfo]);
        endTouch = {};
      },

      handle: function(event) {
        event = event.originalEvent;
        touchEvents[event.type](event);
      }
    };

    if ( isTouch && o.swipe ) {
      div.bind('touchstart.jc touchmove.jc touchend.jc', touchEvents.handle);
    } // end swipe events

    // Responsive design handling:
    // Reset dimensions on window.resize
    if (o.responsive) {
      prepResize = o.autoCSS;
      $(window).bind('resize', function(event) {
        if (prepResize) {
          ul.width( ul.width() * 2 );
          prepResize = false;
        }

        clearTimeout(resize);
        resize = setTimeout(function() {
          div.trigger('refreshCarousel.jc');
          prepResize = o.autoCSS;
        }, 100);

      });
    }



  }); // end each

  return this;
};

$.fn.jCarouselLite.defaults = {
  btnPrev: null,
  btnNext: null,

  // array (or jQuery object) of elements. When clicked, makes the corresponding carousel LI the first visible one
  btnGo: null,

  // selector (or jQuery object) indicating the containing element for pagination navigation.
  autoPager: null,
  btnDisabledClass: 'disabled',

  // class applied to the active slide and btnGo element
  activeClass: 'active',

  // class applied to the btnGo elements corresponding to the visible slides
  visibleClass: 'vis',
  mouseWheel: false,
  speed: 200,
  easing: null,

  // milliseconds between scrolls
  timeout: 4000,

  // true to enable auto scrolling; number to auto-scroll by different number at a time than that of scroll option
  auto: false,


  // true to enable changing direction of auto scrolling when user clicks prev or next button
  directional: false,

  // number of times before autoscrolling will stop. (if circular is false, won't iterate more than number of items)
  autoStop: false,

  // pause scrolling on hover
  pause: true,
  vertical: false,

  // continue scrolling when reach the last item
  circular: true,

  // the number to be visible at a given time.
  visible: 3,

  // index of item to show initially in the first posiition
  start: 0,

  // number of items to scroll at a time
  scroll: 1,

  // whether to set initial styles on the carousel elements. See readme for info
  autoCSS: true,

  // whether the dimensions should change on resize
  responsive: false,

  // whether to set width of <li>s (and left/top of <ul>) based on width of <div>
  autoWidth: false,

  // touch options
  swipe: true,
  swipeThresholds: {
    x: 80,
    y: 40,
    time: 150
  },

  // Function to be called for each matched carousel when .jCaourselLite() is called.
  // Inside the function, `this` is the carousel div.
  // The function can take 2 arguments:
      // 1. The merged options object
      // 2. A jQuery object containing the <li> items in the carousel
  // If the function returns `false`, the plugin will skip all the carousel magic for that carousel div
  init: function() {},

  // function to be called once the first slide is hit
  first: null,

  // function to be called once the last slide is hit
  last: null,

  // function to be called before each transition starts
  beforeStart: null,

  // function to be called after each transition ends
  afterEnd: null
};

function iterations(itemLength, options) {
  return options.autoStop && (options.circular ? options.autoStop : Math.min(itemLength, options.autoStop));
}

function fixIds(i) {
  if ( this.id ) {
    this.id += i;
  }
}
})(jQuery);
