// Generated on 2016-04-01 using generator-angular 0.15.1
'use strict';

let gulp = require('gulp');
let $ = require('gulp-load-plugins')();
let openURL = require("open");
let lazypipe = require('lazypipe');
let rimraf = require('rimraf');
let wiredep = require('wiredep').stream;
let runSequence = require('run-sequence');
let Server = require('karma').Server;

let yeoman = {
  app: require('./bower.json').appPath || 'app',
  dist: 'dist'
};


let paths = {
  scripts: [yeoman.app + '/scripts/**/*.js'],
  buildScriptsDest: yeoman.app + '/build-scripts',
  buildScripts : [yeoman.app + '/build-scripts/**/*.js'],
  serverScripts: ['server/**/*.js'],
  styles: [yeoman.app + '/sass/**/*.scss'],
  views: {
    main: yeoman.app + '/index.html',
    files: [yeoman.app + '/views/**/*.html']
  }
};

////////////////////////
// Reusable pipelines //
////////////////////////

let lintScripts = lazypipe()
  .pipe($.jshint, '.jshintrc')
  .pipe($.jshint.reporter, 'jshint-stylish');

let styles = lazypipe()
  .pipe($.sass, {
    outputStyle: 'compressed',
    precision: 10
  })
  .pipe($.autoprefixer, 'last 1 version')
  .pipe(gulp.dest, 'app/styles');

let es6ClientScript = lazypipe()
  .pipe($.babel, {
    presets: ['es2015']
  })
  .pipe(gulp.dest, paths.buildScriptsDest);

let es6ServerScript = lazypipe()
  .pipe($.babel, {
    presets: ['es2015']
  })
  .pipe(gulp.dest, 'build-server');

///////////
// Tasks //
///////////

gulp.task('styles', function () {
  return gulp.src(paths.styles)
    .pipe(styles());
});

gulp.task('lint:clientScripts', function () {
  return gulp.src(paths.scripts)
    .pipe(lintScripts());
});

gulp.task('lint:serverScripts', function () {
  return gulp.src(paths.serverScripts)
    .pipe(lintScripts());
});

gulp.task('start:client', ['start:server'], function () {
  openURL("http://localhost:9000","chrome");
});

gulp.task('start:server', ['styles', 'es6:frontend', 'es6:server', 'bower'], function(cb) {
  let started = false;
  return $.nodemon({
    script: 'build-server/app.js',
    ignore: ["app","dist","upload","node","node-v6.9.1","build-server"]
  }).on('start', function () {
    if (!started) {
      cb();
      started = true;
    }
  });
});

gulp.task('test', function (cb) {
  return new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, cb).start();
});

gulp.task('webdriver-update', function(cb){
  $.protractor.webdriver_update({
    webdriverManagerArgs: ['--ignore_ssl']
  },cb);
});

gulp.task('e2e', ['webdriver-update', 'serve'], function(cb) {
  gulp.src([]).pipe($.protractor.protractor({
    configFile: "protractor.conf.js",
  })).on('error', function(e) {
    throw e;
  }).on('end', cb);
});

gulp.task('watch', function () {
  $.livereload.listen();
  $.watch(paths.styles)
    .pipe($.plumber())
    .pipe(styles())
    .pipe($.livereload());

  $.watch(paths.views.files)
    .pipe($.plumber())
    .pipe($.livereload());

  $.watch(paths.scripts)
    .pipe($.plumber())
    .pipe(lintScripts())
    .pipe(es6ClientScript())
    .pipe($.livereload());

  $.watch(paths.serverScripts)
    .pipe($.plumber())
    .pipe(lintScripts())
    .pipe(es6ServerScript());

  gulp.watch('bower.json', ['bower']);
  gulp.watch('./app/sass/*.scss', ['styles']);
});

gulp.task('serve', function (cb) {
  runSequence(
    ['lint:clientScripts'],
    ['lint:serverScripts'],
    ['start:client'],
    'watch', cb);
});

