import styled from "styled-components";

export const TredeltSide = styled.div`
  display: flex;
  flex-direction: row;

  @media (max-width: 1300px) {
    flex-direction: column;
    overflow-y: scroll;
    > * {
      margin-right: 0;
    }
  }

  > * {
    &:not(:last-child) {
      margin-right: 0.5rem;
    }

    @media (min-width: 1300px) {
      &:first-child {
        flex: 3 1 0;
      }

      &:last-child {
        flex: 2 1 0;
      }
    }
  }
`;

export const TREDELING_BREAKING_POINT = 1300;
