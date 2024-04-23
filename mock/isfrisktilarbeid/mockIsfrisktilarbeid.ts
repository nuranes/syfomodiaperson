import express = require("express");
import { ISFRISKTILARBEID_ROOT } from "../../src/apiConstants";
import { NAV_PERSONIDENT_HEADER } from "../util/requestUtil";
import { generateUUID } from "../../src/utils/uuidUtils";
import { VEILEDER_DEFAULT } from "../common/mockConstants";
import {
  VedtakRequestDTO,
  VedtakResponseDTO,
} from "../../src/data/frisktilarbeid/frisktilarbeidTypes";

let vedtak: VedtakResponseDTO[] = [];

export const mockIsfrisktilarbeid = (server: any) => {
  server.get(
    `${ISFRISKTILARBEID_ROOT}/frisktilarbeid/vedtak`,
    (req: express.Request, res: express.Response) => {
      if (req.headers[NAV_PERSONIDENT_HEADER]?.length === 11) {
        res.send(JSON.stringify(vedtak));
      } else {
        res.status(400).send("Did not find PersonIdent in headers");
      }
    }
  );

  server.post(
    `${ISFRISKTILARBEID_ROOT}/frisktilarbeid/vedtak`,
    (req: express.Request, res: express.Response) => {
      const body: VedtakRequestDTO = req.body;
      const sentVedtak: VedtakResponseDTO = {
        uuid: generateUUID(),
        createdAt: new Date(),
        veilederident: VEILEDER_DEFAULT.ident,
        begrunnelse: body.begrunnelse,
        document: body.document,
        fom: new Date(body.fom),
        tom: new Date(body.tom),
      };
      vedtak = [sentVedtak, ...vedtak];
      res.status(201).send(JSON.stringify(sentVedtak));
    }
  );
};
