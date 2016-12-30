(function(w, $){
  $(function(){
    merrygo({
      duration: 500,
      interval: 5000,
      easing: "easeInOutSine"
    });

    merrygo({
        root: ".js-merrygo02",
        duration: 1600,
        interval: 3000,
        length: 3,
        itemMargin: 10,
        easing: "easeOutBounce",
        onLoad: function($ele){
            console.log("on load");
            console.log($ele);
        }
    });

    merrygo({
        root: ".js-merrygo03",
        duration: 600,
        interval: 3000,
        length: 3,
        itemMargin: 10,
        force: true,
        useDots: false
    });

    merrygo({
        root: ".js-merrygo04",
        length: 3,
        itemMargin: 10,
        autoStart: false,
    });
  });
})(window, jQuery);
