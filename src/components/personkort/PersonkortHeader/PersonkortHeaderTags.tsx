import React from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ApiErrorException } from "@/api/errors";
import { FlexGapSize, FlexRow } from "@/components/Layout";
import { Tag } from "@navikt/ds-react";
import { useEgenansattQuery } from "@/data/egenansatt/egenansattQueryHooks";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { useDiskresjonskodeQuery } from "@/data/diskresjonskode/diskresjonskodeQueryHooks";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";

const texts = {
  fetchDiskresjonskodeFailed: "Klarte ikke hente diskresjonskode for brukeren.",
  dod: "Død",
  kode6: "Kode 6",
  kode7: "Kode 7",
  egenansatt: "Egenansatt",
};

export const PersonkortHeaderTags = () => {
  const { data: isEgenAnsatt } = useEgenansattQuery();
  const navbruker = useNavBrukerData();
  const { error, data: diskresjonskode } = useDiskresjonskodeQuery();

  const isDead = !!navbruker.dodsdato;
  const dateOfDeath = tilLesbarDatoMedArUtenManedNavn(navbruker.dodsdato);
  const isKode6 = diskresjonskode === "6";
  const isKode7 = diskresjonskode === "7";
  const visEtiketter = isKode6 || isKode7 || isEgenAnsatt || isDead;

  return (
    <>
      {visEtiketter && (
        <ErrorBoundary
          apiError={
            error instanceof ApiErrorException ? error.error : undefined
          }
          errorMessage={texts.fetchDiskresjonskodeFailed}
        >
          <FlexRow columnGap={FlexGapSize.SM}>
            {isKode6 && (
              <Tag variant="warning" size="small">
                {texts.kode6}
              </Tag>
            )}
            {isKode7 && (
              <Tag variant="warning" size="small">
                {texts.kode7}
              </Tag>
            )}
            {isEgenAnsatt && (
              <Tag variant="warning" size="small">
                {texts.egenansatt}
              </Tag>
            )}
            {isDead && (
              <Tag
                variant="error"
                size="small"
              >{`${texts.dod} ${dateOfDeath}`}</Tag>
            )}
          </FlexRow>
        </ErrorBoundary>
      )}
    </>
  );
};
