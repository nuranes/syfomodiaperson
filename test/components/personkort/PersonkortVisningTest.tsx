import React from "react";
import { expect } from "chai";
import PersonkortVisning from "../../../src/components/personkort/PersonkortVisning";
import { PERSONKORTVISNING_TYPE } from "@/konstanter";
import { QueryClientProvider } from "@tanstack/react-query";
import { behandlendeEnhetQueryKeys } from "@/data/behandlendeenhet/behandlendeEnhetQueryHooks";
import { apiMock } from "../../stubs/stubApi";
import { stubFastlegerApi } from "../../stubs/stubFastlegeRest";
import { render, screen } from "@testing-library/react";
import { fastlegerMock } from "../../../mock/fastlegerest/fastlegerMock";
import { queryClientWithAktivBruker } from "../../testQueryClient";
import { ARBEIDSTAKER_DEFAULT } from "../../../mock/common/mockConstants";
import { brukerinfoQueryKeys } from "@/data/navbruker/navbrukerQueryHooks";
import { brukerinfoMock } from "../../../mock/syfoperson/persondataMock";

let queryClient: any;
let apiMockScope: any;

describe("PersonkortVisning", () => {
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
    render(
      <QueryClientProvider client={queryClient}>
        <PersonkortVisning visning={""} />
      </QueryClientProvider>
    );

    expect(screen.getByRole("heading", { name: "Kontaktinformasjon" })).to
      .exist;
  });

  it("Skal vise VisningLege, dersom visning for lege er valgt", async () => {
    const expectedLegeNavn = `${fastlegerMock[0].fornavn} ${fastlegerMock[0].etternavn}`;
    render(
      <QueryClientProvider client={queryClient}>
        <PersonkortVisning visning={PERSONKORTVISNING_TYPE.LEGE} />
      </QueryClientProvider>
    );

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
    render(
      <QueryClientProvider client={queryClient}>
        <PersonkortVisning visning={PERSONKORTVISNING_TYPE.ENHET} />
      </QueryClientProvider>
    );

    expect(await screen.findByRole("heading", { name: enhetNavn })).to.exist;
  });
});
