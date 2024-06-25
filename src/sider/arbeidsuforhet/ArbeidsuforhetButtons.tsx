import { Button } from "@navikt/ds-react";
import { Link } from "react-router-dom";
import {
  arbeidsuforhetAvslagPath,
  arbeidsuforhetIkkeAktuellPath,
  arbeidsuforhetOppfyltPath,
} from "@/routers/AppRouter";
import React from "react";

const texts = {
  avslag: "Innstilling om avslag",
  oppfylt: "Oppfylt",
  ikkeAktuell: "Ikke aktuell",
};

interface Props {
  isBeforeForhandsvarselDeadline: boolean;
}

const AvslagButton = (props: React.ComponentPropsWithoutRef<typeof Button>) => (
  <Button {...props} variant="primary">
    {texts.avslag}
  </Button>
);

export const ArbeidsuforhetButtons = ({
  isBeforeForhandsvarselDeadline,
}: Props) => (
  <div className="flex gap-4">
    {isBeforeForhandsvarselDeadline ? (
      <AvslagButton disabled />
    ) : (
      <AvslagButton as={Link} to={arbeidsuforhetAvslagPath} />
    )}
    <Button as={Link} to={arbeidsuforhetOppfyltPath} variant="secondary">
      {texts.oppfylt}
    </Button>
    <Button as={Link} to={arbeidsuforhetIkkeAktuellPath} variant="secondary">
      {texts.ikkeAktuell}
    </Button>
  </div>
);
