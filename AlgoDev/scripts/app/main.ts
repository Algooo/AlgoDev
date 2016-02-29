"use strict";

import AlgoDevAnimation = require("app/algoDevAnimation");

class Main {
      
    constructor() {
        
    }

    public static start() {
        var algoDevAnimationObj = new AlgoDevAnimation();
        algoDevAnimationObj.init();
    }
}

Main.start();

export = Main;