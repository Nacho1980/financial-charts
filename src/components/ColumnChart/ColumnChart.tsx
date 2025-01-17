import React from "react";
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

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
interface ColumnChartProps {
  title: string;
  labels: string[];
  inputData: number[];
}

/**
 * Component that displays a column chart using Chart.js.
 **/
const ColumnChart: React.FC<ColumnChartProps> = ({
  title,
  labels,
  inputData,
}) => {
  // Data for the chart
  const chartData = {
    labels: labels, // X-axis labels
    datasets: [
      {
        label: title,
        data: inputData, // Data points for the columns
        backgroundColor: [
          "rgba(75, 192, 192, 0.5)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 99, 132, 0.6)",
        ], // Column color
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
        ], // Border color
        borderWidth: 1, // Border width
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const, // Position of the legend
      },
      title: {
        display: false,
        text: "Intraday stock value", // Title of the chart
      },
    },
    scales: {
      x: { beginAtZero: true, type: "category" as const },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (tickValue: string | number) {
            return `$${tickValue}`;
          },
        },
      },
    },
  };

  return (
    <div className="column-chart">
      {inputData?.length > 0 ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p>No data to display</p>
      )}
    </div>
  );
};

export default ColumnChart;
