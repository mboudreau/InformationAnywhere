angular.module('information-anywhere', [
	'ui.router'
])

	.directive('informationAnywhere', function () {
		return {
			restrict: 'A',
			templateUrl: 'information-anywhere/information-anywhere.tpl.html',
			scope: {
				data: '='
			},
			link: function($scope, $element, $attrs) {

			}
		}
	});
