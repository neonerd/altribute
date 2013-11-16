class Relation

	# --- STATIC

	@_types = {}
	@_relations = {}
	@_idIterator = {}

	# parses the type literal into EntityType
	@type : (name, type) ->

		if(@_types[name] != undefined)
			throw new Error("Relation type named '" + name + "' already exists!")

		if(!(type instanceof RelationType))
			throw new Error("Type is not an instance of RelationType")

		@_types[name] = type

		return true

	# find relations of entity
	@findRelationsByEntity : (entityId) ->

		found = []
		
		for id, relation of @_relations
			
			if(relation.hasEntity(entityId))
				found.push(relation)

		return found

	# find relations of multiple entities
	@findRelationsByEntities : (ids) ->

		relations = []

		for id in ids
			relations.push @findRelationsByEntity(id)

		return utilities.arraysIntersect(relations)

	# --- END OF STATIC	

	constructor : (type) ->

		if(Relation._types[type] == undefined)
			throw new Error("Relation type '" + type + "' does not exist!")

		# assing type
		@_type = type

		# assign an ID, store in the static container
		@_id = Relation._idIterator
		Relation._idIterator++
		Relation._relations[@_id] = @

		@_entities = []

		return true

	getId : () ->

		return @_id

	addEntity : (entityId, group) ->

		if(group == undefined)
			@_entities.push [entityId]

		else

			if(@_entities[group] == undefined)
				throw new Error("Entity group " + group + " does not exist in this relation!")

			@_entities[group].push entityId

	hasEntity : (entityId) ->

		for group in @_entities

			if(group.indexOf(entityId) != -1)
				return true

		return false