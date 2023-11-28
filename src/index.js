import React from "react";
import { createRoot } from "react-dom/client";
import AppRouter from "./routers/AppRouter";
import "./styles/styles.less";
import "./styles/style.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { minutesToMillis } from "@/utils/timeUtils";
import { ValgtEnhetProvider } from "@/context/ValgtEnhetContext";
import { isClientError } from "@/api/errors";

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      networkMode: "offlineFirst",
    },
    queries: {
      networkMode: "offlineFirst",
      refetchOnWindowFocus: false,
      gcTime: minutesToMillis(60),
      staleTime: minutesToMillis(30),
      retry: (failureCount, error) => {
        if (isClientError(error)) {
          return false;
        }

        return failureCount < 3;
      },
    },
  },
});

const container =
  document.getElementById("maincontent") || new DocumentFragment();
const root = createRoot(container);

root.render(
  <ValgtEnhetProvider>
    <QueryClientProvider client={queryClient}>
      <AppRouter />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </ValgtEnhetProvider>
);
