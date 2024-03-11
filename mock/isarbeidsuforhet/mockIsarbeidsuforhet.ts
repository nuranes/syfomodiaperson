import express = require("express");
import { ISARBEIDSUFORHET_ROOT } from "../../src/apiConstants";
import { NAV_PERSONIDENT_HEADER } from "../util/requestUtil";
import { mockArbeidsuforhetvurdering } from "./arbeidsuforhetMock";
import {
  ForhandsvarselRequestDTO,
  VurderingType,
} from "../../src/data/arbeidsuforhet/arbeidsuforhetTypes";

export const mockIsarbeidsuforhet = (server: any) => {
  server.get(
    `${ISARBEIDSUFORHET_ROOT}/arbeidsuforhet/vurdering`,
    (req: express.Request, res: express.Response) => {
      if (req.headers[NAV_PERSONIDENT_HEADER]?.length === 11) {
        res.send(JSON.stringify(mockArbeidsuforhetvurdering));
      } else {
        res.status(400).send("Did not find PersonIdent in headers");
      }
    }
  );

  server.post(
    `${ISARBEIDSUFORHET_ROOT}/arbeidsuforhet/forhandsvarsel`,
    (req: express.Request, res: express.Response) => {
      const body: ForhandsvarselRequestDTO = req.body;
      const sentForhandsvarsel = {
        ...mockArbeidsuforhetvurdering[0],
        type: VurderingType.FORHANDSVARSEL,
        begrunnelse: body.begrunnelse,
        document: body.document,
      };
      res.status(201).send(JSON.stringify(sentForhandsvarsel));
    }
  );
};
