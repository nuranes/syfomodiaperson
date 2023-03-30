import React from "react";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { tilLesbarPeriodeMedArUtenManednavn } from "@/utils/datoUtils";
import { Radio, RadioGroup } from "@navikt/ds-react";
import { useSykmeldingerQuery } from "@/data/sykmelding/sykmeldingQueryHooks";
import {
  getDiagnosekodeFromLatestSykmelding,
  sendtAndBekreftetSykmeldinger,
  sykmeldingerInnenforOppfolgingstilfelle,
} from "@/utils/sykmeldinger/sykmeldingUtils";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";
import { ToggleNames } from "@/data/unleash/unleash_types";
import styled from "styled-components";
import { HealthCase } from "@navikt/ds-icons";

const texts = {
  title: "Siste sykefravær",
};

interface SyketilfelleListProps {
  changeSelectedTilfelle: (value: OppfolgingstilfelleDTO) => void;
}

const KodeSpan = styled.span`
  margin-left: 0.2em;
`;

const TilfelleBox = styled.div`
  display: flex;
  align-items: center;
`;

const DiagnoseIkon = styled(HealthCase)`
  margin-left: 0.5em;
`;

export const SyketilfelleList = ({
  changeSelectedTilfelle,
}: SyketilfelleListProps) => {
  const { tilfellerDescendingStart } = useOppfolgingstilfellePersonQuery();
  const { sykmeldinger } = useSykmeldingerQuery();

  const { isFeatureEnabled } = useFeatureToggles();
  const showDiagnosekode = isFeatureEnabled(ToggleNames.gradgrafDiagnosekode);

  const tenLatestTilfeller = tilfellerDescendingStart?.slice(0, 10);

  const getDiagnosekode = (tilfelle: OppfolgingstilfelleDTO): string => {
    const usedSykmeldinger = sendtAndBekreftetSykmeldinger(sykmeldinger);
    const sykmeldingerIOppfolgingstilfellet =
      sykmeldingerInnenforOppfolgingstilfelle(usedSykmeldinger, tilfelle);

    return getDiagnosekodeFromLatestSykmelding(
      sykmeldingerIOppfolgingstilfellet
    );
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
            return (
              <TilfelleBox key={index}>
                <Radio key={index} value={tilfelle}>
                  {tilfelleText(tilfelle)}
                </Radio>
                {showDiagnosekode && (
                  <>
                    <DiagnoseIkon />
                    <KodeSpan>{getDiagnosekode(tilfelle)}</KodeSpan>
                  </>
                )}
              </TilfelleBox>
            );
          }
        )}
      </RadioGroup>
    </div>
  );
};
