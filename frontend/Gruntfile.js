module.exports = function (grunt) {

	/**
	 * Load required Grunt tasks. These are installed based on the versions listed
	 * in `package.json` when you do `npm install` in this directory.
	 */
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-ng-annotate');
	grunt.loadNpmTasks('grunt-html2js');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks("grunt-image-embed");
	grunt.loadNpmTasks('grunt-embed');

	/**
	 * Rename watch task to two separate tasks for build and release
	 */
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.renameTask('watch', 'delta');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.renameTask('watch', 'deltarelease');

	/**
	 * Middleware for grunt-contrib-connect
	 */
	var modRewrite = require('connect-modrewrite');


	/**
	 * Load in our build configuration file.
	 */
	var userConfig = require('./build.config.js');
	var bower = grunt.file.readJSON("bower.json");

	var taskConfig = {
		pkg: {
			author: bower.author,
			name: bower.name,
			version: grunt.option('release-number') || '0.0.0'
		},

		clean: [
			'<%= build_dir %>',
			'<%= release_dir %>',
			'<%= package_dir %>'
		],

		copy: {
			build_app_assets: {
				files: '<%= app_files.assets %>'
			},
			build_vendor_assets: {
				files: '<%= vendor_files.assets %>'
			},
			build_app_js: {
				files: [
					{
						src: ['<%= app_files.js %>'],
						dest: '<%= build_dir %>/<%= pkg.name %>/',
						cwd: '.',
						expand: true
					}
				]
			},
			build_vendor_js: {
				files: [
					{
						src: ['<%= vendor_files.js %>'],
						dest: '<%= build_dir %>/<%= pkg.name %>/',
						cwd: '.',
						expand: true
					}
				]
			},
			release_assets: {
				files: [
					{
						src: ['**/*'],
						dest: '<%= release_dir %>/<%= pkg.name %>/assets',
						cwd: '<%= build_dir %>/<%= pkg.name %>/assets',
						expand: true
					}
				]
			}
		},

		concat: {
			release: {
				src: [
					'<%= vendor_files.js %>',
					'module.prefix',
					'<%= build_dir %>/<%= pkg.name %>/src/**/*.js',
					'<%= build_dir %>/<%= pkg.name %>/templates-*.js',
					'module.suffix'
				],
				dest: '<%= release_dir %>/<%= pkg.name %>/assets/<%= pkg.name %>-<%= pkg.version %>.js'
			}
		},

		ngAnnotate: {
			options: {
				singleQuotes: true
			},
			build: {
				files: [
					{
						src: ['<%= app_files.js %>'],
						cwd: '<%= build_dir %>/<%= pkg.name %>',
						dest: '<%= build_dir %>/<%= pkg.name %>',
						expand: true
					},
					{
						src: ['<%= vendor_files.js %>'],
						cwd: '<%= build_dir %>/<%= pkg.name %>',
						dest: '<%= build_dir %>/<%= pkg.name %>',
						expand: true
					}
				]
			}
		},

		uglify: {
			release: {
				options: {
					mangle: false,
					sourceMap: true
				},
				files: [
					{
						src: ['<%= concat.release.dest %>'],
						expand: true,
						ext: '.min.js',
						extDot: 'last'
					}
				]
			}
		},

		htmlmin: {
			release: {
				options: {
					removeComments: true,
					collapseWhitespace: true,
					minifyJS: true,
					caseSensitive: true
				},
				files: [
					{
						src: ['**/*.html'],
						cwd: '<%= release_dir %>/<%= pkg.name %>/',
						dest: '<%= release_dir %>/<%= pkg.name %>',
						expand: true
					}
				]
			}
		},

		less: {
			build: {
				files: [
					{
						src: [
							'<%= app_files.less %>',
							'<%= vendor_files.css %>'
						],
						dest: '<%= build_dir %>/<%= pkg.name %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
					}
				]
			},
			release: {
				options: {
					compress: true,
					cleancss: true,
					cleancssOptions: {
						keepSpecialComments: 0
					}
				},
				files: [
					{
						src: [
							'<%= app_files.less %>',
							'<%= vendor_files.css %>'
						],
						dest: '<%= release_dir %>/<%= pkg.name %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
					}
				]
			}
		},

		jshint: {
			options: {
				curly: true,
				immed: true,
				newcap: true,
				noarg: true,
				sub: true,
				boss: true,
				asi: true,
				eqnull: true,
				shadow: true,
				evil: true,
				globals: {
					angular: true,
					_: true,
					app: true
				}
			},

			src: [
				'<%= app_files.js %>'
			],
			test: [
				'<%= app_files.jsunit %>'
			],
			gruntfile: [
				'Gruntfile.js'
			]

		},

		/**
		 * HTML2JS is a Grunt plugin that takes all of your template files and
		 * places them into JavaScript files as strings that are added to
		 * AngularJS's template cache. This means that the templates too become
		 * part of the initial payload as one JavaScript file. Neat!
		 */
		html2js: {
			/**
			 * These are the templates from `src/app`.
			 */
			app: {
				options: {
					base: 'src/app'
				},
				src: ['<%= app_files.atpl %>'],
				dest: '<%= build_dir %>/<%= pkg.name %>/templates-app.js'
			},

			/**
			 * These are the templates from `src/directives`.
			 */
			directives: {
				options: {
					base: 'src/directives'
				},
				src: ['<%= app_files.dtpl %>'],
				dest: '<%= build_dir %>/<%= pkg.name %>/templates-directives.js'
			}
		},

		index: {
			options: {
				templateSrc: '<%= app_files.html %>',
				templateDest: '<%= build_dir %>/<%= pkg.name %>'
			},
			build: {
				files: [
					{
						src: [
							'<%= vendor_files.js %>'
						],
						cwd: '<%= build_dir %>/<%= pkg.name %>/',
						expand: true
					},
					{
						src: [
							'**/*.js',
							'**/*.css',
							'!vendor/**/*'
						],
						cwd: '<%= build_dir %>/<%= pkg.name %>/',
						expand: true
					}
				]
			},

			release: {
				options: {
					templateDest: '<%= release_dir %>/<%= pkg.name %>',
					async: true
				},
				files: [
					{
						src: [
							'**/*.min.js',
							'**/*.css'
						],
						cwd: '<%= release_dir %>/<%= pkg.name %>/',
						expand: true
					}
				]
			}
		},

		compress: {
			release: {
				options: {
					mode: 'gzip'
				},
				files: [
					// Each of the files in the src/ folder will be output to
					// the dist/ folder each with the extension .gz.js
					{
						expand: true,
						src: ['<%= release_dir %>/<%= pkg.name %>/**/*.min.js'],
						ext: '.js.gz',
						extDot: 'last'
					},
					{
						expand: true,
						src: ['<%= release_dir %>/<%= pkg.name %>/**/*.css'],
						ext: '.css.gz',
						extDot: 'last'
					},
					{
						expand: true,
						src: ['<%= release_dir %>/<%= pkg.name %>/**/*.html'],
						ext: '.html.gz',
						extDot: 'last'
					}
				]
			}
		},

		imageEmbed: {
			all: {
				src: '<%= release_dir %>/<%= pkg.name %>/assets/<%= pkg.name %>-<%= pkg.version %>.css',
				dest: '<%= release_dir %>/<%= pkg.name %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
			}
		},

		embed: {
			release: {
				files: {
					'<%= release_dir %>/<%= pkg.name %>/index.html': '<%= release_dir %>/<%= pkg.name %>/index.html'
				}
			}
		},

		delta: {
			options: {
				livereload: true
			},

			gruntfile: {
				files: 'Gruntfile.js',
				tasks: ['jshint:gruntfile'],
				options: {
					livereload: false
				}
			},

			jssrc: {
				files: [
					'<%= app_files.js %>'
				],
				tasks: ['jshint:src', 'copy:build_app_js', 'ngAnnotate']
			},

			jsvendor: {
				files: [
					'<%= vendor_files.js %>'
				],
				tasks: ['copy:build_vendor_js', 'ngAnnotate']
			},

			assets: {
				files: [
					'src/assets/**/*'
				],
				tasks: ['copy:build_app_assets', 'copy:build_vendor_assets']
			},

			html: {
				files: ['<%= app_files.html %>'],
				tasks: ['index:build']
			},

			tpls: {
				files: [
					'src/app/**/*.tpl.html',
					'src/directives/**/*.tpl.html'
				],
				tasks: ['html2js']
			},

			less: {
				files: ['src/**/*.less', 'vendor/**/*.less'],
				tasks: ['less:build']
			},

			jsunit: {
				files: [
					'<%= app_files.jsunit %>'
				],
				tasks: ['jshint:test'],
				options: {
					livereload: false
				}
			}
		},

		deltarelease: {
			gruntfile: {
				files: 'Gruntfile.js',
				tasks: ['jshint:gruntfile'],
				options: {
					livereload: false
				}
			},

			jssrc: {
				files: [
					'<%= app_files.js %>'
				],
				tasks: ['jshint:src', 'copy:build_app_js', 'ngAnnotate', 'concat', 'uglify', 'embed:release']
			},

			jsvendor: {
				files: [
					'<%= vendor_files.js %>'
				],
				tasks: ['copy:build_vendor_js', 'ngAnnotate', 'concat', 'uglify', 'embed:release']
			},

			assets: {
				files: [
					'src/assets/**/*'
				],
				tasks: ['copy:build_app_assets', 'copy:build_vendor_assets', 'copy:release_assets', 'embed:release']
			},

			html: {
				files: ['<%= app_files.html %>'],
				tasks: ['index:release']
			},

			tpls: {
				files: [
					'<%= app_files.atpl %>',
					'<%= app_files.dtpl %>'
				],
				tasks: ['html2js', 'concat', 'uglify', 'embed:release']
			},

			less: {
				files: ['src/**/*.less', 'vendor/**/*.less'],
				tasks: ['less:release', 'imageEmbed', 'compress', 'embed:release']
			},

			jsunit: {
				files: [
					'<%= app_files.jsunit %>'
				],
				tasks: ['jshint:test'],
				options: {
					livereload: false
				}
			}
		},

		connect: {
			options: {
				port: 8080,
				protocol: 'http',
				middleware: function (connect, options) {
					var middlewares = [];
					var name = taskConfig.pkg.name;
					middlewares.push(modRewrite(['^(/|/' + name + ')$ /' + name + '/ [R=301]'])); // Redirect root to journal
					middlewares.push(modRewrite(['!\\.?(js|css|html|eot|svg|ttf|woff|otf|css|png|jpg|gif|ico) /' + name + '/ [L]'])); // Anything after journal
					middlewares.push(function (req, res, next) {
						var url = req.url.split('?')[0];
						if (/\.(gz|gzip)$/.test(url)) {
							var type = 'text/html';
							if (/\.js\.(gz|gzip)$/.test(url)) {
								type = 'application/javascript';
							} else if (/\.css\.(gz|gzip)$/.test(url)) {
								type = 'text/css';
							}

							res.setHeader('Content-Type', type);
							res.setHeader('Content-Encoding', 'gzip');

//							'application/x-gzip'
//							'multipart/x-gzip'
						}

						// don't just call next() return it
						return next();
					});
					options.base.forEach(function (base) {
						middlewares.push(connect.static(base));
					});
					return middlewares;
				}
			},
			build: {
				options: {
					base: '<%= build_dir %>'
				}
			},
			release: {
				options: {
					base: '<%= release_dir %>'
				}
			}
		},

		// TODO: Check for version number of files
		file_check: {
			vendors: {
				src: [
					'<%= vendor_files.js %>',
					'<%= vendor_files.css %>'
				],
				nonull: true // DO NOT REMOVE, this is needed to find all incorrect paths
			}
		},

		cloudfront: {
			index: {
				items: [
					'/<%= pkg.name %>',
					'/<%= pkg.name %>/',
					'/<%= pkg.name %>/index.html',
					'/<%= pkg.name %>/index.html.gz',
					'/<%= pkg.name %>/assets/<%= pkg.name %>-<%= pkg.version %>.css',
					'/<%= pkg.name %>/assets/<%= pkg.name %>-<%= pkg.version %>.css.gz',
					'/<%= pkg.name %>/assets/<%= pkg.name %>-<%= pkg.version %>.js',
					'/<%= pkg.name %>/assets/<%= pkg.name %>-<%= pkg.version %>.min.js',
					'/<%= pkg.name %>/assets/<%= pkg.name %>-<%= pkg.version %>.min.js.gz',
					'/<%= pkg.name %>/assets/<%= pkg.name %>-<%= pkg.version %>.min.js.map',
				]
			}
		},

		artifactory: {
			options: {
				url: grunt.option('url'),
				repository: grunt.option('repository'),
				username: grunt.option('username'),
				password: grunt.option('password'),
				base_path: ''
			},
			release: {
				files: [
					{
						src: ['**/*'],
						cwd: '<%= release_dir %>/',
						expand: true,
						dot: true // Needed to include .hidden files, like cloudfront invalidation
					}
				],
				options: {
					publish: [
						{
							group_id: 'com.pageup',
							name: '<%= pkg.name %>',
							ext: 'zip',
							version: '<%= pkg.version %>',
							classifier: grunt.option('classifier') || '',
							path: '<%= package_dir %>/'
						}
					],
					parameters: [
						'version=<%= pkg.version %>',
						'vcs.revision=' + grunt.option('revision')
					]
				}
			}
		}
	};

	// Dynamically adding html2js targets
	for (var key in userConfig.vendor_files.tpl) {
		var value = userConfig.vendor_files.tpl[key];
		value.dest = userConfig.build_dir + '/<%= pkg.name %>/templates-' + key + '.js'
		taskConfig.html2js[key] = value;
		if (Array.isArray(value.src)) {
			taskConfig.delta.tpls.files = taskConfig.delta.tpls.files.concat(value.src);
			taskConfig.deltarelease.tpls.files = taskConfig.deltarelease.tpls.files.concat(value.src);
		} else {
			taskConfig.delta.tpls.files.push(value.src);
			taskConfig.deltarelease.tpls.files.push(value.src);
		}
	}

	grunt.initConfig(grunt.util._.extend(taskConfig, userConfig));

	grunt.registerTask('watch', ['build', 'connect:build', 'delta']);
	grunt.registerTask('watch:release', ['release', 'connect:release', 'deltarelease']);

	/**
	 * The default task is to build and release.
	 */
	grunt.registerTask('default', ['build']);


	/**
	 * The build task gets your app ready to run for development and testing.
	 */
	grunt.registerTask('build', [
		'file_check:vendors', 'clean', 'html2js', 'jshint', 'less:build',
		'copy:build_app_assets', 'copy:build_vendor_assets',
		'copy:build_app_js', 'copy:build_vendor_js', 'ngAnnotate', 'index:build'
	]);

	/*
	 * The release task gets your app ready for deployment
	 */
	grunt.registerTask('release', [
		'build', 'copy:release_assets', 'less:release', 'imageEmbed', 'concat', 'uglify', 'compress', 'index:release', 'htmlmin:release', 'embed:release'
	]);

	grunt.registerTask('package', [
		'cloudfront', 'artifactory:release:package'
	]);

	grunt.registerTask('publish', [
		'cloudfront', 'artifactory:release:publish'
	]);

	function filterForJS(files) {
		return files.filter(function (file) {
			return file.match(/\.js(\.gz)?$/);
		});
	}

	function filterForCSS(files) {
		return files.filter(function (file) {
			return file.match(/\.css(\.gz)?$/);
		});
	}

	grunt.registerMultiTask('index', 'Process index.html template', function () {
		var options = this.options({
			templateSrc: ['src/index.html'],
			async: false
		});

		if (options.templateDest.slice(-1) !== '/') {
			options.templateDest += '/';
		}

		if (!Array.isArray(options.templateSrc)) {
			options.templateSrc = [options.templateSrc];
		}

		var files = this.files.map(function (file) {
			return file.dest;
		});
		var jsFiles = filterForJS(files);
		var cssFiles = filterForCSS(files);

		if (cssFiles.length !== 0) {
			grunt.log.writeln('Including CSS:');
			cssFiles.forEach(function (f) {
				grunt.log.writeln(String(f).cyan);
			});
		}

		if (jsFiles.length !== 0) {
			grunt.log.writeln('Including JS:');
			jsFiles.forEach(function (f) {
				grunt.log.writeln(String(f).cyan);
			});
		}

		options.templateSrc.forEach(function (tpl) {
			grunt.file.copy(tpl, options.templateDest + tpl.split('/').pop(), {
				process: function (contents, path) {
					return grunt.template.process(contents, {
						data: {
							async: options.async,
							scripts: jsFiles,
							styles: cssFiles,
							version: grunt.config('pkg.version'),
							name: grunt.config('pkg.name'),
							timestamp: new Date().getTime()
						}
					});
				}
			});
		});
	});

	grunt.registerMultiTask('cloudfront', 'Generate cloudfront file for invalidation on deploy', function () {
		// Adding Quantity to cloudfront properties
		var items = this.data.items;

		grunt.file.copy('.cloudfront-invalidation', grunt.config('release_dir') + '/.cloudfront-invalidation-' + grunt.config('pkg.name'), {
			process: function (contents, path) {
				return grunt.template.process(contents, {
					data: {
						items: items
					}
				});
			}
		});
	});

	/**
	 * A quick file check to make sure all dependent files exists, if not throw error.
	 * This is mostly used to mention to the user that a new dependency might of been added, but not installed
	 * through `bower install`.
	 */
	grunt.registerMultiTask('file_check', 'Custom file check to catch dependency problems', function () {
// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({});

		grunt.verbose.writeflags(options, 'Options');

		var missingFiles = [];

		// Iterate over all specified file groups.
		this.files.forEach(function (f) {
			missingFiles = f.src.filter(function (filepath) {
				return !grunt.file.exists(filepath) && !/[!*?{}]/.test(filepath);
			});
		});

		if (missingFiles.length !== 0) {
			var message = 'The following files are missing: ' + missingFiles.join(',') + '\nDid you forget to do `bower install`?';
			grunt.fail.warn(message, 3);
			return false;
		}

		grunt.log.writeln('All files accounted for.');
		return true;
	});

	/**
	 * Utility Tasks to force other tasks to continue even if they fail, need to 'wrap' both around the tasks that you
	 * want forced or else it will force all of them.
	 */

	grunt.registerTask('useTheForce', 'turns the --force option ON',
		function () {
			if (!grunt.option('force')) {
				grunt.config.set('forceStatus', true);
				grunt.option('force', true);
			}
		});

	grunt.registerTask('disturbTheForce', 'turns the --force option Off',
		function () {
			if (grunt.config.get('forceStatus')) {
				grunt.option('force', false);
			}
		});
};
