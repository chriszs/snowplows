module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['src/script/script.js']
    },
    uglify: {
      options: {
        sourceMap: true,
        sourceMapIncludeSources: true
      },
      dist: {
        files: {
          'dist/script.min.js': ['src/script/lib/*.js','src/script/script.js']
        }
      }
    },
    less: {
      dist: {
        options: {
          yuicompress: false,
          ieCompat: true
        },
        files: {
          'dist/style.css': 'src/style/style.less'
        }
      }
    },
    csslint: {
      dist: {
        options: {
          'known-properties': false,
          'adjoining-classes': false,
          'box-model': false,
          'font-sizes': false
        },
        src: ['dist/style.css']
      }
    },
    cssmin: {
      dist: {
        files: {
          'dist/style.min.css': ['dist/style.css']
        }
      }
    },
    clean: {
      dist: ['dist/*','dist/data/*']
    },
    copy: {
      dist: {
        files: [
          {
            expand: true,
            cwd: 'src/',
            src: ['*.html'],
            dest: 'dist/'
          },
          {
            expand: true,
            cwd: 'src/data/',
            src: ['*'],
            dest: 'dist/data/'
          }
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('build', ['clean:dist','jshint','uglify:dist','less:dist','csslint:dist','cssmin:dist','copy:dist']);


};