import { SinnaEmoji } from "@/components/flexjar/SinnaEmoji";
import { LeiEmoji } from "@/components/flexjar/LeiEmoji";
import { NoytralEmoji } from "@/components/flexjar/NoytralEmoji";
import { GladEmoji } from "@/components/flexjar/GladEmoji";
import { VeldigGladEmoji } from "@/components/flexjar/VeldigGladEmoji";

export type EmojiType = "HORRIBEL" | "DARLIG" | "NOYTRAL" | "BRA" | "SUPER";

interface Emoji {
  label: string;
  color: string;
  score: number;
  figure: (props: EmojiProps) => JSX.Element;
}

export interface EmojiProps {
  width: string;
  fill?: string;
}

export const emojis: {
  [key in EmojiType]: Emoji;
} = {
  HORRIBEL: {
    label: "Horribel",
    color: "var(--a-red-300)",
    score: 1,
    figure: SinnaEmoji,
  },
  DARLIG: {
    label: "Dårlig",
    color: "var(--a-orange-300)",
    score: 2,
    figure: LeiEmoji,
  },
  NOYTRAL: {
    label: "Nøytral",
    color: "var(--a-blue-300)",
    score: 3,
    figure: NoytralEmoji,
  },
  BRA: {
    label: "Bra",
    color: "var(--a-green-200)",
    score: 4,
    figure: GladEmoji,
  },
  SUPER: {
    label: "Super",
    color: "var(--a-green-400)",
    score: 5,
    figure: VeldigGladEmoji,
  },
};
