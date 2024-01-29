import React from "react";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";

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
    <p className="antallNytt">{tasks}</p>
  );
};

export default UnfinishedTasks;
