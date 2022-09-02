import { expect } from "chai";
import hentStatustekst from "@/utils/soknad-felles/hentSoknadStatustekst";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";

describe("hentSoknadStatustekst", () => {
  describe("hentStatustekst", () => {
    it("Return correct statustekst when soknad is only sent to NAV, regardless of whether missing values are null or undefined", () => {
      const sendtTilNavDato = new Date("2022-01-01");
      const readableDate = tilLesbarDatoMedArstall(sendtTilNavDato);
      const soknad = {
        sendtTilNAVDato: "2022-01-01",
        innsendtDato: null,
        sendtTilArbeidsgiverDato: undefined,
      };

      const statustekst = hentStatustekst(soknad);

      expect(statustekst).to.be.equal(`Sendt til NAV: ${readableDate}`);
    });

    it("Return correct statustekst when soknad only has innsendtDato", () => {
      const innsendtDato = new Date("2022-01-01");
      const readableDate = tilLesbarDatoMedArstall(innsendtDato);
      const soknad = {
        sendtTilNAVDato: undefined,
        innsendtDato: innsendtDato,
        sendtTilArbeidsgiverDato: null,
      };

      const statustekst = hentStatustekst(soknad);

      expect(statustekst).to.be.equal(`Sendt til NAV: ${readableDate}`);
    });

    it("Return correct statustekst when soknad is only sent to arbeidsgiver", () => {
      const sendtTilArbeidsgiverDato = new Date("2022-01-01");
      const readableDate = tilLesbarDatoMedArstall(sendtTilArbeidsgiverDato);
      const soknad = {
        sendtTilNAVDato: null,
        innsendtDato: undefined,
        sendtTilArbeidsgiverDato: sendtTilArbeidsgiverDato,
        arbeidsgiver: {
          navn: "AG",
          orgnummer: "123",
        },
      };

      const statustekst = hentStatustekst(soknad);

      expect(statustekst).to.be.equal(
        `Sendt til AG (org. nr. 123): ${readableDate}`
      );
    });

    it("Return correct statustekst when soknad is sent to both NAV and arbeidsgiver, using sendtTilNAVDato as date", () => {
      const sendtTilNAVDato = new Date("2022-01-01");
      const readableNAVDate = tilLesbarDatoMedArstall(sendtTilNAVDato);
      const sendtTilArbeidsgiverDato = new Date("2023-02-02");
      const soknad = {
        sendtTilNAVDato: sendtTilNAVDato,
        innsendtDato: undefined,
        sendtTilArbeidsgiverDato: sendtTilArbeidsgiverDato,
        arbeidsgiver: {
          navn: "AG",
          orgnummer: "123",
        },
      };

      const statustekst = hentStatustekst(soknad);

      expect(statustekst).to.be.equal(
        `Sendt til NAV og AG (org. nr. 123): ${readableNAVDate}`
      );
    });
  });
});
