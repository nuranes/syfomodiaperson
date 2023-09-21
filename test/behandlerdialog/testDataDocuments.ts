import {
  DocumentComponentDto,
  DocumentComponentType,
} from "@/data/documentcomponent/documentComponentTypes";
import {
  ARBEIDSTAKER_DEFAULT,
  ARBEIDSTAKER_DEFAULT_FULL_NAME,
  VEILEDER_DEFAULT,
} from "../../mock/common/mockConstants";
import { MeldingDTO } from "@/data/behandlerdialog/behandlerdialogTypes";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";

export const expectedTilleggsopplysningerDocument = (
  meldingTekst: string
): DocumentComponentDto[] => [
  {
    texts: ["Spørsmål om tilleggsopplysninger vedrørende pasient"],
    type: DocumentComponentType.HEADER_H1,
  },
  {
    texts: [
      `Gjelder pasient: ${ARBEIDSTAKER_DEFAULT_FULL_NAME}, ${ARBEIDSTAKER_DEFAULT.personIdent}.`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      "NAV trenger opplysninger fra deg vedrørende din pasient. Du kan utelate opplysninger som etter din vurdering faller utenfor formålet.",
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [meldingTekst],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: ["Spørsmålene besvares i fritekst, og honoreres med takst L8."],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    title: "Lovhjemmel",
    texts: [
      "Folketrygdloven § 21-4 andre ledd gir NAV rett til å innhente nødvendige opplysninger. Dette gjelder selv om opplysningene er taushetsbelagte, jf. § 21-4 sjette ledd.",
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      "Pålegget om utlevering av opplysninger kan påklages etter forvaltningsloven § 14.",
      "Klageadgangen gjelder kun lovligheten i pålegget. Fristen for å klage er tre dager etter at pålegget er mottatt. Klagen kan fremsettes muntlig eller skriftlig.",
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: ["Med vennlig hilsen", VEILEDER_DEFAULT.navn, "NAV"],
    type: DocumentComponentType.PARAGRAPH,
  },
];

export const expectedPaminnelseDocument = (
  opprinneligMelding: MeldingDTO
): DocumentComponentDto[] => [
  {
    texts: ["Påminnelse om manglende svar vedrørerende pasient"],
    type: DocumentComponentType.HEADER_H1,
  },
  {
    texts: [
      `Gjelder ${ARBEIDSTAKER_DEFAULT_FULL_NAME}, f.nr. ${ARBEIDSTAKER_DEFAULT.personIdent}.`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      `Vi viser til tidligere forespørsel av ${tilLesbarDatoMedArUtenManedNavn(
        opprinneligMelding.tidspunkt
      )} angående din pasient.`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      "Vi kan ikke se å ha mottatt svar på vår henvendelse og ber om at denne besvares snarest.",
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      "Hvis opplysningene er sendt oss i løpet av de siste dagene, kan du se bort fra denne meldingen.",
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: ["Med vennlig hilsen", VEILEDER_DEFAULT.navn, "NAV"],
    type: DocumentComponentType.PARAGRAPH,
  },
];

export const expectedLegeerklaringDocument = (
  meldingTekst: string
): DocumentComponentDto[] => [
  {
    texts: ["Forespørsel om legeerklæring ved arbeidsuførhet"],
    type: DocumentComponentType.HEADER_H1,
  },
  {
    texts: [
      `Gjelder pasient: ${ARBEIDSTAKER_DEFAULT_FULL_NAME}, ${ARBEIDSTAKER_DEFAULT.personIdent}.`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      "NAV trenger opplysninger fra deg vedrørende din pasient. Du kan utelate opplysninger som etter din vurdering faller utenfor formålet.",
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      "«Legeerklæring ved arbeidsuførhet» leveres på blankett NAV 08-07.08, og honoreres med takst L40.",
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [meldingTekst],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    title: "Lovhjemmel",
    texts: [
      "Folketrygdloven § 21-4 andre ledd gir NAV rett til å innhente nødvendige opplysninger. Dette gjelder selv om opplysningene er taushetsbelagte, jf. § 21-4 sjette ledd.",
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      "Pålegget om utlevering av opplysninger kan påklages etter forvaltningsloven § 14.",
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      "Klageadgangen gjelder kun lovligheten i pålegget. Fristen for å klage er tre dager etter at pålegget er mottatt. Klagen kan fremsettes muntlig eller skriftlig.",
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: ["Med vennlig hilsen", VEILEDER_DEFAULT.navn, "NAV"],
    type: DocumentComponentType.PARAGRAPH,
  },
];

export const expectedReturLegeerklaringDocument = (
  begrunnelse = "(Obligatorisk begrunnelse)"
): DocumentComponentDto[] => [
  {
    texts: ["Retur av Legeerklæring ved arbeidsuførhet"],
    type: DocumentComponentType.HEADER_H1,
  },
  {
    texts: [
      `Gjelder ${ARBEIDSTAKER_DEFAULT_FULL_NAME}, ${ARBEIDSTAKER_DEFAULT.personIdent}.`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      "Vi har mottatt Legeerklæring ved arbeidsuførhet (NAV 08-07.08). Vi ber om at du sender oss en ny legeerklæring snarest mulig.",
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      "Erklæringen kan ikke honoreres fordi den ikke inneholder tilstrekkelige opplysninger til bruk i den videre behandlingen av saken.",
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [begrunnelse],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      'Hvis du har spørsmål til utfyllingen, henvises det til "Orientering til legen om bruk og utfylling av Legeerklæring ved arbeidsuførhet" (se nav.no).',
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      "Dersom du allerede har sendt inn regning for den mangelfulle erklæringen, forutsetter vi at det ikke blir sendt regning for ny utfylt Legeerklæring ved arbeidsuførhet.",
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: ["Med vennlig hilsen", VEILEDER_DEFAULT.navn, "NAV"],
    type: DocumentComponentType.PARAGRAPH,
  },
];

export const expectedMeldingFraNAVDocument = (
  meldingTekst: string
): DocumentComponentDto[] => [
  {
    texts: ["Melding fra NAV"],
    type: DocumentComponentType.HEADER_H1,
  },
  {
    texts: [
      `Gjelder pasient: ${ARBEIDSTAKER_DEFAULT_FULL_NAME}, ${ARBEIDSTAKER_DEFAULT.personIdent}.`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [meldingTekst],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: ["Med vennlig hilsen", VEILEDER_DEFAULT.navn, "NAV"],
    type: DocumentComponentType.PARAGRAPH,
  },
];
