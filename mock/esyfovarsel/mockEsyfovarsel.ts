import express = require("express");
import { ESYFOVARSEL_ROOT } from "../../src/apiConstants";
import { maksdatoMock } from "../syfoperson/persondataMock";

export const mockEsyfovarsel = (server: any) => {
  server.get(
    `${ESYFOVARSEL_ROOT}/sykepenger/maxdate`,
    (req: express.Request, res: express.Response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(maksdatoMock));
    }
  );
};
