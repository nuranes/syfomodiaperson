import {
  DocumentComponentDto,
  DocumentComponentType,
} from "@/data/documentcomponent/documentComponentTypes";
import { VEILEDER_DEFAULT } from "../../mock/common/mockConstants";
import { addWeeks } from "@/utils/datoUtils";
import {
  Brevmal,
  getForhandsvarselTexts,
} from "@/data/aktivitetskrav/forhandsvarselTexts";

const expectedFristDate = addWeeks(new Date(), 3);

export const getSendForhandsvarselDocument = (
  beskrivelse: string,
  mal: Brevmal = Brevmal.MED_ARBEIDSGIVER
): DocumentComponentDto[] => {
  const sendForhandsvarselTexts = getForhandsvarselTexts({
    frist: expectedFristDate,
    mal,
  });
  return [
    {
      texts: [sendForhandsvarselTexts.varselInfo.header],
      type: DocumentComponentType.HEADER_H1,
    },
    {
      texts: [sendForhandsvarselTexts.varselInfo.introWithFristDate],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [beskrivelse],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [sendForhandsvarselTexts.unngaStansInfo.header],
      type: DocumentComponentType.HEADER_H3,
    },
    {
      texts: [
        sendForhandsvarselTexts.unngaStansInfo.tiltak1,
        sendForhandsvarselTexts.unngaStansInfo.tiltak2,
        sendForhandsvarselTexts.unngaStansInfo.tiltak3,
      ],
      type: DocumentComponentType.BULLET_POINTS,
    },
    {
      texts: [sendForhandsvarselTexts.giOssTilbakemelding.header],
      type: DocumentComponentType.HEADER_H3,
    },
    {
      texts: [
        sendForhandsvarselTexts.giOssTilbakemelding.tilbakemeldingWithFristDate,
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [sendForhandsvarselTexts.giOssTilbakemelding.kontaktOss],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [sendForhandsvarselTexts.lovhjemmel.header],
      type: DocumentComponentType.HEADER_H3,
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
      texts: ["Med vennlig hilsen", VEILEDER_DEFAULT.navn, "NAV"],
      type: DocumentComponentType.PARAGRAPH,
    },
  ];
};
