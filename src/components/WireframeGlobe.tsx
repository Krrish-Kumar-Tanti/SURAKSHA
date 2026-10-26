import React, { useEffect, useRef } from 'react';

export function WireframeGlobe() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 750);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight || 750;
    };
    window.addEventListener('resize', handleResize);

    // Mouse tilt tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = ((e.clientX - rect.left) / width - 0.5) * 0.4;
      targetMouseY = ((e.clientY - rect.top) / height - 0.5) * 0.3;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let time = 0;
    let globeAngle = 0;

    // 3D Perspective Projection with FOV
    const project = (x: number, y: number, z: number, cx: number, cy: number, fov: number = 550) => {
      const pz = z + fov;
      if (pz <= 1) return { x: cx, y: cy, scale: 0, visible: false };
      const scale = fov / pz;
      return {
        x: cx + x * scale,
        y: cy + y * scale,
        scale,
        visible: pz > 10,
      };
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.08;
      mouseY += (targetMouseY - mouseY) * 0.08;
      time += 0.028; // Increased for visible wave motion
      globeAngle += 0.014; // Increased for clear rotation

      // -------------------------------------------------------------
      // 1. DRAW DRAMATIC 3D PERSPECTIVE TERRAIN MESH (Left and Center)
      // -------------------------------------------------------------
      ctx.save();
      const cols = 28;
      const rows = 20;
      const spacing = 68;

      // Center of projection tilted isometrically
      const gridCenterX = width * 0.42;
      const gridCenterY = height * 0.48;

      // Grid rotation matrix (steep 3D angle like the reference photo)
      const pitch = 0.85 + mouseY * 0.4; // Tilted towards viewer
      const yaw = -0.45 + mouseX * 0.5;   // Angled from top-left to bottom-right

      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);

      const gridPoints: { p: any; px: number; py: number }[][] = [];

      for (let r = 0; r < rows; r++) {
        gridPoints[r] = [];
        for (let c = 0; c < cols; c++) {
          const rawX = (c - cols * 0.45) * spacing;
          const rawZ = (r - rows * 0.35) * spacing;

          // Multi-frequency organic 3D wave elevation
          const wave1 = Math.sin(c * 0.28 + time * 0.9) * Math.cos(r * 0.22 + time * 0.7) * 48;
          const wave2 = Math.sin((c + r) * 0.2 + time * 0.6) * 22;
          const rawY = wave1 + wave2 + (r * 8);

          // Apply 3D Rotation (Pitch & Yaw)
          // Rotate around Y (yaw)
          const yx = rawX * cosY - rawZ * sinY;
          const yz = rawX * sinY + rawZ * cosY;

          // Rotate around X (pitch)
          const px = yx;
          const py = rawY * cosP - yz * sinP;
          const pz = rawY * sinP + yz * cosP;

          const proj = project(px, py, pz + 200, gridCenterX, gridCenterY, 600);
          gridPoints[r][c] = { p: proj, px, py };
        }
      }

      // Draw Grid Lines in high-contrast dark charcoal (matching reference)
      ctx.strokeStyle = 'rgba(28, 22, 22, 0.62)';
      ctx.lineWidth = 1.15;

      // Horizontal mesh curves
      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        let started = false;
        for (let c = 0; c < cols; c++) {
          const pt = gridPoints[r][c].p;
          if (pt.visible) {
            if (!started) {
              ctx.moveTo(pt.x, pt.y);
              started = true;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          }
        }
        ctx.stroke();
      }

      // Longitudinal mesh curves
      for (let c = 0; c < cols; c++) {
        ctx.beginPath();
        let started = false;
        for (let r = 0; r < rows; r++) {
          const pt = gridPoints[r][c].p;
          if (pt.visible) {
            if (!started) {
              ctx.moveTo(pt.x, pt.y);
              started = true;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          }
        }
        ctx.stroke();
      }

      // Draw prominent dark vertex dots at mesh intersections
      ctx.fillStyle = 'rgba(20, 15, 15, 0.9)';
      for (let r = 0; r < rows; r += 2) {
        for (let c = 0; c < cols; c += 2) {
          const pt = gridPoints[r][c].p;
          if (pt.visible && pt.scale > 0.4) {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, Math.max(1.2, 2.4 * pt.scale), 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      ctx.restore();

      // -------------------------------------------------------------
      // 2. DRAW 3D WIREFRAME GLOBE WITH SPIKES & SPECTRUM WAVE (Right)
      // -------------------------------------------------------------
      const sphereCenterX = width > 1024 ? width * 0.77 : width * 0.82;
      const sphereCenterY = height * 0.46;
      const sphereRadius = width > 1024 ? 185 : width > 768 ? 145 : 110;

      ctx.save();

      // Dense Wireframe Rings (Latitude & Longitude) in dark charcoal
      ctx.strokeStyle = 'rgba(25, 20, 20, 0.82)';
      ctx.lineWidth = 1.25;

      const tiltX = 0.28 + mouseY * 0.5;
      const tiltZ = -0.15;

      // Rotate point in 3D around Globe Center
      const rotSpherePoint = (x: number, y: number, z: number, angleY: number) => {
        // Rotate around Y
        const cosY = Math.cos(angleY);
        const sinY = Math.sin(angleY);
        const x1 = x * cosY + z * sinY;
        const z1 = -x * sinY + z * cosY;

        // Tilt around X
        const cosX = Math.cos(tiltX);
        const sinX = Math.sin(tiltX);
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;

        return { x: x1, y: y2, z: z2 };
      };

      // Latitude rings (horizontal circles)
      const latCount = 14;
      for (let i = 1; i < latCount; i++) {
        const theta = (i / latCount) * Math.PI;
        const rRing = sphereRadius * Math.sin(theta);
        const yRing = sphereRadius * Math.cos(theta);

        ctx.beginPath();
        const steps = 44;
        for (let j = 0; j <= steps; j++) {
          const phi = (j / steps) * Math.PI * 2;
          const x = rRing * Math.cos(phi);
          const z = rRing * Math.sin(phi);

          const rot = rotSpherePoint(x, yRing, z, globeAngle);
          const proj = project(rot.x, rot.y, rot.z, sphereCenterX, sphereCenterY, 650);

          if (j === 0) ctx.moveTo(proj.x, proj.y);
          else ctx.lineTo(proj.x, proj.y);
        }
        ctx.stroke();
      }

      // Longitude rings (vertical circles)
      const lonCount = 16;
      for (let i = 0; i < lonCount; i++) {
        const basePhi = (i / lonCount) * Math.PI;
        ctx.beginPath();
        const steps = 44;
        for (let j = 0; j <= steps; j++) {
          const theta = (j / steps) * Math.PI * 2;
          const x = sphereRadius * Math.sin(theta) * Math.cos(basePhi);
          const y = sphereRadius * Math.cos(theta);
          const z = sphereRadius * Math.sin(theta) * Math.sin(basePhi);

          const rot = rotSpherePoint(x, y, z, globeAngle);
          const proj = project(rot.x, rot.y, rot.z, sphereCenterX, sphereCenterY, 650);

          if (j === 0) ctx.moveTo(proj.x, proj.y);
          else ctx.lineTo(proj.x, proj.y);
        }
        ctx.stroke();
      }

      // Outer Sphere Border Rim
      ctx.beginPath();
      ctx.arc(sphereCenterX, sphereCenterY, sphereRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(20, 15, 15, 0.9)';
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // -------------------------------------------------------------
      // 3. RADIATING 3D WHITE BURST SPIKES (Shooting outward from sphere)
      // -------------------------------------------------------------
      const spikeCount = 52;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.92)';
      ctx.lineWidth = 1.2;

      for (let s = 0; s < spikeCount; s++) {
        const phi = (s / spikeCount) * Math.PI * 2 + globeAngle * 0.4;
        const theta = Math.sin(s * 1.7) * 0.8 + Math.PI / 2;

        const innerR = sphereRadius - 2;
        // Varied spike lengths matching the reference image
        const spikeLen = (s % 4 === 0 ? 55 : s % 2 === 0 ? 32 : 18) + Math.sin(time * 3 + s) * 6;
        const outerR = sphereRadius + spikeLen;

        const xDir = Math.sin(theta) * Math.cos(phi);
        const yDir = Math.cos(theta);
        const zDir = Math.sin(theta) * Math.sin(phi);

        const innerRot = rotSpherePoint(xDir * innerR, yDir * innerR, zDir * innerR, globeAngle);
        const outerRot = rotSpherePoint(xDir * outerR, yDir * outerR, zDir * outerR, globeAngle);

        const p1 = project(innerRot.x, innerRot.y, innerRot.z, sphereCenterX, sphereCenterY, 650);
        const p2 = project(outerRot.x, outerRot.y, outerRot.z, sphereCenterX, sphereCenterY, 650);

        if (p1.visible && p2.visible) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      // -------------------------------------------------------------
      // 4. CENTRAL VERTICAL WHITE SPECTRUM WAVEFORM CORE
      // -------------------------------------------------------------
      // In the reference, there is a dense vertical waveform / soundwave band inside the sphere!
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.lineWidth = 1.35;

      const bandWidth = sphereRadius * 0.45;
      const linesInBand = 24;

      for (let b = 0; b < linesInBand; b++) {
        const bx = -bandWidth / 2 + (b / linesInBand) * bandWidth;
        const centerFactor = 1 - Math.abs(bx / (bandWidth / 2));
        // Vertical waveform height
        const waveHeight = (sphereRadius * 0.72) * Math.pow(centerFactor, 0.5) * (0.8 + Math.sin(b * 0.7 + time * 4) * 0.2);

        const topPt = rotSpherePoint(bx, -waveHeight, 0, globeAngle);
        const btmPt = rotSpherePoint(bx, waveHeight, 0, globeAngle);

        const pTop = project(topPt.x, topPt.y, topPt.z, sphereCenterX, sphereCenterY, 650);
        const pBtm = project(btmPt.x, btmPt.y, btmPt.z, sphereCenterX, sphereCenterY, 650);

        ctx.beginPath();
        ctx.moveTo(pTop.x, pTop.y);
        ctx.lineTo(pBtm.x, pBtm.y);
        ctx.stroke();
      }

      ctx.restore();
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
