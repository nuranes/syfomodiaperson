import React, { ReactElement, ReactNode } from "react";
import { IconHeader } from "@/components/IconHeader";
import { FlexPanel } from "@/components/Layout";

interface Props {
  icon: string;
  header: string;
  subtitle?: ReactNode;
  children: ReactNode;
}

export const DialogmotePanel = ({ children, ...rest }: Props): ReactElement => {
  return (
    <FlexPanel>
      <IconHeader altIcon="moteikon" {...rest} />
      <>{children}</>
    </FlexPanel>
  );
};
