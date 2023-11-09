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
import { sendForhandsvarselTexts } from "../../src/data/aktivitetskrav/forhandsvarselTexts";

const aktivitetskravNy = {
  uuid: generateUUID(),
  createdAt: daysFromToday(-7),
  status: AktivitetskravStatus.NY,
  stoppunktAt: daysFromToday(42),
  vurderinger: [],
};

const aktivitetskravUnntak = {
  uuid: generateUUID(),
  createdAt: daysFromToday(-700),
  status: AktivitetskravStatus.UNNTAK,
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
    },
  ],
};

const aktivitetskravOppfylt = {
  uuid: generateUUID(),
  createdAt: daysFromToday(-400),
  status: AktivitetskravStatus.OPPFYLT,
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
    },
  ],
};

const aktivitetskravAvvent = {
  uuid: generateUUID(),
  createdAt: daysFromToday(-20),
  status: AktivitetskravStatus.OPPFYLT,
  stoppunktAt: daysFromToday(20),
  vurderinger: [
    {
      uuid: generateUUID(),
      createdAt: daysFromToday(-10),
      createdBy: VEILEDER_DEFAULT.ident,
      status: AktivitetskravStatus.AVVENT,
      beskrivelse:
        "Dette er tekst som forklarer hvorfor jeg avventer. Lorem ipsum! Jeg sendte epost til arbeidsgiver og ba om oppfølgingsplan. Jeg har også sendt forespørsel til behandler (men jeg skulle ønske jeg kunne sende dialogmeldinger fra modia!)",
      arsaker: [
        AvventVurderingArsak.OPPFOLGINGSPLAN_ARBEIDSGIVER,
        AvventVurderingArsak.INFORMASJON_BEHANDLER,
      ],
    },
  ],
};

const aktivitetskravAutomatiskOppfylt = {
  uuid: generateUUID(),
  createdAt: daysFromToday(-350),
  status: AktivitetskravStatus.AUTOMATISK_OPPFYLT,
  stoppunktAt: daysFromToday(-400),
  vurderinger: [],
};

const getForhandsvarselDocument = (
  begrunnelse: string | undefined,
  fristDato: Date
) => {
  const documentComponents = [
    {
      type: DocumentComponentType.HEADER_H1,
      texts: [sendForhandsvarselTexts.varselInfo.header],
    },
    {
      type: DocumentComponentType.PARAGRAPH,
      texts: [sendForhandsvarselTexts.varselInfo.introWithFristDate(fristDato)],
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
        sendForhandsvarselTexts.giOssTilbakemelding.tilbakemeldingWithFristDate(
          fristDato
        ),
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
      texts: ["Med vennlig hilsen", VEILEDER_DEFAULT.navn, "NAV"],
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
