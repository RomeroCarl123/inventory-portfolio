import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function StockChart({ products }) {
  const data = {
    labels: products.map((p) => p.name),
    datasets: [
      {
        label: "Stock Quantity",
        data: products.map((p) => p.stock),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#e2e8f0",
        },
      },
      title: {
        display: true,
        text: "Stock Trends",
        color: "#f8fafc",
      },
      tooltip: {
        backgroundColor: "#0f172a",
        titleColor: "#f8fafc",
        bodyColor: "#e2e8f0",
      },
    },
    scales: {
      x: {
        ticks: { color: "#cbd5e1" },
        grid: { color: "rgba(148,163,184,0.2)" },
      },
      y: {
        ticks: { color: "#cbd5e1" },
        grid: { color: "rgba(148,163,184,0.2)" },
      },
    },
  };

  return <Bar data={data} options={options} />;
}
