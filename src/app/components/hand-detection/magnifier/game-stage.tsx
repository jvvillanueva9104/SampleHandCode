"use client";

import { PlayerScene } from "./player/player-scene";
import { useGameStore } from "./game-store";
import SplineScene from "../spline-scene/spline-scene";


export const GameStage = () => {
  const { isTransitionVisible, isItemSelected, currentArtBoardFound } =
    useGameStore();
  
  return (
    <div className='absolute left-0 top-0 w-full h-full overflow-hidden z-0'>
      <div className='absolute w-full- h-full z-30 '>
        <SplineScene />
      </div>
      <div className='absolute w-full h-full z-40 pointer-events-none'>
        <PlayerScene />
      </div>
    </div>
  );
};
