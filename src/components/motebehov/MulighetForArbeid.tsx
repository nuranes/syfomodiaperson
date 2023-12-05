import React from "react";
import {
  erMulighetForArbeidInformasjon,
  finnAvventendeSykmeldingTekst,
} from "@/utils/sykmeldinger/sykmeldingUtils";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { BodyShort, Heading } from "@navikt/ds-react";
import styled from "styled-components";
import {
  BriefcaseIcon,
  CheckmarkIcon,
  FirstAidKitIcon,
} from "@navikt/aksel-icons";

const tekster = {
  mulighetForArbeid: {
    avventende: {
      tittel: "Innspill til arbeidsgiveren ved avventende sykmelding",
    },
    beskrivelse: "Nærmere beskrivelse",
    medisinskAarsak: {
      tittel: "Det er medisinske årsaker som hindrer arbeidsrelatert aktivitet",
    },
    forholdPaaArbeidsplass: {
      tittel:
        "Forhold på arbeidsplassen vanskeliggjør arbeidsrelatert aktivitet",
    },
  },
};

interface AvventendeSykmeldingProps {
  avventendeTekst: string;
}

const AvventendeSykmelding = ({
  avventendeTekst,
}: AvventendeSykmeldingProps) => (
  <div>
    <h5 className="undertittel">
      {tekster.mulighetForArbeid.avventende.tittel}
    </h5>
    <p>{avventendeTekst}</p>
  </div>
);

const StyledSuccessStroke = styled(CheckmarkIcon)`
  margin-right: 0.2em;
  font-size: 1.5rem;
`;

interface AktivitetIkkeMuligProps {
  beskrivelse?: string;
  ikkeMuligListe: string[];
  ikkeMuligGrunn: IkkeMuligGrunn;
  tittel: string;
}

export enum IkkeMuligGrunn {
  MedisinskeArsaker,
  ForholdPaArbeidsplassen,
}

const Icon = ({ ikkeMuligGrunn }: { ikkeMuligGrunn: IkkeMuligGrunn }) => {
  switch (ikkeMuligGrunn) {
    case IkkeMuligGrunn.MedisinskeArsaker:
      return (
        <FirstAidKitIcon
          title="forstehjelpsutstyr-ikon"
          fontSize="1.5rem"
          className="mr-2"
        />
      );
    case IkkeMuligGrunn.ForholdPaArbeidsplassen:
      return (
        <BriefcaseIcon
          title="stresskoffert-ikon"
          fontSize="1.5rem"
          className="mr-2"
        />
      );
  }
};

const AktivitetIkkeMulig = ({
  beskrivelse,
  ikkeMuligListe,
  ikkeMuligGrunn,
  tittel,
}: AktivitetIkkeMuligProps) => (
  <div className="mt-4">
    <Heading size="xsmall" level="4" className="flex items-center">
      <Icon ikkeMuligGrunn={ikkeMuligGrunn} />
      {tittel}
    </Heading>

    {ikkeMuligListe.map((ikkeMuligTekst: string, index: number) => {
      return (
        <div key={index} className="flex items-center ml-8">
          <StyledSuccessStroke key={index} />
          {ikkeMuligTekst}
        </div>
      );
    })}
    {beskrivelse && (
      <div className="ml-8">
        <BodyShort size="small" className="!font-bold">
          {tekster.mulighetForArbeid.beskrivelse}
        </BodyShort>
        <BodyShort>{beskrivelse}</BodyShort>
      </div>
    )}
  </div>
);

interface MulighetForArbeidProps {
  sykmelding: SykmeldingOldFormat;
}

const MulighetForArbeid = ({ sykmelding }: MulighetForArbeidProps) => {
  const mulighetForArbeid = sykmelding.mulighetForArbeid;
  const avventendeTekst = finnAvventendeSykmeldingTekst(sykmelding);
  const aktivitetIkkeMulig433 = mulighetForArbeid.aktivitetIkkeMulig433;
  const aarsakAktivitetIkkeMulig433 =
    mulighetForArbeid.aarsakAktivitetIkkeMulig433;
  const aktivitetIkkeMulig434 = mulighetForArbeid.aktivitetIkkeMulig434;
  const aarsakAktivitetIkkeMulig434 =
    mulighetForArbeid.aarsakAktivitetIkkeMulig434;
  const skalVise = erMulighetForArbeidInformasjon(sykmelding);
  return (
    <>
      {" "}
      {(skalVise || !!avventendeTekst) && (
        <div className="sykmeldingMotebehovVisning__avsnitt">
          {!!avventendeTekst && (
            <AvventendeSykmelding avventendeTekst={avventendeTekst} />
          )}
          {aktivitetIkkeMulig433 && (
            <AktivitetIkkeMulig
              beskrivelse={aarsakAktivitetIkkeMulig433}
              ikkeMuligListe={aktivitetIkkeMulig433}
              ikkeMuligGrunn={IkkeMuligGrunn.MedisinskeArsaker}
              tittel={tekster.mulighetForArbeid.medisinskAarsak.tittel}
            />
          )}
          {aktivitetIkkeMulig434 && (
            <AktivitetIkkeMulig
              beskrivelse={aarsakAktivitetIkkeMulig434}
              ikkeMuligListe={aktivitetIkkeMulig434}
              ikkeMuligGrunn={IkkeMuligGrunn.ForholdPaArbeidsplassen}
              tittel={tekster.mulighetForArbeid.forholdPaaArbeidsplass.tittel}
            />
          )}
        </div>
      )}
    </>
  );
};

export default MulighetForArbeid;
