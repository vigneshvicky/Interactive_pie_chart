module.exports = function(grunt){
	 "use strict";
	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        typescript: {
		    base: {
		      src: ['../interactive_pie_chart/js/MathLogic.ts','../interactive_pie_chart/js/BasicLogic.ts'],
		      dest: '../interactive_pie_chart/minified_flies',
		      options: {
		       module: 'amd', //or commonjs 
		      }
		    }
		  },
        htmlhint: {
            build: {
                options: {
                    'tag-pair': true,
// Force tags to have a closing pair
                    'tagname-lowercase': true,
// Force tags to be lowercase
                    'attr-lowercase': true,
// Force attribute names to be lowercase e.g. <div id="header"> is invalid
                    'attr-value-double-quotes': true,
// Force attributes to have double quotes rather than single
                    'doctype-first': true,
// Force the DOCTYPE declaration to come first in the document
                    'spec-char-escape': true,
// Force special characters to be escaped
                    'id-unique': true,
// Prevent using the same ID multiple times in a document
                    'head-script-disabled': true,
// Prevent script tags being loaded in the  for performance reasons
                    'style-disabled': true
// Prevent style tags. CSS should be loaded through 
                },
                src: ['../interactive_pie_chart/index.html']
            }
        },
        browserify: {
		  dist: {
		    files: {			  
		      '../interactive_pie_chart/dist/js/base.browserify.js': ['../interactive_pie_chart/js/script.js']
			  
		    }
		  }
		},
		uglify: {
			options: {
		      banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
		        '<%= grunt.template.today("yyyy-mm-dd") %> */'
		    },
		    build: {
		        files: {
		            '../interactive_pie_chart/dist/js/mathLogic.min.js': ['../interactive_pie_chart/minified_files/MathLogic.js'],
					'../interactive_pie_chart/dist/js/basicLogic.min.js': ['../interactive_pie_chart/minified_files/BasicLogic.js']
		        }
		    }
		},
		express: {
		    all: {
		        options: {
		            bases: ['../interactive_pie_chart/index.html'],
		            port: 8080,
		            hostname: "0.0.0.0",
		            livereload: true
		        }
		    }
		},
        watch: {
            html: {
                files: ['../interactive_pie_chart/index.html'],
                tasks: ['htmlhint']
            },
            ts_to_js: { // <--- Watch for change on example and rebuild
		        files: ['../interactive_pie_chart/js/MathLogic.ts','../interactive_pie_chart/js/BasicLogic.ts'],
		        tasks: ['typescript']
		    },
		    js_browserify:{
		    	files: ['../interactive_pie_chart/js/script.js'],
		        tasks: ['browserify']
		    },
		    js_uglify:{
		    	 files: ['../interactive_pie_chart/minified_files/MathLogic.js','../interactive_pie_chart/minified_files/BasicLogic.js'],
		         tasks: ['uglify']
		    }/*,
		    all: {
	            files: '../index.html',
	            options: {
	                livereload: true
	        	},
	        	tasks:['express']
	    	}*/
        }
    });

    grunt.registerTask('default', []);

};
/*
source <(curl -s https://angularbootcamp.com/c9a2cli)

ng serve --host 0.0.0.0 --port 8080 --live-reload-port 8081

https://gist.github.com/IamAdamJowett/460098316f4004b89df6c6a1f8a64c52


https://community.c9.io/t/anyone-using-c9-to-do-the-angular2-project/7078/8
*/
