import {
  VurderingResponseDTO,
  VurderingType,
} from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import {
  ARBEIDSTAKER_DEFAULT,
  VEILEDER_DEFAULT,
} from "../../mock/common/mockConstants";
import { getSendForhandsvarselDocument } from "./documents";

type CreateForhandsvarselOptions = {
  createdAt: Date;
  svarfrist: Date;
};

export const createForhandsvarsel = ({
  createdAt,
  svarfrist,
}: CreateForhandsvarselOptions): VurderingResponseDTO => {
  return {
    uuid: "123",
    personident: ARBEIDSTAKER_DEFAULT.personIdent,
    createdAt,
    veilederident: VEILEDER_DEFAULT.ident,
    type: VurderingType.FORHANDSVARSEL,
    begrunnelse: "begrunnelse",
    document: getSendForhandsvarselDocument("begrunnelse"),
    varsel: {
      uuid: "654",
      createdAt: new Date(),
      svarfrist,
      isExpired: svarfrist <= new Date(),
    },
  };
};

type CreateVurderingOptions = {
  type: VurderingType;
  createdAt: Date;
  begrunnelse: string;
};

export const createVurdering = ({
  type,
  begrunnelse,
  createdAt,
}: CreateVurderingOptions): VurderingResponseDTO => {
  return {
    uuid: "123",
    personident: ARBEIDSTAKER_DEFAULT.personIdent,
    createdAt,
    veilederident: VEILEDER_DEFAULT.ident,
    type,
    begrunnelse,
    document: getSendForhandsvarselDocument(begrunnelse),
    varsel: undefined,
  };
};
