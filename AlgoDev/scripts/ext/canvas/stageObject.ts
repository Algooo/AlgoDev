"use strict";
export class StageObject{

    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public context: CanvasRenderingContext2D;
    public animationActive: boolean;
    public showFps: boolean;
    public offScreenContext: CanvasRenderingContext2D;

    private offScreenCanvas: HTMLCanvasElement;

    constructor(x: number, y: number, width: number, height: number, context: CanvasRenderingContext2D) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.context = context;
        this.offScreenCanvas = document.createElement("canvas");
        this.offScreenContext = this.offScreenCanvas.getContext("2d");
    }
}