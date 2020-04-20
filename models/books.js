const mongoose = require("mongoose");
const shortid = require("shortid");
const Schema = require("mongoose").Schema;

let booksSchema = new Schema(
  {
    title: { type: String, required: true },
    comments: { type: [String], default: [] },
    _id: { type: String, default: shortid.generate },
  },
  { collection: "Books" }
);

mongoose.model("Books", booksSchema);
