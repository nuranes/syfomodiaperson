import express = require("express");
import { soknaderMock } from "./soknaderMock";
import { SYKEPENGESOKNAD_BACKEND_ROOT } from "../../src/apiConstants";

export const mockSykepengesoknadBackend = (server: any) => {
  server.get(
    `${SYKEPENGESOKNAD_BACKEND_ROOT}/veileder/soknader`,
    (req: express.Request, res: express.Response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(soknaderMock));
    }
  );
};
