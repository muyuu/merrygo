(function(w, $){
  $(function(){
    merrygo({
      duration: 500,
      interval: 5000
    });

    merrygo({
        root: ".js-merrygo02",
        duration: 600,
        interval: 3000,
        length: 3,
        itemMargin: 10
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
  });
})(window, jQuery);
