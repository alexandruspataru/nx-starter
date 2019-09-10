// Need another plugin? https://www.npmjs.com/ here's an example installation of JSHint
// npm install -g grunt-cli && npm install -g npm && npm install -g node-sass && npm install

module.exports = function(grunt) {
	
    require('jit-grunt')(grunt);
	const sass = require('node-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify-es');

    // Configure tasks`
    grunt.initConfig({
        // read package.json for dependencies
        pkg: grunt.file.readJSON('package.json'),

        // compile Sass/SCSS to CSS
		sass: {
			options: {
				implementation: sass,
				outputStyle: 'expanded',								 // don't compress
				sourceMap: true,										 // generate sourceMap
			},
			dist: {
				files: { 'css/vendor.css' : 'src/scss/style.scss' }
			},
			files: { 													 // 'css/production-file' : 'src/scss/source-file'
				'css/vendor.css' : 'src/scss/style.scss'
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
                        'src/js/*.js'   // JS libraries and jQuery plugins
                    ],
                    dest: 'js/vendor.js'    // dev concatenated scripts
                }]
            },
            build: {
                files: [{
                    src: [
                        'src/js/*.js'
                    ],
                    dest: 'js/vendor.min.js'    // production concatenated scripts
                }]
            },
        },

        // minify CSS
        cssmin: {
            full: {
                files: [{
                    src: 'css/vendor.css',    // CSS
                    dest: 'css/vendor.min.css'    // minified CSS
                }]
            },
        },

        // Grunt watch
        watch: {
            js: {
                files: [	// files to watch for changes
                    'src/js/*.js'
                ],
                tasks: [	// task to run when a change is detected
                    'uglify:dev',
					'uglify:build'
                ],
            },
            css: {
                files: ['src/scss/**/*.scss'],
                tasks: ['sass', 'cssmin:full',],
            },
        },

    });

    // Register tasks
    // prepending newer: runs tasks only on new or modified files
    grunt.registerTask('default', [
        'sass',
    ]);
    grunt.registerTask('build', [
        'sass',
        'uglify:dev',
        'uglify:build',
        'cssmin:full',
    ]);
}    // end exports