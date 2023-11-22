import * as cvstfjs from '@microsoft/customvision-tfjs';
import { proxy, useSnapshot } from 'valtio';
import { IPosition } from '../../../common/models';
import { videoSize } from '../camera/camera-store';

const modelPath = '/model.json';

interface IObject {
  pointers: Array<IPosition>;
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

    const loadedModel = await detector.loadModelAsync(modelPath);
    console.log('loadedModel: ', loadedModel);

    console.log('Object detection model loaded successfully.');
  } catch (error) {
    console.error('Error loading object detection model:', error);
  }
};

export const detectObject = async (canvas: HTMLCanvasElement) => {

  if (detector) {
    const predictions = await detector.executeAsync(canvas);
    console.log('predictions: ', predictions);

    objectState.pointers = [];
    predictions.forEach((prediction: any, index: any) => {
      const point = prediction.boundingBox;
      if (point) {
        objectState.pointers.push(scaleToScreen(point));

        // Trigger custom events based on object position
        const objectEvent = new CustomEvent('objectmove', {
          detail: {
            x: point.x,
            y: point.y,
          },
        });
        document.dispatchEvent(objectEvent);
      }
    });
  }
};

const scaleToScreen = (pos: IPosition): IPosition => {
  return {
    x: (window.innerWidth / videoSize.width) * pos.x,
    y: (window.innerHeight / videoSize.height) * pos.y,
  };
};
