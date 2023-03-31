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
      `Gjelder ${ARBEIDSTAKER_DEFAULT_FULL_NAME}, f.nr. ${ARBEIDSTAKER_DEFAULT.personIdent}`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      "Som et ledd i NAVs videre vurdering oppfølging av din pasient ber vi deg besvare følgende spørsmål:",
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [meldingTekst],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      "Opplysninger som etter din vurdering faller utenfor formålet, kan du utelade i oversendelsen til NAV.",
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      "Det er ikke utarbeidet blankett til dette formålet. Spørsmålene besvares i fritekst, og honoreres med takst L8.",
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: ["Folketrygdeloven § 21-4"],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      "Pålegget om utlevering av opplysninger kan påklages etter forvaltningsloven § 14",
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: ["Vennlig hilsen", VEILEDER_DEFAULT.navn, "NAV"],
    type: DocumentComponentType.PARAGRAPH,
  },
];
