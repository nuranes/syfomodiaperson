import dayjs from "dayjs";
import userEvent from "@testing-library/user-event";
import { fireEvent, screen } from "@testing-library/react";

export const clickButton = (buttonText: string) =>
  userEvent.click(getButton(buttonText));

export const getButton = (buttonText: string) =>
  screen.getByRole("button", { name: buttonText });

export const clickTab = (tabTitle: string) => userEvent.click(getTab(tabTitle));

const getTab = (tabTitle: string) =>
  screen.getByRole("tab", { name: tabTitle });

export const queryButton = (buttonText: string) =>
  screen.queryByRole("button", { name: buttonText });

export const getTextInput = (name: string) =>
  screen.getByRole("textbox", {
    name,
  });

export const changeTextInput = (input: HTMLElement, value: string) =>
  fireEvent.change(input, {
    target: { value },
  });

export const maxLengthErrorMessage = (max: number) =>
  `Maks ${max} tegn tillatt`;

export const getTooLongText = (max: number) => "t".repeat(max + 1);

export const daysFromToday = (days: number): Date => {
  return dayjs(new Date()).add(days, "days").toDate();
};

export const weeksFromToday = (weeks: number): Date => {
  return dayjs(new Date()).add(weeks, "weeks").toDate();
};
