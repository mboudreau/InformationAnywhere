angular.module('information-anywhere', [
	'ui.router',
	'ui.bootstrap'
])

	.config(function($compileProvider){
		$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|xmpp):/);
	})

	.directive('informationAnywhere', function () {
		return {
			restrict: 'A',
			templateUrl: 'information-anywhere/information-anywhere.tpl.html',
			scope: {
				data: '=informationAnywhere'
			},
			link: function($scope, $element, $attrs) {
				$scope.helpUrl = 'xmpp:user1@abc.inc';
				if($scope.data.cmx.WirelessClientLocation) {
					var dimensions = $scope.data.cmx.WirelessClientLocation.MapInfo.Dimension;
					var coordinates = $scope.data.cmx.WirelessClientLocation.MapCoordinate;
					$scope.locationX = (1 - coordinates.x / dimensions.length) * 100;
					$scope.locationY = (1 - coordinates.y / dimensions.width) * 100;
				}
			}
		}
	});
