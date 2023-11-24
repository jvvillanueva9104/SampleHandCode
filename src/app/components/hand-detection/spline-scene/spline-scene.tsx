import { useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import _debounce from 'lodash/debounce';

const DynamicSpline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

export default function SplineScene() {
  const splineRef = useRef<any>();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const handlePointerDown = _debounce(
      (event: any) => {
        const objectId = 'Watering Can';
        splineRef.current.emitEvent('mouseDown', objectId);
        console.log('------mouseDown event emitted');
      },
      100,
      { leading: true, trailing: false }
    );

    const checkAndAddListener = () => {
      const customPointer = document.querySelector('.playerPointer');
      console.log('customPointer entered');
      console.log('customPointer:', customPointer);

      if (customPointer) {
        document.addEventListener('angledObject', handlePointerDown as EventListener)
        console.log('Event listener added');
        clearInterval(intervalId);
      } else {
        console.log('No pointers available');
      }
    };

    // Check for the custom pointer element every 100ms
    intervalId = setInterval(checkAndAddListener, 100);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('objectfound', handlePointerDown as EventListener);
    };
  }, []); /// Effect runs once on component mount

  return (
    <div>
      <DynamicSpline
        scene='https://prod.spline.design/9FwlvgYickRNrttQ/scene.splinecode'
        onLoad={(spline: any) => {
          splineRef.current = spline;
        }}
        onMouseDown={(event: any) => {
          console.log('Event:', event);
        }}
      />
    </div>
  );
}
