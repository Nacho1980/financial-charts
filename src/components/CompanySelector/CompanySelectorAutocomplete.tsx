import { StockCompany } from "../../types/Types";
import { Autocomplete, TextField } from "@mui/material";

interface CompanySelectorAutocompleteProps {
  stockCompanies: StockCompany[] | null;
  label: string;
  selectedCompany: StockCompany | null;
  handleSelectChange: (stockCo: StockCompany | null) => void;
}

/**
 * Component that displays an Autocomplete input to choose a stock company.
 **/
const CompanySelectorAutocomplete: React.FC<
  CompanySelectorAutocompleteProps
> = ({ label, stockCompanies, selectedCompany, handleSelectChange }) => {
  if (!stockCompanies) {
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        <Autocomplete
          options={stockCompanies}
          getOptionLabel={(option) =>
            `${option.description} (${option.symbol})`
          } // Display the company name in the dropdown
          isOptionEqualToValue={(option, value) =>
            option.symbol === value.symbol
          } // Compare objects correctly
          value={selectedCompany} // Bind the selected value to the state
          onChange={(event, newValue) => handleSelectChange(newValue)} // Update state when a selection is made
          renderInput={(params) => (
            <TextField {...params} label={label} variant="outlined" />
          )}
        />
      </div>
    );
  }
};

export default CompanySelectorAutocomplete;
