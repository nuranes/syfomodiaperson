import React from "react";
import styled from "styled-components";
import {
  SpiderBody,
  SpiderContainer,
  SpiderWeb,
} from "@/components/festive/spider/RealSpider";
import { SpiderProps } from "@/components/festive/spider/Spider";
import { SpiderLegs } from "@/components/festive/spider/SpiderLegs";

const ShadowSpiderWeb = styled(SpiderWeb)`
  left: calc(50% + 5px);
  background-color: rgba(45, 45, 45, 0.5);
`;

const ShadowSpiderContainer = styled(SpiderContainer)`
  left: calc(50% + 5px);
  background-color: rgba(45, 45, 45, 0.5);

  div * {
    background-color: rgba(45, 45, 45, 0.5);
  }
`;

const ShadowSpiderBody = styled(SpiderBody)`
  background-color: rgba(45, 45, 45, 0.5);
  &:before {
    background-color: rgba(45, 45, 45, 0.5);
  }
`;

export const ShadowSpider = ({ dropSpider, setDropSpider }: SpiderProps) => {
  return (
    <ShadowSpiderContainer
      drop={dropSpider}
      onClick={() => setDropSpider(true)}
    >
      <ShadowSpiderWeb />
      <SpiderLegs />
      <ShadowSpiderBody />
    </ShadowSpiderContainer>
  );
};
