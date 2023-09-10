import React from "react";
import { Link } from "@navikt/ds-react";
import styled from "styled-components";
import { ISBEHANDLERDIALOG_ROOT } from "@/apiConstants";
import { MeldingDTO } from "@/data/behandlerdialog/behandlerdialogTypes";

const StyledLink = styled(Link)`
  padding-right: 0.25em;
`;

interface PdfVedleggProps {
  melding: MeldingDTO;
  vedleggNumber: number;
}

const getVedleggLinkText = (
  melding: MeldingDTO,
  vedleggNumber: number
): string => {
  if (melding.isFirstVedleggLegeerklaring) {
    return vedleggNumber === 0 ? "Legeerklæring" : `Vedlegg ${vedleggNumber}`;
  } else {
    return `Vedlegg ${vedleggNumber + 1}`;
  }
};

const PdfVedleggLink = ({ melding, vedleggNumber }: PdfVedleggProps) => {
  const pdfUrl = `${ISBEHANDLERDIALOG_ROOT}/melding/${melding.uuid}/${vedleggNumber}/pdf`;
  const vedleggLinkText = getVedleggLinkText(melding, vedleggNumber);
  return (
    <StyledLink href={pdfUrl} target="_blank" rel="noreferrer">
      {vedleggLinkText}
    </StyledLink>
  );
};

export default PdfVedleggLink;
