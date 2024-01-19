import React from "react";
import Sidetopp from "../../../components/Sidetopp";
import UtdragFraSykefravaeretPanel from "../../../components/utdragFraSykefravaeret/UtdragFraSykefravaeret";
import { InnkallingDialogmotePanel } from "./innkalling/InnkallingDialogmotePanel";
import SideLaster from "../../../components/SideLaster";
import { DialogmoteOnskePanel } from "../../../components/motebehov/DialogmoteOnskePanel";
import { MotehistorikkPanel } from "../../../components/dialogmote/motehistorikk/MotehistorikkPanel";
import { useDialogmoterQuery } from "@/data/dialogmote/dialogmoteQueryHooks";
import { useOppfolgingsplanerQuery } from "@/data/oppfolgingsplan/oppfolgingsplanQueryHooks";
import { useMotebehovQuery } from "@/data/motebehov/motebehovQueryHooks";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import { DialogmoteFerdigstilteReferatPanel } from "@/components/dialogmote/DialogmoteFerdigstilteReferatPanel";
import { DialogmoteStatus } from "@/data/dialogmote/types/dialogmoteTypes";
import { useDialogmoteunntakQuery } from "@/data/dialogmotekandidat/dialogmoteunntakQueryHooks";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import * as Tredelt from "@/sider/TredeltSide";

const texts = {
  dialogmoter: "Dialogmøter",
};

export const Motelandingsside = () => {
  const { isLoading: henterOppfolgingsplaner } = useOppfolgingsplanerQuery();
  const {
    isLoading: henterDialogmoter,
    isError: henterDialogmoterFeilet,
    aktivtDialogmote,
    historiskeDialogmoter,
  } = useDialogmoterQuery();
  const {
    data: dialogmoteunntak,
    isError: henterDialogmoteunntakFeilet,
    isLoading: henterDialogmoteunntak,
  } = useDialogmoteunntakQuery();
  const {
    data: motebehov,
    isError: henterMotebehovFeilet,
    isLoading: henterMotebehov,
  } = useMotebehovQuery();
  const {
    currentLedere,
    isLoading: henterLedere,
    isError: henterLedereFeilet,
  } = useLedereQuery();
  const navbruker = useNavBrukerData();

  const henter =
    henterDialogmoter ||
    henterDialogmoteunntak ||
    henterOppfolgingsplaner ||
    henterMotebehov ||
    henterLedere;
  const hentingFeilet =
    henterLedereFeilet ||
    henterMotebehovFeilet ||
    henterDialogmoterFeilet ||
    henterDialogmoteunntakFeilet;

  const isMotehistorikkVisible =
    historiskeDialogmoter.length > 0 || dialogmoteunntak.length > 0;

  return (
    <SideLaster henter={henter} hentingFeilet={hentingFeilet}>
      <Sidetopp tittel={texts.dialogmoter} />

      <Tredelt.Container>
        <Tredelt.FirstColumn>
          <DialogmoteOnskePanel
            motebehovData={motebehov}
            ledereData={currentLedere}
            sykmeldt={navbruker}
          />

          <InnkallingDialogmotePanel aktivtDialogmote={aktivtDialogmote} />
          <DialogmoteFerdigstilteReferatPanel
            ferdigstilteMoter={historiskeDialogmoter.filter(
              (mote) => mote.status === DialogmoteStatus.FERDIGSTILT
            )}
          />
          <UtdragFraSykefravaeretPanel />
        </Tredelt.FirstColumn>

        <Tredelt.SecondColumn>
          {isMotehistorikkVisible && (
            <MotehistorikkPanel
              historiskeMoter={historiskeDialogmoter}
              dialogmoteunntak={dialogmoteunntak}
            />
          )}
        </Tredelt.SecondColumn>
      </Tredelt.Container>
    </SideLaster>
  );
};

export default Motelandingsside;
