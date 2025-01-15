import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./styles/App.css";
import { SelectChangeEvent } from "@mui/material/Select";
//import CompanySelector from "./components/CompanySelector";
import { useFetchStockCompanies } from "./hooks/useFetchStockCompanies";
import RealTimeLineChart from "./components/RealTimeLineChart";
import ColumnChart from "./components/ColumnChart";
import useStockQuote from "./hooks/useStockQuote";
import { StockCompany } from "./types/Types";
import CompanySelectorAutocomplete from "./components/CompanySelectorAutocomplete";
import RecommendationTrendsBarChart from "./components/RecommendationTrendsBarChart";
import useDeviceInfo from "./hooks/useDeviceInfo";
import { Paper } from "@mui/material";
import CompanyNews from "./components/CompanyNews";
import ScrollSensitiveAvatar from "./components/ScrollSensitiveAvatar";
import { selectCompany } from "./reducers/companiesSlice";
import { RootState } from "./store/store";

function App() {
  const selectedCompany = useSelector(
    (state: RootState) => state.companies.selectedCompany
  );

  const { stockCompanies, companiesError } = useFetchStockCompanies();
  const { quote, loading, quoteError } = useStockQuote(selectedCompany);
  const { deviceType } = useDeviceInfo();

  const dispatch = useDispatch();

  if (companiesError || quoteError) {
    const err = companiesError ? companiesError : quoteError;
    return <div>Error: {err}</div>;
  }

  useEffect(() => {
    document.title = "Stock Data React demo by Ignacio";
  }, []);

  /*   const handleChange = (event: SelectChangeEvent<StockCompany>) => {
    dispatch(selectCompany(event.target.value as StockCompany));
  }; */

  const handleAutocompleteChange = (newValue: StockCompany | null) => {
    if (newValue) {
      dispatch(selectCompany(newValue));
    }
  };

  return (
    <div className="main-container">
      <div className="header">
        <h1>Stock Data</h1>
        <ScrollSensitiveAvatar />
      </div>
      {stockCompanies ? (
        <>
          {/* <CompanySelector
            stockCompanies={stockCompanies}
            label="Select company"
            selectedCompany={selectedCompany}
            handleSelectChange={handleChange}
          /> */}
          <CompanySelectorAutocomplete
            stockCompanies={stockCompanies}
            label="Select company"
            selectedCompany={selectedCompany}
            handleSelectChange={handleAutocompleteChange}
          />
          {quote && (
            <Paper elevation={3}>
              <div className="charts-row">
                <ColumnChart
                  title={
                    selectedCompany?.symbol +
                    " - " +
                    selectedCompany?.description
                  }
                  labels={["Opening", "High", "Low"]}
                  inputData={[quote.open, quote.high, quote.low]}
                />
                {selectedCompany?.symbol === quote.symbol ? (
                  <RealTimeLineChart
                    name={selectedCompany?.description}
                    symbol={selectedCompany?.symbol}
                    opening={quote.open}
                  />
                ) : (
                  <div>Loading real time line chart...</div>
                )}
              </div>
            </Paper>
          )}
          {(deviceType === "tablet" || deviceType === "desktop") &&
            selectedCompany && (
              <div className="charts-row-align-top">
                <RecommendationTrendsBarChart
                  symbol={selectedCompany?.symbol}
                />
                <CompanyNews symbol={selectedCompany?.symbol} />
              </div>
            )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;
