import business from "../business/business.container";
import applicationException from "../service/applicationException";
import admin from "../middleware/admin";
import auth from "../middleware/auth";

const articleEndpoint = (router) => {
  router.post("/api/article/create", admin, async (request, response, next) => {
    try {
      const result = await business
        .getArticleManager(request)
        .createNewOrUpdate(request.body);
      response.status(200).send(result);
    } catch (error) {
      applicationException.errorHandler(error, response);
    }
  });

  router.delete(
    "/api/article/:articleId",
    admin,
    async (request, response, next) => {
      try {
        let result = await business
          .getArticleManager(request)
          .removeById(request.params.articleId);
        response.status(200).send(result);
      } catch (error) {
        applicationException.errorHandler(error, response);
      }
    }
  );

  router.get(
    "/api/article/get/:articleId",
    auth,
    async (request, response, next) => {
      try {
        const result = await business
          .getArticleManager(request)
          .get(request.params.articleId);
        response.status(200).send(result);
      } catch (error) {
        applicationException.errorHandler(error, response);
      }
    }
  );
  router.get("/api/article/getAll", auth, async (request, response, next) => {
    try {
      const result = await business.getArticleManager(request).getAll();
      response.status(200).send(result);
    } catch (error) {
      applicationException.errorHandler(error, response);
    }
  });
};

export default articleEndpoint;
