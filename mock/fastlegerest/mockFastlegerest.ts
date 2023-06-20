import express = require("express");
import { fastlegerMock } from "./fastlegerMock";
import { FASTLEGEREST_ROOT } from "../../src/apiConstants";

export const mockFastlegerest = (server: any) => {
  server.get(
    `${FASTLEGEREST_ROOT}/fastleger`,
    (req: express.Request, res: express.Response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(fastlegerMock));
    }
  );
};
