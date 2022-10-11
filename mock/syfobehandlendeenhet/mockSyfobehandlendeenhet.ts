import express = require("express");
import { NAV_PERSONIDENT_HEADER } from "../util/requestUtil";
import { SYFOBEHANDLENDEENHET_ROOT } from "../../src/apiConstants";
import {
  behandlendeEnhetMock,
  behandlendeEnhetNavUtlandMock,
  personDTOMock,
} from "./behandlendeEnhetMock";

import Auth = require("../../server/auth");
import { BehandlendeEnhet } from "@/data/behandlendeenhet/types/BehandlendeEnhet";

let behandlendeEnhet: BehandlendeEnhet = behandlendeEnhetMock;

export const mockSyfobehandlendeenhet = (server: any) => {
  server.get(
    `${SYFOBEHANDLENDEENHET_ROOT}/personident`,
    Auth.ensureAuthenticated(),
    (req: express.Request, res: express.Response) => {
      if (req.headers[NAV_PERSONIDENT_HEADER]?.length === 11) {
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(behandlendeEnhet));
      } else {
        res.status(400).send("Did not find PersonIdent in headers");
      }
    }
  );
  server.post(
    `${SYFOBEHANDLENDEENHET_ROOT}/person`,
    Auth.ensureAuthenticated(),
    (req: express.Request, res: express.Response) => {
      res.send(JSON.stringify(personDTOMock));
      behandlendeEnhet =
        behandlendeEnhet === behandlendeEnhetNavUtlandMock
          ? behandlendeEnhetMock
          : behandlendeEnhetNavUtlandMock;
    }
  );
};
