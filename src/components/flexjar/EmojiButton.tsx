import React from "react";
import { Label } from "@navikt/ds-react";
import { emojis, EmojiType } from "@/components/flexjar/feedbackEmojis";

interface EmojiButtonProps {
  emojiType: EmojiType;
  selectedEmojiType: EmojiType | undefined;
  setSelectedEmojiType: (emoji: EmojiType | undefined) => void;
}

export const EmojiButton = ({
  emojiType,
  selectedEmojiType,
  setSelectedEmojiType,
}: EmojiButtonProps) => {
  const emoji = emojis[emojiType];
  const isActive = selectedEmojiType === emojiType;

  const handleOnClick = () => {
    if (isActive) {
      setSelectedEmojiType(undefined);
    } else {
      setSelectedEmojiType(emojiType);
    }
  };

  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={handleOnClick}
      className="border-0 flex flex-col items-center cursor-pointer bg-inherit"
    >
      <emoji.figure width="40" fill={isActive ? emoji.color : undefined} />
      <Label className="text-sm">{emoji.label}</Label>
    </button>
  );
};
