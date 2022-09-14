import { BrukerKanIkkeVarslesText } from "@/components/BrukerKanIkkeVarslesText";
import { Normaltekst } from "nav-frontend-typografi";
import React from "react";
import styled from "styled-components";
import { AlertstripeFullbredde } from "@/components/AlertstripeFullbredde";

const AdvarselStripe = styled(AlertstripeFullbredde)`
  margin-bottom: 1em;
`;

export const texts = {
  papirpostDialogmote:
    "Innkalling, referat og andre brev blir sendt som papirpost, i tillegg til at det blir sendt digitalt.",
};

export const BrukerKanIkkeVarslesPapirpostAdvarsel = (): React.ReactElement => (
  <AdvarselStripe type="advarsel">
    <BrukerKanIkkeVarslesText />
    <Normaltekst>{texts.papirpostDialogmote}</Normaltekst>
  </AdvarselStripe>
);
