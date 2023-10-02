import React from "react";
import styled from "styled-components";

const RightLegGroup = styled.div`
  transform: rotateY(180deg);
`;

export const Leg = styled.div`
  background-color: #000;
  border-radius: 4px;
  height: 4px;
  position: absolute;
  transform-origin: center left;
  width: 30px;
`;

export const LegA = styled(Leg)`
  animation: A-anima 3s infinite ease-in-out;
  transform: rotate(75deg);
  @keyframes A-anima {
    0% {
      transform: rotate(75deg);
    }
    50% {
      transform: rotate(-70deg);
    }
  }

  &:nth-child(2) {
    animation-delay: -0.2s;
  }

  &:nth-child(3) {
    animation-delay: -0.5s;
  }

  &:nth-child(4) {
    animation-delay: -0.4s;
  }
`;

export const LegB = styled(Leg)`
  animation: B-anima 3s infinite ease-in-out;
  left: calc(100% - 2px);
  transform: rotate(10deg);
  @keyframes B-anima {
    0% {
      transform: rotate(10deg);
    }
    50% {
      transform: rotate(120deg);
    }
    80% {
      transform: rotate(20deg);
    }
  }
`;

export const LegC = styled(Leg)`
  animation: C-anima 3s infinite ease-in-out;
  left: calc(100% - 2px);
  transform: rotate(10deg);
  @keyframes C-anima {
    0% {
      transform: rotate(10deg);
    }
    50% {
      transform: rotate(90deg);
    }
    80% {
      transform: rotate(10deg);
    }
  }
`;

const Legs = () => {
  return (
    <>
      <LegA>
        <LegB>
          <LegC></LegC>
        </LegB>
      </LegA>
      <LegA>
        <LegB>
          <LegC></LegC>
        </LegB>
      </LegA>
      <LegA>
        <LegB>
          <LegC></LegC>
        </LegB>
      </LegA>
      <LegA>
        <LegB>
          <LegC></LegC>
        </LegB>
      </LegA>
    </>
  );
};

export const SpiderLegs = () => {
  return (
    <>
      <RightLegGroup>
        <Legs />
      </RightLegGroup>
      <div>
        <Legs />
      </div>
    </>
  );
};
