"use strict";
import Drawing = require('ext/canvas/Drawing');
import StageObject = require('ext/canvas/StageObject');
import AlgoDevCloud = require('app/AlgoDevCloud');


class AlgoDevAnimation {

    private canvas: HTMLCanvasElement;
    private mainContext: CanvasRenderingContext2D;
    private resizeTimerId: number;
    private stageObject: StageObject;

    private algoDevCloudObj: AlgoDevCloud;

    constructor() {
     
        this.canvas = <HTMLCanvasElement>document.getElementById("algoDevCanvas");
        if (this.canvas != undefined) {
            this.mainContext = this.canvas.getContext('2d');
        }
        else {
            console.log('Error: Canvas not found with selector #algoDevCanvas');
            return;
        }
    }

    public addListeners() {
        window.onresize = () => {
            this.window_resize();
        }
        this.canvas.click = () => {
            this.canvas_click();
        }
    }

    public init() {
        // Grab our context		
        if (this.mainContext) {
            this.resize();

            // Initialize Cloud
            this.algoDevCloudObj = new AlgoDevCloud(this.stageObject);


            // Start cloud animation
            $.when(this.algoDevCloudObj.animateCloud())
                .done(function (response) {

                })
                .fail(function (response) {

                });
        };
    }

    private canvas_click() {
        if (this.stageObject.animationActive) {
            this.stageObject.animationActive = false;
        }
        else {
            this.stageObject.animationActive = true;
            // Start cloud animation
            this.algoDevCloudObj.animateCloud();
        }
    };

    private setStageObj() {
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

        this.stageObject = new StageObject(drawingOrigin.x, drawingOrigin.y, drawingWidth, drawingHeight, this.mainContext);
        this.stageObject.showFps = true;
    };

    private window_resize() {
        clearTimeout(this.resizeTimerId);
        this.stageObject.animationActive = false;
        this.resizeTimerId = setTimeout(this.resize, 500);
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
            this.setStageObj();
				
            // Draw drawing Area
            var drawingRect = new Drawing.Rectangle(this.stageObject.x - 1, this.stageObject.y - 1,
                this.stageObject.width + 2, this.stageObject.height + 2);
            drawingRect.stroke(this.stageObject.context);

            if (this.algoDevCloudObj != undefined && this.algoDevCloudObj.initialized) {
                this.stageObject.animationActive = true;
                this.algoDevCloudObj.resizeCloud();
                this.algoDevCloudObj.animateCloud();
            }
        }
    }
}
export = AlgoDevAnimation;