import { Bodies, Composite } from "matter-js";
import type pType from "p5";

export function makeBox({
  x,
  y,
  w,
  h,
  src,
  p,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  src?: string;

  p: pType;
}) {
  let position = { x, y };

  const add = (world: Parameters<typeof Composite.add>[0]) => {
    const body = Bodies.rectangle(
      x,
      y,
      w,
      h,
      src
        ? {
            render: {
              sprite: {
                texture: src,
                xScale: 1,
                yScale: 1,
              },
            },
          }
        : {},
    );

    Composite.add(world, body);

    position = { x: body.position.x, y: body.position.y };

    return body;
  };

  const show = () => {
    p.push();
    p.translate(position.x, position.y);
    p.rect(0, 0, w, h);
    p.pop();
  };

  return { add, show };
}
