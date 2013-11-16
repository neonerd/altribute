should = require "should"

altribute = require("../dist/altribute.js")

describe "altribute", ->

	describe "#Entity", ->

		it "should be defined", ->

			altribute.Entity.should.be.ok

		describe "#@type", ->

			it "should add entity type", ->

				altribute.Entity.type("Person", {age : 1})

			it "should throw Error when adding already existing Entity type", ->

				() ->
					altribute.Entity.type("Person", {age : 1})
					.should.throw()

		describe "#constructor", ->

			it "should fail when trying to construct an entity type that does not exist", ->

				() ->
					p = new altribute.Entity("bogus")
					.should.throw()

			it "should iterate Entity ID when constructing new one", ->

				lastId = altribute.Entity._idIterator
				p = new altribute.Entity("Person")
				newId = altribute.Entity._idIterator

				lastId.should.be.below(newId)

	describe "#EntityType", ->

		describe "#constructor", ->

			it "should not allow anything else than object literal", ->

				() ->
					et = new altribute.EntityType('asassa')
					.should.throw()




