import { getHarAapnetTekst, getSvarTekst } from "@/utils/dialogmoteUtils";
import { EkspanderbartSvarPanel } from "@/sider/dialogmoter/components/svar/EkspanderbartSvarPanel";
import { SvarIcon } from "@/sider/dialogmoter/components/svar/SvarIcon";
import { capitalizeAllWords } from "@/utils/stringUtils";
import { SvarDetaljer } from "@/sider/dialogmoter/components/svar/SvarDetaljer";
import React from "react";
import { DialogmotedeltakerArbeidstakerVarselDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";

const texts = {
  label: "Arbeidstakeren:",
};

interface Props {
  varsel: DialogmotedeltakerArbeidstakerVarselDTO;
  defaultClosed?: boolean;
}

export const ArbeidstakerSvar = ({ varsel, defaultClosed = false }: Props) => {
  const bruker = useNavBrukerData();

  const svar = varsel?.svar;
  const svarTittelTekst = !svar
    ? getHarAapnetTekst(varsel?.varselType, varsel?.lestDato)
    : getSvarTekst(svar.svarTidspunkt, svar.svarType);

  return (
    <EkspanderbartSvarPanel
      title={{
        icon: <SvarIcon svarType={svar?.svarType} />,
        label: texts.label,
        body: `${capitalizeAllWords(bruker.navn)}, ${svarTittelTekst}`,
      }}
      defaultOpen={!defaultClosed && !!svar}
    >
      <SvarDetaljer svarTekst={svar?.svarTekst} />
    </EkspanderbartSvarPanel>
  );
};
