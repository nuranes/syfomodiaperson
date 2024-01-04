import React from "react";
import { EmojiProps } from "@/components/flexjar/feedbackEmojis";

export const NoytralEmoji = (props: EmojiProps) => (
  <svg
    aria-hidden
    role="img"
    width={props.width}
    height="47"
    viewBox="0 0 48 47"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="24.2051"
      cy="23.6211"
      r="21.8613"
      stroke="currentColor"
      strokeWidth="3"
      {...props}
    />
    <circle cx="16.2904" cy="20.1244" r="2.62828" fill="currentColor" />
    <circle cx="32.1205" cy="20.1244" r="2.62828" fill="currentColor" />
    <line
      x1="16.4766"
      y1="31.3164"
      x2="31.9351"
      y2="31.3164"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);
