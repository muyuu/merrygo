# antibase-carousel

this code is javascript carousel library for browser(contain ie8).

## dependences
- jquery@1.12.1

## install
npm install --save-dev merrygo

## usage

### browserify
```
var merrygo = require('merrygo');

var carousel01 merrygo({root: "js-carouselpattern01"});

var carousel02 merrygo({
    root: "js-carouselpattern02",
    duration: 600,
    interval: 3000,
    length: 3
});
```

### other
```
<script src="jquery.js"></script>
<script src="merrygo.js"></script>
<script src="app.js"></script> // module load

# app.js
var carousel01 = merrygo();
```


