import { useState, useEffect } from "react";
import { StockCompany } from "../types/Types";
import { API_KEY } from "../utils/Constants";

export const useFetchStockCompanies = () => {
  const [stockCompanies, setStockCompanies] = useState<StockCompany[]>([]);
  const [initialSelectedCompany, setInitialSelectedCompany] =
    useState<StockCompany | null>(null);
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
        setInitialSelectedCompany(sortedData[0] || null);
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

  return { stockCompanies, initialSelectedCompany, companiesError };
};
