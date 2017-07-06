(function(){
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
					console.log(iAttributes["myvalue"]);
					$scope.directiveElement = iElement;
					$scope.colors = iAttributes.colors;
					$scope.percentage = iAttributes.percentage;
					$scope.mychartid = iAttributes.chartid;
					$scope.percent = [];
					if($scope.percentage){
						var tempArr = $scope.percentage.split(",");
						var tempVal = 0;
						for(var i=0;i<tempArr.length;i++){                                                                                                          
							$scope.percent[i] = tempVal;
							tempVal += Number(tempArr[i]*360/100);
						}
						//scope.percent = scope.percentage.split(",");
					}
					$scope.colorsData = $scope.colors.split(",");
					$scope.totalSlice = $scope.colorsData.length;
					$scope.setXPos;
				},
				template:"<div style=\"position:relative;\">"+
						"<svg height=\"202\" width=\"202\">"+
                            "<circle cx=\"101\" cy=\"101\" r=\"100\" fill=\"#AABBCC\"/>"+
                            "<g ng-repeat=\"arr in colorsData track by $index\" custAttr=\"{{sampleFunc($index)}}\" id=\"{{mychartid}}_stick_{{$index}}\" transform =\"translate(101,101) {{percent.length?someFunc(percent[$index]):getStyle($index)}}\" fill=\"none\" style=\"cursor:pointer;\" ng-mousedown=\"startMoveSlice($event)\">"+
                                "<rect x=\"0\" y=\"-5\" width=\"100\" height=\"10\" style=\"fill:blue; fill-opacity:0.1;\"></rect>"+
                                "<line stroke=\"#FFFFFF\" stroke-width=\"2\" x1=\"0\" y1=\"0\" x2=\"100\" y2=\"0\" />"+
                            "</g>"+
                            "<circle cx=\"101\" cy=\"101\" r=\"10\" fill=\"white\" />"+
                            "<circle cx=\"101\" cy=\"101\" r=\"100\" stroke-width=\"2\" stroke=\"white\" fill=\"none\"/>"+
                        "</svg>"+
        			"</div>"
			}
		}).controller("Ctrl",["$scope","mathLogics",function($scope,mathLogics){
//"M"+mathLogics.basicLogics.chartMidX+","+mathLogics.basicLogics.chartMidY+" L"+currentSlicePosition.left+","+currentSlicePosition.top+" A"+mathLogics.basicLogics.radius+","+mathLogics.basicLogics.radius+",0,"+(angleDiff>180?1:0)+",1,"+nextSlicePosition.left+","+nextSlicePosition.top+" L"+mathLogics.basicLogics.chartMidX+","+mathLogics.basicLogics.chartMidY+" A0,0,0,1,0,"+mathLogics.basicLogics.chartMidX+","+mathLogics.basicLogics.chartMidY;
			//M180,190 L316.3854163570603,127.55788116093981 A150,150,0,0,1,258.37478470739234,317.89602465311384 L180,190 A0,0,0,1,0,180,190
			//console.log($scope.colors+" : my colors");

			$scope.someFunc = function(val){				
                 return "rotate("+(val-0)+",0,0)";
            }
			$scope.getStyle = function(val){
				console.log("rotate("+(((360/$scope.totalSlice)*val)-0)+",0,0)");
				//translate(100, 100) rotate(45 0 0)
				//return { left:"100px", top:"100px",position:"absolute",width:"100px",height:"5px","background-color":"#"+color, "transform-origin":"center left",transform: "rotate("+(((360/$scope.totalSlice)*val)-90)+"deg)"};
				//$($scope.directiveElement).find("g").eq(val)..attr({'transform': 'translate(101,101) rotate('+(((360/$scope.totalSlice)*val)-0)+' 0,0)'});
				return "rotate("+(((360/$scope.totalSlice)*val)-0)+",0,0)";
			}

			$scope.sampleFunc = function(indx){
				//console.log(indx+" sample func")
				return indx+":"+$scope.totalSlice;
			}
			$scope.showValue = "Success attribute"
			$scope.getArrayValue = function(val){
				//console.log(val+" : getArrayValue")
				return val;
			}
			$scope.testingValue = "Success";
			$scope.startMoveSlice = function(evt){

				mathLogics.basicLogics.setCurrentSlice(evt.currentTarget);

				$("body").on('mousemove touchmove', mMove);
				$("body").on('mouseup touchup', stopMove);
			}
			stopMove = function(){
				$("body").off('mousemove touchmove', mMove);
				$("body").off('mouseup touchup', stopMove);
			}
			mMove = function(evt){
				var curPos = mathLogics.getCurrentMousePosition(evt,$(mathLogics.basicLogics.currentSlice).parent());
				//console.log(evt.clientX);
				//$("#test_dot").css({left:evt.clientX+"px",top:evt.clientY+"px"});
				currentIdNum = mathLogics.basicLogics.getNumber($(mathLogics.basicLogics.currentSlice).attr("id"));
				var curAngle = mathLogics.getAngle(curPos.posX,curPos.posY);
				$(mathLogics.basicLogics.currentSlice).attr({'transform': 'translate(101,101) rotate('+curAngle+',0,0)'});

				
			}
			/*$scope.sampleFunc = function(indx){
				console.log(indx+" sample func")
				$($scope.directiveElement).find("g").eq(indx).attr({'transform': 'translate(101,101) rotate('+(((360/$scope.totalSlice)*indx)-0)+' 0,0)'});
				return indx+":"+indx;
			}*/
			
			$scope.get_imageURL = function(){
				return $scope.imageURL;
			}
			$scope.getAngle = function(val){
				console.log(val);
				return ((360/$scope.totalSlice)*val)-90;
			}
			$scope.getAngle_prev = function(val){
				return 0;//((360/$scope.totalSlice)*((val-1)<0?4:(val-1)));
			}
			$scope.getXPos = function(val){
				return Math.sin((((360/$scope.totalSlice)*val)-65)*Math.PI/180)*60;
			}
			$scope.getYPos = function(val){
				return Math.cos((((360/$scope.totalSlice)*val)-65)*Math.PI/180)*60;
			}
			$scope.getPersentage = function(val){
				return "20%";
			}
			$scope.clickedMe = function(){
				$scope.mydata.push("ABCABC");
			}
			$scope.addSlice = function(){
				//$($scope.directiveElement).find("g").eq(0).css("display","none");
				$scope.colorsData.push("FFFF00");
				$scope.totalSlice = $scope.colorsData.length;
			}
		}]).value("mathLogics",new MathLogic());
	})();