// rrd imports
import { Link, useLoaderData, useNavigate } from "react-router-dom";

// library
import { toast } from "react-toastify";

// components
import AddExpenseForm from "../components/AddExpenseForm";
import BudgetItem from "../components/BudgetItem";
import Table from "../components/Table";

// helpers
import { createExpense, deleteItem, getAllMatchingItems } from "../helpers";
import AddMonthlyBudgetForm from "../components/AddMonthlyBudgetForm";
import { useState, useEffect } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import moment from "moment";

const MonthlyBudgetPage = () => {
  const month = new Array(
    "Styczeń",
    "Luty",
    "Marzec",
    "Kwiecień",
    "Maj",
    "Czerwiec",
    "Lipiec",
    "Sierpień",
    "Wrzesień",
    "Październik",
    "Listopad",
    "Grudzień"
  );
  const [budgets, setBudgets] = useState([]);
  const [dataReady, setDataReady] = useState(false);
  const navigate = useNavigate();
  const getBudgetsForUser = () => {
    const userId = jwtDecode(localStorage.getItem("token")).userId;
    axios
      .get("http://localhost:3000/api/monthBudget/getAll/" + userId, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setBudgets(response.data);
        setDataReady(true);
        console.log(budgets);
        console.log(response);
      });
  };

  const getMonthName = (date) => {
    const monthNumber = moment(date).month();
    return month[monthNumber];
  };

  useEffect(() => {
    getBudgetsForUser();
  }, []);

  const refresh = () => {
    getBudgetsForUser();
  };

  return (
    <div className="grid-lg">
      <h1 className="h2">Witaj! Wybierz co chcesz zrobić</h1>
      <div className="flex-lg">
        <AddMonthlyBudgetForm refresh={refresh} />
      </div>
      {dataReady && (
        <div>
          {budgets.map((budget, index) => {
            return (
              <div key={index}>
                {budget.month}
                <Link to={`/dashboard/${budget.id}`} className="btn btn--dark">
                  {" "}
                  {getMonthName(budget.month)}
                </Link>
              </div>
            );
          })}
        </div>
      )}
      <div className="button2">
        <button
          onClick={() => navigate("/adminPanel")}
          className="btn btn--dark"
        >
          Przejdź do panelu admina
        </button>
      </div>
    </div>
  );
};
export default MonthlyBudgetPage;
