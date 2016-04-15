"use strict";
import Drawing = require('ext/canvas/Drawing');
import StageObject = require('ext/canvas/StageObject');
import AnimationObjects = require('ext/canvas/animation/AnimationObjects');
import $ = require('jquery');
import MathExt = require('ext/MathExt');

//import AlgoDevText = require('app/algoDevText');

class AlgoDevCloud {
    
    private stageObj: StageObject;
    public initialized: boolean;

    // Cloud Logo options
    public strokeStyleColor: Drawing.RgbaColor;
    public cloudLineCap: string;

    private cloudLineWidth: number;
    private cloudWidth: number;
    private cloudHeight: number;
    private cloudOrigin: Drawing.Point;

    private cloudLeftCurve: AnimationObjects.QuadraticCurveAnimationObject;
    private cloudMiddleCurve: AnimationObjects.QuadraticCurveAnimationObject;
    private cloudRightCurve: AnimationObjects.QuadraticCurveAnimationObject;
    private cloudBottomLine: AnimationObjects.LineAnimationObject;
    private cloudGradientFill: AnimationObjects.GradientFillAnimationObject;

    constructor(stageObj: StageObject) {
        this.stageObj = stageObj;

        this.resizeCloud();

        this.strokeStyleColor = new Drawing.RgbaColor(0, 0, 0, 1)
        this.cloudLineCap = "butt";

        // objects
        this.initCloudLeftCurve();
        this.initCloudMiddleCurve();
        this.initCloudRightCurve();
        this.initCloudBottomLine();
        this.initCloudGradientFill();
        this.initialized = true;
    }

    private initCloudLeftCurve = function () {
        this.cloudLeftCurve = new AnimationObjects.QuadraticCurveAnimationObject(this.stageObj);
        this.cloudLeftCurve.strokeStyle = this.strokeStyleColor;
        this.cloudLeftCurve.lineCap = this.cloudLineCap;
        this.cloudLeftCurve.duration = 500;
        this.resizeCloudLeftCurve();
    };

    private initCloudMiddleCurve() {
        this.cloudMiddleCurve = new AnimationObjects.QuadraticCurveAnimationObject(this.stageObj);
        this.cloudMiddleCurve.strokeStyle = this.strokeStyleColor;
        this.cloudMiddleCurve.lineCap = this.cloudLineCap;
        this.cloudMiddleCurve.duration = 500;
        this.resizeCloudMiddleCurve();
    };

    private initCloudRightCurve() {
        this.cloudRightCurve = new AnimationObjects.QuadraticCurveAnimationObject(this.stageObj);
        this.cloudRightCurve.strokeStyle = this.strokeStyleColor;
        this.cloudRightCurve.lineCap = this.cloudLineCap;
        this.cloudRightCurve.duration = 500;
        this.resizeCloudRightCurve();
    };

    private initCloudBottomLine() {
        this.cloudBottomLine = new AnimationObjects.LineAnimationObject(this.stageObj);
        this.cloudBottomLine.strokeStyle = this.strokeStyleColor;
        this.cloudBottomLine.lineCap = this.cloudLineCap;
        this.cloudBottomLine.duration = 500;
        this.resizeCloudBottomLine();
    };

    private initCloudGradientFill() {
        this.cloudGradientFill = new AnimationObjects.GradientFillAnimationObject(this.stageObj);
        this.cloudGradientFill.fillStyle = this.strokeStyleColor;
        this.cloudGradientFill.duration = 1000;
        this.cloudGradientFill.distance = 0.1;
        this.resizeCloudGradientFill();
    };

    public resizeCloud() {;
        this.cloudLineWidth = this.stageObj.width > this.stageObj.height ? this.stageObj.width / 20 : this.stageObj.height / 20;
        this.cloudWidth = this.stageObj.width - this.cloudLineWidth * 2;
        this.cloudHeight = this.stageObj.height - this.cloudLineWidth * 2;
        this.cloudOrigin = new Drawing.Point(this.stageObj.x + this.cloudLineWidth, this.stageObj.y + this.cloudLineWidth);
			
        //temp variables
        this.resizeCloudLeftCurve();
        this.resizeCloudMiddleCurve();
        this.resizeCloudRightCurve();
        this.resizeCloudBottomLine();
        this.resizeCloudGradientFill();
    };

    private resizeCloudLeftCurve() {
        if (this.cloudLeftCurve != null) {
            var cw = this.cloudWidth;
            var ch = this.cloudHeight;

            this.cloudLeftCurve.lineWidth = this.cloudLineWidth;
            this.cloudLeftCurve.startP = new Drawing.Point(this.cloudOrigin.x + MathExt.sixteenth(cw),
                this.cloudOrigin.y + MathExt.half(ch) + MathExt.quarter(ch));
            this.cloudLeftCurve.endP = new Drawing.Point(this.cloudOrigin.x + MathExt.third(cw) - MathExt.sixteenth(cw),
                this.cloudOrigin.y + MathExt.third(ch) + MathExt.eighth(ch));
            this.cloudLeftCurve.controlP = new Drawing.Point(this.cloudOrigin.x - MathExt.sixteenth(cw),
                this.cloudOrigin.y + MathExt.half(ch));
        }
    };

