import express = require("express");
import { ISBEHANDLERDIALOG_ROOT } from "../../src/apiConstants";
import { NAV_PERSONIDENT_HEADER } from "../util/requestUtil";
import {
  behandlerdialogMock,
  behandlerdialogVedleggMock,
  defaultMelding,
} from "./behandlerdialogMock";
import { MeldingTilBehandlerDTO } from "@/data/behandlerdialog/behandlerdialogTypes";

let behandlerdialogMockData = behandlerdialogMock;

const replaceNumberInString = (originalString: string, searchValue: string) => {
  const replaceValue = Math.round(Math.random() * 10).toString();

  return originalString.replace(
    searchValue,
    replaceValue !== searchValue
      ? replaceValue
      : Math.round(Math.random() * 10).toString()
  );
};

export const mockIsbehandlerdialog = (server: any) => {
  server.get(
    `${ISBEHANDLERDIALOG_ROOT}/melding`,
    (req: express.Request, res: express.Response) => {
      if (req.headers[NAV_PERSONIDENT_HEADER]?.length === 11) {
        res.send(JSON.stringify(behandlerdialogMockData));
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
      behandlerdialogMockData = {
        conversations: {
          ...behandlerdialogMockData.conversations,
          [`${body.tekst}`]: [
            {
              ...defaultMelding,
              uuid: replaceNumberInString(defaultMelding.uuid, "5"),
              type: body.type,
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
  server.post(
    `${ISBEHANDLERDIALOG_ROOT}/melding/:uuid/retur`,
    (req: express.Request, res: express.Response) => {
      res.sendStatus(200);
    }
  );
};
