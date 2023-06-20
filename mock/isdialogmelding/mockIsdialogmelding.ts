import express = require("express");
import { ISDIALOGMELDING_ROOT } from "../../src/apiConstants";
import {
  behandlerByBehandlerRefMock,
  behandlereDialogmeldingMock,
  behandlerSokDialogmeldingMock,
} from "./behandlereDialogmeldingMock";

export const mockIsdialogmelding = (server: any) => {
  server.get(
    `${ISDIALOGMELDING_ROOT}/behandler/personident`,
    (req: express.Request, res: express.Response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(behandlereDialogmeldingMock));
    }
  );
  server.get(
    `${ISDIALOGMELDING_ROOT}/behandler/search`,
    (req: express.Request, res: express.Response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(behandlerSokDialogmeldingMock));
    }
  );
  server.get(
    `${ISDIALOGMELDING_ROOT}/behandler/:behandlerRef`,
    (req: express.Request, res: express.Response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(behandlerByBehandlerRefMock));
    }
  );
};
