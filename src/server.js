/**
 * external module
 */
const express = require("express")
const cors = require("cors")
const { join } = require("path")
const listEndpoints = require("express-list-endpoints")
const mongoose = require("mongoose")
/**
 * internal modules
 */
const {
	badRequest,
	notFound,
	forbidden,
	catchAllHandler,
} = require("./services/error")
const ArticleRouter = require("./services/articles")
const AuthorRouter = require("./services/authors")
/**
 * initializations
 */
const server = express()
const port = process.env.PORT || 2001

//server initialization process
server.use(cors())
server.use(express.json())
server.use("/articles", ArticleRouter)
server.use("/authors", AuthorRouter)
server.use(notFound)
server.use(forbidden)
server.use(badRequest)
server.use(catchAllHandler)

/**
 * start
 */
mongoose
	.connect(process.env.MONGO_CONNECTION, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then(
		server.listen(port, () => {
			console.log("Running on port", port)
		})
	)
	.catch((err) => console.log(err))
