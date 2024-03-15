import express = require("express");
import { veilederMock } from "./veilederMock";
import { SYFOVEILEDER_ROOT } from "../../src/apiConstants";

export const mockSyfoveileder = (server: any) => {
  server.get(
    `${SYFOVEILEDER_ROOT}/veiledere/self`,
    (req: express.Request, res: express.Response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(veilederMock));
    }
  );

  server.get(
    `${SYFOVEILEDER_ROOT}/veiledere/:ident`,
    (req: express.Request, res: express.Response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(veilederMock));
    }
  );
};
