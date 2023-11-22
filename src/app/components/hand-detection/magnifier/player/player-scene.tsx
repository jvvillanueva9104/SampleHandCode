"use client";

// import { useBodyPoseState } from "../../pose-detection/pose-detection";
import { useObjectState } from "../../object-detection/object-detection";
import { PlayerPointer } from "./player-pointer";

export const PlayerScene = () => {
  const { pointers } = useObjectState();

  const screenPointers = pointers.map((position, index) => {
    return (
      <PlayerPointer key={index} position={position} height={100} width={100} />
    );
  });

  return <> {screenPointers}</>;
};
