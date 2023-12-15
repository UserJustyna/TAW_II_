import business from "../business/business.container";
import applicationException from "../service/applicationException";
import admin from "../middleware/admin";
import auth from "../middleware/auth";

const monthBudgetEndpoint = (router) => {
  router.post(
    "/api/monthBudget/create",
    auth,
    async (request, response, next) => {
      try {
        const result = await business
          .getMonthBudgetManager(request)
          .createNewOrUpdate(request.body);
        response.status(200).send(result);
      } catch (error) {
        applicationException.errorHandler(error, response);
      }
    }
  );

  router.delete(
    "/api/monthBudget/logout/:monthBudgetId",
    auth,
    async (request, response, next) => {
      try {
        let result = await business
          .getMonthBudgetManager(request)
          .removeById(request.body.monthBudgetId);
        response.status(200).send(result);
      } catch (error) {
        applicationException.errorHandler(error, response);
      }
    }
  );

  router.get(
    "/api/monthBudget/get/:monthBudgetId",
    auth,
    async (request, response, next) => {
      try {
        const result = await business
          .getMonthBudgetManager(request)
          .getById(request.params.monthBudgetId);
        response.status(200).send(result);
      } catch (error) {
        applicationException.errorHandler(error, response);
      }
    }
  );

  router.get(
    "/api/monthBudget/getAll/:userId",
    auth,
    async (request, response, next) => {
      try {
        const result = await business
          .getMonthBudgetManager(request)
          .getAll(request.params.userId);
        response.status(200).send(result);
      } catch (error) {
        applicationException.errorHandler(error, response);
      }
    }
  );
};

export default monthBudgetEndpoint;
