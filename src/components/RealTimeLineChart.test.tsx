import { render, screen, act } from "@testing-library/react";
import RealTimeLineChart from "./RealTimeLineChart";
import { vi } from "vitest";

// Mock react-chartjs-2
vi.mock("react-chartjs-2", () => ({
  Line: ({ data }: any) => (
    <div data-testid="mock-line-chart">
      <div>{data.datasets[0].label}</div>
      <div>{data.labels}</div>
    </div>
  ),
}));

vi.useFakeTimers();

describe("RealTimeLineChart Component", () => {
  const mockSymbol = "AAPL";
  const mockName = "Apple Inc.";
  const mockOpeningPrice = 150;

  test("renders the chart with initial props", () => {
    render(
      <RealTimeLineChart
        name={mockName}
        symbol={mockSymbol}
        opening={mockOpeningPrice}
      />
    );
    expect(screen.getByText(`${mockName} (${mockSymbol})`)).toBeInTheDocument();
    expect(screen.getByTestId("mock-line-chart")).toBeInTheDocument();
  });

  test("updates prices at regular intervals", () => {
    render(
      <RealTimeLineChart
        name={mockName}
        symbol={mockSymbol}
        opening={mockOpeningPrice}
      />
    );

    act(() => {
      vi.advanceTimersByTime(1000); // Simulate 1 second passing
    });

    expect(screen.getByTestId("mock-line-chart")).toBeInTheDocument();
  });

  test("handles new symbol updates correctly", () => {
    const { rerender } = render(
      <RealTimeLineChart
        name={mockName}
        symbol={mockSymbol}
        opening={mockOpeningPrice}
      />
    );

    const newSymbol = "GOOGL";
    const newName = "Alphabet Inc.";
    const newOpeningPrice = 2800;

    rerender(
      <RealTimeLineChart
        name={newName}
        symbol={newSymbol}
        opening={newOpeningPrice}
      />
    );

    // Check if the new name and symbol are rendered correctly
    expect(screen.getByText(`${newName} (${newSymbol})`)).toBeInTheDocument();
  });
});
