"use strict"

import StageObject = require("ext/canvas/StageObject");
import Drawing = require("ext/canvas/Drawing");
import AnimationObjectBase = require("ext/canvas/animation/animationObjects/AnimationObjectBase");

class GradientFillAnimationObject extends AnimationObjectBase {
    public stageObj: StageObject; 

    // public properties
    public fillStyle = new Drawing.RgbaColor(0, 0, 0, 1);
    public startP = new Drawing.Point(0, 0);
    public endP = new Drawing.Point(0, 0);
    public distance = 1;
    public progressP = new Drawing.Point(this.startP.x, this.startP.y);

    constructor(stageObject: StageObject) {
        super(stageObject);
    }

    protected calculatePositions() {
        if (this.progress < 0 || this.progress > 1) {
            throw "Progress must be between 0 and 1";
        }
    }

    public getDrawingRectangle() {
        var drawingOrigin = new Drawing.Point(0, 0);
        var width = 0;
        var height = 0;

        var maxX = Math.max(this.startP.x, this.endP.x);
        var maxY = Math.max(this.startP.y, this.endP.y);
        var minX = Math.min(this.startP.x, this.endP.x);
        var minY = Math.min(this.startP.y, this.endP.y);

        if (maxX - minX > 0) {
            drawingOrigin.x = minX;
            width = maxX - minX;
        }

        if (maxY - minY > 0) {
            drawingOrigin.y = minY;
            height = maxY - minY;
        }

        if (width > 0 && height > 0) {
            return new Drawing.Rectangle(drawingOrigin.x, drawingOrigin.y, width, height);
        }
        return null;
    }

    public draw() {
        this.stageObj.context.save();
        if (this.progress + this.distance >= 1) {
            this.stageObj.context.fillStyle = this.fillStyle.toString();
        }
        else {
            var gradient = this.stageObj.context.createLinearGradient(this.startP.x, this.startP.y,
                this.endP.x, this.endP.y);
            gradient.addColorStop(0, this.fillStyle.toString());
            gradient.addColorStop(this.progress, this.fillStyle.toString());
            gradient.addColorStop(this.progress + this.distance,
                (new Drawing.RgbaColor(this.fillStyle.r, this.fillStyle.g, this.fillStyle.b, 0)).toString());
            this.stageObj.context.fillStyle = gradient;
        }
        this.stageObj.context.fill();
        this.stageObj.context.restore();
    }
}

export = GradientFillAnimationObject;