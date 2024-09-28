import { useEffect } from "react";
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

export function Physics() {
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
    render.options.background = "white";

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

  return null;
}
