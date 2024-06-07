import {
  SykmeldingOldFormat,
  SykmeldingStatus,
} from "@/data/sykmelding/types/SykmeldingOldFormat";
import { erMeldingTilNavInformasjon } from "@/utils/sykmeldinger/sykmeldingUtils";
import { expect, describe, it } from "vitest";
import { BehandlingsutfallStatusDTO } from "@/data/sykmelding/types/BehandlingsutfallStatusDTO";
import { SporsmalSvarDTO } from "@/data/sykmelding/types/SporsmalSvarDTO";

const baseSykmelding: SykmeldingOldFormat = {
  arbeidsevne: {},
  behandlingsutfall: {
    ruleHits: [],
    status: BehandlingsutfallStatusDTO.OK,
  },
  bekreftelse: {},
  diagnose: {},
  friskmelding: {},
  id: "",
  meldingTilNav: {},
  mottattTidspunkt: new Date(),
  pasient: {},
  sendtdato: "",
  skalViseSkravertFelt: false,
  sporsmal: {},
  status: SykmeldingStatus.SENDT,
  tilbakedatering: {},
  utdypendeOpplysninger: new Map<string, Map<string, SporsmalSvarDTO>>(),
  mulighetForArbeid: {
    perioder: [],
  },
};
describe("sykmeldingUtils - Section 8 of sykmelding: Melding Til Nav", () => {
  describe("erMeldingTilNavInformasjon", () => {
    it("return true if Sykmelder has checked box 'Ønskes bistand fra NAV nå?'", () => {
      const sykmelding: SykmeldingOldFormat = {
        ...baseSykmelding,
        meldingTilNav: {
          navBoerTaTakISaken: true,
        },
      };

      const erEkstraInfo = erMeldingTilNavInformasjon(sykmelding);

      expect(erEkstraInfo).to.equal(true);
    });

    it("return true if Sykmelder has given a text reason in section 8 ", () => {
      const sykmelding: SykmeldingOldFormat = {
        ...baseSykmelding,
        meldingTilNav: {
          navBoerTaTakISaken: false,
          navBoerTaTakISakenBegrunnelse: "Nav bør se på saken",
        },
      };

      const erEkstraInfo = erMeldingTilNavInformasjon(sykmelding);

      expect(erEkstraInfo).to.equal(true);
    });

    it("return false if Sykmelder has not given any information to Nav in section 8", () => {
      const sykmelding: SykmeldingOldFormat = {
        ...baseSykmelding,
        meldingTilNav: {
          navBoerTaTakISaken: false,
        },
      };

      const erEkstraInfo = erMeldingTilNavInformasjon(sykmelding);

      expect(erEkstraInfo).to.equal(false);
    });

    it("return false if meldingTilNav is undefined in Sykmelding", () => {
      const erIkkeEkstraInfo = erMeldingTilNavInformasjon(baseSykmelding);

      expect(erIkkeEkstraInfo).to.equal(false);
    });
  });
});
