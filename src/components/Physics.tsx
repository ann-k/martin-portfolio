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
  // const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    var canvas = document.createElement("canvas");
    // const context = canvas.getContext("2d");
    canvas.style.backgroundColor = "green";

    document.body.appendChild(canvas);

    // canvas.width = 777;

    // Create an engine
    const engine = Engine.create();

    // Create a renderer
    const render = Render.create({
      // element: document.body,
      engine: engine,
      canvas,
    });

    render.options.wireframes = false;
    // render.options.background = "transparent";
    render.options.height = window.innerHeight;
    render.options.width = window.innerWidth;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.backgroundColor = "green";
    // canvas.
    // const canvas = document.getElementsByTagName("canvas")[0];
    // canvas.style.width = "100vw";
    // canvas.style.height = "100vh";
    // canvas.style.position = "fixed";
    // canvas.style.top = "0";
    // canvas.style.left = "0";
    // canvas.style.pointerEvents = "none";

    // Create runner
    const runner = Runner.create();

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

    // Set canvas size

    console.log(document.getElementsByTagName("canvas"));

    // Create canvas mouse
    const canvasMouse = Mouse.create(canvas);

    // Create mouse constraint
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: canvasMouse,
    });

    window.addEventListener("resize", function () {
      render.options.height = window.innerHeight;
      render.options.width = window.innerWidth;
    });

    // Add ground and boxes to world
    Composite.add(engine.world, [ground, ...boxes]);
    // Composite.add(engine.world, mouseConstraint);

    render.mouse = canvasMouse;

    // Run the renderer
    Render.run(render);

    // Run the engine
    Runner.run(runner, engine);
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
  const [activeProject, setActiveProject] = useState<number>();

  const onClick = (projectId: number) => {
    console.log("clicked");
    // if (alreadyDropped) {
    //   setActiveProject(undefined);
    //   setTimeout(() => {
    //     setActiveProject(projectId);
    //   }, 1100);
    // } else {
    //   setAlreadyDropped(true);
    //   setActiveProject(projectId);
    // }
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

      {/* <canvas ref={canvasRef} /> */}

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
