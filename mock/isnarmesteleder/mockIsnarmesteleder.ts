import express = require("express");
import { ledereMock } from "./ledereMock";
import { ISNARMESTELEDER_ROOT } from "../../src/apiConstants";

export const mockIsnarmesteleder = (server: any) => {
  server.get(
    `${ISNARMESTELEDER_ROOT}/narmestelederrelasjon/personident`,
    (req: express.Request, res: express.Response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(ledereMock));
    }
  );
};
