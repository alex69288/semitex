const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sourcemap = require('gulp-sourcemaps');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const csso = require('postcss-csso');
const rename = require('gulp-rename');
const htmlmin = require('gulp-htmlmin');
const terser = require('gulp-terser');
const imagemin = require('gulp-imagemin');
// const imagemin = require("gulp-libsquoosh");
const webp = require('gulp-webp');
const svgstore = require('gulp-svgstore');
const cheerio = require('gulp-cheerio');
const del = require('del');
const sync = require('browser-sync').create();

// Styles
const styles = () => {
  return gulp
    .src('source/scss/*.scss')
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer(), csso()]))
    .pipe(rename('style.min.css'))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('build/css'))
    .pipe(sync.stream());
};

exports.styles = styles;

// HTML
const html = () => {
  return gulp
    .src('source/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'));
};

exports.html = html;

// Scripts
const script = () => {
  return gulp
    .src('source/js/*.js')
    .pipe(terser())
    .pipe(rename(path => (path.basename += `.min`)))
    .pipe(gulp.dest('build/js'))
    .pipe(sync.stream());
};

exports.script = script;

// Images
const optimizeImages = () => {
  return gulp
    .src('source/img/**/*.{jpg,png,svg}')
    .pipe(imagemin())
    .pipe(gulp.dest('build/img'));
};

exports.optimizeImages = optimizeImages;

const copyImages = () => {
  return gulp.src('source/img/**/*.{jpg,png,svg}').pipe(gulp.dest('build/img'));
};

exports.copyImages = copyImages;

// WebP
const createWebp = () => {
  return gulp
    .src('source/img/**/*.{jpg,png}')
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest('build/img'));
};

exports.createWebp = createWebp;

// Sprite
const sprite = () => {
  return gulp
    .src('source/img/icon/*.svg')
    .pipe(
      svgstore({
        inlineSvg: true,
      })
    )
    .pipe(
      cheerio({
        run: $ => {
          $('[fill]').removeAttr('fill');
        },
        parserOptions: { xmlMode: true },
      })
    )
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img/icon'));
};

exports.sprite = sprite;

// Copy
const copy = done => {
  gulp
    .src(
      [
        'source/img/**/*.*',
        'source/fonts/*.{woff2,woff}',
        'source/*.ico',
        'source/img/**/*.svg',
        '!source/img/icons/*.svg',
      ],
      {
        base: 'source',
      }
    )
    .pipe(gulp.dest('build'));
  done();
};

exports.copy = copy;

// Clean
const clean = () => {
  return del('build');
};

exports.clean = clean;

// Server
const server = done => {
  sync.init({
    server: {
      baseDir: 'build',
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

exports.server = server;

// Reload
const reload = done => {
  sync.reload();
  done();
};

const watchStyles = () => {
  gulp.watch('source/scss/**/*.scss', gulp.series(styles, reload));
};

// Watcher
const watcher = () => {
  gulp.watch('source', gulp.series(copy, copyImages, createWebp));
  gulp.watch('source/img/icon/*.svg', gulp.series(sprite));
  // gulp.watch('source/sсss/**/*.scss', gulp.series(styles, reload));
  watchStyles();
  gulp.watch('source/js/script.js', gulp.series(script));
  gulp.watch('source/*.html', gulp.series(html, reload));
};

// Build
const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(styles, html, script, sprite, createWebp)
);

exports.build = build;

// Default
exports.default = gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(styles, html, script, sprite, createWebp),
  gulp.series(server, watcher)
);
