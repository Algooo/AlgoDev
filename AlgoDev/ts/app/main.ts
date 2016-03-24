"use strict";

import AlgoDevAnimation = require("app/AlgoDevAnimation");

export class Main {

    constructor() {
        

    }

    public static start() {
        var canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("algoDevCanvas");
        var algoDevAnimationObj = new AlgoDevAnimation(canvas);
        algoDevAnimationObj.start();
    }
}

Main.start();