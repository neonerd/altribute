class RelationType extends EntityType


	constructor : (@structure) ->

		# contains attribute generators for each structure key
		@generators = {}
		# temporary data holder (flushed after each generation)
		@store = {}

		# very simple check of structure validity
		if(!(typeof @structure == 'object'))

			throw new Error("EntityType structure has to be an object literal!")

