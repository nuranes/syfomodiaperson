import React from "react";
import { Menypunkter } from "@/navigation/menypunkterTypes";

const opActivePlanerText = (tasks: number) => {
  const activeText = tasks > 1 ? "aktive" : "aktiv";

  return `(${tasks} ${activeText})`;
};

interface UnfinishedTasksProps {
  tasks: number;
  menypunkt: Menypunkter;
}

const UnfinishedTasks = (unfinishedTasksProps: UnfinishedTasksProps) => {
  const { tasks, menypunkt } = unfinishedTasksProps;
  return menypunkt === Menypunkter.OPPFOELGINGSPLANER ? (
    <p className="antallNytt__oppfolgingsplan">{opActivePlanerText(tasks)}</p>
  ) : (
    <i className="antallNytt">{tasks}</i>
  );
};

export default UnfinishedTasks;
