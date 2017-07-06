///<reference path="typings/index.d.ts" />
var BasicLogic = (function () {
    function BasicLogic() {
        this.chartMidX = 100;
        this.chartMidY = 100;
        this.radius = 100;
        this.totalSlice = 5;
        this.minimumSlicePercentage = 5;
        this.numberReg = /\d/;
    }
    BasicLogic.prototype.setCurrentSlice = function (_currentSlice) {
        this.currentSlice = _currentSlice;
        this.currentSliceNum = this.getNumber(_currentSlice["id"]);
        var tempId = this.currentSliceNum ? ~-this.currentSliceNum : this.totalSlice - 1;
        this.previousSlice = $("#sliceBorder" + tempId);
        tempId = (this.currentSliceNum == this.totalSlice - 1) ? 0 : -~this.currentSliceNum;
        this.nextSlice = $("#sliceBorder" + tempId);
    };
    BasicLogic.prototype.getNumber = function (_sliceName) {
        return Number(_sliceName.match(this.numberReg)[0]);
    };
    return BasicLogic;
})();
