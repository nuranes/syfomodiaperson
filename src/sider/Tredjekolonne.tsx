import React, { ReactElement } from "react";
import { TREDELING_BREAKING_POINT } from "@/sider/TredeltSide";

interface TredjekolonneProps {
  heightStyling: string;
  screenWidth: number;
  children: ReactElement;
}

export const Tredjekolonne = ({
  heightStyling,
  screenWidth,
  children,
}: TredjekolonneProps) => {
  return (
    <div
      style={
        screenWidth > TREDELING_BREAKING_POINT
          ? {
              height: heightStyling,
              overflowY: "scroll",
            }
          : { overflowY: "unset" }
      }
    >
      {children}
    </div>
  );
};
