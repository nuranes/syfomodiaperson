import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import React from "react";
import Pengestopp from "@/components/pengestopp/Pengestopp";
import { queryClientWithMockData } from "../testQueryClient";
import { pengestoppStatusQueryKeys } from "@/data/pengestopp/pengestoppQueryHooks";
import {
  ARBEIDSTAKER_DEFAULT,
  ENHET_GAMLEOSLO,
  VEILEDER_IDENT_DEFAULT,
  VIRKSOMHET_PONTYPANDY,
} from "../../mock/common/mockConstants";
import {
  Status,
  StatusEndring,
  SykepengestoppArsakType,
} from "@/data/pengestopp/types/FlaggPerson";
import { expect, describe, it, beforeEach } from "vitest";

let queryClient: QueryClient;

const defaultStatusEndring = {
  veilederIdent: { value: VEILEDER_IDENT_DEFAULT },
  enhetNr: { value: ENHET_GAMLEOSLO.nummer },
  opprettet: new Date().toISOString(),
  virksomhetNr: {
    value: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
  },
  sykmeldtFnr: { value: ARBEIDSTAKER_DEFAULT.personIdent },
  arsakList: [{ type: SykepengestoppArsakType.BESTRIDELSE_SYKMELDING }],
  status: Status.STOPP_AUTOMATIKK,
};
const pengestoppHistorikk: StatusEndring[] = [
  defaultStatusEndring,
  {
    ...defaultStatusEndring,
    arsakList: [{ type: SykepengestoppArsakType.TILBAKEDATERT_SYKMELDING }],
  },
  {
    ...defaultStatusEndring,
    arsakList: [{ type: SykepengestoppArsakType.MEDISINSK_VILKAR }],
  },
];

const renderPengestopp = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <Pengestopp sykmeldinger={[]} />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );

describe("Pengestopp", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
    queryClient.setQueryData(
      pengestoppStatusQueryKeys.pengestoppStatus(
        ARBEIDSTAKER_DEFAULT.personIdent
      ),
      () => pengestoppHistorikk
    );
  });

  it("viser ikke valg for bestridelse og tilbakedatering i modal", () => {
    renderPengestopp();

    expect(
      screen.getByRole("checkbox", {
        name: /Medisinsk vilkår/,
        hidden: true,
      })
    ).to.exist;
    expect(
      screen.getByRole("checkbox", {
        name: /Manglende medvirkning/,
        hidden: true,
      })
    ).to.exist;
    expect(
      screen.getByRole("checkbox", {
        name: /Aktivitetskravet/,
        hidden: true,
      })
    ).to.exist;
    expect(
      screen.queryByRole("checkbox", {
        name: /Bestridelse av sykmelding/,
        hidden: true,
      })
    ).to.not.exist;
    expect(
      screen.queryByRole("checkbox", {
        name: /Tilbakedatering sykmelding/,
        hidden: true,
      })
    ).to.not.exist;
  });

  it("viser bestridelse og tilbakedatering i historikk", () => {
    renderPengestopp();

    expect(screen.getByText(/Årsak: Tilbakedatert sykmelding/)).to.exist;
    expect(screen.getByText(/Årsak: Bestridelse av sykmelding/)).to.exist;
    expect(screen.getByText(/Årsak: Medisinsk vilkår/)).to.exist;
  });
});
