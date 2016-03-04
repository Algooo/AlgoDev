# Preparing a new Grunt project

## Extend package.json
	npm install grunt --save-dev

## Create Gruntfile.js next to package.json
	```javascript
	module.exports = function(grunt) {

	  // Project configuration.
	  grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
    
	  });

	  // Load the plugins that provides tasks.
  
	  // Default task(s).
	  grunt.registerTask('default', ['']);

	};
	```

## Install Copy grunt package 
	npm install grunt-contrib-copy --save-dev

## Run Grunt
	grunt <taskname>