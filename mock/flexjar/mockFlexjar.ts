import { FLEXJAR_ROOT } from "../../src/apiConstants";
import express from "express";

export const mockFlexjar = (server: any) => {
  server.post(
    `${FLEXJAR_ROOT}/feedback/azure`,
    (req: express.Request, res: express.Response) => {
      res.sendStatus(200);
    }
  );
};
