"use strict";

import monthBudgetManager from "./monthBudgetManager";
import userManager from "./user.manager";
import expenseCategoryManger from "./expenseCategoryManger";
import expenseManager from "./expenseManager";
import articleManager from "./article.manager";

function getter(manager, request) {
  return function () {
    return manager.create(request, this);
  };
}

export default {
  getExpenseCategoryManager: getter(expenseCategoryManger),
  getExpenseManager: getter(expenseManager),
  getMonthBudgetManager: getter(monthBudgetManager),
  getUserManager: getter(userManager),
  getArticleManager: getter(articleManager),
};
