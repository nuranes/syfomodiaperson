import express = require("express");
import { ISFRISKTILARBEID_ROOT } from "@/apiConstants";

export const mockIsfrisktilarbeid = (server: any) => {
  server.post(
    `${ISFRISKTILARBEID_ROOT}/frisktilarbeid/vedtak`,
    (req: express.Request, res: express.Response) => {
      res.sendStatus(201);
    }
  );
};
