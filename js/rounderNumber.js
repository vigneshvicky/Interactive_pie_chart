(function() {
	angular.module('pieChart')
		.factory("DataService", DataFactory);

		function DataFactory() {
			var dataObj = {
				totalModules: totalModules
			}
			return dataObj;
		}
		var totalModules = [5, 7];
})()