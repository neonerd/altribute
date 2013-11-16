### 

	Random Attribute Generator

	options

		distribution:

			even -> takes either an Array of values or string defining range (e.g. "15-20")
			weighted -> takes an Array of Object Literals in format of { weight : X, value : Y }

###

class RandomAttributeGenerator extends AttributeGenerator

	constructor : (@options, @values) ->

		super(@options, @values)

		@preprocessValues()

		if(RandomAttributeGenerator.valuesValidation[@options.distribution] == undefined)
			throw new Error("Unknown distribution type!")

		if(!RandomAttributeGenerator.valuesValidation[@options.distribution](@values))
			throw new Error("Invalid values!")

	generate : (store) ->

		values = @values.concat([])

		# place for condition check

		@applyConditions(values, store)

		# if we are doing weighted random, recalculate the weights

		if(@options.distribution == 'weighted')
			@recalculateWeights(values)

		# ---

		return RandomAttributeGenerator.generation[@options.distribution](values)

	preprocessValues : ->

		if(utilities.isString(@values))

			tokens = @values.split("-")
			if(tokens.length != 2)
				throw new Error("Value string could not be preprocessed!")

			else

				min = parseInt(tokens[0])
				max = parseInt(tokens[1])

				newValues = []

				while(min<=max)

					newValues.push min
					min++

				@values = newValues

	# TODO: is this even necessary?
	recalculateWeights : (values) ->

		return true

	@valuesValidation :

		even : (values) ->
			return utilities.isArray(values)

		weighted : (values) ->
			return utilities.isArray(values)

	@generation : 

		even : (values) ->

			if(values.length == 0)
				throw new Error("No more possible values left!")

			return utilities.randomArrayValue(values)

		weighted : (values) ->

			if(values.length == 0)
				throw new Error("No more possible values left!")

			weightedArray = []

			for pair in values
				i = 0
				while(i<pair.weight)
					weightedArray.push pair.value
					i++

			return utilities.randomArrayValue(weightedArray)