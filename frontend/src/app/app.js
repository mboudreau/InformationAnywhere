angular.module('informationAnywhere', [
	'ui.router',
	'templates-app',
	'templates-directives',
	'information-anywhere'
])

	.config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
		$locationProvider.html5Mode(true);
		$urlRouterProvider.otherwise('/');

		var API_Version = "v0.1";

		$stateProvider
			.state('home', {
				url: '/',
				template: '<div information-anywhere></div>'
			})
			.state('error', {
			url: '/error',
			templateUrl: 'error.tpl.html'
		});

	});
