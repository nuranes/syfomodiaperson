import styled from "styled-components";

export const TredeltSide = styled.div`
  display: flex;
  flex-direction: row;

  @media (max-width: 1300px) {
    flex-direction: column;
    > * {
      margin-right: 0;
    }
  }

  > * {
    &:not(:last-child) {
      margin-right: 1rem;
    }

    @media (min-width: 1300px) {
      &:first-child {
        flex: 2 1 0;
      }

      &:last-child {
        flex: 1 1 0;
      }
    }
  }
`;
