import Side from "../../../sider/Side";
import { DIALOGMOTE } from "@/enums/menypunkter";
import React, { ReactElement } from "react";
import Sidetopp from "../../Sidetopp";
import DialogmoteInnkallingSkjema from "./DialogmoteInnkallingSkjema";
import SideLaster from "../../SideLaster";
import styled from "styled-components";
import { AlertstripeFullbredde } from "../../AlertstripeFullbredde";
import { BrukerKanIkkeVarslesPapirpostAdvarsel } from "@/components/dialogmote/BrukerKanIkkeVarslesPapirpostAdvarsel";
import { useDialogmoterQuery } from "@/data/dialogmote/dialogmoteQueryHooks";
import { Navigate } from "react-router-dom";
import { moteoversiktRoutePath } from "@/routers/AppRouter";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { useBrukerinfoQuery } from "@/data/navbruker/navbrukerQueryHooks";
import { ArbeidstakerHarIkkeAktivSykmeldingAdvarsel } from "@/components/dialogmote/ArbeidstakerHarIkkeAktivSykmelding";

const texts = {
  title: "Innkalling til dialogmøte",
  tilbake: "Tilbake",
  // TODO: fjern referanse til Arena når vi stenger for Arena
  nyLosningAlert:
    "I denne nye løsningen sender du innkalling, avlysning, endring av tidspunkt og referat. I Arena trenger du bare " +
    "endre status til ferdig behandlet.",
};

const StyledAlert = styled(AlertstripeFullbredde)`
  margin-bottom: 1em;
`;

const DialogmoteInnkallingSide = (): ReactElement => {
  const { brukerKanIkkeVarslesDigitalt } = useBrukerinfoQuery();
  const { hasActiveOppfolgingstilfelle, hasOppfolgingstilfelle } =
    useOppfolgingstilfellePersonQuery();

  return (
    <>
      <StyledAlert type="advarsel">{texts.nyLosningAlert}</StyledAlert>
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
  const { isLoading: henterLedere, isError: hentingLedereFeilet } =
    useLedereQuery();
  const { aktivtDialogmote } = useDialogmoterQuery();
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
    <Side tittel={texts.title} aktivtMenypunkt={DIALOGMOTE}>
      <SideLaster henter={henter} hentingFeilet={hentingFeilet}>
        <Sidetopp tittel={texts.title} />
        <DialogmoteInnkallingSide />
      </SideLaster>
    </Side>
  );
};

export default DialogmoteInnkallingContainer;
