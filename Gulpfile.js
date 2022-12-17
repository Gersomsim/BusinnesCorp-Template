const { watch, series, src, dest } = require('gulp');
const pug = require('gulp-pug');
const stylus = require('gulp-stylus');
const sorcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();

function pugToHtml(){
  return src('./src/Pages/**/*.pug')
    .pipe( pug() )
    .pipe(dest('./dist'));
}
function stylusToCss(){
  return src('./src/Stylus/app.styl')
    .pipe( sorcemaps.init() )
    .pipe( stylus({linenos: true}) )
    .pipe( rename({
      prefix: 'style.',
      basename: 'min'
    }))
    .pipe( sorcemaps.write(('./')) )
    .pipe( dest('./dist/css') );
}
function watchFiles(){
  watch('./src/**/*.pug', pugToHtml );
  watch('./src/Stylus/**/*.styl', stylusToCss );
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
  watch('./dist/**/*.html').on( 'change', browserSync.reload );
  watch('./dist/css/style.min.css').on( 'change', browserSync.reload );
}

exports.watch = series( pugToHtml, stylusToCss, watchFiles );