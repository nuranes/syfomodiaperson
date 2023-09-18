import {
  AvventVurderingArsak,
  OppfyltVurderingArsak,
  UnntakVurderingArsak,
  VurderingArsak,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";

export type VurderingArsakTexts = {
  [key in VurderingArsak]?: string;
};

export const oppfyltVurderingArsakTexts: VurderingArsakTexts = {
  [OppfyltVurderingArsak.FRISKMELDT]: "Friskmeldt",
  [OppfyltVurderingArsak.GRADERT]: "Gradert",
  [OppfyltVurderingArsak.TILTAK]: "I tiltak",
};

export const unntakVurderingArsakTexts: VurderingArsakTexts = {
  [UnntakVurderingArsak.MEDISINSKE_GRUNNER]: "Medisinske grunner",
  [UnntakVurderingArsak.TILRETTELEGGING_IKKE_MULIG]:
    "Tilrettelegging ikke mulig",
  [UnntakVurderingArsak.SJOMENN_UTENRIKS]: "Sjømenn i utenriksfart",
};

export const avventVurderingArsakTexts: VurderingArsakTexts = {
  [AvventVurderingArsak.OPPFOLGINGSPLAN_ARBEIDSGIVER]:
    "Har bedt om oppfølgingsplan fra arbeidsgiver",
  [AvventVurderingArsak.INFORMASJON_BEHANDLER]:
    "Har bedt om mer informasjon fra behandler",
  [AvventVurderingArsak.ANNET]: "Annet",
};

export const sendForhandsvarselTexts = {
  varselInfo: {
    header: "Varsel om stans av sykepenger",
    introWithFristDate: (frist: Date) =>
      `Du har nå vært 100% sykmeldt i mer enn åtte uker. Da har du plikt til å være i aktivitet. Ut fra opplysningene NAV har i saken har vi vurdert at du ikke oppfyller vilkårene for å unntas aktivitetsplikten. Vi vurderer å stanse sykepengene dine fra og med ${tilDatoMedManedNavn(
        frist
      )}.`,
    intro2:
      "Når vi vurderer om du oppfyller aktivitetsplikten, ser vi på hva arbeidsgiveren din har gjort for at du kan jobbe. Vi vurderer også om du er for syk til å være i aktivitet.",
  },
  unngaStansInfo: {
    header: "Du kan unngå stans av sykepenger",
    tiltak1:
      "- Kommer du helt eller delvis tilbake i arbeid, oppfyller du aktivitetsplikten og kan fortsatt få sykepenger.",
    tiltak2:
      "- Gir arbeidsgiveren din en skriftlig begrunnelse for at det ikke er mulig å legge til rette for at du kan jobbe, kan utbetalingen av sykepenger fortsette.",
    tiltak3:
      "- Går det fram av sykmeldingen at du er for syk til å arbeide, får du fortsatt sykepenger.",
    tilbakemeldingWithFristDate: (frist: Date) =>
      `Vi må ha tilbakemelding fra deg, arbeidsgiveren din eller den som har sykmeldt deg innen ${tilDatoMedManedNavn(
        frist
      )}. Ellers vil sykepengene dine stanses fra denne datoen.`,
    kontaktOss:
      "Kontakt oss gjerne på nav.no/skrivtiloss eller telefon 55 55 33 33.", //TODO: Vise dette som link?
  },
  lovhjemmel: {
    header: "Lovhjemmel",
    aktivitetsplikten:
      "Aktivitetsplikten er beskrevet i folketrygdloven § 8-8 2.ledd.",
    pliktInfo:
      "«Medlemmet har plikt til å være i arbeidsrelatert aktivitet, jf. § 8-7 a første ledd og arbeidsmiljøloven § 4-6 første ledd," +
      " så tidlig som mulig, og senest innen 8 uker. Dette gjelder ikke når medisinske grunner klart er til hinder for slik aktivitet," +
      " eller arbeidsrelaterte aktiviteter ikke kan gjennomføres på arbeidsplassen.»",
  },
};
