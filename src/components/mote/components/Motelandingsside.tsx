import React from "react";
import Sidetopp from "../../Sidetopp";
import UtdragFraSykefravaeretPanel from "../../utdragFraSykefravaeret/UtdragFraSykefravaeret";
import { InnkallingDialogmotePanel } from "./innkalling/InnkallingDialogmotePanel";
import SideLaster from "../../SideLaster";
import { DialogmoteOnskePanel } from "../../motebehov/DialogmoteOnskePanel";
import { MotehistorikkPanel } from "../../dialogmote/motehistorikk/MotehistorikkPanel";
import { useDialogmoterQuery } from "@/data/dialogmote/dialogmoteQueryHooks";
import { useOppfolgingsplanerQuery } from "@/data/oppfolgingsplan/oppfolgingsplanQueryHooks";
import { useMotebehovQuery } from "@/data/motebehov/motebehovQueryHooks";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import { DialogmoteFerdigstilteReferatPanel } from "@/components/dialogmote/DialogmoteFerdigstilteReferatPanel";
import { DialogmoteStatus } from "@/data/dialogmote/types/dialogmoteTypes";
import { useDialogmoteunntakQuery } from "@/data/dialogmotekandidat/dialogmoteunntakQueryHooks";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { FlexPanel } from "@/components/Layout";

const texts = {
  dialogmoter: "Dialogmøter",
};

export const Motelandingsside = () => {
  const { isInitialLoading: henterOppfolgingsplaner } =
    useOppfolgingsplanerQuery();
  const {
    isInitialLoading: henterDialogmoter,
    isError: henterDialogmoterFeilet,
    aktivtDialogmote,
    historiskeDialogmoter,
  } = useDialogmoterQuery();
  const {
    data: dialogmoteunntak,
    isError: henterDialogmoteunntakFeilet,
    isInitialLoading: henterDialogmoteunntak,
  } = useDialogmoteunntakQuery();
  const {
    data: motebehov,
    isError: henterMotebehovFeilet,
    isInitialLoading: henterMotebehov,
  } = useMotebehovQuery();
  const {
    currentLedere,
    isInitialLoading: henterLedere,
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
      <FlexPanel>
        <UtdragFraSykefravaeretPanel />
      </FlexPanel>
      {isMotehistorikkVisible && (
        <MotehistorikkPanel
          historiskeMoter={historiskeDialogmoter}
          dialogmoteunntak={dialogmoteunntak}
        />
      )}
    </SideLaster>
  );
};

export default Motelandingsside;
