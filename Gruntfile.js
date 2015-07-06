module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    connect: {
      all: {
        options: {
          port: 80,
          base: '',
          livereload: true,
          keepalive: false,

          middleware: function(connect, options) {
            return [
              require('grunt-contrib-livereload/lib/utils').livereloadSnippet,
              connect.static(options.base[0])
            ];
          }
        }
      }
    },

   /* watch: {
      options: {
        livereload: true
      },
      css: {
        files: 'index.html',
        tasks: ['livereload']
      }
    }, */

    regarde: {
      all: {
        files:['css/*', "index.html"],
        tasks: ['livereload']
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  //grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-livereload');
  grunt.loadNpmTasks('grunt-regarde');

  grunt.registerTask('default', ['livereload-start', 'connect', 'regarde']);

};