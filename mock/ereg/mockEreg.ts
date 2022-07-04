import express = require("express");

import Auth = require("../../server/auth");
import { virksomhetMock } from "./virksomhetMock";

const mockEreg = (server: express.Application) => {
  server.get(
    "/ereg/api/v1/organisasjon/:virksomhetsnummer",
    Auth.ensureAuthenticated(),
    (req: express.Request, res: express.Response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(virksomhetMock(req.params.virksomhetsnummer)));
    }
  );
};

export default mockEreg;
