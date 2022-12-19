import express = require("express");
import { veilederMock } from "./veilederMock";
import { SYFOVEILEDER_ROOT } from "../../src/apiConstants";

import Auth = require("../../server/auth");

export const mockSyfoveileder = (server: any) => {
  server.get(
    `${SYFOVEILEDER_ROOT}/veileder/self`,
    Auth.ensureAuthenticated(),
    (req: express.Request, res: express.Response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(veilederMock));
    }
  );

  server.get(
    `${SYFOVEILEDER_ROOT}/veileder/:ident`,
    Auth.ensureAuthenticated(),
    (req: express.Request, res: express.Response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(veilederMock));
    }
  );
};
