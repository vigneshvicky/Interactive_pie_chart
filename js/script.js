angular
.module("chart",[])        
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
					$scope.colorsData = $scope.colors.split(",");
					//$scope.totalSlice = $scope.colorsData.length;

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
				template:"<div class=\"stagesize\">"+
							"<svg height=\"{{radius*2+border_thickness}}\" width=\"{{radius*2+border_thickness}}\">"+
                            	"<circle cx=\"{{radius+half_border_thickness}}\" cy=\"{{radius+half_border_thickness}}\" r=\"{{radius}}\" fill=\"#AABBCC\"/>"+
                            	"<g class=\"slice_line\" ng-repeat=\"myang in default_angles track by $index\" >"+
            						"<path d=\"{{generateSlice(myang,$index)}}\" stroke=\"#ffffff\" stroke-width=\"0\" fill=\"#{{colorsData[$index]}}\"></path>"+
            					"</g>"+
	                            "<g  class=\"pie_slice\" ng-repeat=\"arr in colorsData track by $index\" custAttr=\"{{attrTestFunc($index)}}\" id=\"{{mychartid}}_stick_{{$index}}\" transform =\"{{getStyle($index)}}\" fill=\"none\" style=\"cursor:pointer;\" ng-mousedown=\"startMoveSlice($event)\">"+
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
				$scope.currentChartId = mathLogics.basicLogics.getNumber($($scope.directiveElement).attr("chartid"));
				//$scope.currentChart = $($scope.directiveElement).attr("chartid");
				mathLogics.setScope ($scope);
				//console.log("Radius of current pie chart : "+$scope.radius);			
				mathLogics.basicLogics.setCurrentSlice(evt.currentTarget);

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
				var curPos = mathLogics.getCurrentMousePosition(evt,$(mathLogics.basicLogics.currentSlice).parent());
				//$("#test_dot").css({left:evt.clientX+"px",top:evt.clientY+"px"});
				currentIdNum = mathLogics.basicLogics.getNumber($(mathLogics.basicLogics.currentSlice).attr("id"));
				var curAngle = mathLogics.getAngle(curPos.posX,curPos.posY,($scope.radius+$scope.half_border_thickness),($scope.radius+$scope.half_border_thickness));
				$(mathLogics.basicLogics.currentSlice).attr({'transform': "translate("+($scope.radius+$scope.half_border_thickness)+","+($scope.radius+$scope.half_border_thickness)+") rotate("+(curAngle-0)+",0,0)"});
				//$scope.theta = 'translate(101,101) rotate('+$scope.curAngle+',0,0)';
				
				//console.log($(mathLogics.basicLogics.currentSlice).attr('transform'));


			/*currentIdNum = mathLogics.basicLogics.getNumber($(mathLogics.basicLogics.currentSlice).attr("id"));
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
			drawSlice(previousIdNum,previousElementPos,currentPosition,prev_curr_angle);*/
			}
			
			/*drawSlice = function(sliceId, fromPos, toPos, angleDiff){
				$("#slice"+sliceId).attr("d","M"+mathLogics.basicLogics.chartMidX+","+mathLogics.basicLogics.chartMidY+" L"+fromPos.left+","+fromPos.top+" A"+mathLogics.basicLogics.radius+","+mathLogics.basicLogics.radius+",0,"+(angleDiff>180?1:0)+",1,"+toPos.left+","+toPos.top+" L"+mathLogics.basicLogics.chartMidX+","+mathLogics.basicLogics.chartMidY+" A0,0,0,0,0,"+mathLogics.basicLogics.chartMidX+","+mathLogics.basicLogics.chartMidY);
			}*/	
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
