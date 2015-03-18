/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {
	/**
	 * The `build_dir` folder is where our projects are compiled during
	 * development and the `compile_dir` folder is where our app resides once it's
	 * completely built.
	 */
	build_dir: 'build',
	release_dir: 'release',
	package_dir: 'dist',


	/**
	 * This is a collection of file patterns that refer to our app code (the
	 * stuff in `src/`). These file paths are used in the configuration of
	 * build tasks. `js` is all project javascript, less tests. `ctpl` contains
	 * our reusable components' (`src/common`) template HTML files, while
	 * `atpl` contains the same, but for our app's code. `html` is just our
	 * main HTML file, `less` is our main stylesheet, and `unit` contains our
	 * app's unit tests.
	 */
	app_files: {
		js: [ 'src/**/*.js', '!src/**/*.spec.js', '!src/assets/**/*.js' ],
		jsunit: [ 'src/**/*.spec.js' ],

		atpl: [ 'src/app/**/*.tpl.html' ],
		dtpl: [ 'src/directives/**/*.tpl.html', '!src/directives/**/link-journal*.tpl.html' ],

		html: [ 'src/index.html' ],
		less: ['src/less/global.less'],

		assets: [
			{
				src: [ '**' ],
				dest: '<%= build_dir %>/<%= pkg.name %>/assets/',
				cwd: 'src/assets',
				expand: true
			}
		]
	},

	/**
	 * This is a collection of files used during testing only.
	 */
	test_files: {
		js: [
			'vendor/angular-mocks/angular-mocks.js'
		]
	},

	/**
	 * This is the same as `app_files`, except it contains patterns that
	 * reference vendor code (`vendor/`) that we need to place into the build
	 * process somewhere. While the `app_files` property ensures all
	 * standardized files are collected for compilation, it is the user's job
	 * to ensure non-standardized (i.e. vendor-related) files are handled
	 * appropriately in `vendor_files.js`.
	 *
	 * The `vendor_files.js` property holds files to be automatically
	 * concatenated and minified with our project source files.
	 *
	 * The `vendor_files.css` property holds any CSS files to be automatically
	 * included in our app.
	 *
	 * The `vendor_files.assets` property holds any assets to be copied along
	 * with our app's assets. This structure is flattened, so it is not
	 * recommended that you use wildcards.
	 */
	vendor_files: {
		js: [
			'vendor/angular/angular.js',
			'vendor/angular-ui-router/release/angular-ui-router.js',
			'vendor/angular-strap/dist/angular-strap.js',
			'vendor/angular-strap/dist/angular-strap.tpl.js',
			'vendor/angular-bootstrap/src/bindHtml/bindHtml.js',
			'vendor/angular-bootstrap/src/position/position.js',
			'vendor/angular-bootstrap/src/typeahead/typeahead.js',
			'vendor/angular-bootstrap/src/transition/transition.js',
			'vendor/angular-bootstrap/src/modal/modal.js',
			'vendor/angular-service-factory/angular-service-factory.js'
		],
		css: [
			'vendor/angular-motion/dist/angular-motion.min.css',
			'vendor/bootstrap-additions/dist/bootstrap-additions.min.css'
		],
		assets: [
		],
		tpl: {
		}
	}
};
