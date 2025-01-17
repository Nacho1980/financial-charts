import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import companiesReducer from "./reducers/companiesSlice";
import App from "./App";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import * as useFetchStockCompaniesModule from "./hooks/useFetchStockCompanies";

// Mock all hooks directly using vi.fn()
vi.mock("./hooks/useFetchStockCompanies", () => ({
  useFetchStockCompanies: vi.fn(),
}));

vi.mock("./hooks/useStockQuote", () => ({
  default: (selectedCompany: any) => ({
    quote: selectedCompany
      ? {
          symbol: selectedCompany.symbol,
          open: 150.0,
          high: 155.0,
          low: 148.0,
        }
      : null,
    loading: false,
    quoteError: null,
  }),
}));

vi.mock("./hooks/useDeviceInfo", () => ({
  default: () => ({
    deviceType: "desktop",
  }),
}));

// Mock child components
vi.mock("./components/RealTimeLineChart/RealTimeLineChart", () => ({
  default: ({ symbol, name }: any) => (
    <div data-testid="real-time-chart">
      Real Time Chart for {symbol} - {name}
    </div>
  ),
}));

vi.mock("./components/ColumnChart/ColumnChart", () => ({
  default: ({ title, inputData }: any) => (
    <div data-testid="column-chart">
      Column Chart: {title}
      <div>Data: {inputData.join(", ")}</div>
    </div>
  ),
}));

vi.mock(
  "./components/RecommendationTrendsBarChart/RecommendationTrendsBarChart",
  () => ({
    default: ({ symbol }: any) => (
      <div data-testid="recommendation-chart">
        Recommendation Trends for {symbol}
      </div>
    ),
  })
);

vi.mock("./components/CompanyNews/CompanyNews", () => ({
  default: ({ symbol }: any) => (
    <div data-testid="company-news">News for {symbol}</div>
  ),
}));

vi.mock("./components/ScrollSensitiveAvatar/ScrollSensitiveAvatar", () => ({
  default: () => <div data-testid="avatar">Avatar</div>,
}));

// Mock MUI components
vi.mock("@mui/material", () => ({
  Paper: ({ children }: any) => <div data-testid="mui-paper">{children}</div>,
  Autocomplete: ({ onChange, options }: any) => (
    <div data-testid="mui-autocomplete">
      <select
        onChange={(e) => {
          const selectedOption = options.find(
            (opt: any) => opt.symbol === e.target.value
          );
          onChange(null, selectedOption);
        }}
      >
        <option value="">Select...</option>
        {options.map((opt: any) => (
          <option key={opt.symbol} value={opt.symbol}>
            {opt.description}
          </option>
        ))}
      </select>
    </div>
  ),
}));

describe("App Integration", () => {
  const renderApp = () => {
    const store = configureStore({
      reducer: {
        companies: companiesReducer,
      },
    });

    return render(
      <Provider store={store}>
        <App />
      </Provider>
    );
  };

  test("renders initial state and allows company selection", async () => {
    // Predefined mock data
    const mockStockCompanies = [
      { symbol: "AAPL", name: "Apple", description: "Apple" },
      { symbol: "GOOG", name: "Google", description: "Google" },
    ];
    const mockCompaniesError = null; // No error

    // Mock the implementation of useFetchStockCompanies
    (
      useFetchStockCompaniesModule.useFetchStockCompanies as vi.Mock
    ).mockReturnValue({
      stockCompanies: mockStockCompanies,
      companiesError: mockCompaniesError,
    });

    renderApp();

    // Check initial render
    expect(screen.getByText("Stock Data")).toBeInTheDocument();
    expect(screen.getByTestId("avatar")).toBeInTheDocument();

    // Verify company selector is present
    const selector = screen.getByTestId("mui-autocomplete");
    expect(selector).toBeInTheDocument();

    // Select a company
    const select = screen.getByRole("combobox");
    await userEvent.selectOptions(select, "AAPL");

    // Verify all components render with the selected company data
    await waitFor(() => {
      // Check Column Chart
      const columnChart = screen.getByTestId("column-chart");
      expect(columnChart).toBeInTheDocument();
      expect(columnChart).toHaveTextContent("AAPL - Apple");
      expect(columnChart).toHaveTextContent("150, 155, 148");

      // Check Real Time Chart
      const realTimeChart = screen.getByTestId("real-time-chart");
      expect(realTimeChart).toBeInTheDocument();
      expect(realTimeChart).toHaveTextContent(
        "Real Time Chart for AAPL - Apple"
      );

      // Check Recommendation Chart
      const recommendationChart = screen.getByTestId("recommendation-chart");
      expect(recommendationChart).toBeInTheDocument();
      expect(recommendationChart).toHaveTextContent("AAPL");

      // Check Company News
      const companyNews = screen.getByTestId("company-news");
      expect(companyNews).toBeInTheDocument();
      expect(companyNews).toHaveTextContent("AAPL");
    });
  });

  test("handles error states", async () => {
    // Ensure the mock implementation returns a valid value with error
    (
      useFetchStockCompaniesModule.useFetchStockCompanies as vi.Mock
    ).mockImplementationOnce(() => ({
      stockCompanies: null,
      companiesError: "Failed to fetch companies",
    }));

    renderApp();

    expect(
      screen.getByText("Error: Failed to fetch companies")
    ).toBeInTheDocument();
  });

  test("shows loading state when companies are not yet loaded", async () => {
    // Ensure the mock implementation returns a valid value with loading state
    (
      useFetchStockCompaniesModule.useFetchStockCompanies as vi.Mock
    ).mockImplementationOnce(() => ({
      stockCompanies: undefined, // Explicitly returning undefined for loading state
      companiesError: null,
    }));

    renderApp();

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
