import {
  DocumentComponentDto,
  DocumentComponentType,
} from "@/data/documentcomponent/documentComponentTypes";
import { addWeeks, tilDatoMedManedNavn } from "@/utils/datoUtils";
import { getForhandsvarsel84Texts } from "@/data/arbeidsuforhet/forhandsvarsel84Texts";
import {
  ARBEIDSTAKER_DEFAULT,
  ARBEIDSTAKER_DEFAULT_FULL_NAME,
  VEILEDER_DEFAULT,
} from "../../mock/common/mockConstants";

const expectedFristDate = addWeeks(new Date(), 3);

export const getSendForhandsvarselDocument = (
  begrunnelse: string
): DocumentComponentDto[] => {
  const sendForhandsvarselTexts = getForhandsvarsel84Texts({
    frist: expectedFristDate,
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
      texts: [sendForhandsvarselTexts.begrunnelse.uteAvStand],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [begrunnelse],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [sendForhandsvarselTexts.duKanUttaleDeg.header],
      type: DocumentComponentType.HEADER_H3,
    },
    {
      texts: [
        sendForhandsvarselTexts.duKanUttaleDeg.tilbakemeldingWithFristDate,
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [sendForhandsvarselTexts.duKanUttaleDeg.etterFrist],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [sendForhandsvarselTexts.duKanUttaleDeg.kontaktOss],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [sendForhandsvarselTexts.lovhjemmel.header],
      type: DocumentComponentType.HEADER_H3,
    },
    {
      texts: [sendForhandsvarselTexts.lovhjemmel.arbeidsuforhet],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [sendForhandsvarselTexts.lovhjemmel.pliktInfo],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: ["Med vennlig hilsen", VEILEDER_DEFAULT.fulltNavn(), "NAV"],
      type: DocumentComponentType.PARAGRAPH,
    },
  ];
};

export const getSendVurderingDocument = (
  begrunnelse: string
): DocumentComponentDto[] => {
  return [
    {
      texts: ["Vurdering av arbeidsuførhet"],
      type: DocumentComponentType.HEADER_H1,
    },
    {
      texts: [
        `Gjelder ${ARBEIDSTAKER_DEFAULT_FULL_NAME}, f.nr. ${ARBEIDSTAKER_DEFAULT.personIdent}`,
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [`Det ble vurdert oppfylt den ${tilDatoMedManedNavn(new Date())}`],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [`Begrunnelse: ${begrunnelse}`],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [`Vurdert av ${VEILEDER_DEFAULT.fulltNavn()}`],
      type: DocumentComponentType.PARAGRAPH,
    },
  ];
};
