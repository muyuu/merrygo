(function(definition){
    "use strict";

    const moduleName = "merrygo";

    const root = (typeof self === "object" && self.self === self && self) || (typeof global === "object" && global.global === global && global);

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

    $.easing['jswing'] = $.easing['swing'];

    $.extend( $.easing, {
        def: 'easeOutQuad',
        swing: function (x, t, b, c, d) {
            //alert($.easing.default);
            return $.easing[$.easing.def](x, t, b, c, d);
        },
        easeInQuad: function (x, t, b, c, d) {
            return c*(t/=d)*t + b;
        },
        easeOutQuad: function (x, t, b, c, d) {
            return -c *(t/=d)*(t-2) + b;
        },
        easeInOutQuad: function (x, t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t + b;
            return -c/2 * ((--t)*(t-2) - 1) + b;
        },
        easeInCubic: function (x, t, b, c, d) {
            return c*(t/=d)*t*t + b;
        },
        easeOutCubic: function (x, t, b, c, d) {
            return c*((t=t/d-1)*t*t + 1) + b;
        },
        easeInOutCubic: function (x, t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t*t + b;
            return c/2*((t-=2)*t*t + 2) + b;
        },
        easeInQuart: function (x, t, b, c, d) {
            return c*(t/=d)*t*t*t + b;
        },
        easeOutQuart: function (x, t, b, c, d) {
            return -c * ((t=t/d-1)*t*t*t - 1) + b;
        },
        easeInOutQuart: function (x, t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
            return -c/2 * ((t-=2)*t*t*t - 2) + b;
        },
        easeInQuint: function (x, t, b, c, d) {
            return c*(t/=d)*t*t*t*t + b;
        },
        easeOutQuint: function (x, t, b, c, d) {
            return c*((t=t/d-1)*t*t*t*t + 1) + b;
        },
        easeInOutQuint: function (x, t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
            return c/2*((t-=2)*t*t*t*t + 2) + b;
        },
        easeInSine: function (x, t, b, c, d) {
            return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
        },
        easeOutSine: function (x, t, b, c, d) {
            return c * Math.sin(t/d * (Math.PI/2)) + b;
        },
        easeInOutSine: function (x, t, b, c, d) {
            return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
        },
        easeInExpo: function (x, t, b, c, d) {
            return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
        },
        easeOutExpo: function (x, t, b, c, d) {
            return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
        },
        easeInOutExpo: function (x, t, b, c, d) {
            if (t==0) return b;
            if (t==d) return b+c;
            if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
            return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
        },
        easeInCirc: function (x, t, b, c, d) {
            return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
        },
        easeOutCirc: function (x, t, b, c, d) {
            return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
        },
        easeInOutCirc: function (x, t, b, c, d) {
            if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
            return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
        },
        easeInElastic: function (x, t, b, c, d) {
            var s=1.70158;var p=0;var a=c;
            if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
            if (a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        },
        easeOutElastic: function (x, t, b, c, d) {
            var s=1.70158;var p=0;var a=c;
            if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
            if (a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
        },
        easeInOutElastic: function (x, t, b, c, d) {
            var s=1.70158;var p=0;var a=c;
            if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
            if (a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
            return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
        },
        easeInBack: function (x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c*(t/=d)*t*((s+1)*t - s) + b;
        },
        easeOutBack: function (x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
        },
        easeInOutBack: function (x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
            return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
        },
        easeInBounce: function (x, t, b, c, d) {
            return c - $.easing.easeOutBounce (x, d-t, 0, c, d) + b;
        },
        easeOutBounce: function (x, t, b, c, d) {
            if ((t/=d) < (1/2.75)) {
                return c*(7.5625*t*t) + b;
            } else if (t < (2/2.75)) {
                return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
            } else if (t < (2.5/2.75)) {
                return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
            } else {
                return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
            }
        },
        easeInOutBounce: function (x, t, b, c, d) {
            if (t < d/2) return $.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
            return $.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
        }
    });


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

        let rootElement = ".js-merrygo";
        let opt = !isUndefined(param) ? param : {};

        let $list;
        if (isUndefined(opt.root)) $list = $(rootElement);
        if (!isUndefined(opt.root)) $list = opt.root instanceof $ ? param.root : $(param.root);

        let length = $list.length;
        let mappedlist = [];
        for (let i = 0; i < length; i++) {
            mappedlist[i] = new Module(opt, $list[i]);
        }
        return mappedlist;
    }


    /**
     * constructor
     * @type {Function}
     */
    function Module(opt, moduleRoot){

        this.rootclass = moduleRoot;

        // options
        this.opt = {
            // prefix
            prefix: "js-",

            // length
            length : !isUndefined(opt.length) ? opt.length : 1,

            force : !isUndefined(opt.force) ? opt.force : false,

            //elements
            inner: !isUndefined(opt.inner) ? opt.inner : ".js-merrygo__inner",
            items: !isUndefined(opt.items) ? opt.items : ".js-merrygo__items",
            item : !isUndefined(opt.item) ? opt.item : ".js-merrygo__item",

            //arrow
            useArrow : !isUndefined(opt.useArrow) ? opt.useArrow : true,
            arrow    : !isUndefined(opt.arrow) ? opt.arrow : ".js-merrygo__arrow",
            arrowPrev: !isUndefined(opt.arrowPrev) ? opt.arrowPrev : ".js-merrygo__arrowPrev",
            arrowNext: !isUndefined(opt.arrowNext) ? opt.arrowNext : ".js-merrygo__arrowNext",

            //margin
            itemMargin: !isUndefined(opt.itemMargin) ? opt.itemMargin : 0,

            //dots
            useDots   : !isUndefined(opt.useDots) ? opt.useDots : true,
            dots      : !isUndefined(opt.dots) ? opt.dots : ".js-merrygo__dots",
            dot       : !isUndefined(opt.dot) ? opt.dot : ".js-merrygo__dot",
            dotContent: !isUndefined(opt.dotContent) ? opt.dotContent : "○",

            //state
            currentClass: !isUndefined(opt.currentClass) ? opt.currentClass : "current",

            //animation
            autoStart: !isUndefined(opt.autoStart) ? opt.autoStart : true,
            duration : !isUndefined(opt.duration) ? opt.duration : 400,
            interval : !isUndefined(opt.interval) ? opt.interval : 3000,
            easing   : !isUndefined(opt.easing) ? opt.easing : "linear",

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
        if ( !this.isRun() ){
            if (this.opt.useArrow) this.$arrow.hide();
            return false;
        }


        // init
        this.setDom();
        this.reset();
        this.setCss();
        this.pushCurrentClass();


        // set event
        this.startTimerEvent();
        this.setClickEvent();
        this.setHoverEvent();
        this.setResizeEvent();
    }


    Module.prototype.isRun = function(){
        return this.itemLength > this.opt.length || this.opt.force;
    };


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


    Module.prototype.makeDotsDomStr = function(){

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


    Module.prototype.setCss = function(){
        this.$items.css({
            width: this.singleItemWidth * this.itemLength * 3,
            left : -(this.singleItemWidth * this.itemLength)
        });
        this.$root.find(this.opt.item).css({
            width: this.singleItemWidth,
            "padding-left": (this.opt.itemMargin / 2),
            "padding-right": (this.opt.itemMargin / 2)
        });
    };


    Module.prototype.cancelTimerEvent = function(){
        if( ! this.opt.autoStart ) return;
        clearInterval(this.timer);
    };


    Module.prototype.startTimerEvent = function(){
        if( ! this.opt.autoStart ) return;

        clearInterval(this.timer);

        this.timer = setInterval(()=>{
            this.next();
        }, this.opt.interval);
    };


    Module.prototype.setClickEvent = function(){

        if(this.opt.useArrow){
            this.$arrow.on("click", (e)=>{

                if (this.isAnimate) return false;

                this.isAnimate = true;
                this.cancelTimerEvent();

                if ($(e.currentTarget).hasClass(trimDot(this.opt.arrowNext))) this.next();
                if ($(e.currentTarget).hasClass(trimDot(this.opt.arrowPrev))) this.prev();

                return false;
            });
        }

        if(this.opt.useDots){
            this.$dot.on("click", (e)=>{

                if (this.isAnimate) return false;

                var index = this.$dot.index(e.currentTarget);

                var moveLength = index - this.currentIndex;
                if (index === this.currentIndex) return false;

                this.isAnimate = true;
                this.cancelTimerEvent();

                this.moveToIndex(index);
            });
        }
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
        this.singleItemWidth = $(this.rootclass).innerWidth() / this.opt.length;
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
            this.opt.easing,
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


    /**
     * あり得ない数値になった場合に丸める
     * @return {object} this object
     */
    Module.prototype.roundIndex = function(){

        // itemLength より大きな数値になってしまったら0にする
        if (this.currentIndex >= this.itemLength){
            this.currentIndex = 0;
        }

        // 0 より小さな数値になってしまったらitemLength - 1にする
        if (this.currentIndex < 0){
            this.currentIndex = this.itemLength - 1;
        }

        return this;
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
