import React from "react";
import { expect, describe, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import SoknadStatustekst from "@/utils/soknad-felles/SoknadStatustekst";
import { SykepengesoknadDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { defaultSoknad } from "../../mockdata/mockSoknader";

const renderSoknadStatustekst = (soknad: SykepengesoknadDTO) => {
  render(<SoknadStatustekst soknad={soknad} />);
};

describe("SoknadStatustekst", () => {
  it("Return correct statustekst when soknad is only sent to NAV, regardless of whether missing values are null or undefined", () => {
    const sendtTilNavDato = new Date("2022-01-01");
    const readableDate = tilLesbarDatoMedArstall(sendtTilNavDato);
    const soknad: SykepengesoknadDTO = {
      ...defaultSoknad,
      sendtTilNAVDato: new Date("2022-01-01"),
      sendtTilArbeidsgiverDato: undefined,
      arbeidsgiver: undefined,
    };

    renderSoknadStatustekst(soknad);

    expect(screen.getByText(`Sendt til NAV: ${readableDate}`)).to.exist;
  });

  it("Return correct statustekst when soknad is only sent to arbeidsgiver", () => {
    const sendtTilArbeidsgiverDato = new Date("2022-01-01");
    const readableDate = tilLesbarDatoMedArstall(sendtTilArbeidsgiverDato);
    const soknad: SykepengesoknadDTO = {
      ...defaultSoknad,
      sendtTilNAVDato: undefined,
      sendtTilArbeidsgiverDato: sendtTilArbeidsgiverDato,
      arbeidsgiver: {
        navn: "AG",
        orgnummer: "123",
      },
    };

    renderSoknadStatustekst(soknad);

    const arbeidsgiverNavn = soknad.arbeidsgiver?.navn;
    const orgnr = soknad.arbeidsgiver?.orgnummer;

    expect(
      screen.getByText(
        `Sendt til ${arbeidsgiverNavn} (org. nr. ${orgnr}): ${readableDate}`
      )
    ).to.exist;
  });

  it("Return correct statustekst when soknad is sent to both NAV and arbeidsgiver", () => {
    const sendtTilNAVDato = new Date("2022-01-01");
    const readableNAVDate = tilLesbarDatoMedArstall(sendtTilNAVDato);
    const sendtTilArbeidsgiverDato = new Date("2023-02-02");
    const soknad: SykepengesoknadDTO = {
      ...defaultSoknad,
      sendtTilNAVDato: sendtTilNAVDato,
      sendtTilArbeidsgiverDato: sendtTilArbeidsgiverDato,
      arbeidsgiver: {
        navn: "AG",
        orgnummer: "123",
      },
    };

    renderSoknadStatustekst(soknad);

    const arbeidsgiverNavn = soknad.arbeidsgiver?.navn;
    const orgnr = soknad.arbeidsgiver?.orgnummer;

    expect(
      `Sendt til NAV og ${arbeidsgiverNavn} (org. nr. ${orgnr}): ${readableNAVDate}`
    ).to.exist;
  });
});
