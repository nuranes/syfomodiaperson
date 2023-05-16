import React from "react";
import { Link, Loader } from "@navikt/ds-react";
import { useBehandlerdialogVedleggQuery } from "@/data/behandlerdialog/behandlerdialogQueryHooks";
import styled from "styled-components";

const createPdfBlob = (data: ArrayBuffer | undefined) => {
  return !!data
    ? new Blob([data], {
        type: "application/pdf",
      })
    : new Blob();
};

const StyledLink = styled(Link)`
  padding-right: 0.25em;
`;

interface PdfVedleggProps {
  meldingUuid: string;
  vedleggNumber: number;
  skalHenteVedlegg: boolean;
}

const PdfVedleggLink = ({
  meldingUuid,
  vedleggNumber,
  skalHenteVedlegg,
}: PdfVedleggProps) => {
  const { data, isFetching } = useBehandlerdialogVedleggQuery(
    meldingUuid,
    vedleggNumber,
    skalHenteVedlegg
  );

  const blob = createPdfBlob(data);
  const pdfUrl = data?.byteLength ? URL.createObjectURL(blob) : undefined;
  const oneIndexedVedleggNumber = vedleggNumber + 1;
  return (
    <>
      {isFetching ? (
        <Loader size="small" />
      ) : (
        <StyledLink href={pdfUrl} target="_blank" rel="noreferrer">
          Vedlegg {oneIndexedVedleggNumber}
        </StyledLink>
      )}
    </>
  );
};

export default PdfVedleggLink;
