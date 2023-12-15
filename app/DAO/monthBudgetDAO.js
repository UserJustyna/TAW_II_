import mongoose from "mongoose";
import * as _ from "lodash";
import Promise from "bluebird";
import applicationException from "../service/applicationException";
import mongoConverter from "../service/mongoConverter";
import uniqueValidator from "mongoose-unique-validator";

const monthBudgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    amount: { type: String, required: true },
    month: { type: String, required: true },
    year: { type: String, required: true },
  },
  {
    collection: "monthBudget",
  }
);

monthBudgetSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

const MonthBudgetModel = mongoose.model("monthBudget", monthBudgetSchema);

function createNewOrUpdate(monthBudget) {
  return Promise.resolve()
    .then(() => {
      if (!monthBudget.id) {
        return new MonthBudgetModel(monthBudget).save().then((result) => {
          if (result) {
            return mongoConverter(result);
          }
        });
      } else {
        return MonthBudgetModel.findByIdAndUpdate(
          monthBudget.id,
          _.omit(monthBudget, "id"),
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
  const result = await MonthBudgetModel.findOne({ _id: id });
  if (result) {
    return mongoConverter(result);
  }
  throw applicationException.new(
    applicationException.NOT_FOUND,
    "User not found"
  );
}

async function getAllByUserId(id) {
  const result = await MonthBudgetModel.find({ userId: id });
  if (result) {
    return mongoConverter(result);
  }
  throw applicationException.new(
    applicationException.NOT_FOUND,
    "User not found"
  );
}

async function removeById(id) {
  return await MonthBudgetModel.findByIdAndRemove(id);
}

export default {
  createNewOrUpdate,
  get,
  removeById,
  getAllByUserId,

  model: MonthBudgetModel,
};
