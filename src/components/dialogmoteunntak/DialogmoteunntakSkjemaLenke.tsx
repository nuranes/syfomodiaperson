import React, { ReactElement } from "react";
import { Link } from "react-router-dom";
import { dialogmoteUnntakRoutePath } from "@/routers/AppRouter";
import Knapp from "nav-frontend-knapper";

const texts = {
  settUnntak: "Sett unntak",
  settUnntakTrackingContext: "Møtelandingsside: Sett unntak",
};

export const DialogmoteunntakSkjemaLenke = (): ReactElement => {
  return (
    <Link to={dialogmoteUnntakRoutePath}>
      <Knapp>{texts.settUnntak}</Knapp>
    </Link>
  );
};
