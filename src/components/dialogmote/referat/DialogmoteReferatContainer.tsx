import React, { ReactElement } from "react";
import { DialogmoteSideContainer } from "../DialogmoteSideContainer";
import Referat, { ReferatMode } from "./Referat";
import { MalformProvider } from "@/context/malform/MalformContext";

const texts = {
  pageTitle: "Referat fra dialogmøte",
  pageHeader: "Referat fra dialogmøte",
};

const DialogmoteReferatContainer = (): ReactElement => (
  <DialogmoteSideContainer title={texts.pageTitle} header={texts.pageHeader}>
    {(dialogmote) => (
      <MalformProvider>
        <Referat
          dialogmote={dialogmote}
          pageTitle={texts.pageTitle}
          mode={ReferatMode.NYTT}
        />
      </MalformProvider>
    )}
  </DialogmoteSideContainer>
);

export default DialogmoteReferatContainer;
