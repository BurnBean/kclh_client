import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLoader } from "@react-three/fiber";

//신호등 초록
export const TrafficLight_Green = () => {
  //모델의 화면과 애니메이션을 읽어오는 코드
  const { scene } = useLoader(GLTFLoader, "./models/TrafficLight_Green.glb");

  scene.traverse((ob) => {
    ob.scale.set(1, 1, 1);
  });

  //작업 후 return하는 코드
  return <primitive object={scene} position={[0, 0, 0]}></primitive>;
};
