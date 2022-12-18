const { watch, series, src, dest, parallel } = require('gulp');
const pug = require('gulp-pug');
const stylus = require('gulp-stylus');
const ts = require('gulp-typescript');
const imagemin    = require('gulp-imagemin');
const sorcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const del = require('del');
const browserSync = require('browser-sync').create();

function pugToHtml( dev_mode = true){
  return src('./src/Pages/**/*.pug')
    .pipe( pug({
      pretty: dev_mode
    }))
    .pipe(dest('./dist'));
}
function stylusToCss( dev_mode = true ){
  return src('./src/Stylus/app.styl')
    .pipe( sorcemaps.init() )
    .pipe( stylus({
      linenos: dev_mode,
      compress: !dev_mode
    }) )
    .pipe( rename({
      prefix: 'style.',
      basename: 'min'
    }))
    .pipe( sorcemaps.write(('./')) )
    .pipe( dest('./dist/assets/css') );
}
function typeScript(){
  return src('./src/Typescript/main.ts')
    .pipe( ts({
      noImplicitAny: true,
      outFile: 'main.js'
    }) )
    .pipe( dest( './dist/assets/js/' ));
}
function images(){
  return src('./src/assets/**/*')
    .pipe( imagemin() )
    .pipe( dest('./dist/assets/images'));
}

function watchFiles(){
  watch('./src/**/*.pug', pugToHtml );
  watch('./src/Stylus/**/*.styl', stylusToCss );
  watch('./src/Typescript/**/*.ts', typeScript );
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
  watch('./dist/**/*.html').on( 'change', browserSync.reload );
  watch('./dist/assets/css/style.min.css').on( 'change', browserSync.reload );
  watch('./dist/assets/js/*.js').on( 'change', browserSync.reload );
}
function clean(){
  console.log( 'Cleanning Dist...' );
  return del(['./dist/']);
}
function files(){
  return src('./src/plugins/**/*.*')
    .pipe(dest('./dist/assets/plugins'));
}
function build() {
  const dev_mode = false;
  
  pugToHtml( dev_mode );
  stylusToCss( dev_mode );
  typeScript();
  images();
  files();
  return src('./package.json');
}

exports.dev = series( clean, pugToHtml, stylusToCss, typeScript, files, images, watchFiles );
exports.build = series(clean,  build );