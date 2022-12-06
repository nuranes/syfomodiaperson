import React, { ReactElement } from "react";
import Side from "@/sider/Side";
import { Menypunkter } from "@/navigation/menypunkterTypes";

const texts = {
  title: "Aktivitetskrav",
};

export const AktivitetskravContainer = (): ReactElement => {
  return (
    <Side tittel={texts.title} aktivtMenypunkt={Menypunkter.AKTIVITETSKRAV}>
      <></>
    </Side>
  );
};
