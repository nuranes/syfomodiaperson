import express = require("express");
import { NAV_PERSONIDENT_HEADER } from "../util/requestUtil";
import { LPS_OPPFOLGINGSPLAN_MOTTAK_V1_ROOT } from "../../src/apiConstants";
import { oppfolgingsplanerLPSMock } from "../syfooppfolgingsplanservice/oppfolgingsplanLPSMock";

const path = require("path");

export const mockLpsOppfolgingsplanerMottak = (server: any) => {
  server.get(
    `${LPS_OPPFOLGINGSPLAN_MOTTAK_V1_ROOT}/oppfolgingsplan/lps`,
    (req: express.Request, res: express.Response) => {
      if (req.headers[NAV_PERSONIDENT_HEADER]?.length === 11) {
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(oppfolgingsplanerLPSMock(new Date())));
      } else {
        res.status(400).send();
      }
    }
  );

  server.get(
    `${LPS_OPPFOLGINGSPLAN_MOTTAK_V1_ROOT}/oppfolgingsplan/lps/:uuid`,
    (req: express.Request, res: express.Response) => {
      const file = path.join(
        __dirname,
        "/oppfolgingsplan/pdf/oppfolgingsplanlps.pdf"
      );
      res.download(file, (err) => {
        if (err) {
          res.status(500).send("Error");
        }
      });
    }
  );
};
