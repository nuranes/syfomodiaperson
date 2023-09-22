import express = require("express");
import { tilgangBrukerMock } from "./tilgangtilbrukerMock";
import { ISTILGANGSKONTROLL_ROOT } from "../../src/apiConstants";
import { NAV_PERSONIDENT_HEADER } from "../util/requestUtil";

export const mockIstilgangskontroll = (server: any) => {
  server.get(
    `${ISTILGANGSKONTROLL_ROOT}/tilgang/navident/person`,
    (req: express.Request, res: express.Response) => {
      if (req.headers[NAV_PERSONIDENT_HEADER]?.length === 11) {
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(tilgangBrukerMock));
      } else {
        res.status(400).send();
      }
    }
  );
};
