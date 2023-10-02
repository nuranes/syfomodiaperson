import React from "react";
import styled from "styled-components";
import { SpiderProps } from "@/components/festive/spider/Spider";
import { SpiderLegs } from "@/components/festive/spider/SpiderLegs";

interface SpiderContainerProps {
  drop: boolean;
}

export const SpiderContainer = styled.div<SpiderContainerProps>`
  z-index: 9999;
  animation: ${(props) =>
    props.drop ? "drop 3s ease-out" : "spider-anima 8s ease-out"};
  animation-fill-mode: forwards;
  position: absolute;
  left: 50%;
  top: 80%;
  transform: translate(-50%, -50%);
  @keyframes spider-anima {
    0% {
      top: -150px;
    }
    100% {
      top: 80%;
    }
  }

  @keyframes drop {
    100% {
      transform: translateY(150vh);
      opacity: 0;
    }
  }
`;
export const SpiderEye = styled.div`
  background-color: #fff;
  height: 1px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
`;

const EyeRight = styled(SpiderEye)`
  right: 6px;
`;

const EyeLeft = styled(SpiderEye)`
  left: 6px;
`;

export const SpiderWeb = styled.div`
  z-index: 9998;
  animation: spider-web-anima 6s ease-out;
  animation-fill-mode: forwards;
  background-color: #000;
  border-radius: 4px;
  height: 0;
  left: 50%;
  position: absolute;
  transform: translateX(-50%);
  width: 2px;
  @keyframes spider-web-anima {
    0% {
      height: 0;
      bottom: 0;
    }
    100% {
      height: 100vh;
      bottom: 0;
    }
  }
`;

export const SpiderBody = styled.div`
  background-color: #000;
  border-radius: 50%;
  height: 20px;
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 20px;

  &:before {
    content: "";
    background-color: #000;
    border-radius: 50%;
    height: 15px;
    left: 2.5px;
    position: absolute;
    top: -5px;
    width: 15px;
    z-index: -99;
  }
`;

export const RealSpider = ({ dropSpider, setDropSpider }: SpiderProps) => {
  return (
    <SpiderContainer drop={dropSpider} onClick={() => setDropSpider(true)}>
      <SpiderWeb />
      <SpiderLegs />
      <SpiderBody>
        <EyeLeft />
        <EyeRight />
      </SpiderBody>
    </SpiderContainer>
  );
};
