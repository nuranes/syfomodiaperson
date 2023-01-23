import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { modiacontextQueryKeys } from "@/data/modiacontext/modiacontextQueryHooks";
import { AKTIV_BRUKER_DEFAULT } from "../../mock/common/mockConstants";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";

export const queryHookWrapper = (client: QueryClient) => {
  client.setQueryData(
    modiacontextQueryKeys.aktivbruker,
    () => AKTIV_BRUKER_DEFAULT
  );
  const wrapper = ({ children }: any) => (
    <QueryClientProvider client={client}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        {children}
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );

  return wrapper;
};
