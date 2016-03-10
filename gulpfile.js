const g = require("gulp");
const $ = require( 'gulp-load-plugins' )();
const connect = require('gulp-connect');

const port = 3000;

filename = "merrygo";
file = `${filename}.js`;


// local server
g.task("connect", () => {
    connect.server({
        port      : port,
        livereload: true
    });

    g.src("./index.html")
    .pipe($.open({
        uri: `http://localhost:${port}`,
        app: `Google Chrome`
    }));
});

g.task('css', ()=>{
    return g.src(['src/css/style.sass'])
    .pipe($.sass())
    .pipe(g.dest('./'));
});

g.task('babel', ()=>{
    return g.src([`src/js/${file}`])
    .pipe($.babel({
        presets: ['es2015']
    }))
    .pipe(g.dest('./'));
});

g.task('lint', ()=>{
    return g.src([file])
    .pipe($.eslint())
    .pipe($.eslint.format());
});


g.task('dev', ['babel'], ()=>{
    return g.start(['lint']);
});

g.task("default", ['connect'], ()=>{
    g.watch("src/**/*.js", ["dev"]);
    g.watch("src/**/*.sass", ["css"]);
});


 //build
g.task('build', ()=>{
    return g.src(file)
    .pipe($.sourcemaps.init())
    .pipe($.rename({
        basename: `${filename}.min`,
        extname: ".js"
    }))
    .pipe($.uglify())
    .pipe($.sourcemaps.write('./'))
    .pipe(g.dest('./'));
});


