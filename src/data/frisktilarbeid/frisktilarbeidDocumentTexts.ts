import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";

export type BehandlermeldingTextsValues = {
  fom: Date;
  tom: Date;
};

export const getBehandlermeldingTexts = ({
  fom,
  tom,
}: BehandlermeldingTextsValues) => ({
  header: "Informasjon om vedtak om friskmelding til arbeidsformidling",
  periode: `Periode fra ${tilLesbarDatoMedArUtenManedNavn(
    fom
  )} til ${tilLesbarDatoMedArUtenManedNavn(tom)}.`,
  vedtak: "Din pasient har fått eget vedtak tilsendt.",
  hjemmel: "Vedtaket er hjemlet i folketrygdloven § 8-5.",
});
