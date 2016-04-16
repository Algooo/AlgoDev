define(["require", "exports", "ext/canvas/Drawing"], function (require, exports, Drawing) {
    "use strict";
    var AnimationObjects;
    (function (AnimationObjects) {
        class AnimationObject {
            constructor(stageObj) {
                this.progress = 0; // must be between 0 and 1
                this.duration = 1000; // animation duration in ms
                this.stageObj = stageObj;
            }
        }
        AnimationObjects.AnimationObject = AnimationObject;
        class LineAnimationObject extends AnimationObject {
            constructor(stageObject) {
                super(stageObject);
                this.strokeStyle = new Drawing.RgbaColor(0, 0, 0, 1);
                this.lineWidth = 10;
                this.lineCap = "butt";
                this.startP = new Drawing.Point(0, 0);
                this.endP = new Drawing.Point(0, 0);
                this.progressP = new Drawing.Point(this.startP.x, this.startP.y);
            }
            calculatePositions() {
                if (this.progress < 0 || this.progress > 1) {
                    throw "Progress must be between 0 and 1";
                }
                this.progressP.x = this.startP.x + (this.endP.x - this.startP.x) * this.progress;
                this.progressP.y = this.startP.y + (this.endP.y - this.startP.y) * this.progress;
            }
            ;
            getDrawingRectangle() {
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
                    drawingOrigin.x -= this.lineWidth;
                    drawingOrigin.y -= this.lineWidth;
                    width += this.lineWidth * 2;
                    height += this.lineWidth * 2;
                    return new Drawing.Rectangle(drawingOrigin.x, drawingOrigin.y, width, height);
                }
                return null;
            }
            ;
            draw() {
                this.stageObj.context.save();
                this.stageObj.context.beginPath();
                this.stageObj.context.lineWidth = this.lineWidth;
                this.stageObj.context.lineCap = this.lineCap;
                this.stageObj.context.strokeStyle = this.strokeStyle.toString();
                this.stageObj.context.moveTo(this.startP.x, this.startP.y);
                this.calculatePositions();
                this.stageObj.context.lineTo(this.progressP.x, this.progressP.y);
                this.stageObj.context.stroke();
                this.stageObj.context.restore();
            }
            ;
        }
        AnimationObjects.LineAnimationObject = LineAnimationObject;
        class QuadraticCurveAnimationObject extends AnimationObject {
            constructor(stageObject) {
                super(stageObject);
                // public properties
                this.strokeStyle = new Drawing.RgbaColor(0, 0, 0, 1);
                this.lineWidth = 10;
                this.lineCap = "butt";
                this.startP = new Drawing.Point(0, 0);
                this.endP = new Drawing.Point(0, 0);
                this.controlP = new Drawing.Point(0, 0);
                this.curControlP = new Drawing.Point(this.startP.x, this.startP.y);
                this.curEndP = new Drawing.Point(this.controlP.x, this.controlP.y);
                this.progressP = new Drawing.Point(this.startP.x, this.startP.y);
            }
            calculatePositions() {
                if (this.progress < 0 || this.progress > 1) {
                    throw "Progress must be between 0 and 1";
                }
                this.curControlP.x = this.startP.x + (this.controlP.x - this.startP.x) * this.progress;
                this.curControlP.y = this.startP.y + (this.controlP.y - this.startP.y) * this.progress;
                this.curEndP.x = this.controlP.x + (this.endP.x - this.controlP.x) * this.progress;
                this.curEndP.y = this.controlP.y + (this.endP.y - this.controlP.y) * this.progress;
                this.progressP.x = this.curControlP.x + (this.curEndP.x - this.curControlP.x) * this.progress;
                this.progressP.y = this.curControlP.y + (this.curEndP.y - this.curControlP.y) * this.progress;
            }
            ;
            getDrawingRectangle() {
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
            }
            ;
            draw() {
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
            }
            ;
        }
        AnimationObjects.QuadraticCurveAnimationObject = QuadraticCurveAnimationObject;
        class GradientFillAnimationObject extends AnimationObject {
            constructor(stageObject) {
                super(stageObject);
                // public properties
                this.fillStyle = new Drawing.RgbaColor(0, 0, 0, 1);
                this.startP = new Drawing.Point(0, 0);
                this.endP = new Drawing.Point(0, 0);
                this.distance = 1;
                this.progressP = new Drawing.Point(this.startP.x, this.startP.y);
            }
            calculatePositions() {
                if (this.progress < 0 || this.progress > 1) {
                    throw "Progress must be between 0 and 1";
                }
            }
            getDrawingRectangle() {
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
            draw() {
                this.stageObj.context.save();
                if (this.progress + this.distance >= 1) {
                    this.stageObj.context.fillStyle = this.fillStyle.toString();
                }
                else {
                    var gradient = this.stageObj.context.createLinearGradient(this.startP.x, this.startP.y, this.endP.x, this.endP.y);
                    gradient.addColorStop(0, this.fillStyle.toString());
                    gradient.addColorStop(this.progress, this.fillStyle.toString());
                    gradient.addColorStop(this.progress + this.distance, (new Drawing.RgbaColor(this.fillStyle.r, this.fillStyle.g, this.fillStyle.b, 0)).toString());
                    this.stageObj.context.fillStyle = gradient;
                }
                this.stageObj.context.fill();
                this.stageObj.context.restore();
            }
        }
        AnimationObjects.GradientFillAnimationObject = GradientFillAnimationObject;
    })(AnimationObjects || (AnimationObjects = {}));
    return AnimationObjects;
});
//# sourceMappingURL=AnimationObjects.js.map