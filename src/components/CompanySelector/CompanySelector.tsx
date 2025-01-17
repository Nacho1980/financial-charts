import Select, { SelectChangeEvent } from "@mui/material/Select";
import { StockCompany } from "../../types/Types";
import { MenuItem } from "@mui/material";

interface CompanySelectorProps {
  stockCompanies: StockCompany[] | null;
  label: string;
  selectedCompany: StockCompany;
  handleSelectChange: (event: SelectChangeEvent<StockCompany>) => void;
}

/**
 * Component that displays a select input to choose a stock company.
 **/
const CompanySelector: React.FC<CompanySelectorProps> = ({
  label,
  stockCompanies,
  selectedCompany,
  handleSelectChange,
}) => {
  return (
    <div>
      <Select
        labelId="select-co"
        id="simple-select"
        value={selectedCompany || ""}
        label={label}
        onChange={handleSelectChange}
        renderValue={(selected) =>
          selected
            ? (selected as StockCompany).symbol +
              " - " +
              (selected as StockCompany).description
            : "Select Company"
        }
      >
        {stockCompanies?.map((co) => (
          <MenuItem key={co.symbol} value={co}>
            {co.description ? co.symbol + " - " + co.description : co.symbol}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};

export default CompanySelector;
