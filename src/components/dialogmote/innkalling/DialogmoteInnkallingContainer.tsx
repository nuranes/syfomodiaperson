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
import { Menypunkter } from "@/navigation/menypunkterTypes";

const texts = {
  title: "Innkalling til dialogmøte",
  tilbake: "Tilbake",
};

export const DialogmoteInnkallingSide = (): ReactElement => {
  const { brukerKanIkkeVarslesDigitalt } = useBrukerinfoQuery();
  const { hasActiveOppfolgingstilfelle, hasOppfolgingstilfelle } =
    useOppfolgingstilfellePersonQuery();

  return (
    <>
      {brukerKanIkkeVarslesDigitalt && (
        <BrukerKanIkkeVarslesPapirpostAdvarsel />
      )}
      {!hasActiveOppfolgingstilfelle && hasOppfolgingstilfelle && (
        <ArbeidstakerHarIkkeAktivSykmeldingAdvarsel />
      )}
      <DialogmoteInnkallingSkjema />
    </>
  );
};

const DialogmoteInnkallingContainer = (): ReactElement => {
  const { isInitialLoading: henterLedere, isError: hentingLedereFeilet } =
    useLedereQuery();
  const { aktivtDialogmote } = useDialogmoterQuery();
  const {
    isInitialLoading: henterOppfolgingstilfeller,
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
        <DialogmoteInnkallingSide />
      </SideLaster>
    </Side>
  );
};

export default DialogmoteInnkallingContainer;
