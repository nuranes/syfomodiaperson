import {
  OppfyltVurderingArsak,
  UnntakVurderingArsak,
  VurderingArsak,
} from "@/data/aktivitetskrav/aktivitetskravTypes";

export type ArsakText = {
  arsak: VurderingArsak;
  text: string;
};

export const oppfyltVurderingArsakTexts: ArsakText[] = [
  {
    arsak: OppfyltVurderingArsak.FRISKMELDT,
    text: "Friskmeldt",
  },
  {
    arsak: OppfyltVurderingArsak.GRADERT,
    text: "Gradert",
  },
  {
    arsak: OppfyltVurderingArsak.TILTAK,
    text: "I tiltak",
  },
];

export const unntakVurderingArsakTexts: ArsakText[] = [
  {
    arsak: UnntakVurderingArsak.MEDISINSKE_GRUNNER,
    text: "Medisinske grunner",
  },
  {
    arsak: UnntakVurderingArsak.TILRETTELEGGING_IKKE_MULIG,
    text: "Tilrettelegging ikke mulig",
  },
  {
    arsak: UnntakVurderingArsak.SJOMENN_UTENRIKS,
    text: "Sjømenn i utenriksfart",
  },
];
