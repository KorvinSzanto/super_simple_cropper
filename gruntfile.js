module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({

    jshint: {
      all: ['src'],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    browserify: {
      dist: {
        files: {
          'build/imgcropper.js': ['src/build.js'],
        }
      }
    },
    uglify: {
      dist: {
        options: {
          sourceMap: true,
          sourceMapName: 'build/imgcropper.map'
        },
        files: {
          'build/imgcropper.min.js': ['build/imgcropper.js']
        }
      }
    }
  });


  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-browserify');

  // Default task.
  grunt.registerTask('default', ['jshint', 'browserify']);
  grunt.registerTask('release', ['jshint', 'browserify', 'uglify']);

};
