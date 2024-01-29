import React from "react";
import Side from "../../Side";
import Nokkelinformasjon from "../Nokkelinformasjon";
import SideLaster from "../../../components/SideLaster";
import { useOppfolgingsplanerQuery } from "@/data/oppfolgingsplan/oppfolgingsplanQueryHooks";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import { useSykmeldingerQuery } from "@/data/sykmelding/sykmeldingQueryHooks";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";

const texts = {
  pageTitle: "Nøkkelinformasjon",
};

export const NokkelinformasjonSide = () => {
  const { isLoading: henterOppfolgingsplaner } = useOppfolgingsplanerQuery();
  const { isError: henterSykmeldingerFeilet } = useSykmeldingerQuery();
  const { isLoading: henterLedere, isError: henterLedereFeilet } =
    useLedereQuery();

  const henter = henterOppfolgingsplaner || henterLedere;
  const hentingFeilet = henterSykmeldingerFeilet || henterLedereFeilet;

  return (
    <Side
      tittel={texts.pageTitle}
      aktivtMenypunkt={Menypunkter.NOKKELINFORMASJON}
    >
      <SideLaster henter={henter} hentingFeilet={hentingFeilet}>
        <Nokkelinformasjon pageTitle={texts.pageTitle} />
      </SideLaster>
    </Side>
  );
};

export default NokkelinformasjonSide;
