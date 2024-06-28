import React from "react";
import { Tag } from "@navikt/ds-react";
import { useGetVeilederBrukerKnytning } from "@/components/personkort/hooks/useGetVeilederBrukerKnytning";
import { useVeilederInfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";

const texts = {
  tildeltVeileder: "Tildelt veileder:",
  ufordeltBruker: "Ufordelt bruker",
};

interface VeilederNavnProps {
  tildeltVeilederident: string;
}

function VeilederNavn({ tildeltVeilederident }: VeilederNavnProps) {
  const veilederInfoQuery = useVeilederInfoQuery(tildeltVeilederident);
  const veilederInfo = veilederInfoQuery.data;

  return veilederInfoQuery.isSuccess ? (
    <span>
      {veilederInfo
        ? `${
            texts.tildeltVeileder
          } ${veilederInfo?.fulltNavn()} (${tildeltVeilederident})`
        : `${texts.tildeltVeileder} ${tildeltVeilederident}`}
    </span>
  ) : (
    <span></span>
  );
}

export function TildeltVeileder() {
  const veilederBrukerKnytningQuery = useGetVeilederBrukerKnytning();
  const veilederIdent = veilederBrukerKnytningQuery.data?.tildeltVeilederident;
  return veilederBrukerKnytningQuery.isSuccess ? (
    <Tag variant="info" size="small">
      {veilederIdent ? (
        <VeilederNavn tildeltVeilederident={veilederIdent} />
      ) : (
        texts.ufordeltBruker
      )}
    </Tag>
  ) : (
    <span />
  );
}
