var gulp = require("gulp");
var gutil = require("gulp-util");
var ts = require('gulp-typescript');
var tsProject = ts.createProject('src/tsconfig.json');

var paths = {
  pages: ['src/**/*.wxml'],
  css: ['src/**/*.wxss'],
  tscripts: ['src/**/*.ts'],
  configs: ['./src/app.json']
};

gulp.task('watch', ['compile', 'copy-ui', 'copy-css', 'copy-confg'], function() {
  gulp.watch(paths.tscripts, ['compile']);
  gulp.watch(paths.pages, ['copy-ui']);
  gulp.watch(paths.css, ['copy-css']);
  gulp.watch(paths.configs, ['copy-config'])
});

gulp.task("copy-ui", function () {
  return gulp.src(paths.pages)
    .pipe(gulp.dest("dist"));
});

gulp.task("copy-css", function () {
  return gulp.src(paths.css)
    .pipe(gulp.dest("dist"));
});

gulp.task('compile', function() {
  var tsResult = gulp.src(paths.tscripts) // or tsProject.src()
    .pipe(tsProject());

  return tsResult.js.pipe(gulp.dest('dist'));
});

gulp.task('copy-confg', function () {
  return gulp.src(paths.configs)
    .pipe(gulp.dest('dist'));
});

gulp.task("default", ["watch"]);