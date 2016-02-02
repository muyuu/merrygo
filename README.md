# antibase-carousel

this code is javascript carousel library for browser(contain ie8).

## dependences
- jquery@1.12.0

## install
npm install --save-dev antibase-carousel

## usage

### browserify
```
var carousel = require('carousel');

var carousel01 carousel({root: "js-carouselpattern01"});

var carousel02 carousel({
    root: "js-carouselpattern02",
    duration: 600,
    interval: 3000,
    length: 3
});
```

### other
```
<script src="jquery.js"></script>
<script src="carousel.js"></script>
<script src="app.js"></script> // module load

# app.js
var carousel01 = uiCarousel();
```


