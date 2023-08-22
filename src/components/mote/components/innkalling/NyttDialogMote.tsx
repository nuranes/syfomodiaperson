import React, { ReactElement } from "react";
import { Link } from "react-router-dom";
import { dialogmoteRoutePath } from "@/routers/AppRouter";
import { Hovedknapp } from "nav-frontend-knapper";

const texts = {
  nyttMote: "Nytt dialogmøte",
  nyttMoteTrackingContext: "Møtelandingsside: Opprett nytt dialogmøte",
};

export const NyttDialogMote = (): ReactElement => {
  return (
    <Link to={dialogmoteRoutePath}>
      <Hovedknapp>{texts.nyttMote}</Hovedknapp>
    </Link>
  );
};
