import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { StockCompany } from "../types/Types";
import { API_KEY } from "../utils/Constants";
import { selectCompany, setCompanies } from "../reducers/companiesSlice";

/**
 * Custom hook that fetches stock companies from the Finnhub API.
 * @returns An object with the stock companies and an error message.
 */
export const useFetchStockCompanies = () => {
  const dispatch = useDispatch();
  const [stockCompanies, setStockCompanies] = useState<StockCompany[]>([]);
  const [companiesError, setCompaniesError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStockCompanies = async () => {
      try {
        const response = await fetch(
          `https://finnhub.io/api/v1/stock/symbol?exchange=US&mic=XNYS&token=${API_KEY}`
        );
        const data: StockCompany[] = await response.json();
        const sortedData = data.sort((a, b) =>
          a.symbol.localeCompare(b.symbol)
        );
        setStockCompanies(sortedData);
        dispatch(setCompanies(data));
        dispatch(selectCompany(sortedData[0] || null));
      } catch (error) {
        console.error("Error fetching stock companies:", error);
        setCompaniesError("Failed to fetch stock companies");
      }
    };

    fetchStockCompanies();
  }, []);

  /*useEffect(() => {
     const fetchCompanyStockData = async () => {
    try {
      // console.log(`Fetching stock data for selected company: ${selectedCompany}`);
      // const response = await fetch(
      //   `https://finnhub.io/api/v1/quote?symbol=$selectedCompany&token=${API_KEY}`
      // );
      // const data:CompanyQuote = await response.json();
      // console.log(`Retrieved stock data for selected company ($selectedCompany):`, data);
      setCompanyStockData(data);
    } catch (error) {
      console.error(`Error fetching stock data for selected company ($selectedCompany): error`);
    }
  }; */

  return { stockCompanies, companiesError };
};
