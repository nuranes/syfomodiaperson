import React, { ReactElement, ReactNode } from "react";
import { IconHeader } from "@/components/IconHeader";
import { Box } from "@navikt/ds-react";

interface Props {
  icon: string;
  header: string;
  subtitle?: ReactNode;
  children: ReactNode;
}

export const DialogmotePanel = ({ children, ...rest }: Props): ReactElement => {
  return (
    <Box background="surface-default" className="flex flex-col mb-4 p-8">
      <IconHeader altIcon="moteikon" {...rest} />
      {children}
    </Box>
  );
};
