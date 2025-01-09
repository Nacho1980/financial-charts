import { useState, useEffect, useRef } from "react";
import "./App.css";
import ColumnChart from "./ColumnChart";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { CompanyQuote, StockCompany } from "./Types";
import { MenuItem } from "@mui/material";

function App() {
  const [stockCompanies, setStockCompanies] = useState<StockCompany[] | null>(
    null
  );
  const [companyStockData, setCompanyStockData] = useState<CompanyQuote | null>(
    null
  );
  const companyStockDataRef = useRef<CompanyQuote | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [previousValues, setPreviousValues] = useState<number[]>([]);
  const previousValuesRef = useRef<number[]>([]);
  const [opening, setOpening] = useState<number>(0);
  const [lowValue, setLowValue] = useState<number>(0);
  const [highValue, setHighValue] = useState<number>(0);
  const API_KEY = "ctv86fhr01qh15ouq450ctv86fhr01qh15ouq45g";

  useEffect(() => {
    const fetchStockCompanies = async () => {
      try {
        const response = await fetch(
          `https://finnhub.io/api/v1/stock/symbol?exchange=US&mic=XNYS&token=${API_KEY}`
        );
        const data: StockCompany[] = await response.json();
        console.log("Retrieved this number of companies: ", data.length);
        const sortedData = data.sort((a, b) =>
          a.symbol.localeCompare(b.symbol)
        );
        setStockCompanies(sortedData);
        setSelectedCompany(sortedData[0].symbol);
      } catch (error) {
        console.error("Error fetching stock companies:", error);
      }
    };

    fetchStockCompanies();
    document.title = "Stock Data React demo by Ignacio";
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

  useEffect(() => {
    // Whenever companyStockData changes, update the ref
    companyStockDataRef.current = companyStockData;
  }, [companyStockData]);
  useEffect(() => {
    previousValuesRef.current = previousValues;
  }, [previousValues]);

  useEffect(() => {
    // Update the opening value whenever selectedCompany changes
    const initOp = getRandomInt(0, 200);
    setOpening(initOp);
    console.log(`OPENING value for company: ${selectedCompany} => ${initOp}`);

    // Set the low and high values based on the new opening value
    setLowValue(getRandomInt(0, initOp));
    setHighValue(getRandomInt(initOp, 200));

    // Start interval to fetch stock data every 5 seconds
    const intervalId = setInterval(() => {
      //Getting new values
      // Generate stock values based on previous values or random data
      const o: number = opening; // Opening value
      console.log("!!!!Calculating current");
      console.log(
        "Previous values length: " + previousValuesRef.current.length
      );
      const c: number =
        previousValuesRef.current.length > 0
          ? addOrSubstractRandom(previousValuesRef.current[0])
          : getRandomInt(lowValue, 200);
      console.log("INTERVAL - Current value:", c);
      const l: number = c < lowValue ? c : lowValue;
      setLowValue(l);
      const h: number = c > highValue ? c : highValue;
      setHighValue(h);

      const data: CompanyQuote = {
        o: o,
        l: l,
        c: c,
        h: h,
      };
      console.log(
        `INTERVAL - Generated stock data for selected company (${selectedCompany}):`,
        data
      );

      setCompanyStockData(data);
      companyStockDataRef.current = data;

      //Updating previous values
      console.log("Updating previous values with new value:", c);
      const prevVals = previousValuesRef.current;
      const updatedPreviousVals = c
        ? [c, ...prevVals].slice(0, 3) // Limit to the last 3 values
        : prevVals;
      console.log("Old previous values:", prevVals);
      console.log("New previous values:", updatedPreviousVals);
      previousValuesRef.current = updatedPreviousVals;
    }, 5000);

    // Cleanup interval on component unmount or when selectedCompany changes
    return () => clearInterval(intervalId);
  }, [selectedCompany]); // This hook runs when selectedCompany changes

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedCompany(event.target.value as string);
  };

  const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const addOrSubstractRandom = (value: number) => {
    const tmp =
      Math.random() > 0.5
        ? value + getRandomInt(0, 10)
        : value - getRandomInt(0, 10);
    if (tmp < 0) {
      return 0;
    } else {
      return tmp;
    }
  };

  const openingValue: number = companyStockDataRef?.current?.o | 0;
  const currentValue: number = companyStockDataRef?.current?.c | 0;
  const currentValue1: number = previousValuesRef.current[0] | currentValue;
  const currentValue2: number = previousValuesRef.current[1] | currentValue;
  console.log("Current value:", currentValue);
  console.log("Opening value:", openingValue);
  console.log("Current value 1:", currentValue1);
  console.log("Current value 2:", currentValue2);

  return (
    <div>
      <h1>Stock Data</h1>
      {stockCompanies ? (
        <>
          <div>
            <Select
              labelId="select-co"
              id="simple-select"
              value={selectedCompany}
              label="Select a company"
              onChange={handleChange}
            >
              {stockCompanies.map((co) => (
                <MenuItem key={co.symbol} value={co.symbol}>
                  {co.description
                    ? co.symbol + " - " + co.description
                    : co.symbol}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div>
            <ColumnChart
              title="Evolution"
              labels={[
                "Opening",
                "Low",
                "High",
                "Current - 2",
                "Current - 1",
                "Current",
              ]}
              inputData={[
                openingValue,
                lowValue,
                highValue,
                currentValue2,
                currentValue1,
                currentValue,
              ]}
            />
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;
