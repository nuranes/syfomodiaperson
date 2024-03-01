import express = require("express");
import { ISARBEIDSUFORHET_ROOT } from "../../src/apiConstants";
import { ForhandsvarselRequestDTO } from "@/data/arbeidsuforhet/arbeidsuforhetTypes";

export const mockIsarbeidsuforhet = (server: any) => {
  server.post(
    `${ISARBEIDSUFORHET_ROOT}/arbeidsuforhet/forhandsvarsel`,
    (req: express.Request, res: express.Response) => {
      const body: ForhandsvarselRequestDTO = req.body;
      const forhandsvarsel = {
        begrunnelse: body.begrunnelse,
        document: body.document,
      };
      res.sendStatus(201);
    }
  );
};
