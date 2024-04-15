import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";
import { useDocumentComponents } from "@/hooks/useDocumentComponents";
import {
  createHeaderH1,
  createHeaderH3,
  createParagraph,
} from "@/utils/documentComponentUtils";
import {
  getAvslagArbeidsuforhetTexts,
  getForhandsvarselArbeidsuforhetTexts,
  getOppfyltArbeidsuforhetTexts,
} from "@/data/arbeidsuforhet/arbeidsuforhetDocumentTexts";

type ForhandsvarselDocumentValues = {
  begrunnelse: string;
  frist: Date;
};

type AvslagDocumentValues = {
  begrunnelse: string;
  fom: Date;
};

export const useArbeidsuforhetVurderingDocument = (): {
  getForhandsvarselDocument(
    values: ForhandsvarselDocumentValues
  ): DocumentComponentDto[];
  getOppfyltDocument(begrunnelse: string): DocumentComponentDto[];
  getAvslagDocument(values: AvslagDocumentValues): DocumentComponentDto[];
} => {
  const { getHilsen, getIntroGjelder, getVurdertAv, getVeiledernavn } =
    useDocumentComponents();

  const getForhandsvarselDocument = (values: ForhandsvarselDocumentValues) => {
    const { begrunnelse, frist } = values;
    const sendForhandsvarselTexts = getForhandsvarselArbeidsuforhetTexts({
      frist,
    });

    const documentComponents = [
      createHeaderH1(sendForhandsvarselTexts.varselInfo.header),
      createParagraph(sendForhandsvarselTexts.varselInfo.introWithFristDate),
      createParagraph(sendForhandsvarselTexts.begrunnelse.uteAvStand),
    ];

    if (begrunnelse) {
      documentComponents.push(createParagraph(begrunnelse));
    }

    documentComponents.push(
      createHeaderH3(sendForhandsvarselTexts.duKanUttaleDeg.header),
      createParagraph(
        sendForhandsvarselTexts.duKanUttaleDeg.tilbakemeldingWithFristDate
      ),
      createParagraph(sendForhandsvarselTexts.duKanUttaleDeg.etterFrist),
      createParagraph(sendForhandsvarselTexts.duKanUttaleDeg.friskmeldt),
      createParagraph(sendForhandsvarselTexts.duKanUttaleDeg.kontaktOss),

      createHeaderH3(sendForhandsvarselTexts.lovhjemmel.header),
      createParagraph(sendForhandsvarselTexts.lovhjemmel.arbeidsuforhet),
      createParagraph(sendForhandsvarselTexts.lovhjemmel.pliktInfo),

      getHilsen()
    );

    return documentComponents;
  };

  const getAvslagDocument = (values: AvslagDocumentValues) => {
    const { begrunnelse, fom } = values;
    const avslagArbeidsuforhetTexts = getAvslagArbeidsuforhetTexts(fom);

    const documentComponents = [
      createHeaderH1(avslagArbeidsuforhetTexts.header),
      createParagraph(avslagArbeidsuforhetTexts.fom),
      createParagraph(avslagArbeidsuforhetTexts.intro),
    ];

    if (begrunnelse) {
      documentComponents.push(createParagraph(begrunnelse));
    }

    documentComponents.push(
      createParagraph(avslagArbeidsuforhetTexts.hjemmel),
      getVeiledernavn()
    );

    return documentComponents;
  };

  const getOppfyltDocument = (begrunnelse: string) => {
    const oppfyltArbeidsuforhetTexts = getOppfyltArbeidsuforhetTexts(
      new Date(),
      begrunnelse
    );
    const documentComponents = [
      createHeaderH1(oppfyltArbeidsuforhetTexts.header),
      getIntroGjelder(),
      createParagraph(oppfyltArbeidsuforhetTexts.vurdert),
    ];

    if (begrunnelse) {
      documentComponents.push(
        createParagraph(oppfyltArbeidsuforhetTexts.begrunnelse)
      );
    }

    documentComponents.push(getVurdertAv());

    return documentComponents;
  };

  return {
    getForhandsvarselDocument,
    getOppfyltDocument,
    getAvslagDocument,
  };
};
