export function genererDato(dato, klokkeslett) {
  const s = new Date();
  s.setDate(1);
  const datoArr = dato.split("-");
  const klokkeslettArr = klokkeslett.split(":");
  const aar = datoArr[0];
  const aarPadded = aar.length === 2 ? `20${aar}` : aar;
  s.setYear(aarPadded);
  s.setMonth(parseInt(datoArr[1], 10) - 1);
  s.setDate(datoArr[2]);
  s.setUTCHours(klokkeslettArr[0]);
  s.setMinutes(klokkeslettArr[1]);
  s.setSeconds("00");
  return s.toJSON().slice(0, -5);
}
