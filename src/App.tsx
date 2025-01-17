import { useSelector, useDispatch } from "react-redux";
import "./styles/App.css";
//import CompanySelector from "./components/CompanySelector";
import { useFetchStockCompanies } from "./hooks/useFetchStockCompanies";
import RealTimeLineChart from "./components/RealTimeLineChart/RealTimeLineChart";
import ColumnChart from "./components/ColumnChart/ColumnChart";
import useStockQuote from "./hooks/useStockQuote";
import { StockCompany } from "./types/Types";
import CompanySelectorAutocomplete from "./components/CompanySelector/CompanySelectorAutocomplete";
import RecommendationTrendsBarChart from "./components/RecommendationTrendsBarChart/RecommendationTrendsBarChart";
import useDeviceInfo from "./hooks/useDeviceInfo";
import { Paper } from "@mui/material";
import CompanyNews from "./components/CompanyNews/CompanyNews";
import ScrollSensitiveAvatar from "./components/ScrollSensitiveAvatar/ScrollSensitiveAvatar";
import { selectCompany } from "./reducers/companiesSlice";
import { RootState } from "./store/store";

function App() {
  const selectedCompany = useSelector(
    (state: RootState) => state.companies.selectedCompany
  );

  const { stockCompanies, companiesError } = useFetchStockCompanies();
  const { quote, quoteError } = useStockQuote(selectedCompany);
  const { deviceType } = useDeviceInfo();

  const dispatch = useDispatch();

  /*   const handleChange = (event: SelectChangeEvent<StockCompany>) => {
    dispatch(selectCompany(event.target.value as StockCompany));
  }; */

  const handleAutocompleteChange = (newValue: StockCompany | null) => {
    if (newValue) {
      dispatch(selectCompany(newValue));
    }
  };

  if (companiesError || quoteError) {
    const err = companiesError ? companiesError : quoteError;
    return <div>Error: {err}</div>;
  }

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
