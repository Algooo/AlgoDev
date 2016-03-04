module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
        bowerComponents: {
            files: [
                { expand: true, cwd: 'bower_components/jquery/dist', src: ['jquery.js'], dest: 'scripts/vendor' },
                { expand: true, cwd: 'bower_components/requirejs', src: ['require.js'], dest: 'scripts/vendor' },
                { expand: true, cwd: 'bower_components/domReady', src: ['domReady.js'], dest: 'scripts/vendor' }
            ]
        }
    }
  });

  // Load the plugins that provides tasks.
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task(s).
  grunt.registerTask('default', ['']);
  grunt.registerTask('copyDev', ['copy:bowerComponents']);

};