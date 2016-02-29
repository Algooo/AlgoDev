"use strict";
import DrawingExt = require('ext/canvas/drawingExt');
import StageObject = require('ext/canvas/stageObject');
import AnimationExt = require('ext/canvas/animationExt');
import $ = require('jquery');

//import AlgoDevText = require('app/algoDevText');

// TODO Auslagern in mathExt
class MathExt {

    public static half(num: number): number {
        return num / 2;
    }
    public static third(num: number): number {
        return num / 3;
    }
    public static quarter(num: number): number {
        return num / 4;
    }
    public static eighth(num: number): number {
        return num / 8;
    }
    public static sixteenth(num: number): number {
        return num / 16;
    }
}
/////////////////////////

class AlgoDevCloud {

    private stageObj: StageObject;
    public initialized: boolean;

    // Cloud Logo options
    public strokeStyleColor: DrawingExt.RgbaColor;
    public cloudLineCap: string;

    private cloudLineWidth: number;
    private cloudWidth: number;
    private cloudHeight: number;
    private cloudOrigin: DrawingExt.Point;

    private cloudLeftCurve: AnimationExt.QuadraticCurveAnimationObject;
    private cloudMiddleCurve: AnimationExt.QuadraticCurveAnimationObject;
    private cloudRightCurve: AnimationExt.QuadraticCurveAnimationObject;
    private cloudBottomLine: AnimationExt.LineAnimationObject;
    private cloudGradientFill: AnimationExt.GradientFillAnimationObject;

    private animationObj: AnimationExt.Animation;

    constructor(stageObj: StageObject) {
        this.stageObj = stageObj;

        this.resizeCloud();

        this.strokeStyleColor = new DrawingExt.RgbaColor(0, 0, 0, 1)
        this.cloudLineCap = "butt";
        // TODO auslagern in aufrufende Klasse
        this.strokeStyleColor = new DrawingExt.RgbaColor(255, 0, 102, 1);
        this.cloudLineCap = "round";
        //////////////
        this.cloudLineWidth = 1;
        this.cloudWidth = 0;
        this.cloudHeight = 0;
        this.cloudOrigin = new DrawingExt.Point(0, 0);

        // objects
        this.initCloudLeftCurve();
        this.initCloudMiddleCurve();
        this.initCloudRightCurve();
        this.initCloudBottomLine();
        this.initCloudGradientFill();

        this.animationObj = new AnimationExt.Animation();
        this.initialized = true;
    }

    private initCloudLeftCurve = function () {
        this.cloudLeftCurve = new AnimationExt.QuadraticCurveAnimationObject(this.stageObj);
        this.cloudLeftCurve.strokeStyle = this.strokeStyleColor;
        this.cloudLeftCurve.lineCap = this.cloudLineCap;
        this.cloudLeftCurve.duration = 500;
        this.resizeCloudLeftCurve();
    };

    private initCloudMiddleCurve() {
        this.cloudMiddleCurve = new AnimationExt.QuadraticCurveAnimationObject(this.stageObj);
        this.cloudMiddleCurve.strokeStyle = this.strokeStyleColor;
        this.cloudMiddleCurve.lineCap = this.cloudLineCap;
        this.cloudMiddleCurve.duration = 500;
        this.resizeCloudMiddleCurve();
    };

    private initCloudRightCurve() {
        this.cloudRightCurve = new AnimationExt.QuadraticCurveAnimationObject(this.stageObj);
        this.cloudRightCurve.strokeStyle = this.strokeStyleColor;
        this.cloudRightCurve.lineCap = this.cloudLineCap;
        this.cloudRightCurve.duration = 500;
        this.resizeCloudRightCurve();
    };

    private initCloudBottomLine() {
        this.cloudBottomLine = new AnimationExt.LineAnimationObject(this.stageObj);
        this.cloudBottomLine.strokeStyle = this.strokeStyleColor;
        this.cloudBottomLine.lineCap = this.cloudLineCap;
        this.cloudBottomLine.duration = 500;
        this.resizeCloudBottomLine();
    };

    private initCloudGradientFill() {
        this.cloudGradientFill = new AnimationExt.GradientFillAnimationObject(this.stageObj);
        this.cloudGradientFill.fillStyle = this.strokeStyleColor;
        this.cloudGradientFill.duration = 1000;
        this.cloudGradientFill.distance = 0.1;
        this.resizeCloudGradientFill();
    };

