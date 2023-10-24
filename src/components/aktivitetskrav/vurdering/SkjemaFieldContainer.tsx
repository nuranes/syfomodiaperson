import styled from "styled-components";
import { PaddingSize } from "@/components/Layout";

export const SkjemaFieldContainer = styled.div`
  > * {
    padding-bottom: ${PaddingSize.SM};

    &:last-child {
      padding-bottom: ${PaddingSize.MD};
    }
  }
`;
