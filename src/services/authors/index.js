const express = require("express")
const mongoose = require("mongoose")
const AuthorSchema = require("./schema")
const AuthorRouter = express.Router()
const uniqid = require("uniqid")

AuthorRouter.get("/", async (req, res, next) => {
	try {
		const authors = await AuthorSchema.find()
		res.send(authors)
	} catch (error) {
		return next(error)
	}
})

AuthorRouter.get("/:id", async (req, res, next) => {
	try {
		const author = await AuthorSchema.findById(req.params.id)
		res.send(author)
	} catch (error) {
		return next(error)
	}
})

AuthorRouter.post("/", async (req, res, next) => {
	try {
		const newAuthor = new AuthorSchema(req.body)
		const { _id } = await newAuthor.save()

		res.status(201).send(_id)
	} catch (error) {
		next(error)
	}
})

AuthorRouter.put("/:id", async (req, res, next) => {
	try {
		const author = await AuthorSchema.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				runValidators: true,
				new: true,
			}
		)
		if (author) {
			res.send(author)
		} else {
			const error = new Error(`Author with id ${req.params.id} not found`)
			error.httpStatusCode = 404
			next(error)
		}
	} catch (error) {
		next(error)
	}
})

AuthorRouter.delete("/:id", async (req, res, next) => {
	try {
		const author = await AuthorSchema.findByIdAndDelete(req.params.id)
		if (author) {
			res.send("Deleted")
		} else {
			const error = new Error(`Author with id ${req.params.id} not found`)
			error.httpStatusCode = 404
			next(error)
		}
	} catch (error) {
		next(error)
	}
})

module.exports = AuthorRouter
