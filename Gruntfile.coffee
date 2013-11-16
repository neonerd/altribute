module.exports = (grunt) ->

	grunt.initConfig({

		watch : 
			coffeescript :
				files : ['src/**/*.coffee']
				tasks : ['coffee']
				options : 
					spawn : true

		coffee :
			compile :
				options :
					bare : false
					join : true					
				files :
					"dist/altribute.js" : [
												'src/utilities.coffee',
												'src/generators/AttributeGenerator.coffee',
												'src/generators/SetAttributeGenerator.coffee',
												'src/generators/RandomAttributeGenerator.coffee',
												'src/EntityType.coffee',
												'src/Entity.coffee',
												'src/Relation.coffee',
												'src/RelationType.coffee',
												'src/bootstrap.coffee'
											]

	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-coffee');
	grunt.loadNpmTasks('grunt-contrib-watch');