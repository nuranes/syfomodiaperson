export type HistorikkKilde = "MOTER" | "MOTEBEHOV" | "OPPFOLGINGSPLAN";
export type HistorikkEventType = HistorikkKilde | "LEDER" | "AKTIVITETSKRAV";

export interface HistorikkEvent {
  opprettetAv?: string;
  tekst: string;
  tidspunkt: Date;
  kilde: HistorikkEventType;
}
