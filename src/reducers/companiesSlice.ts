import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StockCompany } from "../types/Types";

interface CompaniesState {
  list: StockCompany[]; // List of companies
  selectedCompany: StockCompany | null; // Selected company
}

const initialState: CompaniesState = {
  list: [],
  selectedCompany: null,
};

const companiesSlice = createSlice({
  name: "companies",
  initialState,
  reducers: {
    setCompanies: (state, action: PayloadAction<StockCompany[]>) => {
      state.list = action.payload;
    },
    selectCompany: (state, action: PayloadAction<StockCompany>) => {
      state.selectedCompany = action.payload;
    },
    clearSelectedCompany: (state) => {
      state.selectedCompany = null;
    },
  },
});

export const { setCompanies, selectCompany, clearSelectedCompany } =
  companiesSlice.actions;
export default companiesSlice.reducer;
