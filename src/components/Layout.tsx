import styled from "styled-components";

export enum JustifyContentType {
  CENTER = "center",
  FLEX_END = "flex-end",
  FLEX_START = "flex-start",
  SPACE_BETWEEN = "space-between",
}

interface FlexColumnProps {
  justifyContent?: JustifyContentType;
  flex?: number;
}

export const FlexColumn = styled.div<FlexColumnProps>`
  display: flex;
  flex-direction: column;
  justify-content: ${(props) =>
    props.justifyContent || JustifyContentType.FLEX_START};
  ${(props) =>
    props.flex && {
      flex: props.flex,
    }};
`;

export enum FlexGapSize {
  SM = "1em",
  MD = "2em",
  LG = "3em",
}

export enum PaddingSize {
  SM = "1em",
  MD = "2em",
  LG = "3em",
}

export interface RowProps {
  columnGap?: FlexGapSize;
  topPadding?: PaddingSize;
  bottomPadding?: PaddingSize;
  leftPadding?: PaddingSize;
  justifyContent?: JustifyContentType;
}

export const FlexRow = styled.div<RowProps>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  column-gap: ${(props) => props.columnGap || 0};
  padding-top: ${(props) => props.topPadding || 0};
  padding-bottom: ${(props) => props.bottomPadding || 0};
  padding-left: ${(props) => props.leftPadding || 0};
  justify-content: ${(props) =>
    props.justifyContent || JustifyContentType.FLEX_START};
`;

export const H2NoMargins = styled.h2`
  margin: 0;
`;

interface ButtonRowProps {
  topPadding?: PaddingSize;
  bottomPadding?: PaddingSize;
}

export const ButtonRow = styled.div<ButtonRowProps>`
  display: flex;
  justify-content: flex-start;
  flex-flow: row wrap;
  gap: 1em;
  padding-top: ${(props) => props.topPadding || 0};
  padding-bottom: ${(props) => props.bottomPadding || 0};
`;
