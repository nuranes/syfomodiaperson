import express = require("express");
import { NAV_PERSONIDENT_HEADER } from "../util/requestUtil";
import { dialogmoterMock } from "./dialogmoterMock";
import { ISDIALOGMOTE_ROOT } from "../../src/apiConstants";

export const mockIsdialogmote = (server: any) => {
  server.post(
    `${ISDIALOGMOTE_ROOT}/dialogmote/personident`,
    (req: express.Request, res: express.Response) => {
      if (req.headers[NAV_PERSONIDENT_HEADER]?.length === 11) {
        res.sendStatus(200);
      } else {
        res.status(400).send("Did not find PersonIdent in headers");
      }
    }
  );
  server.get(
    `${ISDIALOGMOTE_ROOT}/dialogmote/personident`,
    (req: express.Request, res: express.Response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(dialogmoterMock));
    }
  );

  server.post(
    `${ISDIALOGMOTE_ROOT}/dialogmote/:moteuuid/avlys`,
    (req: express.Request, res: express.Response) => {
      const { moteuuid } = req.params;
      const dialogmoteToUpdate = dialogmoterMock.find(
        (dialogmote) => dialogmote.uuid === moteuuid
      );
      dialogmoteToUpdate!!.status = "AVLYST";
      res.sendStatus(200);
    }
  );

  server.post(
    `${ISDIALOGMOTE_ROOT}/dialogmote/:moteuuid/tidsted`,
    (req: express.Request, res: express.Response) => {
      res.sendStatus(200);
    }
  );

  server.post(
    `${ISDIALOGMOTE_ROOT}/dialogmote/:moteuuid/ferdigstill`,
    (req: express.Request, res: express.Response) => {
      const { moteuuid } = req.params;
      const dialogmoteToUpdate = dialogmoterMock.find(
        (dialogmote) => dialogmote.uuid === moteuuid
      );
      dialogmoteToUpdate!!.status = "FERDIGSTILT";
      res.sendStatus(200);
    }
  );

  server.post(
    `${ISDIALOGMOTE_ROOT}/dialogmote/:moteuuid/endreferdigstilt`,
    (req: express.Request, res: express.Response) => {
      res.sendStatus(200);
    }
  );
};
