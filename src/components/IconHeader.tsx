import {
  FlexColumn,
  FlexRow,
  H2NoMargins,
  JustifyContentType,
  PaddingSize,
} from "@/components/Layout";
import React, { ReactNode } from "react";
import styled from "styled-components";

const Icon = styled.img`
  margin-right: 1em;
  width: 3em;
`;

interface IconHeaderProps {
  icon: string;
  altIcon: string;
  header: string;
  subtitle?: ReactNode;
}

export const IconHeader = ({
  icon,
  altIcon,
  header,
  subtitle,
}: IconHeaderProps) => {
  return (
    <FlexRow bottomPadding={PaddingSize.MD}>
      <Icon src={icon} alt={altIcon} />
      <FlexColumn justifyContent={JustifyContentType.CENTER}>
        <H2NoMargins>{header}</H2NoMargins>
        {typeof subtitle === "string" ? <p>{subtitle}</p> : subtitle}
      </FlexColumn>
    </FlexRow>
  );
};
