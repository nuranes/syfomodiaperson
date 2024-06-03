import express = require("express");
import { NAV_PERSONIDENT_HEADER } from "../util/requestUtil";
import {
  createDialogmote,
  createReferat,
  dialogmoterMock,
} from "./dialogmoterMock";
import { ISDIALOGMOTE_ROOT } from "../../src/apiConstants";
import {
  DialogmoteDTO,
  DialogmoteStatus,
} from "../../src/data/dialogmote/types/dialogmoteTypes";
import dayjs from "dayjs";

let mockedDialogmoter = dialogmoterMock;

export const mockIsdialogmote = (server: any) => {
  server.post(
    `${ISDIALOGMOTE_ROOT}/dialogmote/personident`,
    (req: express.Request, res: express.Response) => {
      if (req.headers[NAV_PERSONIDENT_HEADER]?.length === 11) {
        mockedDialogmoter = [
          ...mockedDialogmoter,
          createDialogmote(
            "0",
            DialogmoteStatus.INNKALT,
            dayjs().add(10, "days").toDate()
          ),
        ];
        res.sendStatus(200);
      } else {
        res.status(400).send("Did not find PersonIdent in headers");
      }
    }
  );
  server.get(
    `${ISDIALOGMOTE_ROOT}/dialogmote/personident`,
    (req: express.Request, res: express.Response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(mockedDialogmoter));
    }
  );

  server.post(
    `${ISDIALOGMOTE_ROOT}/dialogmote/:moteuuid/avlys`,
    (req: express.Request, res: express.Response) => {
      const { moteuuid } = req.params;
      const dialogmoteToUpdate: DialogmoteDTO | undefined =
        mockedDialogmoter.find((dialogmote) => dialogmote.uuid === moteuuid);
      if (!!dialogmoteToUpdate) {
        const filteredDialogmoter = mockedDialogmoter.filter(
          (dm) => dm.uuid !== dialogmoteToUpdate.uuid
        );
        mockedDialogmoter = [
          ...filteredDialogmoter,
          {
            ...dialogmoteToUpdate,
            status: DialogmoteStatus.AVLYST,
          },
        ];
        res.sendStatus(200);
      } else {
        res.sendStatus(500);
      }
    }
  );

  server.post(
    `${ISDIALOGMOTE_ROOT}/dialogmote/:moteuuid/tidsted`,
    (req: express.Request, res: express.Response) => {
      res.sendStatus(200);
    }
  );

  server.post(
    `${ISDIALOGMOTE_ROOT}/dialogmote/:moteuuid/ferdigstill`,
    (req: express.Request, res: express.Response) => {
      const { moteuuid } = req.params;
      const dialogmoteToUpdate: DialogmoteDTO | undefined =
        mockedDialogmoter.find((dialogmote) => dialogmote.uuid === moteuuid);
      if (!!dialogmoteToUpdate) {
        const filteredDialogmoter = mockedDialogmoter.filter(
          (dm) => dm.uuid !== dialogmoteToUpdate.uuid
        );
        mockedDialogmoter = [
          ...filteredDialogmoter,
          {
            ...dialogmoteToUpdate,
            status: DialogmoteStatus.FERDIGSTILT,
            referatList: [createReferat(true, Date.now().toString())],
          },
        ];
        res.sendStatus(200);
      } else {
        res.sendStatus(500);
      }
    }
  );

  server.post(
    `${ISDIALOGMOTE_ROOT}/dialogmote/:moteuuid/endreferdigstilt`,
    (req: express.Request, res: express.Response) => {
      res.sendStatus(200);
    }
  );
};
