import React from "react";
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
import { SpinnsynLenke } from "@/components/vedtak/SpinnsynLenke";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { useSykmeldingerQuery } from "@/data/sykmelding/sykmeldingQueryHooks";
import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { IconHeader } from "@/components/IconHeader";
import { PapirsykmeldingTag } from "@/components/PapirsykmeldingTag";
import { Heading, Link } from "@navikt/ds-react";

const tekster = {
  header: "Utdrag fra sykefraværet",
  sykmeldinger: {
    header: "Sykmeldinger",
    headerUtenArbeidsgiver: "Sykmeldinger uten arbeidsgiver",
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

const StyledDiv = styled.div`
  margin-bottom: 2.5em;
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
        {sykmelding.papirsykmelding && <PapirsykmeldingTag />}
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
    <StyledDiv>
      <Heading size="small" level="3">
        {tekster.sykmeldinger.header}
      </Heading>
      {Object.keys(sykmeldingerSortertPaaVirksomhet).map((key, index) => (
        <SykmeldingerForVirksomhet
          key={index}
          sykmeldinger={sykmeldingerSortertPaaVirksomhet[key]}
        />
      ))}
    </StyledDiv>
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
        <StyledDiv>
          <Heading size="small" level="3">
            {tekster.sykmeldinger.headerUtenArbeidsgiver}
          </Heading>
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
        </StyledDiv>
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
      <Heading size="small" level="3">
        {tekster.samtalereferat.header}
      </Heading>
      <Link
        href={`https://modapp${finnMiljoStreng()}.adeo.no/modiabrukerdialog/person/${fnr}#!meldinger`}
        target="_blank"
      >
        {tekster.samtalereferat.lenkeTekst}
      </Link>
    </SamtalereferatWrapper>
  );
};

const UtdragFraSykefravaeret = () => {
  const { sykmeldinger } = useSykmeldingerQuery();
  const { latestOppfolgingstilfelle } = useOppfolgingstilfellePersonQuery();

  return (
    <>
      <IconHeader
        icon={GultDokumentImage}
        altIcon="Gult dokument"
        header={tekster.header}
      />
      <div className="utdragFraSykefravaeret">
        <UtdragOppfolgingsplaner />

        <Sykmeldinger
          latestOppfolgingstilfelle={latestOppfolgingstilfelle}
          sykmeldinger={sykmeldinger}
        />

        <SykmeldingerUtenArbeidsgiver
          latestOppfolgingstilfelle={latestOppfolgingstilfelle}
          sykmeldinger={sykmeldinger}
        />

        <Samtalereferat />
        <Heading size="small" level="3">
          {tekster.vedtak.header}
        </Heading>
        <SpinnsynLenke />
      </div>
    </>
  );
};

export default UtdragFraSykefravaeret;
