import React, { ReactNode } from "react";
import cn from "classnames";
import SykmeldingNokkelOpplysning from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/SykmeldingNokkelOpplysning";

interface StatusNokkelopplysningProps {
  children?: ReactNode;
  Overskrift?: keyof JSX.IntrinsicElements;
  tittel: string;
}

export const StatusNokkelopplysning = (
  statusNokkelopplysningProps: StatusNokkelopplysningProps
) => {
  const { children, Overskrift = "h2", tittel } = statusNokkelopplysningProps;
  return (
    <SykmeldingNokkelOpplysning
      className="nokkelopplysning--statusopplysning"
      Overskrift={Overskrift}
      tittel={tittel}
    >
      {children}
    </SykmeldingNokkelOpplysning>
  );
};

interface StatusopplysningerProps {
  children?: ReactNode;
}

export const Statusopplysninger = (
  statusopplysningerProps: StatusopplysningerProps
) => {
  const { children } = statusopplysningerProps;
  return <div className="statusopplysninger">{children}</div>;
};

interface StatuspanelProps {
  children?: ReactNode;
  enKolonne?: boolean;
}

const Statuspanel = (statuspanelProps: StatuspanelProps) => {
  const { children, enKolonne = false } = statuspanelProps;
  const classNames = cn("blokk statuspanel", {
    "statuspanel--toKol": !enKolonne,
    "statuspanel--enKol": enKolonne,
  });
  return <div className={classNames}>{children}</div>;
};

export default Statuspanel;
