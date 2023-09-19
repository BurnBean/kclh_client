import { useMqttClient } from "@/components/hooks/useMqttClient";
import CasinoIcon from "@mui/icons-material/Casino";
import { useState, useEffect } from "react";

export default function PlcDiceValue({ brokerUrl, eduKitTopic }) {
  // const brokerUrl = "mqtt://192.168.0.106:8884";
  // const topic = "edukit1";

  const [plcData, setPlcData] = useState(null);

  const { plcData: mqttPlcData, isLoading } = useMqttClient(
    brokerUrl,
    eduKitTopic
  );

  // useEffect(() => {
  //   // MQTT 연결 설정
  //   const mqttClient = useMqttClient(brokerUrl, eduKitTopic);

  //   // MQTT 데이터를 받아와서 state 업데이트
  //   const subscription = mqttClient.subscribe((data) => {
  //     setPlcData(data);
  //   });

  //   // 컴포넌트가 언마운트될 때 MQTT 연결 해제
  //   return () => {
  //     subscription.unsubscribe();
  //     mqttClient.disconnect();
  //   };
  // }, [brokerUrl, eduKitTopic]); // props가 변경될 때마다 재설정

  useEffect(() => {
    // MQTT 데이터를 받아와서 state 업데이트
    if (!isLoading && mqttPlcData) {
      setPlcData(mqttPlcData);
    }
  }, [mqttPlcData, isLoading]);

  const DiceValue = plcData
    ? plcData.find((item) => item.tagId === "37")
    : null;

  let DiceName;
  let DiceVal;
  if (DiceValue) {
    DiceName = DiceValue.name;
    DiceVal = DiceValue.value;
  }

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div style={{ fontWeight: "700" }}>주사위 값</div>
      <CasinoIcon
        style={{
          fontSize: "64px",
          color: "#FA4443",
        }}
      />
      {plcData !== null ? (
        <>
          <h1>{DiceVal}</h1>
          <div>{DiceName}</div>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
