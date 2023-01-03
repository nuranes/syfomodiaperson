import React from "react";
import Sidetopp from "../Sidetopp";
import UtdragFraSykefravaeret from "../utdragFraSykefravaeret/UtdragFraSykefravaeret";
import { Sykmeldingsgrad } from "@/components/sykmeldingsgrad/Sykmeldingsgrad";
import { ToggleNames } from "@/data/unleash/unleash_types";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";

interface NokkelinformasjonProps {
  pageTitle: string;
}

const Nokkelinformasjon = ({ pageTitle }: NokkelinformasjonProps) => {
  const { isFeatureEnabled } = useFeatureToggles();
  const visSykmeldingsgrad = isFeatureEnabled(ToggleNames.sykmeldingsgrad);

  return (
    <div>
      <Sidetopp tittel={pageTitle} />

      {visSykmeldingsgrad && <Sykmeldingsgrad />}

      <UtdragFraSykefravaeret />
    </div>
  );
};

export default Nokkelinformasjon;
