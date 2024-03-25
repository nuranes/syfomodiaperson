import React from "react";
import Feilmelding from "../../../components/Feilmelding";
import SykepengesoknadSelvstendig from "../soknad-selvstendig/SykepengesoknadSelvstendig";
import SykepengesoknadUtland from "../soknad-utland/SykepengesoknadUtland";
import SendtSoknadArbeidstakerNy from "../soknad-arbeidstaker-ny/SendtSoknadArbeidstakerNy";
import IkkeInnsendtSoknad from "../soknad-felles/IkkeInnsendtSoknad";
import AvbruttSoknadArbeidtakerNy from "../soknad-arbeidstaker-ny/AvbruttSoknadArbeidtakerNy";
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
import StatuspanelBehandlingsdager from "@/sider/sykepengsoknader/soknad-behandlingsdager/StatuspanelBehandlingsdager";
import { Box, Heading } from "@navikt/ds-react";
import Oppsummeringsvisning from "@/sider/sykepengsoknader/soknad-felles-oppsummering/Oppsummeringsvisning";
import TilbakeTilSoknader from "@/sider/sykepengsoknader/soknad-felles/TilbakeTilSoknader";

const texts = {
  tittel: "Sykepengesøknader",
  behandlingsdager: {
    sideTittel: "Søknad om sykepenger for enkeltstående behandlingsdager",
    oppsummering: "Oppsummering av søknaden",
  },
};

export function SykepengesoknadSide() {
  return (
    <Side tittel={texts.tittel} aktivtMenypunkt={Menypunkter.SYKEPENGESOKNADER}>
      <SykepengesoknadSideContent />
    </Side>
  );
}

export function SykepengesoknadSideContent() {
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

  return (
    <SideLaster henter={henter} hentingFeilet={hentingFeilet}>
      {(() => {
        switch (soknad?.soknadstype) {
          case Soknadstype.SELVSTENDIGE_OG_FRILANSERE:
          case Soknadstype.ARBEIDSLEDIG:
          case Soknadstype.ANNET_ARBEIDSFORHOLD: {
            return (
              <SykepengesoknadSelvstendig
                sykmelding={sykmelding}
                soknad={soknad}
              />
            );
          }
          case Soknadstype.OPPHOLD_UTLAND: {
            return <SykepengesoknadUtland soknad={soknad} />;
          }
          case Soknadstype.ARBEIDSTAKERE: {
            switch (soknad.status) {
              case Soknadstatus.SENDT:
              case Soknadstatus.KORRIGERT: {
                return <SendtSoknadArbeidstakerNy soknad={soknad} />;
              }
              case Soknadstatus.AVBRUTT: {
                return <AvbruttSoknadArbeidtakerNy soknad={soknad} />;
              }
              default: {
                return <IkkeInnsendtSoknad />;
              }
            }
          }
          case Soknadstype.BEHANDLINGSDAGER: {
            return (
              <div>
                <Heading level="1" size="large">
                  {texts.behandlingsdager.sideTittel}
                </Heading>
                <StatuspanelBehandlingsdager soknad={soknad} />
                <Box
                  background="surface-default"
                  padding={"4"}
                  className={"mb-4"}
                >
                  <Heading spacing size="small">
                    {texts.behandlingsdager.oppsummering}
                  </Heading>
                  <Oppsummeringsvisning soknad={soknad} />
                </Box>
                <TilbakeTilSoknader />
              </div>
            );
          }
          case Soknadstype.REISETILSKUDD: {
            return <SykepengesoknadReisetilskudd soknad={soknad} />;
          }
        }

        return <Feilmelding />;
      })()}
    </SideLaster>
  );
}
