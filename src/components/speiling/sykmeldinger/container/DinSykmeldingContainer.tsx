import React, { ReactElement } from "react";
import {
  ArbeidssituasjonType,
  SykmeldingOldFormat,
  SykmeldingStatus,
} from "@/data/sykmelding/types/SykmeldingOldFormat";
import Side from "../../../../sider/Side";
import SidetoppSpeilet from "../../../SidetoppSpeilet";
import SykmeldingSide from "../sykmelding/SykmeldingSide";
import Brodsmuler from "../../Brodsmuler";
import Speilingvarsel from "../../Speilingvarsel";
import SideLaster from "../../../SideLaster";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { useSykmeldingerQuery } from "@/data/sykmelding/sykmeldingQueryHooks";
import LenkeTilDineSykmeldinger from "@/components/speiling/sykmeldinger/sykmelding/LenkeTilDineSykmeldinger";
import EndreSykmelding from "@/components/endresykmelding/EndreSykmelding";
import { Menypunkter } from "@/navigation/menypunkterTypes";

const texts = {
  pageTitleSykmelding: "Sykmelding",
  pageTitleEgenmelding: "Egenmelding",
};

const pageTitle = (dinSykmelding?: SykmeldingOldFormat) => {
  return dinSykmelding?.egenmeldt
    ? texts.pageTitleEgenmelding
    : texts.pageTitleSykmelding;
};

export const getSykmelding = (
  sykmeldinger: SykmeldingOldFormat[],
  sykmeldingId: string
): SykmeldingOldFormat | undefined => {
  return sykmeldinger.find((sykmld) => {
    return `${sykmld.id}` === `${sykmeldingId}`;
  });
};

const DinSykmeldingSide = (): ReactElement => {
  const sykmeldingId = window.location.pathname.split("/")[3];

  const { navn: brukernavn } = useNavBrukerData();
  const { isInitialLoading, isError, sykmeldinger, arbeidsgiverssykmeldinger } =
    useSykmeldingerQuery();

  const dinSykmelding = getSykmelding(sykmeldinger, sykmeldingId);
  let arbeidsgiversSykmelding = {} as SykmeldingOldFormat | undefined;

  if (
    dinSykmelding &&
    (dinSykmelding.status === SykmeldingStatus.SENDT ||
      (dinSykmelding.status === SykmeldingStatus.BEKREFTET &&
        dinSykmelding.valgtArbeidssituasjon ===
          ArbeidssituasjonType.ARBEIDSTAKER))
  ) {
    arbeidsgiversSykmelding = getSykmelding(
      arbeidsgiverssykmeldinger,
      sykmeldingId
    );
  }

  const brodsmuler = [
    {
      tittel: "Ditt sykefravær",
    },
    {
      tittel: "Dine sykmeldinger",
    },
    {
      tittel: "Sykmelding",
    },
  ];

  return (
    <Side
      tittel={texts.pageTitleSykmelding}
      aktivtMenypunkt={Menypunkter.SYKMELDINGER}
    >
      <SideLaster henter={isInitialLoading} hentingFeilet={isError}>
        <div>
          <Speilingvarsel brukernavn={brukernavn} />
          <div className="speiling">
            <Brodsmuler brodsmuler={brodsmuler} />
            <SidetoppSpeilet tittel={pageTitle(dinSykmelding)} />
            <SykmeldingSide
              dinSykmelding={dinSykmelding}
              arbeidsgiversSykmelding={arbeidsgiversSykmelding}
            />
            {dinSykmelding?.papirsykmelding && <EndreSykmelding />}
            <LenkeTilDineSykmeldinger />
          </div>
        </div>
      </SideLaster>
    </Side>
  );
};

export default DinSykmeldingSide;
