import business from "../business/business.container";
import applicationException from "../service/applicationException";
import admin from "../middleware/admin";
import auth from "../middleware/auth";

const expenseEndpoint = (router) => {
  router.post("/api/expense/create", auth, async (request, response, next) => {
    try {
      const result = await business
        .getExpenseManager(request)
        .createNewOrUpdate(request.body);
      response.status(200).send(result);
    } catch (error) {
      applicationException.errorHandler(error, response);
    }
  });

  router.delete(
    "/api/expense/logout/:expenseId",
    auth,
    async (request, response, next) => {
      try {
        let result = await business
          .getExpenseManager(request)
          .removeById(request.body.expenseBudgetId);
        response.status(200).send(result);
      } catch (error) {
        applicationException.errorHandler(error, response);
      }
    }
  );

  router.get(
    "/api/expense/get/:expenseId",
    auth,
    async (request, response, next) => {
      try {
        const result = await business
          .getExpenseManager(request)
          .get(request.params.expenseId);
        response.status(200).send(result);
      } catch (error) {
        applicationException.errorHandler(error, response);
      }
    }
  );
  router.get(
    "/api/expense/getAllExpense/:expenseCategoryId",
    auth,
    async (request, response, next) => {
      try {
        const result = await business
          .getExpenseManager(request)
          .getAllExpensesForAllCategory(request.params.expenseCategoryId);
        response.status(200).send(result);
      } catch (error) {
        applicationException.errorHandler(error, response);
      }
    }
  );
};

export default expenseEndpoint;
