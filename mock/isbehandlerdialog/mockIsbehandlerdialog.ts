import express = require("express");
import { ISBEHANDLERDIALOG_ROOT } from "../../src/apiConstants";
import Auth = require("../../server/auth");
import { NAV_PERSONIDENT_HEADER } from "../util/requestUtil";
import { behandlerdialogMock, defaultMelding } from "./behandlerdialogMock";
import { MeldingTilBehandlerDTO } from "@/data/behandlerdialog/behandlerdialogTypes";

let behandlerdialogMockdata = behandlerdialogMock;

export const mockIsbehandlerdialog = (server: any) => {
  server.get(
    `${ISBEHANDLERDIALOG_ROOT}/melding`,
    Auth.ensureAuthenticated(),
    (req: express.Request, res: express.Response) => {
      if (req.headers[NAV_PERSONIDENT_HEADER]?.length === 11) {
        res.send(JSON.stringify(behandlerdialogMockdata));
      } else {
        res.status(400).send("Did not find PersonIdent in headers");
      }
    }
  );
  server.post(
    `${ISBEHANDLERDIALOG_ROOT}/melding`,
    Auth.ensureAuthenticated(),
    (req: express.Request, res: express.Response) => {
      res.sendStatus(200);
      const body = req.body as MeldingTilBehandlerDTO;
      behandlerdialogMockdata = {
        conversations: {
          ...behandlerdialogMockdata.conversations,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          [`${body.tekst}`]: [
            {
              ...defaultMelding,
              tekst: body.tekst,
              tidspunkt: new Date(),
            },
          ],
        },
      };
    }
  );
};
