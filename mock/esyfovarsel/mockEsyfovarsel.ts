import express = require("express");
import Auth = require("../../server/auth");
import { ESYFOVARSEL_ROOT } from "../../src/apiConstants";
import { ARBEIDSTAKER_DEFAULT } from "../common/mockConstants";

const maksdatoMock = {
  maxDate: {
    id: "123",
    fnr: ARBEIDSTAKER_DEFAULT.personIdent,
    forelopig_beregnet_slutt: "2023-12-01",
    utbetalt_tom: "2024-07-01",
    gjenstaende_sykedager: "70",
    opprettet: "2023-01-01T12:00:00.000000",
  },
};

export const mockEsyfovarsel = (server: any) => {
  server.get(
    `${ESYFOVARSEL_ROOT}/sykepenger/maxdate`,
    Auth.ensureAuthenticated(),
    (req: express.Request, res: express.Response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(maksdatoMock));
    }
  );
};
