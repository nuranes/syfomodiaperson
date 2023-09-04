import { MeldingType } from "@/data/behandlerdialog/behandlerdialogTypes";

export const meldingTypeTexts: {
  [key in MeldingType]: string;
} = {
  [MeldingType.FORESPORSEL_PASIENT_TILLEGGSOPPLYSNINGER]:
    "Tilleggsopplysninger L8",
  [MeldingType.FORESPORSEL_PASIENT_LEGEERKLARING]: "Legeerklæring L40",
  [MeldingType.FORESPORSEL_PASIENT_PAMINNELSE]: "Påminnelse",
  [MeldingType.HENVENDELSE_RETUR_LEGEERKLARING]: "Retur av legeerklæring",
  [MeldingType.HENVENDELSE_MELDING_FRA_NAV]: "Melding fra NAV",
};
