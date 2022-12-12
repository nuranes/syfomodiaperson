import { OppfyltVurderingArsak } from "@/data/aktivitetskrav/aktivitetskravTypes";

export type OppfyltVurderingArsakText = {
  arsak: OppfyltVurderingArsak;
  text: string;
};

export const oppfyltVurderingArsakTexts: OppfyltVurderingArsakText[] = [
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
