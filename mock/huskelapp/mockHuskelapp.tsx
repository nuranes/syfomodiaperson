import { ISHUSKELAPP_ROOT } from "../../src/apiConstants";
import { NAV_PERSONIDENT_HEADER } from "../util/requestUtil";
import express from "express";
import {
  HuskelappRequestDTO,
  HuskelappResponseDTO,
} from "../../src/data/huskelapp/huskelappTypes";
import { generateUUID } from "../../src/utils/uuidUtils";
import { VEILEDER_IDENT_DEFAULT } from "../common/mockConstants";

let huskelappMock: HuskelappResponseDTO = {
  uuid: generateUUID(),
  createdBy: VEILEDER_IDENT_DEFAULT,
  tekst: "Dette er en veldig fin tekst",
};

export const mockIshuskelapp = (server: any) => {
  server.get(
    `${ISHUSKELAPP_ROOT}/huskelapp`,
    (req: express.Request, res: express.Response) => {
      if (req.headers[NAV_PERSONIDENT_HEADER]?.length === 11) {
        res.send(JSON.stringify(huskelappMock));
      } else {
        res.status(400).send("Did not find PersonIdent in headers");
      }
    }
  );
  server.post(
    `${ISHUSKELAPP_ROOT}/huskelapp`,
    (req: express.Request, res: express.Response) => {
      const body = req.body as HuskelappRequestDTO;
      huskelappMock = {
        ...huskelappMock,
        tekst: body.tekst,
      };
      res.sendStatus(200);
    }
  );
};
