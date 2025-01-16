import { render, screen, fireEvent } from "@testing-library/react";
import ScrollSensitiveAvatar from "./ScrollSensitiveAvatar";
import { vi } from "vitest";

// Mock the constants
vi.mock("../utils/Constants", () => ({
  MY_LINKEDIN_PROFILE: "https://linkedin.com/in/test-profile",
}));

// Mock Material-UI Avatar component
vi.mock("@mui/material", () => ({
  Avatar: ({ children, sx, ...props }) => (
    <div data-testid="mock-avatar" className={props.className}>
      {children}
    </div>
  ),
}));

describe("ScrollSensitiveAvatar", () => {
  let mockRoot: HTMLDivElement;

  beforeEach(() => {
    // Create a mock root element
    mockRoot = document.createElement("div");
    mockRoot.id = "root";
    document.body.appendChild(mockRoot);

    // Mock scrollTop property
    Object.defineProperty(mockRoot, "scrollTop", {
      configurable: true,
      value: 0,
    });
  });

  afterEach(() => {
    // Clean up
    document.body.removeChild(mockRoot);
    vi.clearAllMocks();
  });

  test("renders avatar when scrollTop is 0", () => {
    render(<ScrollSensitiveAvatar />);

    const avatar = screen.getByTestId("mock-avatar");
    expect(avatar).toBeInTheDocument();

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute(
      "href",
      "https://linkedin.com/in/test-profile"
    );
    expect(link).toHaveTextContent("IS");
  });

  test("hides avatar when scrolled down", () => {
    render(<ScrollSensitiveAvatar />);

    // Initially avatar should be visible
    expect(screen.getByTestId("mock-avatar")).toBeInTheDocument();

    // Mock scrolling down
    Object.defineProperty(mockRoot, "scrollTop", {
      configurable: true,
      value: 100,
    });

    fireEvent.scroll(mockRoot);

    // Avatar should not be in the document
    expect(screen.queryByTestId("mock-avatar")).not.toBeInTheDocument();
  });

  test("shows avatar again when scrolled back to top", () => {
    render(<ScrollSensitiveAvatar />);

    // Scroll down first
    Object.defineProperty(mockRoot, "scrollTop", {
      configurable: true,
      value: 100,
    });
    fireEvent.scroll(mockRoot);

    // Avatar should be hidden
    expect(screen.queryByTestId("mock-avatar")).not.toBeInTheDocument();

    // Scroll back to top
    Object.defineProperty(mockRoot, "scrollTop", {
      configurable: true,
      value: 0,
    });
    fireEvent.scroll(mockRoot);

    // Avatar should be visible again
    expect(screen.getByTestId("mock-avatar")).toBeInTheDocument();
  });

  test("removes event listener on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(mockRoot, "removeEventListener");

    const { unmount } = render(<ScrollSensitiveAvatar />);

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function)
    );
  });

  test("avatar has correct styling", () => {
    render(<ScrollSensitiveAvatar />);

    const avatar = screen.getByTestId("mock-avatar");
    expect(avatar).toHaveClass("avatar");
  });
});
