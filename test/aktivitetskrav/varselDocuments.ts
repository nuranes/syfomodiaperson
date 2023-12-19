import {
  DocumentComponentDto,
  DocumentComponentType,
} from "@/data/documentcomponent/documentComponentTypes";
import {
  ARBEIDSTAKER_DEFAULT,
  ARBEIDSTAKER_DEFAULT_FULL_NAME,
  VEILEDER_DEFAULT,
} from "../../mock/common/mockConstants";
import { addWeeks, tilDatoMedManedNavn } from "@/utils/datoUtils";
import {
  Brevmal,
  getForhandsvarselTexts,
} from "@/data/aktivitetskrav/forhandsvarselTexts";
import { UnntakVurderingArsak } from "@/data/aktivitetskrav/aktivitetskravTypes";
import { unntakVurderingArsakTexts } from "@/data/aktivitetskrav/aktivitetskravTexts";

const expectedFristDate = addWeeks(new Date(), 3);

export const getUnntakDocument = (
  begrunnelse: string,
  arsak: UnntakVurderingArsak
): DocumentComponentDto[] => {
  return [
    {
      texts: ["Vurdering av aktivitetskravet"],
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
        `Det ble vurdert unntak fra aktivitetskravet den ${tilDatoMedManedNavn(
          new Date()
        )}. Årsak: ${unntakVurderingArsakTexts[arsak]}.`,
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [`Begrunnelse: ${begrunnelse}`],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [
        "Vedtak ble fattet etter folketrygdloven § 8-8 andre ledd, samt tilhørende rundskriv.",
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [`Vurdert av ${VEILEDER_DEFAULT.navn}`],
      type: DocumentComponentType.PARAGRAPH,
    },
  ];
};

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
