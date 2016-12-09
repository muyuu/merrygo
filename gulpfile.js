const g = require("gulp");
const $ = require( 'gulp-load-plugins' )();
const connect = require('gulp-connect');

const port = 4000;

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

g.task('css', ()=>
    g.src(['src/css/style.sass'])
    .pipe($.sass())
    .pipe(g.dest('./'))
);

g.task('babel', ()=>
    g.src([`src/js/${file}`])
    .pipe($.babel({
        presets: ['es2015']
    }))
    .pipe(g.dest('./'))
);

g.task('lint', ()=>
    g.src([file])
    .pipe($.eslint())
    .pipe($.eslint.format())
);


g.task('dev', ['babel'], ()=> g.start(['lint']) );

g.task("default", ['connect'], ()=>{
    g.watch("src/**/*.js", ["dev"]);
    return g.watch("src/**/*.sass", ["css"]);
});


 //build
g.task('build', ()=>
    g.src(file)
    .pipe($.sourcemaps.init())
    .pipe($.rename({
        basename: `${filename}.min`,
        extname: ".js"
    }))
    .pipe($.uglify())
    .pipe($.sourcemaps.write('./'))
    .pipe(g.dest('./'))
);


