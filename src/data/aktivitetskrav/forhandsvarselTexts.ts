import { tilDatoMedManedNavn } from "../../utils/datoUtils";

export const sendForhandsvarselTexts = {
  varselInfo: {
    header: "Varsel om stans av sykepenger",
    introWithFristDate: (frist: Date) =>
      `Du har nå vært sykmeldt i mer enn åtte uker. Da har du plikt til å være i aktivitet. Ut fra opplysningene NAV har i saken har vi vurdert at du ikke oppfyller vilkårene for å unntas aktivitetsplikten. Vi vurderer å stanse sykepengene dine fra og med ${tilDatoMedManedNavn(
        frist
      )}.`,
  },
  unngaStansInfo: {
    header: "Du kan unngå stans av sykepenger",
    tiltak1:
      "Kommer du helt eller delvis tilbake i arbeid, oppfyller du aktivitetsplikten og kan fortsatt få sykepenger. Aktivitet kan dokumenteres med gradert sykmelding eller i søknaden om sykepenger.",
    tiltak2:
      "Aktivitetsplikten vil også være oppfylt hvis du deltar i et arbeidsrettet tiltak i regi av NAV. Ta kontakt med NAV hvis du tenker at dette er aktuelt for deg.",
    tiltak3:
      "Du kan få unntak fra aktivitetsplikten dersom arbeidsgiveren din gir en skriftlig begrunnelse for at det ikke er mulig å legge til rette for at du kan jobbe, eller dersom din lege dokumenterer at medisinske grunner klart er til hinder for arbeidsrelatert aktivitet.",
  },
  giOssTilbakemelding: {
    header: "Gi oss tilbakemelding",
    tilbakemeldingWithFristDate: (frist: Date) =>
      `Vi ber om tilbakemelding fra deg, arbeidsgiveren din eller den som har sykmeldt deg innen ${tilDatoMedManedNavn(
        frist
      )}. Etter denne datoen vil NAV vurdere å stanse sykepengene dine.`,
    kontaktOss:
      "Kontakt oss gjerne på nav.no/skriv-til-oss eller telefon 55 55 33 33.",
  },
  lovhjemmel: {
    header: "Lovhjemmel",
    aktivitetsplikten:
      "Aktivitetsplikten er beskrevet i folketrygdloven § 8-8 andre ledd.",
    pliktInfo:
      "«Medlemmet har plikt til å være i arbeidsrelatert aktivitet, jf. § 8-7 a første ledd og arbeidsmiljøloven § 4-6 første ledd," +
      " så tidlig som mulig, og senest innen 8 uker. Dette gjelder ikke når medisinske grunner klart er til hinder for slik aktivitet," +
      " eller arbeidsrelaterte aktiviteter ikke kan gjennomføres på arbeidsplassen.»",
  },
};
