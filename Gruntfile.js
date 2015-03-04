'use strict';
var LIVERELOAD_PORT = 35729;
var SERVER_PORT = 9000;
var lrSnippet = require('connect-livereload')({
  port: LIVERELOAD_PORT
});

var mountFolder = function(connect, dir) {
  return connect.static(require('path').resolve(dir));
};

var concatJsFiles = [
  'src/communicator.js',

  'src/components/helpers.js',
  'src/components/id-manager.js',

  'src/base/config.js',
  'src/base/position.js',
  'src/base/size.js',
  'src/base/style.js',

  'src/triggers/abstract.js',
  'src/triggers/action-end.js',
  'src/triggers/action-start.js',
  'src/triggers/active.js',
  'src/triggers/drop.js',
  'src/triggers/equal.js',
  'src/triggers/event.js',
  'src/triggers/finish.js',
  'src/triggers/swipe.js',

  'src/actions/abstract.js',
  'src/actions/finish.js',
  'src/actions/invoke.js',
  'src/actions/position.js',
  'src/actions/resize.js',
  'src/actions/style.js',

  'src/modules/abstract.js',
  'src/modules/area.js',
  'src/modules/text.js',
  'src/modules/input.js',
  'src/modules/image.js',
  'src/modules/audio.js',
  'src/modules/video.js',
  'src/modules/container.js',
  'src/modules/carousel.js',
  'src/modules/pack.js',

  'src/collections/trigger.js',
  'src/collections/action.js',
  'src/collections/module.js',

  'src/views/abstract.js',
  'src/views/area.js',
  'src/views/text.js',
  'src/views/input.js',
  'src/views/image.js',
  'src/views/audio.js',
  'src/views/video.js',
  'src/views/container.js',
  'src/views/carousel.js',
  'src/views/pack.js',

  'src/factories/trigger.js',
  'src/factories/action.js',
  'src/factories/module.js',
  'src/factories/view.js'
];

module.exports = function(grunt) {
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // configurable paths
  var yeomanConfig = {
    app: '',
    dist: 'dist'
  };

  grunt.initConfig({
    yeoman: yeomanConfig,
    watch: {
      options: {
        nospawn: true,
        livereload: false
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          '<%= yeoman.app %>/*.html',
          '{.tmp,<%= yeoman.app %>}/styles/{,*/}*.css',
          '{.tmp,<%= yeoman.app %>}/{,*/}*.js',
          '<%= yeoman.app %>/templates/*.{ejs,mustache,hbs}'
        ]
      },
      test: {
        files: [
          '{.tmp,<%= yeoman.app %>}/{,*/}*.js'
        ]
      },
      js: {
        files: ['<%= yeoman.app %>/{,*/}*.js'],
        tasks: ['jshint']
      }
    },
    connect: {
      options: {
        port: SERVER_PORT,
        // change this to '0.0.0.0' to access the server from outside
        hostname: '0.0.0.0'
      },
      livereload: {
        options: {
          middleware: function(connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, yeomanConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function(connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'test'),
              mountFolder(connect, yeomanConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          middleware: function(connect) {
            return [
              mountFolder(connect, yeomanConfig.dist)
            ];
          }
        }
      }
    },
    open: {
      server: {
        path: 'http://localhost:<%= connect.options.port %>'
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
    concat: {
      dist: {
        src: concatJsFiles,
        dest: 'dist/communicator.js'
      }
    },
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
    if (target === 'dist') {
      return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'connect:livereload',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'concat',
    'copy',
    'cssmin',
    'uglify',
    'usemin'
  ]);

  grunt.registerTask('lint', ['jshint']);

  grunt.registerTask('default', [
    'jshint',
    'compass',
    'connect:livereload',
    'watch'
  ]);
};
