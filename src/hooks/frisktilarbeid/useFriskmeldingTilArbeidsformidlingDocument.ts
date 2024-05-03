import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";
import { useDocumentComponents } from "@/hooks/useDocumentComponents";
import {
  createHeaderH1,
  createParagraph,
  createParagraphWithTitle,
} from "@/utils/documentComponentUtils";
import {
  BehandlermeldingTextsValues,
  getBehandlermeldingTexts,
  getVedtakTexts,
  VedtakTextsValues,
} from "@/data/frisktilarbeid/frisktilarbeidDocumentTexts";

type VedtakDocumentValues = VedtakTextsValues & {
  begrunnelse: string | undefined;
};

export const useFriskmeldingTilArbeidsformidlingDocument = (): {
  getBehandlermeldingDocument(
    values: BehandlermeldingTextsValues
  ): DocumentComponentDto[];
  getVedtakDocument(values: VedtakDocumentValues): DocumentComponentDto[];
} => {
  const { getHilsen, getIntroGjelder, getBrukerNavnFnr } =
    useDocumentComponents();

  const getBehandlermeldingDocument = (
    values: BehandlermeldingTextsValues
  ): DocumentComponentDto[] => {
    const behandlermeldingTexts = getBehandlermeldingTexts(values);
    return [
      createHeaderH1(behandlermeldingTexts.header),
      getIntroGjelder(),
      createParagraph(behandlermeldingTexts.periode),
      createParagraph(behandlermeldingTexts.vedtak),
      createParagraph(behandlermeldingTexts.hjemmel),
      getHilsen(),
    ];
  };

  const getVedtakDocument = (
    values: VedtakDocumentValues
  ): DocumentComponentDto[] => {
    const vedtakTexts = getVedtakTexts(values);
    const documentComponentDtos = [
      createHeaderH1(vedtakTexts.header),
      getBrukerNavnFnr(),
      createParagraph(vedtakTexts.intro),
      createParagraph(vedtakTexts.periode),
      createParagraph(
        vedtakTexts.arbeidssoker.part1,
        vedtakTexts.arbeidssoker.part2
      ),
      createParagraph(vedtakTexts.hjemmel),
      createParagraphWithTitle(
        vedtakTexts.begrunnelse.header,
        vedtakTexts.begrunnelse.part1
      ),
    ];

    if (values.begrunnelse) {
      documentComponentDtos.push(createParagraph(values.begrunnelse));
    }

    documentComponentDtos.push(
      createParagraph(vedtakTexts.begrunnelse.part2),
      createParagraphWithTitle(
        vedtakTexts.nyttigInfo.header,
        vedtakTexts.nyttigInfo.part1
      ),
      createParagraph(vedtakTexts.nyttigInfo.part2),
      createParagraph(vedtakTexts.nyttigInfo.part3),
      createParagraph(vedtakTexts.nyttigInfo.part4),
      createParagraphWithTitle(
        vedtakTexts.sporsmal.header,
        vedtakTexts.sporsmal.body
      ),
      createParagraph(vedtakTexts.kontakt),
      createParagraphWithTitle(
        vedtakTexts.innsyn.header,
        vedtakTexts.innsyn.body
      ),
      createParagraphWithTitle(
        vedtakTexts.klage.header,
        vedtakTexts.klage.body
      ),
      getHilsen()
    );

    return documentComponentDtos;
  };

  return {
    getBehandlermeldingDocument,
    getVedtakDocument,
  };
};
