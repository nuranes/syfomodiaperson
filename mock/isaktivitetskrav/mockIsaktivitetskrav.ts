import express = require("express");
import { ISAKTIVITETSKRAV_ROOT } from "../../src/apiConstants";
import { NAV_PERSONIDENT_HEADER } from "../util/requestUtil";
import { aktivitetskravMock } from "./aktivitetskravMock";
import {
  AktivitetskravDTO,
  AktivitetskravStatus,
  AktivitetskravVurderingDTO,
  SendForhandsvarselDTO,
} from "../../src/data/aktivitetskrav/aktivitetskravTypes";
import { daysFromToday } from "../../test/testUtils";
import { generateUUID } from "../../src/utils/uuidUtils";
import { VEILEDER_DEFAULT } from "../common/mockConstants";

let mockAktivitetskrav: AktivitetskravDTO[] = aktivitetskravMock;

export const mockIsaktivitetskrav = (server: any) => {
  server.get(
    `${ISAKTIVITETSKRAV_ROOT}/aktivitetskrav/personident`,
    (req: express.Request, res: express.Response) => {
      if (req.headers[NAV_PERSONIDENT_HEADER]?.length === 11) {
        res.send(JSON.stringify(mockAktivitetskrav));
      } else {
        res.status(400).send("Did not find PersonIdent in headers");
      }
    }
  );
  server.post(
    `${ISAKTIVITETSKRAV_ROOT}/aktivitetskrav/:aktivitetskravUuid/vurder`,
    (req: express.Request, res: express.Response) => {
      res.sendStatus(200);
    }
  );
  server.post(
    `${ISAKTIVITETSKRAV_ROOT}/aktivitetskrav/:aktivitetskravUuid/forhandsvarsel`,
    (req: express.Request, res: express.Response) => {
      const body: SendForhandsvarselDTO = req.body;
      const forhandsvarsel = {
        uuid: "123",
        createdAt: new Date(),
        svarfrist: daysFromToday(21),
        document: body.document,
      };
      const newForhandsvarselVurdering: AktivitetskravVurderingDTO = {
        uuid: generateUUID(),
        status: AktivitetskravStatus.FORHANDSVARSEL,
        arsaker: [],
        beskrivelse: body.fritekst,
        createdAt: new Date(),
        createdBy: VEILEDER_DEFAULT.ident,
        frist: daysFromToday(21),
        varsel: forhandsvarsel,
      };
      let firstAktivitetskrav = mockAktivitetskrav[0];
      firstAktivitetskrav = {
        ...firstAktivitetskrav,
        vurderinger: [
          newForhandsvarselVurdering,
          ...firstAktivitetskrav.vurderinger,
        ],
      };
      mockAktivitetskrav = [firstAktivitetskrav, ...mockAktivitetskrav];
      res.sendStatus(201);
    }
  );
};
