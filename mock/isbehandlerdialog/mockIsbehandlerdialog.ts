import express = require("express");
import { ISBEHANDLERDIALOG_ROOT } from "@/apiConstants";
import Auth = require("../../server/auth");
import { NAV_PERSONIDENT_HEADER } from "../util/requestUtil";

export const mockIsbehandlerdialog = (server: any) => {
  server.get(
    `${ISBEHANDLERDIALOG_ROOT}/melding`,
    Auth.ensureAuthenticated(),
    (req: express.Request, res: express.Response) => {
      if (req.headers[NAV_PERSONIDENT_HEADER]?.length === 11) {
        res.send(JSON.stringify({})); // TODO: Lag mock når respons fra API er klar
      } else {
        res.status(400).send("Did not find PersonIdent in headers");
      }
    }
  );
  server.post(
    `${ISBEHANDLERDIALOG_ROOT}/melding`,
    Auth.ensureAuthenticated(),
    (req: express.Request, res: express.Response) => {
      res.sendStatus(200);
    }
  );
};
