import { useEffect, useRef, useState } from "react";
import "chart.js/auto";
import { Line } from "react-chartjs-2";
import { useMqttClient } from "@/components/hooks/useMqttClient";
import "chartjs-adapter-moment";
import Moment from "moment";
import "moment/locale/ko";

// 한국어로 날짜 및 시간 형식을 설정합니다.
Moment.locale("ko");

// 날짜 형식을 정의합니다. 예: "9월 15일"
const DATE_FORMAT = "MMM DD";

// 주어진 날짜 객체를 형식화하는 유틸리티 함수
// export function extractDateTime(dateObj: any) {
//   const dateMoment = Moment(dateObj);
//   const formattedDate = dateMoment.format(DATE_FORMAT);
//   return formattedDate;
// }

// MQTT 브로커 및 토픽 정보
const brokerUrl = "mqtt://192.168.0.106:8884";
const topic = "edukit1";

function LineChart() {
  const chartRef = useRef(null);

  // MQTT 클라이언트를 사용하여 데이터를 가져오는 커스텀 훅을 사용합니다.
  const { plcData, isLoading } = useMqttClient(brokerUrl, topic);

  // 차트 데이터의 템플릿 및 초기 데이터 설정
  const chartDataTemplate = {
    label: "", // 데이터셋의 레이블
    data: [], // 데이터 포인트 배열
    fill: true, // 영역을 채움
    backgroundColor: "", // 배경 색상 없음
    borderColor: "", // 선 색상 없음
  };

  const initialData = {
    labels: [], // x 축 레이블
    datasets: [chartDataTemplate, chartDataTemplate], // 두 개의 데이터셋(선)을 가짐
  };

  const [chartData, setChartData] = useState(initialData);

  const options = {
    scales: {
      y: {
        beginAtZero: true, // y 축은 0부터 시작
      },
      x: {
        type: "time", // x 축은 시간 형식
        time: {
          unit: "day", // 날짜 단위로 표시
          displayFormats: {
            day: DATE_FORMAT, // 날짜 형식 지정
          },
        },
        ticks: {
          autoSkip: true, // 자동으로 레이블 스킵
          maxTicksLimit: 20, // 최대 레이블 수
        },
        gridLines: {
          display: false, // 그리드 라인 표시 안 함
        },
      },
    },
  };

  // 데이터를 업데이트하는 함수
  const updateChartData = (newLabelItem, speed1, speed2) => {
    if (newLabelItem && speed1 && speed2) {
      const newLabels = [...chartData.labels, newLabelItem.value];
      const speedData1 = [
        ...chartData.datasets[0].data,
        parseFloat(speed1.value),
      ];
      const speedData2 = [
        ...chartData.datasets[1].data,
        parseFloat(speed2.value),
      ];

      // 레이블 및 데이터가 일정 개수를 초과하면 오래된 데이터를 삭제합니다.
      if (newLabels.length > 20) {
        newLabels.shift();
        speedData1.shift();
        speedData2.shift();
      }

      // 차트 데이터를 업데이트합니다.
      setChartData({
        labels: newLabels,
        datasets: [
          {
            label: speed1.name,
            data: speedData1,
            fill: false,
            backgroundColor: "",
            borderColor: "",
          },
          {
            label: speed2.name,
            data: speedData2,
            fill: false,
            backgroundColor: "",
            borderColor: "",
          },
        ],
      });
    }
  };

  useEffect(() => {
    // 데이터가 로드되면 실행되는 효과를 정의합니다.
    if (!isLoading) {
      // 필요한 데이터 항목을 가져옵니다.
      const newLabelItem = plcData.find((item) => item.tagId === "0");
      const speed1 = plcData.find((item) => item.tagId === "43");
      const speed2 = plcData.find((item) => item.tagId === "44");

      // 차트 데이터를 업데이트합니다.
      updateChartData(newLabelItem, speed1, speed2);
    }
  }, [plcData, isLoading]);

  // React Chart.js 라이브러리를 사용하여 선 그래프를 렌더링합니다.
  return <Line ref={chartRef} data={chartData} options={options} />;
}

export default LineChart;
