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
} from "../common/mockConstants";
import { tilleggsOpplysningerPasientTexts } from "../../src/data/behandlerdialog/behandlerMeldingTexts";

const defaultMeldingTekst = "Dette er en melding";
const meldingtilBehandlerDocument = [
  {
    texts: [tilleggsOpplysningerPasientTexts.header],
    type: DocumentComponentType.HEADER_H1,
  },
  {
    texts: [
      `Gjelder pasient: ${ARBEIDSTAKER_DEFAULT_FULL_NAME}, ${ARBEIDSTAKER_DEFAULT.personIdent}`,
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

export const defaultMelding = {
  behandlerRef: behandlerRefDoktorLegesen,
  behandlerNavn: null,
  tekst: defaultMeldingTekst,
  tidspunkt: "2023-01-01T12:00:00.000+01:00",
  innkommende: false,
  document: meldingtilBehandlerDocument,
};

const longMelding =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nec tincidunt sapien. Aliquam a velit nisl. Integer feugiat est et suscipit cursus. Morbi iaculis quam ut malesuada semper. In hac habitasse platea dictumst. Nam scelerisque neque at augue dictum pulvinar. Sed sed posuere mi. Duis ac quam at metus luctus hendrerit ac ut nulla. Ut eu laoreet arcu. Ut eget lacus sed nisi vestibulum volutpat a sit amet tellus.";

const meldinger = [
  defaultMelding,
  {
    tekst: longMelding,
    behandlerRef: behandlerRefLegoLasLegesen,
    behandlerNavn: `${behandlerLegoLasLegesen.fornavn} ${behandlerLegoLasLegesen.mellomnavn} ${behandlerLegoLasLegesen.etternavn}`,
    innkommende: true,
    tidspunkt: "2023-01-02T12:00:00.000+01:00",
    document: [],
  },
  {
    ...defaultMelding,
    behandlerNavn: `${behandlerDoktorLegesen.fornavn} ${behandlerDoktorLegesen.etternavn}`,
    innkommende: true,
    tidspunkt: "2023-01-03T12:00:00.000+01:00",
    document: [],
  },
];

export const behandlerdialogMock = {
  conversations: {
    "conversationRef-123": meldinger.slice(0, 1),
    "conversationRef-456": meldinger.slice(0, 2),
    "conversationRef-789": meldinger,
  },
};

export const behandlerdialogMockEmpty = {
  conversations: {},
};
