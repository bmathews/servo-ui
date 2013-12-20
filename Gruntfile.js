'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    nodewebkit: {
      options: {
        version: '0.8.2',
        build_dir: './build',
        credits: './public/credits.html',
        mac: true,
        win: true,
        linux32: false,
        linux64: false,
      },
      src: ['./**/*', '!./node_modules/grunt/**/*', '!./node_modules/grunt-node-webkit-builder/**/*']
    },
  });

  grunt.loadNpmTasks('grunt-node-webkit-builder');
  grunt.registerTask('default', ['nodewebkit']);
};