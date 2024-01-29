import React from "react";
import Side from "@/sider/Side";
import SideLaster from "@/components/SideLaster";
import Sidetopp from "@/components/Sidetopp";
import DialogmoteunntakSkjema from "@/components/dialogmoteunntak/DialogmoteunntakSkjema";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";

const texts = {
  pageTitle: "Unntak fra dialogmøte",
};

const DialogmoteunntakSkjemaContainer = () => {
  return (
    <Side tittel={texts.pageTitle} aktivtMenypunkt={Menypunkter.DIALOGMOTE}>
      <SideLaster henter={false} hentingFeilet={false}>
        <Sidetopp tittel={texts.pageTitle} />
        <DialogmoteunntakSkjema />
      </SideLaster>
    </Side>
  );
};

export default DialogmoteunntakSkjemaContainer;
