module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: {
        src: ['*.js', './src/*/*.js', './public/src/js/*.js', './test/*.js']
      },
      options: {
        force: true,
        globals: {
          jQuery: true
        }
      }
    },
    jsdoc: {
      internal: {
        src: ['*.js', './src/*/*.js', './test/*.js'],
        options: {
          destination: 'doc/internal'
        }
      },
      external: {
        src: ['./public/src/js/*.js'],
        options: {
          destination: 'doc/external'
        }
      }
    },
    uglify: {
      target: {
        files: {
          './public/dist/js/output.min.js': ['./public/src/js/*.js']
        }
      }
    },
    cssmin: {
      target: {
        files: {
          './public/dist/css/output.min.css': ['./public/src/css/*.css']
        }
      }
    },
    nodeunit: {
      all: ['./test/*.js']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');


  grunt.registerTask('check', ['jshint']);
  grunt.registerTask('document', ['jsdoc']);
  grunt.registerTask('build', ['uglify', 'cssmin']);
  grunt.registerTask('test', ['nodeunit']);

  grunt.registerTask('default', ['check', 'build', 'test']);

  grunt.registerTask('full', ['default', 'document']);
};