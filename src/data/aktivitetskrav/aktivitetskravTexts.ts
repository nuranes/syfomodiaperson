import {
  AvventVurderingArsak,
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

export const avventVurderingArsakTexts: ArsakText[] = [
  {
    arsak: AvventVurderingArsak.OPPFOLGINGSPLAN_ARBEIDSGIVER,
    text: "Har bedt om oppfølgingsplan fra arbeidsgiver",
  },
  {
    arsak: AvventVurderingArsak.INFORMASJON_BEHANDLER,
    text: "Har bedt om mer informasjon fra behandler",
  },
  {
    arsak: AvventVurderingArsak.ANNET,
    text: "Annet",
  },
];
