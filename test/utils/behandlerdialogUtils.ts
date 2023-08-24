import {
  MeldingDTO,
  MeldingType,
} from "@/data/behandlerdialog/behandlerdialogTypes";

export const hasMeldingOfType = (
  meldinger: MeldingDTO[],
  type: MeldingType
): boolean => meldinger.some((melding) => melding.type === type);

export const antallOfType = (
  meldinger: MeldingDTO[],
  type: MeldingType
): number => filterOnType(meldinger, type).length;

export const filterOnType = (
  meldinger: MeldingDTO[],
  type: MeldingType
): MeldingDTO[] => meldinger.filter((melding) => melding.type === type);
