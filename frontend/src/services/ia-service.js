angular.module('iaService', ['codinghitchhiker.ServiceFactory']).provider('iaService', function () {

		var amount, core, query;

		this.$get = function ($http, $q, ServiceFactory) {
			amount = 10;
			query = $q;
			core = new ServiceFactory('api');
			return {
				get: get/*,
				 getId: getId,
				 delete: remove,
				 save: save,
				 autoComplete: autoComplete,
				 createEntry: createEntry,
				 isEmptyEntry: isEmptyEntry*/
			};
		};

		//Gets a list of journals containing partial content
		function get(mac) {
			if (mac) {
				return core.add(mac).get();
			} else {
				return core.get();
			}
		}

		/*
		 //Gets the full content of a single journal item
		 function getId(id) {
		 return core.add(id).get().then(function (result) {
		 angular.forEach(result.attachments, function (value) {
		 value.path = endpoint + 'api/v1/document/' + value.id;
		 });
		 return result;
		 });
		 }

		 function remove(entry) {
		 return core.add(entry.id).delete();
		 }

		 function save(entry) {
		 //adds a new entry
		 if (entry.id == null || entry.$$id < 0) {
		 return core.post(null, entry).then(function (result) {
		 entry.id = result.id;
		 return entry;
		 });
		 }

		 else { //saves an existing entry
		 return core.add(entry.id).put(null, entry);
		 }
		 }

		 function autoComplete(term, type) {
		 type = type || 'all'; // default for type
		 return core.add("autocomplete").get({term: term, type: type});
		 }

		 function createEntry() {
		 var timestamp = Math.floor(new Date().getTime() / 1000);
		 return {
		 id: undefined,
		 title: '',
		 created: timestamp,
		 updated: timestamp,
		 tags: [],
		 content: '',
		 attachments: [],
		 $full: true,
		 $changed: false
		 };
		 }

		 function isEmptyEntry(entry) {
		 var bool = true;
		 if (entry) {
		 angular.forEach(['title', 'content', 'tags', 'attachments'], function (prop) {
		 if (entry[prop]) {
		 bool = bool && entry[prop].length === 0;
		 }
		 });
		 }
		 return bool;
		 }*/
	}
);