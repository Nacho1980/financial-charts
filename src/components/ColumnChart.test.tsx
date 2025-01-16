import { render, screen } from "@testing-library/react";
import ColumnChart from "./ColumnChart";
import "@testing-library/jest-dom"; // For additional matchers

// Mock the entire react-chartjs-2 module
vi.mock("react-chartjs-2", () => ({
  Bar: () => <div data-testid="mock-bar">Mocked Bar Chart</div>, // Mock Bar component
}));

describe("ColumnChart Component", () => {
  const mockProps = {
    title: "Test Chart",
    labels: ["Label 1", "Label 2", "Label 3"],
    inputData: [10, 20, 30],
  };

  test("renders the Bar chart when inputData is provided", () => {
    render(<ColumnChart {...mockProps} />);

    // Check if the mocked Bar chart is rendered
    expect(screen.getByTestId("mock-bar")).toBeInTheDocument();
  });

  test("renders 'No data to display' when inputData is empty", () => {
    render(<ColumnChart title="Empty Chart" labels={[]} inputData={[]} />);

    // Verify that the fallback text is rendered
    expect(screen.getByText("No data to display")).toBeInTheDocument();
  });
});
