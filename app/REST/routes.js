import articleEndpoint from "./article.endpoint";
import expenseEndpoint from "./expense.endpoint";
import expenseCategoryEndpoint from "./expenseCategory.endpoint";
import monthBudgetEndpoint from "./monthBudget.endpoint";
import userEndpoint from "./user.endpoint";

const routes = function (router) {
  userEndpoint(router);
  monthBudgetEndpoint(router);
  expenseCategoryEndpoint(router);
  expenseEndpoint(router);
  articleEndpoint(router);
};

export default routes;
