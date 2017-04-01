var gulp = require("gulp");
var gutil = require("gulp-util");
var ts = require('gulp-typescript');
var tsProject = ts.createProject('./tsconfig.json');
var sass = require('gulp-sass');
var rename = require("gulp-rename");

var paths = {
  pages: ['src/**/*.wxml'],
  css: ['src/**/*.scss', 'src/**/*.wxss'],
  tscripts: ['src/**/*.ts'],
  js: ['src/**/*.js'],
  configs: ['./src/**/*.json']
};

gulp.task('watch', ['compile', 'copy-ui', 'sass', 'copy-config', 'copy-js'], function() {
  gulp.watch(paths.tscripts, ['compile']);
  gulp.watch(paths.pages, ['copy-ui']);
  gulp.watch(paths.css, ['sass']);
  gulp.watch(paths.configs, ['copy-config']);
  gulp.watch(paths.js, ['copy-js']);
});

gulp.task("copy-ui", function () {
  return gulp.src(paths.pages)
    .pipe(gulp.dest("dist"));
});

gulp.task("copy-js", function () {
  return gulp.src(paths.js)
    .pipe(gulp.dest("dist"));
});

gulp.task('compile', function() {
  var tsResult = gulp.src(paths.tscripts) // or tsProject.src()
    .pipe(tsProject());

  return tsResult.js.pipe(gulp.dest('dist'));
});

gulp.task('copy-config', function () {
  return gulp.src(paths.configs)
    .pipe(gulp.dest('dist'));
});

gulp.task('sass', function () {
  return gulp.src('./src/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(rename((path) => {
      path.extname = '.wxss';
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task("default", ["watch"]);