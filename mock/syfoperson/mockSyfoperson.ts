import express = require("express");
import { NAV_PERSONIDENT_HEADER } from "../util/requestUtil";
import { personAdresseMock } from "./personAdresseMock";
import { SYFOPERSON_ROOT } from "../../src/apiConstants";
import { brukerinfoMock } from "./persondataMock";

const isEgenAnsatt = true;

export const mockSyfoperson = (server: any) => {
  server.get(
    `${SYFOPERSON_ROOT}/person/diskresjonskode`,
    (req: express.Request, res: express.Response) => {
      if (req.headers[NAV_PERSONIDENT_HEADER]?.length === 11) {
        res.setHeader("Content-Type", "application/json");
        res.send("");
      } else {
        res.status(400).send("Did not find PersonIdent in headers");
      }
    }
  );

  server.get(
    `${SYFOPERSON_ROOT}/person/egenansatt`,
    (req: express.Request, res: express.Response) => {
      if (req.headers[NAV_PERSONIDENT_HEADER]?.length === 11) {
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(isEgenAnsatt));
      } else {
        res.status(400).send("Did not find PersonIdent in headers");
      }
    }
  );

  server.get(
    `${SYFOPERSON_ROOT}/person/adresse`,
    (req: express.Request, res: express.Response) => {
      if (req.headers[NAV_PERSONIDENT_HEADER]?.length === 11) {
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(personAdresseMock));
      } else {
        res.status(400).send("Did not find PersonIdent in headers");
      }
    }
  );

  server.get(
    `${SYFOPERSON_ROOT}/person/brukerinfo`,
    (req: express.Request, res: express.Response) => {
      if (req.headers[NAV_PERSONIDENT_HEADER]?.length === 11) {
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(brukerinfoMock));
      } else {
        res.status(400).send("Did not find PersonIdent in headers");
      }
    }
  );
};
