import React from "react";
import { expect } from "chai";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { behandlendeEnhetQueryKeys } from "@/data/behandlendeenhet/behandlendeEnhetQueryHooks";
import { apiMock } from "../../stubs/stubApi";
import { stubFastlegerApi } from "../../stubs/stubFastlegeRest";
import { render, screen } from "@testing-library/react";
import { fastlegerMock } from "../../../mock/fastlegerest/fastlegerMock";
import { queryClientWithAktivBruker } from "../../testQueryClient";
import { ARBEIDSTAKER_DEFAULT } from "../../../mock/common/mockConstants";
import { brukerinfoQueryKeys } from "@/data/navbruker/navbrukerQueryHooks";
import { brukerinfoMock } from "../../../mock/syfoperson/persondataMock";
import Personkort from "@/components/personkort/Personkort";
import { clickTab, getTab } from "../../testUtils";
import userEvent from "@testing-library/user-event";

let queryClient: QueryClient;
let apiMockScope: any;

const renderAndExpandPersonkort = () => {
  render(
    <QueryClientProvider client={queryClient}>
      <Personkort />
    </QueryClientProvider>
  );
  const expandable = screen.getAllByRole("button")[0];
  userEvent.click(expandable);
};

describe("Personkort", () => {
  beforeEach(() => {
    queryClient = queryClientWithAktivBruker();
    queryClient.setQueryData(
      brukerinfoQueryKeys.brukerinfo(ARBEIDSTAKER_DEFAULT.personIdent),
      () => brukerinfoMock
    );
    apiMockScope = apiMock();
    stubFastlegerApi(apiMockScope);
  });

  it("Skal vise PersonkortSykmeldt, som initielt valg", () => {
    renderAndExpandPersonkort();

    expect(screen.getByRole("heading", { name: "Kontaktinformasjon" })).to
      .exist;
  });

  it("Skal vise Nærmeste leder-tab", () => {
    renderAndExpandPersonkort();

    expect(getTab("Nærmeste leder")).to.exist;
  });

  it("Skal vise VisningLege, dersom visning for lege er valgt", async () => {
    const expectedLegeNavn = `${fastlegerMock[0].fornavn} ${fastlegerMock[0].etternavn}`;

    renderAndExpandPersonkort();

    clickTab("Fastlege");

    expect(await screen.findByRole("heading", { name: expectedLegeNavn })).to
      .exist;
  });

  it("Skal vise VisningEnhet, dersom visning for enhet er valgt", async () => {
    const enhetNavn = "NAV Drammen";
    queryClient.setQueryData(
      behandlendeEnhetQueryKeys.behandlendeEnhet(
        ARBEIDSTAKER_DEFAULT.personIdent
      ),
      () => ({
        navn: enhetNavn,
        enhetId: "1234",
      })
    );

    renderAndExpandPersonkort();

    clickTab("Behandlende enhet");

    expect(await screen.findByRole("heading", { name: enhetNavn })).to.exist;
  });
});
