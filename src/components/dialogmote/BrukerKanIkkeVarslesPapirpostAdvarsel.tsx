import { BrukerKanIkkeVarslesText } from "@/components/BrukerKanIkkeVarslesText";
import { Normaltekst } from "nav-frontend-typografi";
import React from "react";
import { AlertstripeFullbredde } from "@/components/AlertstripeFullbredde";

export const texts = {
  papirpostDialogmote:
    "Innkalling, referat og andre brev blir sendt som papirpost, i tillegg til at det blir sendt digitalt.",
};

export const BrukerKanIkkeVarslesPapirpostAdvarsel = (): React.ReactElement => (
  <AlertstripeFullbredde type="advarsel" marginbottom="1em">
    <BrukerKanIkkeVarslesText />
    <Normaltekst>{texts.papirpostDialogmote}</Normaltekst>
  </AlertstripeFullbredde>
);
