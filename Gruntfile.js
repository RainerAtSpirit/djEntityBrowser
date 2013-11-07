/*global module, require */
module.exports = function( grunt ) {
    "use strict";
    var mixIn = require('mout/object/mixIn'),
        requireConfig = {
            baseUrl: 'app/',
            paths: {
                'jquery': '../lib/jquery/jquery-1.9.1',
                'knockout': '../lib/knockout/knockout-2.3.0.debug',
                'text': '../lib/require/text',
                'durandal': '../lib/durandal/js',
                'plugins': '../lib/durandal/js/plugins',
                'transitions': '../lib/durandal/js/transitions',
                'moment': '../lib/moment/moment'
            }
        };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: ['build/*']
        },
        connect: {
            build: {
                options: {
                    port: 9001,
                    base: 'build',
                    open: true,
                    keepalive: true
                }
            },
            test: {
                options: {
                    port: 8889,
                    base: './',
                    keepalive: true
                }
            }
        },
        copy: {
            lib: {
                src: 'lib/**/**',
                dest: 'build/'
            },
            index: {
                src: 'index-build.html',
                dest: 'build/index.html'
            },
            css: {
                src: 'css/**',
                dest: 'build/'
            }
        },
        durandal: {
            main: {
                src: ['app/**/*.*', 'lib/durandal/**/*.js'],
                options: {
                    name: '../lib/require/almond-custom',
                    baseUrl: requireConfig.baseUrl,
                    mainPath: 'app/main',
                    paths: mixIn({}, requireConfig.paths, { "almond": "../lib/require/almond-custom.js" }),
                    exclude: ['knockout', 'jquery', 'moment'],
                    optimize: "none",
                    out: 'build/app/main.js'
                }
            }
        },
        jasmine: {
            modules: {
                options: {
                    specs: 'test/specs/modules/**/*spec.js',
                    keepRunner: true,
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: {
                        requireConfig: requireConfig
                    }
                }
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'app/**/*.js', 'test/specs/**/*.js']
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= pkg.version %> %> \n' +
                    '* Copyright (c) 1998, <%= grunt.template.today("yyyy") %> <%= pkg.company %> \n' +
                    '* Available via the MIT license.\n' +
                    '* see: https://github.com/RainerAtSpirit/djODataAPIExplorer for details.\n' +
                    '*/\n'
            },
            build: {
                src: 'build/app/main.js',
                dest: 'build/app/main-built.js'
            }
        },
        watch: {
            options: {
                livereload: true
            },
            modules: {
                files: ['test/specs/modules/**/*spec.js'],
                tasks: ['jasmine:modules']
            }
        }
    });

    // Loading plugin(s)
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-durandal");

    // Default task(s).
    grunt.registerTask('build', ['jshint', 'jasmine:modules', 'clean', 'copy', 'durandal:main', 'uglify', 'connect:build']);
    grunt.registerTask('default', 'start web server for jasmine tests in browser', function() {
        grunt.task.run('jshint');
        grunt.task.run('jasmine:modules');

        grunt.event.once('connect.test.listening', function( host, port ) {
            var specRunnerUrl = 'http://' + host + ':' + port + '/_SpecRunner.html';
            grunt.log.writeln('Jasmine specs available at: ' + specRunnerUrl);
            require('open')(specRunnerUrl);
        });

        grunt.task.run('connect:test:keepalive');
    });
};
