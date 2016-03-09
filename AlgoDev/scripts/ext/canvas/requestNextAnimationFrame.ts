"use strict";
interface RequestCallback {
    (time: number): void;
}


export class RequestNextAnimationFrame {

    constructor() {
       
    }

    public static GetRquestAnimationFrame(): ((frameCallback: FrameRequestCallback) => void) {

        var callback: FrameRequestCallback;

        // Workaround for Chrome 10 bug where Chrome
        // does not pass the time to the animation function
        if ((<any>window).webkitRequestAnimationFrame) {
            // Define the wrapper
            var wrapper: FrameRequestCallback;
            var originalWebkitRequestAnimationFrame: (frameCallback: FrameRequestCallback) => void;

            wrapper = function (time) {
                if (time === undefined) {
                    time = +new Date();
                }
                callback(time);
            };

            // Make the switch
				  
            originalWebkitRequestAnimationFrame = (<any>window).webkitRequestAnimationFrame;

            (<any>window).webkitRequestAnimationFrame = function (callback: FrameRequestCallback) {
                callback = callback;

                // Browser calls the wrapper and wrapper calls the callback
                originalWebkitRequestAnimationFrame(wrapper);
            }
        }

        // Workaround for Gecko 2.0, which has a bug in
        // mozRequestAnimationFrame() that restricts animations
        // to 30-40 fps.

        if ((<any>window).mozRequestAnimationFrame) {
            // Check the Gecko version. Gecko is used by browsers
            // other than Firefox. Gecko 2.0 corresponds to
            // Firefox 4.0.
            var userAgent = navigator.userAgent;
            var index = userAgent.indexOf('rv:');

            if (userAgent.indexOf('Gecko') != -1) {
                var geckoVersion = userAgent.substr(index + 3, 3);

                if (geckoVersion === '2.0') {
                    // Forces the return statement to fall through
                    // to the setTimeout() function.
                    (<any>window).mozRequestAnimationFrame = undefined;
                }
            }
        }

        return window.requestAnimationFrame ||
            (<any>window).webkitRequestAnimationFrame ||
            (<any>window).mozRequestAnimationFrame ||
            (<any>window).oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||

            function (callback: FrameRequestCallback) {
                var timeout: number;
                var start: number;
                var finish: number;

                window.setTimeout(function () {
                    start = +new Date();
                    callback(start);
                    finish = +new Date();

                    timeout = 1000 / 60 - (finish - start);

                }, timeout);
            };
    }
}