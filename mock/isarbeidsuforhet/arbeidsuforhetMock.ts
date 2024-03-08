import {
  ARBEIDSTAKER_DEFAULT,
  VEILEDER_DEFAULT,
} from "../common/mockConstants";
import { daysFromToday } from "../../test/testUtils";
import {
  DocumentComponentDto,
  DocumentComponentType,
} from "../../src/data/documentcomponent/documentComponentTypes";
import { VurderingType } from "../../src/data/arbeidsuforhet/arbeidsuforhetTypes";
import { getForhandsvarsel84Texts } from "../../src/data/arbeidsuforhet/forhandsvarsel84Texts";

const defaultBegrunnelse = "Du har ikke rett på sykepenger";

const getSendForhandsvarselDocument = (
  begrunnelse: string,
  frist: Date
): DocumentComponentDto[] => {
  const sendForhandsvarselTexts = getForhandsvarsel84Texts({
    frist,
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
      texts: ["Med vennlig hilsen", VEILEDER_DEFAULT.navn, "NAV"],
      type: DocumentComponentType.PARAGRAPH,
    },
  ];
};

export const mockArbeidsuforhetvurdering = [
  {
    uuid: "123",
    personident: ARBEIDSTAKER_DEFAULT.personIdent,
    createdAt: new Date(),
    veilederident: VEILEDER_DEFAULT.ident,
    type: VurderingType.FORHANDSVARSEL,
    begrunnelse: defaultBegrunnelse,
    varsel: {
      uuid: "123",
      document: getSendForhandsvarselDocument(
        defaultBegrunnelse,
        daysFromToday(21)
      ),
      createdAt: new Date(),
    },
  },
];
