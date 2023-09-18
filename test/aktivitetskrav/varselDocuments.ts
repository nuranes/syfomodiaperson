import {
  DocumentComponentDto,
  DocumentComponentType,
} from "@/data/documentcomponent/documentComponentTypes";
import { sendForhandsvarselTexts } from "@/data/aktivitetskrav/aktivitetskravTexts";
import {
  ARBEIDSTAKER_DEFAULT,
  ARBEIDSTAKER_DEFAULT_FULL_NAME,
  VEILEDER_DEFAULT,
} from "../../mock/common/mockConstants";
import { getFristForForhandsvarsel } from "@/components/aktivitetskrav/vurdering/SendForhandsvarselSkjema";

export const getSendForhandsvarselDocument = (
  beskrivelse: string
): DocumentComponentDto[] => [
  {
    texts: [
      `Hei, ${ARBEIDSTAKER_DEFAULT_FULL_NAME}, ${ARBEIDSTAKER_DEFAULT.personIdent}`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [sendForhandsvarselTexts.varselInfo.header],
    type: DocumentComponentType.HEADER_H2,
  },
  {
    texts: [
      sendForhandsvarselTexts.varselInfo.introWithFristDate(
        getFristForForhandsvarsel()
      ),
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [sendForhandsvarselTexts.varselInfo.intro2],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [beskrivelse],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [sendForhandsvarselTexts.unngaStansInfo.header],
    type: DocumentComponentType.HEADER_H2,
  },
  {
    texts: [
      sendForhandsvarselTexts.unngaStansInfo.tiltak1,
      sendForhandsvarselTexts.unngaStansInfo.tiltak2,
      sendForhandsvarselTexts.unngaStansInfo.tiltak3,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      sendForhandsvarselTexts.unngaStansInfo.tilbakemeldingWithFristDate(
        getFristForForhandsvarsel()
      ),
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [sendForhandsvarselTexts.unngaStansInfo.kontaktOss],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [sendForhandsvarselTexts.lovhjemmel.header],
    type: DocumentComponentType.HEADER_H2,
  },
  {
    texts: [sendForhandsvarselTexts.lovhjemmel.aktivitetsplikten],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [sendForhandsvarselTexts.lovhjemmel.pliktInfo],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: ["Vennlig hilsen", VEILEDER_DEFAULT.navn, "NAV"],
    type: DocumentComponentType.PARAGRAPH,
  },
];
