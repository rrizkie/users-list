import type { IUser } from "@/types/users";
import type { IWorkSpace } from "@/types/workspace";

export function makeUser(overrides: Partial<IUser> = {}): IUser {
  const id = overrides.id ?? 1;
  return {
    id,
    name: "Leanne Graham",
    username: "Bret",
    email: "leanne@example.test",
    address: {
      street: "Kulas Light",
      suite: "Apt. 556",
      city: "Gwenborough",
      zipcode: "92998-3874",
      geo: { lat: "-37.3159", lng: "81.1496" },
    },
    phone: "1-770-736-8031",
    website: "hildegard.org",
    company: {
      name: "Romaguera-Crona",
      catchPhrase: "Multi-layered client-server neural-net",
      bs: "harness real-time e-markets",
    },
    ...overrides,
  };
}

export function makeTodo(
  overrides: Partial<IWorkSpace> & Pick<IWorkSpace, "userId" | "id">,
): IWorkSpace {
  return {
    title: "Todo",
    completed: false,
    ...overrides,
  };
}

export function makePost(
  overrides: Partial<IWorkSpace> & Pick<IWorkSpace, "userId" | "id">,
): IWorkSpace {
  return {
    title: "Post",
    completed: false,
    ...overrides,
  };
}
