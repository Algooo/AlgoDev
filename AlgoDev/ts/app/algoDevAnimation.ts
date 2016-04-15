"use strict";
import Drawing = require('ext/canvas/Drawing');
import StageObject = require('ext/canvas/StageObject');
import AlgoDevCloud = require('app/AlgoDevCloud');


class AlgoDevAnimation {
    private resizeTimerId: number;
    private stageObject: StageObject;
    private canvas: HTMLCanvasElement;
    private algoDevCloudObj: AlgoDevCloud;
    private initialized: boolean;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.stageObject = new StageObject(this.canvas);

        this.resize();
        this.addListeners();

        // Initialize Cloud
        this.algoDevCloudObj = new AlgoDevCloud(this.stageObject);
        this.algoDevCloudObj.strokeStyleColor = new Drawing.RgbaColor(255, 0, 102, 1);
        this.algoDevCloudObj.cloudLineCap = "round";

        this.initialized = true;
    }

    public init() {
        if (this.stageObject.initialized) {

        }
    }

    public start() {
        if (this.initialized) {
            // Start cloud animation
            $.when(this.algoDevCloudObj.animateCloud())
                .done(function (response) {

                })
                .fail(function (response) {

                });
        }
    }

    private updateStageObj() {
        var drawingWidth = this.canvas.width;
        var drawingHeight = this.canvas.height;
        var drawingMargin = Math.floor(this.canvas.width / 100);
        var drawingOrigin = new Drawing.Point(0, 0);
        while (drawingWidth > this.canvas.height) {
            drawingWidth -= drawingMargin;
            drawingHeight -= drawingMargin;
        }
        drawingWidth -= drawingMargin * 2;
        drawingHeight = drawingWidth;
        drawingOrigin = new Drawing.Point((this.canvas.width / 2) - (drawingWidth / 2),
            (this.canvas.height / 2) - (drawingHeight / 2));

        this.stageObject.x = drawingOrigin.x;
        this.stageObject.y = drawingOrigin.y;
        this.stageObject.width = drawingWidth;
        this.stageObject.height = drawingHeight;
        this.stageObject.showFps = true;
    };

    private addListeners() {
        window.onresize = () => {
            this.window_resize();
        }
        this.canvas.onclick = () => {
            this.canvas_click();
        }
    }

    private canvas_click() {
        if (this.stageObject.animationActive) {
            this.stageObject.RequestAnimationStop();
        }
        else {
            // Start cloud animation
            this.algoDevCloudObj.animateCloud();
        }
    };

    private window_resize() {
        clearTimeout(this.resizeTimerId);
        this.stageObject.RequestAnimationStop();
        this.resizeTimerId = setTimeout(() => this.resize(), 500);
    };

    private resize() {
        // Lookup the size the browser is displaying the canvas.
        var displayWidth = Math.floor(this.canvas.clientWidth);
        var displayHeight = Math.floor(this.canvas.clientHeight);
		 
        // Check if the canvas is not the same size.
        if (this.canvas.width != displayWidth ||
            this.canvas.height != displayHeight) {
            // Make the canvas the same size
            this.canvas.width = displayWidth;
            this.canvas.height = displayHeight;
				
            // Set DrawingWidth and height;
            this.updateStageObj();
				
            // Draw drawing Area
            var drawingRect = new Drawing.Rectangle(this.stageObject.x - 1, this.stageObject.y - 1,
                this.stageObject.width + 2, this.stageObject.height + 2);
            drawingRect.stroke(this.stageObject.context);

            if (this.algoDevCloudObj != undefined && this.algoDevCloudObj.initialized) {
                this.algoDevCloudObj.resizeCloud();
                this.algoDevCloudObj.animateCloud();
            }
        }
    }
}
export = AlgoDevAnimation;