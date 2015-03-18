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
				$scope.help = function() {
					alert('Insert Yabber Here');
				};
				var dimensions = $scope.data.smx.WirelessClientLocation.MapInfo.Dimension;
				var coordinates = $scope.data.smx.WirelessClientLocation.MapCoordinate;
				$scope.locationX = coordinates.x/dimensions.length;
				$scope.locationY = coordinates.y/dimensions.width*100;
			}
		}
	});
