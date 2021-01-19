const express = require("express")
const mongoose = require("mongoose")
const q2m = require("query-to-mongo")
const ArticleSchema = require("./schema")
const ArticleRouter = express.Router()
const uniqid = require("uniqid")

ArticleRouter.get("/", async (req, res, next) => {
	try {
		const query = q2m(req.query)
		const articles = await ArticleSchema.find()
			.sort(query.options.sort)
			.skip(query.options.offset)
			.limit(query.options.size)
			.populate("author")
		res.send(articles)
	} catch (error) {
		return next(error)
	}
})

ArticleRouter.get("/:id", async (req, res, next) => {
	try {
		const article = await ArticleSchema.findArticleWithAuthors(req.params.id)
		res.send(article)
	} catch (error) {
		return next(error)
	}
})

ArticleRouter.post("/", async (req, res, next) => {
	try {
		const newArticle = new ArticleSchema(req.body)
		const { _id } = await newArticle.save()

		res.status(201).send(_id)
	} catch (error) {
		next(error)
	}
})

ArticleRouter.put("/:id", async (req, res, next) => {
	try {
		const article = await ArticleSchema.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				runValidators: true,
				new: true,
			}
		)
		if (article) {
			res.send(article)
		} else {
			const error = new Error(`Article with id ${req.params.id} not found`)
			error.httpStatusCode = 404
			next(error)
		}
	} catch (error) {
		next(error)
	}
})

ArticleRouter.delete("/:id", async (req, res, next) => {
	try {
		const article = await ArticleSchema.findByIdAndDelete(req.params.id)
		if (article) {
			res.send("Deleted")
		} else {
			const error = new Error(`Article with id ${req.params.id} not found`)
			error.httpStatusCode = 404
			next(error)
		}
	} catch (error) {
		next(error)
	}
})

//#region reviews

ArticleRouter.post("/:id", async (req, res, next) => {
	let review = { ...req.body }
	review._id = uniqid()
	try {
		const article = await ArticleSchema.findByIdAndUpdate(
			req.params.id,
			{
				$push: {
					reviews: review,
				},
			},
			{ runValidators: true, new: true }
		)
		if (article) {
			res.send(article)
		} else {
			const error = new Error(`Article with id ${req.params.id} not found`)
			error.httpStatusCode = 404
			next(error)
		}
	} catch (error) {
		next(error)
	}
})

ArticleRouter.delete("/:id/reviews/:ReviewID", async (req, res, next) => {
	try {
		const article = await ArticleSchema.findByIdAndUpdate(
			req.params.id,
			{
				$pull: {
					reviews: { _id: req.params.ReviewID },
				},
			},
			{ runValidators: true, new: true }
		)
		if (article) {
			res.send("Deleted")
		} else {
			const error = new Error(`Article with id ${req.params.id} not found`)
			error.httpStatusCode = 404
			next(error)
		}
	} catch (error) {
		next(error)
	}
})

ArticleRouter.get("/:id/reviews", async (req, res, next) => {
	try {
		const article = await ArticleSchema.findById(req.params.id)
		res.send(article.reviews)
	} catch (error) {
		return next(error)
	}
})

ArticleRouter.get("/:id/reviews/:reviewId", async (req, res, next) => {
	try {
		const article = await ArticleSchema.findById(req.params.id)
		res.send(
			article.reviews.filter((review) => review._id === req.params.reviewId)
		)
	} catch (error) {
		return next(error)
	}
})

//#endregion

module.exports = ArticleRouter
