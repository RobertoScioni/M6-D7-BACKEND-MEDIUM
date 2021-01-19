const { Schema } = require("mongoose")
const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")

const AuthorSchema = new Schema(
	{
		name: String,
		surname: String,
	},
	{ timestamps: true }
)
//{ type: "ObjectId", index: true }

module.exports = mongoose.model("Author", AuthorSchema)
