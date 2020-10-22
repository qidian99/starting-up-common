const webpackConfig = require('./webpack.config.js');
webpackConfig.mode = 'production';

module.exports = function(config) {
  config.set({
    singleRun: true,
    
    browsers: ['Chrome'],


    frameworks: [
      'jasmine',
      'webpack',
    ],

    files: [
      'spec.bundle.js',
      { pattern: 'test/**/*.test.js', watched: false }
    ],

    preprocessors: {
      'spec.bundle.js': ['webpack'],
      'test/*_test.js': ['webpack'],
      'test/**/*_test.js': ['webpack']
    },

    // webpack: {},

    // webpack: webpackConfig,

    // webpackMiddleware: {
    //   stats: 'errors-only'
    // },

    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-webpack')
    ]
  });
};
