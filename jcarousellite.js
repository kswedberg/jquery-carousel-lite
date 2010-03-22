(function($) {
/**
 * jCarouselLite - jQuery plugin to navigate images/any content in a carousel style widget.
 * @requires jQuery v1.2 or above
 *
 * @author Ganeshji Marwaha
 * @author Karl Swedberg (modifications/enhancements)
 * 
 *
 * http://gmarwaha.com/jquery/jcarousellite/
 *
 * Copyright (c) 2007 Ganeshji Marwaha (gmarwaha.com)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Version: 1.1
 * Note: Requires jquery 1.2 or above from version 1.0.1
 */

$.jCarouselLite = {
  version: '1.1',
  defaults: {
    btnPrev: null,
    btnNext: null,
    btnGo: null,
    mouseWheel: false,

    speed: 200,
    easing: null,
    auto: false, // true to enable auto scrolling
    autoStop: false, // number of times before autoscrolling will stop. (if circular is false, won't iterate more than number of items)
    timeout: 4000, // milliseconds between scrolls
    pause: true, // pause scrolling on hover
    
    vertical: false,
    circular: true, // continue scrolling when reach the last item
    visible: 3,
    start: 0, // index of item to show initially in the first posiition
    scroll: 1, // number of items to scroll at a time

    beforeStart: null,
    afterEnd: null
  }
};

$.fn.jCarouselLite = function(options) {
  var o = $.extend({}, $.jCarouselLite.defaults, options);

  return this.each(function() {
    
    var running = false,
        animCss=o.vertical?"top":"left", 
        sizeCss=o.vertical?"height":"width";

    var div = $(this), ul = div.find('ul'), tLi = ul.children('li'), tl = tLi.length, v = o.visible;

    if (o.circular) {
        ul.prepend(tLi.slice(tl-v-1+1).clone(true))
          .append(tLi.slice(0,v).clone(true));
        o.start += v;
    }

    var li = ul.children('li'), itemLength = li.length, curr = o.start;
    div.css("visibility", "visible");

    li.css({overflow: o.vertical ? "hidden" : 'visible', 'float': o.vertical ? "none" : "left"});
    ul.css({margin: "0", padding: "0", position: "relative", "list-style-type": "none", "z-index": "1"});
    div.css({overflow: "hidden", position: "relative", "z-index": "2", left: "0px"});

    var liSize = o.vertical ? height(li) : width(li);   // Full li size(incl margin)-Used for animation
    var ulSize = liSize * itemLength;                   // size of full ul(total length, not just for the visible items)
    var divSize = liSize * v;                           // size of entire div(total length for just the visible items)

    li.css({width: li.width(), height: li.height()});
    ul.css(sizeCss, ulSize+"px").css(animCss, -(curr*liSize));

    div.css(sizeCss, divSize+"px");                     // Width of the DIV. length of visible images

    if (o.btnPrev) {
      $(o.btnPrev).click(function() {
        return go(curr-o.scroll);
      });
    }
    if (o.btnNext) {
      $(o.btnNext).click(function() {
        return go(curr+o.scroll);
      });
    }
    if (o.btnGo) {
      $.each(o.btnGo, function(i, val) {
        $(val).click(function() {
          return go(o.circular ? o.visible+i : i);
        });
      });
    }
    if (o.mouseWheel && div.mousewheel) {
      div.mousewheel(function(e, d) {
        return d>0 ? go(curr-o.scroll) : go(curr+o.scroll);
      });
    }

    if (o.auto) {
      // CHANGED: Added pause on hover (Karl Swedberg)
      var setAutoAdvance,
          advanceCounter = 0,
          autoStop = iterations(tl,o);

      var advancer = function() {
        setAutoAdvance = setTimeout(function() {
          if (!autoStop || autoStop > advanceCounter) {
            go(curr+o.scroll);
            advanceCounter++;
            advancer();
          }
        }, o.timeout+o.speed);
      };
      
      advancer();
      
      $(document)
      .bind('pauseCarousel', function(event) {
        clearTimeout(setAutoAdvance);
        $(event.target).data('paused', true);
      })
      .bind('resumeCarousel', function(event) {
        advancer();
        $(event.target).data('paused', false);
      });
      if (o.pause) {
        div.mouseenter(function() {
          div.trigger('pauseCarousel');
        }).mouseleave(function() {
          div.trigger('resumeCarousel');
        });
      }
    }
    
    function vis() {
      return li.slice(curr).slice(0,v);
    }

    function go(to) {
      if (!running) {

        if (o.beforeStart) {
          o.beforeStart.call(this, vis());
        }
        if (o.circular) {             // If circular we are in first or last, then goto the other end
          if (to<=o.start-v-1) {           // If first, then goto last
            ul.css(animCss, -((itemLength-(v*2))*liSize)+"px");
            // If "scroll" > 1, then the "to" might not be equal to the condition; it can be lesser depending on the number of elements.
            curr = to==o.start-v-1 ? itemLength-(v*2)-1 : itemLength-(v*2)-o.scroll;
          } else if (to>=itemLength-v+1) { // If last, then goto first
            ul.css(animCss, -( (v) * liSize ) + "px" );
            // If "scroll" > 1, then the "to" might not be equal to the condition; it can be greater depending on the number of elements.
            curr = to==itemLength-v+1 ? v+1 : v+o.scroll;
          } else {
            curr = to;
          }
        } else {                    // If non-circular and to points beyond first or last, we change to first or last.
          if (to<0) {
            curr = 0;          
          } else if  (to>itemLength-v) {
            curr = itemLength-v;
          } else {
            curr = to;
          }
        }

        running = true;

        ul.animate(animCss == "left" ? { left: -(curr*liSize) } : { top: -(curr*liSize) } , o.speed, o.easing, function() {
          if (o.afterEnd) {
            o.afterEnd.call(this, vis());
          }
          running = false;
        });
        // Disable buttons when the carousel reaches the last/first, and enable when not
        if (!o.circular) {
          $(o.btnPrev).add(o.btnNext).removeClass("disabled");
          $( (curr-o.scroll<0 && o.btnPrev)
             ||
             (curr+o.scroll > itemLength-v && o.btnNext)
             ||
             []
          ).addClass("disabled");
        }
      }
      return false;
    } // end if !running
  });
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