import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import React from "react";
import { BehandlerdialogSide } from "@/sider/behandlerdialog/BehandlerdialogSide";
import { queryClientWithMockData } from "../testQueryClient";
import { expect } from "chai";

let queryClient: QueryClient;

const renderBehandlerdialogSide = () => {
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <BehandlerdialogSide />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );
};

describe("BehandlerdialogSide", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  it("Viser behandlerdialogSide", () => {
    renderBehandlerdialogSide();

    expect(screen.getByRole("heading", { name: "Skriv til behandler" })).to
      .exist;
  });
});
