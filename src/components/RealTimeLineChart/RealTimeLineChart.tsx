import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

interface RealTimeChartProps {
  name: string; // Company name (e.g., Apple Inc.)
  symbol: string; // Company symbol (e.g., AAPL for Apple)
  opening: number; // Opening price of the stock
}

/**
 * Component that displays a real-time line chart using Chart.js.
 * Note: This component generates random data for demonstration purposes.
 **/
const RealTimeLineChart: React.FC<RealTimeChartProps> = ({
  name,
  symbol,
  opening,
}) => {
  const [timestamps, setTimestamps] = useState<string[]>([]); // X-axis labels
  const [prices, setPrices] = useState<number[]>([]); // Y-axis data
  /*const websocketRef = useRef<WebSocket | null>(null); // WebSocket reference

  // API error on websocket connection
     useEffect(() => {
    // Open WebSocket connection
    const socket = new WebSocket(`wss://ws.finnhub.io?token=${API_KEY}`);
    websocketRef.current = socket;

    socket.onopen = () => {
      // Subscribe to the stock symbol
      socket.send(JSON.stringify({ type: "subscribe", symbol }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "trade") {
        const trade = data.data[0];
        const time = new Date(trade.t).toLocaleTimeString();
        const price = trade.p;

        setTimestamps((prev) => [...prev.slice(-29), time]); // Keep last 30 timestamps
        setPrices((prev) => [...prev.slice(-29), price]); // Keep last 30 prices
      }
    };

    socket.onerror = (error) => console.error("WebSocket error:", error);

    return () => {
      // Cleanup WebSocket
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, [symbol, API_KEY]); */
  useEffect(() => {
    setPrices([]);
    setTimestamps([]);
  }, [symbol]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const generateRandomPrice = () => {
      setTimestamps((prevTimestamps) => {
        const currentTime = new Date().toLocaleTimeString();
        return [...prevTimestamps.slice(-29), currentTime]; // Keep the last 30 timestamps
      });

      setPrices((prevPrices) => {
        const lastPrice =
          prevPrices.length > 0 ? prevPrices[prevPrices.length - 1] : opening; // Default starting price
        const randomChange = (Math.random() - 0.5) * 2; // Random value between -1 and 1
        const newPrice = Math.max(0, lastPrice + randomChange); // Ensure price is non-negative
        return [...prevPrices.slice(-29), newPrice]; // Keep the last 30 prices
      });
    };

    // Start generating random data at intervals
    intervalId = setInterval(generateRandomPrice, 1000); // Update every second

    return () => {
      // Cleanup interval on unmount
      clearInterval(intervalId);
    };
  }, [opening]);

  // Chart data and options
  const data = {
    labels: timestamps,
    datasets: [
      {
        label: `${name} (${symbol})`,
        data: prices,
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        title: {
          display: true,
          text: "Price",
        },
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="real-time-line-chart">
      <Line data={data} options={options} />
    </div>
  );
};

export default RealTimeLineChart;
