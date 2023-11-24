import React, { useEffect, useRef } from 'react';
import { IPosition } from '../../../../common/models';
import './player-pointer.css';

interface IProps {
  pointers: Array<{ tagName: string; probability: number; boundingBox: any }>;
}

export const PlayerPointer: React.FC<IProps> = (props) => {
  const magnifierRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const magnifier = magnifierRef.current;

    if (magnifier) {
      const magnifierSize = 100; // Size of the magnifying glass
      const magnification = 2; // Magnification level

      const x1 = props.pointers[0].boundingBox.x1 - magnifierSize / 2;
      const y1 = props.pointers[0].boundingBox.y1 - magnifierSize / 2;
      const x2 = props.pointers[0].boundingBox.x2 + magnifierSize / 2;
      const y2 = props.pointers[0].boundingBox.y2 + magnifierSize / 2;

      magnifier.style.left = `${x1}px`;
      magnifier.style.top = `${y1}px`;
      magnifier.style.width = `${x2 - x1}px`;
      magnifier.style.height = `${y2 - y1}px`;
      magnifier.style.backgroundPosition = `-${x1 * magnification}px -${y1 * magnification}px`;
      magnifier.style.backgroundSize = `${window.innerWidth * magnification}px ${window.innerHeight * magnification}px`;
      magnifier.style.backgroundImage = `url(${document.body.style.backgroundImage})`;

      // Dispatch custom event when the component mounts
      const customPointerReadyEvent = new Event('customPointerReady');
      console.log('customPointerReadyEvent:', customPointerReadyEvent);

      document.dispatchEvent(customPointerReadyEvent);

      // Simulate CustomEvent when the pointer's tagName is "angled" and probability is greater than 0.9
      if (props.pointers[0].tagName === 'angled' && props.pointers[0].probability > 0.7) {
        const objectFoundEvent = new CustomEvent('objectfound', {
          detail: {
            pointers: props.pointers,
          },
        });

        console.log('objectFoundEvent:', objectFoundEvent);
        document.dispatchEvent(objectFoundEvent);
      }
    }
  }, [props.pointers]);
  if (props.pointers.length === 0 || !props.pointers[0].boundingBox) {
    return null; // or render a loading indicator, or an empty div
  }
  return (
    <div
      ref={magnifierRef}
      className='playerPointer'
      style={{
        left: `${props.pointers[0].boundingBox.x1}px`, // Adjust this if you want to use x and y directly
        top: `${props.pointers[0].boundingBox.y1}px`, // Adjust this if you want to use x and y directly
        width: `${props.pointers[0].boundingBox.x2 - props.pointers[0].boundingBox.x1}px`,
        height: `${props.pointers[0].boundingBox.y2 - props.pointers[0].boundingBox.y1}px`,
      }}
    ></div>
  );
};
