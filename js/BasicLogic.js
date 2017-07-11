///<reference path="typings/index.d.ts" />
var BasicLogic = (function () {
    function BasicLogic() {
        this.chartMidX = 100;
        this.chartMidY = 100;
        this.radius = 100;
        //public totalSlice:number = 5;
        /*public previousSlice:JQuery;
        public currentSlice:Object;
        public nextSlice:JQuery;
        private currentSliceNum:number;*/
        this.minimumSlicePercentage = 5;
        this.numberReg = /\d/;
    }
    return BasicLogic;
}());
