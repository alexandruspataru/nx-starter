// Need another plugin? https://www.npmjs.com/ here's an example installation of JSHint
// npm install -g grunt-cli
// npm install
// npm install -g bower
// bower install

module.exports = function(grunt) {
    require('jit-grunt')(grunt);

    // Configure tasks`
    grunt.initConfig({
        // read package.json for dependencies
        pkg: grunt.file.readJSON('package.json'),

        // concat Bower libraries
        bower_concat: {
            all: {
                dest: 'assets/src/js/_bower.js',    // destination for bower JS
                cssDest: 'assets/src/scss/_bower.scss',    // destination for bower CSS

                // if Bower cannot identify the main file for a package, you need to specify it here
                mainFiles: [],

                exclude: [],    // exclude components
                // EX: exclude: [ 'owlcarousel' ],

                include: [],    // include components not automatically included
                // EX: include: [ 'backbone' ],

                dependencies: {},    // if dependencies aren't managed, you can manually configure them here
                // EX: dependencies: { 'underscore': 'jquery' }

                bowerOptions: {
                    relative: false
                },
            },
        },

        // compile Sass/SCSS to CSS
        sass: {
            dev: {
                options: {
                    outputStyle: 'expanded',    // don't compress
                    sourceMap: true,    // generate sourceMap
                    outFile: 'assets/css/vendor.css.map'    // sourceMap file
                },
                files: { 'assets/css/vendor.css' : 'assets/src/scss/style.scss' },    // 'css/production-file' : 'assets/src/scss/source-file'
            },
        },

        // concat and minify JS
        uglify: {
            dev: {
                options: {
                    beautify: true,    // make the code pretty
                    mangle: false,    // don't change variables
                    compress: false,    // don't minify the JS
                    preserveComments: 'all'    // keep all comments
                },
                files: [{
                    src: [
                        'assets/src/js/*.js',    // JS libraries and jQuery plugins
                        'assets/src/js/config/*.js'    // your JS
                    ],
                    dest: 'assets/js/vendor.js'    // dev concatenated scripts
                }]
            },
            build: {
                files: [{
                    src: [
                        'assets/src/js/*.js',
                        'assets/src/js/config/*.js'
                    ],
                    dest: 'assets/js/vendor.min.js'    // production concatenated scripts
                }]
            },
        },

        // minify CSS
        cssmin: {
            full: {
                files: [{
                    src: 'assets/css/vendor.css',    // CSS
                    dest: 'assets/css/vendor.min.css'    // minified CSS
                }]
            },
        },

        // Grunt watch
        watch: {
            js: {
                files: [	// files to watch for changes
                    'assets/src/js/*.js',
                    'assets/src/js/config/*.js',
                ],
                tasks: [	// task to run when a change is detected
                    'uglify:dev',
                ],
            },
            css: {
                files: ['assets/src/scss/**/*.scss'],
                tasks: ['sass:dev'],
            },
        },

    });

    // Register tasks
    // prepending newer: runs tasks only on new or modified files
    grunt.registerTask('default', [
        'sass:dev',
    ]);
    grunt.registerTask('build', [
        'bower_concat:all',
        'sass:dev',
        'uglify:dev',
        'uglify:build',
        'cssmin:full',
    ]);
}    // end exports
