import React from "react";
import SykmeldingUtdragFraSykefravaretVisning from "../motebehov/SykmeldingUtdragFraSykefravaretVisning";
import {
  arbeidsgivernavnEllerArbeidssituasjon,
  erEkstraInformasjonISykmeldingen,
  stringMedAlleGraderingerFraSykmeldingPerioder,
  sykmeldingerGruppertEtterVirksomhet,
  sykmeldingerInnenforOppfolgingstilfelle,
  sykmeldingerSortertNyestTilEldstPeriode,
  sykmeldingerUtenArbeidsgiver,
  sykmeldingperioderSortertEldstTilNyest,
} from "@/utils/sykmeldinger/sykmeldingUtils";
import { finnMiljoStreng } from "@/utils/miljoUtil";
import { tilLesbarPeriodeMedArstall } from "@/utils/datoUtils";
import { senesteTom, tidligsteFom } from "@/utils/periodeUtils";
import styled from "styled-components";
import {
  SykmeldingOldFormat,
  SykmeldingStatus,
} from "@/data/sykmelding/types/SykmeldingOldFormat";
import { MerInformasjonImage } from "../../../img/ImageComponents";
import { UtdragOppfolgingsplaner } from "./UtdragOppfolgingsplaner";
import { SpinnsynLenke } from "@/components/vedtak/SpinnsynLenke";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { useSykmeldingerQuery } from "@/data/sykmelding/sykmeldingQueryHooks";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { PapirsykmeldingTag } from "@/components/PapirsykmeldingTag";
import { ExpansionCard, Heading, Link, Panel, Tag } from "@navikt/ds-react";
import * as Amplitude from "@/utils/amplitude";
import { EventType } from "@/utils/amplitude";

