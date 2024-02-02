import { ISHUSKELAPP_ROOT } from "../../src/apiConstants";
import { NAV_PERSONIDENT_HEADER } from "../util/requestUtil";
import express from "express";
import {
  OppfolgingsoppgaveRequestDTO,
  OppfolgingsoppgaveResponseDTO,
} from "@/data/oppfolgingsoppgave/types";
import { generateUUID } from "../../src/utils/uuidUtils";
import { VEILEDER_IDENT_DEFAULT } from "../common/mockConstants";

let oppfolgingsoppgaveMock: OppfolgingsoppgaveResponseDTO | undefined =
  undefined;
const oppfolgingsoppgaveUuid = generateUUID();
export const mockIshuskelapp = (server: any) => {
  server.get(
    `${ISHUSKELAPP_ROOT}/huskelapp`,
    (req: express.Request, res: express.Response) => {
      if (req.headers[NAV_PERSONIDENT_HEADER]?.length === 11) {
        !!oppfolgingsoppgaveMock
          ? res.send(JSON.stringify(oppfolgingsoppgaveMock))
          : res.sendStatus(204);
      } else {
        res.status(400).send("Did not find PersonIdent in headers");
      }
    }
  );
  server.post(
    `${ISHUSKELAPP_ROOT}/huskelapp`,
    (req: express.Request, res: express.Response) => {
      const body = req.body as OppfolgingsoppgaveRequestDTO;
      oppfolgingsoppgaveMock = {
        uuid: oppfolgingsoppgaveUuid,
        createdBy: VEILEDER_IDENT_DEFAULT,
        updatedAt: new Date(),
        createdAt: new Date(),
        oppfolgingsgrunn: body.oppfolgingsgrunn,
        tekst: body.tekst,
        frist: body.frist,
      };
      res.sendStatus(200);
    }
  );
  server.delete(
    `${ISHUSKELAPP_ROOT}/huskelapp/:huskelappUuid`,
    (req: express.Request, res: express.Response) => {
      oppfolgingsoppgaveMock = undefined;
      res.sendStatus(204);
    }
  );
};
