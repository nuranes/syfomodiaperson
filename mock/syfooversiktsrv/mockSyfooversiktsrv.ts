import { SYFOOVERSIKTSRV_PERSONTILDELING_ROOT } from "../../src/apiConstants";
import { NAV_PERSONIDENT_HEADER } from "../util/requestUtil";
import express from "express";
import {
  ARBEIDSTAKER_DEFAULT,
  ENHET_GRUNERLOKKA,
  VEILEDER_DEFAULT,
} from "../common/mockConstants";

export const mockSyfooversiktsrv = (server: any) => {
  server.get(
    `${SYFOOVERSIKTSRV_PERSONTILDELING_ROOT}/persontildeling/personer/single`,
    (req: express.Request, res: express.Response) => {
      if (req.headers[NAV_PERSONIDENT_HEADER]?.length === 11) {
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(veilederBrukerKnytningMock));
      } else {
        res.status(400).send("Did not find PersonIdent in headers");
      }
    }
  );
};

const veilederBrukerKnytningMock = {
  personident: ARBEIDSTAKER_DEFAULT.personIdent,
  tildeltVeilederident: VEILEDER_DEFAULT.ident,
  tildeltEnhet: ENHET_GRUNERLOKKA.nummer,
};
