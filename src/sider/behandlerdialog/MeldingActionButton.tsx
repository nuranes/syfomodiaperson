import styled from "styled-components";
import { Button, ButtonProps } from "@navikt/ds-react";
import React from "react";

const StyledButton = styled(Button)`
  align-self: flex-start;
`;

type MeldingActionButtonProps = Required<
  Pick<ButtonProps, "icon" | "onClick">
> &
  ButtonProps;

export const MeldingActionButton = ({
  children,
  ...rest
}: MeldingActionButtonProps) => {
  return <StyledButton {...rest}>{children}</StyledButton>;
};
