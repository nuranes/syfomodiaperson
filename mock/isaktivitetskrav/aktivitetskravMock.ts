import {
  AktivitetskravDTO,
  AktivitetskravStatus,
  AvventVurderingArsak,
  OppfyltVurderingArsak,
  UnntakVurderingArsak,
} from "../../src/data/aktivitetskrav/aktivitetskravTypes";
import { generateUUID } from "../../src/utils/uuidUtils";
import { VEILEDER_DEFAULT } from "../common/mockConstants";
import { daysFromToday } from "../../test/testUtils";
import { DocumentComponentType } from "../../src/data/documentcomponent/documentComponentTypes";
import {
  Brevmal,
  getForhandsvarselTexts,
} from "../../src/data/aktivitetskrav/forhandsvarselTexts";

const aktivitetskravNy: AktivitetskravDTO = {
  uuid: generateUUID(),
  createdAt: daysFromToday(-7),
  status: AktivitetskravStatus.NY,
  inFinalState: false,
  stoppunktAt: daysFromToday(42),
  vurderinger: [],
};

const aktivitetskravUnntak: AktivitetskravDTO = {
  uuid: generateUUID(),
  createdAt: daysFromToday(-700),
  status: AktivitetskravStatus.UNNTAK,
  inFinalState: true,
  stoppunktAt: daysFromToday(-400),
  vurderinger: [
    {
      uuid: generateUUID(),
      createdAt: daysFromToday(-700),
      createdBy: VEILEDER_DEFAULT.ident,
      status: AktivitetskravStatus.UNNTAK,
      beskrivelse:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim  veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      arsaker: [UnntakVurderingArsak.MEDISINSKE_GRUNNER],
      frist: undefined,
      varsel: undefined,
    },
  ],
};

const aktivitetskravOppfylt: AktivitetskravDTO = {
  uuid: generateUUID(),
  createdAt: daysFromToday(-400),
  status: AktivitetskravStatus.OPPFYLT,
  inFinalState: true,
  stoppunktAt: daysFromToday(-400),
  vurderinger: [
    {
      uuid: generateUUID(),
      createdAt: daysFromToday(-250),
      createdBy: VEILEDER_DEFAULT.ident,
      status: AktivitetskravStatus.OPPFYLT,
      beskrivelse:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim  veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      arsaker: [OppfyltVurderingArsak.FRISKMELDT],
      frist: undefined,
      varsel: undefined,
    },
    {
      uuid: generateUUID(),
      createdAt: daysFromToday(-400),
      createdBy: VEILEDER_DEFAULT.ident,
      status: AktivitetskravStatus.AVVENT,
      beskrivelse: "Avventer info",
      arsaker: [
        AvventVurderingArsak.OPPFOLGINGSPLAN_ARBEIDSGIVER,
        AvventVurderingArsak.INFORMASJON_BEHANDLER,
      ],
      frist: undefined,
      varsel: undefined,
    },
  ],
};

const aktivitetskravAutomatiskOppfylt: AktivitetskravDTO = {
  uuid: generateUUID(),
  createdAt: daysFromToday(-350),
  status: AktivitetskravStatus.AUTOMATISK_OPPFYLT,
  inFinalState: true,
  stoppunktAt: daysFromToday(-400),
  vurderinger: [],
};

const getForhandsvarselDocument = (
  begrunnelse: string | undefined,
  frist: Date
) => {
  const sendForhandsvarselTexts = getForhandsvarselTexts({
    frist,
    mal: Brevmal.MED_ARBEIDSGIVER,
  });
  const documentComponents = [
    {
      type: DocumentComponentType.HEADER_H1,
      texts: [sendForhandsvarselTexts.varselInfo.header],
    },
    {
      type: DocumentComponentType.PARAGRAPH,
      texts: [sendForhandsvarselTexts.varselInfo.intro],
    },
    {
      type: DocumentComponentType.PARAGRAPH,
      texts: [sendForhandsvarselTexts.varselInfo.stans],
    },
  ];

  if (begrunnelse) {
    documentComponents.push({
      type: DocumentComponentType.PARAGRAPH,
      texts: [begrunnelse],
    });
  }

  documentComponents.push(
    {
      type: DocumentComponentType.HEADER_H3,
      texts: [sendForhandsvarselTexts.unngaStansInfo.header],
    },
    {
      type: DocumentComponentType.BULLET_POINTS,
      texts: [
        sendForhandsvarselTexts.unngaStansInfo.tiltak1,
        sendForhandsvarselTexts.unngaStansInfo.tiltak2,
        sendForhandsvarselTexts.unngaStansInfo.tiltak3,
      ],
    },
    {
      type: DocumentComponentType.HEADER_H3,
      texts: [sendForhandsvarselTexts.giOssTilbakemelding.header],
    },
    {
      type: DocumentComponentType.PARAGRAPH,
      texts: [
        sendForhandsvarselTexts.giOssTilbakemelding.tilbakemeldingWithFristDate,
      ],
    },
    {
      type: DocumentComponentType.PARAGRAPH,
      texts: [sendForhandsvarselTexts.giOssTilbakemelding.kontaktOss],
    },
    {
      type: DocumentComponentType.HEADER_H3,
      texts: [sendForhandsvarselTexts.lovhjemmel.header],
    },
    {
      type: DocumentComponentType.PARAGRAPH,
      texts: [sendForhandsvarselTexts.lovhjemmel.aktivitetsplikten],
    },
    {
      type: DocumentComponentType.PARAGRAPH,
      texts: [sendForhandsvarselTexts.lovhjemmel.pliktInfo],
    },
    {
      type: DocumentComponentType.PARAGRAPH,
      texts: ["Med vennlig hilsen", VEILEDER_DEFAULT.fulltNavn(), "NAV"],
    }
  );

  return documentComponents;
};

export const varselUuid = generateUUID();
const begrunnelse = "En begrunnelse for hvorfor det er sendt forhåndsvarsel";

const aktivitetskravForhandsvarsel: AktivitetskravDTO = {
  uuid: generateUUID(),
  createdAt: daysFromToday(-11),
  status: AktivitetskravStatus.FORHANDSVARSEL,
  inFinalState: false,
  stoppunktAt: daysFromToday(40),
  vurderinger: [
    {
      uuid: generateUUID(),
      createdAt: daysFromToday(-2),
      createdBy: VEILEDER_DEFAULT.ident,
      status: AktivitetskravStatus.FORHANDSVARSEL,
      beskrivelse: begrunnelse,
      arsaker: [],
      frist: undefined,
      varsel: {
        uuid: varselUuid,
        createdAt: daysFromToday(-2),
        svarfrist: daysFromToday(19),
        document: getForhandsvarselDocument(begrunnelse, daysFromToday(1)),
      },
    },
  ],
};

export const aktivitetskravMock = [
  aktivitetskravNy,
  aktivitetskravAutomatiskOppfylt,
  aktivitetskravOppfylt,
  aktivitetskravUnntak,
  aktivitetskravForhandsvarsel,
];
