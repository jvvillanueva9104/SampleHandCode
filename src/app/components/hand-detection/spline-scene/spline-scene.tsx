import { useRef, useEffect } from "react";
import dynamic from "next/dynamic";

const DynamicSpline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

export default function SplineScene() {
  const splineRef = useRef<any>();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const handlePointerMove = (event: any) => {
      console.log("Mouse Over - Custom Pointer");

      if (splineRef.current && splineRef.current.app) {
        const canvas = splineRef.current.app.getCanvas();
        const pointerEvent = new PointerEvent("mousemove", {
          bubbles: true,
          clientX: event.clientX,
          clientY: event.clientY,
        });
        canvas.dispatchEvent(pointerEvent);

        // Trigger spline events on mouse move
        const objectId = "Little"; // Replace with the actual ID of your object
        splineRef.current.emitEvent("lookAt", objectId);
      }
    };

    const checkAndAddListener = () => {
      const customPointer = document.querySelector(".playerPointer");
      console.log("Custom Pointer Element:", customPointer);

      if (customPointer) {
        document.addEventListener("mousemove", handlePointerMove);
        clearInterval(intervalId);
      }
    };

    // Check for the custom pointer element every 100ms
    intervalId = setInterval(checkAndAddListener, 100);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("mousemove", handlePointerMove);
    };
  }, []); // Effect runs once on component mount

  return (
    <div>
      <DynamicSpline
        scene="https://prod.spline.design/lJIwL079oOix1QHU/scene.splinecode"
        onLoad={(spline: any) => {
          splineRef.current = spline;
        }}
      />
    </div>
  );
}

import Spline from "@splinetool/react-spline";

export default function App() {
  return (
    <Spline scene="https://prod.spline.design/tksKz2vL1I1Eps9D/scene.splinecode" />
  );
}
