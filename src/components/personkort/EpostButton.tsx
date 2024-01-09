import React from "react";
import { CopyButton as CopyButtonAksel } from "@navikt/ds-react";
import { CheckmarkIcon, EnvelopeClosedIcon } from "@navikt/aksel-icons";

const textEpostCopied = (epost?: string) => {
  return `${epost} er kopiert!`;
};

interface EpostButtonProps {
  epost: string;
}

const EpostButton = ({ epost }: EpostButtonProps) => {
  return (
    <div className="float-left relative w-1/6 px-2">
      <CopyButtonAksel
        size="small"
        copyText={epost}
        icon={<EnvelopeClosedIcon title="Kopier epost" />}
        activeIcon={<CheckmarkIcon title={textEpostCopied(epost)} />}
      />
    </div>
  );
};

export default EpostButton;
