"use strict";
class StageObject{

    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public context: CanvasRenderingContext2D;
    public animationActive: boolean;
    public showFps: boolean;
    public offScreenContext: CanvasRenderingContext2D;

    private offScreenCanvas: HTMLCanvasElement;
    private lastFpsUpdateTime: number;
    private fpsUpdateIntervall: number = 200;

    constructor(x: number, y: number, width: number, height: number, context: CanvasRenderingContext2D) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.context = context;
        this.offScreenCanvas = document.createElement("canvas");
        this.offScreenContext = this.offScreenCanvas.getContext("2d");
    }

    public drawFps(now: number, lastRun: number) {
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

                // if last run not longer than 1 second and last draw greater than fpsUpdateIntervall second (prevent drawing fps every Update)
                if (timeDiff <= 1000 && lastDrawDiff >= this.fpsUpdateIntervall) {
                    fps = 1000 / timeDiff;

                    this.context.save();
                    this.context.clearRect(this.x + 5, this.y + 5, 150, 30);
                    this.context.font = 'normal 20pt Consolas';
                    this.context.fillText(Math.round(fps) + " fps", this.x + 10, this.y + 25);
                    this.context.restore();

                    this.lastFpsUpdateTime = now;
                }
            }
        }
    };
}

export = StageObject;