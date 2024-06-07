import { queryClientWithMockData } from "../testQueryClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, within } from "@testing-library/react";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import React from "react";
import { AktivitetskravHistorikk } from "@/sider/aktivitetskrav/historikk/AktivitetskravHistorikk";
import {
  AktivitetskravStatus,
  AktivitetskravVarselDTO,
  AktivitetskravVurderingDTO,
  AvventVurderingArsak,
  OppfyltVurderingArsak,
  UnntakVurderingArsak,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { expect, describe, it, beforeEach } from "vitest";
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
import { DocumentComponentType } from "@/data/documentcomponent/documentComponentTypes";

let queryClient: QueryClient;

const fnr = ARBEIDSTAKER_DEFAULT.personIdent;
const today = new Date();
const dayInThePast = daysFromToday(-500);
const enBeskrivelse = "Her er en beskrivelse";
const friskmeldtBeskrivelse = "Arbeidstaker er friskmeldt";
const friskmeldtArsak = "Friskmeldt";
const arsakTitle = "Årsak";
const beskrivelseTitle = "Begrunnelse";
const vurdertAvTitle = "Vurdert av";

const oppfyltVurdering = createAktivitetskravVurdering(
  AktivitetskravStatus.OPPFYLT,
  [OppfyltVurderingArsak.FRISKMELDT],
  friskmeldtBeskrivelse,
  today
);
const oppfyltVurderingWithoutBeskrivelse: AktivitetskravVurderingDTO = {
  ...oppfyltVurdering,
  beskrivelse: undefined,
};
const ikkeOppfyltVurdering = createAktivitetskravVurdering(
  AktivitetskravStatus.IKKE_OPPFYLT,
  [],
  undefined
);
const unntakVurdering = createAktivitetskravVurdering(
  AktivitetskravStatus.UNNTAK,
  [UnntakVurderingArsak.MEDISINSKE_GRUNNER],
  enBeskrivelse,
  dayInThePast
);
const stansVurdering = createAktivitetskravVurdering(
  AktivitetskravStatus.STANS,
  []
);
const varsel: AktivitetskravVarselDTO = {
  uuid: "123",
  createdAt: today,
  svarfrist: daysFromToday(21),
  document: [
    {
      type: DocumentComponentType.HEADER_H1,
      texts: [enBeskrivelse],
    },
  ],
};

const forhandsvarselVurdering = createAktivitetskravVurdering(
  AktivitetskravStatus.FORHANDSVARSEL,
  [],
  enBeskrivelse,
  today,
  daysFromToday(21),
  varsel
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
    renderAktivitetskravHistorikk([
      forhandsvarselVurdering,
      unntakVurdering,
      oppfyltVurdering,
    ]);

    const allButtons = screen.getAllByRole("button");
    const vurderingButtons = allButtons.filter(
      (button) => button.textContent !== "Se hele brevet"
    );
    expect(vurderingButtons[0].textContent).to.contain(
      `Forhåndsvarsel - ${tilDatoMedManedNavn(today)}`
    );
    expect(vurderingButtons[1].textContent).to.contain(
      `Oppfylt - ${tilDatoMedManedNavn(today)}`
    );
    expect(vurderingButtons[2].textContent).to.contain(
      `Unntak - ${tilDatoMedManedNavn(dayInThePast)}`
    );
  });
  it("klikk på overskrift viser årsak med tittel, beskrivelse med tittel og veileder-navn", () => {
    renderAktivitetskravHistorikk([oppfyltVurdering]);

    const vurderingButton = screen.getByRole("button");
    userEvent.click(vurderingButton);

    expect(screen.getByText(arsakTitle)).to.exist;
    expect(screen.getByText(friskmeldtArsak)).to.exist;
    expect(screen.getByText(beskrivelseTitle)).to.exist;
    expect(screen.getByText(friskmeldtBeskrivelse)).to.exist;
    expect(screen.getByText(vurdertAvTitle)).to.exist;
    expect(screen.getByText(VEILEDER_DEFAULT.fulltNavn())).to.exist;
  });
  it("klikk på overskrift viser årsak med tittel og veileder-navn, uten beskrivelse og tittel hvis beskrivelse mangler", () => {
    renderAktivitetskravHistorikk([oppfyltVurderingWithoutBeskrivelse]);

    const vurderingButton = screen.getByRole("button");
    userEvent.click(vurderingButton);

    expect(screen.getByText(arsakTitle)).to.exist;
    expect(screen.getByText(friskmeldtArsak)).to.exist;
    expect(screen.queryByText(beskrivelseTitle)).to.not.exist;
    expect(screen.queryByText(friskmeldtBeskrivelse)).to.not.exist;
    expect(screen.getByText(vurdertAvTitle)).to.exist;
    expect(screen.getByText(VEILEDER_DEFAULT.fulltNavn())).to.exist;
  });
  it("klikk på overskrift viser kun veiledernavn hvis årsak og beskrivelse mangler", () => {
    renderAktivitetskravHistorikk([ikkeOppfyltVurdering]);

    const vurderingButton = screen.getByRole("button");
    userEvent.click(vurderingButton);

    expect(screen.queryByText(arsakTitle)).to.not.exist;
    expect(screen.queryByText(friskmeldtArsak)).to.not.exist;
    expect(screen.queryByText(beskrivelseTitle)).to.not.exist;
    expect(screen.queryByText(friskmeldtBeskrivelse)).to.not.exist;
    expect(screen.getByText(vurdertAvTitle)).to.exist;
    expect(screen.getByText(VEILEDER_DEFAULT.fulltNavn())).to.exist;
  });
  it("viser riktig overskrift for STANS-vurdering", () => {
    renderAktivitetskravHistorikk([stansVurdering]);

    expect(getButton(`Innstilling om stopp - ${tilDatoMedManedNavn(today)}`)).to
      .exist;
  });
  it("viser riktig overskrift for IKKE_OPPFYLT-vurdering", () => {
    renderAktivitetskravHistorikk([ikkeOppfyltVurdering]);

    expect(getButton(`Ikke oppfylt - ${tilDatoMedManedNavn(today)}`)).to.exist;
  });
  it("viser årsaker og beskrivelse for AVVENT-vurdering", () => {
    const avventVurdering = createAktivitetskravVurdering(
      AktivitetskravStatus.AVVENT,
      [
        AvventVurderingArsak.DROFTES_MED_ROL,
        AvventVurderingArsak.INFORMASJON_BEHANDLER,
      ],
      "Avventer litt"
    );
    renderAktivitetskravHistorikk([avventVurdering]);

    const vurderingButton = screen.getByRole("button");
    userEvent.click(vurderingButton);

    expect(screen.getByText(arsakTitle)).to.exist;
    expect(
      screen.getByText(
        "Drøftes med ROL, Har bedt om mer informasjon fra behandler"
      )
    ).to.exist;
    expect(screen.getByText("Beskrivelse")).to.exist;
    expect(screen.getByText("Avventer litt")).to.exist;
    expect(screen.getByText(vurdertAvTitle)).to.exist;
    expect(screen.getByText(VEILEDER_DEFAULT.fulltNavn())).to.exist;
  });
  it("Viser knapp for å se hele forhåndsvarsel-brevet dersom vurderingen var et forhåndsvarsel", () => {
    renderAktivitetskravHistorikk([forhandsvarselVurdering]);

    const vurderingAccordion = screen.getByRole("button");
    userEvent.click(vurderingAccordion);
    const button = screen.getByRole("button", { name: "Se hele brevet" });

    expect(screen.getByText(beskrivelseTitle)).to.exist;
    expect(screen.getByText(enBeskrivelse)).to.exist;
    expect(screen.getByText(vurdertAvTitle)).to.exist;
    expect(screen.getByText(VEILEDER_DEFAULT.fulltNavn())).to.exist;
    expect(button).to.exist;

    userEvent.click(button);

    const previewModal = screen.getByRole("dialog", { hidden: true });

    expect(
      within(previewModal).getByRole("heading", {
        name: enBeskrivelse,
        hidden: true,
      })
    ).to.exist;
  });
});
