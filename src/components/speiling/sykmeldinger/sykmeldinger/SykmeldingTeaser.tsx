import React, { ReactElement, useState } from "react";
import { Link } from "react-router-dom";
import SykmeldingPeriodeInfo from "./SykmeldingPeriodeInfo";
import { tilLesbarPeriodeMedArstall } from "@/utils/datoUtils";
import { senesteTom, tidligsteFom } from "@/utils/periodeUtils";
import {
  ReportProblemTriangleImage,
  SykmeldingerHoverBlaaImage,
  SykmeldingerImage,
} from "../../../../../img/ImageComponents";
import {
  SykmeldingOldFormat,
  SykmeldingPeriodeDTO,
  SykmeldingStatus,
} from "@/data/sykmelding/types/SykmeldingOldFormat";
import { BehandlingsutfallStatusDTO } from "@/data/sykmelding/types/BehandlingsutfallStatusDTO";
import { PapirsykmeldingTag } from "@/components/PapirsykmeldingTag";
import { Heading, LinkPanel } from "@navikt/ds-react";
import styled from "styled-components";
import {
  FlexColumn,
  FlexGapSize,
  FlexRow,
  JustifyContentType,
} from "@/components/Layout";

const texts = {
  teaserTekst: "Sykmelding\n",
  egenmeldtTeaserTekst: "Egenmeldt sykmelding\n",
  sendt: "Sendt til arbeidsgiver\n",
  utgaatt: "Ikke brukt på nett\n",
  tilSending: "Sender...",
  avbrutt: "Avbrutt av deg\n",
  bekreftet: "Bekreftet av deg\n",
  avvist: "Avvist av NAV\n",
  papirLabelText: "Papir",
};

const textStatus = (
  status: SykmeldingStatus,
  behandlingsutfallStatus: BehandlingsutfallStatusDTO
) => {
  if (behandlingsutfallStatus === BehandlingsutfallStatusDTO.INVALID) {
    return texts.avvist;
  }
  switch (status) {
    case SykmeldingStatus.SENDT:
      return texts.sendt;
    case SykmeldingStatus.UTGAATT:
      return texts.utgaatt;
    case SykmeldingStatus.TIL_SENDING:
      return texts.tilSending;
    case SykmeldingStatus.AVBRUTT:
      return texts.avbrutt;
    case SykmeldingStatus.BEKREFTET:
      return texts.bekreftet;
    default:
      return "";
  }
};

interface PeriodeListeProps {
  perioder: SykmeldingPeriodeDTO[];
  arbeidsgiver?: string;
}

const PeriodeListe = ({ perioder, arbeidsgiver }: PeriodeListeProps) => {
  return (
    <ul className="teaser-punktliste js-perioder">
      {perioder.map((periode, index) => (
        <SykmeldingPeriodeInfo
          key={index}
          periode={periode}
          arbeidsgiver={arbeidsgiver}
          Element="li"
        />
      ))}
    </ul>
  );
};

const getIkon = (behandlingsutfallStatus: BehandlingsutfallStatusDTO) => {
  return behandlingsutfallStatus === BehandlingsutfallStatusDTO.INVALID
    ? ReportProblemTriangleImage
    : SykmeldingerImage;
};

const getHoverIkon = (behandlingsutfallStatus: BehandlingsutfallStatusDTO) => {
  return behandlingsutfallStatus === BehandlingsutfallStatusDTO.INVALID
    ? ReportProblemTriangleImage
    : SykmeldingerHoverBlaaImage;
};

interface SykmeldingTeaserProps {
  sykmelding: SykmeldingOldFormat;
}

const StyledImg = styled.img`
  margin-left: 1em;
`;

const StyledLinkPanel = styled(LinkPanel)`
  margin-bottom: 0.1em;
  .navds-link-panel__content {
    width: 100%;
  }
`;

const SykmeldingTeaser = ({
  sykmelding,
}: SykmeldingTeaserProps): ReactElement => {
  const behandlingsutfallStatus = sykmelding.behandlingsutfall.status;
  const [ikon, setIkon] = useState(getIkon(behandlingsutfallStatus));

  const visStatus =
    sykmelding.status !== SykmeldingStatus.NY ||
    behandlingsutfallStatus === BehandlingsutfallStatusDTO.INVALID;
  const showPapirLabel = !!sykmelding.papirsykmelding;

  return (
    <StyledLinkPanel
      forwardedAs={Link}
      to={`/sykefravaer/sykmeldinger/${sykmelding.id}`}
      border={false}
      onMouseEnter={() => {
        setIkon(getHoverIkon(behandlingsutfallStatus));
      }}
      onMouseLeave={() => {
        setIkon(getIkon(behandlingsutfallStatus));
      }}
    >
      <FlexRow
        columnGap={FlexGapSize.SM}
        justifyContent={JustifyContentType.SPACE_BETWEEN}
      >
        <FlexColumn flex={0}>
          <StyledImg src={ikon} alt="Plaster-ikon" />
        </FlexColumn>
        <FlexColumn flex={1}>
          {tilLesbarPeriodeMedArstall(
            tidligsteFom(sykmelding.mulighetForArbeid.perioder),
            senesteTom(sykmelding.mulighetForArbeid.perioder)
          )}
          <Heading size="small">
            {sykmelding.egenmeldt
              ? texts.egenmeldtTeaserTekst
              : texts.teaserTekst}
            {showPapirLabel && <PapirsykmeldingTag />}
          </Heading>
          <PeriodeListe
            perioder={sykmelding.mulighetForArbeid.perioder}
            arbeidsgiver={sykmelding.innsendtArbeidsgivernavn}
          />
        </FlexColumn>
        {visStatus && (
          <FlexColumn flex={0}>
            {textStatus(sykmelding.status, behandlingsutfallStatus)}
          </FlexColumn>
        )}
      </FlexRow>
    </StyledLinkPanel>
  );
};

export default SykmeldingTeaser;
