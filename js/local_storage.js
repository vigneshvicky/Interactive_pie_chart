angular.module("localStorage", [])
.directive("localStorage", function () {
    return {
        controller: ["$scope", function ($scope) {            
            $scope.getData = function() {

                return [{colors:'FFDC00,FF9900,109618,990099,00FF00',radius:'100',left:'0px',percentage:'20,20,20,10,30'},{colors:'DC3912,00FF00,109618,990099',radius:'120',left:'200px',percentage:'25,25,25,25'}];
            }

        }]
    }
})