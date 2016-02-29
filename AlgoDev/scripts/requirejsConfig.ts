/// <reference path="_declare/require.d.ts" />
/// <reference path="_declare/jquery.d.ts" />
/// <reference path="app/main.ts" />

// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
"use strict";
requirejs.config({
    baseUrl: 'scripts',
    paths: {
        jquery: 'vendor/jquery-2.2.0.min',
        domReady: 'vendor/domReady',
        main: 'app/main'
    },
    shim: {
        jquery: {
            exports: '$'
        }
    }
});

// Start loading the main app file. Put all of
// your application logic in there.
require(['jquery', 'domReady!'],
    () => {
        require(['main']);
    });