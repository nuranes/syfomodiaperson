import * as React from "react";
import { Column } from "nav-frontend-grid";
import styled from "styled-components";
import { navGra60 } from "../../colors";

const StyledColumn = styled(Column)`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const StyledIcon = styled.img`
  width: 5em;
  margin-top: 5em;
  align-self: center;
`;

const StyledCenteredText = styled.h3`
  text-align: center;
  font-weight: normal;
  color: ${navGra60};
`;

interface Props {
  title: string;
  icon: string;
}

const VedtakInfoBox = ({ title, icon }: Props) => {
  return (
    <StyledColumn className="col-xs-12">
      <StyledIcon src={icon} alt="Informasjon om vedtak" />
      <StyledCenteredText>{title}</StyledCenteredText>
    </StyledColumn>
  );
};

export default VedtakInfoBox;
