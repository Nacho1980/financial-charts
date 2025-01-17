import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CompanySelectorAutocomplete from "./CompanySelectorAutocomplete";
import { StockCompany } from "../../types/Types";
import { vi } from "vitest";

describe("CompanySelectorAutocomplete", () => {
  const mockCompanies: StockCompany[] = [
    {
      currency: "USD",
      description: "Apple Inc.",
      displaySymbol: "AAPL",
      figi: "figi1",
      mic: "XNAS",
      symbol: "AAPL",
      type: "Equity",
    },
    {
      currency: "USD",
      description: "Alphabet Inc.",
      displaySymbol: "GOOGL",
      figi: "figi2",
      mic: "XNAS",
      symbol: "GOOGL",
      type: "Equity",
    },
  ];
  const mockHandleSelectChange = vi.fn();

  test("renders Loading when companies are not available", () => {
    render(
      <CompanySelectorAutocomplete
        stockCompanies={null}
        label="Select a Company"
        selectedCompany={null}
        handleSelectChange={mockHandleSelectChange}
      />
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders company options", async () => {
    render(
      <CompanySelectorAutocomplete
        stockCompanies={mockCompanies}
        label="Select a Company"
        selectedCompany={null}
        handleSelectChange={mockHandleSelectChange}
      />
    );
    const input = screen.getByLabelText("Select a Company");
    await userEvent.click(input);
    expect(screen.getByText("Apple Inc. (AAPL)")).toBeInTheDocument();
    expect(screen.getByText("Alphabet Inc. (GOOGL)")).toBeInTheDocument();
    // Select an option
    const option = screen.getByText("Apple Inc. (AAPL)");
    await userEvent.click(option);

    // Verify that the callback is triggered
    expect(mockHandleSelectChange).toHaveBeenCalledWith(mockCompanies[0]);
  });
});
