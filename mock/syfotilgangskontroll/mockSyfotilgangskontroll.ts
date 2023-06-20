import express = require("express");
import { tilgangBrukerMock } from "./tilgangtilbrukerMock";
import { SYFOTILGANGSKONTROLL_ROOT } from "../../src/apiConstants";
import { NAV_PERSONIDENT_HEADER } from "../util/requestUtil";

export const mockSyfotilgangskontroll = (server: any) => {
  server.get(
    `${SYFOTILGANGSKONTROLL_ROOT}/tilgang/navident/person`,
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
