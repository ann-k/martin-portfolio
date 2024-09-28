import { useState } from "react";

import { Physics } from "./Physics";

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
      {[...Array(10).keys()].map((n) => {
        return (
          <button key={n} onClick={() => onClick(n)}>
            картинки {n}
          </button>
        );
      })}
      {typeof activeProject === "number" && <Physics />}
    </>
  );
}
