"use strict"

import StageObject = require("ext/canvas/StageObject");
import Drawing = require("ext/canvas/Drawing");
import AnimationObjectBase = require("ext/canvas/animationObjects/AnimationObjectBase");

class RadialGradientAnimationObject extends AnimationObjectBase {
    public stageObj: StageObject;

    public fillStyle = new Drawing.RgbaColor(0, 0, 0, 1);
    public startP = new Drawing.Point(0, 0);
    public startR: number = 0;
    public startAngle: number = 0;
    public endP = new Drawing.Point(0, 0);
    public endR: number = 0;
    public endAngle: number = Math.PI * 2;
    public progressP = new Drawing.Point(this.startP.x, this.startP.y);
    public progressR: number = 1;
    public progressAngle: number = 0;

    constructor(stageObject: StageObject) {
        super(stageObject);
    }

    protected calculatePositions() {
        if (this.progress < 0 || this.progress > 1) {
            throw "Progress must be between 0 and 1";
        }
        this.progressP.x = this.startP.x + ((this.endP.x - this.startP.x) * this.progress);
        this.progressP.y = this.startP.y + ((this.endP.y - this.startP.y) * this.progress);
        this.progressR = this.startR + ((this.endR - this.startR) * this.progress);
        this.progressAngle = this.startAngle + ((this.endAngle - this.startAngle) * this.progress);
    };

    public getDrawingRectangle() {
        var origin = new Drawing.Point(0, 0);
        var width = 0;
        var height = 0;


        var minX = Math.min(this.startP.x, this.endP.x);
        var minY = Math.min(this.startP.y, this.endP.y);
        var maxX = Math.max(this.startP.x, this.endP.x);
        var maxY = Math.max(this.startP.y, this.endP.y);
        var maxR = Math.max(this.startR, this.endR);

        if (maxX - minX > 0) {
            origin.x = minX - maxR;
            width = (maxX - minX) + (2 * maxR);
        }

        if (maxY - minY > 0) {
            origin.y = minY + maxR;
            height = (maxY - minY) + (2 * maxR);
        }

        if (width > 0 && height > 0) {
            return new Drawing.Rectangle(origin.x, origin.y, width, height);
        }
        return null;
    };

    public draw() {
        this.stageObj.context.save();
        this.stageObj.context.beginPath();
        this.stageObj.context.arc(this.progressP.x, this.progressP.y, this.progressR, 0, Math.PI * 2, false);
        this.stageObj.context.fillStyle = this.fillStyle;
        this.stageObj.context.fill();
        this.stageObj.context.restore();
    };

}

export = RadialGradientAnimationObject;