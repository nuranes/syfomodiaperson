import React from "react";
import { createRoot } from "react-dom/client";
import AppRouter from "./routers/AppRouter";
import "./styles/styles.less";
import * as Sentry from "@sentry/react";
import { getEnvironmentAsString } from "./utils/miljoUtil";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { minutesToMillis } from "@/utils/timeUtils";
import { ValgtEnhetProvider } from "@/context/ValgtEnhetContext";
import { isClientError } from "@/api/errors";

Sentry.init({
  dsn: "https://8ea71ab742104cd5ad7d9d488023f28d@sentry.gc.nav.no/84",
  environment: getEnvironmentAsString(),
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      cacheTime: minutesToMillis(60),
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
