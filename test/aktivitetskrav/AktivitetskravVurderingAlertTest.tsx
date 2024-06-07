import {
  avventVurdering,
  avventVurderingUtenFrist,
  createAktivitetskravVurdering,
  forhandsvarselVurdering,
} from "../testDataUtils";
import {
  AktivitetskravStatus,
  AktivitetskravVurderingDTO,
  AvventVurderingArsak,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { expect, describe, it, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  tilDatoMedManedNavn,
  tilLesbarDatoMedArUtenManedNavn,
} from "@/utils/datoUtils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import React from "react";
import { AktivitetskravVurderingAlert } from "@/sider/aktivitetskrav/vurdering/AktivitetskravVurderingAlert";
import { queryClientWithMockData } from "../testQueryClient";
import { personoppgaverQueryKeys } from "@/data/personoppgave/personoppgaveQueryHooks";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";
import { personOppgaveUbehandletVurderStans } from "../../mock/ispersonoppgave/personoppgaveMock";

let queryClient: QueryClient;

const fnr = ARBEIDSTAKER_DEFAULT.personIdent;

const renderAktivitetskravVurderingAlert = (
  vurdering: AktivitetskravVurderingDTO
) => {
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <AktivitetskravVurderingAlert vurdering={vurdering} />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );
};

describe("AktivitetskravVurderingAlert", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  it("viser advarsel med frist når siste aktivitetskrav-vurdering er AVVENT med frist", () => {
    renderAktivitetskravVurderingAlert(avventVurdering);

    expect(screen.getByRole("img", { name: "Advarsel" })).to.exist;
    expect(screen.getByText(`Avventer til ${tilDatoMedManedNavn(new Date())}`))
      .to.exist;
  });
  it("viser advarsel uten frist når siste aktivitetskrav-vurdering er AVVENT uten frist", () => {
    renderAktivitetskravVurderingAlert(avventVurderingUtenFrist);

    expect(screen.getByRole("img", { name: "Advarsel" })).to.exist;
    expect(screen.getByText(`Avventer`)).to.exist;
  });
  it("viser beskrivelse og årsaker når siste aktivitetskrav-vurdering er AVVENT", () => {
    const beskrivelse = "Avventer litt";
    const vurdering = createAktivitetskravVurdering(
      AktivitetskravStatus.AVVENT,
      [
        AvventVurderingArsak.OPPFOLGINGSPLAN_ARBEIDSGIVER,
        AvventVurderingArsak.INFORMASJON_BEHANDLER,
        AvventVurderingArsak.DROFTES_MED_ROL,
        AvventVurderingArsak.DROFTES_INTERNT,
      ],
      beskrivelse
    );
    renderAktivitetskravVurderingAlert(vurdering);

    expect(screen.getByText(beskrivelse)).to.exist;
    expect(screen.getByText("Har bedt om oppfølgingsplan fra arbeidsgiver")).to
      .exist;
    expect(screen.getByText("Har bedt om mer informasjon fra behandler")).to
      .exist;
  });
  it("viser info når siste aktivitetskrav-vurdering er FORHANDSVARSEL uten vurder stans-oppgave", () => {
    renderAktivitetskravVurderingAlert(forhandsvarselVurdering);

    expect(screen.getByRole("img", { name: "Informasjon" })).to.exist;
    expect(
      screen.getByText(
        `Forhåndsvarsel er sendt ${tilLesbarDatoMedArUtenManedNavn(
          forhandsvarselVurdering.createdAt
        )}`
      )
    );
  });
  it("viser warning når siste aktivitetskrav-vurdering er FORHANDSVARSEL og det ubehandlet vurder stans-oppgave", () => {
    queryClient.setQueryData(
      personoppgaverQueryKeys.personoppgaver(fnr),
      () => [personOppgaveUbehandletVurderStans]
    );
    renderAktivitetskravVurderingAlert(forhandsvarselVurdering);

    expect(screen.getByRole("img", { name: "Advarsel" })).to.exist;
    expect(screen.getByText("Aktivitetskravet må vurderes"));
  });
});
