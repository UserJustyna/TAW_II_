import mongoose from "mongoose";
import * as _ from "lodash";
import Promise from "bluebird";
import applicationException from "../service/applicationException";
import mongoConverter from "../service/mongoConverter";
import uniqueValidator from "mongoose-unique-validator";

// Definicja schematu dla kategorii wydatków
const expenseCategorySchema = new mongoose.Schema(
  {
    monthBudgetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "monthBudget",
      required: true,
    },
    amount: { type: String, required: true },
    name: { type: String, required: true },
    checked: { type: Boolean, required: true, default: false },
    isGoal: { type: Boolean, required: true, default: false },
  },
  {
    collection: "expenseCategory",
  }
);

const ExpenseCategoryModel = mongoose.model(
  "expenseCategory",
  expenseCategorySchema
);

function createNewOrUpdate(expenseCategory) {
  return Promise.resolve()
    .then(() => {
      if (!expenseCategory.id) {
        return new ExpenseCategoryModel(expenseCategory)
          .save()
          .then((result) => {
            if (result) {
              return mongoConverter(result);
            }
          });
      } else {
        return ExpenseCategoryModel.findByIdAndUpdate(
          expenseCategory.id,
          _.omit(expenseCategory, "id"),
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
  const result = await ExpenseCategoryModel.findOne({ _id: id });
  if (result) {
    return mongoConverter(result);
  }
  throw applicationException.new(
    applicationException.NOT_FOUND,
    "User not found"
  );
}

async function removeById(id) {
  return await ExpenseCategoryModel.findByIdAndRemove(id);
}

async function getAllForMonthlyBudgetId(monthlyBudgetId) {
  return await ExpenseCategoryModel.find({ monthBudgetId: monthlyBudgetId });
}

async function updateIfChcecked(id) {
  return await ExpenseCategoryModel.findByIdAndUpdate(id, { checked: true });
}

export default {
  createNewOrUpdate: createNewOrUpdate,
  get: get,
  removeById: removeById,
  getAllForMonthlyBudgetId,
  updateIfChcecked,

  model: ExpenseCategoryModel,
};
