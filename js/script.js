angular
.module("chart",["localStorage"])        
	.directive("pieChart",function(){
        return{
            restrict:"E",
            /*scope:{
                colors:"@",
                percentage:"@",
                chartid:"@" 
            },*/
            scope:true,
            controller:"Ctrl",
				link:function($scope,iElement,iAttributes, ctrl){
					/*iAttributes.$observe('transform', function (val) {
                    	console.log("observe");
                	});*/

					$scope.directiveElement = iElement;
					$scope.radius = Number(iAttributes.radius);
					$scope.border_thickness = 2;
					$scope.half_border_thickness = $scope.border_thickness/2;
					$scope.colors = iAttributes.colors;
					$scope.percentage = iAttributes.percentage;
					$scope.mychartid = iAttributes.chartid;
					$scope.percent = [];
					$scope.default_angles = [];
					$scope.currentChartId = "";
					$scope.defaultTextRadius = $scope.radius-25;
					$scope.colorsData = $scope.colors.split(",");
					$scope.pieSliceDatas = [];
					//$scope.totalSlice = $scope.colorsData.length;
					$scope.previousAngle = 0;
					$scope.totalPIEAngle = 360;
					$scope.doInitialSetup();
					if($scope.percentage){
						var tempArr = $scope.percentage.split(",");
						var tempVal = 0;
						for(var i=0;i<tempArr.length;i++){                                                                                                          
							$scope.default_angles[i] = tempVal;
							tempVal += Number(tempArr[i]*360/100);
						}
						//scope.percent = scope.percentage.split(",");
					}else{
						
						for(var i=0;i<$scope.totalSlice;i++){
							$scope.default_angles[i] = (360/$scope.totalSlice)*i;
						}

					}
					
					$scope.setXPos;
				},
				template:"<div>"+
							"<svg height=\"{{radius*2+border_thickness}}\" width=\"{{radius*2+border_thickness}}\">"+
                            	"<circle cx=\"{{radius+half_border_thickness}}\" cy=\"{{radius+half_border_thickness}}\" r=\"{{radius}}\" fill=\"#AABBCC\"/>"+
                            	"<g class=\"slice_line\" ng-repeat=\"myang in default_angles track by $index\" >"+
            						"<path d=\"{{generateSlice(myang,$index)}}\" stroke=\"#ffffff\" stroke-width=\"0\" fill=\"#{{colorsData[$index]}}\"></path>"+
            					"</g>"+
	                            "<g class=\"pie_slice\" ng-repeat=\"arr in colorsData track by $index\" custAttr=\"{{attrTestFunc($index)}}\" id=\"{{mychartid}}_stick_{{$index}}\" transform =\"{{getStyle($index)}}\" fill=\"none\" style=\"cursor:pointer;\" ng-mousedown=\"startMoveSlice($event)\">"+
	                                "<rect x=\"0\" y=\"-5\" width=\"{{radius}}\" height=\"10\" style=\"fill:blue; fill-opacity:0;\"></rect>"+
	                                "<line stroke=\"#FFFFFF\" stroke-width=\"2\" x1=\"0\" y1=\"0\" x2=\"{{radius}}\" y2=\"0\" style=\"stroke-opacity:1\"/>"+
	                            "</g>"+								                         
	                            "<circle cx=\"{{radius+half_border_thickness}}\" cy=\"{{radius+half_border_thickness}}\" r=\"10\" fill=\"white\"/>"+
	                            "<circle cx=\"{{radius+half_border_thickness}}\" cy=\"{{radius+half_border_thickness}}\" r=\"{{radius}}\" stroke-width=\"2\" stroke=\"white\" fill=\"none\"/>"+
                        	"</svg>"+
        				"</div>"
			}
		}).controller("Ctrl",["$scope","mathLogics","$document","$rootScope",function($scope,mathLogics,$document,$rootScope){
//"M"+mathLogics.basicLogics.chartMidX+","+mathLogics.basicLogics.chartMidY+" L"+currentSlicePosition.left+","+currentSlicePosition.top+" A"+mathLogics.basicLogics.radius+","+mathLogics.basicLogics.radius+",0,"+(angleDiff>180?1:0)+",1,"+nextSlicePosition.left+","+nextSlicePosition.top+" L"+mathLogics.basicLogics.chartMidX+","+mathLogics.basicLogics.chartMidY+" A0,0,0,1,0,"+mathLogics.basicLogics.chartMidX+","+mathLogics.basicLogics.chartMidY;
			//M180,190 L316.3854163570603,127.55788116093981 A150,150,0,0,1,258.37478470739234,317.89602465311384 L180,190 A0,0,0,1,0,180,190
			//console.log($scope.colors+" : my colors");
			//$scope.curAngle = 0;
			//mathLogics.basicLogics.totalSlice = $scope.totalSlice;
			//mathLogics.basicLogics.chartMidY = $scope.radius;
			var previousAngle = 0;
			$scope.getdetails = function(){
				console.log("caling");
			}
			$scope.doInitialSetup = function(){
				//mathLogics.basicLogics.radius = $scope.radius;
				//mathLogics.basicLogics.totalSlice = $scope.colorsData.length;
				mathLogics.setScope ($scope);
				$scope.totalSlice = $scope.colorsData.length;//mathLogics.basicLogics.totalSlice;
				$scope.chartMidX  = $scope.radius+$scope.half_border_thickness;
				$scope.chartMidY = $scope.radius+$scope.half_border_thickness;
				
			}
			$scope.someFunc = function(val){
                 return "rotate("+(val-0)+",0,0)";
            }
			$scope.getStyle = function(val){
				//$scope.default_angles[val] = val*$scope.eachAngle;
				//console.log($scope.default_angles[val]);
				return "translate("+($scope.radius+$scope.half_border_thickness)+","+($scope.radius+$scope.half_border_thickness)+") rotate("+($scope.default_angles[val]-0)+",0,0)";
			}

			$scope.attrTestFunc = function(val){
				//console.log(val+" testing func")
				//$scope.theta = "translate(101,101) rotate("+(((360/$scope.totalSlice)*val)-0)+",0,0)"
				return val+":";
			}
			$scope.startMoveSlice = function(evt){
				$scope.currentChartId = mathLogics.getNumber($($scope.directiveElement).attr("chartid"));
				//$scope.currentChart = $($scope.directiveElement).attr("chartid");
				mathLogics.setScope ($scope);
				//console.log("Radius of current pie chart : "+$scope.radius);			
				mathLogics.setCurrentSlice(evt.currentTarget);

				$document.on('mousemove', mMove_javascript);
				$document.on('mouseup', stopMove_javascript);

				//console.log($( ".pie_slice" ).index( $(evt.currentTarget) ) );
			}
			function mMove_javascript(evt){
			    var scope = angular.element($($scope.directiveElement)).scope();
			    scope.$apply(function () {
			        //console.log(evt);
			        scope.mMove(evt);
			    });
			}
			function stopMove_javascript(){
				//console.log("stop move"+$scope.radius);
				$document.off('mousemove', mMove_javascript);
				$document.off('mouseup', stopMove_javascript);
			}
			$scope.mMove = function(evt){
				var curPos = mathLogics.getCurrentMousePosition(evt,$(mathLogics.currentSlice).parent());
				//$("#test_dot").css({left:evt.clientX+"px",top:evt.clientY+"px"});
				currentIdNum = $($scope.directiveElement).find(".pie_slice").index(mathLogics.currentSlice); //mathLogics.getNumber($(mathLogics.currentSlice).attr("id"));
				var curAngle = mathLogics.getAngle(curPos.posX,curPos.posY,($scope.radius+$scope.half_border_thickness),($scope.radius+$scope.half_border_thickness));
				$(mathLogics.currentSlice).attr({'transform': "translate("+($scope.radius+$scope.half_border_thickness)+","+($scope.radius+$scope.half_border_thickness)+") rotate("+(curAngle-0)+",0,0)"});
				//$scope.theta = 'translate(101,101) rotate('+$scope.curAngle+',0,0)';
				
				//console.log($(mathLogics.basicLogics.currentSlice).attr('transform'));
			
			
				previousIdNum = $($scope.directiveElement).find(".pie_slice").index(mathLogics.previousSlice);
				
				nextIdNum = $($scope.directiveElement).find(".pie_slice").index(mathLogics.nextSlice);


				var previousElementPos = mathLogics.getPositionByAngle(mathLogics.getAngleByElement($(mathLogics.previousSlice)).deg);
				
				var nextElementPos = mathLogics.getPositionByAngle(mathLogics.getAngleByElement($(mathLogics.nextSlice)).deg);
				
				if(previousAngle>350 && curAngle<10){
					mathLogics.isRotateClockWise = true;
				}else if(previousAngle<10 && curAngle>350){
					mathLogics.isRotateClockWise = false;
				}else{
					mathLogics.isRotateClockWise = previousAngle<curAngle;				
				}
				previousAngle = curAngle;
				var currentPosition = mathLogics.getPositionByAngle(curAngle);			
				
				var myValPrev = mathLogics.getAngleByElement($(mathLogics.previousSlice)).deg;
				var myValNext = mathLogics.getAngleByElement($(mathLogics.nextSlice)).deg;
							
				var prev_curr_angle = mathLogics.getDifference(curAngle,myValPrev);
				var curr_next_angle = mathLogics.getDifference(myValNext,curAngle);

				var pos1 = mathLogics.getPositionByAnglesForLabel(curAngle,myValNext,$scope.defaultTextRadius);			
				var pos2 = mathLogics.getPositionByAnglesForLabel(myValPrev,curAngle,$scope.defaultTextRadius);
				
				$scope.drawSlice(currentIdNum,currentPosition,nextElementPos,curr_next_angle);
				$scope.drawSlice(previousIdNum,previousElementPos,currentPosition,prev_curr_angle);

				if(mathLogics.getPercentage(curr_next_angle)<=5||mathLogics.getPercentage(prev_curr_angle)<=5){
				if(mathLogics.isRotateClockWise){
					$scope.checkClockwise_MinAngle(currentIdNum);
				}else{
					$scope.checkAnticlockWise_MinAngle(currentIdNum);
				}
			}	
			$scope.pieSliceDatas[currentIdNum] = {x:pos1.left,y:pos1.top,angle:mathLogics.getPercentageByTwoElements($("#sliceBorder"+nextIdNum),$("#sliceBorder"+currentIdNum))};
			$scope.pieSliceDatas[previousIdNum] = {x:pos2.left,y:pos2.top,angle:mathLogics.getPercentageByTwoElements($("#sliceBorder"+currentIdNum),$("#sliceBorder"+previousIdNum))};
			//scope.$parent.$apply();

			}
			$scope.checkClockwise_MinAngle = function(currId){
				var nextIdNum = currId == (~-$scope.totalSlice)?0:currId+1;
				if(mathLogics.getPercentageByTwoElements($($scope.directiveElement).find(".pie_slice").eq(nextIdNum),$($scope.directiveElement).find(".pie_slice").eq(currId))<=5){
					var currentAng = mathLogics.getAngleByElement($($scope.directiveElement).find(".pie_slice").eq(currId)).deg;
					var nextAng = currentAng+18;
					$($scope.directiveElement).find(".pie_slice").eq(nextIdNum).attr('transform', "translate("+($scope.radius+$scope.half_border_thickness)+","+($scope.radius+$scope.half_border_thickness)+") rotate("+nextAng+",0,0)");
					currentElementPos = mathLogics.getPositionByAngle(currentAng);
					
					nextElementPos = mathLogics.getPositionByAngle(nextAng);
					curr_next_angle = mathLogics.getDifference(nextAng,currentAng);
					
					$scope.drawSlice(currId,currentElementPos,nextElementPos,curr_next_angle);
					var after_NextIdNum = nextIdNum == (~-$scope.totalSlice)?0:nextIdNum+1;
					var after_NextAng;				
					if(mathLogics.getPercentageByTwoElements($($scope.directiveElement).find(".pie_slice").eq(after_NextIdNum),$($scope.directiveElement).find(".pie_slice").eq(nextIdNum))<=5){
						after_NextAng = nextAng+18;
						$($scope.directiveElement).find(".pie_slice").eq(after_NextIdNum).attr('transform', "translate("+($scope.radius+$scope.half_border_thickness)+","+($scope.radius+$scope.half_border_thickness)+") rotate("+after_NextAng+",0,0)");
					}else{
						after_NextAng = mathLogics.getAngleByElement($($scope.directiveElement).find(".pie_slice").eq(after_NextIdNum)).deg;
					}
					var after_NextPos = mathLogics.getPositionByAngle(after_NextAng);
					
					var next_afterNext_angle_diff = mathLogics.getDifference(mathLogics.getAngleByElement($($scope.directiveElement).find(".pie_slice").eq(after_NextIdNum)).deg,nextAng);
					
					$scope.drawSlice(nextIdNum,nextElementPos,after_NextPos,next_afterNext_angle_diff);
					
					var nextAfterNext_text_pos = mathLogics.getPositionByAnglesForLabel(nextAng,after_NextAng,$scope.defaultTextRadius);
					
					$scope.pieSliceDatas[nextIdNum] = {x:nextAfterNext_text_pos.left,y:nextAfterNext_text_pos.top,angle:mathLogics.getPercentage(next_afterNext_angle_diff)};
				
					$scope.checkClockwise_MinAngle(nextIdNum);
				}
			}
			$scope.checkAnticlockWise_MinAngle = function (currId){
			//From previous to current slice drawing
			var prevIdNum = currId?currId-1:~-$scope.totalSlice;	
			if(mathLogics.getPercentageByTwoElements($($scope.directiveElement).find(".pie_slice").eq(currId),$($scope.directiveElement).find(".pie_slice").eq(prevIdNum))<=5){						
				var currentAng = mathLogics.getAngleByElement($($scope.directiveElement).find(".pie_slice").eq(currId)).deg;
				var prevAng = currentAng-18;
				$($scope.directiveElement).find(".pie_slice").eq(prevIdNum).attr('transform', "translate("+($scope.radius+$scope.half_border_thickness)+","+($scope.radius+$scope.half_border_thickness)+") rotate("+prevAng+",0,0)");
				
				currentElementPos = mathLogics.getPositionByAngle(currentAng);
				prevElementPos = mathLogics.getPositionByAngle(prevAng);
				curr_prev_angle = mathLogics.getDifference(currentAng,prevAng);
				
				//currentElementPos = mathLogics.getPositionByAngle(currentAng);
				var prevId = currId?currId-1:~-$scope.totalSlice;
				$scope.drawSlice(prevId,prevElementPos,currentElementPos,curr_prev_angle);				
				
				var before_PrevIdNum = prevIdNum?prevIdNum-1:(~-$scope.totalSlice);
				var before_PrevPos = mathLogics.getPositionByElement($($scope.directiveElement).find(".pie_slice").eq(before_PrevIdNum));
				var prev_beforePrev_angle;
				if(mathLogics.getPercentageByTwoElements($($scope.directiveElement).find(".pie_slice").eq(prevIdNum),$($scope.directiveElement).find(".pie_slice").eq(before_PrevIdNum))<=5){
					prev_beforePrev_angle = prevAng-18;
					$($scope.directiveElement).find(".pie_slice").eq(before_PrevIdNum).attr('transform', "translate("+($scope.radius+$scope.half_border_thickness)+","+($scope.radius+$scope.half_border_thickness)+") rotate("+prev_beforePrev_angle+",0,0)");
				}else{
					prev_beforePrev_angle = mathLogics.getAngleByElement($($scope.directiveElement).find(".pie_slice").eq(before_PrevIdNum)).deg;
				}			
				
				var prev_beforePrev_angle_diff = mathLogics.getDifference(prevAng, prev_beforePrev_angle);
				
				prevId = prevIdNum?prevIdNum-1:~-$scope.totalSlice;
				$scope.drawSlice(prevId,before_PrevPos,prevElementPos,prev_beforePrev_angle_diff);
				
				var prevBeforePrev_text_pos = mathLogics.getPositionByAnglesForLabel(prev_beforePrev_angle,prevAng,$scope.defaultTextRadius);
				$scope.pieSliceDatas[prevId] = {x:prevBeforePrev_text_pos.left,y:prevBeforePrev_text_pos.top,angle:mathLogics.getPercentage(prev_beforePrev_angle_diff)};				
				
				$scope.checkAnticlockWise_MinAngle(prevIdNum);
				
			}
		}
			$scope.drawSlice = function(sliceId, fromPos, toPos, angleDiff){
				//console.log(sliceId);
				$($scope.directiveElement).find(".slice_line").eq(sliceId).find("path").attr("d","M"+$scope.chartMidX+","+$scope.chartMidY+" L"+fromPos.left+","+fromPos.top+" A"+$scope.radius+","+$scope.radius+",0,"+(angleDiff>180?1:0)+",1,"+toPos.left+","+toPos.top+" L"+$scope.chartMidX+","+$scope.chartMidY+" A0,0,0,0,0,"+$scope.chartMidX+","+$scope.chartMidY);
				//$("#slice"+sliceId).attr("d","M"+mathLogics.basicLogics.chartMidX+","+mathLogics.basicLogics.chartMidY+" L"+fromPos.left+","+fromPos.top+" A"+mathLogics.basicLogics.radius+","+mathLogics.basicLogics.radius+",0,"+(angleDiff>180?1:0)+",1,"+toPos.left+","+toPos.top+" L"+mathLogics.basicLogics.chartMidX+","+mathLogics.basicLogics.chartMidY+" A0,0,0,0,0,"+mathLogics.basicLogics.chartMidX+","+mathLogics.basicLogics.chartMidY);
			}	
			$scope.addSlice = function(colorCode){
				//$($scope.directiveElement).find("g").eq(0).css("display","none");
				$scope.colorsData.push(colorCode);				
				$($scope.directiveElement).find(".pie_slice").eq(0).attr({'transform': "translate("+($scope.radius+$scope.half_border_thickness)+","+($scope.radius+$scope.half_border_thickness)+") rotate(0,0,0)"});
				$scope.doInitialSetup();
				for(var i=0;i<$scope.totalSlice;i++){
					$scope.default_angles[i] = (360/$scope.totalSlice)*i;
				}
				//angular.element(mathLogics.basicLogics.currentSlice).attr({'transform': 'translate(101,101) rotate('+$scope.curAngle+',0,0)'});
			}
			$scope.generateSlice = function(curAngle,id){
				var nextId = (id==($scope.totalSlice-1))?-1:id;
				var currentSlicePosition = mathLogics.getPositionByAngle(curAngle,$scope.radius,($scope.radius+$scope.half_border_thickness),($scope.radius+$scope.half_border_thickness));
				var nextSlicePosition = mathLogics.getPositionByAngle($scope.default_angles[nextId+1],$scope.radius,($scope.radius+$scope.half_border_thickness),($scope.radius+$scope.half_border_thickness));
				var angleDiff = mathLogics.getDifference($scope.default_angles[id==($scope.totalSlice-1)?0:(id+1)],curAngle);
				return "M"+($scope.radius+$scope.half_border_thickness)+","+($scope.radius+$scope.half_border_thickness)+" L"+currentSlicePosition.left+","+currentSlicePosition.top+" A"+$scope.radius+","+$scope.radius+",0,"+(angleDiff>180?1:0)+",1,"+nextSlicePosition.left+","+nextSlicePosition.top+" L"+($scope.radius+$scope.half_border_thickness)+","+($scope.radius+$scope.half_border_thickness)+" A0,0,0,1,0,"+($scope.radius+$scope.half_border_thickness)+","+($scope.radius+$scope.half_border_thickness);
				
			}
		}]).value("mathLogics",new MathLogic());
