export type HistorikkKilde = "MOTER" | "MOTEBEHOV" | "OPPFOLGINGSPLAN";

export interface HistorikkEvent {
  opprettetAv?: string;
  tekst: string;
  tidspunkt: Date;
  kilde: HistorikkKilde | "LEDER" | "AKTIVITETSKRAV";
}