    public resizeCloud() {;
        this.cloudLineWidth = this.stageObj.width > this.stageObj.height ? this.stageObj.width / 20 : this.stageObj.height / 20;
        this.cloudWidth = this.stageObj.width - this.cloudLineWidth * 2;
        this.cloudHeight = this.stageObj.height - this.cloudLineWidth * 2;
        this.cloudOrigin = new DrawingExt.Point(this.stageObj.x + this.cloudLineWidth, this.stageObj.y + this.cloudLineWidth);
			
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
            this.cloudLeftCurve.startP = new DrawingExt.Point(this.cloudOrigin.x + MathExt.sixteenth(cw),
                this.cloudOrigin.y + MathExt.half(ch) + MathExt.quarter(ch));
            this.cloudLeftCurve.endP = new DrawingExt.Point(this.cloudOrigin.x + MathExt.third(cw) - MathExt.sixteenth(cw),
                this.cloudOrigin.y + MathExt.third(ch) + MathExt.eighth(ch));
            this.cloudLeftCurve.controlP = new DrawingExt.Point(this.cloudOrigin.x - MathExt.sixteenth(cw),
                this.cloudOrigin.y + MathExt.half(ch));
        }
    };

    private resizeCloudMiddleCurve() {
        if (this.cloudMiddleCurve != null) {
            var cw = this.cloudWidth;
            var ch = this.cloudHeight;

            this.cloudMiddleCurve.lineWidth = this.cloudLineWidth;
            this.cloudMiddleCurve.startP = new DrawingExt.Point(this.cloudOrigin.x + MathExt.third(cw) - MathExt.sixteenth(cw),
                this.cloudOrigin.y + MathExt.third(ch) + MathExt.eighth(ch));
            this.cloudMiddleCurve.endP = new DrawingExt.Point(this.cloudOrigin.x + (MathExt.third(cw) * 2) + MathExt.sixteenth(cw),
                this.cloudOrigin.y + MathExt.third(ch) + MathExt.sixteenth(ch));
            this.cloudMiddleCurve.controlP = new DrawingExt.Point(this.cloudOrigin.x + (MathExt.third(cw) * 2) - MathExt.sixteenth(cw),
                this.cloudOrigin.y + MathExt.eighth(ch));
        }
    };

    private resizeCloudRightCurve() {
        if (this.cloudRightCurve != null) {
            var cw = this.cloudWidth;
            var ch = this.cloudHeight;    

            this.cloudRightCurve.lineWidth = this.cloudLineWidth;
            this.cloudRightCurve.startP = new DrawingExt.Point(this.cloudOrigin.x + (MathExt.third(cw) * 2) + MathExt.sixteenth(cw),
                this.cloudOrigin.y + MathExt.third(ch) + MathExt.sixteenth(ch));
            this.cloudRightCurve.endP = new DrawingExt.Point(this.cloudOrigin.x + this.cloudWidth - MathExt.eighth(cw),
                this.cloudOrigin.y + MathExt.half(ch) + MathExt.quarter(ch));
            this.cloudRightCurve.controlP = new DrawingExt.Point(this.cloudOrigin.x + this.cloudWidth + MathExt.sixteenth(cw),
                this.cloudOrigin.y + MathExt.third(ch) + MathExt.eighth(ch));
        }
    };

    private resizeCloudBottomLine() {
        if (this.cloudBottomLine != null) {
            var cw = this.cloudWidth;
            var ch = this.cloudHeight;

            this.cloudBottomLine.lineWidth = this.cloudLineWidth;
            this.cloudBottomLine.startP = new DrawingExt.Point(this.cloudOrigin.x + this.cloudWidth - MathExt.eighth(cw),
                this.cloudOrigin.y + MathExt.half(ch) + MathExt.quarter(ch));
            this.cloudBottomLine.endP = new DrawingExt.Point(this.cloudOrigin.x + MathExt.sixteenth(cw),
                this.cloudOrigin.y + MathExt.half(ch) + MathExt.quarter(ch));
        }
    };

    private resizeCloudGradientFill() {
        if (this.cloudGradientFill != null) {
            this.cloudGradientFill.startP = this.cloudLeftCurve.startP;
            this.cloudGradientFill.endP = new DrawingExt.Point(this.cloudRightCurve.controlP.x, this.cloudMiddleCurve.controlP.y);
        }
    };

    private drawCloudPath() {
        var ctx = this.stageObj.context;

        ctx.clearRect(this.stageObj.x, this.stageObj.y, this.stageObj.width, this.stageObj.height);

        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = this.strokeStyleColor.toString();
        ctx.lineWidth = this.cloudLineWidth;
        ctx.lineCap = this.cloudLineCap;
        ctx.moveTo(this.cloudLeftCurve.startP.x, this.cloudLeftCurve.startP.y)
        this.cloudLeftCurve.draw();
        this.cloudMiddleCurve.draw();
        this.cloudRightCurve.draw();
        this.cloudBottomLine.draw();
        ctx.restore();
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

        this.animationObj.animateObjectArray(animationObjectArr, this.stageObj)
            .then(function (response) {
                var ctx = this.stageObj.context;
                this.drawCloudPath();
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
            .catch(function (response) {
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
        this.animationObj.animateObjectArray(animObjArr, this.stageObj)
            .then(function (response) {
                $.when(this.animateAlgoDevText())
                    .done(function (r) {
                        animGradientDef.resolve();
                        return;
                    })
                    .fail(function (r) {
                        animGradientDef.resolve();
                        return;
                    });

                return;
            })
            .catch(function (response) {
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
		

		
		
		