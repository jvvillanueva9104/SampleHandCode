"use client";

// import { useBodyPoseState } from "../../pose-detection/pose-detection";
import { useObjectState } from "../../object-detection/object-detection";
import { PlayerPointer } from "./player-pointer";

export const PlayerScene = () => {
  const { pointers } = useObjectState()
  // console.log('!!!!!!!pointers:', pointers);

  return (
    <>
      <PlayerPointer pointers={pointers} />
    </>
  );
};
