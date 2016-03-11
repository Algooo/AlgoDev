"use strict";

import AlgoDevAnimation = require("app/AlgoDevAnimation");

export class Main {
      
    constructor() {
        
    }

    public static start() {
        var algoDevAnimationObj = new AlgoDevAnimation();
        algoDevAnimationObj.init();
    }
}

Main.start();