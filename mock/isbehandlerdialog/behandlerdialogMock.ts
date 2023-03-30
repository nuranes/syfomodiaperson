export const defaultMelding = {
  behandlerRef: "behandlerRef",
  tekst: "Dette er en melding",
  tidspunkt: "2023-01-01T12:00:00.000+01:00",
  innkommende: false,
};

const meldinger = [
  defaultMelding,
  {
    ...defaultMelding,
    behandlerRef: "behandlerRef2",
    innkommende: true,
    tidspunkt: "2023-01-02T12:00:00.000+01:00",
  },
  {
    ...defaultMelding,
    behandlerRef: "behandlerRef3",
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
