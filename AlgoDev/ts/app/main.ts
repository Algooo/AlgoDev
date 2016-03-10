"use strict";

import i_ada = require("app/algoDevAnimation");

export class Main {
      
    constructor() {
        
    }

    public static start() {
        var algoDevAnimationObj = new i_ada.AlgoDevAnimation();
        algoDevAnimationObj.init();
    }
}

Main.start();