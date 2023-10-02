import React from "react";
import { ShadowSpider } from "@/components/festive/spider/ShadowSpider";
import { RealSpider } from "@/components/festive/spider/RealSpider";

export interface SpiderProps {
  dropSpider: boolean;
  setDropSpider: (drop: boolean) => void;
}

export const Spider = ({ dropSpider, setDropSpider }: SpiderProps) => {
  return (
    <>
      <ShadowSpider dropSpider={dropSpider} setDropSpider={setDropSpider} />
      <RealSpider dropSpider={dropSpider} setDropSpider={setDropSpider} />
    </>
  );
};
