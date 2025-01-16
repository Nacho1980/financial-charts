import "@testing-library/jest-dom";
import "canvas-mock";
import { vi } from "vitest";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
/* global.HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
  // You can mock any required methods on the context if needed, like:
  // beginPath: jest.fn(),
  // arc: jest.fn(),
  // stroke: jest.fn(),
  // fill: jest.fn(),
});
 */

// Register Chart.js components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);
console.log("Chart.js components registered");
// Mock HTMLCanvasElement getContext method
global.HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
  // You can mock any required methods on the context if needed, like:
  canvas: document.createElement("canvas"),
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  fillText: vi.fn(),
  measureText: vi.fn().mockReturnValue({ width: 0 }),
  strokeRect: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  stroke: vi.fn(),
});
vi.mock("chart.js", async () => {
  const actual = await vi.importActual("chart.js");
  return {
    ...actual,
    Chart: class {
      static register() {}
      constructor(ctx: any, config: any) {
        this.config = config;
        this.ctx = ctx;
      }
      update() {}
      destroy() {}
    },
  };
});
