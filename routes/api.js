/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const expect = require("chai").expect;
const mongoose = require("mongoose");
require("../models/books.js");

let Books = mongoose.model("Books");

module.exports = function (app) {
  app
    .route("/api/books")
    .get(function (req, res) {
      Books.find({}, (err, data) => {
        if (err) {
          res.send(err);
          return;
        }
        if (data.length === 0) {
          res.json([{}]);
          return;
        }

        let responseJSON = data.map((item) => {
          let commentcount = item.comments.length;
          return {
            _id: item._id,
            title: item.title,
            commentcount: commentcount,
          };
        });
        res.json(responseJSON);
      });
    })

    .post(function (req, res) {
      var title = req.body.title;

      let newBooks = new Books({
        title: req.body.title,
      });

      if (!req.body.title) {
        res.send("missing title");
        return;
      }

      newBooks.save((err, data) => {
        if (err) {
          res.send(err);
          return;
        }

        res.json({ title: data.title, _id: data._id });
      });
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
      Books.deleteMany({}, (err, data) => {
        if (err) {
          res.send(err);
          return;
        }
        if (!data.ok) {
          res.send("complete delete unsuccessful");
          return;
        }

        res.send("complete delete successful");
      });
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      var bookid = req.params.id;

      if (!req.params.id) {
        res.send("missing _id");
        return;
      }

      Books.findOne({ _id: req.params.id }, (err, data) => {
        if (err) {
          res.send(err);
          return;
        }
        if (!data) {
          res.send("no such book");
          return;
        }

        res.json(data);
      });
    })

    .post(function (req, res) {
      Books.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { comments: req.body.comment } },
        (err, data) => {
          if (err) {
            res.send(err);
            return;
          }
          if (!data) {
            res.send("no such book");
            return;
          }

          res.json(data);
        }
      );
    })

    .delete(function (req, res) {
      Books.deleteOne({ _id: req.params.id }, (err, data) => {
        if (err) {
          res.send(err);
          return;
        }
        if (!data) {
          res.send("no such book");
          return;
        }

        res.send("delete successful");
      });
    });
};
