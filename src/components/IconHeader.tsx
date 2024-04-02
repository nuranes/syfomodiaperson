import React, { ReactNode } from "react";
import { Heading } from "@navikt/ds-react";

interface IconHeaderProps {
  icon: string;
  altIcon: string;
  header: string;
  subtitle?: ReactNode;
}

export const IconHeader = ({
  icon,
  altIcon,
  header,
  subtitle,
}: IconHeaderProps) => {
  return (
    <div className="flex flex-row items-center">
      <img className="mr-4 w-12" src={icon} alt={altIcon} />
      <div className="flex flex-col gap-1">
        <Heading level="2" size="medium">
          {header}
        </Heading>
        {typeof subtitle === "string" ? <p>{subtitle}</p> : subtitle}
      </div>
    </div>
  );
};
