import { AlertstripeFullbredde } from "@/components/AlertstripeFullbredde";
import React, { ComponentProps } from "react";
import Alertstripe from "nav-frontend-alertstriper";

export const AktivitetskravAlertstripe = ({
  children,
  ...rest
}: ComponentProps<typeof Alertstripe>) => (
  <AlertstripeFullbredde marginbottom="1em" {...rest}>
    {children}
  </AlertstripeFullbredde>
);
