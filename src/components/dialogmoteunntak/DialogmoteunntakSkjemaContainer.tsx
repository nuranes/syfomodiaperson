import React from "react";
import Side from "@/sider/Side";
import { DIALOGMOTE } from "@/enums/menypunkter";
import SideLaster from "@/components/SideLaster";
import Sidetopp from "@/components/Sidetopp";
import DialogmoteunntakSkjema from "@/components/dialogmoteunntak/DialogmoteunntakSkjema";

const texts = {
  pageTitle: "Unntak fra dialogmøte",
};

const DialogmoteunntakSkjemaContainer = () => {
  return (
    <Side tittel={texts.pageTitle} aktivtMenypunkt={DIALOGMOTE}>
      <SideLaster henter={false} hentingFeilet={false}>
        <Sidetopp tittel={texts.pageTitle} />
        <DialogmoteunntakSkjema />
      </SideLaster>
    </Side>
  );
};

export default DialogmoteunntakSkjemaContainer;
