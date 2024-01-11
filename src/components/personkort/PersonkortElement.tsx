import React, { ReactElement } from "react";
import cn from "classnames";

interface PersonkortElementProps {
  tittel: string;
  icon: ReactElement;
  children: ReactElement;
  antallKolonner?: number;
}

const PersonkortElement = ({
  children,
  icon,
  tittel,
  antallKolonner = 2,
}: PersonkortElementProps) => {
  const classNameRad = cn("personkortElement__rad", {
    "personkortElement__rad--treKolonner": antallKolonner === 3,
    "personkortElement__rad--toKolonner": antallKolonner === 2,
  });
  return (
    <div className="personkortElement">
      <div className="personkortElement__tittel">
        {icon}
        <h4>{tittel}</h4>
      </div>
      <div className={classNameRad}>{children}</div>
    </div>
  );
};

export default PersonkortElement;
