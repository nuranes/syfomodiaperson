import React from "react";
import Feilmelding from "../../../components/Feilmelding";
import SykepengesoknadSelvstendig from "../soknad-selvstendig/SykepengesoknadSelvstendig";
import SykepengesoknadUtland from "../soknad-utland/SykepengesoknadUtland";
import SendtSoknadArbeidstakerNy from "../soknad-arbeidstaker-ny/SendtSoknadArbeidstakerNy";
import IkkeInnsendtSoknad from "../soknad-felles/IkkeInnsendtSoknad";
import AvbruttSoknadArbeidtakerNy from "../soknad-arbeidstaker-ny/AvbruttSoknadArbeidtakerNy";
import SykepengesoknadBehandlingsdager from "../soknad-behandlingsdager/SykepengesoknadBehandlingsdager";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { useParams } from "react-router-dom";
import SideLaster from "../../../components/SideLaster";
import {
  Soknadstatus,
  Soknadstype,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import SykepengesoknadReisetilskudd from "@/sider/sykepengsoknader/soknad-reisetilskudd/SykepengesoknadReisetilskudd";
import { useSykepengesoknaderQuery } from "@/data/sykepengesoknad/sykepengesoknadQueryHooks";
import { useSykmeldingerQuery } from "@/data/sykmelding/sykmeldingQueryHooks";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import Side from "@/sider/Side";

const texts = {
  tittel: "Sykepengesøknader",
};

export function SykepengesoknadSide() {
  return (
    <Side tittel={texts.tittel} aktivtMenypunkt={Menypunkter.SYKEPENGESOKNADER}>
      <SykepengesoknadSideContent />
    </Side>
  );
}

export function SykepengesoknadSideContent() {
  const { navn: brukernavn } = useNavBrukerData();
  const { sykepengesoknadId } = useParams<{
    sykepengesoknadId: string;
  }>();

  const {
    data: sykepengesoknader,
    isError: hentingFeiletSoknader,
    isLoading: henterSoknader,
  } = useSykepengesoknaderQuery();
  const {
    sykmeldinger,
    isError: hentingSykmeldingerFeilet,
    isLoading: henterSykmeldinger,
  } = useSykmeldingerQuery();

  const henter = henterSykmeldinger || henterSoknader;
  const hentingFeilet = hentingFeiletSoknader || hentingSykmeldingerFeilet;
  const soknad = sykepengesoknader.find((s) => s.id === sykepengesoknadId);
  const sykmelding = sykmeldinger.find((sykmld) =>
    soknad ? sykmld.id === soknad.sykmeldingId : false
  );

  const brodsmuler = [
    {
      tittel: "Ditt sykefravær",
    },
    {
      tittel: "Søknad om sykepenger",
    },
  ];

  return (
    <SideLaster henter={henter} hentingFeilet={hentingFeilet}>
      {(() => {
        switch (soknad?.soknadstype) {
          case Soknadstype.SELVSTENDIGE_OG_FRILANSERE:
          case Soknadstype.ARBEIDSLEDIG:
          case Soknadstype.ANNET_ARBEIDSFORHOLD: {
            return (
              <SykepengesoknadSelvstendig
                brodsmuler={brodsmuler}
                brukernavn={brukernavn}
                sykmelding={sykmelding}
                soknad={soknad}
              />
            );
          }
          case Soknadstype.OPPHOLD_UTLAND: {
            return (
              <SykepengesoknadUtland
                brodsmuler={brodsmuler}
                brukernavn={brukernavn}
                soknad={soknad}
              />
            );
          }
          case Soknadstype.ARBEIDSTAKERE: {
            switch (soknad.status) {
              case Soknadstatus.SENDT:
              case Soknadstatus.KORRIGERT: {
                return (
                  <SendtSoknadArbeidstakerNy
                    brodsmuler={brodsmuler}
                    brukernavn={brukernavn}
                    soknad={soknad}
                  />
                );
              }
              case Soknadstatus.AVBRUTT: {
                return (
                  <AvbruttSoknadArbeidtakerNy
                    brodsmuler={brodsmuler}
                    brukernavn={brukernavn}
                    soknad={soknad}
                  />
                );
              }
              default: {
                return <IkkeInnsendtSoknad />;
              }
            }
          }
          case Soknadstype.BEHANDLINGSDAGER: {
            return (
              <SykepengesoknadBehandlingsdager
                brodsmuler={brodsmuler}
                brukernavn={brukernavn}
                soknad={soknad}
              />
            );
          }
          case Soknadstype.REISETILSKUDD: {
            return (
              <SykepengesoknadReisetilskudd
                brodsmuler={brodsmuler}
                brukernavn={brukernavn}
                soknad={soknad}
              />
            );
          }
        }

        return <Feilmelding />;
      })()}
    </SideLaster>
  );
}
