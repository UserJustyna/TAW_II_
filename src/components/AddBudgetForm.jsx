import { useEffect, useRef, useState } from "react";

// rrd imports
import { Form, useFetcher, useParams } from "react-router-dom";

// library imports
import { CurrencyDollarIcon } from "@heroicons/react/24/solid";

import axios from "axios";

const AddBudgetForm = ({ refresh }) => {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  const formRef = useRef();
  const focusRef = useRef();
  const [date, setDate] = useState(""); //dodane
  const [amount, setAmount] = useState(""); //dodane
  const [name, setName] = useState(""); //tutaj nwm czy dobrze
  const { budgetId } = useParams();
  const [isGoal, setIsGoal] = useState(false);

  useEffect(() => {
    if (!isSubmitting) {
      formRef.current.reset();
      focusRef.current.focus();
    }
  }, [isSubmitting]);

  const sendData = () => {
    console.log(formRef.current);
    axios({
      method: "post",
      url: "http://localhost:3000/api/expenseCategory/create",
      data: { monthBudgetId: budgetId, amount: amount, name: name, isGoal },
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => {
        refresh();
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="form-wrapper">
      <h2 className="h3">Stwórz budżet</h2>
      <fetcher.Form method="post" className="grid-sm" ref={formRef}>
        <div className="grid-xs">
          <label htmlFor="newBudget">Nazwa budżetu</label>
          <input
            type="text"
            name="newBudget"
            id="newBudget"
            placeholder="e.g., Groceries"
            required
            ref={focusRef}
            value={name} //tutaj
            onChange={(e) => setName(e.target.value)} //ten input ?
          />
        </div>
        <div className="grid-xs">
          <label htmlFor="newBudgetAmount">Kwota</label>
          <input
            type="number"
            step="0.01"
            name="newBudgetAmount"
            id="newBudgetAmount"
            placeholder="e.g., $350"
            required
            inputMode="decimal"
            value={amount} //tutaj
            onChange={(e) => setAmount(e.target.value)} //ten input ?
          />
        </div>
        <div className="grid-xs">
          <label htmlFor="newExpenseBudget">Zaplanuj cel</label>
          <input
            type="checkbox"
            name="newFutureExpense"
            id="newFutureExpense"
            placeholder="e.g., Coffee"
            ref={focusRef}
            required
            value={isGoal} //tutaj
            onChange={(e) => setIsGoal(!isGoal)} //ten input ?
          />
        </div>
        <input type="hidden" name="_action" value="createBudget" />
        <button
          type="button"
          onClick={() => sendData()}
          className="btn btn--dark"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span>Podsumowanie ...</span>
          ) : (
            <>
              <span>Stwórz budżet</span>
              <CurrencyDollarIcon width={20} />
            </>
          )}
        </button>
      </fetcher.Form>
    </div>
  );
};
export default AddBudgetForm;
