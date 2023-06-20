import express = require("express");
import { sykmeldingerMock } from "./sykmeldingerMock";
import { SYFOSMREGISTER_ROOT } from "../../src/apiConstants";

export const mockSyfosmregister = (server: any) => {
  server.get(
    `${SYFOSMREGISTER_ROOT}/internal/sykmeldinger`,
    (req: express.Request, res: express.Response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(sykmeldingerMock));
    }
  );
};
