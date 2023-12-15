// Importuje moduł DAO (Data Access Object) do komunikacji z bazą danych dotyczącą kategorii wydatków.
import articleDAO from "../DAO/articleDAO";

// Importuje moduł DAO do komunikacji z bazą danych dotyczącą budżetów miesięcznych.
import monthBudgetDAO from "../DAO/monthBudgetDAO";
// Importuje moduł DAO do komunikacji z bazą danych dotyczącą wydatków.
import expenseDAO from "../DAO/expenseDAO";

import applicationException from "../service/applicationException";

//Zarządza kategoriami wydatków.
function create(context) {
  //Tworzy nową kategorię wydatków lub aktualizuje istniejącą
  const createNewOrUpdate = async (article) => {
    // Tworzy lub aktualizuje kategorię wydatków w bazie danych.
    const result = await articleDAO.createNewOrUpdate(article);
    if (result) {
      return result;
    }
  };
  //Pobiera kategorię wydatków na podstawie identyfikatora.
  const getById = async (id) => {
    const result = await articleDAO.get(id);
    if (result) {
      return result;
    }
  };
  //Usuwa kategorię wydatków na podstawie identyfikatora.
  const removeById = async (articleId) => {
    const article = await articleDAO.removeById(articleId);
    if (article) {
      return article;
    }
  };

  const getAll = async () => {
    const result = await articleDAO.getAll();
    if (result) {
      return result;
    }
  };

  // Zwraca zestaw funkcji zarządzających kategoriami wydatków.
  return {
    createNewOrUpdate: createNewOrUpdate,
    getById,
    removeById,
    getAll,
  };
}
// Eksportuje funkcję create jako obiekt.
export default {
  create: create,
};
