class AttributeGenerator

	# --- PROTOTYPE

	@_getValueKeyByIndex : (values, index) ->

		for value, key in values

			if(utilities.isObject(value))

				if(value['index'] != undefined && value['index'] == index)
					return key
				if(value['value'] == index)
					return key

			else

				if(value == index)
					return key

		return false

	# --- END OF PROTOTYPE

	# --- INSTANCE

	constructor : (@options, @values) ->
		@conditions = {}

	generate : (store) ->
		return false

	# #addCondition helper to add and array of conditions
	addConditions : (value, conditions) ->

		for condition in conditions
			@addCondition(value, condition)

	# adds a condition to consider before generating a value
	addCondition : (value, condition) ->

		if(@conditions[value] == undefined)
			@conditions[value] = []

		parsedCondition = @parseCondition(condition)

		@conditions[value].push parsedCondition

	# parses a user-defined condition
	parseCondition : (condition) ->

		return condition

	# applies conditions to the values array
	# first param - array of values, has to be a clone, not a reference to the class property
	# second param - reference to the temporary data storage from #EntityType (should hold previously generated data)
	applyConditions : (values, data) ->

		for value, conditions of @conditions

			valuePassed = true

			for condition in conditions
				
				# evaluate the condition in own context
				# assing stored data to "e"
				do (condition) ->

					e = data
					evaluation = eval(condition)

					if(!evaluation)
						valuePassed = false

			if(!valuePassed)
				values.splice(AttributeGenerator._getValueKeyByIndex(values, value), 1)
				console.log values

	# permanently delete a value form this generator
	deleteValue : (index) ->

		for value, key in @values

			if(utilities.isString(value) && value == index)
				@values.splice(key, 1)
