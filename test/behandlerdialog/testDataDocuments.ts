import {
  DocumentComponentDto,
  DocumentComponentType,
} from "@/data/documentcomponent/documentComponentTypes";
import {
  ARBEIDSTAKER_DEFAULT,
  ARBEIDSTAKER_DEFAULT_FULL_NAME,
  VEILEDER_DEFAULT,
} from "../../mock/common/mockConstants";

export const expectedMeldingTilBehandlerDocument = (
  meldingTekst: string
): DocumentComponentDto[] => [
  {
    texts: ["Spørsmål om tilleggsopplysninger vedrørende pasient"],
    type: DocumentComponentType.HEADER_H1,
  },
  {
    texts: [
      `Gjelder pasient: ${ARBEIDSTAKER_DEFAULT_FULL_NAME}, ${ARBEIDSTAKER_DEFAULT.personIdent}`,
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
    texts: ["Vennlig hilsen", VEILEDER_DEFAULT.navn, "NAV"],
    type: DocumentComponentType.PARAGRAPH,
  },
];
