import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";
import { useDocumentComponents } from "@/hooks/useDocumentComponents";
import {
  createHeaderH1,
  createHeaderH3,
  createParagraph,
} from "@/utils/documentComponentUtils";
import {
  arbeidsuforhetTexts,
  getAvslagArbeidsuforhetTexts,
  getForhandsvarselArbeidsuforhetTexts,
} from "@/data/arbeidsuforhet/arbeidsuforhetDocumentTexts";
import {
  arsakTexts,
  VurderingArsak,
} from "@/data/arbeidsuforhet/arbeidsuforhetTypes";

type ForhandsvarselDocumentValues = {
  begrunnelse: string;
  frist: Date;
};

type OppfyltDocumentValues = {
  begrunnelse: string;
  forhandsvarselSendtDato: Date;
};

type AvslagDocumentValues = {
  begrunnelse: string;
  fom: Date | undefined;
};

type IkkeAktuellDocumentValues = {
  arsak: VurderingArsak;
};

export const useArbeidsuforhetVurderingDocument = (): {
  getForhandsvarselDocument(
    values: ForhandsvarselDocumentValues
  ): DocumentComponentDto[];
  getOppfyltDocument(values: OppfyltDocumentValues): DocumentComponentDto[];
  getAvslagDocument(values: AvslagDocumentValues): DocumentComponentDto[];
  getIkkeAktuellDocument(
    values: IkkeAktuellDocumentValues
  ): DocumentComponentDto[];
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

  const getOppfyltDocument = ({
    begrunnelse,
    forhandsvarselSendtDato,
  }: OppfyltDocumentValues) => {
    const documentComponents = [
      createHeaderH1(arbeidsuforhetTexts.header),
      getIntroGjelder(),
      createParagraph(
        arbeidsuforhetTexts.previousForhandsvarsel(forhandsvarselSendtDato)
      ),
      createParagraph(arbeidsuforhetTexts.forAFaSykepenger),
      createParagraph(begrunnelse),
      createParagraph(arbeidsuforhetTexts.viHarBruktLoven),
    ];
    documentComponents.push(getVurdertAv());

    return documentComponents;
  };

  const getIkkeAktuellDocument = ({ arsak }: IkkeAktuellDocumentValues) => {
    return [
      createHeaderH1("Vurdering av § 8-4 arbeidsuførhet"),
      getIntroGjelder(),
      createParagraph(
        `Det er vurdert at folketrygdloven § 8-4 ikke kommer til anvendelse i dette tilfellet. Årsak: ${arsakTexts[arsak]}.`
      ),
      getVurdertAv(),
    ];
  };

  return {
    getForhandsvarselDocument,
    getOppfyltDocument,
    getAvslagDocument,
    getIkkeAktuellDocument,
  };
};
