import { MeldingType } from "@/data/behandlerdialog/behandlerdialogTypes";

export const meldingTypeTexts: {
  [key in MeldingType]: string;
} = {
  [MeldingType.FORESPORSEL_PASIENT_TILLEGGSOPPLYSNINGER]:
    "Tilleggsopplysninger L8",
  [MeldingType.FORESPORSEL_PASIENT_LEGEERKLARING]: "Legeerklæring L40",
  [MeldingType.FORESPORSEL_PASIENT_PAMINNELSE]: "Påminnelse",
};
