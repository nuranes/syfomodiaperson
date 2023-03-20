import Lenke from "nav-frontend-lenker";
import React from "react";
import {erLokal, erPreProd, fullNaisUrlIntern} from "@/utils/miljoUtil";
import {useNavBrukerData} from "@/data/navbruker/navbruker_hooks";
import {ExternalLink} from "@navikt/ds-icons";

export const spinnsynUrl = function () {
    const path = "/syk/sykepenger"
    if (erLokal()) {
        return path;
    }
    if (erPreProd()) {
        `https://spinnsyn-frontend-interne.intern.dev.nav.no${path}`;
    }
    return fullNaisUrlIntern("spinnsyn-frontend-interne", path);
};

export const SpinnsynLenke = () => {
    const navbruker = useNavBrukerData();

  return (
    <Lenke href={spinnsynUrl()} target="_blank" rel="noopener noreferrer">
      <span>{`Se vedtakene slik ${navbruker.navn} ser dem på nav.no`}</span>
      <ExternalLink />
    </Lenke>
  );
};
