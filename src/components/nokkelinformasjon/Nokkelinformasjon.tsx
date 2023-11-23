import React from "react";
import Sidetopp from "../Sidetopp";
import UtdragFraSykefravaeret from "../utdragFraSykefravaeret/UtdragFraSykefravaeret";
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
