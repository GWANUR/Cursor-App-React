import React, { useEffect, useRef } from "react";
import "./JSCursor.css";

export default function JSCursor() {
  const cursorRef = useRef(null);

  const stateRef = useRef({
    targetX: window.innerWidth / 2,
    targetY: window.innerHeight / 2,
    currentX: window.innerWidth / 2,
    currentY: window.innerHeight / 2,
    lastX: window.innerWidth / 2,
    lastY: window.innerHeight / 2,
    raf: null,
  });

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    function onMouseMove(e) {
      stateRef.current.targetX = e.clientX;
      stateRef.current.targetY = e.clientY;
    }
    function onEnterLink() {
      cursor.classList.add("hover");
    }
    function onLeaveLink() {
      cursor.classList.remove("hover");
    }
    const links = document.querySelectorAll(".ActiveHover");
    links.forEach((a) => {
      a.addEventListener("mouseenter", onEnterLink);
      a.addEventListener("mouseleave", onLeaveLink);
    });
    function onMouseDown() {
      cursor.classList.add("click");
    }
    function onMouseUp() {
      cursor.classList.remove("click");
    }
    function onMouseLeaveWindow() {
      cursor.style.opacity = "0";
    }
    function onMouseEnterWindow() {
      cursor.style.opacity = "1";
    }
    function animate() {
      const s = stateRef.current;
      const ease = 0.18;
      s.currentX += (s.targetX - s.currentX) * ease;
      s.currentY += (s.targetY - s.currentY) * ease;

      const dx = s.currentX - s.lastX;
      const dy = s.currentY - s.lastY;
      const speed = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      const maxStretch = 1.6;
      const speedFactor = Math.min(speed * 0.12, maxStretch - 1);
      const stretch = 1 + speedFactor;
      const squash = 1 - Math.min(speedFactor * 0.35, 0.45);

      const tx = Math.round(s.currentX);
      const ty = Math.round(s.currentY);

      cursor.style.transform =
        `translate3d(${tx}px, ${ty}px, 0) translate(-50%, -50%) ` +
        `rotate(${angle}deg) scale(${stretch}, ${squash})`;

      const sizeBase = 20;
      const extraSize = Math.min(speed * 0.12, 12);
      cursor.style.width = `${sizeBase + extraSize}px`;
      cursor.style.height = `${sizeBase + extraSize}px`;

      s.lastX = s.currentX;
      s.lastY = s.currentY;

      s.raf = requestAnimationFrame(animate);
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mouseleave", onMouseLeaveWindow);
    window.addEventListener("mouseenter", onMouseEnterWindow);
    if (!stateRef.current.raf) stateRef.current.raf = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mouseleave", onMouseLeaveWindow);
      window.removeEventListener("mouseenter", onMouseEnterWindow);
      links.forEach((a) => {
        a.removeEventListener("mouseenter", onEnterLink);
        a.removeEventListener("mouseleave", onLeaveLink);
      });
      if (stateRef.current.raf) {
        cancelAnimationFrame(stateRef.current.raf);
        stateRef.current.raf = null;
      }
    };
  }, []);
  return <div ref={cursorRef} className="JSCursor" aria-hidden="true" />;
}
