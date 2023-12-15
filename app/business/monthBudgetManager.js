import monthBudgetDAO from "../DAO/monthBudgetDAO";
import PasswordDAO from "../DAO/passwordDAO";
import TokenDAO from "../DAO/tokenDAO";
import UserDAO from "../DAO/userDAO";
import applicationException from "../service/applicationException";
import sha1 from "sha1";

//Udostępnia funkcje związane z zarządzaniem budżetem miesięcznym.
function create(context) {
  //Tworzy nowy budżet miesięczny lub aktualizuje istniejący.
  const createNewOrUpdate = async (monthBudget) => {
    const result = await monthBudgetDAO.createNewOrUpdate(monthBudget);
    if (result) {
      return result;
    }
  };
  // Pobiera budżet miesięczny na podstawie identyfikatora.
  const getById = async (id) => {
    const result = await monthBudgetDAO.get(id);
    if (result) {
      return result;
    }
  };
  // Pobiera wszystkie budżety miesięczne powiązane z danym użytkownikiem.
  const getAll = async (id) => {
    const result = await monthBudgetDAO.getAllByUserId(id);
    if (result) {
      return result;
    }
  };
  //Usuwa budżet miesięczny na podstawie identyfikatora.
  const removeById = async (monthBudgetId) => {
    const monthBudget = await monthBudgetDAO.removeById(monthBudgetId);
    if (monthBudget) {
      return monthBudget;
    }
  };
  return {
    createNewOrUpdate: createNewOrUpdate,
    getById,
    removeById,
    getAll,
  };
}

export default {
  create: create,
};
