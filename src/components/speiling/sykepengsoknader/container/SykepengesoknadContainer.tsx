import React, { ReactElement } from "react";
import Feilmelding from "../../../Feilmelding";
import SykepengesoknadSelvstendig from "../soknad-selvstendig/SykepengesoknadSelvstendig";
import SykepengesoknadUtland from "../soknad-utland/SykepengesoknadUtland";
import SendtSoknadArbeidstakerNy from "../soknad-arbeidstaker-ny/SendtSoknadArbeidstakerNy";
import IkkeInnsendtSoknad from "../soknad-felles/IkkeInnsendtSoknad";
import AvbruttSoknadArbeidtakerNy from "../soknad-arbeidstaker-ny/AvbruttSoknadArbeidtakerNy";
import SykepengesoknadBehandlingsdager from "../soknad-behandlingsdager/SykepengesoknadBehandlingsdager";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { useParams } from "react-router-dom";
import SideLaster from "../../../SideLaster";
import {
  SoknadstatusDTO,
  SoknadstypeDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import SykepengesoknadReisetilskudd from "@/components/speiling/sykepengsoknader/soknad-reisetilskudd/SykepengesoknadReisetilskudd";
import { useSykepengesoknaderQuery } from "@/data/sykepengesoknad/sykepengesoknadQueryHooks";
import { useSykmeldingerQuery } from "@/data/sykmelding/sykmeldingQueryHooks";

const SykepengesoknadContainer = (): ReactElement => {
  const { navn: brukernavn } = useNavBrukerData();
  const { sykepengesoknadId } = useParams<{
    sykepengesoknadId: string;
  }>();

  const {
    data: sykepengesoknader,
    isError: hentingFeiletSoknader,
    isInitialLoading: henterSoknader,
  } = useSykepengesoknaderQuery();
  const {
    sykmeldinger,
    isError: hentingSykmeldingerFeilet,
    isInitialLoading: henterSykmeldinger,
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
          case SoknadstypeDTO.SELVSTENDIGE_OG_FRILANSERE:
          case SoknadstypeDTO.ARBEIDSLEDIG:
          case SoknadstypeDTO.ANNET_ARBEIDSFORHOLD: {
            return (
              <SykepengesoknadSelvstendig
                brodsmuler={brodsmuler}
                brukernavn={brukernavn}
                sykmelding={sykmelding}
                soknad={soknad}
              />
            );
          }
          case SoknadstypeDTO.OPPHOLD_UTLAND: {
            return (
              <SykepengesoknadUtland
                brodsmuler={brodsmuler}
                brukernavn={brukernavn}
                soknad={soknad}
              />
            );
          }
          case SoknadstypeDTO.ARBEIDSTAKERE: {
            switch (soknad.status) {
              case SoknadstatusDTO.SENDT:
              case SoknadstatusDTO.KORRIGERT: {
                return (
                  <SendtSoknadArbeidstakerNy
                    brodsmuler={brodsmuler}
                    brukernavn={brukernavn}
                    soknad={soknad}
                  />
                );
              }
              case SoknadstatusDTO.AVBRUTT: {
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
          case SoknadstypeDTO.BEHANDLINGSDAGER: {
            return (
              <SykepengesoknadBehandlingsdager
                brodsmuler={brodsmuler}
                brukernavn={brukernavn}
                soknad={soknad}
              />
            );
          }
          case SoknadstypeDTO.REISETILSKUDD: {
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
};

export default SykepengesoknadContainer;
