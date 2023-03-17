import express = require("express");
import { ISAKTIVITETSKRAV_ROOT } from "../../src/apiConstants";

import Auth = require("../../server/auth");
import { NAV_PERSONIDENT_HEADER } from "../util/requestUtil";
import { aktivitetskravMock } from "./aktivitetskravMock";

export const mockIsaktivitetskrav = (server: any) => {
  server.get(
    `${ISAKTIVITETSKRAV_ROOT}/aktivitetskrav/personident`,
    Auth.ensureAuthenticated(),
    (req: express.Request, res: express.Response) => {
      if (req.headers[NAV_PERSONIDENT_HEADER]?.length === 11) {
        res.send(JSON.stringify(aktivitetskravMock));
      } else {
        res.status(400).send("Did not find PersonIdent in headers");
      }
    }
  );
  server.post(
    `${ISAKTIVITETSKRAV_ROOT}/aktivitetskrav/:aktivitetskravUuid/vurder`,
    Auth.ensureAuthenticated(),
    (req: express.Request, res: express.Response) => {
      res.sendStatus(200);
    }
  );
};
