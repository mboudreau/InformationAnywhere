var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', {
		helpers: {
			scripts: function () {
				var string = '';
				[
					'node_modules/angular/angular.min.js',
					'public/javascripts/app.js',/*,
					'node_modules/bootstrap/dist/js/bootstrap.min.js'*/
				].forEach(function(value){
					string += fs.readFileSync(value, {encoding: 'utf8'});
					});

				return string;
			},
			styles: function () {
				var string = '';
				[
					'node_modules/bootstrap/dist/css/bootstrap.min.css',
					'node_modules/bootstrap/dist/css/bootstrap-theme.min.css'
				].forEach(function(value){
						string += fs.readFileSync(value, {encoding: 'utf8'});
					});

				return string;
			}
		}
	});
});

module.exports = router;
