// Karma configuration
// Generated on Wed Jun 07 2017 15:04:36 GMT+0800 (CST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'app/bower_components/jquery/dist/jquery.js',
      'app/bower_components/jquery-ui/jquery-ui.js',
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/angular-ui-router/release/angular-ui-router.js',
      'app/bower_components/bootstrap/dist/js/bootstrap.js',
      'app/bower_components/angular-animate/angular-animate.js',
      'app/bower_components/angular-aria/angular-aria.js',
      'app/bower_components/angular-cookies/angular-cookies.js',
      'app/bower_components/angular-messages/angular-messages.js',
      'app/bower_components/angular-resource/angular-resource.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/angular-sanitize/angular-sanitize.js',
      'app/bower_components/angular-touch/angular-touch.js',
      'app/bower_components/bootstrap-sidebar/dist/js/sidebar.js',
      'app/bower_components/angular-translate/angular-translate.js',
      'app/bower_components/ng-file-upload/ng-file-upload.js',
      'app/bower_components/isteven-angular-multiselect/isteven-multi-select.js',
      'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'app/bower_components/angular-ui-notification/dist/angular-ui-notification.js',
      'app/bower_components/spin.js/spin.js',
      'app/bower_components/angular-spinner/angular-spinner.js',
      'app/bower_components/angular-ui-select/dist/select.js',
      'app/bower_components/angular-toggle-switch/angular-toggle-switch.js',
      'app/bower_components/angular-hotkeys/build/hotkeys.js',
      'app/bower_components/bootstrap-ui-datetime-picker/dist/datetime-picker.js',
      'app/bower_components/moment/moment.js',
      'app/bower_components/angular-moment/angular-moment.js',
      'app/bower_components/bootstrap-tokenfield/dist/bootstrap-tokenfield.js',
      'app/bower_components/bootstrap-application-wizard/dist/bootstrap-wizard.js',
      'app/bower_components/chart.js/dist/Chart.js',
      'app/bower_components/angular-chart.js/dist/angular-chart.js',
      'app/bower_components/angular-drag-and-drop-lists/angular-drag-and-drop-lists.js',
      'app/bower_components/mermaid/dist/mermaid.js',
      'app/bower_components/angular-tree-control/angular-tree-control.js',
      'app/bower_components/highcharts/highcharts.js',
      'app/bower_components/highcharts-ng/dist/highcharts-ng.js',
      'app/build-scripts/**/*.js',
      'test/spec/**/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
};
