import { ReactElement, ReactNode } from "react";
import React from "react";
import { Box } from "@navikt/ds-react";

interface ReferatInfoColumnProps {
  children?: ReactNode;
}

export const ReferatInfoColumn = ({
  children,
}: ReferatInfoColumnProps): ReactElement => (
  <div className="flex-[0.5]">
    {children ? (
      <Box
        borderRadius="medium"
        background="surface-subtle"
        borderColor="border-default"
        padding="4"
        borderWidth="1"
        className="mt-8"
      >
        {children}
      </Box>
    ) : null}
  </div>
);
