###

	Structure key types:

		- set (set programatically)
		- random ()

###

class AttributeHook

	constructor : () ->

	run : (current, generators, data) ->

		return true

class DeleteAttributeHook

	run : (current, generator, data) ->

		generator.deleteValue(current)


class EntityType

	constructor : (@structure) ->

		# contains attribute generators for each structure key
		@generators = {}
		# temporary data holder (flushed after each generation)
		@store = {}

		# very simple check of structure validity
		if(!(typeof @structure == 'object'))

			throw new Error("EntityType structure has to be an object literal!")

		# parse the structure
		@parseStructure(@generators, @structure)

	# parses the structure key-value pairs and maps them into the parent variable
	parseStructure : (parent, structure) ->

		for key, value of structure

			if(typeof value == 'object')

				if(value._type != undefined)
					# this key-value pair is a strictly defined attribute
					generatorClass = null

					switch value._type
						when "random" then generatorClass = RandomAttributeGenerator
						when "set" then generatorClass = SetAttributeGenerator
						else throw new Error("Unknown attribute _type!")

					# initialize the generator
					generator = new generatorClass(value._options, value._values)

					# add conditions if any

					if(value._conditions)

						for targetValue, conditionDetails of value._conditions

							generator.addConditions(targetValue, conditionDetails)

					# prepare the key
					parent[key] =
						'generator' : generator
						'hooks' : {}

					# if we have hooks
					if(value._hooks)

						for hookDescription in value._hooks

							hook = null

							switch hookDescription.type
								when "delete" then hook = DeleteAttributeHook
								else throw new Error("Unknown hook type!")

							if(parent[key]['hooks'][hookDescription.on] == undefined)
								parent[key]['hooks'][hookDescription.on] = []

							parent[key]['hooks'][hookDescription.on].push(new hook()) 

				else
					# this key-value pair is a sub-attribute
					parent[key] = {}
					@parseStructure(parent[key], value)

	generate : (data) ->

		@store = data
		@_generate(@generators, data)

	_generate : (parent, data) ->

		for key, value of parent

			if(value.generator instanceof AttributeGenerator)

				# run "before" hooks
				if(value.hooks.before)

					for hook in value.hooks.before
						hook.run(null, value.generator, data)

				# generate the value via generator
				data[key] = value.generator.generate(@store)
			
				# run "after" hooks
				if(value.hooks.after)

					for hook in value.hooks.after
						hook.run(data[key], value.generator, data)

			else
				# continue recursively
				data[key] = {}
				@_generate(value, data[key])





