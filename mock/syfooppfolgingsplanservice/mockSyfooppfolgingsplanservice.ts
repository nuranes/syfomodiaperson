import express = require("express");
import { oppfolgingsplanMock } from "./oppfolgingsplanMock";
import { historikkoppfolgingsplanMock } from "./historikkoppfolgingsplanMock";
import {
  SYFOOPPFOLGINGSPLANSERVICE_V2_ROOT,
  SYFOOPPFOLGINGSPLANSERVICE_V3_ROOT,
} from "../../src/apiConstants";
import { dokumentinfoMock } from "./dokumentinfoMock";

export const mockSyfooppfolgingsplanservice = (server: any) => {
  server.get(
    `${SYFOOPPFOLGINGSPLANSERVICE_V3_ROOT}/oppfolgingsplan/`,
    (req: express.Request, res: express.Response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(oppfolgingsplanMock));
    }
  );

  server.get(
    `${SYFOOPPFOLGINGSPLANSERVICE_V3_ROOT}/oppfolgingsplan/historikk`,
    (req: express.Request, res: express.Response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(historikkoppfolgingsplanMock));
    }
  );

  server.get(
    `${SYFOOPPFOLGINGSPLANSERVICE_V2_ROOT}/dokument/:id/dokumentinfo`,
    (req: express.Request, res: express.Response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(dokumentinfoMock));
    }
  );
};
