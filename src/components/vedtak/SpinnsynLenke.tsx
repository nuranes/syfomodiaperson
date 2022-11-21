import Lenke from "nav-frontend-lenker";
import React from "react";
import { fullNaisUrlIntern } from "@/utils/miljoUtil";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { ExternalLink } from "@navikt/ds-icons";

export const spinnsynUrl = () =>
  fullNaisUrlIntern("spinnsyn-frontend-interne", "/syk/sykepenger");

export const SpinnsynLenke = () => {
  const navbruker = useNavBrukerData();

  return (
    <Lenke href={spinnsynUrl()} target="_blank" rel="noopener noreferrer">
      <span>{`Se vedtakene slik ${navbruker.navn} ser dem på nav.no`}</span>
      <ExternalLink />
    </Lenke>
  );
};
