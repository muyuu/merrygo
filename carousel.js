(function(definition){
    "use strict";

    var moduleName = "uiCarousel";

    var root = (typeof self === "object" && self.self === self && self) || (typeof global === "object" && global.global === global && global);

    if (typeof exports === "object"){
        module.exports = definition(root, require("jquery"));
    } else {
        root[moduleName] = definition(root, $);
    }
})(function(root, $){
    "use strict";

    // -------------------------------------------------------
    // utility functions
    // -------------------------------------------------------
    function existy(x){
        return x != null;
    }

    function truthy(x){
        return (x !== false) && existy(x);
    }

    function isUndefined(obj){
        return obj === void 0;
    }

    function trimDot(string){
        return string.replace(".", "");
    }

    function trimSome(string, some){
        return string.replace(some, "");
    }

    function putBothClasses(string, prefix){
        return trimDot(string) + " " + trimSome(trimDot(string), prefix);
    }


    // -------------------------------------------------------
    // module
    // -------------------------------------------------------

    /**
     * module factory
     * this module is dependent on jQuery
     * @prop {string} rootElement default root element class or id
     * @prop {array} instance
     * @namespace
     */
    function factory(param){

        var rootElement = ".js-carousel";
        var opt = existy(param) ? param : {};

        var $self;
        if (existy(opt.root)){
            $self = opt.root instanceof jQuery ? param.root : $(param.root);
        } else {
            $self = $(rootElement);
        }

        return $self.map(function(key, val){
            return new Module(opt, val);
        });
    }


    /**
     * constructor
     * @type {Function}
     */
    function Module(opt, moduleRoot){

        // options
        this.opt = {
            prefix: "js-",

            //elements
            inner: !isUndefined(opt.inner) ? opt.inner : ".js-carousel__inner",
            items: !isUndefined(opt.items) ? opt.items : ".js-carousel__items",
            item : !isUndefined(opt.item) ? opt.item : ".js-carousel__item",

            //arrow
            useArrow : !isUndefined(opt.useArrow) ? opt.useArrow : true,
            arrow    : !isUndefined(opt.arrow) ? opt.arrow : ".js-carousel__arrow",
            arrowPrev: !isUndefined(opt.arrowPrev) ? opt.arrowPrev : ".js-carousel__arrowPrev",
            arrowNext: !isUndefined(opt.arrowNext) ? opt.arrowNext : ".js-carousel__arrowNext",

            //margin
            itemMargin: !isUndefined(opt.itemMargin) ? opt.itemMargin : 0,

            //dots
            useDots: !isUndefined(opt.useDots) ? opt.useDots : true,
            dots: !isUndefined(opt.dots) ? opt.dots : ".js-carousel__dots",
            dot: !isUndefined(opt.dot) ? opt.dot : ".js-carousel__dot",
            dotContent: !isUndefined(opt.dotContent) ? opt.dotContent : "○",

            //state
            currentClass: !isUndefined(opt.currentClass) ? opt.currentClass : "current",

            //animation
            duration: !isUndefined(opt.duration) ? opt.duration : 400,
            interval: !isUndefined(opt.interval) ? opt.interval : 3000,

            // callback
            onOpen      : opt.onOpen || null,
            onClose     : opt.onClose || null,
            onClick     : opt.onClick || null,
            onAnimateEnd: opt.onAnimateEnd || null
        };

        // elements
        this.$root = $(moduleRoot);
        //this.$inner = this.$root.find(this.opt.inner);
        this.$items = this.$root.find(this.opt.items);
        this.$item = this.$root.find(this.opt.item);
        this.$dots = this.$root.find(this.opt.dots);
        this.$dot = this.$root.find(this.opt.dot);

        if (this.opt.useArrow) {
            this.$arrow = this.$root.find(this.opt.arrow);
        }

        // timer
        this.timer = null;

        // states
        this.currentIndex = 0;
        this.itemLength = this.$item.length;
        this.singleItemWidth = this.$item.first().outerWidth(true);
        this.isAnimate = false;
        this.isHover = false;

        // init
        this.setDom();
        this.setCss();
        this.pushCurrentClass();


        // set event
        this.startTimerEvent();
        this.setClickEvent();
        this.setHoverEvent();
    }

    Module.prototype.setDom = function(){
        var __ = this;

        // set items
        __.setItems();

        // set dots
        if(__.opt.useDots) __.setDots();
    };

    Module.prototype.setItems = function(e){
        var __ = this;

        for(var i = 0; i <= 1; i++){
            __.$item.each(function(key, val){
                __.$items.append($(val).clone(true, true));
            });
        }
    };

    Module.prototype.setDots = function(e){
        var __ = this;

        var str = __.makeDotsDomStr();
        __.$root.append(str);
        __.$dots = __.$root.find(__.opt.dots);
        __.$dot = __.$root.find(__.opt.dot);
    };

    Module.prototype.makeDotsDomStr = function(e){
        var __ = this;

        var itemLength = __.$item.length;

        var domStr = "<ul class='" + putBothClasses(__.opt.dots, __.opt.prefix) + "'>";
        for(var i=0; i<itemLength; i++){
            domStr += "<li class='" + putBothClasses(__.opt.dot, __.opt.prefix) + "'>";
            domStr += "<span>";
            domStr += __.opt.dotContent;
            domStr += "</span>";
            domStr += "</li>";
        }
        domStr += "</ul>";
        return domStr;
    };

    Module.prototype.setCss = function(e){
        this.$items.css({
            width: this.singleItemWidth * this.itemLength * 3,
            left : -(this.singleItemWidth * this.itemLength)
        });
    };

    Module.prototype.cancelTimerEvent = function(){
        clearInterval(this.timer);
    };

    Module.prototype.startTimerEvent = function(){
        var __ = this;

        clearInterval(this.timer);
        this.timer = setInterval(function(){
            __.next();
        }, __.opt.interval);
    };

    Module.prototype.setClickEvent = function(){
        var __ = this;

        __.$arrow.on("click", function(){

            if (__.isAnimate) return false;

            __.isAnimate = true;
            __.cancelTimerEvent();

            if ($(this).hasClass(trimDot(__.opt.arrowNext))) __.next();
            if ($(this).hasClass(trimDot(__.opt.arrowPrev))) __.prev();

            return false;
        });

        __.$dot.on("click", function(){
            if (__.isAnimate) return false;

            var index = __.$dot.index(this);
            var moveLength = index - __.currentIndex
            if (index === __.currentIndex) return false;

            __.isAnimate = true;
            __.cancelTimerEvent();

            __.moveToIndex(index);
        });
    };

    Module.prototype.setHoverEvent = function(){
        var __ = this;

        __.$root.find(__.opt.item).hover(
            function(){
                __.isHover = true;
                if (!__.isAnimate) {
                    __.cancelTimerEvent();
                }
            },
            function(){
                __.isHover = false;
                if (!__.isAnimate) {
                    __.startTimerEvent();
                    __.isAnimate = false;
                }
            }
        );
    };

    Module.prototype.moveToIndex = function(index){
        if(typeof index !== 'number') return false;
        return this.move(index);
    };

    Module.prototype.next = function(){
        return this.move('next');
    };

    Module.prototype.prev = function(){
        return this.move('prev');
    };

    Module.prototype.move = function(type){
        var __ = this;

        var tmpIndex = __.currentIndex;
        var moveLength;

        var leftCssVal = -(this.singleItemWidth * this.itemLength);

        switch(type){
            case 'next':
                moveLength = 1;
                break;

            case 'prev':
                moveLength = -1;
                break;

            default:
                moveLength = type - tmpIndex;
        }

        leftCssVal -= moveLength * __.singleItemWidth;

        // index
        __.pushCurrentClass(type);

        this.$items.animate(
            {
                left: leftCssVal
            },
            this.opt.duration,
            function(){
                __.arrowCallback(type, moveLength);

                if (!__.isHover) {
                    __.startTimerEvent();
                    __.isAnimate = false;
                }
            }
        );
        return this;
    };

    Module.prototype.pushCurrentClass = function(type){
        var __ = this;


        __.changeIndex(type);
        var index = __.currentIndex;
        var current = __.opt.currentClass;

        //dots
        __.$dot.removeClass(current);
        __.$dot.eq(index).addClass(current);
    };

    Module.prototype.changeIndex = function(type){
        var __ = this;

        if (type === 'next') __.currentIndex++;
        if (type === 'prev') __.currentIndex--;
        if (typeof type === 'number') __.currentIndex = type;

        __.roundIndex();
    };

    Module.prototype.roundIndex = function(){
        var __ = this;

        if (__.isValidIndex()) return __.currentIndex;
        if (__.currentIndex < 0) return __.currentIndex = __.itemLength - 1;
        return __.currentIndex = 0;

        return;
    };

    Module.prototype.isValidIndex = function(){
        var __ = this;
        return 0 <= __.currentIndex && __.currentIndex + 1 <= __.itemLength;
    };

    Module.prototype.arrowCallback = function(type, moveLength){
        var currentItem = this.$items.find(this.opt.item);

        //item move
        if (type === 'next') this.$items.append(currentItem.first());
        if (type === 'prev') this.$items.prepend(currentItem.last());

        if (typeof type === 'number') {
            var abs = Math.abs(moveLength);

            for (var i = 0; i < abs; i++) {
                if(moveLength > 0) {
                    this.$items.append(this.$items.find(this.opt.item).first());
                } else {
                    this.$items.prepend(this.$items.find(this.opt.item).last());
                }
            }
        }

        //css reset
        this.$items.css({
            left: -(this.singleItemWidth * this.itemLength)
        });
    };

    return factory;
});
