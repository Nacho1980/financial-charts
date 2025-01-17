import React from "react";
import { Bar } from "react-chartjs-2";
import { useRecommendationTrends } from "../../hooks/useRecommendationTrends";

interface RecommendationTrendChartProps {
  symbol: string; // Company symbol (e.g., AAPL for Apple)
}

/**
 * Component that displays a bar chart of recommendation trends (like buy, hold, sell...)
 * for a given company.
 **/
const RecommendationTrendsBarChart: React.FC<RecommendationTrendChartProps> = ({
  symbol,
}) => {
  const { trends, loading, error } = useRecommendationTrends(symbol);

  const chartData = {
    labels: trends.map((trend) => trend.period),
    datasets: [
      {
        label: "Strong Buy",
        data: trends.map((trend) => trend.strongBuy),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Buy",
        data: trends.map((trend) => trend.buy),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Hold",
        data: trends.map((trend) => trend.hold),
        backgroundColor: "rgba(255, 206, 86, 0.6)",
      },
      {
        label: "Sell",
        data: trends.map((trend) => trend.sell),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
      {
        label: "Strong Sell",
        data: trends.map((trend) => trend.strongSell),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  // Plugin to set chart background color
  const chartBackgroundPlugin = {
    id: "chartBackground",
    beforeDraw: (chart: any) => {
      const ctx = chart.ctx;
      ctx.save();
      ctx.fillStyle = "#f0f2f5"; // Set the background color to #f0f2f5
      ctx.fillRect(0, 0, chart.width, chart.height);
      ctx.restore();
    },
  };

  return (
    <div className="recommendation-trends-chart">
      <h2>Recommendation Trends for {symbol}</h2>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && trends.length > 0 && (
        <Bar
          data={chartData}
          options={chartOptions}
          plugins={[chartBackgroundPlugin]}
        />
      )}
      {!loading && !error && trends.length === 0 && (
        <p>No recommendation trends available for {symbol}</p>
      )}
    </div>
  );
};

export default RecommendationTrendsBarChart;
