// JavaScript Document
var app = angular.module("pieChart",[]);

app.value("mathLogics",new MathLogic());
app.value("sliceColors",pieSliceColors);
app.value("localStorageId",localStorageId);
app.value("activityTitle",activityTitle);
app.value("legendData",legendData);

app.service("easeExpo",function(){
	this.easeExpo = function(t, b, c, d){
		return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
	}
});
app.controller("piechartController",["$scope","$rootScope","mathLogics","sliceColors","easeExpo","userService","activityTitle",pieController]);
angular.forEach(['x', 'y'], function(name) {
  var ngName = 'ng' + name[0].toUpperCase() + name.slice(1);
  app.directive(ngName, function() {
    return function(scope, element, attrs) {
      attrs.$observe(ngName, function(value) {
        attrs.$set(name, value);
      })
    };
  });
});

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
}]);
function pieController($scope,$rootScope,mathLogics,sliceColors,easeExpo,userService,activityTitle){
	$scope.activityTitle = activityTitle;
	$scope.chartRadius = (mathLogics.basicLogics.radius+1)+"px";
	$scope.chartLeft = mathLogics.basicLogics.chartMidX+"px";
	$scope.chartTop = (mathLogics.basicLogics.chartMidY-7.5)+"px";
	$scope.defaultTextRadius = mathLogics.basicLogics.radius-25;
	$scope.pieSliceColors = sliceColors;
	$scope.totalSlice = mathLogics.basicLogics.totalSlice;
	
	$scope.eachSlicePercentage;
	$scope.legendNames = [];
	$scope.pieSliceDatas = [];
	$scope.sliceDatas = [];
	$scope.angles =[];
	$("#outerCircle").attr("cx",mathLogics.basicLogics.chartMidX);
	$("#outerCircle").attr("cy",mathLogics.basicLogics.chartMidY);
	$("#outerCircle").attr("r",mathLogics.basicLogics.radius);
	
	$("#midCircle").attr("cx",mathLogics.basicLogics.chartMidX);
	$("#midCircle").attr("cy",mathLogics.basicLogics.chartMidY);	
	
	$scope.doEdit = function(event){
		setTimeout(function(){			
			$(event.target).parent().find("input").focus().selectRange(0,$(event.target).parent().find(".legendDataClass").text().length);
		},50);
	}
	$scope.doBlur = function(event){
		var allSpans = $("#legend").find(".legendDataClass");
		var len = allSpans.length;
		for(var i=0;i<len;i++){
			userService.data.legendNames[i] = allSpans.eq(i).text();
		}		
		$rootScope.$broadcast("savestate");
	}
	$scope.getDefaultAngles = function(){	
		if (typeof(Storage) !== "undefined") {
			//$rootScope.$broadcast("clearState");
			$rootScope.$broadcast("restorestate");
		} else {
			// Sorry! No Web Storage support..
		}
		$scope.legendNames = userService.data.legendNames;
		$scope.angles = userService.data.angles;
		
		for(var i=0;i<$scope.angles.length;i++){
			var pos = mathLogics.getPositionByAnglesForLabel($scope.angles[i],$scope.angles[i==($scope.totalSlice-1)?0:(i+1)],$scope.defaultTextRadius);	
			$scope.pieSliceDatas[i] = {x:pos.left,y:pos.top,angle:mathLogics.getPercentageByTwoAngles($scope.angles[i==($scope.totalSlice-1)?0:(i+1)],$scope.angles[i])};
		}
		return $scope.angles;
	};
	
	$scope.defaultAngles = $scope.getDefaultAngles();
	
	$scope.generateSlice = function(curAngle,id){
		
		var nextId = (id==($scope.totalSlice-1))?-1:id;
		var currentSlicePosition = mathLogics.getPositionByAngle(curAngle);
		var nextSlicePosition = mathLogics.getPositionByAngle($scope.defaultAngles[nextId+1]);
		var angleDiff = mathLogics.getDifference($scope.angles[id==($scope.totalSlice-1)?0:(id+1)],curAngle);
		
		return "M"+mathLogics.basicLogics.chartMidX+","+mathLogics.basicLogics.chartMidY+" L"+currentSlicePosition.left+","+currentSlicePosition.top+" A"+mathLogics.basicLogics.radius+","+mathLogics.basicLogics.radius+",0,"+(angleDiff>180?1:0)+",1,"+nextSlicePosition.left+","+nextSlicePosition.top+" L"+mathLogics.basicLogics.chartMidX+","+mathLogics.basicLogics.chartMidY+" A0,0,0,1,0,"+mathLogics.basicLogics.chartMidX+","+mathLogics.basicLogics.chartMidY;
		
	}
	
}
app.filter("roundOffNumber",["mathLogics",function(mathLogics){
	return function(val){
		var rounded = Math.round(val);
		return rounded;//rounded<mathLogics.basicLogics.minimumSlicePercentage?mathLogics.basicLogics.minimumSlicePercentage:rounded;
	}
}]);

