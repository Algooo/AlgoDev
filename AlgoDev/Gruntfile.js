module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ["./js"],
        copy: {
            bowerComponents: {
                files: [
                    { expand: true, cwd: 'bower_components/jquery/dist', src: ['jquery.js'], dest: 'js/lib' },
                    { expand: true, cwd: 'bower_components/requirejs', src: ['require.js'], dest: 'js/lib' },
                    { expand: true, cwd: 'bower_components/domReady', src: ['domReady.js'], dest: 'js/lib' }
                ]
            },
            es6: {
                files: [
                    { expand: true, cwd: 'es6', src: ['**'], dest: 'js/' },
                ]
            }
        }
    });

    // Load the plugins that provides tasks.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task(s).
    grunt.registerTask('default', ['']);
    grunt.registerTask('dev', ['clean', 'copy:es6', 'copy:bowerComponents']);

};