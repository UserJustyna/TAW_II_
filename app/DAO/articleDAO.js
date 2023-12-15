import mongoose from "mongoose";
import * as _ from "lodash";
import Promise from "bluebird";
import applicationException from "../service/applicationException";
import mongoConverter from "../service/mongoConverter";
import uniqueValidator from "mongoose-unique-validator";

// Definicja schematu dla kategorii wydatków
const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  {
    collection: "article",
  }
);

const ArticleModel = mongoose.model("article", articleSchema);

function createNewOrUpdate(article) {
  return Promise.resolve()
    .then(() => {
      if (!article.id) {
        return new ArticleModel(article).save().then((result) => {
          if (result) {
            return mongoConverter(result);
          }
        });
      } else {
        return ArticleModel.findByIdAndUpdate(
          article.id,
          _.omit(article, "id"),
          { new: true }
        );
      }
    })
    .catch((error) => {
      if ("ValidationError" === error.name) {
        error = error.errors[Object.keys(error.errors)[0]];
        throw applicationException.new(
          applicationException.BAD_REQUEST,
          error.message
        );
      }
      throw error;
    });
}

async function get(id) {
  const result = await ArticleModel.findOne({ _id: id });
  if (result) {
    return mongoConverter(result);
  }
  throw applicationException.new(
    applicationException.NOT_FOUND,
    "User not found"
  );
}

async function getAll() {
  const result = await ArticleModel.find({});
  if (result) {
    return mongoConverter(result);
  }
  throw applicationException.new(
    applicationException.NOT_FOUND,
    "User not found"
  );
}

async function removeById(id) {
  return await ArticleModel.findByIdAndRemove(id);
}

export default {
  createNewOrUpdate: createNewOrUpdate,
  get: get,
  removeById: removeById,
  getAll,

  model: ArticleModel,
};
