"use strict";
import RequestNextAnimationFrame = require('ext/canvas/requestNextAnimationFrame');
import DrawingExt = require('ext/canvas/drawingExt');
import StageObject = require('ext/canvas/stageObject');

// TODO: any durch Animation Object basis klasse ersetzen

module AnimationExt {

    // TODO Animation static machen und properties in StageObject auslagern
    export class Animation {
        private lastRequestAnimationFrame: number;
        private lastFpsUpdateTime: number;
        private lastFpsUpdate: number;

        constructor() {
            this.lastRequestAnimationFrame = new Date().getTime();
            this.lastFpsUpdate = 0;
            this.lastFpsUpdateTime = new Date().getTime();
        }

        /* Animation functions */
        public animateObjectArray(objArr: Array<any>, stageObj: StageObject) {
            var animArrayPromise = new Promise(function (resolve, reject) {
                return this.animateObjectPromise(objArr, 0, stageObj, resolve, reject);
            });
            return animArrayPromise;
        };

        private animateObjectPromise(objArr: Array<any>, index: number, stageObj: StageObject,
            resolve: PromiseResolve, reject: PromiseReject): void {

            this.animateObject(objArr[index], stageObj)
                .then(function () {
                    var newIndex = index + 1;
                    if (newIndex < objArr.length) {
                        this.animateObjectPromise(objArr, newIndex, stageObj, resolve, reject);
                        return;
                    }
                    resolve();
                })
                .catch(function (response) {
                    console.log(response);
                    reject();
                });
        };

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

            var animObjectPromise = new Promise(function (resolve, reject) {
                var animFrameEndPromise = new Promise(function (resolve, reject) {
                    this.step(obj, stageObj, end, imageData, resolve, reject);
                });
                animFrameEndPromise.then(function () {
                    // Restore ImageData after animation and Draw full progress
                    if (imageData != null) {
                        stageObj.context.putImageData(imageData, drawingRect.x, drawingRect.y);
                    }
                    obj.drawPath(stageObj);
                    resolve();
                })
                    .catch(function (response) {
                        console.log(response);
                        reject();
                    });

            });
            return animObjectPromise;
        };

        private step(obj: any, stageObj: StageObject, end: number, imgDataBeforeAnimation: ImageData, resolve: PromiseResolve, reject: PromiseReject) {
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
            if (stageObj.showFps) {
                this.drawFps(timestamp, stageObj);
            }

            if (stageObj.animationActive == false) {
                reject();
            }
            if (obj.progress < 1) {
                var callback: FrameRequestCallback;
                callback = function () { this.step(obj, stageObj, end, imgDataBeforeAnimation, resolve, reject) };
                var nextRequestFrameFunc = RequestNextAnimationFrame.GetRquestAnimationFrame();
                nextRequestFrameFunc(callback);
                return
            }
            else {
                resolve();
            }
        };

