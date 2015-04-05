'use strict';
var LIVERELOAD_PORT = 35729;
var SERVER_PORT = 10001;
var lrSnippet = require('connect-livereload')({
  port: LIVERELOAD_PORT
});

var mountFolder = function(connect, dir) {
  return connect.static(require('path').resolve(dir));
};

var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;

var cacheify = require('cacheify');
var level = require('level');
// var to5ify = require('6to5ify');
var aliasify = require('aliasify');
var debowerify = require('debowerify');

var nodePath = ['./app/scripts'];
if (process.env.NODE_PATH) {
  nodePath = process.env.NODE_PATH.split(':').concat(['./app/scripts']);
}

module.exports = function(grunt) {
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // configurable paths
  var yeomanConfig = {
    app: 'app',
    dist: 'dist'
  };

  grunt.initConfig({
    yeoman: yeomanConfig,
    watch: {
      options: {
        nospawn: true,
        livereload: true,
        livereloadOnError: false
      },
      livereload: {
        options: {
          livereload: grunt.option('livereloadport') || LIVERELOAD_PORT
        },
        files: [
          '<%= yeoman.app %>/*.html',
          '{.tmp,<%= yeoman.app %>}/styles/{,*/}*.css',
          '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
          '<%= yeoman.app %>/scripts/templates/*.{ejs,mustache,hbs}',
          'test/spec/**/*.js'
        ]
      },
      browserify: {
        files: [
          '<%= yeoman.app %>/scripts/**/*.js',
          '<%= yeoman.app %>/scripts/templates/{,**/}*.hbs'
        ],
        tasks: ['browserify']
      }
    },

    connect: {
      options: {
        port: grunt.option('port') || SERVER_PORT,
        // change this to '0.0.0.0' to access the server from outside
        hostname: '0.0.0.0'
      },
      proxies: [],
      livereload: {
        options: {
          middleware: function(connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, yeomanConfig.app),
              proxySnippet
            ];
          }
        }
      }
    },

    open: {
      server: {
        path: 'http://localhost:<%= connect.options.port %>'
      },
      test: {
        path: 'http://localhost:<%= connect.test.options.port %>'
      }
    },

    clean: {
      dist: ['.tmp', '<%= yeoman.dist %>/*'],
      server: '.tmp'
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/{,*/}*.js',
        '!<%= yeoman.app %>/vendor/*'
      ]
    },

    concat: {},

    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },

    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        dirs: ['<%= yeoman.dist %>']
      }
    },

    cssmin: {
      dist: {
        files: {
          'dist/communicator.min.css': ['dist/communicator.css']
        }
      }
    },

    uglify: {
      dist: {
        files: {
          'dist/communicator.min.js': ['dist/communicator.js']
        }
      }
    },

    htmlmin: {
      dist: {
        options: {
          /*removeCommentsFromCDATA: true,
          // https://github.com/yeoman/grunt-usemin/issues/44
          //collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true*/
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: '*.html',
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    browserify: {
      dist: {
        files: {
          '.tmp/scripts/main.js': ['<%= yeoman.app %>/scripts/*.js']
        },
        options: {
          transform: [
            // cacheify - cache the results - ~6x speed improvement for a simple project
            // cacheify(to5ify.configure({
            //   blacklist: ['useStrict'],
            //   code: { // The previous one should work, but I'm not sure if it does...
            //     blacklist: ['useStrict']
            //   },
            //   experimental: true
            // }), level('.cache/6to5')), // run 6to5, experimental for async
            cacheify(aliasify, level('.cache/aliasify')), // Aliases (eg. underscore->lodash). Needs to be before debowerify, but after 6to5
            cacheify(debowerify, level('.cache/debowerify')), // include bower components
          ],
          browserifyOptions: {
            paths: nodePath, // absolute import paths
            debug: true // generates source map
          }
        }
      }
    },

    copy: {
      dist: {
        files: [{
          cwd: '',
          dest: 'dist/communicator.css',
          src: ['styles/communicator.css']
        }]
      }
    },

    bower: {
      all: {
        rjsConfig: '<%= yeoman.app %>/scripts/main.js'
      }
    }
  });

  grunt.registerTask('server', function(target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve' + (target ? ':' + target : '')]);
  });

  grunt.registerTask('serve', [
    'clean:server',
    'browserify',
    'configureProxies',
    'connect:livereload',
    'open:server',
    'watch'
  ]);

  grunt.registerTask('default', ['serve']);
};
