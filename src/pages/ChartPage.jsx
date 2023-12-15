import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const ChartPage = () => {
  const chartRef = useRef(null);
  const [expensesData, setExpensesData] = useState([]);
  const { monthBudgetId } = useParams();
  const [chartData, setChartData] = useState({});
  const [isReady, setIsReady] = useState(false);
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    // Funkcja do pobrania danych z backendu
    const fetchDataFromBackend = async () => {
      try {
        // Wysyłanie zapytania do backendu
        const response = await axios.get(
          "http://localhost:3000/api/expenseCategory/chart/" + monthBudgetId,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        // Ustawienie danych w stanie komponentu
        setExpensesData(response.data);

        const data = {
          labels: response?.data?.map((expense) => expense.name),
          datasets: [
            {
              label: "Podsumowanie miesięcznych wydatków",
              data: response?.data?.map((expense) => expense.spent),
              backgroundColor: response?.data?.map(
                (expense) =>
                  "#" + Math.floor(Math.random() * 16777215).toString(16)
              ),
              hoverOffSet: 4,
            },
          ],
        };
        const options = {
          tooltips: {
            enabled: false,
          },
          plugins: {
            datalabels: {
              formatter: (value, ctx) => {
                let sum = 0;
                let dataArr = ctx.chart.data.datasets[0].data;
                dataArr.map((data) => {
                  sum += data;
                });
                let percentage = ((value * 100) / sum).toFixed(0) + "%";
                return percentage;
              },
              color: "#fff",
            },
          },
        };
        console.log(data);
        setChartData(data);
        setChartOptions(options);
        setIsReady(true);

        console.log(response.data); // Sprawdź dane w konsoli
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataFromBackend(); // Wywołaj funkcję do pobrania danych po zamontowaniu komponentu
  }, []); // Pusta tablica oznacza, że useEffect będzie wywołany tylko raz po zamontowaniu komponentu

  return (
    <div>{isReady && <Pie data={chartData} options={chartOptions}></Pie>}</div>
  );
};

export default ChartPage;
