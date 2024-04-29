import {
  ARBEIDSTAKER_DEFAULT,
  VEILEDER_DEFAULT,
} from "../common/mockConstants";
import { daysFromToday } from "../../test/testUtils";
import {
  DocumentComponentDto,
  DocumentComponentType,
} from "../../src/data/documentcomponent/documentComponentTypes";
import {
  VarselDTO,
  VurderingResponseDTO,
  VurderingType,
} from "../../src/data/arbeidsuforhet/arbeidsuforhetTypes";
import {
  arbeidsuforhetTexts,
  getForhandsvarselArbeidsuforhetTexts,
} from "../../src/data/arbeidsuforhet/arbeidsuforhetDocumentTexts";

const defaultOppfyltBegrunnelse = "Du har rett på sykepenger";

const getSendForhandsvarselDocument = (
  begrunnelse: string,
  frist: Date
): DocumentComponentDto[] => {
  const sendForhandsvarselTexts = getForhandsvarselArbeidsuforhetTexts({
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
      texts: ["Med vennlig hilsen", VEILEDER_DEFAULT.fulltNavn(), "NAV"],
      type: DocumentComponentType.PARAGRAPH,
    },
  ];
};

const getOppfyltDocument = (
  begrunnelse: string,
  forhandsvarselSendtDato: Date
): DocumentComponentDto[] => {
  return [
    {
      texts: [arbeidsuforhetTexts.header],
      type: DocumentComponentType.HEADER_H1,
    },
    {
      texts: [
        arbeidsuforhetTexts.previousForhandsvarsel(forhandsvarselSendtDato),
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [arbeidsuforhetTexts.forAFaSykepenger],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [begrunnelse],
      type: DocumentComponentType.PARAGRAPH,
    },
  ];
};

const mockVarsel: VarselDTO = {
  uuid: "1234",
  createdAt: daysFromToday(-50),
  svarfrist: daysFromToday(-30),
  isExpired: false,
};

export const mockArbeidsuforhetvurdering: VurderingResponseDTO[] = [
  {
    uuid: "123",
    personident: ARBEIDSTAKER_DEFAULT.personIdent,
    createdAt: daysFromToday(-40),
    veilederident: VEILEDER_DEFAULT.ident,
    type: VurderingType.OPPFYLT,
    begrunnelse: defaultOppfyltBegrunnelse,
    document: getOppfyltDocument(defaultOppfyltBegrunnelse, daysFromToday(-40)),
    varsel: undefined,
  },
  {
    uuid: "098",
    personident: ARBEIDSTAKER_DEFAULT.personIdent,
    createdAt: daysFromToday(-50),
    veilederident: VEILEDER_DEFAULT.ident,
    type: VurderingType.FORHANDSVARSEL,
    begrunnelse: defaultOppfyltBegrunnelse,
    document: getSendForhandsvarselDocument(
      "En begrunnelse forhåndsvarsel",
      daysFromToday(-30)
    ),
    varsel: mockVarsel,
  },
];
