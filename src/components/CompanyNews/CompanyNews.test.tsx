import { render, screen, waitFor } from "@testing-library/react";
import CompanyNews from "./CompanyNews";
import "@testing-library/jest-dom";
import { vi } from "vitest";

// Define the mock function type based on your hook's return type
type NewsItem = {
  id: string;
  headline: string;
  summary: string;
  datetime: number;
  url: string;
};

type UseCompanyNewsReturn = {
  news: NewsItem[];
  loading: boolean;
  error: string | null;
};

// Create the mock outside of the vi.mock call
const useCompanyNewsMock = vi.fn<() => UseCompanyNewsReturn>();

// Mock the module
vi.mock("../../hooks/useCompanyNews", () => ({
  useCompanyNews: () => useCompanyNewsMock(),
}));

describe("CompanyNews Component", () => {
  const mockSymbol = "AAPL";

  beforeEach(() => {
    useCompanyNewsMock.mockClear();
  });

  test("shows loading message while fetching news", () => {
    useCompanyNewsMock.mockReturnValue({
      news: [],
      loading: true,
      error: null,
    });

    render(<CompanyNews symbol={mockSymbol} />);
    expect(screen.getByText("Loading news...")).toBeInTheDocument();
  });

  test("shows error message when there's an error fetching news", () => {
    useCompanyNewsMock.mockReturnValue({
      news: [],
      loading: false,
      error: "Failed to fetch news",
    });

    render(<CompanyNews symbol={mockSymbol} />);
    expect(screen.getByText("Error: Failed to fetch news")).toBeInTheDocument();
  });

  test("shows news when fetched successfully", async () => {
    useCompanyNewsMock.mockReturnValue({
      news: [
        {
          id: "1",
          headline: "Company announces new product",
          summary: "A new product has been announced...",
          datetime: 1673468477,
          url: "http://example.com",
        },
      ],
      loading: false,
      error: null,
    });

    render(<CompanyNews symbol={mockSymbol} />);
    await waitFor(() => {
      expect(
        screen.getByText("Company announces new product")
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText("A new product has been announced...")
    ).toBeInTheDocument();
  });

  test("shows no news available when no news is returned", async () => {
    useCompanyNewsMock.mockReturnValue({
      news: [],
      loading: false,
      error: null,
    });

    render(<CompanyNews symbol={mockSymbol} />);
    expect(
      screen.getByText("No news available for the last year.")
    ).toBeInTheDocument();
  });
});
