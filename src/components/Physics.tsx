import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";

const boxesProperties = [
  {
    width: 256,
    height: 256,
    x: 500,
    y: 0,
    src: "/martin-portfolio/images/1.jpeg",
  },
  {
    width: 150,
    height: 92,
    x: 550,
    y: -50,
    src: "/martin-portfolio/images/2.jpeg",
  },
  {
    width: 150,
    height: 156,
    x: 200,
    y: 0,
    src: "/martin-portfolio/images/3.jpeg",
  },
  {
    width: 240,
    height: 166,
    x: 600,
    y: -50,
    src: "/martin-portfolio/images/4.jpeg",
  },
];

export function Physics({ locale = "en" }: { locale: "ru" | "en" }) {
  const { Engine, Render, Runner, Bodies, Composite, MouseConstraint, Mouse } =
    Matter;

  useEffect(() => {
    const container = document.querySelector("#physics-container");

    // Create an engine
    const engine = Engine.create();

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

    // canvas.style.backgroundColor = "green";
    // canvas.style.pointerEvents = "none";

    // Run the renderer
    Render.run(render);

    // Create boxes and ground
    const boxes = boxesProperties.map((b) =>
      Bodies.rectangle(b.x, b.y, b.width, b.height, {
        render: {
          sprite: {
            texture: b.src,
            xScale: 1,
            yScale: 1,
          },
        },
      }),
    );

    const groundWidth = 5000;

    const ground = Bodies.rectangle(
      (container?.clientWidth ?? 0) / 2,
      (container?.clientHeight ?? 0) + groundWidth / 2,
      container?.clientWidth ?? 0,
      groundWidth,
      { isStatic: true },
    );

    // Add ground and boxes to world
    Composite.add(engine.world, [ground, ...boxes]);

    // Create canvas mouse
    const canvasMouse = Mouse.create(render.canvas);

    // Create mouse constraint
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: canvasMouse,
    });

    Composite.add(engine.world, mouseConstraint);

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

  const [alreadyDropped, setAlreadyDropped] = useState(false);
  const [_, setActiveProject] = useState<number>();

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
      <main>
        <div id="physics-container"></div>
        {locale === "en" ? (
          <div id="content">
            Martin Lezhenin is a{" "}
            <a className="link" onClick={() => onClick(0)}>
              graphic designer
            </a>
            ,{" "}
            <a className="link" onClick={() => onClick(1)}>
              media artist
            </a>
            , curator, art director, teacher, creative director, brand director,
            and founder of the creative bureau Whale Studio.
          </div>
        ) : (
          <div>
            Мартин Леженин — <a className="link">графический дизайнер</a>,{" "}
            <a className="link">медиахудожник</a>, куратор, арт-директор,
            педагог, креативный директор, бренд-директор, и основатель
            креативного бюро Whale Studio.
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="footer-item" id="email">
          <a className="link" href="mailto:martin@lezhen.in">
            martin@lezhen.in
          </a>
        </div>
        <div className="footer-item" id="cta">
          {locale === "en" ? "LET'S WORK" : "ПОРАБОТАЕМ"}
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
      </footer>
    </>
  );
}
