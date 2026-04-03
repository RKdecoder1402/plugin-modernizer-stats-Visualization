import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import data from "./data/plugins.json";

function App() {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let updated = 0;
    let deprecated = 0;
    let needsMigration = 0;

    data.forEach((plugin: any) => {
      if (plugin.status === "updated") updated++;
      else if (plugin.status === "deprecated") deprecated++;
      else needsMigration++;
    });

    const chart = echarts.init(chartRef.current!);

    chart.setOption({
      title: {
        text: "Plugin Modernization Status",
      },
      tooltip: {},
      xAxis: {
        type: "category",
        data: ["Updated", "Deprecated", "Needs Migration"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: [updated, deprecated, needsMigration],
          type: "bar",
        },
      ],
    });

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
