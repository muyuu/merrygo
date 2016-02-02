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
    const isUndefined = (obj)=>{ return obj === void 0; };

    const trimDot = (string)=>{ return string.replace(".", ""); };

    const trimSome = (string, some)=>{ return string.replace(some, ""); };

    const putBothClasses = (string, prefix)=>{ return trimDot(string) + " " + trimSome(trimDot(string), prefix); };


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
        var opt = !isUndefined(param) ? param : {};

        var $list;
        if (isUndefined(opt.root)) $list = $(rootElement);
        if (!isUndefined(opt.root)) $list = opt.root instanceof jQuery ? param.root : $(param.root);

        var length = $list.length;
        var mappedlist = [];
        for (var i = 0; i < length; i++) {
            mappedlist[i] = new Module(opt, $list[i]);
        }
        return mappedlist;
    }


    /**
     * constructor
     * @type {Function}
     */
    function Module(opt, moduleRoot){

        // options
        this.opt = {
            // prefix
            prefix: "js-",

            // length
            length : !isUndefined(opt.length) ? opt.length : 1,

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
        this.$inner = this.$root.find(this.opt.inner);
        this.$items = this.$root.find(this.opt.items);
        this.$item = this.$root.find(this.opt.item);
        this.$dots = this.$root.find(this.opt.dots);
        this.$dot = this.$root.find(this.opt.dot);

        if (this.opt.useArrow) {
            this.$arrow = this.$root.find(this.opt.arrow);
        }

        // timer
        this.timer = null;
        this.resizeTimer = null;

        // states
        this.currentIndex = 0;
        this.itemLength = this.$item.length;
        this.singleItemWidth = this.$item.first().outerWidth(true);
        this.isAnimate = false;
        this.isHover = false;


        // not work when item length < this.opt.length
        if (this.itemLength <= this.opt.length){
            if (this.opt.useArrow) this.$arrow.hide();
            return false
        }


        // init
        this.setDom();
        this.setCss();
        this.pushCurrentClass();


        // set event
        this.startTimerEvent();
        this.setClickEvent();
        this.setHoverEvent();
        this.setResizeEvent();
    }

    Module.prototype.setDom = function(){

        // set items
        this.setItems();

        // set dots
        if(this.opt.useDots) this.setDots();
    };

    Module.prototype.setItems = function(){

        for(var i = 0; i <= 1; i++){
            this.$item.each((key, val)=>{
                this.$items.append($(val).clone(true, true));
            });
        }
    };

    Module.prototype.setDots = function(e){

        var str = this.makeDotsDomStr();
        this.$root.append(str);
        this.$dots = this.$root.find(this.opt.dots);
        this.$dot = this.$root.find(this.opt.dot);
    };

    Module.prototype.makeDotsDomStr = function(e){

        var itemLength = this.$item.length;

        var domStr = "<ul class='" + putBothClasses(this.opt.dots, this.opt.prefix) + "'>";
        for(var i=0; i<itemLength; i++){
            domStr += "<li class='" + putBothClasses(this.opt.dot, this.opt.prefix) + "'>";
            domStr += "<span>";
            domStr += this.opt.dotContent;
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

        clearInterval(this.timer);

        this.timer = setInterval(()=>{
            this.next();
        }, this.opt.interval);
    };

    Module.prototype.setClickEvent = function(){

        this.$arrow.on("click", (e)=>{

            if (this.isAnimate) return false;

            this.isAnimate = true;
            this.cancelTimerEvent();

            if ($(e.currentTarget).hasClass(trimDot(this.opt.arrowNext))) this.next();
            if ($(e.currentTarget).hasClass(trimDot(this.opt.arrowPrev))) this.prev();

            return false;
        });

        this.$dot.on("click", (e)=>{

            if (this.isAnimate) return false;

            var index = this.$dot.index(e.currentTarget);

            var moveLength = index - this.currentIndex
            if (index === this.currentIndex) return false;

            this.isAnimate = true;
            this.cancelTimerEvent();

            this.moveToIndex(index);
        });
    };

    Module.prototype.setHoverEvent = function(){

        this.$root.find(this.opt.item).hover(
            ()=>{
                this.isHover = true;
                if (!this.isAnimate) {
                    this.isAnimate = false;
                    this.cancelTimerEvent();
                }
            },
            ()=>{
                this.isHover = false;
                if (!this.isAnimate) {
                    this.startTimerEvent();
                }
            }
        );
    };

    Module.prototype.setResizeEvent = function(){

        $(window).on("resize", ()=>{
            this.resizeHandler();
        });
    };

    Module.prototype.resizeHandler = function() {

        if (this.resizeTimer !== false) clearTimeout(this.resizeTimer);

        this.resizeTimer = setTimeout(()=>{
            this.reset();
        }, 200);
    };

    Module.prototype.reset = function() {

        this.cancelTimerEvent();
        this.singleItemWidth = $(this.rootclass).outerWidth(true);
        this.setCss();

        this.startTimerEvent();
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

        var tmpIndex = this.currentIndex;
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

        leftCssVal -= moveLength * this.singleItemWidth;

        // index
        this.pushCurrentClass(type);

        this.isAnimate = true;

        this.$items.animate(
            {
                left: leftCssVal
            },
            this.opt.duration,
            ()=>{
                this.arrowCallback(type, moveLength);

                this.startTimerEvent();
                this.isAnimate = false;
            }
        );
        return this;
    };

    Module.prototype.pushCurrentClass = function(type){

        this.changeIndex(type);
        var index = this.currentIndex;
        var current = this.opt.currentClass;

        //dots
        this.$dot.removeClass(current);
        this.$dot.eq(index).addClass(current);

        return this;
    };

    Module.prototype.changeIndex = function(type){

        if (type === 'next') this.currentIndex++;
        if (type === 'prev') this.currentIndex--;
        if (typeof type === 'number') this.currentIndex = type;

        this.roundIndex();

        return this;
    };

    Module.prototype.roundIndex = function(){

        if (this.isValidIndex()) return this.currentIndex;
        if (this.currentIndex < 0) return this.currentIndex = this.itemLength - 1;
        return this.currentIndex = 0;

        return this;
    };

    Module.prototype.isValidIndex = function(){
        return 0 <= this.currentIndex && this.currentIndex + 1 <= this.itemLength;
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

        return this;
    };

    return factory;
});
