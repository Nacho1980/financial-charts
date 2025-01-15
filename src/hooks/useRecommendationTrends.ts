import { useState, useEffect } from "react";
import { API_KEY } from "../utils/Constants";

/**
 * Custom hook that fetches recommendation trends for a stock symbol.
 * @param symbol The stock symbol.
 * @returns An object with the recommendation trends, loading state, and error message.
 */
export const useRecommendationTrends = (symbol: string) => {
  const [trends, setTrends] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://finnhub.io/api/v1/stock/recommendation?symbol=${symbol}&token=${API_KEY}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch recommendation trends.");
        }
        const data = await response.json();
        setTrends(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (symbol) fetchTrends();
  }, [symbol]);

  return { trends, loading, error };
};
