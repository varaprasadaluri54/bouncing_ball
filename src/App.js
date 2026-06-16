import "./styles.css";
import { useRef, useState, useEffect } from "react";
export default function App() {
  const canvasRef = useRef(null);
  const [restitution, setRestiitution] = useState(0.78);
  const [gravity, setGravity] = useState(980);
  const animRef = useRef(0);
  const dropBall = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    cancelAnimationFrame(animRef.current);

    const radius = 24;
    const squashRef = { v: 1 };
    let y = radius;
    let vy = 0;
    let x = canvas.width / 2;
    const floor = () => canvas.height - radius - 4;

    let last = performance.now();

    const draw = (now) => {
      const dt = Math.min((now - last) / 1000, 0.032);
      last = now;
      vy += gravity * dt;
      y += vy * dt;

      const f = floor();
      if (y > +f) {
        y = f;
        vy = -vy * restitution;
        squashRef.v = 0.65;
        if (Math.abs(vy) < 40) vy = 0;
      } else {
        squashRef.v += (1 - squashRef.v) * 8 * dt;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, f + radius + 4);
      ctx.lineTo(canvas.width, f + radius + 4);
      ctx.stroke();

      ctx.fillStyle = "#6366f1";
      ctx.beginPath();
      ctx.ellipse(
        x,
        y,
        radius * (2 - squashRef.v),
        radius * squashRef.v,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();

      if (vy !== 0 || squashRef.v < 0.99) {
        animRef.current = requestAnimationFrame(draw);
      }
    };
    animRef.current = requestAnimationFrame(draw);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    dropBall();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  useEffect(() => {
    dropBall();
  }, [restitution, gravity]);

  return (
    <div className="lab-page">
      <div className="lab-header">
        <h1>Step 12 - Bouncing Ball physics</h1>
        <p>Gravity, velocity</p>

        <div className="ball-controls">
          <button className="btn btn-primary" onClick={dropBall}>
            Drop again
          </button>
          <label htmlFor="">
            Bounce (restitution): {restitution.toFixed(2)}
            <input
              type="range"
              min={0.3}
              max={0.95}
              step={0.1}
              value={restitution}
              onChange={(e) => setRestiitution(Number(e.target.value))}
            />
          </label>
          <label>
            Gravity :{gravity}
            <input
              type="range"
              min={200}
              max={2000}
              step={10}
              value={gravity}
              onChange={(e) => setGravity(Number(e.target.value))}
            />
          </label>
        </div>
        <div className="ball-canvas-wrap">
          <canvas ref={canvasRef} className="ball-canvas"></canvas>
        </div>
      </div>
    </div>
  );
}
