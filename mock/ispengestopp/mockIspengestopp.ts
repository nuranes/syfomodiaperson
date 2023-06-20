import express = require("express");
import { ISPENGESTOPP_ROOT } from "../../src/apiConstants";
import { createStatusList } from "./pengestoppStatusMock";

export const mockIspengestopp = (server: any) => {
  let STATUSLIST: any;

  server.get(
    `${ISPENGESTOPP_ROOT}/person/status`,
    (req: express.Request, res: express.Response) => {
      res.setHeader("Content-Type", "application/json");
      if (!STATUSLIST) {
        res.sendStatus(204);
      } else {
        res.send(JSON.stringify(STATUSLIST));
      }
    }
  );
  server.post(
    `${ISPENGESTOPP_ROOT}/person/flagg`,
    (req: express.Request, res: express.Response) => {
      const body = req.body;
      STATUSLIST = createStatusList(new Date(), body);

      const stoppAutomatikk =
        body.sykmeldtFnr && body.virksomhetNr && body.enhetNr;
      console.assert(stoppAutomatikk, {
        stoppAutomatikk,
        errorMsg: "invalid stoppAutomatikk object",
      });
      res.sendStatus(201);
      console.log("StoppAutomatikk: 201 CREATED");
    }
  );
};
