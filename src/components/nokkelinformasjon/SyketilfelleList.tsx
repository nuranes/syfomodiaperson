import React from "react";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { tilLesbarPeriodeMedArUtenManednavn } from "@/utils/datoUtils";
import { Radio, RadioGroup } from "@navikt/ds-react";

const texts = {
  title: "Siste sykefravær",
};

interface SyketilfelleListProps {
  changeSelectedTilfelle: (value: OppfolgingstilfelleDTO) => void;
}

export const SyketilfelleList = ({
  changeSelectedTilfelle,
}: SyketilfelleListProps) => {
  const { tilfellerDescendingStart } = useOppfolgingstilfellePersonQuery();
  const tenLatestTilfeller = tilfellerDescendingStart?.slice(0, 10);

  return (
    <div>
      <RadioGroup
        legend={texts.title}
        onChange={(value: OppfolgingstilfelleDTO) =>
          changeSelectedTilfelle(value)
        }
        size="small"
        defaultValue={tilfellerDescendingStart[0]}
      >
        {tenLatestTilfeller.map(
          (tilfelle: OppfolgingstilfelleDTO, index: number) => {
            return (
              <Radio key={index} value={tilfelle}>
                {tilLesbarPeriodeMedArUtenManednavn(
                  tilfelle.start,
                  tilfelle.end
                )}
              </Radio>
            );
          }
        )}
      </RadioGroup>
    </div>
  );
};
