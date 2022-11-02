import express = require("express");
import { ISDIALOGMOTEKANDIDAT_ROOT } from "../../src/apiConstants";
import { NAV_PERSONIDENT_HEADER } from "../util/requestUtil";
import { dialogmotekandidatMock } from "./dialogmotekandidatMock";
import { dialogmoteunntakMock, hackatonrespons } from "./dialogmoteunntakMock";

import Auth = require("../../server/auth");

export const mockIsdialogmotekandidat = (server: any) => {
  server.get(
    `${ISDIALOGMOTEKANDIDAT_ROOT}/kandidat/personident`,
    Auth.ensureAuthenticated(),
    (req: express.Request, res: express.Response) => {
      if (req.headers[NAV_PERSONIDENT_HEADER]?.length === 11) {
        res.send(JSON.stringify(dialogmotekandidatMock));
      } else {
        res.status(400).send("Did not find PersonIdent in headers");
      }
    }
  );
  server.get(
    `${ISDIALOGMOTEKANDIDAT_ROOT}/unntak/personident`,
    Auth.ensureAuthenticated(),
    (req: express.Request, res: express.Response) => {
      if (req.headers[NAV_PERSONIDENT_HEADER]?.length === 11) {
        res.send(JSON.stringify(dialogmoteunntakMock));
      } else {
        res.status(400).send("Did not find PersonIdent in headers");
      }
    }
  );
  server.post(
    `${ISDIALOGMOTEKANDIDAT_ROOT}/unntak/personident`,
    Auth.ensureAuthenticated(),
    (req: express.Request, res: express.Response) => {
      res.sendStatus(200);
    }
  );
  server.get(
    `${ISDIALOGMOTEKANDIDAT_ROOT}/unntak/hackaton`,
    Auth.ensureAuthenticated(),
    (req: express.Request, res: express.Response) => {
      res.send(JSON.stringify(hackatonrespons));
    }
  );
};