// inject bower components
gulp.task('bower', function () {
  return gulp.src(paths.views.main)
    .pipe(wiredep({
      directory: yeoman.app + '/bower_components',
      ignorePath: '..',
      exclude: ['bower_components/mermaid/dist/mermaid.slim.js']
    }))
    .pipe(gulp.dest(yeoman.app));
});

///////////
// Build //
///////////

gulp.task('clean:dist', function (cb) {
  rimraf('./dist', cb);
});

gulp.task('clean:server', function(cb) {
  rimraf('./build-server', cb);
});

gulp.task('clean:client', function(cb) {
  rimraf('./app/build-scripts', cb);
});

gulp.task('es6:frontend', () => {
  return gulp.src(paths.scripts)
    .pipe(es6ClientScript());
});

gulp.task('es6:server', () => {
  return gulp.src(paths.serverScripts)
    .pipe(es6ServerScript());
});

gulp.task('client:build', ['html', 'styles', 'es6:frontend', 'es6:server'], function () {
  let jsFilter = $.filter('**/*.js');
  let cssFilter = $.filter('**/*.css');

  return gulp.src(paths.views.main)
    .pipe($.useref({
      transformPath: function(filePath) {
        if(filePath.indexOf("/app/bower_components") === -1) {
          return filePath.replace('/bower_components', '/app/bower_components')
        }else{
          return filePath;
        }
      }
    }))
    .pipe(jsFilter)
    .pipe($.ngAnnotate())
    .pipe($.uglify())
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.minifyCss({cache: true}))
    .pipe(cssFilter.restore())
    .pipe($.rev())
    .pipe($.revReplace())
    .pipe(gulp.dest(yeoman.dist));
});

gulp.task('client:rename', ['client:build'], function(){
  return gulp.src(yeoman.dist + "/index*.html")
    .pipe($.rimraf({force: true}))
    .pipe($.rename("index.html"))
    .pipe(gulp.dest(yeoman.dist))
});

gulp.task('html', function () {
  return gulp.src(yeoman.app + '/views/**/*')
    .pipe(gulp.dest(yeoman.dist + '/views'));
});

gulp.task('images', function () {
  return gulp.src(yeoman.app + '/images/**/*')
    //.pipe($.imagemin({
    //  optimizationLevel: 5,
    //  progressive: true,
    //  interlaced: true
    //}))
    .pipe(gulp.dest(yeoman.dist + '/images'));
});

gulp.task('favicon', function(){
  return gulp.src(yeoman.app + '/favicon.ico')
    .pipe(gulp.dest(yeoman.dist));
});

gulp.task('pageNotFound', function(){
  return gulp.src(yeoman.app + '/404.html')
    .pipe(gulp.dest(yeoman.dist));
});

gulp.task('config', () => {
  return gulp.src("server/config.js.template")
    .pipe(gulp.dest("build-server"));
});

gulp.task('lib', ()=> {
  return gulp.src("server/lib/*").pipe(gulp.dest("build-server/lib"));
});

gulp.task('copy:extras', function () {
  return gulp.src(yeoman.app + '/*/.*', { dot: true })
    .pipe(gulp.dest(yeoman.dist));
});

gulp.task('copy:fonts', function () {
  return gulp.src(yeoman.app + '/bower_components/bootstrap/fonts/**/*')
    .pipe(gulp.dest(yeoman.dist + '/fonts'));
});

gulp.task('build', ['clean:dist', 'clean:server', 'clean:client'], function (cb) {
  runSequence(['config', 'lib', 'images', 'favicon', 'copy:extras', 'copy:fonts', 'client:rename', 'pageNotFound'], cb);
});

gulp.task('war', ['build'], () => {
  return gulp.src([yeoman.dist + "/**"])
    .pipe($.war({
      welcome: 'index.html',
      displayName: 'OCManagerWeb'
    }))
    .pipe($.zip('OCManagerWeb.war'))
    .pipe(gulp.dest("."));
});

gulp.task('default', ['build']);
