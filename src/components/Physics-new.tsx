import { useEffect, useRef } from "react";

import p5 from "p5";

import { mySketch } from "../scripts/sketch";

export function Physics() {
  const canvasRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return console.log("no canvas detected");
    }

    new p5(mySketch, canvas);
  });

  return <div ref={canvasRef} />;
}
