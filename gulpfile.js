const gulp = require('gulp'),
sass = require('gulp-sass'),
plumber = require('gulp-plumber'),
autoprefixer = require('gulp-autoprefixer'),
uglify = require('gulp-uglify'),
jshint = require('gulp-jshint'),
header  = require('gulp-header'),
rename = require('gulp-rename'),
cssnano = require('gulp-cssnano'),
babel = require('gulp-babel'),
browserify = require('gulp-browserify'),
fsCache = require( 'gulp-fs-cache' ),
package = require('./package.json');

var banner = [
    '/*!\n' +
    ' * <%= package.name %>\n' +
    ' * <%= package.title %>\n' +
    ' * <%= package.url %>\n' +
    ' * @author <%= package.author %>\n' +
    ' * @version <%= package.version %>\n' +
    ' * Copyright ' + new Date().getFullYear() + '. <%= package.license %> licensed.\n' +
    ' */',
    '\n'
].join('');

gulp.task('css', function () {
    return gulp.src('public/src/assets/scss/style.scss')
    .pipe(plumber())
    .pipe(sass({errLogToConsole: true}))
    .pipe(autoprefixer('last 4 version'))
    .pipe(gulp.dest('public/dist/assets/css'))
    .pipe(cssnano())
    .pipe(rename({ suffix: '.min' }))
    .pipe(header(banner, { package : package }))
    .pipe(gulp.dest('public/dist/assets/css'))
});

gulp.task('babel', function() {
    return gulp.src('public/src/assets/js/*.js')
    .pipe(plumber())
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(babel({ presets: ['env'] }))
    .pipe(gulp.dest('public/src/assets/js/tmp'))
});

gulp.task('js', ['babel'], function(){
    const jsCache = fsCache( '.gulp-cache/js' );

    return gulp.src('public/src/assets/js/tmp/scripts.js')
    .pipe(plumber())
    .pipe(browserify({ 
        insertGlobals: true ,
        shim: {
            jquery: {
                path: 'public/src/assets/js/vendor/jquery.min.js',
                exports: '$'
            },
            popper: {
                path: 'public/src/assets/js/vendor/popper.min.js',
                exports: 'popper',
                depends: { jquery: '$' }
            },
            bootstrap: {
                path: 'public/src/assets/js/vendor/bootstrap.min.js',
                exports: 'bootstrap',
                depends: { jquery: '$' }
            }
        }
    }))
    //.pipe(jsCache)
    //.pipe(uglify())
    //.pipe(jsCache.restore)
    .pipe(header(banner, { package : package }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('public/dist/assets/js'))
});

gulp.task('img', function() {
    return gulp.src('public/src/assets/img/*')
    .pipe(gulp.dest('public/dist/assets/img/'));
});

gulp.task('fonts', function() {
    return gulp.src('public/src/assets/fonts/*')
    .pipe(gulp.dest('public/dist/assets/fonts/'));
});

gulp.task('assets', ['img', 'fonts'], function() {});
gulp.task('build', ['assets', 'css', 'js'], function(){});
gulp.task('default', ['assets', 'css', 'js'], function () {
    gulp.watch("public/*.html", ['assets']);
    gulp.watch("public/src/assets/scss/*/*.scss", ['css']);
    gulp.watch("public/src/assets/scss/*.scss", ['css']);
    gulp.watch("public/src/assets/scss/**/*.scss", ['css']);
    gulp.watch("public/src/assets/js/**/*.js", ['js']);
    gulp.watch("public/src/assets/img/*", ['assets']);
    gulp.watch("public/src/assets/fonts/*", ['assets']);
});
