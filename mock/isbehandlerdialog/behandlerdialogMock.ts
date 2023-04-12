import {
  behandlerRefDoktorLegesen,
  behandlerRefLegoLasLegesen,
} from "../isdialogmelding/behandlereDialogmeldingMock";

export const defaultMelding = {
  behandlerRef: behandlerRefDoktorLegesen,
  tekst: "Dette er en melding",
  tidspunkt: "2023-01-01T12:00:00.000+01:00",
  innkommende: false,
};

const longMelding =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nec tincidunt sapien. Aliquam a velit nisl. Integer feugiat est et suscipit cursus. Morbi iaculis quam ut malesuada semper. In hac habitasse platea dictumst. Nam scelerisque neque at augue dictum pulvinar. Sed sed posuere mi. Duis ac quam at metus luctus hendrerit ac ut nulla. Ut eu laoreet arcu. Ut eget lacus sed nisi vestibulum volutpat a sit amet tellus.";

const meldinger = [
  defaultMelding,
  {
    tekst: longMelding,
    behandlerRef: behandlerRefLegoLasLegesen,
    innkommende: true,
    tidspunkt: "2023-01-02T12:00:00.000+01:00",
  },
  {
    ...defaultMelding,
    innkommende: true,
    tidspunkt: "2023-01-03T12:00:00.000+01:00",
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
