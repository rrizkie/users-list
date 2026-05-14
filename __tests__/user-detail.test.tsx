jest.mock("@/services/users/api");
jest.mock("@/services/workspace/api");

const mockPush = jest.fn();
const mockUseParams = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useParams: () => mockUseParams(),
}));

import { screen, waitFor } from "@testing-library/react";
import * as usersApi from "@/services/users/api";
import * as workspaceApi from "@/services/workspace/api";
import UserDetail from "@/components/organism/UserDetail";
import { renderWithQueryClient } from "@/test/test-utils";
import { makePost, makeTodo, makeUser } from "@/test/fixtures/users";

const mockedGetUser = jest.mocked(usersApi.getUser);
const mockedGetTodos = jest.mocked(workspaceApi.getTodos);
const mockedGetPosts = jest.mocked(workspaceApi.getPosts);

describe("User details", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({ id: "1" });
  });

  it("renders user details with posts and todos sections", async () => {
    mockedGetUser.mockResolvedValue(
      makeUser({
        id: 1,
        name: "Pat Example",
        username: "pat",
        email: "pat@example.test",
      }),
    );
    mockedGetPosts.mockResolvedValue([
      makePost({ id: 10, userId: 1, body: "Alpha post" }),
      makePost({ id: 11, userId: 2, body: "Other user" }),
    ]);
    mockedGetTodos.mockResolvedValue([
      makeTodo({ id: 1, userId: 1, title: "Open item", completed: false }),
      makeTodo({ id: 2, userId: 1, title: "Done item", completed: true }),
    ]);

    renderWithQueryClient(<UserDetail />);

    expect(await screen.findByText("Pat Example")).toBeInTheDocument();

    const totalPostsBlock = screen.getByText("Total Posts (1)").closest("div");

    expect(screen.getByText(/Pending Todos \(1\)/)).toBeInTheDocument();
    expect(screen.getByText("☐ Open item")).toBeInTheDocument();

    expect(screen.getByText(/Completed Todos \(1\)/)).toBeInTheDocument();
    expect(screen.getByText("☑ Done item")).toBeInTheDocument();
  });

  it("shows the loading skeleton while data is loading", async () => {
    let finish!: () => void;
    const gate = new Promise<void>((resolve) => {
      finish = resolve;
    });

    mockedGetUser.mockImplementation(() => gate.then(() => makeUser({ id: 1 })));
    mockedGetPosts.mockImplementation(() => gate.then(() => []));
    mockedGetTodos.mockImplementation(() => gate.then(() => []));

    renderWithQueryClient(<UserDetail />);

    expect(document.querySelector('[aria-busy="true"]')).toBeInTheDocument();

    finish();

    await waitFor(() => {
      expect(document.querySelector('[aria-busy="true"]')).not.toBeInTheDocument();
    });
  });

  it("shows an error state when loading user details fails", async () => {
    mockedGetUser.mockRejectedValue(new Error("error"));
    mockedGetPosts.mockResolvedValue([]);
    mockedGetTodos.mockResolvedValue([]);

    renderWithQueryClient(<UserDetail />);

    expect(
      await screen.findByText(/Failed to load user details/i),
    ).toBeInTheDocument();
  });
});
