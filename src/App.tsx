import { useState, useEffect, useRef } from "react";
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

function App() {
  const [selectedCompany, setSelectedCompany] = useState<StockCompany>(null);

  const { stockCompanies, initialSelectedCompany, companiesError } =
    useFetchStockCompanies();
  const { quote, loading, quoteError } = useStockQuote(selectedCompany);
  const { deviceType, orientation } = useDeviceInfo();

  if (companiesError || quoteError) {
    const err = companiesError ? companiesError : quoteError;
    return <div>Error: {err}</div>;
  }

  useEffect(() => {
    document.title = "Stock Data React demo by Ignacio";
  }, []);
  useEffect(() => {
    if (initialSelectedCompany) {
      setSelectedCompany(initialSelectedCompany);
    }
  }, [initialSelectedCompany]);

  const handleChange = (event: SelectChangeEvent<StockCompany>) => {
    setSelectedCompany(event.target.value as StockCompany);
  };

  const handleAutocompleteChange = (newValue: StockCompany | null) => {
    if (newValue) {
      setSelectedCompany(newValue);
    }
  };

  return (
    <div className="main-container">
      <div className="header">
        <h1>Stock Data</h1>
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
                <div className="column-chart">
                  <ColumnChart
                    title={
                      selectedCompany.symbol +
                      " - " +
                      selectedCompany.description
                    }
                    labels={["Opening", "High", "Low"]}
                    inputData={[quote.open, quote.high, quote.low]}
                  />
                </div>
                {selectedCompany.symbol === quote.symbol ? (
                  <div className="real-time-line-chart">
                    <RealTimeLineChart
                      name={selectedCompany?.description}
                      symbol={selectedCompany?.symbol}
                      opening={quote.open}
                    />
                  </div>
                ) : (
                  <div>Loading real time line chart...</div>
                )}
              </div>
            </Paper>
          )}
          {(deviceType === "tablet" || deviceType === "desktop") && (
            <div className="charts-row">
              <RecommendationTrendsBarChart symbol={selectedCompany?.symbol} />
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
