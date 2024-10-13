import Matter from "matter-js";

export function doIt() {
  const container = document.querySelector("#physics-container");
  if (!container) return;

  const groundThickness = 60;

  const defaultCategory = 0x0001;
  const fakeElementsCategory = 0x0002;

  const engine = Matter.Engine.create();
  const runner = Matter.Runner.create();

  const render = Matter.Render.create({
    element: container as HTMLElement,
    engine: engine,
    options: {
      width: container.clientWidth,
      height: container.clientHeight,
      wireframes: false,
      background: "transparent",
    },
  });

  const boxA = Matter.Bodies.rectangle(400, 200, 80, 80, {
    collisionFilter: { mask: defaultCategory },
  });
  const boxB = Matter.Bodies.rectangle(450, 50, 80, 80, {
    collisionFilter: { mask: defaultCategory },
  });
  const ground = Matter.Bodies.rectangle(
    container.clientWidth / 2,
    container.clientHeight + groundThickness / 2,
    10000, // could be container.clientWidth. changed to support window resize
    groundThickness,
    {
      isStatic: true,
    },
  );
  const leftWall = Matter.Bodies.rectangle(
    0 - groundThickness / 2,
    container.clientHeight / 2,
    groundThickness,
    container.clientHeight * 5,
    { isStatic: true },
  );
  const rightWall = Matter.Bodies.rectangle(
    container.clientWidth + groundThickness / 2,
    container.clientHeight / 2,
    groundThickness,
    container.clientHeight * 5,
    { isStatic: true },
  );

  const circlesIdsByElements: Record<string, number> = {};

  const circles = ["ig", "li", "tg"]
    .map((socialId) => {
      const circleReal = document.querySelector(`#${socialId}`);
      if (!circleReal) return;
      const { top: circleY, left: circleX } =
        circleReal.getBoundingClientRect();
      const circleWidth = circleReal.clientWidth;
      const circleRadius = circleWidth / 2;
      const circleFake = Matter.Bodies.circle(
        circleX + circleRadius,
        circleY + circleRadius,
        circleRadius + 12, // add 12 because matter js does not register click on the edges of bodies
        {
          isStatic: true,
          render: { fillStyle: "transparent" },
          collisionFilter: { category: fakeElementsCategory },
        },
      );

      circlesIdsByElements[socialId] = circleFake.id;

      return circleFake;
    })
    .filter((c) => !!c);

  Matter.Composite.add(engine.world, [
    boxA,
    boxB,
    ground,
    leftWall,
    rightWall,
    ...circles,
  ]);

  const mouse = Matter.Mouse.create(render.canvas);
  const mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse,
    constraint: {
      stiffness: 0.2,
      render: { visible: true },
    },
    collisionFilter: { mask: defaultCategory }, // so that it does not try to drag fake elements
  });

  // click socials (circle buttons)
  Matter.Events.on(mouseConstraint, "mousedown", (e) => {
    const clickedMultiple =
      Matter.Query.point(engine.world.bodies, mouseConstraint.mouse.position)
        .length > 1;
    if (clickedMultiple) return;

    const clickedCircle = circles.find((circle) => {
      return (
        Matter.Query.point([circle], mouseConstraint.mouse.position).length ===
        1
      );
    });

    if (clickedCircle) {
      const elementId = Object.entries(circlesIdsByElements).find(
        ([_, bodyId]) => bodyId === clickedCircle.id,
      )?.[0];
      const circleTg = document.querySelector(
        `#${elementId}`,
      ) as HTMLAnchorElement;
      if (!circleTg) return;
      circleTg.click();
    }
  });

  Matter.Composite.add(engine.world, mouseConstraint);

  Matter.Render.run(render);
  Matter.Runner.run(runner, engine);

  function handleResize(c: HTMLElement) {
    render.canvas.width = c.clientWidth;
    render.canvas.height = c.clientHeight;
    Matter.Body.setPosition(
      ground,
      Matter.Vector.create(
        c.clientWidth / 2,
        c.clientHeight + groundThickness / 2,
      ),
    );
    Matter.Body.setPosition(
      rightWall,
      Matter.Vector.create(
        c.clientWidth + groundThickness / 2,
        c.clientHeight / 2,
      ),
    );
  }
  window.addEventListener("resize", () =>
    handleResize(container as HTMLElement),
  );
}
