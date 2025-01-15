import { useState, useEffect } from "react";
import { CompanyNews } from "../types/Types";
import { API_KEY } from "../utils/Constants";

const FINNHUB_API_URL = "https://finnhub.io/api/v1";

/**
 * Custom hook that fetches news about a company.
 * @param symbol The company symbol.
 * @param from The start date of the news.
 * @param to The end date of the news.
 * @returns An object with the news, loading state, and error message.
 */
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
