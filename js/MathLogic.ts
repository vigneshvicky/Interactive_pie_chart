///<reference path="BasicLogic.ts"/>
class MathLogic{
	private PI = Math.PI;
	private _isRotateClockWise:boolean;
	public scopeObject:any;
	
	private currentSliceNum:number;
	public previousSlice:JQuery;
	public currentSlice:Object;
	public nextSlice:JQuery;
	public totalSlice:number;
	private numberReg = /\d/;

	public basicLogics:BasicLogic = new BasicLogic();
	constructor(){}
	public setScope(scopeObj:any){
		this.scopeObject = scopeObj;		
	}
	public getAngle(_currX:number,_currY:number,midX:number,midY:number):number{
		let distX = _currX-midX;
		let distY = _currY-midY;
		return this.convertToDegree(Math.atan2(distY,distX));
	}
	
	public getDistance(_x:number,_y:number):number{
		return Math.sqrt(_x*_x+_y*_y);
	}
	private convertToDegree(_radian:number):number{
		return _radian*180/this.PI;
	}
	private convertToRadian(_degree:number):number{
		return _degree*this.PI/180;
	}
	public getmidAngle(_angle1:number,_angle2:number):number{
		let _midAngle;
		if(_angle1>=_angle2){
			_midAngle = (_angle1+(360-_angle1+_angle2)/2);
			if(_midAngle>360){
				_midAngle = _midAngle-360;
			}
		}else{
			_midAngle = (_angle1+(_angle2-_angle1)/2);
		}

		return _midAngle;
	}	
	public getPositionByAngle(_ang:number, _radius=this.scopeObject.radius,midX:number=this.scopeObject.chartMidX,midY:number=this.scopeObject.chartMidY):Object{		
		let _theta = this.convertToRadian(_ang);
		let leftPos = midX+Math.cos(_theta)*_radius;
		let topPos = midY+Math.sin(_theta)*_radius;

		return {left:leftPos,top:topPos};
	}
	public getPositionByElement(_ele:JQuery):Object{
		return this.getPositionByAngle(this.getAngleByElement(_ele).deg);
	}
	public getPositionByAnglesForLabel(_ang1:number,_ang2:number, _textRadius:number):Object{
		return this.getPositionByAngle(this.getmidAngle(_ang1,_ang2),_textRadius);
	}
	public getNumber(_sliceName:string):number{
		return Number(_sliceName.match(this.numberReg)[0]);
	}
	
	public setCurrentSlice(_currentSlice:Object):void{
		this.currentSlice = _currentSlice;		
		this.currentSliceNum = $(this.scopeObject.directiveElement).find(".pie_slice").index( $(this.currentSlice));//this.getNumber(_currentSlice["id"]);
		let tempId = this.currentSliceNum?~-this.currentSliceNum:this.scopeObject.totalSlice-1;
		this.previousSlice = $(this.scopeObject.directiveElement).find(".pie_slice").eq(tempId);
		tempId = (this.currentSliceNum==this.scopeObject.totalSlice-1)?0:-~this.currentSliceNum;
		this.nextSlice = $(this.scopeObject.directiveElement).find(".pie_slice").eq(tempId);
	}

	public getCurrentMousePosition(_element:any,_stage:Object):Object{
		try{
			_element = event;
		}catch(Exception){}
		
		let parentOffset = _stage["offset"]();
		let relX = _element["pageX"] - parentOffset.left;
		let relY = _element["pageY"] - parentOffset.top;
		return {posX:relX,posY:relY};
	}
	public getAngleByElement(_ele:JQuery):any{
		let el:JQuery = _ele;
        let tr:any = el.css("-webkit-transform") || el.css("-moz-transform") || el.css("-ms-transform") || el.css("-o-transform") || '';
        let info:any = {rad: 0, deg: 0}
	    if (tr = tr.match('matrix\\((.*)\\)')) {
	        tr = tr[1].split(',');
	        if(typeof tr[0] != 'undefined' && typeof tr[1] != 'undefined') {
	            info.rad = Math.atan2(tr[1], tr[0]);
	            info.deg = parseFloat((info.rad * 180 / Math.PI).toFixed(1));
	        }
	    }
		/*let tr:any = Number(el.attr("transform").split("rotate(")[1].split(",")[0]);
		tr = tr<-180?()
		let info:any = {rad: 0, deg: 0}
		info.deg = Number(tr);

		console.log(tr+" : "+el.attr("id"));*/
    	return info;
	}

	public getPercentageByTwoAngles(_ang1:number,_ang2:number):number{
		return this.getPercentage(this.getDifference(_ang1,_ang2));
	}
	public getPercentageByTwoElements(_ele1:JQuery,_ele2:JQuery):number{
		return this.getPercentageByTwoAngles(this.getAngleByElement(_ele1).deg,this.getAngleByElement(_ele2).deg);
	}
	public getAngleByPercentage(_percent:number):number{
		return _percent*360/100;
	}
	public convertTo360(_theta:number):number{
		return _theta<0?_theta+360:_theta;
	}

	public getDifference(_ang1:number,_ang2:number){
		let _diff:number = _ang1 - _ang2;
		return _diff<0?_diff+360:_diff;
	}
	public getPercentage(_diff_angle:number):number{
		return Number((_diff_angle/360*100).toFixed(1));
	}	 
	public setisRotateClockWise(data:boolean){
		this._isRotateClockWise = data;
	}
	public getisRotateClockWise():boolean{
		return this._isRotateClockWise;
	}
}
