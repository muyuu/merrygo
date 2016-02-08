(function(w, $){
  $(function(){
    uiCarousel({
      duration: 500,
      interval: 5000
    });

    uiCarousel({
        root: ".js-carousel02",
        duration: 600,
        interval: 3000,
        length: 3
    });

    uiCarousel({
        root: ".js-carousel03",
        duration: 600,
        interval: 3000,
        length: 3,
        force: true,
        useDots: false
    });
  });
})(window, jQuery);
