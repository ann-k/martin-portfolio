import { useEffect } from "react";
import Matter from "matter-js";

export function Physics() {
  useEffect(() => {
    // module aliases
    var Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite;

    // create an engine
    var engine = Engine.create();

    // create a renderer
    var render = Render.create({
      element: document.body,
      engine: engine,
    });

    render.options.wireframes = false;
    render.options.background = "white";

    // run the renderer
    Render.run(render);

    // create runner
    var runner = Runner.create();

    // run the engine
    Runner.run(runner, engine);

    // create two boxes and a ground
    var boxA = Bodies.rectangle(400, 200, 256, 256, {
      render: {
        sprite: { texture: "/martin-portfolio/images/1.jpeg" },
      },
    });
    var boxB = Bodies.rectangle(450, 50, 256, 256, {
      render: {
        sprite: { texture: "/martin-portfolio/images/1.jpeg" },
      },
    });
    var ground = Bodies.rectangle(400, 610, 810, 30, { isStatic: true });

    // add all of the bodies to the world
    Composite.add(engine.world, [boxA, boxB, ground]);

    // set canvas size
    var canvas = document.getElementsByTagName("canvas")[0];
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener("resize", function () {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  });

  return null;
}
