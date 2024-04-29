import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";
import { useDocumentComponents } from "@/hooks/useDocumentComponents";
import {
  createHeaderH1,
  createParagraph,
} from "@/utils/documentComponentUtils";
import {
  BehandlermeldingTextsValues,
  getBehandlermeldingTexts,
} from "@/data/frisktilarbeid/frisktilarbeidDocumentTexts";

export const useFriskmeldingTilArbeidsformidlingDocument = (): {
  getBehandlermeldingDocument(
    values: BehandlermeldingTextsValues
  ): DocumentComponentDto[];
} => {
  const { getHilsen, getIntroGjelder } = useDocumentComponents();

  const getBehandlermeldingDocument = ({
    fom,
    tom,
  }: BehandlermeldingTextsValues): DocumentComponentDto[] => {
    const behandlermeldingTexts = getBehandlermeldingTexts({ fom, tom });
    return [
      createHeaderH1(behandlermeldingTexts.header),
      getIntroGjelder(),
      createParagraph(behandlermeldingTexts.periode),
      createParagraph(behandlermeldingTexts.vedtak),
      createParagraph(behandlermeldingTexts.hjemmel),
      getHilsen(),
    ];
  };

  return {
    getBehandlermeldingDocument,
  };
};
