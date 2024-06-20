import { Button } from "@navikt/ds-react";
import { Link } from "react-router-dom";
import {
  arbeidsuforhetAvslagPath,
  arbeidsuforhetOppfyltPath,
} from "@/routers/AppRouter";
import React from "react";

const texts = {
  avslag: "Innstilling om avslag",
  oppfylt: "Oppfylt",
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
  </div>
);
