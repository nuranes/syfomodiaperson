import React, { ReactNode } from "react";

interface SykmeldingNokkelOpplysningProps {
  tittel: string;
  children?: ReactNode;
  className?: string;
  Overskrift?: keyof JSX.IntrinsicElements;
}

const SykmeldingNokkelOpplysning = (
  sykmeldingNokkelOpplysningProps: SykmeldingNokkelOpplysningProps
) => {
  const {
    tittel,
    children,
    className = "",
    Overskrift = "h3",
  } = sykmeldingNokkelOpplysningProps;
  return (
    <div className={`nokkelopplysning ${className}`}>
      {tittel ? (
        <Overskrift
          className="nokkelopplysning__tittel"
          dangerouslySetInnerHTML={{ __html: tittel }}
        />
      ) : null}
      {children}
    </div>
  );
};

export default SykmeldingNokkelOpplysning;
