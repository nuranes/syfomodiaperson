import express = require("express");
import Auth = require("../../server/auth");
import { ESYFOVARSEL_ROOT } from "../../src/apiConstants";

const maksdatoMock = {
  maxDate: "2023-12-01",
};

export const mockEsyfovarsel = (server: any) => {
  server.get(
    `${ESYFOVARSEL_ROOT}/sykepenger/maxdate`,
    Auth.ensureAuthenticated(),
    (req: express.Request, res: express.Response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(maksdatoMock));
    }
  );
};
