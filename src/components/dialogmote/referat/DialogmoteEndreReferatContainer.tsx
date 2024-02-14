import React, { ReactElement } from "react";
import { DialogmoteSideContainer } from "../DialogmoteSideContainer";
import Referat, { ReferatMode } from "./Referat";
import { MalformProvider } from "@/context/malform/MalformContext";

const texts = {
  pageTitle: "Endre referat fra dialogmøte",
  pageHeader: "Endre referat fra dialogmøte",
};

const DialogmoteEndreReferatContainer = (): ReactElement => (
  <DialogmoteSideContainer title={texts.pageTitle} header={texts.pageHeader}>
    {(dialogmote) => (
      <MalformProvider>
        <Referat
          dialogmote={dialogmote}
          pageTitle={texts.pageTitle}
          mode={ReferatMode.ENDRET}
        />
      </MalformProvider>
    )}
  </DialogmoteSideContainer>
);

export default DialogmoteEndreReferatContainer;
