import { ISHUSKELAPP_ROOT } from "../../src/apiConstants";
import { NAV_PERSONIDENT_HEADER } from "../util/requestUtil";
import express from "express";
import {
  HuskelappRequestDTO,
  HuskelappResponseDTO,
} from "../../src/data/huskelapp/huskelappTypes";
import { generateUUID } from "../../src/utils/uuidUtils";
import { VEILEDER_IDENT_DEFAULT } from "../common/mockConstants";

let huskelappMock: HuskelappResponseDTO | undefined = undefined;
const huskelappUuid = generateUUID();
export const mockIshuskelapp = (server: any) => {
  server.get(
    `${ISHUSKELAPP_ROOT}/huskelapp`,
    (req: express.Request, res: express.Response) => {
      if (req.headers[NAV_PERSONIDENT_HEADER]?.length === 11) {
        !!huskelappMock
          ? res.send(JSON.stringify(huskelappMock))
          : res.sendStatus(204);
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
        uuid: huskelappUuid,
        createdBy: VEILEDER_IDENT_DEFAULT,
        oppfolgingsgrunn: body.oppfolgingsgrunn,
      };
      res.sendStatus(200);
    }
  );
  server.delete(
    `${ISHUSKELAPP_ROOT}/huskelapp/:huskelappUuid`,
    (req: express.Request, res: express.Response) => {
      huskelappMock = undefined;
      res.sendStatus(204);
    }
  );
};
