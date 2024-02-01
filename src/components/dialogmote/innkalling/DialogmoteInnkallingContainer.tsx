import Side from "../../../sider/Side";
import React, { ReactElement } from "react";
import Sidetopp from "../../Sidetopp";
import DialogmoteInnkallingSkjema from "./DialogmoteInnkallingSkjema";
import SideLaster from "../../SideLaster";
import { BrukerKanIkkeVarslesPapirpostAdvarsel } from "@/components/dialogmote/BrukerKanIkkeVarslesPapirpostAdvarsel";
import { useDialogmoterQuery } from "@/data/dialogmote/dialogmoteQueryHooks";
import { Navigate } from "react-router-dom";
import { moteoversiktRoutePath } from "@/routers/AppRouter";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { useBrukerinfoQuery } from "@/data/navbruker/navbrukerQueryHooks";
import { ArbeidstakerHarIkkeAktivSykmeldingAdvarsel } from "@/components/dialogmote/ArbeidstakerHarIkkeAktivSykmelding";
import * as Tredelt from "@/sider/TredeltSide";
import { MotehistorikkPanel } from "@/components/dialogmote/motehistorikk/MotehistorikkPanel";
import { useDialogmoteunntakQuery } from "@/data/dialogmotekandidat/dialogmoteunntakQueryHooks";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import { MalformProvider } from "@/context/malform/MalformContext";

const texts = {
  title: "Innkalling til dialogmøte",
  tilbake: "Tilbake",
};

export const DialogmoteInnkallingSide = (): ReactElement => {
  const { brukerKanIkkeVarslesDigitalt } = useBrukerinfoQuery();
  const { hasActiveOppfolgingstilfelle, hasOppfolgingstilfelle } =
    useOppfolgingstilfellePersonQuery();

  return (
    <div className="flex flex-col">
      {brukerKanIkkeVarslesDigitalt && (
        <BrukerKanIkkeVarslesPapirpostAdvarsel />
      )}
      {!hasActiveOppfolgingstilfelle && hasOppfolgingstilfelle && (
        <ArbeidstakerHarIkkeAktivSykmeldingAdvarsel />
      )}
      <DialogmoteInnkallingSkjema />
    </div>
  );
};

const DialogmoteInnkallingContainer = (): ReactElement => {
  const { isLoading: henterLedere, isError: hentingLedereFeilet } =
    useLedereQuery();
  const { aktivtDialogmote, historiskeDialogmoter } = useDialogmoterQuery();
  const { data: dialogmoteunntak } = useDialogmoteunntakQuery();
  const {
    isLoading: henterOppfolgingstilfeller,
    isError: hentingOppfolgingstilfellerFeilet,
  } = useOppfolgingstilfellePersonQuery();

  if (aktivtDialogmote) {
    return <Navigate to={moteoversiktRoutePath} />;
  }

  const henter = henterLedere || henterOppfolgingstilfeller;
  const hentingFeilet =
    hentingLedereFeilet || hentingOppfolgingstilfellerFeilet;

  return (
    <Side tittel={texts.title} aktivtMenypunkt={Menypunkter.DIALOGMOTE}>
      <SideLaster henter={henter} hentingFeilet={hentingFeilet}>
        <Sidetopp tittel={texts.title} />
        <Tredelt.Container>
          <Tredelt.FirstColumn>
            <MalformProvider>
              <DialogmoteInnkallingSide />
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

export default DialogmoteInnkallingContainer;
