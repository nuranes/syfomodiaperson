export const erProd = () => {
  return window.location.href.indexOf("syfomodiaperson.intern.nav.no") > -1;
};

export const erPreProd = () => {
  return window.location.href.indexOf("syfomodiaperson.intern.dev.nav.no") > -1;
};

export const finnMiljoStreng = () => {
  return erPreProd() ? "-q1" : "";
};

export const erLokal = (): boolean => {
  return window.location.host.indexOf("localhost") > -1;
};

export const finnNaisUrlIntern = () => {
  return erPreProd() ? ".intern.dev.nav.no" : ".intern.nav.no";
};

export const fullNaisUrlIntern = (host: string, path = "") => {
  if (erLokal()) {
    return path;
  }
  return `https://${host}${finnNaisUrlIntern()}${path}`;
};
