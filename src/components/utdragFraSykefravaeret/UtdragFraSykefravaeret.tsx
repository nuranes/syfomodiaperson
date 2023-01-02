import React from "react";
import EtikettBase from "nav-frontend-etiketter";
import Lenke from "nav-frontend-lenker";
import SykmeldingMotebehovVisning from "../motebehov/SykmeldingMotebehovVisning";
import {
  arbeidsgivernavnEllerArbeidssituasjon,
  erEkstraInformasjonISykmeldingen,
  stringMedAlleGraderingerFraSykmeldingPerioder,
  sykmeldingerGruppertEtterVirksomhet,
  sykmeldingerInnenforOppfolgingstilfelle,
  sykmeldingerMedStatusSendt,
  sykmeldingerSortertNyestTilEldst,
  sykmeldingerUtenArbeidsgiver,
  sykmeldingperioderSortertEldstTilNyest,
} from "@/utils/sykmeldinger/sykmeldingUtils";
import { finnMiljoStreng } from "@/utils/miljoUtil";
import { tilLesbarPeriodeMedArstall } from "@/utils/datoUtils";
import { senesteTom, tidligsteFom } from "@/utils/periodeUtils";
import styled from "styled-components";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import {
  GultDokumentImage,
  MerInformasjonImage,
} from "../../../img/ImageComponents";
import { UtdragOppfolgingsplaner } from "./UtdragOppfolgingsplaner";
import { DialogmotePanel } from "../mote/components/DialogmotePanel";
import { OppfolgingsplanDTO } from "@/data/oppfolgingsplan/types/OppfolgingsplanDTO";
import { Undertittel } from "nav-frontend-typografi";
import { SpinnsynLenke } from "@/components/vedtak/SpinnsynLenke";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { useSykmeldingerQuery } from "@/data/sykmelding/sykmeldingQueryHooks";
import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import { useValgtPersonident } from "@/hooks/useValgtBruker";

const tekster = {
  header: "Utdrag fra sykefraværet",
  sykmeldinger: {
    header: "Sykmeldinger",
    headerUtenArbeidsgiver: "Sykmeldinger uten arbeidsgiver",
    papirLabelText: "Papir",
  },
  samtalereferat: {
    header: "Samtalereferat",
    lenkeTekst: "Samtalereferat",
  },
  vedtak: {
    header: "Vedtak",
  },
  apneSykmelding: "Åpne sykmelding",
};

interface UtvidbarTittelProps {
  sykmelding: SykmeldingOldFormat;
}

