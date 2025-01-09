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
        backgroundColor: "rgba(75, 192, 192, 0.5)", // Column color
        borderColor: "rgba(75, 192, 192, 1)", // Border color
        borderWidth: 1, // Border width
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top", // Position of the legend
      },
      title: {
        display: true,
        text: "Intraday stock value", // Title of the chart
      },
    },
    scales: {
      x: {
        beginAtZero: true, // Start X-axis at zero
      },
      y: {
        beginAtZero: true, // Start Y-axis at zero
        ticks: {
          callback: (value) => `$${value}`, // Format Y-axis ticks with a dollar sign
        },
      },
    },
  };

  if (inputData?.length > 0) {
    return <Bar data={chartData} options={options} />;
  } else {
    return <p>Select a company to show data</p>;
  }
};

export default ColumnChart;
