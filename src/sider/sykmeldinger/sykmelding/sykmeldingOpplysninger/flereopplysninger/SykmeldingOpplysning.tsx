import React, { ReactNode } from "react";

interface SykmeldingOpplysningProps {
  tittel: string;
  children?: ReactNode;
  Overskrift?: keyof JSX.IntrinsicElements;
  className?: string;
}

const SykmeldingOpplysning = (
  sykmeldingOpplysningProps: SykmeldingOpplysningProps
) => {
  const {
    tittel,
    children,
    Overskrift = "h5",
    className = "",
  } = sykmeldingOpplysningProps;
  return (
    <div className={`opplysning ${className}`}>
      {tittel ? (
        <Overskrift
          className="opplysning__tittel"
          dangerouslySetInnerHTML={{ __html: tittel }}
        />
      ) : null}
      {children}
    </div>
  );
};

export default SykmeldingOpplysning;
