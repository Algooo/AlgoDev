"use strict"

import StageObject = require("ext/canvas/StageObject");
import Drawing = require("ext/canvas/Drawing");


abstract class AnimationObjectBase {
    public stageObj: StageObject;

    public progress: number = 0; // must be between 0 and 1
    public duration: number = 1000; // animation duration in ms

    constructor(stageObj: StageObject) {
        this.stageObj = stageObj;
    }

    protected abstract calculatePositions(): void;
    public abstract getDrawingRectangle(): Drawing.Rectangle;
    public abstract draw(): void;
}

export = AnimationObjectBase