altribute = 

	'Entity' : Entity
	'EntityType' : EntityType
	'Relation' : Relation
	'RelationType' : RelationType

	'utilities' : utilities

# If we are in node, export, otherwise expose to window object
if(typeof module != 'undefined')

	module.exports = altribute

else

	window.altribute = altribute