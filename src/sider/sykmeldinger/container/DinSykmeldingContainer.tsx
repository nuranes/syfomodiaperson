import React, { ReactElement } from "react";
import {
  ArbeidssituasjonType,
  SykmeldingOldFormat,
  SykmeldingStatus,
} from "@/data/sykmelding/types/SykmeldingOldFormat";
import Side from "../../Side";
import SidetoppSpeilet from "../../../components/SidetoppSpeilet";
import SykmeldingSide from "../sykmelding/SykmeldingSide";
import SideLaster from "../../../components/SideLaster";
import { useSykmeldingerQuery } from "@/data/sykmelding/sykmeldingQueryHooks";
import LenkeTilDineSykmeldinger from "@/sider/sykmeldinger/sykmelding/LenkeTilDineSykmeldinger";
import EndreSykmelding from "@/components/endresykmelding/EndreSykmelding";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import { Panel } from "@navikt/ds-react";

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

  const { isLoading, isError, sykmeldinger, arbeidsgiverssykmeldinger } =
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

  return (
    <Side
      tittel={texts.pageTitleSykmelding}
      aktivtMenypunkt={Menypunkter.SYKMELDINGER}
    >
      <SideLaster henter={isLoading} hentingFeilet={isError}>
        <Panel>
          <SidetoppSpeilet tittel={pageTitle(dinSykmelding)} />
          <SykmeldingSide
            dinSykmelding={dinSykmelding}
            arbeidsgiversSykmelding={arbeidsgiversSykmelding}
          />
          {dinSykmelding?.papirsykmelding && <EndreSykmelding />}
          <LenkeTilDineSykmeldinger />
        </Panel>
      </SideLaster>
    </Side>
  );
};

export default DinSykmeldingSide;
