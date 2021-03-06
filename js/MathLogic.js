///<reference path="BasicLogic.ts"/>
var MathLogic = (function () {
    function MathLogic() {
        this.PI = Math.PI;
        this.numberReg = /\d/;
        this.basicLogics = new BasicLogic();
    }
    MathLogic.prototype.setScope = function (scopeObj) {
        this.scopeObject = scopeObj;
    };
    MathLogic.prototype.getAngle = function (_currX, _currY, midX, midY) {
        var distX = _currX - midX;
        var distY = _currY - midY;
        return this.convertToDegree(Math.atan2(distY, distX));
    };
    MathLogic.prototype.getDistance = function (_x, _y) {
        return Math.sqrt(_x * _x + _y * _y);
    };
    MathLogic.prototype.convertToDegree = function (_radian) {
        return _radian * 180 / this.PI;
    };
    MathLogic.prototype.convertToRadian = function (_degree) {
        return _degree * this.PI / 180;
    };
    MathLogic.prototype.getmidAngle = function (_angle1, _angle2) {
        var _midAngle;
        if (_angle1 >= _angle2) {
            _midAngle = (_angle1 + (360 - _angle1 + _angle2) / 2);
            if (_midAngle > 360) {
                _midAngle = _midAngle - 360;
            }
        }
        else {
            _midAngle = (_angle1 + (_angle2 - _angle1) / 2);
        }
        return _midAngle;
    };
    MathLogic.prototype.getPositionByAngle = function (_ang, _radius, midX, midY) {
        if (_radius === void 0) { _radius = this.scopeObject.radius; }
        if (midX === void 0) { midX = this.scopeObject.chartMidX; }
        if (midY === void 0) { midY = this.scopeObject.chartMidY; }
        var _theta = this.convertToRadian(_ang);
        var leftPos = midX + Math.cos(_theta) * _radius;
        var topPos = midY + Math.sin(_theta) * _radius;
        return { left: leftPos, top: topPos };
    };
    MathLogic.prototype.getPositionByElement = function (_ele) {
        return this.getPositionByAngle(this.getAngleByElement(_ele).deg);
    };
    MathLogic.prototype.getPositionByAnglesForLabel = function (_ang1, _ang2, _textRadius, midX, midY) {
        return this.getPositionByAngle(this.getmidAngle(_ang1, _ang2), _textRadius, midX, midY);
    };
    MathLogic.prototype.getNumber = function (_sliceName) {
        return Number(_sliceName.match(this.numberReg)[0]);
    };
    MathLogic.prototype.setCurrentSlice = function (_currentSlice) {
        this.currentSlice = _currentSlice;
        this.currentSliceNum = $(this.scopeObject.directiveElement).find(".pie_slice").index($(this.currentSlice)); //this.getNumber(_currentSlice["id"]);
        var tempId = this.currentSliceNum ? ~-this.currentSliceNum : this.scopeObject.totalSlice - 1;
        this.previousSlice = $(this.scopeObject.directiveElement).find(".pie_slice").eq(tempId);
        tempId = (this.currentSliceNum == this.scopeObject.totalSlice - 1) ? 0 : -~this.currentSliceNum;
        this.nextSlice = $(this.scopeObject.directiveElement).find(".pie_slice").eq(tempId);
    };
    MathLogic.prototype.getCurrentMousePosition = function (_element, _stage) {
        try {
            _element = event;
        }
        catch (Exception) { }
        var parentOffset = _stage["offset"]();
        var relX = _element["pageX"] - parentOffset.left;
        var relY = _element["pageY"] - parentOffset.top;
        return { posX: relX, posY: relY };
    };
    MathLogic.prototype.getAngleByElement = function (_ele) {
        var el = _ele;
        var tr = el.css("-webkit-transform") || el.css("-moz-transform") || el.css("-ms-transform") || el.css("-o-transform") || '';
        var info = { rad: 0, deg: 0 };
        if (tr = tr.match('matrix\\((.*)\\)')) {
            tr = tr[1].split(',');
            if (typeof tr[0] != 'undefined' && typeof tr[1] != 'undefined') {
                info.rad = Math.atan2(tr[1], tr[0]);
                info.deg = parseFloat((info.rad * 180 / Math.PI).toFixed(1));
            }
        }
        return info;
    };
    MathLogic.prototype.getPercentageByTwoAngles = function (_ang1, _ang2) {
        return this.getPercentage(this.getDifference(_ang1, _ang2));
    };
    MathLogic.prototype.getPercentageByTwoElements = function (_ele1, _ele2) {
        return this.getPercentageByTwoAngles(this.getAngleByElement(_ele1).deg, this.getAngleByElement(_ele2).deg);
    };
    MathLogic.prototype.getAngleByPercentage = function (_percent) {
        return _percent * 360 / 100;
    };
    MathLogic.prototype.convertTo360 = function (_theta) {
        return _theta < 0 ? _theta + 360 : _theta;
    };
    MathLogic.prototype.getDifference = function (_ang1, _ang2) {
        var _diff = _ang1 - _ang2;
        return _diff < 0 ? _diff + 360 : _diff;
    };
    MathLogic.prototype.getPercentage = function (_diff_angle) {
        return Number((_diff_angle / 360 * 100).toFixed(1));
    };
    MathLogic.prototype.setisRotateClockWise = function (data) {
        this._isRotateClockWise = data;
    };
    MathLogic.prototype.getisRotateClockWise = function () {
        return this._isRotateClockWise;
    };
    return MathLogic;
}());
