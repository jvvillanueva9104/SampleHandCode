import * as cvstfjs from '@microsoft/customvision-tfjs';
import { proxy, useSnapshot } from 'valtio';
// import { IPosition } from '../../../common/models';
import { videoSize } from '../camera/camera-store';
import { IPosition } from '../../../common/models';

const modelPath = '/model.json';

interface IObject {
  pointers: Array<{ tagName: string; probability: number; boundingBox: any }>;
}

const objectState = proxy<IObject>({
  pointers: [],
});

let detector = new cvstfjs.ObjectDetectionModel();

export const useObjectState = (): IObject => {
  return useSnapshot(objectState as any);
};

export const initObjectDetection = async () => {
  try {
    if (detector === null) {
      console.error('Object detector not initialized.');
      return;
    }

    await detector.loadModelAsync(modelPath);

    console.log('Object detection model loaded successfully.');
  } catch (error) {
    console.error('Error loading object detection model:', error);
  }
};

export const detectObject = async (canvas: HTMLCanvasElement, timeoutMilliseconds: number = 3000) => {
  if (detector) {
    try {
      const predictions = await detector.executeAsync(canvas);
      console.log('predictions: ', predictions);

      objectState.pointers = [];

      // Assuming predictions is an array with bounding boxes, probabilities, and class ids
      const [boundingBoxes, probabilities, classIds] = predictions;

      const maxProbabilityIndex = probabilities.indexOf(Math.max(...probabilities));

      const boundingBox = boundingBoxes[maxProbabilityIndex];
      const probability = probabilities[maxProbabilityIndex];
      const classId = classIds[maxProbabilityIndex];

      // console.log('boundingBox: ', boundingBox);
      console.log('probability: ', probability);
      // console.log('classId: ', classId);

      // Assuming classId corresponds to the index of your classes or tags
      const tagName = getTagNameFromClassId(classId); // Implement a function to map classId to tagName
      console.log('tagName: ', tagName);

      // Scale bounding box coordinates to screen
      const scaledBoundingBox = {
        x1: (window.innerWidth / videoSize.width) * boundingBox[0],
        y1: (window.innerHeight / videoSize.height) * boundingBox[1],
        x2: (window.innerWidth / videoSize.width) * boundingBox[2],
        y2: (window.innerHeight / videoSize.height) * boundingBox[3],
      };
      // console.log('scaledBoundingBox: ', scaledBoundingBox);

      // Update pointers in objectState
      updatePointers(tagName, probability, scaledBoundingBox);
      // console.log('objectState: ', objectState);

      
      // Trigger custom events when tagName is angled and probability is greater than 0.8
      if (tagName === 'angled' && probability > 0.8) {
        const angledEvent = new CustomEvent('angledObject', {
          detail: {
            tagName: tagName,
            probability: probability,
            boundingBox: scaledBoundingBox,
          },
        });

        console.log('angledEvent: ', angledEvent);

        document.dispatchEvent(angledEvent);
      }
    } catch (error) {
      console.error('Error detecting object:', error);
    }
  }
};

export const updatePointers = (tagName: string, probability: number, boundingBox: any) => {
  objectState.pointers.push({ tagName, probability, boundingBox });
};

const getTagNameFromClassId = (classId: number): string => {
  const classMapping: Record<number, string> = {
    0: 'angled',
    1: 'non-angled',
    // Add more mappings as needed
  };

  return classMapping[classId] || `Unknown_${classId}`;
};

