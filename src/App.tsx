import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import data from "./data/plugins.json";

function App() {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    let updated = 0;
    let deprecated = 0;
    let needsMigration = 0;

    data.forEach((plugin: any) => {
      if (plugin.status === "updated") updated++;
      else if (plugin.status === "deprecated") deprecated++;
      else if (plugin.status === "needs_migration") needsMigration++;
    });

    // BAR CHART
    const barChart = echarts.init(chartRef.current);

    barChart.setOption({
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

    // PIE CHART
    const pieDom = document.getElementById("pieChart");
    if (pieDom) {
      const pieChart = echarts.init(pieDom);

      pieChart.setOption({
        title: {
          text: "Distribution",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        series: [
          {
            type: "pie",
            radius: "50%",
            data: [
              { value: updated, name: "Updated" },
              { value: deprecated, name: "Deprecated" },
              { value: needsMigration, name: "Needs Migration" },
            ],
          },
        ],
      });
    }

    return () => {
      barChart.dispose();
    };
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Plugin Modernizer Dashboard</h1>

      {/* BAR CHART */}
      <div
        ref={chartRef}
        style={{ width: "600px", height: "400px", marginBottom: "40px" }}
      />

      {/* PIE CHART */}
      <div
        id="pieChart"
        style={{ width: "600px", height: "400px" }}
      />
    </div>
  );
}

export default App;
