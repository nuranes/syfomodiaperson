import { tilDatoMedManedNavn } from "../../utils/datoUtils";

type Forhandsvarsel84TextsOptions = {
  frist: Date;
};

export const getForhandsvarsel84Texts = ({
  frist,
}: Forhandsvarsel84TextsOptions) => ({
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
