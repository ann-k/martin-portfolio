import Matter from "matter-js";

import { Controls } from "./Controls";

export function Physics() {
  const Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    World = Matter.World;

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
  const boxA = Bodies.rectangle(400, 0, 256, 256, {
    render: {
      sprite: {
        texture: "/martin-portfolio/images/1.jpeg",
        xScale: 1,
        yScale: 1,
      },
    },
  });
  const boxB = Bodies.rectangle(450, 50, 256, 256, {
    render: {
      sprite: {
        texture: "/martin-portfolio/images/1.jpeg",
        xScale: 1,
        yScale: 1,
      },
    },
  });
  const ground = Bodies.rectangle(
    window.innerWidth / 2,
    window.innerHeight - 100,
    window.innerWidth,
    30,
    { isStatic: true }
  );

  // Run the renderer
  Render.run(render);

  // Run the engine
  Runner.run(runner, engine);

  // Add ground to world
  Composite.add(engine.world, ground);

  // Set canvas size
  const canvas = document.getElementsByTagName("canvas")[0];
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const onDisplayImages = () => World.add(engine.world, [boxA, boxB]);

  return <Controls onDisplayImages={() => onDisplayImages()} />;
}
