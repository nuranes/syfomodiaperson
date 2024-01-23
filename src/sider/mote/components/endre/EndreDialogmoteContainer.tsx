import React from "react";
import { DialogmoteSideContainer } from "../../../../components/dialogmote/DialogmoteSideContainer";
import EndreDialogmoteSkjema from "./EndreDialogmoteSkjema";

const texts = {
  pageTitle: "Endre dialogmøte",
  pageHeader: "Endre dialogmote",
};

const EndreDialogmoteContainer = () => {
  return (
    <DialogmoteSideContainer title={texts.pageTitle} header={texts.pageHeader}>
      {(dialogmote) => <EndreDialogmoteSkjema dialogmote={dialogmote} />}
    </DialogmoteSideContainer>
  );
};

export default EndreDialogmoteContainer;
