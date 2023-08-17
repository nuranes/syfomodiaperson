import {
  behandlerDoktorLegesen,
  behandlerLegoLasLegesen,
  behandlerRefDoktorLegesen,
  behandlerRefLegoLasLegesen,
} from "../isdialogmelding/behandlereDialogmeldingMock";
import { DocumentComponentType } from "../../src/data/documentcomponent/documentComponentTypes";
import {
  ARBEIDSTAKER_DEFAULT,
  ARBEIDSTAKER_DEFAULT_FULL_NAME,
  VEILEDER_DEFAULT,
  VEILEDER_IDENT_DEFAULT,
} from "../common/mockConstants";
import {
  paminnelseTexts,
  tilleggsOpplysningerPasientTexts,
} from "../../src/data/behandlerdialog/behandlerMeldingTexts";
import {
  MeldingStatusType,
  MeldingType,
} from "../../src/data/behandlerdialog/behandlerdialogTypes";

const defaultMeldingTekst = "Dette er en melding";
const meldingtilBehandlerDocument = [
  {
    texts: [tilleggsOpplysningerPasientTexts.header],
    type: DocumentComponentType.HEADER_H1,
  },
  {
    texts: [
      `Gjelder pasient: ${ARBEIDSTAKER_DEFAULT_FULL_NAME}, ${ARBEIDSTAKER_DEFAULT.personIdent}.`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [tilleggsOpplysningerPasientTexts.intro],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [defaultMeldingTekst],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [tilleggsOpplysningerPasientTexts.takst],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    title: tilleggsOpplysningerPasientTexts.lovhjemmel.title,
    texts: [tilleggsOpplysningerPasientTexts.lovhjemmel.text],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      tilleggsOpplysningerPasientTexts.klage1,
      tilleggsOpplysningerPasientTexts.klage2,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: ["Vennlig hilsen", VEILEDER_DEFAULT.navn, "NAV"],
    type: DocumentComponentType.PARAGRAPH,
  },
];
const paminnelseDocument = [
  {
    texts: [paminnelseTexts.header],
    type: DocumentComponentType.HEADER_H1,
  },
  {
    texts: [
      `Gjelder ${ARBEIDSTAKER_DEFAULT_FULL_NAME}, f.nr. ${ARBEIDSTAKER_DEFAULT.personIdent}.`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      `${paminnelseTexts.intro.part1} 01.01.2023 ${paminnelseTexts.intro.part2}`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [paminnelseTexts.text1],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [paminnelseTexts.text2],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: ["Vennlig hilsen", VEILEDER_DEFAULT.navn, "NAV"],
    type: DocumentComponentType.PARAGRAPH,
  },
];

const defaultStatus = {
  type: MeldingStatusType.OK,
  tekst: null,
};

export const defaultMelding = {
  uuid: "5f1e2629-062b-443d-ac1f-3b08e9574cd5",
  behandlerRef: behandlerRefDoktorLegesen,
  behandlerNavn: null,
  tekst: defaultMeldingTekst,
  tidspunkt: "2023-01-01T12:00:00.000+01:00",
  innkommende: false,
  type: MeldingType.FORESPORSEL_PASIENT_TILLEGGSOPPLYSNINGER,
  document: meldingtilBehandlerDocument,
  antallVedlegg: 0,
  status: defaultStatus,
  veilederIdent: VEILEDER_IDENT_DEFAULT,
};

export const defaultMeldingLegeerklaring = {
  uuid: "5f1e2629-062b-443d-ad2f-3b08e9574cd5",
  behandlerRef: behandlerRefDoktorLegesen,
  behandlerNavn: null,
  tekst: defaultMeldingTekst,
  tidspunkt: "2023-01-01T12:00:00.000+01:00",
  innkommende: false,
  type: MeldingType.FORESPORSEL_PASIENT_LEGEERKLARING,
  document: meldingtilBehandlerDocument,
  antallVedlegg: 0,
  status: defaultStatus,
  veilederIdent: VEILEDER_IDENT_DEFAULT,
};

export const paminnelseMelding = {
  ...defaultMelding,
  type: MeldingType.FORESPORSEL_PASIENT_PAMINNELSE,
  tekst: "",
  document: paminnelseDocument,
  tidspunkt: "2023-01-06T12:00:00.000+01:00",
  uuid: "5f1e2639-032c-443d-ac1f-3b18e1534cd5",
};

export const defaultMeldingInnkommende = {
  ...defaultMelding,
  uuid: "1f1e2639-061b-243d-ac1f-3b08e9574cd5",
  behandlerNavn: `${behandlerDoktorLegesen.fornavn} ${behandlerDoktorLegesen.etternavn}`,
  innkommende: true,
  tidspunkt: "2023-01-03T12:00:00.000+01:00",
  antallVedlegg: 1,
  document: [],
  veilederIdent: null,
};

export const defaultMeldingInnkommendeLegeerklaring = {
  ...defaultMeldingLegeerklaring,
  uuid: "1f1e2639-061b-245e-ac1f-3b08e9574cd5",
  behandlerNavn: `${behandlerDoktorLegesen.fornavn} ${behandlerDoktorLegesen.etternavn}`,
  innkommende: true,
  tidspunkt: "2023-01-03T12:00:00.000+01:00",
  antallVedlegg: 1,
  document: [],
  veilederIdent: null,
};

const ubesvartMelding = {
  ...defaultMelding,
  uuid: "5f1e2639-032c-443d-ac1f-3b08e9574cd5",
};

const longMelding =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nec tincidunt sapien.\nAliquam a velit nisl. Integer feugiat est et suscipit cursus. Morbi iaculis quam ut malesuada semper.\nIn hac habitasse platea dictumst. Nam scelerisque neque at augue dictum pulvinar. Sed sed posuere mi.\n\nDuis ac quam at metus luctus hendrerit ac ut nulla.\nUt eu laoreet arcu. Ut eget lacus sed nisi vestibulum volutpat a sit amet tellus.";

const meldinger = [
  defaultMelding,
  {
    uuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd5",
    tekst: longMelding,
    behandlerRef: behandlerRefLegoLasLegesen,
    behandlerNavn: `${behandlerLegoLasLegesen.fornavn} ${behandlerLegoLasLegesen.mellomnavn} ${behandlerLegoLasLegesen.etternavn}`,
    innkommende: true,
    type: MeldingType.FORESPORSEL_PASIENT_TILLEGGSOPPLYSNINGER,
    tidspunkt: "2023-01-02T12:00:00.000+01:00",
    antallVedlegg: 5,
    document: [],
    veilederIdent: null,
  },
  defaultMeldingInnkommende,
  {
    ...defaultMelding,
    uuid: "9f1e2639-061b-243d-ac1f-3b08e9574cd5",
    tidspunkt: "2023-01-04T12:00:00.000+01:00",
    status: {
      type: MeldingStatusType.AVVIST,
      tekst: "Mottaker ikke funnet",
    },
  },
  {
    ...defaultMelding,
    uuid: "2f1e2639-061b-243d-ac1f-3b08e9574cd5",
    tidspunkt: "2023-01-05T12:00:00.000+01:00",
    status: {
      ...defaultStatus,
      type: MeldingStatusType.AVVIST,
    },
  },
];

export const behandlerdialogMock = {
  conversations: {
    "conversationRef-123": [ubesvartMelding],
    "conversationRef-456": meldinger.slice(0, 2),
    "conversationRef-789": meldinger,
    "conversationRef-981": [defaultMelding, paminnelseMelding],
  },
};

export const behandlerdialogMockEmpty = {
  conversations: {},
};

function base64ToArrayBuffer(base64: string) {
  const binaryString = Buffer.from(base64, "base64").toString("utf8");
  const bytes = new Uint8Array(binaryString.length);
  return bytes.map((byte, i) => binaryString.charCodeAt(i));
}

const base64Pdf =
  "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";

const vedlegg0 = base64ToArrayBuffer(base64Pdf);

const vedlegg1 = base64ToArrayBuffer(base64Pdf);

export const behandlerdialogVedleggMock = [vedlegg0, vedlegg1];
