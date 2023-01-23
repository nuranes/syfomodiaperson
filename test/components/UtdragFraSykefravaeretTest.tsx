import { render, screen } from "@testing-library/react";
import UtdragFraSykefravaeret from "@/components/utdragFraSykefravaeret/UtdragFraSykefravaeret";
import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { expect } from "chai";
import { ARBEIDSTAKER_DEFAULT_FULL_NAME } from "../../mock/common/mockConstants";
import { queryClientWithMockData } from "../testQueryClient";

const queryClient = queryClientWithMockData();

describe("UtdragFraSykefravaeret", () => {
  it("viser spinnsyn-lenke til vedtak", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <UtdragFraSykefravaeret />
      </QueryClientProvider>
    );

    expect(screen.getByRole("heading", { name: "Vedtak" })).to.exist;
    const link = screen.getByRole("link", {
      name: `Se vedtakene slik ${ARBEIDSTAKER_DEFAULT_FULL_NAME} ser dem på nav.no`,
    });
    expect(link.getAttribute("href")).to.contain("spinnsyn-frontend-interne");
    expect(link.getAttribute("href")).to.contain("/syk/sykepenger");
  });
});
