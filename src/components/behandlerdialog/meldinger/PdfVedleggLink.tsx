import React from "react";
import { Link } from "@navikt/ds-react";
import styled from "styled-components";
import { ISBEHANDLERDIALOG_ROOT } from "@/apiConstants";

const StyledLink = styled(Link)`
  padding-right: 0.25em;
`;

interface PdfVedleggProps {
  meldingUuid: string;
  vedleggNumber: number;
}

const PdfVedleggLink = ({ meldingUuid, vedleggNumber }: PdfVedleggProps) => {
  const pdfUrl = `${ISBEHANDLERDIALOG_ROOT}/melding/${meldingUuid}/${vedleggNumber}/pdf`;
  const oneIndexedVedleggNumber = vedleggNumber + 1;
  return (
    <StyledLink href={pdfUrl} target="_blank" rel="noreferrer">
      Vedlegg {oneIndexedVedleggNumber}
    </StyledLink>
  );
};

export default PdfVedleggLink;
