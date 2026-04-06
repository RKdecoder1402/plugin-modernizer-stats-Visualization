import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import data from "./data/plugins.json";

function App() {
  const chartRef = useRef<HTMLDivElement>(null);

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("none");
  const [selectedPlugin, setSelectedPlugin] = useState<any>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    let updated = 0;
    let deprecated = 0;
    let needsMigration = 0;

    const filtered = data.filter((plugin: any) => {
      const statusMatch =
        filter === "all" || plugin.status === filter;

      const searchMatch = plugin.name
        .toLowerCase()
        .includes(search.toLowerCase());

      return statusMatch && searchMatch;
    });

    filtered.forEach((plugin: any) => {
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
  }, [filter, search, sort]);

  let filteredData = data.filter((p: any) => {
    const statusMatch = filter === "all" || p.status === filter;

    const searchMatch = p.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return statusMatch && searchMatch;
  });

  if (sort === "name") {
    filteredData.sort((a: any, b: any) =>
      a.name.localeCompare(b.name)
    );
  }

  if (sort === "status") {
    filteredData.sort((a: any, b: any) =>
      a.status.localeCompare(b.status)
    );
  }

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

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search plugin..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginLeft: "10px", padding: "5px" }}
      />

      {/* SORT */}
      <select
        onChange={(e) => setSort(e.target.value)}
        style={{ marginLeft: "10px", padding: "5px" }}
      >
        <option value="none">Sort</option>
        <option value="name">Name</option>
        <option value="status">Status</option>
      </select>

      {/* BAR CHART */}
      <div
        ref={chartRef}
        style={{
          width: "600px",
          height: "400px",
          marginTop: "20px",
          marginBottom: "40px",
        }}
      />

      {/* PIE CHART */}
      <div
        id="pieChart"
        style={{ width: "600px", height: "400px", marginBottom: "40px" }}
      />

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
            <tr
              key={index}
              onClick={() => setSelectedPlugin(plugin)}
              style={{ cursor: "pointer" }}
            >
              <td>{plugin.name}</td>
              <td>{plugin.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedPlugin && (
        <div
          style={{
            marginTop: "30px",
            padding: "15px",
            border: "1px solid gray",
          }}
        >
          <h3>Plugin Details</h3>
          <p>
            <b>Name:</b> {selectedPlugin.name}
          </p>
          <p>
            <b>Status:</b> {selectedPlugin.status}
          </p>
          <p>
            <b>Recommendation:</b> Update plugin dependencies and migrate APIs.
          </p>
        </div>
      )}
    </div>
  );
}

export default App;