// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
"use strict";
requirejs.config({
    baseUrl: './js/',
    paths: {
        jquery: 'lib/jquery',
        domReady: 'lib/domReady',
        main: 'app/main'
    },
});

// Start loading the main app file. Put all of
// your application logic in there.
require(['jquery', 'domReady!'],
    () => {
        require(['main']);
    });