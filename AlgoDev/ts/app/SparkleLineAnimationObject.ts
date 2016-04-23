"use strict"

import StageObject = require("ext/canvas/StageObject");
import Drawing = require("ext/canvas/Drawing");
import LineAnimationObject = require("ext/canvas/animationObjects/LineAnimationObject");
import RadialGradientAnimationObject = require("ext/canvas/animationObjects/RadialGradientAnimationObject");

class SparkleLineAnimationObject extends LineAnimationObject {
    public sparkleColorStops: Array<Drawing.ColorStop>;
    public sparkleRadiusFactor: number = 1.1;
    private sparkleLight: RadialGradientAnimationObject;

    constructor(stageObject: StageObject) {
        super(stageObject);
        this.sparkleLight = new RadialGradientAnimationObject(stageObject);
        this.sparkleColorStops = new Array<Drawing.ColorStop>();
    }

    protected calculatePositions() {
        super.calculatePositions();
        this.sparkleLight.startP = this.progressP;
        this.sparkleLight.startR = this.getEndR();
        this.sparkleLight.endP = this.progressP;
        this.sparkleLight.endR = this.getEndR();
        this.sparkleLight.duration = this.duration;
        this.sparkleLight.gradientStyle = this.createRadialGradient();
    };

    public getDrawingRectangle(): Drawing.Rectangle {
        var rect: Drawing.Rectangle = super.getDrawingRectangle();
        var sprankleAddition = this.getEndR()  - this.lineWidth;
        rect.x -= sprankleAddition;
        rect.y -= sprankleAddition;
        rect.height += (2 * sprankleAddition);
        rect.width += (2 * sprankleAddition);
        return rect;
    };

    public draw() {
        super.draw();
        //var gco = this.stageObj.context.globalCompositeOperation;
        //this.stageObj.context.globalCompositeOperation = "lighter";	
        this.sparkleLight.draw();
        //this.stageObj.context.globalCompositeOperation = gco;	
    };

    public createRadialGradient(): CanvasGradient {
        var gradient = this.stageObj.context.createRadialGradient(this.sparkleLight.startP.x, this.sparkleLight.startP.y, 0,
            this.sparkleLight.startP.x, this.sparkleLight.startP.y, this.sparkleLight.endR);
        for (var i = 0; i < this.sparkleColorStops.length; i++) {
            gradient.addColorStop(this.sparkleColorStops[i].offset, this.sparkleColorStops[i].color);
        }
        return gradient;

    }

    private getEndR(): number {
        return Math.round(this.lineWidth * this.sparkleRadiusFactor);
    }
}

export = SparkleLineAnimationObject;