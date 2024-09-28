import { useEffect, useState } from "react";
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
  useEffect(() => {
    const {
      Engine,
      Render,
      Runner,
      Bodies,
      Composite,
      MouseConstraint,
      Mouse,
    } = Matter;

    // Create an engine
    const engine = Engine.create();

    // Create a renderer
    const render = Render.create({
      element: document.body,
      engine: engine,
    });

    // Create runner
    const runner = Runner.create();

    render.options.wireframes = false;
    render.options.background = "transparent";

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
    const ground = Bodies.rectangle(
      window.innerWidth / 2,
      window.innerHeight,
      window.innerWidth,
      30,
      { isStatic: true },
    );

    // Run the renderer
    Render.run(render);

    // Run the engine
    Runner.run(runner, engine);

    // Set canvas size
    const canvas = document.getElementsByTagName("canvas")[0];
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener("resize", function () {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    // Add ground and boxes to world
    Composite.add(engine.world, [ground, ...boxes]);

    // Create canvas mouse
    const canvasMouse = Mouse.create(canvas);

    // Create mouse constraint
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: canvasMouse,
    });

    Composite.add(engine.world, mouseConstraint);

    render.mouse = canvasMouse;

    // Cleanup
    return () => {
      Composite.remove(engine.world, ground);

      setTimeout(() => {
        Render.stop(render);
        Composite.clear(engine.world, false);
        Engine.clear(engine);
        render.canvas.remove();
      }, 1000);
    };
  });

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
      <main>
        {[...Array(10).keys()].map((n) => {
          return (
            <button key={n} onClick={() => onClick(n)}>
              картинки {n}
            </button>
          );
        })}
        {locale === "en" ? (
          <div>
            Martin Lezhenin is a <a className="link">graphic designer</a>,{" "}
            <a className="link">media artist</a>, curator, art director,
            teacher, creative director, brand director, and founder of the
            creative bureau Whale Studio.
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
      {typeof activeProject === "number" && <Physics locale={locale} />}
    </>
  );
}
