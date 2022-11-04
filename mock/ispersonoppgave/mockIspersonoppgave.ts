import express = require("express");
import { NAV_PERSONIDENT_HEADER } from "../util/requestUtil";
import { ISPERSONOPPGAVE_ROOT } from "../../src/apiConstants";

import Auth = require("../../server/auth");
import {
  makePersonOppgaveBehandlet,
  personoppgaverMock,
} from "./personoppgaveMock";

let personOppgaver = personoppgaverMock();

export const mockIspersonoppgave = (server: any) => {
  server.get(
    `${ISPERSONOPPGAVE_ROOT}/personoppgave/personident`,
    Auth.ensureAuthenticated(),
    (req: express.Request, res: express.Response) => {
      if (req.headers[NAV_PERSONIDENT_HEADER]?.length === 11) {
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(personOppgaver));
      } else {
        res.status(400).send();
      }
    }
  );

  server.post(
    `${ISPERSONOPPGAVE_ROOT}/personoppgave/:uuid/behandle`,
    Auth.ensureAuthenticated(),
    (req: express.Request, res: express.Response) => {
      const { uuid } = req.params;
      const gjeldendeOppgave = personOppgaver.find(
        (oppgave) => oppgave.uuid === uuid
      );
      if (!!gjeldendeOppgave) {
        personOppgaver = [
          makePersonOppgaveBehandlet(gjeldendeOppgave),
          ...personOppgaver.filter((oppgave) => oppgave.uuid !== uuid),
        ];
      }
      res.sendStatus(200);
    }
  );
};
