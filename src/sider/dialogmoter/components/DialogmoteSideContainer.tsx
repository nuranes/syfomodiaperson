import React, { ReactElement } from "react";
import { useParams } from "react-router-dom";
import { DialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { BrukerKanIkkeVarslesPapirpostAdvarsel } from "@/sider/dialogmoter/components/BrukerKanIkkeVarslesPapirpostAdvarsel";
import { useDialogmoterQuery } from "@/data/dialogmote/dialogmoteQueryHooks";
import { useBrukerinfoQuery } from "@/data/navbruker/navbrukerQueryHooks";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import Side from "@/sider/Side";
import SideLaster from "@/components/SideLaster";
import Sidetopp from "@/components/Sidetopp";
import Feilmelding from "@/components/Feilmelding";

interface DialogmoteSideProps {
  title: string;
  header: string;
  children: (dialogmote: DialogmoteDTO) => ReactElement;
}

const texts = {
  moteNotFound: "Fant ikke dialogmøte",
};

export const DialogmoteSideContainer = ({
  title,
  header,
  children,
}: DialogmoteSideProps): ReactElement => {
  const { dialogmoteUuid } = useParams<{
    dialogmoteUuid: string;
  }>();
  const { isLoading, isError, data: dialogmoter } = useDialogmoterQuery();
  const { brukerKanIkkeVarslesDigitalt } = useBrukerinfoQuery();

  const dialogmote = dialogmoter.find(
    (dialogmote) => dialogmote.uuid === dialogmoteUuid
  );

  return (
    <Side tittel={title} aktivtMenypunkt={Menypunkter.DIALOGMOTE}>
      <SideLaster henter={isLoading} hentingFeilet={isError}>
        <Sidetopp tittel={header} />
        {brukerKanIkkeVarslesDigitalt && (
          <BrukerKanIkkeVarslesPapirpostAdvarsel />
        )}
        {dialogmote ? (
          children(dialogmote)
        ) : (
          <Feilmelding tittel={texts.moteNotFound} />
        )}
      </SideLaster>
    </Side>
  );
};