const UtdragColumn = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-start;
`;

export const UtvidbarTittel = ({ sykmelding }: UtvidbarTittelProps) => {
  const erViktigInformasjon = erEkstraInformasjonISykmeldingen(sykmelding);
  const sykmeldingPerioderSortertEtterDato =
    sykmeldingperioderSortertEldstTilNyest(
      sykmelding.mulighetForArbeid.perioder
    );
  return (
    <div className="utdragFraSykefravaeret__utvidbarTittel">
      <UtdragColumn>
        <span className="utvidbarTittel__periode">{`${tilLesbarPeriodeMedArstall(
          tidligsteFom(sykmelding.mulighetForArbeid.perioder),
          senesteTom(sykmelding.mulighetForArbeid.perioder)
        )}: `}</span>
        <span className="utvidbarTittel__grad">
          {stringMedAlleGraderingerFraSykmeldingPerioder(
            sykmeldingPerioderSortertEtterDato
          )}
        </span>

        {sykmelding.diagnose.hoveddiagnose && (
          <span className="utvidbarTittel__diagnose">
            {`${sykmelding.diagnose.hoveddiagnose.diagnosekode} (${sykmelding.diagnose.hoveddiagnose.diagnose})`}
          </span>
        )}
        {sykmelding.papirsykmelding && (
          <EtikettBase className="utvidbarTittel__etikett" type="info">
            {tekster.sykmeldinger.papirLabelText}
          </EtikettBase>
        )}
      </UtdragColumn>
      {erViktigInformasjon && (
        <div className="utvidbarTittel__erViktig">
          <img alt="Mer" src={MerInformasjonImage} />
        </div>
      )}
    </div>
  );
};

interface SykmeldingerForVirksomhetProps {
  sykmeldinger: SykmeldingOldFormat[];
}

export const SykmeldingerForVirksomhet = ({
  sykmeldinger,
}: SykmeldingerForVirksomhetProps) => {
  return (
    <div className="utdragFraSykefravaeret__sykmeldingerForVirksomhet">
      <h4>
        {arbeidsgivernavnEllerArbeidssituasjon(sykmeldinger[0]).toLowerCase()}
      </h4>
      {sykmeldinger.map((sykmelding, index) => {
        return (
          <div key={index}>
            <Ekspanderbartpanel
              tittel={<UtvidbarTittel sykmelding={sykmelding} />}
            >
              <SykmeldingMotebehovVisning sykmelding={sykmelding} />
            </Ekspanderbartpanel>
          </div>
        );
      })}
    </div>
  );
};

interface SykmeldingerProps {
  latestOppfolgingstilfelle?: OppfolgingstilfelleDTO;
  sykmeldinger: SykmeldingOldFormat[];
}

export const Sykmeldinger = ({
  latestOppfolgingstilfelle,
  sykmeldinger,
}: SykmeldingerProps) => {
  const innsendteSykmeldinger = sykmeldingerMedStatusSendt(sykmeldinger);
  const sykmeldingerIOppfolgingstilfellet =
    sykmeldingerInnenforOppfolgingstilfelle(
      innsendteSykmeldinger,
      latestOppfolgingstilfelle
    );
  const sykmeldingerSortertPaaUtstedelsesdato =
    sykmeldingerSortertNyestTilEldst(sykmeldingerIOppfolgingstilfellet);
  const sykmeldingerSortertPaaVirksomhet = sykmeldingerGruppertEtterVirksomhet(
    sykmeldingerSortertPaaUtstedelsesdato
  );
  return (
    <div className="utdragFraSykefravaeret__sykmeldinger">
      <Undertittel tag={"h3"}>{tekster.sykmeldinger.header}</Undertittel>
      {Object.keys(sykmeldingerSortertPaaVirksomhet).map((key, index) => (
        <SykmeldingerForVirksomhet
          key={index}
          sykmeldinger={sykmeldingerSortertPaaVirksomhet[key]}
        />
      ))}
    </div>
  );
};

interface SykmeldingerUtenArbeidsgiverProps {
  latestOppfolgingstilfelle?: OppfolgingstilfelleDTO;
  sykmeldinger: SykmeldingOldFormat[];
}

export const SykmeldingerUtenArbeidsgiver = ({
  latestOppfolgingstilfelle,
  sykmeldinger,
}: SykmeldingerUtenArbeidsgiverProps) => {
  const innsendteSykmeldinger = sykmeldingerUtenArbeidsgiver(sykmeldinger);
  const sykmeldingerIOppfolgingstilfellet =
    sykmeldingerInnenforOppfolgingstilfelle(
      innsendteSykmeldinger,
      latestOppfolgingstilfelle
    );
  const sykmeldingerSortertPaUtstedelsesdato = sykmeldingerSortertNyestTilEldst(
    sykmeldingerIOppfolgingstilfellet
  );
  return (
    <>
      {sykmeldingerSortertPaUtstedelsesdato?.length > 0 && (
        <div className="utdragFraSykefravaeret__sykmeldinger">
          <Undertittel tag={"h3"}>
            {tekster.sykmeldinger.headerUtenArbeidsgiver}
          </Undertittel>
          {sykmeldingerSortertPaUtstedelsesdato.length > 0 &&
            sykmeldingerSortertPaUtstedelsesdato.map((sykmelding, index) => {
              return (
                <div
                  className="utdragFraSykefravaeret__sykmeldingerForVirksomhet"
                  key={index}
                >
                  <Ekspanderbartpanel
                    tittel={<UtvidbarTittel sykmelding={sykmelding} />}
                  >
                    <SykmeldingMotebehovVisning sykmelding={sykmelding} />
                  </Ekspanderbartpanel>
                </div>
              );
            })}
        </div>
      )}
    </>
  );
};

const SamtalereferatWrapper = styled.div`
  margin-bottom: 2em;
`;

export const Samtalereferat = () => {
  const fnr = useValgtPersonident();
  return (
    <SamtalereferatWrapper>
      <Undertittel tag={"h3"}>{tekster.samtalereferat.header}</Undertittel>
      <Lenke
        className="lenke"
        href={`https://modapp${finnMiljoStreng()}.adeo.no/modiabrukerdialog/person/${fnr}#!meldinger`}
        target="_blank"
      >
        {tekster.samtalereferat.lenkeTekst}
      </Lenke>
    </SamtalereferatWrapper>
  );
};

interface UtdragFraSykefravaeretProps {
  aktivePlaner: OppfolgingsplanDTO[];
}

const UtdragFraSykefravaeret = ({
  aktivePlaner,
}: UtdragFraSykefravaeretProps) => {
  const { sykmeldinger } = useSykmeldingerQuery();
  const { latestOppfolgingstilfelle } = useOppfolgingstilfellePersonQuery();

  return (
    <DialogmotePanel icon={GultDokumentImage} header={tekster.header}>
      <div className="utdragFraSykefravaeret">
        <UtdragOppfolgingsplaner aktivePlaner={aktivePlaner} />

        <Sykmeldinger
          latestOppfolgingstilfelle={latestOppfolgingstilfelle}
          sykmeldinger={sykmeldinger}
        />

        <SykmeldingerUtenArbeidsgiver
          latestOppfolgingstilfelle={latestOppfolgingstilfelle}
          sykmeldinger={sykmeldinger}
        />

        <Samtalereferat />
        <Undertittel tag={"h3"}>{tekster.vedtak.header}</Undertittel>
        <SpinnsynLenke />
      </div>
    </DialogmotePanel>
  );
};

export default UtdragFraSykefravaeret;
