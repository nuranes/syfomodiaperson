import React from "react";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { tilLesbarPeriodeMedArUtenManednavn } from "@/utils/datoUtils";
import { Radio, RadioGroup, Tooltip } from "@navikt/ds-react";
import { useSykmeldingerQuery } from "@/data/sykmelding/sykmeldingQueryHooks";
import {
  getDiagnoseFromLatestSykmelding,
  newAndActivatedSykmeldinger,
  sykmeldingerInnenforOppfolgingstilfelle,
} from "@/utils/sykmeldinger/sykmeldingUtils";
import { MedisinskrinImage } from "../../../../img/ImageComponents";
import { SykmeldingDiagnose } from "@/data/sykmelding/types/SykmeldingOldFormat";

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
  const { sykmeldinger } = useSykmeldingerQuery();

  const tenLatestTilfeller = tilfellerDescendingStart?.slice(0, 10);

  const getDiagnose = (
    tilfelle: OppfolgingstilfelleDTO
  ): SykmeldingDiagnose | undefined => {
    const newAndUsedSykmeldinger = newAndActivatedSykmeldinger(sykmeldinger);
    const sykmeldingerIOppfolgingstilfellet =
      sykmeldingerInnenforOppfolgingstilfelle(newAndUsedSykmeldinger, tilfelle);

    return getDiagnoseFromLatestSykmelding(sykmeldingerIOppfolgingstilfellet);
  };

  const tilfelleText = (tilfelle: OppfolgingstilfelleDTO) => {
    return `${tilLesbarPeriodeMedArUtenManednavn(
      tilfelle.start,
      tilfelle.end
    )}`;
  };

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
            const diagnose = getDiagnose(tilfelle);
            return (
              <div className="flex items-center" key={index}>
                <Radio key={index} value={tilfelle}>
                  {tilfelleText(tilfelle)}
                </Radio>
                {diagnose?.diagnosekode && (
                  <Tooltip content={diagnose.diagnose ?? "Ukjent diagnosenavn"}>
                    <div className="ml-2">
                      <img src={MedisinskrinImage} alt="Medisinskrin" />
                      <span className="ml-1">{diagnose.diagnosekode}</span>
                    </div>
                  </Tooltip>
                )}
              </div>
            );
          }
        )}
      </RadioGroup>
    </div>
  );
};
