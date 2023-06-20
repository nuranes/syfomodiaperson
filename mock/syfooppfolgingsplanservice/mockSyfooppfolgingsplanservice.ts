import express = require("express");
import { oppfolgingsplanMock } from "./oppfolgingsplanMock";
import { historikkoppfolgingsplanMock } from "./historikkoppfolgingsplanMock";
import { oppfolgingsplanerLPSMock } from "./oppfolgingsplanLPSMock";
import { NAV_PERSONIDENT_HEADER } from "../util/requestUtil";
import { SYFOOPPFOLGINGSPLANSERVICE_ROOT } from "../../src/apiConstants";
import { dokumentinfoMock } from "./dokumentinfoMock";

const path = require("path");

export const mockSyfooppfolgingsplanservice = (server: any) => {
  server.get(
    `${SYFOOPPFOLGINGSPLANSERVICE_ROOT}/oppfolgingsplan/lps`,
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
    `${SYFOOPPFOLGINGSPLANSERVICE_ROOT}/dokument/lps/:uuid`,
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

  server.get(
    `${SYFOOPPFOLGINGSPLANSERVICE_ROOT}/oppfolgingsplan/:fnr`,
    (req: express.Request, res: express.Response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(oppfolgingsplanMock));
    }
  );

  server.get(
    `${SYFOOPPFOLGINGSPLANSERVICE_ROOT}/oppfolgingsplan/:fnr/historikk`,
    (req: express.Request, res: express.Response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(historikkoppfolgingsplanMock));
    }
  );

  server.get(
    `${SYFOOPPFOLGINGSPLANSERVICE_ROOT}/dokument/:id/dokumentinfo`,
    (req: express.Request, res: express.Response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(dokumentinfoMock));
    }
  );
};
