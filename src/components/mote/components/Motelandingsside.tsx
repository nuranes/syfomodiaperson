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
import { TREDELING_BREAKING_POINT, TredeltSide } from "@/sider/TredeltSide";
import { useScreenWidth } from "@/hooks/tredeling/useScreenWidth";

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
  const screenWidth = useScreenWidth();

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

      <TredeltSide>
        <div className="flex flex-col">
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
        </div>
        <div className="flex flex-col">
          {isMotehistorikkVisible &&
            (screenWidth < TREDELING_BREAKING_POINT ? (
              <MotehistorikkPanel
                historiskeMoter={historiskeDialogmoter}
                dialogmoteunntak={dialogmoteunntak}
              />
            ) : (
              <div className="h-screen sticky top-2 overflow-y-scroll">
                <MotehistorikkPanel
                  historiskeMoter={historiskeDialogmoter}
                  dialogmoteunntak={dialogmoteunntak}
                />
              </div>
            ))}
        </div>
      </TredeltSide>
    </SideLaster>
  );
};

export default Motelandingsside;
