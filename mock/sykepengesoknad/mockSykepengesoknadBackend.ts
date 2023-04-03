import express = require("express");
import { soknaderMock } from "./soknaderMock";
import { SYKEPENGESOKNAD_BACKEND_ROOT } from "../../src/apiConstants";

import Auth = require("../../server/auth");

export const mockSykepengesoknadBackend = (server: any) => {
  server.get(
    `${SYKEPENGESOKNAD_BACKEND_ROOT}/veileder/soknader`,
    Auth.ensureAuthenticated(),
    (req: express.Request, res: express.Response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(soknaderMock));
    }
  );
};
