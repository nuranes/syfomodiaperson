import { ExternalLinkIcon } from "@navikt/aksel-icons";
import { Link } from "@navikt/ds-react";
import React, { ReactNode } from "react";

interface EksternLenkeProps {
  href: string;
  children: ReactNode;
}

export const EksternLenke = ({ href, children }: EksternLenkeProps) => (
  <Link href={href} target="_blank" rel="noopener noreferrer">
    {children}
    <ExternalLinkIcon title="Ekstern lenke" fontSize="1.5em" />
  </Link>
);
