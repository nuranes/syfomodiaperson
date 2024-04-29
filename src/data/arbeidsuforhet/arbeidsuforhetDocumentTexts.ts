import { tilDatoMedManedNavn } from "../../utils/datoUtils";

type ForhandsvarselArbeidsuforhetTextsOptions = {
  frist: Date;
};

export const getForhandsvarselArbeidsuforhetTexts = ({
  frist,
}: ForhandsvarselArbeidsuforhetTextsOptions) => ({
  varselInfo: {
    header: "NAV vurderer å avslå sykepengene dine",
    introWithFristDate: `NAV vurderer å avslå sykepengene dine fra og med ${tilDatoMedManedNavn(
      frist
    )}.`,
  },
  begrunnelse: {
    uteAvStand:
      "For å få sykepenger må du være helt eller delvis ute av stand til å arbeide på grunn av sykdom eller skade.",
  },
  duKanUttaleDeg: {
    header: "Du kan uttale deg",
    tilbakemeldingWithFristDate: `Vi sender deg dette brevet for at du skal ha mulighet til å uttale deg før vi avgjør saken din. Du må sende inn opplysninger eller kontakte oss innen ${tilDatoMedManedNavn(
      frist
    )}.`,
    etterFrist: "Etter denne datoen vil NAV vurdere å avslå sykepengene dine.",
    friskmeldt: `Dersom du blir friskmeldt før ${tilDatoMedManedNavn(
      frist
    )} kan du se bort fra dette brevet.`,
    kontaktOss:
      "Kontakt oss gjerne på nav.no/skriv-til-oss eller telefon 55 55 33 33.",
  },
  lovhjemmel: {
    header: "Lovhjemmel",
    arbeidsuforhet:
      "Krav om arbeidsuførhet er beskrevet i folketrygdloven § 8-4 første ledd.",
    pliktInfo:
      "«Sykepenger ytes til den som er arbeidsufør på grunn av en funksjonsnedsettelse som klart skyldes sykdom eller skade. Arbeidsuførhet som skyldes sosiale eller økonomiske problemer o.l., gir ikke rett til sykepenger.»",
  },
});

export const getAvslagArbeidsuforhetTexts = (fom: Date | undefined) => ({
  header: "NAV har avslått sykepengene dine",
  fom: `NAV har avslått din søknad om sykepenger fra og med ${
    !!fom ? tilDatoMedManedNavn(fom) : ""
  }.`,
  intro:
    "For å få sykepenger må du ha en sykdom eller skade som gjør at du ikke kan være i arbeid, eller at du bare klarer å gjøre deler av arbeidet ditt.",
  hjemmel:
    "Vi har brukt folketrygdloven § 8-4 første ledd når vi har behandlet saken din.",
});

export const arbeidsuforhetTexts = {
  header: "Du har rett til videre utbetaling av sykepenger",
  previousForhandsvarsel: (forhandsvarselSendtDato: Date) =>
    `I forhåndsvarsel av ${tilDatoMedManedNavn(
      forhandsvarselSendtDato
    )} ble du informert om at NAV vurderte å avslå dine sykepenger. Vi har nå vurdert at vilkåret om arbeidsuførhet er oppfylt, og at du har rett til videre utbetaling av sykepenger.`,
  forAFaSykepenger: `For å få sykepenger må du ha en sykdom eller skade som gjør at du ikke klarer å være i arbeid, eller at du bare klarer å gjøre deler av arbeidet ditt.`,
  viHarBruktLoven: `Vi har brukt folketrygdloven § 8-4 første ledd når vi har behandlet saken din.`,
};
