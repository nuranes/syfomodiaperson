import express = require("express");
import { motebehovMock } from "./motebehovMock";
import { SYFOMOTEBEHOV_ROOT } from "../../src/apiConstants";
import { historikkmotebehovMock } from "./historikkmotebehovMock";
import { VEILEDER_IDENT_DEFAULT } from "../common/mockConstants";

export const mockSyfomotebehov = (server: any) => {
  server.get(
    `${SYFOMOTEBEHOV_ROOT}/motebehov`,
    (req: express.Request, res: express.Response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(motebehovMock));
    }
  );

  server.post(
    `${SYFOMOTEBEHOV_ROOT}/motebehov/:fnr/behandle`,
    (req: express.Request, res: express.Response) => {
      res.sendStatus(200);
    }
  );

  server.get(
    `${SYFOMOTEBEHOV_ROOT}/historikk`,
    (req: express.Request, res: express.Response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(historikkmotebehovMock));
    }
  );

  server.post(
    `${SYFOMOTEBEHOV_ROOT}/motebehov/:fnr/behandle`,
    (req: express.Request, res: express.Response) => {
      const oppdaterteMotebehov = motebehovMock.map((motebehov) => {
        motebehov.behandletTidspunkt = new Date().toDateString();
        motebehov.behandletVeilederIdent = VEILEDER_IDENT_DEFAULT;
      });

      Object.assign(motebehovMock, ...oppdaterteMotebehov);

      res.sendStatus(200);
    }
  );
};
