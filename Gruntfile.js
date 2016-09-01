/**
 * Grunt
 *
 * @see http://gruntjs.com/api/grunt to learn more about how grunt works
 * @since  1.0
 */

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		watch: {
			options: {
				livereload: true,
			},
			css: {
				files: ['css/source/*.css'],
				tasks: ['autoprefixer', 'cssmin'],
				options: {
					livereload: true
				},
			},
			js: {
				files: ['js/source/*.js'],
				tasks: ['uglify'],
				options: {
					livereload: true
				},
			},
			livereload: {
				// reload page when css, js, images or php files changed
				files: ['css/*.css', 'js/*.js', 'img/**/*.{png,jpg,jpeg,gif,webp,svg}', '**/*.php']
			},
		},

		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                compress: false
			},
            build: {
                src: [
                    'js/source/*.js'
                ],
                dest: 'js/<%= pkg.name %>.min.js'
            }
		},

		autoprefixer: {
			options: {
				browsers: ['last 2 versions']
			},
			multiple_files: {
                expand: true,
                flatten: true,
                src: 'css/source/*.css',
                dest: 'css/source/build/'
            }
		},

		cssmin: {
			options: {
				shorthandCompacting: false,
				roundingPrecision: -1
			},
			target: {
				files: {  // Right now we are skipping the build
					'css/<%= pkg.name %>.min.css': [
						'css/source/premise.css',
						'css/source/premise-field.css',
						'css/source/premise-admin.css',
						'css/source/premise-tabs.css',
						'css/source/premise-responsive.css'
					]
				}
			}
		},

		phpdocumentor: {
	        dist: {
	            options: {
	                directory : './',
	                target : 'documentation',
	                template: 'responsive-twig'
	            }
	        }
	    },

	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	// create PHP documentation
	grunt.loadNpmTasks('grunt-phpdocumentor');

	// Default task(s).
	grunt.registerTask( 'default', ['watch'] );

};