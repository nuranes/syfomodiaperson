import React, { ReactElement, ReactNode } from "react";

interface OppsummeringSporsmalscontainerProps {
  tag: string;
  children: ReactNode;
}

const OppsummeringSporsmalscontainer = ({
  tag,
  children,
}: OppsummeringSporsmalscontainerProps): ReactElement => (
  <div
    className="oppsummering__sporsmalscontainer"
    id={`js-${tag.toLowerCase()}`}
  >
    {children}
  </div>
);

export default OppsummeringSporsmalscontainer;
