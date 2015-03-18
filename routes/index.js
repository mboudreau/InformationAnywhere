var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var less = require('less');
var wait = require('wait.for');

var scripts = '';

[
	'node_modules/angular/angular.min.js',
	'public/javascripts/app.js', /*,
 'node_modules/bootstrap/dist/js/bootstrap.min.js'*/
].forEach(function (value) {
		scripts += fs.readFileSync(value);
	});


var styles = '';

[
	'public/styles/global.less'
].forEach(function (value) {
		//var parser = new less.Parser;
		var file = fs.readFileSync(value).toString();
		var lessString = '';
		//wait.for(fs.readFile,'largeFile.html')
		less.render(file,
			{
				paths: ['.', './public/styles'],  // Specify search paths for @import directives
				filename: path.resolve(value)// Specify a filename, for better error messages
			},
			function (err, output) {
				if (err) {
					return console.error(err);
				}
				styles += output.css;
			});
	});

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', {
		helpers: {
			scripts: function () {
				return scripts;
			},
			styles: function () {
				return styles;
			}
		}
	});
});

module.exports = router;
