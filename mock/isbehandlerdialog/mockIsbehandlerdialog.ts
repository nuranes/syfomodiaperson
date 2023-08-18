import express = require("express");
import { ISBEHANDLERDIALOG_ROOT } from "../../src/apiConstants";
import { NAV_PERSONIDENT_HEADER } from "../util/requestUtil";
import {
  behandlerdialogMockInclLegeerklaring,
  behandlerdialogVedleggMock,
  defaultMelding,
} from "./behandlerdialogMock";
import { MeldingTilBehandlerDTO } from "@/data/behandlerdialog/behandlerdialogTypes";

let behandlerdialogMockdata = behandlerdialogMockInclLegeerklaring;

export const mockIsbehandlerdialog = (server: any) => {
  server.get(
    `${ISBEHANDLERDIALOG_ROOT}/melding`,
    (req: express.Request, res: express.Response) => {
      if (req.headers[NAV_PERSONIDENT_HEADER]?.length === 11) {
        res.send(JSON.stringify(behandlerdialogMockdata));
      } else {
        res.status(400).send("Did not find PersonIdent in headers");
      }
    }
  );
  server.get(
    `${ISBEHANDLERDIALOG_ROOT}/melding/:uuid/:vedleggNumber/pdf`,
    (req: express.Request, res: express.Response) => {
      res.type("application/pdf");
      const { vedleggNumber } = req.params;
      if (vedleggNumber === "0") {
        res.send(behandlerdialogVedleggMock[0]);
      } else if (vedleggNumber === "1") {
        res.send(behandlerdialogVedleggMock[1]);
      } else {
        res.status(204).send([]);
      }
    }
  );
  server.post(
    `${ISBEHANDLERDIALOG_ROOT}/melding`,
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
  server.post(
    `${ISBEHANDLERDIALOG_ROOT}/melding/:uuid/paminnelse`,
    (req: express.Request, res: express.Response) => {
      res.sendStatus(200);
    }
  );
};