        private drawFps(now: number, stageObj: StageObject) {
            var fps = 0;

            fps = 1000 / (now - this.lastRequestAnimationFrame);
            this.lastRequestAnimationFrame = now;

            if (now - this.lastFpsUpdateTime > 100) {
                this.lastFpsUpdateTime = now;
                this.lastFpsUpdate = fps;
            }
            if (this.lastFpsUpdate > 0) {
                stageObj.context.save();
                stageObj.context.clearRect(stageObj.x + 5, stageObj.y + 5, 150, 30);
                stageObj.context.font = 'normal 20pt Consolas';
                stageObj.context.fillText(Math.round(this.lastFpsUpdate) + " fps", stageObj.x + 10, stageObj.y + 25);
                stageObj.context.restore();
                this.lastFpsUpdate = 0;
            }
        };
    }

    /* Animation Objects */
    export class LineAnimationObject {
        public stageObj: StageObject; 

        public strokeStyle = new DrawingExt.RgbaColor(0, 0, 0, 1);
        public lineWidth = 10;
        public lineCap = "butt";
        public duration = 1;
        public startP = new DrawingExt.Point(0, 0);
        public endP = new DrawingExt.Point(0, 0);
        public progress = 0; // must be between 0 and 1
        public progressP = new DrawingExt.Point(this.startP.x, this.startP.y);

        constructor(stageObject: StageObject) {
            this.stageObj = stageObject;
        }

        private calculatePositions() {
            if (this.progress < 0 || this.progress > 1) {
                throw "Progress must be between 0 and 1";
            }
            this.progressP.x = this.startP.x + (this.endP.x - this.startP.x) * this.progress;
            this.progressP.y = this.startP.y + (this.endP.y - this.startP.y) * this.progress;
        };

        public getDrawingRectangle() {
            var drawingOrigin = new DrawingExt.Point(0, 0);
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
                drawingOrigin.x -= this.lineWidth;
                drawingOrigin.y -= this.lineWidth;
                width += this.lineWidth * 2;
                height += this.lineWidth * 2;
                return new DrawingExt.Rectangle(drawingOrigin.x, drawingOrigin.y, width, height);
            }
            return null;
        };

        public drawPath() {
            this.stageObj.context.save();
            this.stageObj.context.beginPath();
            this.stageObj.context.lineWidth = this.lineWidth;
            this.stageObj.context.lineCap = this.lineCap;
            this.stageObj.context.strokeStyle = this.strokeStyle.toString();
            this.stageObj.context.moveTo(this.startP.x, this.startP.y);
            this.draw();
            this.stageObj.context.restore();
        };

        public draw() {
            this.calculatePositions();
            this.stageObj.context.lineTo(this.progressP.x, this.progressP.y);
            this.stageObj.context.stroke();
        };

    }

    export class QuadraticCurveAnimationObject {
        public stageObj: StageObject;    

        // public properties
        public strokeStyle = new DrawingExt.RgbaColor(0, 0, 0, 1);
        public lineWidth = 10;
        public lineCap = "butt";
        public duration = 1;
        public startP = new DrawingExt.Point(0, 0);
        public endP = new DrawingExt.Point(0, 0);
        public controlP = new DrawingExt.Point(0, 0);
        public progress = 0; // must be between 0 and 1

        public curControlP = new DrawingExt.Point(this.startP.x, this.startP.y);
        public curEndP = new DrawingExt.Point(this.controlP.x, this.controlP.y);
        public progressP = new DrawingExt.Point(this.startP.x, this.startP.y);

        constructor(stageObj: StageObject) {
            this.stageObj = stageObj;
        }

        private calculatePositions() {
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
            var drawingOrigin = new DrawingExt.Point(0, 0);
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
                return new DrawingExt.Rectangle(drawingOrigin.x, drawingOrigin.y, width, height);
            }
            return null;
        };



        public drawPath() {
            this.stageObj.context.save();
            this.stageObj.context.beginPath();
            this.stageObj.context.lineWidth = this.lineWidth;
            this.stageObj.context.lineCap = this.lineCap;
            this.stageObj.context.strokeStyle = this.strokeStyle.toString();
            this.stageObj.context.moveTo(this.startP.x, this.startP.y);
            this.draw();
            this.stageObj.context.restore();
        };

        public draw() {
            this.calculatePositions();
            this.stageObj.context.quadraticCurveTo(this.curControlP.x, this.curControlP.y, this.progressP.x, this.progressP.y);
            this.stageObj.context.stroke();
        };
    }

    export class GradientFillAnimationObject {
        public stageObj: StageObject; 

        // public properties
        public fillStyle = new DrawingExt.RgbaColor(0, 0, 0, 1);
        public duration = 1;
        public startP = new DrawingExt.Point(0, 0);
        public endP = new DrawingExt.Point(0, 0);
        public distance = 1;
        public progressP = new DrawingExt.Point(this.startP.x, this.startP.y);
        public progress = 0; // must be between 0 and 1

        constructor(stageObj: StageObject) {
            this.stageObj = stageObj;
        }

        private calculatePositions() {
            if (this.progress < 0 || this.progress > 1) {
                throw "Progress must be between 0 and 1";
            }
        }

        public getDrawingRectangle() {
            var drawingOrigin = new DrawingExt.Point(0, 0);
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
                return new DrawingExt.Rectangle(drawingOrigin.x, drawingOrigin.y, width, height);
            }
            return null;
        }

        public drawPath() {
            this.stageObj.context.save();
            this.draw();
            this.stageObj.context.restore();
        }

        public draw() {
            if (this.progress + this.distance >= 1) {
                this.stageObj.context.fillStyle = this.fillStyle.toString();
            }
            else {
                var gradient = this.stageObj.context.createLinearGradient(this.startP.x, this.startP.y,
                    this.endP.x, this.endP.y);
                gradient.addColorStop(0, this.fillStyle.toString());
                gradient.addColorStop(this.progress, this.fillStyle.toString());
                gradient.addColorStop(this.progress + this.distance,
                    (new DrawingExt.RgbaColor(this.fillStyle.r, this.fillStyle.g, this.fillStyle.b, 0)).toString());
                this.stageObj.context.fillStyle = gradient;
            }
            this.stageObj.context.fill();
        }
    }
}
export = AnimationExt;
