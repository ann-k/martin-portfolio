import { useState } from "react";

import { Physics } from "./Physics";
import { Controls } from "./Controls";

export function Main() {
  const [alreadyDropped, setAlreadyDropped] = useState(false);
  const [activeProject, setActiveProject] = useState<number>();

  const onClick = (projectId: number) => {
    if (alreadyDropped) {
      setActiveProject(undefined);
      setTimeout(() => {
        setActiveProject(projectId);
      }, 1100);
    } else {
      setAlreadyDropped(true);
      setActiveProject(projectId);
    }
  };

  return (
    <>
      <Controls onClick={() => onClick(1)} onSecondClick={() => onClick(2)} />
      {typeof activeProject === "number" && <Physics />}
    </>
  );
}
