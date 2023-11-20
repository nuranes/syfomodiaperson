import React from "react";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { tilLesbarPeriodeMedArUtenManednavn } from "@/utils/datoUtils";
import { Radio, RadioGroup } from "@navikt/ds-react";
import { useSykmeldingerQuery } from "@/data/sykmelding/sykmeldingQueryHooks";
import {
  getDiagnosekodeFromLatestSykmelding,
  newAndActivatedSykmeldinger,
  sykmeldingerInnenforOppfolgingstilfelle,
} from "@/utils/sykmeldinger/sykmeldingUtils";
import styled from "styled-components";
import { MedisinskrinImage } from "../../../img/ImageComponents";

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

export const SyketilfelleList = ({
  changeSelectedTilfelle,
}: SyketilfelleListProps) => {
  const { tilfellerDescendingStart } = useOppfolgingstilfellePersonQuery();
  const { sykmeldinger } = useSykmeldingerQuery();

  const tenLatestTilfeller = tilfellerDescendingStart?.slice(0, 10);

  const getDiagnosekode = (tilfelle: OppfolgingstilfelleDTO): string => {
    const newAndUsedSykmeldinger = newAndActivatedSykmeldinger(sykmeldinger);
    const sykmeldingerIOppfolgingstilfellet =
      sykmeldingerInnenforOppfolgingstilfelle(newAndUsedSykmeldinger, tilfelle);

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
                <>
                  <div className="ml-2">
                    <img src={MedisinskrinImage} alt="Medisinskrin" />
                  </div>
                  <KodeSpan>{getDiagnosekode(tilfelle)}</KodeSpan>
                </>
              </TilfelleBox>
            );
          }
        )}
      </RadioGroup>
    </div>
  );
};
