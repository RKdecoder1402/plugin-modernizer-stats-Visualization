import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import data from "./data/plugins.json";

function App() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!chartRef.current) return;

    let updated = 0;
    let deprecated = 0;
    let needsMigration = 0;

    data.forEach((plugin: any) => {
      if (filter !== "all" && plugin.status !== filter) return;

      if (plugin.status === "updated") updated++;
      else if (plugin.status === "deprecated") deprecated++;
      else if (plugin.status === "needs_migration") needsMigration++;
    });

    const barChart = echarts.init(chartRef.current);

    barChart.setOption({
      title: { text: "Plugin Modernization Status" },
      tooltip: {},
      xAxis: {
        type: "category",
        data: ["Updated", "Deprecated", "Needs Migration"],
      },
      yAxis: { type: "value" },
      series: [
        {
          data: [updated, deprecated, needsMigration],
          type: "bar",
        },
      ],
    });

    const pieDom = document.getElementById("pieChart");
    if (pieDom) {
      const pieChart = echarts.init(pieDom);

      pieChart.setOption({
        title: { text: "Distribution", left: "center" },
        tooltip: { trigger: "item" },
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
  }, [filter]);

  // table filter logic
  const filteredData =
    filter === "all"
      ? data
      : data.filter((p: any) => p.status === filter);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Plugin Modernizer Dashboard</h1>

      {/* FILTER */}
      <select
        onChange={(e) => setFilter(e.target.value)}
        style={{ marginBottom: "20px", padding: "5px" }}
      >
        <option value="all">All</option>
        <option value="updated">Updated</option>
        <option value="deprecated">Deprecated</option>
        <option value="needs_migration">Needs Migration</option>
      </select>

      {/* BAR CHART */}
      <div
        ref={chartRef}
        style={{ width: "600px", height: "400px", marginBottom: "40px" }}
      />

      {/* PIE CHART */}
      <div
        id="pieChart"
        style={{ width: "600px", height: "400px", marginBottom: "40px" }}
      />

      {/* TABLE VIEW */}
      <h2>Plugin Data Explorer</h2>

      <table border={1} cellPadding={10} style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Plugin Name</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {filteredData.map((plugin: any, index: number) => (
            <tr key={index}>
              <td>{plugin.name}</td>
              <td>{plugin.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
