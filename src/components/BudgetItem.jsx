// rrd imports
import { Form, Link, useParams } from "react-router-dom";

// library imports
import { BanknotesIcon, TrashIcon } from "@heroicons/react/24/outline";

import { useState, useEffect } from "react";

// helper functions
import {
  calculateSpentByBudget,
  formatCurrency,
  formatPercentage,
} from "../helpers";

import axios from "axios";

const BudgetItem = ({ budget, showDelete = false, refreshing }) => {
  const { id, name, amount, color, isGoal } = budget;
  const [budgets, setBudgets] = useState([]);
  const [spent, setSpent] = useState(0);
  const [refresh, setRefresh] = useState(refreshing);
  const [expenses, setExpenses] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const getBudgetsForUser = () => {
    axios
      .get("http://localhost:3000/api/expenseCategory/expense/" + budget._id, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setBudgets(response.data);
        console.log("budżet", budgets);
        console.log(response);
        setSpent(response.data.spend);
        //getBudgetsExpense(response.data.id);
        setIsReady(true);
      });
  };

  const getBudgetsExpense = (id) => {
    axios
      .get("http://localhost:3000/api/expense/getAllExpense/" + id, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setExpenses(response.data);

        console.log("budżet", budgets);
        console.log(response);
        setSpent(response.data.spend);
      });
  };

  const checkDate = () => {};

  useEffect(() => {
    getBudgetsForUser();
  }, [refreshing]);

  return (
    <>
      {isReady && (
        <div
          className="budget"
          style={
            budget.checked || isGoal
              ? { borderColor: isGoal ? "gold" : "red" }
              : {}
          }
        >
          <div className="progress-text">
            <h3>{name}</h3>
            <p>{formatCurrency(amount)} Budżet</p>
          </div>
          <progress max={amount} value={spent}>
            {formatPercentage(spent / amount)}
          </progress>
          <div className="progress-text">
            <small>
              {formatCurrency(spent)}
              {isGoal ? " wpłacono" : " wydano"}
            </small>
            <small>{formatCurrency(amount - spent)} pozostało</small>
          </div>
          {showDelete ? (
            <div className="flex-sm">
              <Form
                method="post"
                action="delete"
                onSubmit={(event) => {
                  if (
                    !confirm(
                      "Are you sure you want to permanently delete this budget?"
                    )
                  ) {
                    event.preventDefault();
                  }
                }}
              >
                <button type="submit" className="btn">
                  <span>Usuń budżet</span>
                  <TrashIcon width={20} />
                </button>
              </Form>
            </div>
          ) : (
            <div className="flex-sm">
              <Link to={`/expenses/${budget._id}`} className="btn">
                <span>Zobacz szczegóły</span>
                <BanknotesIcon width={20} />
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
};
export default BudgetItem;
