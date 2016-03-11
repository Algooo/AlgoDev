"use strict"

import RequestNextAnimationFrame = require('ext/canvas/animation/RequestNextAnimationFrame');
import StageObject = require("ext/canvas/StageObject");

// TODO Animation static machen und properties in StageObject auslagern
class AnimationCore {
    private lastRequestAnimationFrame: number;
    private lastFpsUpdate: number;

    constructor() {
        this.lastRequestAnimationFrame = 0;
        this.lastFpsUpdate = 0;
    }

    /* Animation functions */
    public animateObjects(objArr: Array<any>, stageObj: StageObject) {
        return new Promise((mainResolve, mainReject) =>
            this.animateObjectsResolver(mainResolve, mainReject, objArr, 0, stageObj)
        );
    };

    private animateObjectsResolver(mainResolve: PromiseResolve, mainReject: PromiseReject, objArr: Array<any>, index: number, stageObj: StageObject): void {
        this.animateObject(objArr[index], stageObj)
            .then(() =>
                this.animateNextObject(mainResolve, mainReject, objArr, index, stageObj)
            )
            .catch(function (response) {
                console.log(response);
                mainReject();
            });
    };

    private animateNextObject(mainResolve: PromiseResolve, mainReject: PromiseReject, objArr: Array<any>, index: number, stageObj: StageObject) {
        var newIndex = index + 1;
        if (newIndex < objArr.length) {
            this.animateObjectsResolver(mainResolve, mainReject, objArr, newIndex, stageObj);
            return;
        }
        mainResolve();
    }

    public animateObject(obj: any, stageObj: StageObject) {
        // Save image Data before animating
        var drawingRect = obj.getDrawingRectangle(stageObj);
        var imageData: ImageData;
        if (drawingRect != null) {
            imageData = stageObj.context.getImageData(drawingRect.x, drawingRect.y, drawingRect.width, drawingRect.height);
        }

        // The calculations required for the step function
        var start = new Date().getTime();
        var end = start + obj.duration;
        // if obj animation has already started once
        if (obj.progress > 0) {
            end = end - ((end - start) * obj.progress);
        }

        return new Promise((objResolve, objReject) => this.animObjectResolver(objResolve, objReject, obj, stageObj, end, imageData, drawingRect));
   
    };

    private animObjectResolver(objResolve: PromiseResolve, objReject: PromiseReject, obj: any, stageObj: StageObject, end: number, imageData: ImageData, drawingRect: any): void {
        var animObjEndPromise = new Promise((framesResolve, framesReject) => this.step(framesResolve, framesReject, obj, stageObj, end, imageData));
        animObjEndPromise.then(function () {
            // Restore ImageData after animation and Draw full progress
            if (imageData != null) {
                stageObj.context.putImageData(imageData, drawingRect.x, drawingRect.y);
            }
            obj.drawPath(stageObj);
            objResolve();
        })
        .catch(function (response) {
            console.log(response);
            objReject();
        });
    }

    private step(framesResolve: PromiseResolve, framesReject: PromiseReject, obj: any, stageObj: StageObject, end: number, imgDataBeforeAnimation: ImageData) {
        let self = this;
        var timestamp = new Date().getTime();
        var drawingRect = obj.getDrawingRectangle(stageObj);

        obj.progress = Math.min((obj.duration - (end - timestamp)) / obj.duration, 1);

        // Restore ImageData after animation and Draw full progress
        if (imgDataBeforeAnimation != null) {
            stageObj.context.putImageData(imgDataBeforeAnimation, drawingRect.x, drawingRect.y);
        }

        // Draw object
        obj.drawPath(stageObj);

        // FPS
        stageObj.drawFps(timestamp, this.lastRequestAnimationFrame);
        
        this.lastRequestAnimationFrame = timestamp;

        if (stageObj.animationActive == false) {
            framesReject();
            return;
        }
        if (obj.progress < 1) {
            var callback: FrameRequestCallback;
            callback = () => this.step(framesResolve, framesReject, obj, stageObj, end, imgDataBeforeAnimation);
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