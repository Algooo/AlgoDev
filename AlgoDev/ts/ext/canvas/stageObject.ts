"use strict";

import AnimationCore = require('ext/canvas/animation/AnimationCore');

class StageObject{

    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public animationActive: boolean;
    public initialized: boolean;
    public canvas: HTMLCanvasElement;
    public animationStopRequested: boolean;

    public context: CanvasRenderingContext2D;

    // Debug options
    public showFps: boolean;
    private lastFpsUpdateTime: number;
    private fpsUpdateIntervall: number = 200;
    private animationCoreObj: AnimationCore;

    // hidden layer
    public hiddenContext: CanvasRenderingContext2D;
    private hiddenCanvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        if (canvas != undefined) {
            this.canvas = canvas;
            this.context = this.canvas.getContext("2d")
        }
        else {
            throw 'Error: StageObject could not be initilized: canvas is undefined';
        }

        this.width = canvas.width;
        this.height = canvas.height;
        this.x = 0;
        this.y = 0;

        this.hiddenCanvas = document.createElement("canvas");
        this.hiddenContext = this.hiddenCanvas.getContext("2d");

        this.animationCoreObj = new AnimationCore(this);

        this.initialized = true;
    }

    
    // ANIMATION
    public animateObjects(objArr: Array<any>) {
        this.animationStopRequested = false;
        return this.animationCoreObj.animateObjects(objArr);
    };

    public animateObject(obj: any) {
        this.animationStopRequested = false;
        return this.animationCoreObj.animateObject(obj);
    }

    public RequestAnimationStop(): void {
        this.animationStopRequested = true;
    }

    // DEBUGGING
    public drawFps(now: number, lastRun: number): void {
        var fps = 0;

        if (this.showFps) {

            // On first enter set lastFpsUpdateTime
            if (!this.lastFpsUpdateTime || this.lastFpsUpdateTime == 0) {
                // Substact fpsUpdateIntervall for update first value immidiatly
                this.lastFpsUpdateTime = now - this.fpsUpdateIntervall;
            }

            // if lastRun is set
            if (lastRun && lastRun > 0) {

                var timeDiff = now - lastRun;
                var lastDrawDiff = now - this.lastFpsUpdateTime;

                // if last run not longer than 1 second and last draw greater than fpsUpdateIntervall (prevent drawing fps every Update)
                if (timeDiff <= 1000 && lastDrawDiff >= this.fpsUpdateIntervall) {
                    fps = 1000 / timeDiff;
                    var text = Math.round(fps) + " fps";

                    this.clearFps();
                    this.context.save();
                    this.context.font = 'normal 15pt Consolas';
                    this.context.fillText(text, this.x + 10, this.y + 25, 100);
                    this.context.restore();

                    this.lastFpsUpdateTime = now;
                }
            }
        }
    };

    public clearFps() {
        if (this.showFps) {
            this.context.clearRect(this.x + 10, this.y + 10, 100, 20);
        }
    }
}

export = StageObject;