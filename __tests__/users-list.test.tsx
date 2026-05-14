jest.mock("lodash/debounce", () => ({
  __esModule: true,
  default: <T extends (...args: unknown[]) => unknown>(fn: T) => fn,
}));

jest.mock("@/services/users/api");
jest.mock("@/services/workspace/api");

const push = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

import { screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as usersApi from "@/services/users/api";
import * as workspaceApi from "@/services/workspace/api";
import Users from "@/components/organism/Users";
import { renderWithQueryClient } from "@/test/test-utils";
import { makePost, makeTodo, makeUser } from "@/test/fixtures/users";

const mockedGetUsers = jest.mocked(usersApi.getUsers);
const mockedGetTodos = jest.mocked(workspaceApi.getTodos);
const mockedGetPosts = jest.mocked(workspaceApi.getPosts);

describe("Users list", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders users with derived activity signals from posts and todos", async () => {
    mockedGetUsers.mockResolvedValue([
      makeUser({ id: 1, name: "Alice", email: "alice@example.test" }),
      makeUser({ id: 2, name: "Bob", email: "bob@example.test" }),
    ]);
    mockedGetTodos.mockResolvedValue([
      makeTodo({ id: 1, userId: 1, title: "t1", completed: true }),
      makeTodo({ id: 2, userId: 1, title: "t2", completed: false }),
      makeTodo({ id: 3, userId: 2, title: "t3", completed: true }),
    ]);
    mockedGetPosts.mockResolvedValue([
      makePost({ id: 10, userId: 1, title: "p1" }),
      makePost({ id: 11, userId: 1, title: "p2" }),
      makePost({ id: 12, userId: 1, title: "p3" }),
    ]);

    renderWithQueryClient(<Users />);

    expect(await screen.findByRole("cell", { name: "Alice" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Bob" })).toBeInTheDocument();

    const aliceRow = screen.getByRole("cell", { name: "Alice" }).closest("tr");
    expect(aliceRow).not.toBeNull();
    if (!aliceRow) throw new Error("row missing");

    const aliceCells = within(aliceRow as HTMLElement).getAllByRole("cell");
    expect(aliceCells[3]).toHaveTextContent("3");
    expect(aliceCells[4]).toHaveTextContent("1");
    expect(aliceCells[5]).toHaveTextContent("1");

    const bobRow = screen.getByRole("cell", { name: "Bob" }).closest("tr");
    expect(bobRow).not.toBeNull();
    if (!bobRow) throw new Error("row missing");

    const bobCells = within(bobRow as HTMLElement).getAllByRole("cell");
    expect(bobCells[3]).toHaveTextContent("0");
    expect(bobCells[4]).toHaveTextContent("1");
    expect(bobCells[5]).toHaveTextContent("0");
  });

  it("filters by search", async () => {
    const user = userEvent.setup();
    mockedGetUsers.mockResolvedValue([
      makeUser({ id: 1, name: "Alice North", email: "alice@example.test" }),
      makeUser({ id: 2, name: "Bob", email: "bob@special.test" }),
    ]);
    mockedGetTodos.mockResolvedValue([]);
    mockedGetPosts.mockResolvedValue([]);

    renderWithQueryClient(<Users />);

    await screen.findByRole("cell", { name: "Alice North" });

    const search = screen.getByPlaceholderText("Search by name or email");
    await user.type(search, "special");

    await waitFor(() => {
      expect(screen.queryByRole("cell", { name: "Alice North" })).not.toBeInTheDocument();
    });
    expect(screen.getByRole("cell", { name: "Bob" })).toBeInTheDocument();
  });

  it("applies column sort (name ascending on first toggle)", async () => {
    const user = userEvent.setup();
    mockedGetUsers.mockResolvedValue([
      makeUser({ id: 1, name: "Zara", email: "z@example.test" }),
      makeUser({ id: 2, name: "Amy", email: "a@example.test" }),
    ]);
    mockedGetTodos.mockResolvedValue([]);
    mockedGetPosts.mockResolvedValue([]);

    renderWithQueryClient(<Users />);

    await screen.findByRole("cell", { name: "Zara" });

    const nameHeader = screen.getByRole("columnheader", { name: /Name/i });
    await user.click(within(nameHeader).getByText("↑↓"));

    const names = screen.getAllByRole("cell", { name: /^(Amy|Zara)$/i });
    expect(names[0]).toHaveTextContent("Amy");
    expect(names[1]).toHaveTextContent("Zara");
  });

  it("shows loading state while requests are in flight", async () => {
    let releaseUsers!: (value: unknown) => void;
    const usersPromise = new Promise((resolve) => {
      releaseUsers = resolve;
    });

    mockedGetUsers.mockReturnValue(usersPromise as Promise<unknown>);
    mockedGetTodos.mockResolvedValue([]);
    mockedGetPosts.mockResolvedValue([]);

    renderWithQueryClient(<Users />);

    const loadingRow = document.querySelector("tbody tr.animate-pulse");
    expect(loadingRow).toBeTruthy();

    releaseUsers!([]);
    await waitFor(() => {
      expect(document.querySelector("tbody tr.animate-pulse")).not.toBeInTheDocument();
    });
  });

  it("shows an error state when a request fails", async () => {
    mockedGetUsers.mockRejectedValue(new Error("network"));
    mockedGetTodos.mockResolvedValue([]);
    mockedGetPosts.mockResolvedValue([]);

    renderWithQueryClient(<Users />);

    expect(await screen.findByText(/Failed to load users/i)).toBeInTheDocument();
  });

  it("shows empty state when there are no rows after fetch", async () => {
    mockedGetUsers.mockResolvedValue([]);
    mockedGetTodos.mockResolvedValue([]);
    mockedGetPosts.mockResolvedValue([]);

    renderWithQueryClient(<Users />);

    expect(await screen.findByText("No data available")).toBeInTheDocument();
  });
});
