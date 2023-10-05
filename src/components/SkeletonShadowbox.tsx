import styled from "styled-components";

export const SkeletonShadowbox = styled.div`
  --tw-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.15),
    0px 0px 1px 0px rgba(0, 0, 0, 0.2);
  --tw-shadow-colored: 0px 1px 3px 0px var(--tw-shadow-color),
    0px 0px 1px 0px var(--tw-shadow-color);
  --tw-ring-offset-shadow: 0 0 #0000;
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
    var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  border-radius: 3px;
  width: auto;
  padding: 1em;
`;