app.directive("editIcon",[function(){
	
	return{
		scope:{
			'startEdit':'&','colorCode':'@','legendData':'@','removeMe':'&'
			},
		template:'<img src="images/edit.png" alt="Edit" ng-mousedown="isEdit=!isEdit; startEdit({event: $event});" style="cursor:pointer;" />&nbsp;&nbsp;<div style="width:100%; display:inline; position:relative; top:-7px;"><div class="circle" style="background-color:{{colorCode}};"></div> <div class="legendDataClass" ng-bind="legendData" ng-hide="isEdit">{{legendData}}</div><input ng-show="isEdit" ng-blur="isEdit=false; removeMe({event: $event})" type="text" maxlength="30" style="position:absolute; left:15px; top:-2px;" ng-model="legendData"></div>'
	}
}]);

app.directive("sliceBorder",['mathLogics',"userService","$rootScope",function(mathLogics,userService,$rootScope){
	var curAngle;
	var curPos;
	var totalPIEAngle = 360;
	var previousIdNum;
	var currentIdNum;
	var nextIdNum;
	var slice1StartPosition;
	var previousAngle = 0;
	
	function links(scope, element, attrs){		
		
		element.bind("mousedown touchstart",function(evt){
			
			mathLogics.basicLogics.setCurrentSlice(evt.currentTarget);
			$("body").on("mouseup touchend", mUp);
			$("#piechartController").on('mousemove touchmove', mMove);		
		});
		mUp = function(evt){
			$("body").off("mouseup touchend", mUp);
			$("#piechartController").off('mousemove touchmove', mMove);		
			var tempAngle = [];
			for(var i=0;i<scope.$parent.totalSlice;i++){
				tempAngle[i] = mathLogics.getAngleByElement($("#sliceBorder"+i)).deg;				
			}
			
			userService.data.angles=tempAngle;
			$rootScope.$broadcast("savestate");
			//$rootScope.$broadcast("restorestate");
		};
		
		
		mMove = function(evt){
			curPos = mathLogics.getCurrentMousePosition(evt,$(this));
					
			if(mathLogics.getDistance(mathLogics.basicLogics.chartMidX-curPos.posX,mathLogics.basicLogics.chartMidY-curPos.posY)<40){
				$(evt.currentTarget).off("mouseup touchend", mUp);
				$("body").off("mouseup touchend", mUp);
				$("#piechartController").off('mousemove touchmove', mMove);
				return;
			}
			
			currentIdNum = mathLogics.basicLogics.getNumber($(mathLogics.basicLogics.currentSlice).attr("id"));
			var curAngle = mathLogics.getAngle(curPos.posX,curPos.posY);
			$(mathLogics.basicLogics.currentSlice).css({'transform': 'rotate('+curAngle+'deg)'});
			
			previousIdNum = mathLogics.basicLogics.getNumber($(mathLogics.basicLogics.previousSlice).attr("id"));
			
			nextIdNum = mathLogics.basicLogics.getNumber($(mathLogics.basicLogics.nextSlice).attr("id"));			
			
			previousElementPos = mathLogics.getPositionByAngle(mathLogics.getAngleByElement($(mathLogics.basicLogics.previousSlice)).deg);
			
			nextElementPos = mathLogics.getPositionByAngle(mathLogics.getAngleByElement($(mathLogics.basicLogics.nextSlice)).deg);
			
			if(previousAngle>350 && curAngle<10){
				mathLogics.isRotateClockWise = true;
			}else if(previousAngle<10 && curAngle>350){
				mathLogics.isRotateClockWise = false;
			}else{
				mathLogics.isRotateClockWise = previousAngle<curAngle;				
			}
			previousAngle = curAngle;
			var currentPosition = mathLogics.getPositionByAngle(curAngle);			
			
			var myValPrev = mathLogics.getAngleByElement($(mathLogics.basicLogics.previousSlice)).deg;
			var myValNext = mathLogics.getAngleByElement($(mathLogics.basicLogics.nextSlice)).deg;
						
			var prev_curr_angle = mathLogics.getDifference(curAngle,myValPrev);
			var curr_next_angle = mathLogics.getDifference(myValNext,curAngle);		
			
			var pos1 = mathLogics.getPositionByAnglesForLabel(curAngle,myValNext,scope.$parent.defaultTextRadius);			
			var pos2 = mathLogics.getPositionByAnglesForLabel(myValPrev,curAngle,scope.$parent.defaultTextRadius);
			
			
			
			drawSlice(currentIdNum,currentPosition,nextElementPos,curr_next_angle);
			drawSlice(previousIdNum,previousElementPos,currentPosition,prev_curr_angle);
			
			//From current to next slice drawing
			
			if(mathLogics.getPercentage(curr_next_angle)<=5||mathLogics.getPercentage(prev_curr_angle)<=5){
				if(mathLogics.isRotateClockWise){
					checkClockwise_MinAngle(currentIdNum);
				}else{
					checkAnticlockWise_MinAngle(currentIdNum);
				}
			}	
			scope.$parent.pieSliceDatas[currentIdNum] = {x:pos1.left,y:pos1.top,angle:mathLogics.getPercentageByTwoElements($("#sliceBorder"+nextIdNum),$("#sliceBorder"+currentIdNum))};
			scope.$parent.pieSliceDatas[previousIdNum] = {x:pos2.left,y:pos2.top,angle:mathLogics.getPercentageByTwoElements($("#sliceBorder"+currentIdNum),$("#sliceBorder"+previousIdNum))};
			scope.$parent.$apply();
			//Text value and position update.
			
		}
		checkClockwise_MinAngle = function (currId){
			var nextIdNum = currId == (~-scope.$parent.totalSlice)?0:currId+1;
			if(mathLogics.getPercentageByTwoElements($("#sliceBorder"+nextIdNum),$("#sliceBorder"+currId))<=5){
				var currentAng = mathLogics.getAngleByElement($("#sliceBorder"+currId)).deg;
				var nextAng = currentAng+18;
				$("#sliceBorder"+nextIdNum).css({'transform': 'rotate('+nextAng+'deg)'});				
				
				currentElementPos = mathLogics.getPositionByAngle(currentAng);
				
				nextElementPos = mathLogics.getPositionByAngle(nextAng);
				curr_next_angle = mathLogics.getDifference(nextAng,currentAng);
				
				drawSlice(currId,currentElementPos,nextElementPos,curr_next_angle);
				var after_NextIdNum = nextIdNum == (~-scope.$parent.totalSlice)?0:nextIdNum+1;
				var after_NextAng;
				
				if(mathLogics.getPercentageByTwoElements($("#sliceBorder"+after_NextIdNum),$("#sliceBorder"+nextIdNum))<=5){
					after_NextAng = nextAng+18;
					$("#sliceBorder"+after_NextIdNum).css({'transform': 'rotate('+after_NextAng+'deg)'});	
				}else{
					after_NextAng = mathLogics.getAngleByElement($("#sliceBorder"+after_NextIdNum)).deg;
				}
				var after_NextPos = mathLogics.getPositionByAngle(after_NextAng);
				
				var next_afterNext_angle_diff = mathLogics.getDifference(mathLogics.getAngleByElement($("#sliceBorder"+after_NextIdNum)).deg,nextAng);
				
				drawSlice(nextIdNum,nextElementPos,after_NextPos,next_afterNext_angle_diff);
				
				var nextAfterNext_text_pos = mathLogics.getPositionByAnglesForLabel(nextAng,after_NextAng,scope.$parent.defaultTextRadius);
				
				scope.$parent.pieSliceDatas[nextIdNum] = {x:nextAfterNext_text_pos.left,y:nextAfterNext_text_pos.top,angle:mathLogics.getPercentage(next_afterNext_angle_diff)};
			
				checkClockwise_MinAngle(nextIdNum);
			}
		}
		
		checkAnticlockWise_MinAngle = function (currId){
			//From previous to current slice drawing
			var prevIdNum = currId?currId-1:~-scope.$parent.totalSlice;			
			if(mathLogics.getPercentageByTwoElements($("#sliceBorder"+currId),$("#sliceBorder"+prevIdNum))<=5){
				var currentAng = mathLogics.getAngleByElement($("#sliceBorder"+(currId))).deg;
				var prevAng = currentAng-18;
				$("#sliceBorder"+prevIdNum).css({'transform': 'rotate('+prevAng+'deg)'});			
				
				currentElementPos = mathLogics.getPositionByAngle(currentAng);
				prevElementPos = mathLogics.getPositionByAngle(prevAng);
				curr_prev_angle = mathLogics.getDifference(currentAng,prevAng);
				
				//currentElementPos = mathLogics.getPositionByAngle(currentAng);
				var prevId = currId?currId-1:~-scope.$parent.totalSlice;
				drawSlice(prevId,prevElementPos,currentElementPos,curr_prev_angle);				
				
				var before_PrevIdNum = prevIdNum?prevIdNum-1:(~-scope.$parent.totalSlice);
				var before_PrevPos = mathLogics.getPositionByElement($("#sliceBorder"+before_PrevIdNum));
				var prev_beforePrev_angle;
				if(mathLogics.getPercentageByTwoElements($("#sliceBorder"+prevIdNum),$("#sliceBorder"+before_PrevIdNum))<=5){
					prev_beforePrev_angle = prevAng-18;
					$("#sliceBorder"+before_PrevIdNum).css({'transform': 'rotate('+prev_beforePrev_angle+'deg)'});	
				}else{
					prev_beforePrev_angle = mathLogics.getAngleByElement($("#sliceBorder"+before_PrevIdNum)).deg;
				}			
				
				var prev_beforePrev_angle_diff = mathLogics.getDifference(prevAng, prev_beforePrev_angle);
				
				prevId = prevIdNum?prevIdNum-1:~-scope.$parent.totalSlice;
				drawSlice(prevId,before_PrevPos,prevElementPos,prev_beforePrev_angle_diff);
				
				var prevBeforePrev_text_pos = mathLogics.getPositionByAnglesForLabel(prev_beforePrev_angle,prevAng,scope.$parent.defaultTextRadius);
				scope.$parent.pieSliceDatas[prevId] = {x:prevBeforePrev_text_pos.left,y:prevBeforePrev_text_pos.top,angle:mathLogics.getPercentage(prev_beforePrev_angle_diff)};
				
				checkAnticlockWise_MinAngle(prevIdNum);
				
			}
		}
		drawSlice = function(sliceId, fromPos, toPos, angleDiff){
			$("#slice"+sliceId).attr("d","M"+mathLogics.basicLogics.chartMidX+","+mathLogics.basicLogics.chartMidY+" L"+fromPos.left+","+fromPos.top+" A"+mathLogics.basicLogics.radius+","+mathLogics.basicLogics.radius+",0,"+(angleDiff>180?1:0)+",1,"+toPos.left+","+toPos.top+" L"+mathLogics.basicLogics.chartMidX+","+mathLogics.basicLogics.chartMidY+" A0,0,0,0,0,"+mathLogics.basicLogics.chartMidX+","+mathLogics.basicLogics.chartMidY);
		}
	}
	
	return {
		restrict : "C",		
        template : "<div style='height:2px; background-color:white; top:6.5px; position:relative;'></div>",
		link: links,
		scope:{}
    }
}]);