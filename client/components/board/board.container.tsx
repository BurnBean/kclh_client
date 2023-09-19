import React, { useEffect, useState } from "react";
import { useMqttClient } from "@/components/hooks/useMqttClient";
import BoardUI from "@/components/board/board.presenter";
import { extractDateTime } from "@/components/utils/dateUtils";

export default function BoardContainer(props: any) {
  const brokerUrl = "mqtt://192.168.0.106:8884";
  const [eduKitTopic, setEduKitTopic] = useState(""); // 초기 빈 문자열로 설정
  const [iotTopic, setIotTopic] = useState(""); // 초기 빈 문자열로 설정

  useEffect(() => {
    // idFromPath를 기반으로 토픽들을 동적으로 생성
    const dynamicEduKitTopic = `edukit${props.idFromPath}`;
    const dynamicIotTopic = `iot${props.idFromPath}/info`;

    // 토픽들을 설정한 후에 MQTT 연결을 수행
    setEduKitTopic(dynamicEduKitTopic);
    setIotTopic(dynamicIotTopic);
  }, [props.idFromPath]); // props.idFromPath가 변경될 때만 실행

  // MQTT 연결 및 데이터 가져오기
  const { isLoading: eduKitIsLoading, plcData } = useMqttClient(
    brokerUrl,
    eduKitTopic
  );
  const { isLoading: iotIsLoading, iotData } = useMqttClient(
    brokerUrl,
    iotTopic
  );

  // tagId가 '0'인 항목 찾기
  const dateTimeItem = plcData.find((item) => item.tagId === "0");

  let dateTime;
  if (dateTimeItem) {
    dateTime = extractDateTime(new Date(dateTimeItem.value));
  } else {
    dateTime = extractDateTime(new Date());
  }

  return (
    <BoardUI
      id={props.id}
      pathname={props.pathname}
      idFromPath={props.idFromPath}
      dateTime={dateTimeItem ? "데이터 전송 시간" : "현재 시간"}
      eduKitIsLoading={eduKitIsLoading}
      iotIsLoading={iotIsLoading}
      plcData={plcData}
      iotData={iotData}
      {...dateTime}
      brokerUrl={brokerUrl}
      eduKitTopic={eduKitTopic}
      iotTopic={iotTopic}
    />
  );
}
