const { Schema, model } = require("mongoose")
const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")

const ArticleSchema = new Schema(
	{
		headLine: {
			type: String,
			required: true,
		},
		subHead: {
			type: String,
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		author: { type: Schema.Types.ObjectId, ref: "Author" },
		cover: {
			type: String,
			required: true,
		},
		category: {
			type: String,
			required: true,
			lowercase: true,
		},
		reviews: [
			{
				_id: "string",
				text: "string",
				user: "string",
			},
		],
	},
	{ timestamps: true }
)
//{ type: "ObjectId", index: true }
const ArticleModel = model("Article", ArticleSchema)

ArticleSchema.plugin(mongoosePaginate)
ArticleSchema.static("findArticleWithAuthor", async (id) => {
	const article = await ArticleModel.findById(id).populate(author)
	return article
})
module.exports = mongoose.model("Article", ArticleSchema)