    private resizeCloudMiddleCurve() {
        if (this.cloudMiddleCurve != null) {
            var cw = this.cloudWidth;
            var ch = this.cloudHeight;

            this.cloudMiddleCurve.lineWidth = this.cloudLineWidth;
            this.cloudMiddleCurve.startP = new Drawing.Point(this.cloudOrigin.x + MathExt.third(cw) - MathExt.sixteenth(cw),
                this.cloudOrigin.y + MathExt.third(ch) + MathExt.eighth(ch));
            this.cloudMiddleCurve.endP = new Drawing.Point(this.cloudOrigin.x + (MathExt.third(cw) * 2) + MathExt.sixteenth(cw),
                this.cloudOrigin.y + MathExt.third(ch) + MathExt.sixteenth(ch));
            this.cloudMiddleCurve.controlP = new Drawing.Point(this.cloudOrigin.x + (MathExt.third(cw) * 2) - MathExt.quarter(cw),
                this.cloudOrigin.y + MathExt.eighth(ch));
        }
    };

    private resizeCloudRightCurve() {
        if (this.cloudRightCurve != null) {
            var cw = this.cloudWidth;
            var ch = this.cloudHeight;    

            this.cloudRightCurve.lineWidth = this.cloudLineWidth;
            this.cloudRightCurve.startP = new Drawing.Point(this.cloudOrigin.x + (MathExt.third(cw) * 2) + MathExt.sixteenth(cw),
                this.cloudOrigin.y + MathExt.third(ch) + MathExt.sixteenth(ch));
            this.cloudRightCurve.endP = new Drawing.Point(this.cloudOrigin.x + this.cloudWidth - MathExt.eighth(cw),
                this.cloudOrigin.y + MathExt.half(ch) + MathExt.quarter(ch));
            this.cloudRightCurve.controlP = new Drawing.Point(this.cloudOrigin.x + this.cloudWidth + MathExt.sixteenth(cw),
                this.cloudOrigin.y + MathExt.third(ch) + MathExt.eighth(ch));
        }
    };

    private resizeCloudBottomLine() {
        if (this.cloudBottomLine != null) {
            var cw = this.cloudWidth;
            var ch = this.cloudHeight;

            this.cloudBottomLine.lineWidth = this.cloudLineWidth;
            this.cloudBottomLine.startP = new Drawing.Point(this.cloudOrigin.x + this.cloudWidth - MathExt.eighth(cw),
                this.cloudOrigin.y + MathExt.half(ch) + MathExt.quarter(ch));
            this.cloudBottomLine.endP = new Drawing.Point(this.cloudOrigin.x + MathExt.sixteenth(cw),
                this.cloudOrigin.y + MathExt.half(ch) + MathExt.quarter(ch));
        }
    };

    private resizeCloudGradientFill() {
        if (this.cloudGradientFill != null) {
            this.cloudGradientFill.startP = this.cloudLeftCurve.startP;
            this.cloudGradientFill.endP = new Drawing.Point(this.cloudRightCurve.controlP.x, this.cloudMiddleCurve.controlP.y);
        }
    };

    private createCloudPath() {
        var ctx = this.stageObj.context;

        ctx.beginPath();
        ctx.moveTo(this.cloudLeftCurve.startP.x, this.cloudLeftCurve.startP.y)
        ctx.quadraticCurveTo(this.cloudLeftCurve.controlP.x, this.cloudLeftCurve.controlP.y, this.cloudLeftCurve.endP.x, this.cloudLeftCurve.endP.y);
        ctx.quadraticCurveTo(this.cloudMiddleCurve.controlP.x, this.cloudMiddleCurve.controlP.y, this.cloudMiddleCurve.endP.x, this.cloudMiddleCurve.endP.y);
        ctx.quadraticCurveTo(this.cloudRightCurve.controlP.x, this.cloudRightCurve.controlP.y, this.cloudRightCurve.endP.x, this.cloudRightCurve.endP.y);
        ctx.lineTo(this.cloudBottomLine.endP.x, this.cloudBottomLine.endP.y);
    };

    // TODO ES6 Promise umwandeln
    public animateCloud() {
        var animCloudDef = $.Deferred<void>();

        var animationObjectArr = [
            this.cloudLeftCurve,
            this.cloudMiddleCurve,
            this.cloudRightCurve,
            this.cloudBottomLine
        ];

        this.stageObj.animateObjects(animationObjectArr)
            .then((response: any) => {
                var ctx = this.stageObj.context;
                this.createCloudPath();
                $.when(this.animateCloudGradientFill())
                    .done(function (r) {
                        animCloudDef.resolve();
                        return;
                    })
                    .fail(function (r) {
                        animCloudDef.reject();
                        return;
                    });
                return;
            })
            .catch(function (response: any) {
                console.log(response);
                animCloudDef.reject();
                return
            });

        return animCloudDef.promise();
    };

    // TODO ES6 Promise umwandeln
    private animateCloudGradientFill() {
        var animGradientDef = $.Deferred<void>();

        var animObjArr = [
            this.cloudGradientFill
        ];
        this.stageObj.animateObjects(animObjArr)
            .then(function (response: any) {
                //$.when(this.animateAlgoDevText())
                //    .done(function (r) {
                //        animGradientDef.resolve();
                //        return;
                //    })
                //    .fail(function (r) {
                //        animGradientDef.resolve();
                //        return;
                //    });

                return;
            })
            .catch(function (response: any) {
                console.log(response);
                animGradientDef.reject();
                return;
            });

        return animGradientDef.promise();
    };

    private animateAlgoDevText = function () {
        //var animTextDef = $.Deferred<void>();

        //algoDevText.init();


        //return animTextDef.promise();
    };
}

export = AlgoDevCloud;

		
		
		