import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

type ProviderProps = { children: ReactNode; client: QueryClient };

function TestProviders({ children, client }: ProviderProps) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

export function renderWithQueryClient(
  ui: ReactElement,
  client = createTestQueryClient(),
  options?: Omit<RenderOptions, "wrapper">,
) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <TestProviders client={client}>{children}</TestProviders>
  );
  return { ...render(ui, { wrapper, ...options }), queryClient: client };
}
