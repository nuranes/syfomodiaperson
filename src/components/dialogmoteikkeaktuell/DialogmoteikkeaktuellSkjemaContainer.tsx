import React from "react";
import Side from "@/sider/Side";
import SideLaster from "@/components/SideLaster";
import Sidetopp from "@/components/Sidetopp";
import * as Tredelt from "@/sider/TredeltSide";
import { MotehistorikkPanel } from "@/components/dialogmote/motehistorikk/MotehistorikkPanel";
import DialogmoteikkeaktuellSkjema from "@/components/dialogmoteikkeaktuell/DialogmoteikkeaktuellSkjema";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import { useDialogmoterQuery } from "@/data/dialogmote/dialogmoteQueryHooks";
import { useDialogmoteunntakQuery } from "@/data/dialogmotekandidat/dialogmoteunntakQueryHooks";
import { MalformProvider } from "@/context/malform/MalformContext";

const texts = {
  pageTitle: "Ikke aktuell",
};

const DialogmoteikkeaktuellSkjemaContainer = () => {
  const { historiskeDialogmoter } = useDialogmoterQuery();
  const { data: dialogmoteunntak } = useDialogmoteunntakQuery();

  return (
    <Side tittel={texts.pageTitle} aktivtMenypunkt={Menypunkter.DIALOGMOTE}>
      <SideLaster henter={false} hentingFeilet={false}>
        <Sidetopp tittel={texts.pageTitle} />
        <Tredelt.Container>
          <Tredelt.FirstColumn>
            <MalformProvider>
              <DialogmoteikkeaktuellSkjema />
            </MalformProvider>
          </Tredelt.FirstColumn>
          <Tredelt.SecondColumn>
            <MotehistorikkPanel
              historiskeMoter={historiskeDialogmoter}
              dialogmoteunntak={dialogmoteunntak}
            />
          </Tredelt.SecondColumn>
        </Tredelt.Container>
      </SideLaster>
    </Side>
  );
};

export default DialogmoteikkeaktuellSkjemaContainer;
