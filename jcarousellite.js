/*!
 * jQuery jCarousellite Plugin v1.6.3
 *
 * Date: Tue Mar 13 15:23:26 2012 EDT
 * Requires: jQuery v1.4+
 *
 * Copyright 2007 Ganeshji Marwaha (gmarwaha.com)
 * Modifications/enhancements by Karl Swedberg
 * Dual licensed under the MIT and GPL licenses (just like jQuery):
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * jQuery plugin to navigate images/any content in a carousel style widget.
 *
*/

(function($) {

$.jCarouselLite = {
  version: '1.6.3',
  curr: 0
};

$.fn.jCarouselLite = function(options) {
  var o = $.extend({}, $.fn.jCarouselLite.defaults, options);

  this.each(function() {

    var sizes = {},
        running = false,
        animCss = o.vertical ? "top": "left",
        aniProps = {},
        sizeProp = o.vertical ? "height": "width",
        self = this,
        div = $(this),
        ul = div.find('ul').eq(0),
        tLi = ul.children('li'),
        tl = tLi.length,
        visibleNum = o.visible,
        // need visibleCeil and visibleFloor in case we want a fractional number of visible items at a time
        visibleCeil = Math.ceil(visibleNum),
        visibleFloor = Math.floor(visibleNum),
        start = Math.min(o.start, tl - 1),
        direction = 1,
        activeBtnOffset = 0;

    div.data('dirjc', direction);

    if (o.circular) {
        ul.prepend( tLi.slice(tl - visibleCeil - 1 + 1).clone(true) )
          .append( tLi.slice(0,visibleCeil).clone(true) );
        start += visibleCeil;
        activeBtnOffset = visibleCeil;
    }

    var setActiveBtn = function(i) {
      var activeBtnIndex = (i - activeBtnOffset) % tl;
      $(o.btnGo).removeClass(o.activeClass).eq(activeBtnIndex).addClass(o.activeClass);
      return activeBtnIndex;
    };

    var li = ul.children('li'),
        itemLength = li.length,
        curr = start;

    $.jCarouselLite.curr = curr;

    div.css("visibility", "visible");

    if (o.autoCSS) {
      div.css({visibility: 'visible', overflow: 'hidden', position: 'relative', zIndex: 2, left: '0px'});
      ul.css({margin: '0', padding: '0', position: 'relative', listStyleType: 'none', zIndex: 1});
      li.css({overflow: o.vertical ? 'hidden' : 'visible', 'float': o.vertical ? 'none' : 'left'});
    }

    // Full li size(incl margin)-Used for animation
    var liSize = o.vertical ? height(li) : width(li);

    // size of full ul(total length, not just for the visible items)
    var ulSize = liSize * itemLength;

    // size of entire div(total length for just the visible items)
    var divSize = liSize * visibleNum;

    if (o.autoCSS) {
      sizes[sizeProp] = divSize + 'px';
      div.css(sizes);
      li.css({width: li.width(), height: li.height()});
    }

    sizes[sizeProp] = ulSize + 'px';
    sizes[animCss] = -(curr*liSize);
    ul.css(sizes);

    // set up timed advancer
    var advanceCounter = 0,
        autoStop = iterations(tl,o),
        autoScrollBy = typeof o.auto == 'number' ? o.auto : o.scroll;

    var advancer = function() {
      self.setAutoAdvance = setTimeout(function() {

        if (!autoStop || autoStop > advanceCounter) {
          direction = div.data('dirjc');
          go( curr + (direction * autoScrollBy) );
          advanceCounter++;
          advancer();
        }
      }, o.timeout + o.speed);
    };

    // bind click handlers to prev and next buttons, if set
    $.each([ 'btnPrev', 'btnNext' ], function(index, btn) {
      if ( o[btn] ) {
        o['$' + btn] = $.isFunction( o[btn] ) ? o[btn].call( div[0] ) : $( o[btn] );

        o['$' + btn].bind('click.jc', function() {
          var step = index === 0 ? curr-o.scroll : curr+o.scroll;
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

    if (o.btnGo) {
      $.each(o.btnGo, function(i, val) {
        $(val).bind('click.jc', function() {
          return go(o.circular ? visibleNum + i : i);
        });
      });

      // set the active class on the btn corresponding to the "start" li
      setActiveBtn(start);
    }

    if (o.mouseWheel && div.mousewheel) {
      div.bind('mousewheel.jc', function(e, d) {
        return d > 0 ? go(curr - o.scroll) : go(curr + o.scroll);
      });
    }

    if (o.pause && o.auto) {
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

    function go(to) {
      if (running) { return false; }
      var direction = to > curr;

      if (o.beforeStart) {
        o.beforeStart.call(this, vis(), direction);
      }
      // If circular and we are in first or last, then go to the other end
      if (o.circular) {
        // If first, then goto last
        if (to <= start - visibleCeil - 1) {
          ul.css( animCss, -( (itemLength - (visibleCeil * 2) ) * liSize ) + "px" );
          // If "scroll" > 1, then the "to" might not be equal to the condition; it can be lesser depending on the number of elements.
          curr = to == start - visibleCeil - 1 ? itemLength - (visibleCeil * 2) - 1 : itemLength - (visibleCeil * 2) - o.scroll;
        } else if (to >= itemLength - visibleCeil + 1) { // If last, then go to first
          ul.css(animCss, - ( visibleCeil * liSize ) + 'px' );

          // If "scroll" > 1, then the "to" might not be equal to the condition; it can be greater depending on the number of elements.
          curr = (to == itemLength - visibleCeil + 1) ? visibleCeil + 1 : visibleCeil + o.scroll;
        } else {
          curr = to;
        }

      // If non-circular and to points beyond first or last, we change to first or last.
      } else {

        if (to < 0) {
          curr = 0;
        } else if  (to > itemLength - visibleFloor) {
          curr = itemLength - visibleFloor;
        } else {
          curr = to;
        }
      }

      // Disable buttons when the carousel reaches the last/first, and enable when not
      if (o.btnPrev) {
        o.$btnPrev.toggleClass(o.btnDisabledClass, curr === 0);
      }
      if (o.btnNext) {
        o.$btnNext.toggleClass(o.btnDisabledClass, curr === itemLength - visibleFloor);
      }

      // set the active class on the btnGo element corresponding to the first visible carousel li
      if (o.btnGo) {
        setActiveBtn(curr);
      }

      $.jCarouselLite.curr = curr;
      running = true;
      aniProps[animCss] = -(curr * liSize);
      ul.animate(aniProps, o.speed, o.easing, function() {
        if (o.afterEnd) {
          o.afterEnd.call(this, vis(), direction);
        }
        running = false;
      });
      return false;
    } // end go function

    // bind custom events so they can be triggered by user
    div
    .bind('go.jc', function(e, to) {
      if (typeof to == 'undefined') {
        to = '+=1';
      }

      var todir = typeof to == 'string' && /(\+=|-=)(\d+)/.exec(to);

      if ( todir ) {
        to = todir[1] == '-=' ? curr - todir[2] * 1 : curr + todir[2] * 1;
      } else {
        to += start;
      }
      go(to);
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
      $.each(['pausedjc', 'stoppedjc', 'dirjc'], function(i, d) {
        div.removeData(d);
      });
      div.unbind('.jc');
    });
  });

  return this;
};
$.fn.jCarouselLite.defaults = {
  autoCSS: true,
  btnPrev: null,
  btnNext: null,
  btnDisabledClass: 'disabled',

  // array (or jQuery object) of elements. When clicked, makesthe corresponding carousel LI the first visible one
  btnGo: null,

  // class applied to the active btnGo element
  activeClass: 'active',

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

  // function to be called before each transition starts
  beforeStart: null,

  // function to be called after each transition ends
  afterEnd: null
};

function css(el, prop) {
  return parseInt($.css(el[0], prop), 10) || 0;
}
function width(el) {
  return  el[0].offsetWidth + css(el, 'marginLeft') + css(el, 'marginRight');
}
function height(el) {
  return el[0].offsetHeight + css(el, 'marginTop') + css(el, 'marginBottom');
}
function iterations(itemLength, options) {
  return options.autoStop && (options.circular ? options.autoStop : Math.min(itemLength, options.autoStop));
}
})(jQuery);
