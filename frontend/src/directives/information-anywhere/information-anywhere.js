angular.module('pageup.journal', [
	'ui.router',
	'ui.InfiniteScroll',
	'pageup.journal-entry',
	'pageup.journal-entry-edit',
	'ngTagsInput',
	'ng-focus-trigger',
	'selector',
//	'ngAnimate',
	'mosaic',
	'angularytics',
	'LocalStorageModule',
	'pageup.JournalService',
	'ui.bootstrap.modal'
])

	.directive('journal', function () {
		return {
			restrict: 'AE',
			controller: 'JournalCtrl',
			templateUrl: 'journal/journal.tpl.html'
		}
	})

	.controller('JournalCtrl', function ($scope, journalService, $rootScope, $location, localStorageService, Angularytics, ServiceConstant, $modal) {
		$rootScope.entries = [];
		$rootScope.searching = false;
		$rootScope.more = false;
		//$rootScope.errorMsg = '';
		$scope.loaded = false;
		$scope.loadingEntries = true;
		$scope.feedbackline = localStorageService.get('api') + 'betaFeedback/default.aspx?context=Journal';
		$scope.dropboxEmail = window.dropboxEmail;
		$scope.showEmailHelp = false;

		//check for offline changes
		var offlineList = localStorageService.get('offlineList');
		journalService.get().then(function (result) {
				if (offlineList && offlineList.length !== 0) {
					result.entries = offlineList.concat(result.entries);
				}

				// Add default entry if nothing is there
				if (result.entries.length === 0) {
					var entry = journalService.createEntry();
					entry.title = 'Hi! Welcome to Journal.';
					entry.content = 'Journal lets you quickly capture your achievements.\n\nClick on this entry to start.';
					entry.tags = [];
					result.entries.push(entry);
				}

				$rootScope.entries = result.entries;
				$rootScope.more = result.more;
				$scope.loadingEntries = false;
			},
			function () {
				$rootScope.entries = offlineList;
			}
		);

		// Checks to see if this is the first time to new journal
		// TODO: check version number, add changelog-ish
		$scope.isFirstTime = function () {
			if ($rootScope.oauth && !localStorageService.get('firstTimeUser')) {
				localStorageService.set('firstTimeUser', true);
				return true;
			}
			return false;
		};


		//This event is called from with the core-component selector directive
		$scope.selectorChange = function (selected, entry) {
			if (!selected) {
				$rootScope.save(entry);
			}
		};

		$rootScope.add = function () {
			$scope.edit(journalService.createEntry());
		};

		$rootScope.save = function (entry) {
			//Edge case: delete entry from server, keep created date as user may want to add real content latter
			if (journalService.isEmptyEntry(entry)) {
				// TODO: Create service that modifies rootscope.entries.  No direct editing should be done.
				// TODO: if empty, should delete entry if ID is available
				for (var i = 0; i < $rootScope.entries.length; i++) {
					if (angular.equals(entry, $rootScope.entries[i])) {
						$rootScope.entries.splice(i, 1);
						break;
					}
				}

				if (entry.id) { // Delete entry if nothing in there
					journalService.delete(entry);
				}
			} else if (entry.$changed) {
				Angularytics.trackEvent('Journal', 'Save', entry.id ? 'Edit' : 'New');
				entry.$triedDelete = false;
				if (!entry.id) {
					$rootScope.entries.unshift(entry);
				}
				journalService.save(entry).then(function (result) {
					// TODO: have the server send id/time/whatever else might need updating to front end
					entry.updated = new Date().getTime() / 1000;
					if (!entry.id) {
						entry.id = result.id;
					}
					entry.$changed = false;
					//Saving of offline entry worked, remove it
					if (entry.$offline) {
						$scope.removeOfflineEntry(entry);
						//Remove from $rootScope list
						var index = -1;
						for (var i = 0; i < $rootScope.entries.length; i++) {
							if (entry.id === $rootScope.entries[i].id && !$rootScope.entries[i].$offline) {
								index = i;
							}
						}
						$rootScope.entries.splice(index, 1);
					}
					entry.$offline = false;

				}, function (error) {
					// TODO: add alert for when something else goes wrong, like a different type of error
					if (error.id === ServiceConstant.OFFLINE) { // currently offline, add to local storage for latter
						//$scope.errorMsg = error.message;
						var list = [];
						entry.$full = true;
						entry.$triedDelete = false;
						if (localStorageService.get('offlineList')) {
							list = localStorageService.get('offlineList');
						}
						var id = 0, i;
						if (!angular.isDefined(entry.id) && !angular.isDefined(entry.$$id)) {
							for (i = 0; i < list.length; i++) {
								if (list[i].$$id < id) {
									id = list[i];
								}
							}
							entry.$$id = id - 1;
						}

						//Already tried to save it before, replace entry encase any changes have been made since last attempted save
						if (entry.$offline) {
							for (i = 0; i < list.length; i++) {
								if (list[i].id === entry.id) {
									angular.extend(list[i], entry);
								}
							}
						}
						else {
							entry.$offline = true;
							list.push(entry);
						}
						localStorageService.set('offlineList', list);

						return entry;
					}
				})
			}
		};

		$rootScope.removeOfflineEntry = function (entry) {
			var list = localStorageService.get('offlineList');
			var index = -1;
			for (var i = 0; i < list.length; i++) {
				if (entry.id === list[i].id) {
					index = i;
				}
			}
			list.splice(index, 1);
			localStorageService.set('offlineList', list);
		};


		$scope.showMore = function () {
			if (!$scope.loadingEnteries && $rootScope.more) {
				$scope.loadingEnteries = true;
				var lastResultId = $scope.entries[$scope.entries.length - 1].id;
				journalService.get($rootScope.savedSearchText, lastResultId).then(function (result) {
					angular.forEach(result.entries, function (value) {
						$scope.entries.push(value);
					});
					$rootScope.more = result.more;
					$scope.loadingEnteries = false;
				});
			}
		};

		//context bar
		$scope.data = {
			text: '',
			show: false,
			suggestions: null
		};
		$scope.returnUrl = localStorageService.get('return');

		var lastSearchText = '';

		$rootScope.search = function (value) {
			if (lastSearchText != value) {
				lastSearchText = value;
				$scope.data.text = value;
				$scope.data.show = true;
				Angularytics.trackEvent("Contextbar", "Search", value);
				journalService.get(value).then(function (result) {
					$rootScope.entries = result.entries;
					$rootScope.more = result.more;
					$rootScope.savedSearchText = value;
					$rootScope.searching = false;
				});
			}
		};

		$scope.searchButtonClick = function () {
			$scope.search($scope.data.text);
			$scope.data.show = true;

		};

		$scope.autoComplete = journalService.autoComplete;

		$scope.closeSearch = function () {
			$scope.data.show = $scope.data.text.length !== 0;
		};

		$scope.edit = function (entry) {
			entry.$triedDelete = false;  // Reset the delete flag from offline

			var openModal = function () {
				$modal.open({
					template: '<div journal-entry-edit ng-model="entry" done="ok()" delete="delete()"></div>',
					controller: function ($scope, $modalInstance) {
						$scope.entry = entry;

						$scope.ok = function () {
							$modalInstance.close();
						};

						$scope.delete = function () {
							// Check to see if new entry
							if ($scope.entry && $scope.entry.id) {
								Angularytics.trackEvent("Journal", "Delete");
								journalService.delete($scope.entry).then(function () {
									$scope.$$deleted = true;
									$scope.entry.$offline = false;
									$rootScope.entries.splice($rootScope.entries.indexOf($scope.entry), 1);
								}, function (error) {
									if (error.id === ServiceConstant.OFFLINE) {
										$scope.entry.$offline = true;
										$scope.entry.$triedDelete = true;
										$scope.entry.$$deleting = false;
									}
								});
							}
							$modalInstance.close();
						};
					}
				}).result.finally(function () {
						if (!entry.$$deleting) {
							$scope.save(entry);
						}
						entry.$$deleting = false;
					});
			};

			//On load we only retrieve part of the journal content, when the card is flipped over we get the rest
			// TODO: Need server to send full flag to us
			if (entry.content.length > 99 && !entry.$full) {
				journalService.getId(entry.id).then(function (result) {
					// TODO: get server to only send content in an object, with $full flag
					angular.extend(entry, result);
					entry.$offline = false;
					entry.$full = true;
					openModal();
				}, function (error) {
					if (error.id === ServiceConstant.OFFLINE) {
						entry.$offline = true;
					}
				});
			} else {
				entry.$full = true;
				openModal();
			}
		}
	}
);
