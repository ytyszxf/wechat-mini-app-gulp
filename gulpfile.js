var gulp = require("gulp");
var gutil = require("gulp-util");
var ts = require('gulp-typescript');
var tsProject = ts.createProject('./tsconfig.json');
var sass = require('gulp-sass');
var rename = require("gulp-rename");
var gnf = require('gulp-npm-files');
var mainNpmFiles = require('gulp-main-npm-files');
var clean = require('gulp-clean');
const runSequence = require('run-sequence');
const requireFile = require('gulp-require-file');
var rollup = require('rollup').rollup;
var fs = require('fs');
const filter = require('gulp-filter');
var browserify = require('gulp-browserify');
var commonjs    = require('rollup-plugin-commonjs');
var nodeResolve = require('rollup-plugin-node-resolve');

const vendor = 'src/vendor';
const ignoreVendorPath = '!src/vendor/**';
var paths = {
  vendor: vendor,
  pages: ['src/**/*.wxml', ignoreVendorPath],
  css: ['src/**/*.scss', 'src/**/*.wxss', ignoreVendorPath],
  tscripts: ['src/**/*.ts', ignoreVendorPath],
  js: ['src/**/*.js', ignoreVendorPath],
  configs: ['./src/**/*.json', ignoreVendorPath],
  resource: ['./src/resources/**/*', ignoreVendorPath]
};

gulp.task('watch', ['compile', 'copy-ui', 'sass', 'copy-config', 'copy-js', 'copy-resource'], function() {
  gulp.watch(paths.tscripts, ['compile']);
  gulp.watch(paths.pages, ['copy-ui']);
  gulp.watch(paths.css, ['sass']);
  gulp.watch(paths.configs, ['copy-config']);
  gulp.watch(paths.js, ['copy-js']);
  gulp.watch(paths.resource, ['copy-resource']);
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

  return tsResult.js
    .pipe(gulp.dest('dist'));
});

gulp.task('copy-config', function () {
  return gulp.src(paths.configs)
    .pipe(gulp.dest('dist'));
});

gulp.task('copy-resource', function () {
  return gulp.src(paths.resource)
    .pipe(gulp.dest('dist/resources'));
});

gulp.task('sass', function () {
  return gulp.src('./src/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(rename((path) => {
      path.extname = '.wxss';
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('vendor', function() {
  gulp.src(gnf(), {base: './'})
    .pipe(rename((path) => {
      path.dirname = path.dirname.replace('node_modules/', '');
    }))
    .pipe(gulp.dest('src/vendor'))
    .pipe(gulp.dest('dist/vendor'));
});

gulp.task('clean:dist', function () {
  return gulp.src('dist', { read: false })
    .pipe(clean());
});

gulp.task('clean:vendor', function () {
  return gulp.src('src/vendor', { read: false })
    .pipe(clean());
});

gulp.task('clean', ['clean:dist', 'clean:vendor']);

gulp.task("default", function () {
  runSequence('clean', 'vendor', 'watch');
});