import styled from "styled-components";
import Panel from "nav-frontend-paneler";
import navFarger from "nav-frontend-core";
import { FlexColumn } from "../../Layout";
import { ReactElement } from "react";
import React from "react";

const InfoPanel = styled(Panel)`
  background-color: ${navFarger.navGraBakgrunn};
  border: 1px solid ${navFarger.navMorkGra};
  margin-top: 1.9em;
`;

interface ReferatInfoColumnProps {
  children?: ReactElement[] | ReactElement;
}

export const ReferatInfoColumn = ({
  children,
}: ReferatInfoColumnProps): ReactElement => (
  <FlexColumn flex={0.5}>
    {children ? <InfoPanel>{children}</InfoPanel> : null}
  </FlexColumn>
);
