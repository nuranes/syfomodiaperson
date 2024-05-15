import { VedtakResponseDTO } from "@/data/frisktilarbeid/frisktilarbeidTypes";
import {
  ARBEIDSTAKER_DEFAULT,
  ARBEIDSTAKER_DEFAULT_FULL_NAME,
  VEILEDER_DEFAULT,
} from "../../mock/common/mockConstants";
import { addWeeks, tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import {
  DocumentComponentDto,
  DocumentComponentType,
} from "@/data/documentcomponent/documentComponentTypes";

export const createVedtak = (
  fom: Date,
  ferdigbehandletAt: Date | undefined = undefined
): VedtakResponseDTO => ({
  uuid: "123",
  createdAt: new Date(),
  veilederident: VEILEDER_DEFAULT.ident,
  fom,
  tom: addWeeks(fom, 12),
  begrunnelse: "begrunnelse",
  document: [],
  ferdigbehandletAt: ferdigbehandletAt,
  ferdigbehandletBy: ferdigbehandletAt && VEILEDER_DEFAULT.ident,
});

type ExpectedVedtakDocumentOptions = {
  fom: Date;
  tom: Date;
  begrunnelse: string;
  tilDatoIsMaxDato: boolean;
};

export const getExpectedVedtakDocument = ({
  fom,
  tom,
  begrunnelse,
  tilDatoIsMaxDato,
}: ExpectedVedtakDocumentOptions): DocumentComponentDto[] => {
  return [
    {
      texts: ["Vedtak om friskmelding til arbeidsformidling"],
      type: DocumentComponentType.HEADER_H1,
    },
    {
      texts: [
        `${ARBEIDSTAKER_DEFAULT_FULL_NAME}, ${ARBEIDSTAKER_DEFAULT.personIdent}`,
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [
        "Vi har vurdert at du oppfyller vilkårene for rett til friskmelding til arbeidsformidling. Dette betyr at du får utbetalt sykepenger i en periode på opptil 12 uker mens du søker ny jobb.",
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [
        `For deg gjelder dette perioden ${tilLesbarDatoMedArUtenManedNavn(
          fom
        )} til ${tilLesbarDatoMedArUtenManedNavn(tom)}.`,
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    ...(tilDatoIsMaxDato
      ? [
          {
            texts: [
              `Siden din maksdato for sykepenger er beregnet til ${tilLesbarDatoMedArUtenManedNavn(
                tom
              )}, vil du ikke få sykepenger etter denne datoen.`,
            ],
            type: DocumentComponentType.PARAGRAPH,
          },
        ]
      : []),
    {
      texts: [
        `Et vilkår for å motta sykepenger i denne perioden er at du har registrert deg som arbeidssøker hos NAV. For at dette vedtaket skal være gyldig må du derfor gjøre dette før ${tilLesbarDatoMedArUtenManedNavn(
          fom
        )}.`,
        "For å registrere deg går du inn på nav.no/arbeid/registrering.",
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: ["Dette vedtaket er gjort etter folketrygdloven paragraf 8-5."],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      title: "Begrunnelse",
      texts: [
        "Du er for tiden sykmeldt og alle muligheter er prøvd for at du kan komme tilbake til arbeidsplassen din. Du har valgt å avslutte denne jobben for å benytte deg av ordningen friskmelding til arbeidsformidling.",
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    { texts: [begrunnelse], type: DocumentComponentType.PARAGRAPH },
    {
      texts: [
        "For at du skal ha rett til sykepenger, er det vanligvis et krav at du er for syk til å jobbe. I utgangspunktet har du ikke rett til sykepenger hvis du kan utføre en annen jobb enn den du er sykmeldt fra. Ordningen friskmelding til arbeidsformidling gjør at du likevel kan få sykepenger i opptil 12 uker mens du søker ny jobb.",
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      title: "Nyttig informasjon",
      texts: [
        "Sykepengene blir utbetalt etter at du har sendt meldekort. Du sender meldekort til NAV hver 14.dag.",
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [
        "Utbetalingen stanser når du får ny jobb, eller hvis du velger å takke nei til et tilbud om en jobb.",
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [
        "Hvis du ikke har fått ny jobb innen perioden din med sykepenger er over, kan det være aktuelt for deg å søke om dagpenger. Du må i så fall huske å sende en søknad om dagpenger før perioden med sykepenger er over.",
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: ["Les mer på nav.no/arbeidsledig."],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [
        "NAV har ikke delt informasjon med legen din om at du er innvilget ordningen friskmeldt til arbeidsformidling. Du må gjerne selv informere legen din om dette. Legen din trenger ikke å skrive ut sykmelding i perioden vedtaket gjelder.",
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      title: "Spørsmål eller endringer",
      texts: [
        "Hvis det skjer en endring i din situasjon, kan det påvirke din rett til utbetaling av sykepenger. Mangelfulle eller feilaktige opplysninger kan medføre krav om tilbakebetaling av sykepenger. Se nav.no/endringer.",
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [
        "Har du spørsmål om saken din kan du kontakte oss på nav.no/kontaktoss.",
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      title: "Rett til innsyn",
      texts: [
        "Du har rett til innsyn i sakens opplysninger. Dette får du ved å logge deg inn på nav.no, eller ved å ta kontakt nav.no/kontaktoss.",
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      title: "Du har rett til å klage",
      texts: [
        "Hvis du ikke er enig i resultatet, kan du klage innen seks uker fra den datoen du mottok dette brevet. Les mer på nav.no/klagerettigheter og nav.no/klage#sykepenger.",
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: ["Med vennlig hilsen", VEILEDER_DEFAULT.fulltNavn(), "NAV"],
      type: DocumentComponentType.PARAGRAPH,
    },
  ];
};
