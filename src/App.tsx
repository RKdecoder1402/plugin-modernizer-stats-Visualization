import { useEffect, useRef } from "react";
import * as echarts from "echarts";

function App() {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current!);

    const option = {
      title: {
        text: "Plugin Modernization Status",
      },
      tooltip: {},
      xAxis: {
        type: "category",
        data: ["Updated", "Deprecated APIs", "Needs Migration"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: [120, 200, 150],
          type: "bar",
        },
      ],
    };

    chart.setOption(option);

    return () => {
      chart.dispose();
    };
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Plugin Modernizer Dashboard</h1>
      <div ref={chartRef} style={{ width: "600px", height: "400px" }} />
    </div>
  );
}

export default App;

