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
  
  test('go', function() {
    var s = this.slides;
    s.eq(1).trigger('go', 1);
    stop();
    setTimeout(function(){
      equal(s.eq(1).css('left'), '-1200px', 'second carousel went to index 1 (2nd item)');
      start();
    }, 210);
  });
  test('go to 0', function() {
    var s = this.slides;
    this.slideshow.eq(1).trigger('go', 0);
    stop();
    setTimeout(function(){

      equal(s.eq(1).css('left'), '-800px', 'second carousel went back to index 0 (1st item)');
      start();
    }, 210);
  });
  
});