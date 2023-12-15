import mongoose from "mongoose";
import * as _ from "lodash";
import Promise from "bluebird";
import applicationException from "../service/applicationException";
import mongoConverter from "../service/mongoConverter";
import uniqueValidator from "mongoose-unique-validator";
import moment from "moment";

const expenseSchema = new mongoose.Schema(
  {
    expenseCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "expenseCategory",
      required: true,
    },
    name: { type: String, required: true },
    amount: { type: String, required: true },
    creationDate: {
      type: String,
      required: true,
    },
    futureDate: {
      type: String,
      required: false,
      default: null,
    },
  },
  {
    collection: "expense",
  }
);

const ExpenseModel = mongoose.model("expense", expenseSchema);

function createNewOrUpdate(expense) {
  return Promise.resolve()
    .then(() => {
      if (!expense.id) {
        return new ExpenseModel(expense).save().then((result) => {
          if (result) {
            return mongoConverter(result);
          }
        });
      } else {
        return ExpenseModel.findByIdAndUpdate(
          expense.id,
          _.omit(expense, "id"),
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
  const result = await ExpenseModel.findOne({ _id: id });
  if (result) {
    return mongoConverter(result);
  }
  throw applicationException.new(
    applicationException.NOT_FOUND,
    "User not found"
  );
}

async function removeById(id) {
  return await ExpenseModel.findByIdAndRemove(id);
}
async function getAllForExpenseCategory(expenseCategoryId) {
  return await ExpenseModel.find({ expenseCategoryId });
}

export default {
  createNewOrUpdate,
  get,
  removeById,
  getAllForExpenseCategory,

  model: ExpenseModel,
};
