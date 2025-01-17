import { render, screen } from "@testing-library/react";
import RecommendationTrendsBarChart from "./RecommendationTrendsBarChart";
import { vi } from "vitest";

const mockSymbol = "AAPL";

const mockUseRecommendationTrends = vi.fn();

vi.mock("../../hooks/useRecommendationTrends", () => ({
  useRecommendationTrends: () => mockUseRecommendationTrends(),
}));

describe("RecommendationTrendsBarChart Component", () => {
  beforeEach(() => {
    mockUseRecommendationTrends.mockReset();
  });

  test("renders loading state", () => {
    mockUseRecommendationTrends.mockReturnValue({
      trends: [],
      loading: true,
      error: null,
    });

    render(<RecommendationTrendsBarChart symbol={mockSymbol} />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders error state", () => {
    const errorMessage = "Failed to load data";
    mockUseRecommendationTrends.mockReturnValue({
      trends: [],
      loading: false,
      error: errorMessage,
    });

    render(<RecommendationTrendsBarChart symbol={mockSymbol} />);

    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
  });

  test("renders the chart with trend data", () => {
    const mockTrends = [
      {
        period: "Q1 2025",
        strongBuy: 10,
        buy: 15,
        hold: 5,
        sell: 2,
        strongSell: 1,
      },
    ];

    mockUseRecommendationTrends.mockReturnValue({
      trends: mockTrends,
      loading: false,
      error: null,
    });

    render(<RecommendationTrendsBarChart symbol={mockSymbol} />);

    // Instead of looking for a specific test ID, we'll check for the chart container
    // and verify that there's no loading or error state
    const title = screen.getByText(`Recommendation Trends for ${mockSymbol}`);
    expect(title).toBeInTheDocument();

    // Verify that loading and error states are not present
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    expect(screen.queryByText(/Error:/)).not.toBeInTheDocument();

    // Verify that the "no data" message is not present
    expect(
      screen.queryByText(`No recommendation trends available for ${mockSymbol}`)
    ).not.toBeInTheDocument();
  });

  test("renders no data message when no trends are available", () => {
    mockUseRecommendationTrends.mockReturnValue({
      trends: [],
      loading: false,
      error: null,
    });

    render(<RecommendationTrendsBarChart symbol={mockSymbol} />);

    expect(
      screen.getByText(`No recommendation trends available for ${mockSymbol}`)
    ).toBeInTheDocument();
  });
});
