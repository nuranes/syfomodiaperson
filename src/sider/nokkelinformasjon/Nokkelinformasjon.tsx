import React from "react";
import Sidetopp from "../../components/Sidetopp";
import UtdragFraSykefravaeret from "../../components/utdragFraSykefravaeret/UtdragFraSykefravaeret";
import { Sykmeldingsgrad } from "@/components/sykmeldingsgrad/Sykmeldingsgrad";

interface NokkelinformasjonProps {
  pageTitle: string;
}

const Nokkelinformasjon = ({ pageTitle }: NokkelinformasjonProps) => {
  return (
    <>
      <Sidetopp tittel={pageTitle} />
      <Sykmeldingsgrad />
      <UtdragFraSykefravaeret />
    </>
  );
};

export default Nokkelinformasjon;
