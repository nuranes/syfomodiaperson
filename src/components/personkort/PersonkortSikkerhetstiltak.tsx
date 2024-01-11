import React from "react";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { Detail } from "@navikt/ds-react";
import { tilLesbarPeriodeMedArUtenManednavn } from "@/utils/datoUtils";
import PersonkortElement from "@/components/personkort/PersonkortElement";
import { ExclamationmarkTriangleFillIcon } from "@navikt/aksel-icons";

export const PersonkortSikkerhetstiltak = () => {
  const { sikkerhetstiltak } = useNavBrukerData();

  return (
    <PersonkortElement
      tittel="Sikkerhetstiltak"
      icon={
        <ExclamationmarkTriangleFillIcon
          className="mr-2"
          color="var(--a-icon-danger)"
          title="advarsel-ikon"
          fontSize="1.5rem"
        />
      }
    >
      <>
        {sikkerhetstiltak.map(
          ({ beskrivelse, gyldigFom, gyldigTom }, index) => (
            <div key={index}>
              <Detail textColor="subtle">
                {`Gyldig: ${tilLesbarPeriodeMedArUtenManednavn(
                  gyldigFom,
                  gyldigTom
                )}`}
              </Detail>
              {beskrivelse}
            </div>
          )
        )}
      </>
    </PersonkortElement>
  );
};
