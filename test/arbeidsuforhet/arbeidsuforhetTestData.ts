import {
  VurderingArsak,
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
    arsak: undefined,
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
  arsak?: VurderingArsak;
};

export const createVurdering = ({
  type,
  begrunnelse,
  createdAt,
  arsak = undefined,
}: CreateVurderingOptions): VurderingResponseDTO => {
  return {
    uuid: "123",
    personident: ARBEIDSTAKER_DEFAULT.personIdent,
    createdAt,
    veilederident: VEILEDER_DEFAULT.ident,
    type,
    arsak,
    begrunnelse,
    document: getSendForhandsvarselDocument(begrunnelse),
    varsel: undefined,
  };
};
