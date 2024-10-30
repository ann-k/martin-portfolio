import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { Project } from "./Project";

const groups = ["designer", "artist", "curator", "director", "studio"] as const;

type Group = (typeof groups)[number];

const designerProjects = [
  {
    width: 240,
    height: 166,
    src: "/images/designer/0.jpeg",
  },
  {
    width: 256,
    height: 256,
    src: "/images/designer/1.jpeg",
  },
  {
    width: 150,
    height: 92,
    src: "/images/designer/2.jpeg",
  },
  {
    width: 150,
    height: 156,
    src: "/images/designer/3.jpeg",
  },
];

const artistProjects = [
  {
    width: 209,
    height: 313,
    src: "/images/artist/0.jpeg",
  },
  {
    width: 350,
    height: 382,
    src: "/images/artist/1.jpeg",
  },
  {
    width: 375,
    height: 250,
    src: "/images/artist/2.jpeg",
  },
];

const projects: Record<
  Group,
  { width: number; height: number; src: string }[]
> = {
  designer: designerProjects,
  artist: artistProjects,
  curator: designerProjects,
  director: designerProjects,
  studio: designerProjects,
};

export function Physics({ locale = "en" }: { locale: "ru" | "en" }) {
  const [activeProject, setActiveProject] = useState<number>();

  const {
    Engine,
    Render,
    Runner,
    Bodies,
    Composite,
    // MouseConstraint, Mouse
  } = Matter;

  let ground: Matter.Body;
  let boxes: {
    w: number;
    h: number;
    body: Matter.Body;
    elem: HTMLDivElement;
    backgroundImageSrc: string;
  }[] = [];

  // Create an engine
  const engine = Engine.create();

  const renderBox = (b: (typeof boxes)[number]) => {
    const { x, y } = b.body.position;
    if (b.elem) {
      const { style } = b.elem;
      style.width = `${b.w.toString()}px`;
      style.height = `${b.h.toString()}px`;
      style.backgroundImage = `url(${b.backgroundImageSrc})`;
      style.top = `${y - b.h / 2}px`;
      style.left = `${x - b.w / 2}px`;
      style.transform = `rotate(${b.body.angle}rad)`;
    }
  };

  // Built-in renderer is replaced by custom renderer
  const rerender = () => {
    boxes.forEach((b) => renderBox(b));
    Matter.Engine.update(engine);
    requestAnimationFrame(rerender);
  };

  let firstDisplayed = false;

  const displayBoxes = (group: Group) => {
    Composite.remove(
      engine.world,
      boxes.map((b) => b.body),
    );

    const groupProjects = projects[group];

    boxes = groupProjects.map((b, i) => ({
      w: b.width,
      h: b.height,
      body: Matter.Bodies.rectangle(
        Math.random() * 400 + 200, // max should be container width
        -50,
        b.width,
        b.height,
      ),
      elem: document.querySelector(`#box-${i}`) as HTMLDivElement,
      backgroundImageSrc: b.src,
    }));

    Composite.add(
      engine.world,
      boxes.map((b) => {
        b.body.restitution = 0.3;
        b.body.frictionAir = 0.02;
        return b.body;
      }),
    );
    if (!firstDisplayed) {
      rerender();
    }
    firstDisplayed = true;
  };

  // const hideBoxes = () => {
  // Composite.remove(engine.world, ground);
  // setTimeout(() => {
  //   Composite.add(engine.world, ground);
  //   Composite.remove(
  //     engine.world,
  //     boxes.map((b) => b.body),
  //   );
  // }, 1000);
  // rerender();
  // };

  useEffect(() => {
    const container = document.querySelector("#physics-container");

    // Create a renderer
    const render = Render.create({
      element: container as HTMLElement,
      engine: engine,
      options: {
        width: container?.clientWidth,
        height: container?.clientHeight,
        wireframes: false,
        background: "transparent",
      },
    });

    const groundWidth = 5000;

    ground = Bodies.rectangle(
      (container?.clientWidth ?? 0) / 2,
      (container?.clientHeight ?? 0) + groundWidth / 2,
      container?.clientWidth ?? 0,
      groundWidth,
      { isStatic: true },
    );

    const leftWall = Bodies.rectangle(
      0 - groundWidth / 2,
      (container?.clientHeight ?? 0) / 2,
      groundWidth,
      (container?.clientHeight ?? 0) * 5,
      { isStatic: true },
    );
    const rightWall = Bodies.rectangle(
      (container?.clientWidth ?? 0) + groundWidth / 2,
      (container?.clientHeight ?? 0) / 2,
      groundWidth,
      (container?.clientHeight ?? 0) * 5,
      { isStatic: true },
    );

    Composite.add(engine.world, [ground, leftWall, rightWall]);

    // // Create canvas mouse
    // const canvasMouse = Mouse.create(render.canvas);
    // // Create mouse constraint
    // const mouseConstraint = MouseConstraint.create(engine, {
    //   mouse: canvasMouse,
    // });
    // Composite.add(engine.world, mouseConstraint);

    // Create runner
    const runner = Runner.create();
    // Run the engine
    Runner.run(runner, engine);

    function handleResize() {
      render.canvas.width = container?.clientWidth ?? 0;
      render.canvas.height = container?.clientHeight ?? 0;

      Matter.Body.setPosition(
        ground,
        Matter.Vector.create(
          (container?.clientWidth ?? 0) / 2,
          (container?.clientHeight ?? 0) + groundWidth / 2,
        ),
      );

      Matter.Body.setPosition(
        rightWall,
        Matter.Vector.create(
          (container?.clientWidth ?? 0) + groundWidth / 2,
          (container?.clientHeight ?? 0) / 2,
        ),
      );
    }
    window.addEventListener("resize", () => handleResize());

    // Cleanup
    return () => {
      // Composite.remove(engine.world, ground);

      // setTimeout(() => {
      //   Render.stop(render);
      //   Composite.clear(engine.world, false);
      //   Engine.clear(engine);
      //   render.canvas.remove();
      // }, 1000);
      render.canvas.remove();
    };
  });

  const onGroupClick = (group: Group) => {
    displayBoxes(group);
  };

  const onProjectClick = (n: number) => {
    setActiveProject(n);
  };

  const onProjectModalClose = () => {
    setActiveProject(undefined);
  };

  return (
    <main
      className={typeof activeProject === "number" ? "has-dialog" : undefined}
    >
      {typeof activeProject === "number" && (
        <Project
          project={activeProject}
          group="artist"
          onClose={onProjectModalClose}
        />
      )}

      {/* <div className="box" id="box-0">
        text
      </div> */}

      {Array.from(Array(4).keys()).map((n) => (
        <button
          className="box"
          id={`box-${n}`}
          onClick={() => onProjectClick(n)}
        />
      ))}

      <div id="physics-container"></div>

      <div className="content">
        {locale === "en" ? (
          <div>
            Martin Lezhenin is a{" "}
            <a
              className="link"
              role="button"
              onClick={() => onGroupClick("designer")}
            >
              graphic designer
            </a>
            ,{" "}
            <a
              className="link"
              role="button"
              onClick={() => onGroupClick("artist")}
            >
              media artist
            </a>
            ,{" "}
            <a
              className="link"
              role="button"
              onClick={() => onGroupClick("curator")}
            >
              curator
            </a>
            ,{" "}
            <a
              className="link"
              role="button"
              onClick={() => onGroupClick("director")}
            >
              art director
            </a>
            , teacher, creative director, brand director, and founder of the
            creative bureau{" "}
            <a
              className="link"
              role="button"
              onClick={() => onGroupClick("studio")}
            >
              Whale Studio
            </a>
            .
          </div>
        ) : (
          <div>
            Мартин Леженин — <a className="link">графический дизайнер</a>,{" "}
            <a className="link">медиахудожник</a>, куратор, арт-директор,
            педагог, креативный директор, бренд-директор, и основатель
            креативного бюро Whale Studio.
          </div>
        )}

        <div className="footer">
          <div className="footer-item" id="email">
            <a className="link" href="mailto:martin@lezhen.in">
              martin@lezhen.in
            </a>
          </div>
          <div className="footer-item" id="cta">
            {locale === "en" ? "LET'S WORK" : "ПОРАБОТАЕМ?"}
          </div>
          <div className="footer-item" id="socials-group">
            <a className="social" href="https://www.instagram.com/lezhenim/">
              IG
            </a>
            <a
              className="social"
              href="https://www.linkedin.com/in/martinlezhenin/"
            >
              LI
            </a>
            <a className="social" href="https://www.t.me/votpravda">
              TG
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
