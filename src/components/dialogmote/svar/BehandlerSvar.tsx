import {
  DialogmotedeltakerBehandlerVarselDTO,
  DialogmotedeltakerBehandlerVarselSvarDTO,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { getSvarTekst } from "@/utils/dialogmoteUtils";
import { EkspanderbartSvarPanel } from "@/components/dialogmote/svar/EkspanderbartSvarPanel";
import { SvarIcon } from "@/components/dialogmote/svar/SvarIcon";
import React from "react";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { SvarDetaljer } from "@/components/dialogmote/svar/SvarDetaljer";

const texts = {
  label: "Behandleren:",
  svarIkkeMottatt: "har ikke gitt svar",
  begrunnelseMottattHeader: "Begrunnelse mottatt",
};

const begrunnelseHeaderTekst = (
  svar: DialogmotedeltakerBehandlerVarselSvarDTO
) =>
  `${texts.begrunnelseMottattHeader} ${tilLesbarDatoMedArUtenManedNavn(
    svar.createdAt
  )}`;

interface Props {
  varsel: DialogmotedeltakerBehandlerVarselDTO;
  behandlerNavn: string;
}

export const BehandlerSvar = ({ varsel, behandlerNavn }: Props) => {
  const svarList = varsel.svar;
  const latestSvar: DialogmotedeltakerBehandlerVarselSvarDTO | undefined =
    svarList[0];
  const svarTittelTekst = !latestSvar
    ? texts.svarIkkeMottatt
    : getSvarTekst(latestSvar.createdAt, latestSvar.svarType, svarList.length);

  return (
    <EkspanderbartSvarPanel
      title={{
        icon: <SvarIcon svarType={latestSvar?.svarType} />,
        label: texts.label,
        body: `${behandlerNavn}, ${svarTittelTekst}`,
      }}
      defaultOpen={!!latestSvar}
    >
      {svarList.length > 1 ? (
        <>
          {svarList
            .filter((svar) => svar.tekst)
            .map((svar, idx) => (
              <SvarDetaljer
                key={idx}
                label={begrunnelseHeaderTekst(svar)}
                svarTekst={svar.tekst}
              />
            ))}
        </>
      ) : (
        <SvarDetaljer
          label={latestSvar && begrunnelseHeaderTekst(latestSvar)}
          svarTekst={latestSvar?.tekst}
        />
      )}
    </EkspanderbartSvarPanel>
  );
};
