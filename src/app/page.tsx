import { Camera } from "./components/hand-detection/camera";
import { GameStage } from './components/hand-detection/magnifier/game-stage';

export default function Home() {
  
  return(
  <div>
    <GameStage />
    <Camera showCanvas={false} />
    </div>
  )
}
