import express = require("express");
import { ISARBEIDSUFORHET_ROOT } from "../../src/apiConstants";
import { NAV_PERSONIDENT_HEADER } from "../util/requestUtil";
import { mockArbeidsuforhetvurdering } from "./arbeidsuforhetMock";
import {
  VurderingRequestDTO,
  VurderingResponseDTO,
} from "../../src/data/arbeidsuforhet/arbeidsuforhetTypes";
import { generateUUID } from "../../src/utils/uuidUtils";
import {
  ARBEIDSTAKER_DEFAULT,
  VEILEDER_DEFAULT,
} from "../common/mockConstants";

let arbeidsuforhetVurderinger = mockArbeidsuforhetvurdering;

export const mockIsarbeidsuforhet = (server: any) => {
  server.get(
    `${ISARBEIDSUFORHET_ROOT}/arbeidsuforhet/vurderinger`,
    (req: express.Request, res: express.Response) => {
      if (req.headers[NAV_PERSONIDENT_HEADER]?.length === 11) {
        res.send(JSON.stringify(arbeidsuforhetVurderinger));
      } else {
        res.status(400).send("Did not find PersonIdent in headers");
      }
    }
  );

  server.post(
    `${ISARBEIDSUFORHET_ROOT}/arbeidsuforhet/vurderinger`,
    (req: express.Request, res: express.Response) => {
      const body: VurderingRequestDTO = req.body;
      const personident = req.headers[NAV_PERSONIDENT_HEADER];
      const varsel =
        body.type === "FORHANDSVARSEL"
          ? {
              uuid: generateUUID(),
              createdAt: new Date(),
              svarfrist: new Date(),
            }
          : undefined;
      const sentVurdering: VurderingResponseDTO = {
        uuid: generateUUID(),
        personident:
          personident?.toString() ?? ARBEIDSTAKER_DEFAULT.personIdent,
        createdAt: new Date(),
        veilederident: VEILEDER_DEFAULT.ident,
        type: body.type,
        begrunnelse: body.begrunnelse,
        document: body.document,
        varsel,
      };
      arbeidsuforhetVurderinger = [sentVurdering, ...arbeidsuforhetVurderinger];
      res.status(201).send(JSON.stringify(sentVurdering));
    }
  );
};
