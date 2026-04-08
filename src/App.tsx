import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import data from "./data/plugins.json";

function App() {
  const chartRef = useRef<HTMLDivElement>(null);

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("none");
  const [selectedPlugin, setSelectedPlugin] = useState<any>(null);

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

  // STATS
  const total = filteredData.length;

  const updatedCount = filteredData.filter(
    (p: any) => p.status === "updated"
  ).length;

  const deprecatedCount = filteredData.filter(
    (p: any) => p.status === "deprecated"
  ).length;

  const needsMigrationCount = filteredData.filter(
    (p: any) => p.status === "needs_migration"
  ).length;

  useEffect(() => {
    if (!chartRef.current) return;

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
          data: [updatedCount, deprecatedCount, needsMigrationCount],
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
              { value: updatedCount, name: "Updated" },
              { value: deprecatedCount, name: "Deprecated" },
              { value: needsMigrationCount, name: "Needs Migration" },
            ],
          },
        ],
      });
    }

    return () => {
      barChart.dispose();
    };
  }, [filter, search, sort]);

  const cardStyle = {
    padding: "15px",
    border: "1px solid gray",
    minWidth: "120px",
    textAlign: "center" as const,
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Plugin Modernizer Dashboard</h1>

      {/* STATS CARDS */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div style={cardStyle}>
          <h3>Total</h3>
          <p>{total}</p>
        </div>

        <div style={cardStyle}>
          <h3>Updated</h3>
          <p>{updatedCount}</p>
        </div>

        <div style={cardStyle}>
          <h3>Deprecated</h3>
          <p>{deprecatedCount}</p>
        </div>

        <div style={cardStyle}>
          <h3>Needs Migration</h3>
          <p>{needsMigrationCount}</p>
        </div>
      </div>

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
     <div style={{ marginBottom: "20px" }}>
  <button onClick={() => setFilter("all")}>All</button>

  <button onClick={() => setFilter("updated")} style={{ marginLeft: "10px" }}>
    Updated
  </button>

  <button onClick={() => setFilter("deprecated")} style={{ marginLeft: "10px" }}>
    Deprecated
  </button>

  <button onClick={() => setFilter("needs_migration")} style={{ marginLeft: "10px" }}>
    Needs Migration
  </button>
</div>

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
              <td>
  <a
    href={plugin.url}
    target="_blank"
    rel="noreferrer"
    style={{ color: "#1976d2", textDecoration: "none" }}
  >
    {plugin.name}
  </a>
</td>
              <td
  style={{
    color:
      plugin.status === "updated"
        ? "green"
        : plugin.status === "deprecated"
        ? "red"
        : "orange",
    fontWeight: "bold",
  }}
>
  {plugin.status}
</td>
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
          <p><b>Name:</b> {selectedPlugin.name}</p>
          <p><b>Status:</b> {selectedPlugin.status}</p>
          <p><b>Recommendation:</b> Update plugin dependencies and migrate APIs.</p>
        </div>
      )}
    </div>
  );
}

export default App;