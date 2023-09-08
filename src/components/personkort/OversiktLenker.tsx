import { fullNaisUrlIntern } from "@/utils/miljoUtil";
import React, { ReactElement } from "react";
import styled from "styled-components";
import { Link } from "@navikt/ds-react";

const texts = {
  oversikt: "Min oversikt",
  moter: "Mine møter",
  enhetensOversikt: "Enhetens oversikt",
};

const StyledLenkeRad = styled.div`
  > * {
    &:not(:last-child) {
      margin-right: 2em;
    }
  }
`;

export const OversiktLenker = (): ReactElement => (
  <StyledLenkeRad>
    <Link href={fullNaisUrlIntern("syfooversikt", "/enhet")}>
      {texts.enhetensOversikt}
    </Link>
    <Link href={fullNaisUrlIntern("syfooversikt", "/minoversikt")}>
      {texts.oversikt}
    </Link>
    <Link href={fullNaisUrlIntern("syfomoteoversikt")}>{texts.moter}</Link>
  </StyledLenkeRad>
);
