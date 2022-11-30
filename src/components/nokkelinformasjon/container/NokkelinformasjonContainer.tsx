import React from "react";
import Side from "../../../sider/Side";
import Nokkelinformasjon from "../Nokkelinformasjon";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import SideLaster from "../../SideLaster";
import { useOppfolgingsplanerQuery } from "@/data/oppfolgingsplan/oppfolgingsplanQueryHooks";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import { useSykmeldingerQuery } from "@/data/sykmelding/sykmeldingQueryHooks";
import { Menypunkter } from "@/navigation/menypunkterTypes";

const texts = {
  pageTitle: "Nøkkelinformasjon",
};

export const NokkelinformasjonSide = () => {
  const fnr = useValgtPersonident();
  const { aktivePlaner, isLoading: henterOppfolgingsplaner } =
    useOppfolgingsplanerQuery();
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
        <Nokkelinformasjon
          fnr={fnr}
          aktivePlaner={aktivePlaner}
          pageTitle={texts.pageTitle}
        />
      </SideLaster>
    </Side>
  );
};

export default NokkelinformasjonSide;
