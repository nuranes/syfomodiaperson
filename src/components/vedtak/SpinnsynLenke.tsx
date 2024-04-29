import React from "react";
import { fullNaisUrlIntern } from "@/utils/miljoUtil";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { EksternLenke } from "@/components/EksternLenke";

export const spinnsynUrl = function () {
  return fullNaisUrlIntern("spinnsyn-frontend-interne", "/syk/sykepenger");
};

export const SpinnsynLenke = () => {
  const { navn } = useNavBrukerData();

  return (
    <EksternLenke
      href={spinnsynUrl()}
    >{`Se vedtakene slik ${navn} ser dem på nav.no`}</EksternLenke>
  );
};
