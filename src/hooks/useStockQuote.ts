import { useState, useEffect } from "react";
import { API_KEY } from "../utils/Constants";
import { StockCompany, StockQuote } from "../types/Types";

interface UseStockQuoteResult {
  quote: StockQuote | null;
  loading: boolean;
  quoteError: string | null;
}

/**
 * Custom hook that fetches the stock quote for a company symbol.
 * @param co The stock company.
 * @returns An object with the stock quote, loading state, and error message.
 */
const useStockQuote = (co: StockCompany | null): UseStockQuoteResult => {
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuote = async () => {
      if (!co) {
        return;
      }
      setLoading(true);
      setQuoteError(null);

      try {
        const response = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${co.symbol}&token=${API_KEY}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch quote for symbol: ${co.symbol}`);
        }

        const data = await response.json();
        setQuote({
          current: data.c, // Current price
          high: data.h, // High price of the day
          low: data.l, // Low price of the day
          open: data.o, // Open price of the day
          previousClose: data.pc, // Previous close price
          symbol: co.symbol, // Symbol for the stock
        });
      } catch (err: any) {
        setQuoteError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, [co]);

  return { quote, loading, quoteError };
};

export default useStockQuote;
