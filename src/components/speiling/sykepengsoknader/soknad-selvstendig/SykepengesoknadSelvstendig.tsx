import React, { ReactElement } from "react";
import Oppsummeringsvisning from "../soknad-felles-oppsummering/Oppsummeringsvisning";
import SoknadSpeiling from "../soknad-felles/SoknadSpeiling";
import IkkeInnsendtSoknad from "../soknad-felles/IkkeInnsendtSoknad";
import SendtSoknadSelvstendigStatuspanel from "./SendtSoknadSelvstendigStatuspanel";
import AvbruttSoknadSelvstendigStatuspanel from "./AvbruttSoknadSelvstendigStatuspanel";
import SykmeldingUtdragForSelvstendige from "./SykmeldingutdragForSelvstendige";
import {
  Soknadstatus,
  SykepengesoknadDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { Brodsmule } from "../../Brodsmuler";
import { erVaerKlarOverAt } from "@/utils/sykepengesoknadUtils";
import { SpeilingEkspanderbartPanel } from "@/components/speiling/ekspanderbar/SpeilingEkspanderbartPanel";

const texts = {
  oppsummering: "Oppsummering",
};

interface SykepengesoknadSelvstendigProps {
  brukernavn: string;
  soknad: SykepengesoknadDTO;
  brodsmuler: Brodsmule[];
  sykmelding?: SykmeldingOldFormat;
}

const SykepengesoknadSelvstendig = ({
  soknad,
  sykmelding,
  brodsmuler,
  brukernavn,
}: SykepengesoknadSelvstendigProps): ReactElement => {
  switch (soknad.status) {
    case Soknadstatus.NY:
    case Soknadstatus.FREMTIDIG: {
      return <IkkeInnsendtSoknad />;
    }
    case Soknadstatus.AVBRUTT: {
      return (
        <SoknadSpeiling brodsmuler={brodsmuler} brukernavn={brukernavn}>
          <AvbruttSoknadSelvstendigStatuspanel soknad={soknad} />
          {sykmelding?.sporsmal && (
            <SykmeldingUtdragForSelvstendige sykmelding={sykmelding} erApen />
          )}
        </SoknadSpeiling>
      );
    }
    default: {
      return (
        <SoknadSpeiling brodsmuler={brodsmuler} brukernavn={brukernavn}>
          <SendtSoknadSelvstendigStatuspanel soknad={soknad} />
          {sykmelding?.sporsmal && (
            <SykmeldingUtdragForSelvstendige sykmelding={sykmelding} erApen />
          )}
          <SpeilingEkspanderbartPanel tittel={texts.oppsummering} defaultOpen>
            <Oppsummeringsvisning
              soknad={{
                ...soknad,
                sporsmal: soknad.sporsmal.filter(
                  (sporsmal) => !erVaerKlarOverAt(sporsmal)
                ),
              }}
            />
          </SpeilingEkspanderbartPanel>
          <div className="panel">
            <Oppsummeringsvisning
              soknad={{
                ...soknad,
                sporsmal: soknad.sporsmal.filter((sporsmal) =>
                  erVaerKlarOverAt(sporsmal)
                ),
              }}
            />
          </div>
        </SoknadSpeiling>
      );
    }
  }
};

export default SykepengesoknadSelvstendig;
