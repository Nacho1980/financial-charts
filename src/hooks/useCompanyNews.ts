import { useState, useEffect } from "react";
import { CompanyNews } from "../types/Types";
import { API_KEY } from "../utils/Constants";

const FINNHUB_API_URL = "https://finnhub.io/api/v1";

export const useCompanyNews = (
  symbol: string,
  from: string,
  to: string
): {
  news: CompanyNews[];
  loading: boolean;
  error: string | null;
} => {
  const [news, setNews] = useState<CompanyNews[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${FINNHUB_API_URL}/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${API_KEY}`
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data: CompanyNews[] = await response.json();
        setNews(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (symbol && from && to) {
      fetchNews();
    }
  }, [symbol, from, to]);

  return { news, loading, error };
};
