var app = angular
.module("chart",["localStorage"])        
    .directive("pieChart",function(){
        return{
            restrict:"E",
            scope:true,
            controller:"Ctrl",
                link:function($scope,iElement,iAttributes, ctrl){

                    $scope.directiveElement = iElement;
                    $scope.radius = Number(iAttributes.radius);
                    $scope.border_thickness = 2;
                    $scope.half_border_thickness = $scope.border_thickness/2;
                    $scope.colors = iAttributes.colors;
                    $scope.percentage = iAttributes.percentage;
                    $scope.mychartid = iAttributes.chartid;
                    $scope.percent = [];
                    $scope.default_angles = iAttributes.angles.split(",");
                    $scope.defaultTextRadius = $scope.radius-25;
                    $scope.colorsData = $scope.colors.split(",");

                    $scope.totalPIEAngle = 360;
                    $scope.doInitialSetup();
                    if($scope.percentage){
                        /*var tempArr = $scope.percentage.split(",");
                        var tempVal = 0;
                        var defaultVal = 0;//49.95619931;
                        for(var i=0;i<tempArr.length;i++){                                                                                                          
                            $scope.default_angles[i] = defaultVal+tempVal;
                            console.log($scope.default_angles[i]);
                            tempVal += Number(tempArr[i]*360/100);
                        }*/
                        for(var i=0;i<$scope.totalSlice;i++){
                            $scope.default_angles[i] = Number($scope.default_angles[i]);
                        }
                    }else{                      
                        for(var i=0;i<$scope.totalSlice;i++){
                            $scope.default_angles[i] = (360/$scope.totalSlice)*i;
                        }

                    }
                },
                template:"<svg height=\"{{radius*2+border_thickness}}\" width=\"{{radius*2+border_thickness}}\">"+
                            "<circle cx=\"{{radius+half_border_thickness}}\" cy=\"{{radius+half_border_thickness}}\" r=\"{{radius}}\" fill=\"#AABBCC\"/>"+
                            "<g class=\"slice_line\" ng-repeat=\"myang in default_angles track by $index\" >"+
                                "<path stroke=\"#ffffff\" stroke-width=\"0\" fill=\"#{{colorsData[$index]}}\"></path>"+                                    
                                "<text text-anchor=\"middle\" dy=\"6\" font-family=\"Arial\" font-size=\"16\" fill=\"#ffffff\"></text>"+
                            "</g>"+
                            "<g class=\"pie_slice\" ng-repeat=\"arr in colorsData track by $index\" fill=\"none\" style=\"cursor:pointer; display:none;\" ng-touchstart=\"startMoveSlice($event)\" ng-mousedown=\"startMoveSlice($event)\">"+
                                "<rect x=\"0\" y=\"-5\" width=\"{{radius}}\" height=\"10\" style=\"fill:blue; fill-opacity:0;\"></rect>"+
                                "<line stroke=\"#FFFFFF\" stroke-width=\"2\" x1=\"0\" y1=\"0\" x2=\"{{radius}}\" y2=\"0\"/>"+                                   
                            "</g>"+                                                      
                            "<circle cx=\"{{radius+half_border_thickness}}\" cy=\"{{radius+half_border_thickness}}\" r=\"10\" fill=\"white\"/>"+
                            "<circle cx=\"{{radius+half_border_thickness}}\" cy=\"{{radius+half_border_thickness}}\" r=\"{{radius}}\" stroke-width=\"2\" stroke=\"white\" fill=\"none\"/>"+
                        "</svg>"
            }
        }).controller("Ctrl",["$scope","mathLogics","$document","$rootScope","$timeout","$compile",function($scope,mathLogics,$document,$rootScope,$timeout,$compile){
            angular.element(document).ready(function() {
                var scope = angular.element($scope.directiveElement).scope();
                scope.$apply(function() {
                    scope.getStyle();
                    scope.updateText();
                })
            });
            var previousAngle = 0;
            $scope.doInitialSetup = function(){
                $scope.totalSlice = $scope.colorsData.length;
                $scope.chartMidX  = $scope.radius+$scope.half_border_thickness;
                $scope.chartMidY = $scope.radius+$scope.half_border_thickness;
                
            }
            $scope.getStyle = function(){
                //console.log($rootScope.default_angles);
                for(var i=0;i<$scope.totalSlice;i++){
                    $($scope.directiveElement).find(".slice_line").eq(i).find("path").attr("d",$scope.generateSlice($scope.default_angles[i],i));
                    $scope.setTransform(i,$scope.default_angles[i]);
                    $($scope.directiveElement).find(".pie_slice").eq(i).css("display","block");
                }
            }
            $scope.updateText = function(){

                for(var i=0; i<$scope.totalSlice; i++){
                    var pos = mathLogics.getPositionByAnglesForLabel($scope.default_angles[i],$scope.default_angles[i==($scope.totalSlice-1)?0:(i+1)],$scope.defaultTextRadius,$scope.radius,$scope.radius);
                    $($scope.directiveElement).find(".slice_line").eq(i).find("text").attr({x:pos.left,y:pos.top});
                    $($scope.directiveElement).find(".slice_line").eq(i).find("text").text(Math.round(mathLogics.getPercentageByTwoAngles($scope.default_angles[i==($scope.totalSlice-1)?0:(i+1)],$scope.default_angles[i]))+"%");
                }
            }
            $scope.setTransform = function(id,angle){
                var ang_rad = mathLogics.convertToRadian(angle);
                var cos = Math.cos(ang_rad);
                var sin = Math.sin(ang_rad);
                var rotate_value = "matrix("+cos+","+sin+","+(-sin)+","+cos+","+($scope.radius+$scope.half_border_thickness)+","+($scope.radius+$scope.half_border_thickness)+")";
                $($scope.directiveElement).find(".pie_slice").eq(id).css("transform",rotate_value);
                $($scope.directiveElement).find(".pie_slice").eq(id).attr("matrix",rotate_value);
            }

            $scope.startMoveSlice = function(evt){
                mathLogics.setScope ($scope);
                mathLogics.setCurrentSlice(evt.currentTarget);

                $("#pie_chart"+$($scope.directiveElement).attr("id").match(/\d/)).on('mousemove touchmove', mMove_javascript);
                $("#pie_chart"+$($scope.directiveElement).attr("id").match(/\d/)).on('mouseup touchend', stopMove_javascript);
            }
            function mMove_javascript(evt){
                var scope = angular.element($($scope.directiveElement)).scope();
                scope.mMove(evt);
            }
            function stopMove_javascript(){
                $("#pie_chart"+$($scope.directiveElement).attr("id").match(/\d/)).off('mousemove touchmove', mMove_javascript);
                $("#pie_chart"+$($scope.directiveElement).attr("id").match(/\d/)).off('mouseup touchend', stopMove_javascript);
                $scope.saveToLocalStorage();
            }
            $scope.saveToLocalStorage = function(){
                var allDatas = [];
                var chartId = Number($scope.directiveElement.attr("chartid").match(/\d+/)[0]);
                for(var i=0;i<$scope.totalSlice;i++){
                    allDatas[i] = {content:$("#legend_"+chartId).find(".legendDataClass").eq(i).text(),angles:mathLogics.getAngleByElement($($scope.directiveElement).find(".pie_slice").eq(i)).deg,percentage:mathLogics.getPercentageByTwoElements($($scope.directiveElement).find(".pie_slice").eq(i==($scope.totalSlice-1)?0:(i+1)),$($scope.directiveElement).find(".pie_slice").eq(i)),colors:$($scope.directiveElement).find(".slice_line").eq(i).find("path").attr("fill").replace(/#/,"")};
                }
                console.log("saveToLocalStorage");
                console.log(allCurrentData[chartId][0].additional_color);
                allDatas[0].additional_color = allCurrentData[chartId][0].additional_color;
                allDatas[0].additional_legend = allCurrentData[chartId][0].additional_legend;
                $scope.saveState(chartId,allDatas);
            }
            $scope.mMove = function(evt){
                var curPos = mathLogics.getCurrentMousePosition(evt,$(mathLogics.currentSlice).parent());
                currentIdNum = $($scope.directiveElement).find(".pie_slice").index(mathLogics.currentSlice);
                var curAngle = mathLogics.getAngle(curPos.posX,curPos.posY,($scope.radius+$scope.half_border_thickness),($scope.radius+$scope.half_border_thickness));
                $scope.setTransform(currentIdNum,curAngle);
            
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

                var pos1 = mathLogics.getPositionByAnglesForLabel(curAngle,myValNext,$scope.defaultTextRadius,$scope.radius,$scope.radius);         
                var pos2 = mathLogics.getPositionByAnglesForLabel(myValPrev,curAngle,$scope.defaultTextRadius,$scope.radius,$scope.radius);

                $scope.drawSlice(currentIdNum,currentPosition,nextElementPos,curr_next_angle);
                $scope.drawSlice(previousIdNum,previousElementPos,currentPosition,prev_curr_angle);

                if(mathLogics.getPercentage(curr_next_angle)<=5||mathLogics.getPercentage(prev_curr_angle)<=5){
                    if(mathLogics.isRotateClockWise){
                        $scope.checkClockwise_MinAngle(currentIdNum);
                    }else{
                        $scope.checkAnticlockWise_MinAngle(currentIdNum);
                    }
                }
                
                $($scope.directiveElement).find(".slice_line").eq(currentIdNum).find("text").attr({x:pos1.left,y:pos1.top});
                $($scope.directiveElement).find(".slice_line").eq(currentIdNum).find("text").text(Math.round(mathLogics.getPercentageByTwoElements($($scope.directiveElement).find(".pie_slice").eq(nextIdNum),$($scope.directiveElement).find(".pie_slice").eq(currentIdNum)))+"%");
                $($scope.directiveElement).find(".slice_line").eq(previousIdNum).find("text").attr({x:pos2.left,y:pos2.top});
                $($scope.directiveElement).find(".slice_line").eq(previousIdNum).find("text").text(Math.round(mathLogics.getPercentageByTwoElements($($scope.directiveElement).find(".pie_slice").eq(currentIdNum),$($scope.directiveElement).find(".pie_slice").eq(previousIdNum)))+"%");
                //console.log(mathLogics.getPercentageByTwoElements($($scope.directiveElement).find(".pie_slice").eq(i),$($scope.directiveElement).find(".pie_slice").eq(previousIdNum)));
            }
            $scope.checkClockwise_MinAngle = function(currId){
                var nextIdNum = currId == (~-$scope.totalSlice)?0:currId+1;
                if(mathLogics.getPercentageByTwoElements($($scope.directiveElement).find(".pie_slice").eq(nextIdNum),$($scope.directiveElement).find(".pie_slice").eq(currId))<=5){
                    var currentAng = mathLogics.getAngleByElement($($scope.directiveElement).find(".pie_slice").eq(currId)).deg;
                    var nextAng = currentAng+18;

                    $scope.setTransform(nextIdNum,nextAng);

                    currentElementPos = mathLogics.getPositionByAngle(currentAng);
                    
                    nextElementPos = mathLogics.getPositionByAngle(nextAng);
                    curr_next_angle = mathLogics.getDifference(nextAng,currentAng);
                    
                    $scope.drawSlice(currId,currentElementPos,nextElementPos,curr_next_angle);
                    
                    var after_NextIdNum = nextIdNum == (~-$scope.totalSlice)?0:nextIdNum+1;
                    var after_NextAng;
                    if(mathLogics.getPercentageByTwoElements($($scope.directiveElement).find(".pie_slice").eq(after_NextIdNum),$($scope.directiveElement).find(".pie_slice").eq(nextIdNum))<=5){
                        after_NextAng = nextAng+18;
                        $scope.setTransform(after_NextIdNum,after_NextAng);
                    }else{
                        after_NextAng = mathLogics.getAngleByElement($($scope.directiveElement).find(".pie_slice").eq(after_NextIdNum)).deg;
                    }
                    var after_NextPos = mathLogics.getPositionByAngle(after_NextAng);
                    
                    var next_afterNext_angle_diff = mathLogics.getDifference(mathLogics.getAngleByElement($($scope.directiveElement).find(".pie_slice").eq(after_NextIdNum)).deg,nextAng);
                    
                    $scope.drawSlice(nextIdNum,nextElementPos,after_NextPos,next_afterNext_angle_diff);
                    
                    var nextAfterNext_text_pos = mathLogics.getPositionByAnglesForLabel(nextAng,after_NextAng,$scope.defaultTextRadius,$scope.radius,$scope.radius);
                    
                    $($scope.directiveElement).find(".slice_line").eq(nextIdNum).find("text").attr({x:nextAfterNext_text_pos.left,y:nextAfterNext_text_pos.top});
                    $($scope.directiveElement).find(".slice_line").eq(nextIdNum).find("text").text(Math.round(mathLogics.getPercentage(next_afterNext_angle_diff))+"%");

                    $scope.checkClockwise_MinAngle(nextIdNum);
                }
            }
            $scope.checkAnticlockWise_MinAngle = function (currId){
            //From previous to current slice drawing
            var prevIdNum = currId?currId-1:~-$scope.totalSlice;    
            if(mathLogics.getPercentageByTwoElements($($scope.directiveElement).find(".pie_slice").eq(currId),$($scope.directiveElement).find(".pie_slice").eq(prevIdNum))<=5){                     
                var currentAng = mathLogics.getAngleByElement($($scope.directiveElement).find(".pie_slice").eq(currId)).deg;
                var prevAng = currentAng-18;
                $scope.setTransform(prevIdNum,prevAng);

                currentElementPos = mathLogics.getPositionByAngle(currentAng);
                prevElementPos = mathLogics.getPositionByAngle(prevAng);
                curr_prev_angle = mathLogics.getDifference(currentAng,prevAng);
                var prevId = currId?currId-1:~-$scope.totalSlice;
                $scope.drawSlice(prevId,prevElementPos,currentElementPos,curr_prev_angle);              
                
                var before_PrevIdNum = prevIdNum?prevIdNum-1:(~-$scope.totalSlice);
                var before_PrevPos = mathLogics.getPositionByElement($($scope.directiveElement).find(".pie_slice").eq(before_PrevIdNum));
                var prev_beforePrev_angle;
                if(mathLogics.getPercentageByTwoElements($($scope.directiveElement).find(".pie_slice").eq(prevIdNum),$($scope.directiveElement).find(".pie_slice").eq(before_PrevIdNum))<=5){
                    prev_beforePrev_angle = prevAng-18;
                    $scope.setTransform(before_PrevIdNum,prev_beforePrev_angle);                    
                }else{
                    prev_beforePrev_angle = mathLogics.getAngleByElement($($scope.directiveElement).find(".pie_slice").eq(before_PrevIdNum)).deg;
                }           
                
                var prev_beforePrev_angle_diff = mathLogics.getDifference(prevAng, prev_beforePrev_angle);
                
                prevId = prevIdNum?prevIdNum-1:~-$scope.totalSlice;
                $scope.drawSlice(prevId,before_PrevPos,prevElementPos,prev_beforePrev_angle_diff);
                
                var prevBeforePrev_text_pos = mathLogics.getPositionByAnglesForLabel(prev_beforePrev_angle,prevAng,$scope.defaultTextRadius,$scope.radius,$scope.radius);
                $($scope.directiveElement).find(".slice_line").eq(prevId).find("text").attr({x:prevBeforePrev_text_pos.left,y:prevBeforePrev_text_pos.top});
                $($scope.directiveElement).find(".slice_line").eq(prevId).find("text").text(Math.round(mathLogics.getPercentage(prev_beforePrev_angle_diff))+"%");

                $scope.checkAnticlockWise_MinAngle(prevIdNum);
                
            }
        }
            $scope.drawSlice = function(sliceId, fromPos, toPos, angleDiff){
                $($scope.directiveElement).find(".slice_line").eq(sliceId).find("path").attr("d","M"+$scope.chartMidX+","+$scope.chartMidY+" L"+fromPos.left+","+fromPos.top+" A"+$scope.radius+","+$scope.radius+",0,"+(angleDiff>180?1:0)+",1,"+toPos.left+","+toPos.top+" L"+$scope.chartMidX+","+$scope.chartMidY+" A0,0,0,0,0,"+$scope.chartMidX+","+$scope.chartMidY);
            }   
            $scope.addSlice = function(colorCode,legend_content){
                $scope.addLegend(colorCode,legend_content);               
                $scope.colorsData.push(colorCode); 
                $scope.resetAll($scope.colorsData);
            }
            $scope.resetLegend = function(legendId){
                $("#legend_"+legendId).append($compile('<div edit-icon="" remove-me="doBlur(event)" start-edit="doEdit(event)" style="height:35px;" color-code="#'+colorCode+'" legend-data="'+legend_content+'"></div>')( $scope ));
            }
            $scope.addLegend = function(colorCode,legend_content){
                $("#legend_"+$($scope.directiveElement).attr("id").match(/\d/)).append($compile('<div edit-icon="" remove-me="doBlur(event)" start-edit="doEdit(event)" style="height:35px;" color-code="#'+colorCode+'" legend-data="'+legend_content+'"></div>')( $scope ));
            }
            $scope.removeSlice = function(index){
                var splicecolor = $scope.colorsData.splice(index, 1);
                $scope.resetAll($scope.colorsData);
            }
            $scope.generateSlice = function(curAngle,id){
                var nextId = (id==($scope.totalSlice-1))?-1:id;
                var currentSlicePosition = mathLogics.getPositionByAngle(curAngle,$scope.radius,($scope.radius+$scope.half_border_thickness),($scope.radius+$scope.half_border_thickness));
                var nextSlicePosition = mathLogics.getPositionByAngle($scope.default_angles[nextId+1],$scope.radius,($scope.radius+$scope.half_border_thickness),($scope.radius+$scope.half_border_thickness));
                var angleDiff = mathLogics.getDifference($scope.default_angles[id==($scope.totalSlice-1)?0:(id+1)],curAngle);
                return "M"+($scope.radius+$scope.half_border_thickness)+","+($scope.radius+$scope.half_border_thickness)+" L"+currentSlicePosition.left+","+currentSlicePosition.top+" A"+$scope.radius+","+$scope.radius+",0,"+(angleDiff>180?1:0)+",1,"+nextSlicePosition.left+","+nextSlicePosition.top+" L"+($scope.radius+$scope.half_border_thickness)+","+($scope.radius+$scope.half_border_thickness)+" A0,0,0,1,0,"+($scope.radius+$scope.half_border_thickness)+","+($scope.radius+$scope.half_border_thickness);
                
            }
            $scope.resetAll = function(colorCode){
                $scope.colorsData = colorCode;  
                $scope.default_angles = [];
                $scope.doInitialSetup();
                for(var i=0;i<$scope.totalSlice;i++){
                    $scope.default_angles[i] = -90+(360/$scope.totalSlice)*i;
                }

                $timeout(function(){$scope.updateText();$scope.getStyle();$scope.saveToLocalStorage();},10);
            }
            
}]).value("mathLogics",new MathLogic());

app.directive("editIcon",[function(){    
    return{
        controller:"icons",
        scope:{
            'startEdit':'&','colorCode':'@','legendData':'@','removeMe':'&'
            },
        template:'<img src="images/edit.png" alt="Edit" ng-mousedown="isEdit=!isEdit; doEdit($event);" style="cursor:pointer;" />&nbsp;&nbsp;<div ng-click="removeMe($event)" style="width:25px; height:25px; background-image:url(images/delete.png); display:inline-flex; cursor:pointer;"></div>&nbsp;&nbsp;<div style="width:100%; display:inline; position:relative; top:-7px;"><div class="circle" style="background-color:{{colorCode}};"></div> <div class="legendDataClass" ng-bind="legendData" ng-hide="isEdit">{{legendData}}</div><input ng-show="isEdit" ng-blur="isEdit=false; doBlur($event)" type="text" maxlength="30" style="position:relative; top:-2px; width:160px;" ng-model="legendData"></div>'
    }
}]).controller("icons",["$scope","$timeout",function($scope,$timeout){
        $scope.doEdit = function(event){
            setTimeout(function(){
                $(event.target).parent().find("input").focus().selectRange(0,$(event.target).parent().find(".legendDataClass").text().length);
            },50);
        }
        $scope.doBlur = function(event){            
            storeLegend(Number($($(event.target).parent().parent().parent()).attr("id").match(/\d/)[0]),$($(event.target).parent()).index());
        }
        $scope.removeMe = function(event){
            var id = Number($($(event.target).parent().parent().parent()).attr("id").match(/\d/)[0]);
        	if(allCurrentData[id].length>5){
                doRemoveSlice(id,$($(event.target).parent()).index(),rgb2hex($(event.target).parent().find(".circle").css("background-color")),$(event.target).parent().find(".legendDataClass").text());
                $(event.target).parent().remove();
            }else{
                alert("Min reached");
            }
        }
}]);
