import React, { ReactElement } from "react";
import { useVedtakQuery } from "@/data/frisktilarbeid/vedtakQuery";
import { VedtakResponseDTO } from "@/data/frisktilarbeid/frisktilarbeidTypes";
import { VedtakFattet } from "@/sider/frisktilarbeid/VedtakFattet";
import { FattVedtak } from "@/sider/frisktilarbeid/FattVedtak";

export const FriskmeldingTilArbeidsformidling = (): ReactElement => {
  const { data } = useVedtakQuery();
  const vedtak: VedtakResponseDTO | undefined = data[0];

  if (!vedtak) {
    return <FattVedtak />;
  } else {
    return <VedtakFattet vedtak={vedtak} />;
  }
};
