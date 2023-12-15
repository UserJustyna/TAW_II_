import { useEffect, useRef, useState } from "react";

// rrd imports
import { useFetcher, useParams } from "react-router-dom";

// library imports
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import DatePicker from "react-datepicker";
import axios from "axios";
import moment from "moment";

const AddExpenseForm = ({ budgets, refresh2 }) => {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";
  const formRef = useRef();
  const { budgetId } = useParams();
  const focusRef = useRef();
  const [amount, setAmount] = useState(""); //dodane
  const [name, setName] = useState(""); //tutaj nwm czy dobrze bo w dao było
  const [budget, setBudget] = useState(JSON.stringify(budgets?.at(0)));
  const [isFuture, setIsFuture] = useState(false); //tutaj nwm czy dobrze bo w dao było
  const [month, setMonth] = useState([]);
  const [date, setDate] = useState(null);

  useEffect(() => {
    if (!isSubmitting) {
      // clear form
      formRef.current.reset();
      // reset focus
      focusRef.current.focus();
    }
    getMonthBudget();
  }, [isSubmitting]); //tutaj też

  const filterDate = (date) => {
    const newMonth = new Date(month.month);
    console.log(newMonth);
    return date.getMonth() === newMonth.getMonth();
  };

  const sendData = () => {
    console.log(budgets);
    axios({
      method: "post",
      url: "http://localhost:3000/api/expense/create",
      data: {
        expenseCategoryId: JSON.parse(budget)._id,
        name: JSON.parse(budget).isGoal ? "Oszczędności" : name,
        amount: amount,
        futureDate: date ? moment(date).format("YYYY-MM-DD") : null,
      },
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => {
        refresh2();
      })
      .catch((error) => console.log(error));
  };

  const getMonthBudget = () => {
    axios
      .get("http://localhost:3000/api/monthBudget/get/" + budgetId, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setMonth(response.data);
        console.log(budgets);
        console.log(response);
      });
  };

  return (
    <div className="form-wrapper">
      <h2 className="h3">
        Dodaj nowy{" "}
        <span className="accent">
          {budgets.length === 1 && `${budgets.map((budg) => budg.name)}`}
        </span>{" "}
        Expense
      </h2>
      <fetcher.Form method="post" className="grid-sm" ref={formRef}>
        <div className="expense-inputs">
          {!JSON.parse(budget).isGoal && (
            <div className="grid-xs">
              <label htmlFor="newExpense">Nazwa wydatku</label>
              <input
                type="text"
                name="newExpense"
                id="newExpense"
                placeholder="e.g., Coffee"
                ref={focusRef}
                required
                value={name} //tutaj
                onChange={(e) => setName(e.target.value)} //ten input ?
              />
            </div>
          )}

          <div className="grid-xs">
            <label htmlFor="newExpenseAmount">Kwota</label>
            <input
              type="number"
              step="0.01"
              inputMode="decimal"
              name="newExpenseAmount"
              id="newExpenseAmount"
              placeholder="e.g., 3.50"
              required
              value={amount} // tutaj
              onChange={(e) => setAmount(e.target.value)} //ten input ?
            />
          </div>
        </div>
        <div className="grid-xs">
          <label htmlFor="newExpenseBudget">Kategoria budżetu</label>
          <select
            onChange={(e) => {
              console.log(e.target.value);
              setBudget(e.target.value);
            }}
            name="newExpenseBudget"
            id="newExpenseBudget"
            defaultValue={JSON.stringify(budgets?.at(0))}
            value={budget}
            required
          >
            {budgets
              .sort((a, b) => a.createdAt - b.createdAt)
              .map((budget) => {
                return (
                  <option
                    selected
                    key={budget._id}
                    value={JSON.stringify(budget)}
                  >
                    {budget.name}
                  </option>
                );
              })}
          </select>
        </div>
        {!JSON.parse(budget).isGoal && (
          <div className="grid-xs">
            <label htmlFor="newExpenseBudget">Zaplanuj przyszły wydatek</label>
            <input
              type="checkbox"
              name="newFutureExpense"
              id="newFutureExpense"
              placeholder="e.g., Coffee"
              ref={focusRef}
              value={isFuture} //tutaj
              onChange={(e) => setIsFuture(e.target.value)} //ten input ?
            />
          </div>
        )}
        {isFuture && (
          <div className="grid-xs">
            <label htmlFor="newExpenseBudget">Zaplanuj przyszły wydatek</label>
            <DatePicker
              showDayMonthYearPicker
              name="selectedDate"
              dateFormat="dd/MM/yyyy"
              selected={date}
              onChange={(e) => setDate(e)}
              filterDate={filterDate}
            />
          </div>
        )}
        <input type="hidden" name="_action" value="createExpense" />
        <button
          onClick={() => sendData()}
          type="submit"
          className="btn btn--dark"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span>Podsumowanie ...</span>
          ) : (
            <>
              <span>Dodaj wydatek</span>
              <PlusCircleIcon width={20} />
            </>
          )}
        </button>
      </fetcher.Form>
    </div>
  );
};
export default AddExpenseForm;
