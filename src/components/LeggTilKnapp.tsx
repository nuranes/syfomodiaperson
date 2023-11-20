import { Knapp, KnappBaseProps } from "nav-frontend-knapper";
import React from "react";
import { PlusIcon } from "@navikt/aksel-icons";

export const LeggTilKnapp = ({ children, ...rest }: KnappBaseProps) => (
  <Knapp htmlType="button" {...rest}>
    <PlusIcon title="Pluss ikon" />
    <span>{children}</span>
  </Knapp>
);
