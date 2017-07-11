///<reference path="typings/index.d.ts" />
class BasicLogic{
	constructor(){}
	
	public chartMidX:number = 100;
	public chartMidY:number = 100;
	public radius:number = 100;
	//public totalSlice:number = 5;

	/*public previousSlice:JQuery;
	public currentSlice:Object;
	public nextSlice:JQuery;
	private currentSliceNum:number;*/

	public minimumSlicePercentage:number = 5;

	private numberReg = /\d/;
	/*public setCurrentSlice(_currentSlice:Object):void{
		this.currentSlice = _currentSlice;
		$(_currentSlice).attr("");
		this.currentSliceNum = this.getNumber(_currentSlice["id"]);
		let tempId = this.currentSliceNum?~-this.currentSliceNum:this.totalSlice-1;
		this.previousSlice = $("#sliceBorder"+tempId);
		tempId = (this.currentSliceNum==this.totalSlice-1)?0:-~this.currentSliceNum;
		this.nextSlice = $("#sliceBorder"+tempId);
	}*/
	/*public getNumber(_sliceName:string):number{
		return Number(_sliceName.match(this.numberReg)[0]);
	}*/
}
