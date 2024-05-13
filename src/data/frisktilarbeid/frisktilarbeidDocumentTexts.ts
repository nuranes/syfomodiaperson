import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";

export type VedtakTextsValues = {
  fom: Date | undefined;
  tom: Date | undefined;
};

export const getVedtakTexts = ({ fom, tom }: VedtakTextsValues) => ({
  header: "Vedtak om friskmelding til arbeidsformidling",
  intro:
    "Vi har vurdert at du oppfyller vilkårene for rett til friskmelding til arbeidsformidling. Dette betyr at du får utbetalt sykepenger i en periode på opptil 12 uker mens du søker ny jobb.",
  periode: `For deg gjelder dette perioden ${toReadableDateOrEmpty(
    fom
  )} til ${toReadableDateOrEmpty(tom)}.`,
  arbeidssoker: {
    part1: `Et vilkår for å motta sykepenger i denne perioden er at du har registrert deg som arbeidssøker hos NAV. For at dette vedtaket skal være gyldig må du derfor gjøre dette før ${toReadableDateOrEmpty(
      fom
    )}.`,
    part2: "For å registrere deg går du inn på nav.no/arbeid/registrering.",
  },
  hjemmel: "Dette vedtaket er gjort etter folketrygdloven paragraf 8-5.",
  behandler:
    "NAV har ikke delt informasjon med legen din om at du er innvilget ordningen friskmeldt til arbeidsformidling. Du må gjerne selv informere legen din om dette. Legen din trenger ikke å skrive ut sykmelding i perioden vedtaket gjelder.",
  begrunnelse: {
    header: "Begrunnelse",
    part1:
      "Du er for tiden sykmeldt og alle muligheter er prøvd for at du kan komme tilbake til arbeidsplassen din. Du har valgt å avslutte denne jobben for å benytte deg av ordningen friskmelding til arbeidsformidling.",
    part2:
      "For at du skal ha rett til sykepenger, er det vanligvis et krav at du er for syk til å jobbe. I utgangspunktet har du ikke rett til sykepenger hvis du kan utføre en annen jobb enn den du er sykmeldt fra. Ordningen friskmelding til arbeidsformidling gjør at du likevel kan få sykepenger i opptil 12 uker mens du søker ny jobb.",
  },
  nyttigInfo: {
    header: "Nyttig informasjon",
    part1:
      "Sykepengene blir utbetalt etter at du har sendt meldekort. Du sender meldekort til NAV hver 14.dag.",
    part2:
      "Utbetalingen stanser når du får ny jobb, eller hvis du velger å takke nei til et tilbud om en jobb.",
    part3:
      "Hvis du ikke har fått ny jobb innen perioden din med sykepenger er over, kan det være aktuelt for deg å søke om dagpenger. Du må i så fall huske å sende en søknad om dagpenger før perioden med sykepenger er over.",
    part4: "Les mer på nav.no/arbeidsledig.",
  },
  sporsmal: {
    header: "Spørsmål eller endringer",
    body: "Hvis det skjer en endring i din situasjon, kan det påvirke din rett til utbetaling av sykepenger. Mangelfulle eller feilaktige opplysninger kan medføre krav om tilbakebetaling av sykepenger. Se nav.no/endringer.",
  },
  kontakt:
    "Har du spørsmål om saken din kan du kontakte oss på nav.no/kontaktoss.",
  innsyn: {
    header: "Rett til innsyn",
    body: "Du har rett til innsyn i sakens opplysninger. Dette får du ved å logge deg inn på nav.no, eller ved å ta kontakt nav.no/kontaktoss.",
  },
  klage: {
    header: "Du har rett til å klage",
    body: "Hvis du ikke er enig i resultatet, kan du klage innen seks uker fra den datoen du mottok dette brevet. Les mer på nav.no/klagerettigheter og nav.no/klage#sykepenger.",
  },
});

const toReadableDateOrEmpty = (date: Date | undefined) =>
  date ? tilLesbarDatoMedArUtenManedNavn(date) : "";
