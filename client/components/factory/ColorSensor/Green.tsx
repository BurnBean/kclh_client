import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useLoader } from "@react-three/fiber";

//컬러 센서 초록
export const ColorSensor_G = () => {
  //모델의 화면과 애니메이션을 읽어오는 코드
  const { scene } = useLoader(GLTFLoader, "/ColorSensor_G.glb");

  //작업 후 return하는 코드
  return <primitive object={scene} position={[0, 1.35, -1.5]}></primitive>;
};
