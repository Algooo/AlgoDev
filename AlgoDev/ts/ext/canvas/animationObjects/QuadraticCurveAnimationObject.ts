"use strict"

import StageObject = require("ext/canvas/StageObject");
import Drawing = require("ext/canvas/Drawing");
import AnimationObjectBase = require("ext/canvas/animationObjects/AnimationObjectBase");

class QuadraticCurveAnimationObject extends AnimationObjectBase {
    public stageObj: StageObject;    

    // public properties
    public strokeStyle = new Drawing.RgbaColor(0, 0, 0, 1);
    public lineWidth = 10;
    public lineCap = "butt";
    public startP = new Drawing.Point(0, 0);
    public endP = new Drawing.Point(0, 0);
    public controlP = new Drawing.Point(0, 0);

    public curControlP = new Drawing.Point(this.startP.x, this.startP.y);
    public curEndP = new Drawing.Point(this.controlP.x, this.controlP.y);
    public progressP = new Drawing.Point(this.startP.x, this.startP.y);

    constructor(stageObject: StageObject) {
        super(stageObject);
    }

    protected calculatePositions() {
        if (this.progress < 0 || this.progress > 1) {
            throw "Progress must be between 0 and 1";
        }
        this.curControlP.x = this.startP.x + (this.controlP.x - this.startP.x) * this.progress;
        this.curControlP.y = this.startP.y + (this.controlP.y - this.startP.y) * this.progress;
        this.curEndP.x = this.controlP.x + (this.endP.x - this.controlP.x) * this.progress;
        this.curEndP.y = this.controlP.y + (this.endP.y - this.controlP.y) * this.progress;
        this.progressP.x = this.curControlP.x + (this.curEndP.x - this.curControlP.x) * this.progress;
        this.progressP.y = this.curControlP.y + (this.curEndP.y - this.curControlP.y) * this.progress;
    };

    public getDrawingRectangle() {
        var drawingOrigin = new Drawing.Point(0, 0);
        var width = 0;
        var height = 0;

        var maxX = Math.max(this.startP.x, this.endP.x, this.controlP.x);
        var maxY = Math.max(this.startP.y, this.endP.y, this.controlP.y);
        var minX = Math.min(this.startP.x, this.endP.x, this.controlP.x);
        var minY = Math.min(this.startP.y, this.endP.y, this.controlP.y);

        if (maxX - minX > 0) {
            drawingOrigin.x = minX;
            width = maxX - minX;
        }

        if (maxY - minY > 0) {
            drawingOrigin.y = minY;
            height = maxY - minY;
        }

        if (width > 0 && height > 0) {
            drawingOrigin.x -= this.lineWidth;
            drawingOrigin.y -= this.lineWidth;
            width += this.lineWidth;
            height += this.lineWidth;
            return new Drawing.Rectangle(drawingOrigin.x, drawingOrigin.y, width, height);
        }
        return null;
    };

    public draw() {
        this.stageObj.context.save();
        this.stageObj.context.beginPath();
        this.stageObj.context.lineWidth = this.lineWidth;
        this.stageObj.context.lineCap = this.lineCap;
        this.stageObj.context.strokeStyle = this.strokeStyle.toString();
        this.stageObj.context.moveTo(this.startP.x, this.startP.y);
        this.calculatePositions();
        this.stageObj.context.quadraticCurveTo(this.curControlP.x, this.curControlP.y, this.progressP.x, this.progressP.y);
        this.stageObj.context.stroke();
        this.stageObj.context.restore();
    };
}
export = QuadraticCurveAnimationObject;