const texts = {
  header: "Utdrag fra sykefraværet",
  sykmeldinger: {
    header: "Sykmeldinger",
    headerUtenArbeidsgiver: "Sykmeldinger uten arbeidsgiver",
    ny: "Ikke tatt i bruk",
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

const StyledExpantionCardHeader = styled(ExpansionCard.Header)`
  .navds-expansioncard__header-content {
    width: 100%;
  }
`;

const Info = ({ label, text }: { label: string; text: string }) => {
  return (
    <div className="text-base font-normal">
      <b>{label}</b>
      <span>{text}</span>
    </div>
  );
};

interface UtvidbarTittelProps {
  sykmelding: SykmeldingOldFormat;
}

export const SykmeldingTittelbeskrivelse = ({
  sykmelding,
}: UtvidbarTittelProps) => {
  const sykmeldingPerioderSortertEtterDato =
    sykmeldingperioderSortertEldstTilNyest(
      sykmelding.mulighetForArbeid.perioder
    );

  const periode = `${tilLesbarPeriodeMedArstall(
    tidligsteFom(sykmelding.mulighetForArbeid.perioder),
    senesteTom(sykmelding.mulighetForArbeid.perioder)
  )}: `;
  const graderinger = stringMedAlleGraderingerFraSykmeldingPerioder(
    sykmeldingPerioderSortertEtterDato
  );
  const diagnose = `${sykmelding.diagnose.hoveddiagnose?.diagnosekode} (${sykmelding.diagnose.hoveddiagnose?.diagnose})`;
  const erViktigInformasjon = erEkstraInformasjonISykmeldingen(sykmelding);
  const sykmelder = sykmelding.bekreftelse.sykmelder;
  const arbeidsgiver = arbeidsgivernavnEllerArbeidssituasjon(sykmelding);
  const erIkkeTattIBruk = sykmelding.status === SykmeldingStatus.NY;

  return (
    <div className="w-full flex flex-col">
      <div className="flex justify-between mb-2">
        <div>
          {periode}
          {graderinger}
        </div>
        <div className="flex gap-4">
          {erIkkeTattIBruk && (
            <Tag variant="warning" size="small">
              {texts.sykmeldinger.ny}
            </Tag>
          )}
          {erViktigInformasjon && (
            <img
              height={18}
              alt="Viktig informasjon"
              src={MerInformasjonImage}
            />
          )}
        </div>
      </div>
      {sykmelding.diagnose.hoveddiagnose && (
        <Info label={"Diagnose: "} text={diagnose} />
      )}
      {sykmelder && <Info label={"Sykmelder: "} text={sykmelder} />}
      {arbeidsgiver && <Info label={"Arbeidsgiver: "} text={arbeidsgiver} />}
      {sykmelding.yrkesbetegnelse && (
        <Info
          label={"Stilling fra sykmelding: "}
          text={sykmelding.yrkesbetegnelse}
        />
      )}
      {sykmelding.papirsykmelding && <PapirsykmeldingTag />}
    </div>
  );
};

interface UtvidbarSykmeldingProps {
  sykmelding: SykmeldingOldFormat;
  label?: string;
}

function logAccordionOpened(isOpen: boolean) {
  if (isOpen) {
    Amplitude.logEvent({
      type: EventType.AccordionOpen,
      data: {
        tekst: `Åpne sykmeldinger accordion`,
        url: window.location.href,
      },
    });
  }
}

const UtvidbarSykmelding = ({ sykmelding, label }: UtvidbarSykmeldingProps) => {
  const title = label ? label : "Sykmelding uten arbeidsgiver";
  return (
    <ExpansionCard aria-label={title} onToggle={logAccordionOpened}>
      <StyledExpantionCardHeader className="w-full">
        <ExpansionCard.Title
          as="div"
          className="flex justify-between m-0 text-base"
        >
          <SykmeldingTittelbeskrivelse sykmelding={sykmelding} />
        </ExpansionCard.Title>
      </StyledExpantionCardHeader>
      <ExpansionCard.Content>
        <SykmeldingUtdragFraSykefravaretVisning sykmelding={sykmelding} />
      </ExpansionCard.Content>
    </ExpansionCard>
  );
};

export const SykmeldingerForVirksomhet = () => {
  const { sykmeldinger } = useSykmeldingerQuery();
  const { latestOppfolgingstilfelle } = useOppfolgingstilfellePersonQuery();
  const aktuelleSykmeldinger = sykmeldinger.filter(
    (sykmelding) =>
      sykmelding.status === SykmeldingStatus.SENDT ||
      sykmelding.status === SykmeldingStatus.NY
  );
  const sykmeldingerIOppfolgingstilfellet =
    sykmeldingerInnenforOppfolgingstilfelle(
      aktuelleSykmeldinger,
      latestOppfolgingstilfelle
    );
  const sykmeldingerSortertPaaStartDato =
    sykmeldingerSortertNyestTilEldstPeriode(sykmeldingerIOppfolgingstilfellet);
  const sykmeldingerSortertPaaVirksomhet = sykmeldingerGruppertEtterVirksomhet(
    sykmeldingerSortertPaaStartDato
  );

  return (
    <div className="mb-10 [&>*]:mb-2">
      <Heading size="small" level="3">
        {texts.sykmeldinger.header}
      </Heading>
      {Object.keys(sykmeldingerSortertPaaVirksomhet).map((key) => {
        return sykmeldingerSortertPaaVirksomhet[key].map(
          (sykmelding, index) => {
            const arbeidsgiverEllerSituasjon =
              arbeidsgivernavnEllerArbeidssituasjon(sykmelding);
            return (
              <UtvidbarSykmelding
                sykmelding={sykmelding}
                label={arbeidsgiverEllerSituasjon}
                key={index}
              />
            );
          }
        );
      })}
    </div>
  );
};

interface SykmeldingerUtenArbeidsgiverProps {
  sykmeldingerSortertPaUtstedelsesdato: SykmeldingOldFormat[];
}

export const SykmeldingerUtenArbeidsgiver = ({
  sykmeldingerSortertPaUtstedelsesdato,
}: SykmeldingerUtenArbeidsgiverProps) => {
  return (
    <div className="mb-10 [&>*]:mb-2">
      <Heading size="small" level="3">
        {texts.sykmeldinger.headerUtenArbeidsgiver}
      </Heading>
      {sykmeldingerSortertPaUtstedelsesdato.map((sykmelding, index) => {
        return <UtvidbarSykmelding sykmelding={sykmelding} key={index} />;
      })}
    </div>
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
        {texts.samtalereferat.header}
      </Heading>
      <Link
        href={`https://modapp${finnMiljoStreng()}.adeo.no/modiabrukerdialog/person/${fnr}#!meldinger`}
        target="_blank"
      >
        {texts.samtalereferat.lenkeTekst}
      </Link>
    </SamtalereferatWrapper>
  );
};

const UtdragFraSykefravaeret = () => {
  const { sykmeldinger } = useSykmeldingerQuery();
  const { latestOppfolgingstilfelle } = useOppfolgingstilfellePersonQuery();

  const innsendteSykmeldingerUtenArbeidsgiver =
    sykmeldingerUtenArbeidsgiver(sykmeldinger);
  const sykmeldingerIOppfolgingstilfellet =
    sykmeldingerInnenforOppfolgingstilfelle(
      innsendteSykmeldingerUtenArbeidsgiver,
      latestOppfolgingstilfelle
    );
  const sykmeldingerSortertPaSykmeldingsperiode =
    sykmeldingerSortertNyestTilEldstPeriode(sykmeldingerIOppfolgingstilfellet);

  return (
    <Panel className="mb-4 h-min">
      <Heading level="2" size="medium" className="mb-4">
        {texts.header}
      </Heading>
      <UtdragOppfolgingsplaner />
      <SykmeldingerForVirksomhet />
      {sykmeldingerSortertPaSykmeldingsperiode?.length > 0 && (
        <SykmeldingerUtenArbeidsgiver
          sykmeldingerSortertPaUtstedelsesdato={
            sykmeldingerSortertPaSykmeldingsperiode
          }
        />
      )}
      <Samtalereferat />
      <Heading size="small" level="3">
        {texts.vedtak.header}
      </Heading>
      <SpinnsynLenke />
    </Panel>
  );
};

export default UtdragFraSykefravaeret;
