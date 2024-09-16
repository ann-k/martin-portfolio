import Matter from "matter-js";

import type pType from "p5";
import { makeBox } from "./box";

const boxesProperties = [
  {
    width: 256,
    height: 256,
    x: 500,
    // y: 0,
    y: 100,
    // src: "/martin-portfolio/images/1.jpeg",
    src: "/images/1.jpeg",
  },
  {
    width: 150,
    height: 92,
    x: 550,
    // y: -50,
    y: 100,
    // src: "/martin-portfolio/images/2.jpeg",
    src: "/images/2.jpeg",
  },
  {
    width: 150,
    height: 156,
    x: 200,
    // y: 0,
    y: 100,
    // src: "/martin-portfolio/images/3.jpeg",
    src: "/images/3.jpeg",
  },
  {
    width: 240,
    height: 166,
    x: 600,
    // y: -50,
    y: 100,
    // src: "/martin-portfolio/images/4.jpeg",
    src: "/images/4.jpeg",
  },
];

export const mySketch = (p: pType) => {
  let maxSize = 500;
  let wspeed = 1.66;
  let hspeed = 1.33;
  let w = 0;
  let h = maxSize;
  let r = 0;

  const {
    Engine,
    // Render,
    Runner,
    Bodies,
    Composite,
    MouseConstraint,
    Mouse,
  } = Matter;

  let engine: Matter.Engine;
  let world: Matter.World;
  let runner: Matter.Runner;

  let myBoxes: Matter.Body[] = [];

  const { add, show } = makeBox({ w: 250, h: 250, x: 100, y: 100, p });

  p.setup = () => {
    p.createCanvas(window.innerWidth, window.innerHeight);

    // Create an engine
    engine = Engine.create();
    world = engine.world;

    // deprecated
    // Engine.run(engine);
    // Create runner
    runner = Runner.create();
    // Run the engine
    Runner.run(runner, engine);

    p.strokeWeight(0);
    p.background(0);

    add(world);

    // myBoxes = boxesProperties.map((b) =>
    //   Bodies.rectangle(b.x, b.y, b.width, b.height, {
    //     render: {
    //       sprite: {
    //         texture: b.src,
    //         xScale: 1,
    //         yScale: 1,
    //       },
    //     },
    //   }),
    // );

    // const ground = Bodies.rectangle(
    //   window.innerWidth / 2,
    //   window.innerHeight - 100,
    //   window.innerWidth,
    //   30,
    //   { isStatic: true },
    // );

    // Composite.add(engine.world, [ground, ...myBoxes]);

    // console.log(myBoxes);
  };

  p.draw = () => {
    p.background(51);

    // myBoxes.forEach((myBox, i) => {
    //   p.rect(
    //     myBox.position.x,
    //     myBox.position.y,
    //     boxesProperties[i].width,
    //     boxesProperties[i].height,
    //   );
    // });

    show();

    // // Draw an ellipse
    // p.translate(p.width / 2, p.height / 2);
    // p.rotate(r);
    // p.fill(0, 1);
    // p.stroke(5);
    // p.ellipse(0, 0, w, h);

    // Updating rotation and increment values
    // r = r + 0.015;
    // w = w + wspeed;
    // h = h + hspeed;
    // if (w < 0 || w > maxSize) wspeed *= -1;
    // if (h < 0 || h > maxSize) hspeed *= -1;
  };

  p.windowResized = () => {
    p.resizeCanvas(window.innerWidth, window.innerHeight);
  };
};
