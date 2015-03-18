angular.module('informationAnywhere', [
	// Global Dependencies
	'ui.router',
	'angularytics',
	/*'ngMaterial',*/
	/*'ngAnimate',*/
	/*'ngTouch',*/
	'mgcrea.ngStrap',
	'pageup.search-typeahead',
	'ng-focus-trigger',
	/*'ng-enter',*/
	// Templates
	'templates-app',
	'templates-directives',
	'templates-core',
	// Pages
	'pageup.journal',
	'pageup.loader',
	'LocalStorageModule',
	//Providers
	'pageup.JournalService',
	'pageup.oauth'
])

	.config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, localStorageServiceProvider, journalServiceProvider, AngularyticsProvider, oauthProvider) {
		if (!/MSIE/i.test(window.navigator.userAgent)) {
			$locationProvider.html5Mode(true);
		}
		localStorageServiceProvider.setPrefix('pageup.journal');
		AngularyticsProvider.setEventHandlers(['Console', 'Google']);

		oauthProvider.clientId('journal');

		var API_Version = "v0.1";

		$stateProvider.state('validate', {
			data: {
				rule: function ($location, $rootScope, localStorageService) {
					var query = $location.search();
					if (query && query.return && query.api && query.auth) {
						localStorageService.set('return', query.return);
						localStorageService.set('auth', addTrailingSlash(query.auth));
						localStorageService.set('api', addTrailingSlash(query.api));
					}
					if (localStorageService.get('api') && localStorageService.get('return') && localStorageService.get('auth')) {
						oauthProvider.endpoint(localStorageService.get('auth')).redirectUri($location.absUrl().split('?')[0]);
						journalServiceProvider.endpoint(localStorageService.get('api'));
						return true;
					}
					return false;
				}
			}
		}).state('error', {
			url: '/error',
			templateUrl: 'error.tpl.html'
		});

		function addTrailingSlash(str) {
			return str.slice(-1) !== '/' ? str + '/' : str;
		}

		$httpProvider.interceptors.push(function () {
			return {
				'request': function (config) {
					config.headers['Accept'] = "application/pageup." + API_Version + "+json";
					return config;
				}
			};
		});
	})

	.run(function ($rootScope, $state, $location, localStorageService, Angularytics, $window) {
		Angularytics.init();

		$rootScope.online = navigator.onLine;
		$window.addEventListener("offline", function () {
			$rootScope.$apply(function () {
				$rootScope.online = false;
			});
		}, false);
		$window.addEventListener("online", function () {
			$rootScope.$apply(function () {
				$rootScope.online = true;
			});
		}, false);

		$rootScope.$on('$stateChangeStart', function (e, to) {
			if (!to.data || !angular.isFunction(to.data.rule)) {
				return;
			}
			e.preventDefault();
			if (!to.data.rule($location, $rootScope, localStorageService)) {
				$state.go('error');
			}
		});
		$state.go('validate');
	});

