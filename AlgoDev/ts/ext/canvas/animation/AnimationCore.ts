"use strict"

import RequestNextAnimationFrame = require('ext/canvas/animation/RequestNextAnimationFrame');
import StageObject = require("ext/canvas/StageObject");

// TODO Animation static machen und properties in StageObject auslagern
class AnimationCore {
    private lastRequestAnimationFrame: number;
    private stageObject: StageObject;

    constructor(stageObject: StageObject) {
        this.lastRequestAnimationFrame = 0;
        this.stageObject = stageObject;
    }

    public animateObjects(objArr: Array<any>) {
        return new Promise((arrayResolve, arrayReject) =>
            this.animateObjectsResolver(arrayResolve, arrayReject, objArr, 0)
        );
    };

    private animateObjectsResolver(mainResolve: PromiseResolve, mainReject: PromiseReject, objArr: Array<any>, index: number): void {
        this.animateObject(objArr[index])
            .then(() =>
                this.animateNextObject(mainResolve, mainReject, objArr, index)
            )
            .catch(function (response) {
                console.log(response);
                mainReject();
            });
    };

    private animateNextObject(mainResolve: PromiseResolve, mainReject: PromiseReject, objArr: Array<any>, index: number) {
        var newIndex = index + 1;
        if (newIndex < objArr.length) {
            this.animateObjectsResolver(mainResolve, mainReject, objArr, newIndex);
            return;
        }
        mainResolve();
    }

    public animateObject(obj: any) {
        // Save image Data before animating
        this.stageObject.animationActive = true;
        var drawingRect = obj.getDrawingRectangle(this.stageObject);
        var imageData: ImageData;
        if (drawingRect != null) {
            imageData = this.stageObject.context.getImageData(drawingRect.x, drawingRect.y, drawingRect.width, drawingRect.height);
        }

        // The calculations required for the step function
        var start = new Date().getTime();
        var end = start + obj.duration;
        // if obj animation has already started once
        if (obj.progress > 0) {
            end = end - ((end - start) * obj.progress);
        }

        return new Promise((objResolve, objReject) => this.animateObjectResolver(objResolve, objReject, obj, end, imageData, drawingRect));

    };

    private animateObjectResolver(objResolve: PromiseResolve, objReject: PromiseReject, obj: any, end: number, imageData: ImageData, drawingRect: any): void {
        var animObjEndPromise = new Promise((framesResolve, framesReject) => this.step(framesResolve, framesReject, obj, end, imageData));
        animObjEndPromise.then(
            () => this.animateObjectEndResolve(objResolve, obj, imageData, drawingRect)
        ).catch(
            (response) => this.animateObjectEndReject(Object, response)
        );
    }


    private animateObjectEndResolve(objResolve: PromiseResolve, obj: any, imageData: ImageData, drawingRect: any): void {
        // Restore ImageData after animation and Draw full progress
        if (imageData != null) {
            this.stageObject.context.putImageData(imageData, drawingRect.x, drawingRect.y);
        }
        obj.drawPath(this.stageObject);

        this.stageObject.animationActive = false;

        objResolve();
    }

    private animateObjectEndReject(objReject: PromiseReject, response: any): void {

        console.log(response);
        this.stageObject.animationActive = false;

        objReject();
    }

    private step(framesResolve: PromiseResolve, framesReject: PromiseReject, obj: any, end: number, imgDataBeforeAnimation: ImageData) {
        let self = this;
        var timestamp = new Date().getTime();
        var drawingRect = obj.getDrawingRectangle(this.stageObject);

        obj.progress = Math.min((obj.duration - (end - timestamp)) / obj.duration, 1);

        // Restore ImageData after animation and Draw full progress
        if (imgDataBeforeAnimation != null) {
            this.stageObject.context.putImageData(imgDataBeforeAnimation, drawingRect.x, drawingRect.y);
        }

        // Draw object
        obj.drawPath(this.stageObject);

        // FPS
        this.stageObject.drawFps(timestamp, this.lastRequestAnimationFrame);

        this.lastRequestAnimationFrame = timestamp;

        if (this.stageObject.animationStopRequested) {
            this.stageObject.animationStopRequested = false;
            framesReject("Animation stop requested!");
            return;
        }
        if (obj.progress < 1) {
            var callback: FrameRequestCallback;
            callback = () => this.step(framesResolve, framesReject, obj, end, imgDataBeforeAnimation);
            var nextRequestFrameFunc = RequestNextAnimationFrame.GetRquestAnimationFrame();
            nextRequestFrameFunc(callback);
            return;
        }
        else {
            framesResolve();
            return;
        }
    };
}

export = AnimationCore