jQuery(document).ready(function($) {

  module('carousels', {
    setup: function() {

      $('.slideshow').jCarouselLite({
        visible: 2,
        speed: 2
      });
      this.slideshow = $('div.slideshow');
      this.slides = $('ul.slides');
    }
  });

  test('starting position', function() {

    equal($('ul.slides').eq(0).css('left'), '-800px', 'first carousel starts at correct position');
    equal($('ul.slides').eq(1).css('left'), '-800px', 'second carousel starts at correct position');
  });

  asyncTest('go', function() {
    var s = this.slides;
    s.eq(1).trigger('go', 1);

    setTimeout(function() {
      equal(s.eq(1).css('left'), '-1200px', 'second carousel went to index 1 (2nd item)');
      start();
    }, 210);
  });
  asyncTest('go to 0', function() {
    var s = this.slides;
    this.slideshow.eq(1).trigger('go', 0);

    setTimeout(function() {
      equal(s.eq(1).css('left'), '-800px', 'second carousel went back to index 0 (1st item)');
      start();
    }, 210);
  });

  module('directional option', {
    setup: function() {

      this.slideshow = $('div.slideshow');
      this.slides = $('ul.slides');

      this.slideshow.jCarouselLite({
        auto: true,
        visible: 2,
        speed: 2,
        timeout: 200,
        directional: true,

        btnPrev: function() {
          return $(this).find('.prev');
        },
        btnNext: function() {
          return $(this).find('.next');
        }
      });
    }
  });

  asyncTest('change directions on prevBtn click', function() {
    var s = this.slides;
    this.slideshow.eq(1).find('.prev').trigger('click');

    setTimeout(function() {
      equal(s.eq(0).css('left'), '-800px', 'first carousel stays at initial position');
      equal(s.eq(1).css('left'), '-400px', 'second carousel goes to previous slide (last slide because circular)');

    }, 50);

    setTimeout(function() {
      equal(s.eq(0).css('left'), '-1200px', 'first carousel autoscrolls forward');
      equal(s.eq(1).css('left'), '0px', 'second carousel autoscrolls reverse');
      start();
    }, 250);
  });

});