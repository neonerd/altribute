class Entity

	# -- PROTOTYPE

	# object containing different entity types
	@_types : {}
	# object containing entities
	@_entities : {}
	# self explaining
	@_idIterator : 1

	# parses the type literal into EntityType
	@type : (name, type) ->

		if(@_types[name] != undefined)
			throw new Error("Entity type named '" + name + "' already exists!")

		if(!(type instanceof EntityType))
			throw new Error("Type is not an instance of EntityType")

		@_types[name] = type

		return true

	# --- END OF PROTOTYPE

	# --- INSTANCE

	constructor : (type) ->

		if(Entity._types[type] == undefined)
			throw new Error("Entity type '" + type + "' does not exist!")

		# assing type
		@_type = type

		# assign an ID, store in the static container
		@_id = Entity._idIterator
		Entity._idIterator++
		Entity._entities[@_id] = @

		# generate and assign values
		Entity._types[type].generate(@)

	getId : () ->

		return @_id

	getRelations : () ->

		return Relation.findRelationsByEntity( @getId() )


	# -- END OF INSTANCE