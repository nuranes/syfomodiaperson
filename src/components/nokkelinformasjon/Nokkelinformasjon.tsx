import React from "react";
import Sidetopp from "../Sidetopp";
import UtdragFraSykefravaeret from "../utdragFraSykefravaeret/UtdragFraSykefravaeret";
import { Sykmeldingsgrad } from "@/components/sykmeldingsgrad/Sykmeldingsgrad";
import { FlexPanel } from "@/components/Layout";

interface NokkelinformasjonProps {
  pageTitle: string;
}

const Nokkelinformasjon = ({ pageTitle }: NokkelinformasjonProps) => {
  return (
    <div>
      <Sidetopp tittel={pageTitle} />
      <Sykmeldingsgrad />
      <FlexPanel>
        <UtdragFraSykefravaeret />
      </FlexPanel>
    </div>
  );
};

export default Nokkelinformasjon;
