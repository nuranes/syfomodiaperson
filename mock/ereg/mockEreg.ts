import express = require("express");

import { virksomhetMock } from "./virksomhetMock";

const mockEreg = (server: express.Application) => {
  server.get(
    "/ereg/api/v1/organisasjon/:virksomhetsnummer",
    (req: express.Request, res: express.Response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(virksomhetMock(req.params.virksomhetsnummer)));
    }
  );
};

export default mockEreg;
