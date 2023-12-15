import expenseDAO from "../DAO/expenseDAO";
import PasswordDAO from "../DAO/passwordDAO";
import TokenDAO from "../DAO/tokenDAO";
import UserDAO from "../DAO/userDAO";
import sha1 from "sha1";
import business from "../business/business.container";
import applicationException from "../service/applicationException";
import expenseCategoryDAO from "../DAO/expenseCategoryDAO";
import moment from "moment";

//zarządza wydatkami
function create(context) {
  const createNewOrUpdate = async (expense) => {
    const expenseCategory = await expenseCategoryDAO.get(
      expense.expenseCategoryId
    );

    // Pobiera pełną kategorię wydatków związaną z danym wydatkiem - cały budżet.
    const allExpenses = await expenseDAO.getAllForExpenseCategory(
      expense.expenseCategoryId
    );

    const allCost = allExpenses.reduce((acc, value) => {
      return acc + parseInt(value.amount);
    }, 0);

    // Oblicza dostępny budżet (stałą) dla danej kategorii wydatków.
    const constants = parseInt(expenseCategory.amount) - allCost;

    // Sprawdza, czy nowa kwota wydatku nie przekracza dostępnego budżetu.
    if (constants - expense.amount < 0) {
      throw applicationException.new(
        applicationException.NOT_FOUND,
        "Budget out off limit"
      );
    }

    expense.creationDate = moment().toISOString();

    // Tworzy lub aktualizuje wydatek w bazie danych.
    const result = await expenseDAO.createNewOrUpdate(expense);
    if (expense.futureDate) {
      const r = await expenseCategoryDAO.updateIfChcecked(
        expense.expenseCategoryId
      );
    }
    if (result) {
      return result;
    }
  };

  const getAllExpensesForAllCategory = async (expenseCategoryId) => {
    const result = await expenseDAO.getAllForExpenseCategory(expenseCategoryId);
    if (result) {
      return result;
    }
  };

  const getById = async (id) => {
    const result = await expenseDAO.get(id);
    if (result) {
      return result;
    }
  };

  const removeById = async (expenseId) => {
    const expense = await expenseDAO.removeById(expenseId);
    if (expense) {
      return expense;
    }
  };

  return {
    createNewOrUpdate: createNewOrUpdate,
    getById,
    removeById,
    getAllExpensesForAllCategory,
  };
}

export default {
  create: create,
};
