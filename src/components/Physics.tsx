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

  const displayBoxes = () => {
    boxes = boxesProperties.map((b, i) => ({
      w: b.width,
      h: b.height,
      body: Matter.Bodies.rectangle(b.x, b.y, b.width, b.height),
      elem: document.querySelector(`#box-${i}`) as HTMLDivElement,
      backgroundImageSrc: b.src,
    }));

    Composite.add(
      engine.world,
      boxes.map((b) => b.body),
    );

    rerender();
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

    boxes = boxesProperties.map((b, i) => ({
      w: b.width,
      h: b.height,
      body: Matter.Bodies.rectangle(b.x, b.y, b.width, b.height),
      elem: document.querySelector(`#box-${i}`) as HTMLDivElement,
      backgroundImageSrc: b.src,
    }));

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

  const onClick = async () => {
    displayBoxes();
  };

  return (
    <main>
      {/* <div className="box" id="box-0">
        text
      </div> */}
      <div className="box" id="box-0"></div>
      <div className="box" id="box-1"></div>
      <div className="box" id="box-2"></div>
      <div className="box" id="box-3"></div>
      <div id="physics-container"></div>

      <div className="content">
        {locale === "en" ? (
          <div>
            Martin Lezhenin is a{" "}
            <a className="link" onClick={() => onClick()}>
              graphic designer
            </a>
            ,{" "}
            <a className="link" onClick={() => onClick()}>
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

        <div className="footer">
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
        </div>
      </div>
    </main>
  );
}
