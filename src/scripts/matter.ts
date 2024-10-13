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

  const fakeBodiesIdsByElements: Record<string, number> = {};

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

      fakeBodiesIdsByElements[socialId] = circleFake.id;

      return circleFake;
    })
    .filter((c) => !!c);

  const getEmailFake = () => {
    const emailReal = document.querySelector("#email");
    if (!emailReal) return;
    const { top: emailY, left: emailX } = emailReal.getBoundingClientRect();

    const emailFake = Matter.Bodies.rectangle(
      emailX + emailReal.clientWidth / 2,
      emailY + emailReal.clientHeight / 2,
      emailReal.clientWidth,
      emailReal.clientHeight,
      {
        isStatic: true,
        render: { fillStyle: "transparent" },
        collisionFilter: { category: fakeElementsCategory },
      },
    );

    fakeBodiesIdsByElements.email = emailFake.id;

    return emailFake;
  };

  const fakes = [...circles, getEmailFake()].filter((b) => !!b);

  Matter.Composite.add(engine.world, [
    boxA,
    boxB,
    ground,
    leftWall,
    rightWall,
    ...fakes,
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

  // click fake bodies
  Matter.Events.on(mouseConstraint, "mousedown", () => {
    const clickedMultiple =
      Matter.Query.point(engine.world.bodies, mouseConstraint.mouse.position)
        .length > 1;
    if (clickedMultiple) return;

    const clickedFake = fakes.find((circle) => {
      return (
        Matter.Query.point([circle], mouseConstraint.mouse.position).length ===
        1
      );
    });

    if (clickedFake) {
      const elementId = Object.entries(fakeBodiesIdsByElements).find(
        ([_, bodyId]) => bodyId === clickedFake.id,
      )?.[0];
      const elementReal = document.querySelector(
        `#${elementId}`,
      ) as HTMLAnchorElement;
      if (!elementReal) return;
      elementReal.click();
    }
  });

  // change cursor when hovering fake bodies
  Matter.Events.on(runner, "tick", () => {
    const hoveredFakes =
      Matter.Query.point(fakes, mouseConstraint.mouse.position).length === 1;

    if (hoveredFakes) {
      const hoveredMultiple =
        Matter.Query.point(engine.world.bodies, mouseConstraint.mouse.position)
          .length > 1;
      if (hoveredMultiple) return;

      (container as HTMLElement).style.cursor = "pointer";
    } else {
      (container as HTMLElement).style.cursor = "inherit";
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
