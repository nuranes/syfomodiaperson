import React, { ReactElement } from "react";
import Side from "@/sider/Side";
import { Menypunkter } from "@/navigation/menypunkterTypes";
import Sidetopp from "@/components/Sidetopp";
import { useAktivitetskravQuery } from "@/data/aktivitetskrav/aktivitetskravQueryHooks";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import SideLaster from "@/components/SideLaster";
import { AktivitetskravSide } from "@/components/aktivitetskrav/AktivitetskravSide";
import { NotificationProvider } from "@/context/notification/NotificationContext";
import UtdragFraSykefravaeret from "@/components/utdragFraSykefravaeret/UtdragFraSykefravaeret";
import { TREDELING_BREAKING_POINT, TredeltSide } from "@/sider/TredeltSide";
import { useScreenWidth } from "@/hooks/tredeling/useScreenWidth";

const texts = {
  title: "Aktivitetskrav",
  noAccess: "Du har ikke tilgang til denne tjenesten",
};

export const AktivitetskravContainer = (): ReactElement => {
  const { isLoading: henterAktivitetskrav, isError: hentAktivitetskravFeilet } =
    useAktivitetskravQuery();
  const {
    isLoading: henterOppfolgingstilfeller,
    isError: hentOppfolgingstilfellerFeilet,
  } = useOppfolgingstilfellePersonQuery();

  const henter = henterAktivitetskrav || henterOppfolgingstilfeller;
  const hentingFeilet =
    hentAktivitetskravFeilet || hentOppfolgingstilfellerFeilet;

  const screenWidth = useScreenWidth();

  return (
    <Side tittel={texts.title} aktivtMenypunkt={Menypunkter.AKTIVITETSKRAV}>
      <Sidetopp tittel={texts.title} />
      <SideLaster henter={henter} hentingFeilet={hentingFeilet}>
        <TredeltSide>
          <NotificationProvider>
            <AktivitetskravSide />
          </NotificationProvider>
          {screenWidth < TREDELING_BREAKING_POINT ? (
            <UtdragFraSykefravaeret />
          ) : (
            <div className="h-screen overflow-y-scroll">
              <UtdragFraSykefravaeret />
            </div>
          )}
        </TredeltSide>
      </SideLaster>
    </Side>
  );
};
