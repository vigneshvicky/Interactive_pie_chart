var app = angular.module("localStorage", []);
app.value("localStorageId",localStorageId);
app.value("sliceColors",pieSliceColors);
app.value("allPie_data",[]);
app.value("currentPieData",[[],[]]);

app.directive("localStorage",[function () {
    return {
        controller: ["$scope","localStorageId","allPie_data","sliceColors","currentPieData","$rootScope", function ($scope,localStorageId,allPie_data,sliceColors,currentPieData,$rootScope) {
            $scope.getData = function() {
            	//localStorage.removeItem(localStorageId);
            	var mydata = [[],[]];
            	var storageData = angular.fromJson(localStorage.getItem(localStorageId));
            	//$rootScope.default_angles=[45,117,189,261,333];
				if(storageData){
					
					currentPieData = storageData;
					var testObj = $scope.splitupData(currentPieData);
					mydata[0] = testObj[0];
					mydata[1] = testObj[1];
			    }else{
			    	//console.log(sliceColors);
			    	var testObj = $scope.splitupData(sliceColors);
					mydata[0] = testObj[0];
					mydata[1] = testObj[1];
			    	//mydata[0] = {colors:sliceColors,percentage:'20,20,20,20,20'};
			    	//mydata[1] = {colors:sliceColors,percentage:'20,20,20,20,20'};
			    	$scope.saveState(0,sliceColors[0]);
			    	$scope.saveState(1,sliceColors[1]);
			    }
            	//allPie_data = angular.fromJson(localStorage.getItem(localStorageId));
                return [mydata[0],mydata[1]];
            }
            $scope.splitupData = function(_currentPieData){
            	var mydata = [[],[]];
            	for(var i =0;i<_currentPieData.length;i++){
					var mycolors = [];
					var mypercentage = [];
					var myangles = [];
					for(var j =0;j<_currentPieData[i].length;j++){
						mycolors[j] = _currentPieData[i][j].colors;
						mypercentage[j]= _currentPieData[i][j].percentage;
						myangles[j] = _currentPieData[i][j].angles;
					}
					mydata[i] = {angles:myangles.join(","),colors:mycolors.join(",").replace(/#/g,""),percentage:mypercentage.join(",").replace(/%/g,"")};
				}
				//console.log(mydata);
				return mydata;
            }
            $scope.saveState = function (id,data) {
            	console.log("datas : "+id);
            	console.log(currentPieData);
            	console.log(data);
            	currentPieData[id] = data;
		        localStorage.setItem(localStorageId,angular.toJson(currentPieData));
		        //console.log(angular.fromJson(localStorage.getItem(localStorageId)));
		    };
            /*var service = {
				data: {			
		            angles:defaultDatas.angles,
					legendNames:defaultDatas.legendNames
		        },

		        SaveState: function () {
			
            localStorage.setItem(localStorageId,angular.toJson({angles:service.data.angles,legendNames:service.data.legendNames}));
        },

		        RestoreState: function () {
					var storageData = angular.fromJson(localStorage.getItem(localStorageId));
					
					service.data.legendNames = storageData.legendNames||service.data.legendNames;
		            service.data.angles = storageData.angles||service.data.angles;
					
		        },
				ClearState: function () {
					//localStorage.setItem(localStorageId,angular.toJson({angles:defaultDatas.angles,legendNames:defaultDatas.legendNames}));
		        }
		    }
		    $rootScope.$on("savestate", service.SaveState);
		    $rootScope.$on("restorestate", service.RestoreState);
			$rootScope.$on("clearState", service.ClearState);*/
        }]
    }
}]);



/*
app.factory('userService', ['$rootScope',"localStorageId","legendData","mathLogics", function ($rootScope,localStorageId,legendData,mathLogics) {
	defaultDatas = {
			angles:(function(){
				mathLogics.basicLogics.totalSlice = legendData.length;
				var startAngle = -90;
				var angleArray = [];
				var eachAngle = 360/mathLogics.basicLogics.totalSlice;
				for(var i=0;i<mathLogics.basicLogics.totalSlice;i++){
					angleArray[i] = i*eachAngle+startAngle;
				}
				return angleArray;
			})(),
			legendNames : legendData
		};
    var service = {
		data: {			
            angles:defaultDatas.angles,
			legendNames:defaultDatas.legendNames
        },

        SaveState: function () {
			
            localStorage.setItem(localStorageId,angular.toJson({angles:service.data.angles,legendNames:service.data.legendNames}));
        },

        RestoreState: function () {
			var storageData = angular.fromJson(localStorage.getItem(localStorageId));
			
			service.data.legendNames = storageData.legendNames||service.data.legendNames;
            service.data.angles = storageData.angles||service.data.angles;
			
        },
		ClearState: function () {
			localStorage.setItem(localStorageId,angular.toJson({angles:defaultDatas.angles,legendNames:defaultDatas.legendNames}));
        }
    }

    $rootScope.$on("savestate", service.SaveState);
    $rootScope.$on("restorestate", service.RestoreState);
	$rootScope.$on("clearState", service.ClearState);

    return service;
}]);*/
