angular.module('information-anywhere', [
	'ui.router',
	'ui.bootstrap'
])

	.directive('informationAnywhere', function () {
		return {
			restrict: 'A',
			templateUrl: 'information-anywhere/information-anywhere.tpl.html',
			scope: {
				data: '=informationAnywhere'
			},
			link: function($scope, $element, $attrs) {

			}
		}
	});
