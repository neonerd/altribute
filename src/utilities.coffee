utilities =

	isString : (str) ->

		if (typeof str == 'string' || str instanceof String)

			return true

		else

			return false

	isArray : (arr) ->

		return (Object.prototype.toString.call( arr ) == '[object Array]')

	isObject : (obj) ->

		return (typeof obj == 'object')

	randomArrayValue : (arr) ->

		return arr[Math.floor(Math.random() * arr.length)]

	arrayIntersect : (a, b) ->

		ai = 0
		bi = 0
		result = []

		while( ai < a.length && bi < b.length )
		    if (a[ai] < b[bi] )
		    	ai++
		    else if(a[ai] > b[bi] )
		    	bi++
		    else
		    	result.push(a[ai]);
		    	ai++;
		    	bi++;


		return result;

	arraysIntersect : (arrs) ->

		result = []

		for arr, index in arrs

			# if we have no result yet
			if(result.length == 0)

				if(arrs[index + 1] != undefined)
					result = utilities.arrayIntersect(arrs[index], arrs[index + 1])

			else

				if(arrs[index + 1] != undefined)
					result = utilities.arrayIntersect(result, arrs[index + 1])

		return result