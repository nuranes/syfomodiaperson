import {
  avlystDialogmote,
  ferdigstiltDialogmote,
  innkaltDialogmote,
  innkaltDialogmoteMedBehandler,
} from "../../mock/isdialogmote/dialogmoterMock";
import {
  ISDIALOGMOTE_ROOT,
  ISDIALOGMOTEKANDIDAT_ROOT,
  ISOPPFOLGINGSTILFELLE_ROOT,
  UNLEASH_ROOT,
} from "../../src/apiConstants";
import { oppfolgingstilfellePersonMock } from "../../mock/isoppfolgingstilfelle/oppfolgingstilfellePersonMock";
import { dialogmoteunntakMock } from "../../mock/isdialogmotekandidat/dialogmoteunntakMock";
import { dialogmotekandidatMock } from "../../mock/isdialogmotekandidat/dialogmotekandidatMock";
import { unleashMock } from "../../mock/unleash/unleashMock";

export enum MoteState {
  INNKALT_DIALOGMOTE,
  INNKALT_DIALOGMOTE_MED_BEHANDLER,
  INGEN_MOTER,
  AVLYST_OG_FERDIG_MOTE,
}

interface TestMoter {
  moter: object;
  dialogmoter: object;
}

const getMoter = (state: MoteState): TestMoter => {
  switch (state) {
    case MoteState.INNKALT_DIALOGMOTE: {
      return {
        moter: [],
        dialogmoter: [innkaltDialogmote],
      };
    }
    case MoteState.INNKALT_DIALOGMOTE_MED_BEHANDLER: {
      return {
        moter: [],
        dialogmoter: [innkaltDialogmoteMedBehandler],
      };
    }
    case MoteState.INGEN_MOTER: {
      return {
        moter: [],
        dialogmoter: [],
      };
    }
    case MoteState.AVLYST_OG_FERDIG_MOTE: {
      return {
        moter: [],
        dialogmoter: [avlystDialogmote, ferdigstiltDialogmote],
      };
    }
  }
};

Cypress.Commands.add("stubEndepunkter", (state: MoteState) => {
  const moter = getMoter(state);
  cy.intercept(
    {
      method: "GET",
      url: `${ISDIALOGMOTE_ROOT}/dialogmote/personident`,
    },
    moter.dialogmoter
  );
  cy.intercept(
    {
      method: "GET",
      url: `${ISOPPFOLGINGSTILFELLE_ROOT}/oppfolgingstilfelle/personident`,
    },
    oppfolgingstilfellePersonMock
  );
  cy.intercept(
    {
      method: "GET",
      url: `${ISDIALOGMOTEKANDIDAT_ROOT}/kandidat/personident`,
    },
    dialogmotekandidatMock
  );
  cy.intercept(
    {
      method: "GET",
      url: `${ISDIALOGMOTEKANDIDAT_ROOT}/unntak/personident`,
    },
    dialogmoteunntakMock
  );
  cy.intercept(
    {
      method: "POST",
      url: `${UNLEASH_ROOT}/toggles`,
    },
    unleashMock
  );
});
