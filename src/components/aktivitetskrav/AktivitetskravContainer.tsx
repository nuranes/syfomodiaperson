import React, { ReactElement } from "react";
import Side from "@/sider/Side";
import { Menypunkter } from "@/navigation/menypunkterTypes";
import Sidetopp from "@/components/Sidetopp";
import { useAktivitetskravQuery } from "@/data/aktivitetskrav/aktivitetskravQueryHooks";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import SideLaster from "@/components/SideLaster";
import { AktivitetskravSide } from "@/components/aktivitetskrav/AktivitetskravSide";
import { NotificationProvider } from "@/context/notification/NotificationContext";

const texts = {
  title: "Aktivitetskrav",
  noAccess: "Du har ikke tilgang til denne tjenesten",
};

export const AktivitetskravContainer = (): ReactElement => {
  const {
    isInitialLoading: henterAktivitetskrav,
    isError: hentAktivitetskravFeilet,
  } = useAktivitetskravQuery();
  const {
    isInitialLoading: henterOppfolgingstilfeller,
    isError: hentOppfolgingstilfellerFeilet,
  } = useOppfolgingstilfellePersonQuery();

  const henter = henterAktivitetskrav || henterOppfolgingstilfeller;
  const hentingFeilet =
    hentAktivitetskravFeilet || hentOppfolgingstilfellerFeilet;

  return (
    <Side tittel={texts.title} aktivtMenypunkt={Menypunkter.AKTIVITETSKRAV}>
      <Sidetopp tittel={texts.title} />
      <SideLaster henter={henter} hentingFeilet={hentingFeilet}>
        <NotificationProvider>
          <AktivitetskravSide />
        </NotificationProvider>
      </SideLaster>
    </Side>
  );
};
