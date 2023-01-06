import { queryClientWithMockData } from "../testQueryClient";
import { QueryClient, QueryClientProvider } from "react-query";
import { render, screen } from "@testing-library/react";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import React from "react";
import { AktivitetskravHistorikk } from "@/components/aktivitetskrav/historikk/AktivitetskravHistorikk";
import {
  AktivitetskravStatus,
  AktivitetskravVurderingDTO,
  AvventVurderingArsak,
  OppfyltVurderingArsak,
  UnntakVurderingArsak,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { expect } from "chai";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";
import { daysFromToday, getButton } from "../testUtils";
import userEvent from "@testing-library/user-event";
import {
  ARBEIDSTAKER_DEFAULT,
  VEILEDER_DEFAULT,
  VEILEDER_IDENT_DEFAULT,
} from "../../mock/common/mockConstants";
import { veilederinfoQueryKeys } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { aktivitetskravQueryKeys } from "@/data/aktivitetskrav/aktivitetskravQueryHooks";
import {
  createAktivitetskrav,
  createAktivitetskravVurdering,
} from "../testDataUtils";

let queryClient: QueryClient;

const fnr = ARBEIDSTAKER_DEFAULT.personIdent;
const today = new Date();
const dayInThePast = daysFromToday(-500);
const enBeskrivelse = "Her er en beskrivelse";
const friskmeldtBeskrivelse = "Arbeidstaker er friskmeldt";
const oppfyltVurdering = createAktivitetskravVurdering(
  AktivitetskravStatus.OPPFYLT,
  [OppfyltVurderingArsak.FRISKMELDT],
  friskmeldtBeskrivelse,
  today
);
const unntakVurdering = createAktivitetskravVurdering(
  AktivitetskravStatus.UNNTAK,
  [UnntakVurderingArsak.MEDISINSKE_GRUNNER],
  enBeskrivelse,
  dayInThePast
);
const avventVurdering = createAktivitetskravVurdering(
  AktivitetskravStatus.AVVENT,
  [AvventVurderingArsak.INFORMASJON_BEHANDLER]
);
const stansVurdering = createAktivitetskravVurdering(
  AktivitetskravStatus.STANS,
  []
);

const renderAktivitetskravHistorikk = (
  vurderinger: AktivitetskravVurderingDTO[]
) => {
  const aktivitetskrav = createAktivitetskrav(
    daysFromToday(20),
    vurderinger[0].status,
    vurderinger
  );
  queryClient.setQueryData(aktivitetskravQueryKeys.aktivitetskrav(fnr), () => [
    aktivitetskrav,
  ]);
  return render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <AktivitetskravHistorikk />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );
};

describe("AktivitetskravHistorikk", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
    queryClient.setQueryData(
      veilederinfoQueryKeys.veilederinfoByIdent(VEILEDER_IDENT_DEFAULT),
      () => VEILEDER_DEFAULT
    );
  });
  it("viser klikkbar overskrift for hver vurdering, sortert etter dato - nyeste øverst", () => {
    renderAktivitetskravHistorikk([unntakVurdering, oppfyltVurdering]);

    const vurderingButtons = screen.getAllByRole("button");
    expect(vurderingButtons[0].textContent).to.equal(
      `Oppfylt - ${tilDatoMedManedNavn(today)}`
    );
    expect(vurderingButtons[1].textContent).to.equal(
      `Unntak - ${tilDatoMedManedNavn(dayInThePast)}`
    );
  });
  it("klikk på overskrift viser beskrivelse og veileder-navn", () => {
    renderAktivitetskravHistorikk([oppfyltVurdering]);

    const vurderingButton = screen.getByRole("button");
    userEvent.click(vurderingButton);

    expect(screen.getByText(friskmeldtBeskrivelse)).to.exist;
    expect(screen.getByText(VEILEDER_DEFAULT.navn)).to.exist;
  });
  it("viser riktig overskrift for STANS-vurdering", () => {
    renderAktivitetskravHistorikk([stansVurdering]);

    expect(getButton(`Innstilling om stopp - ${tilDatoMedManedNavn(today)}`)).to
      .exist;
  });
  it("viser ikke AVVENT-vurdering", () => {
    renderAktivitetskravHistorikk([avventVurdering]);

    expect(screen.queryByText(/Avvent/)).to.not.exist;
  });
});
