import { Routes, Route } from "react-router-dom";
import PluginDetail from "./PluginDetail";
import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import data from "./data/jenkins-plugins.json";

function App() {
  const chartRef = useRef<HTMLDivElement>(null);

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort] = useState("none");
  const [selectedPlugin, setSelectedPlugin] = useState<any>(null);

  const [page, setPage] = useState(1);
  const pageSize = 20;

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
  const updatedPercent = Math.round(
  (updatedCount / total) * 100 || 0
);

const deprecatedPercent = Math.round(
  (deprecatedCount / total) * 100 || 0
);

const migrationPercent = Math.round(
  (needsMigrationCount / total) * 100 || 0
);

const topPlugins = filteredData.slice(0, 10);
  

  // pagination
  const start = (page - 1) * pageSize;
  const paginatedData = filteredData.slice(start, start + pageSize);
  const totalPages = Math.ceil(filteredData.length / pageSize);

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
  <Routes>
    <Route
      path="/"
      element={
        <div style={{ padding: "20px" }}>
      <h1>Plugin Modernizer Dashboard</h1>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
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

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "20px",
          alignItems: "center",
        }}
      >
        <select
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: "5px" }}
        >
          <option value="all">All</option>
          <option value="updated">Updated</option>
          <option value="deprecated">Deprecated</option>
          <option value="needs_migration">Needs Migration</option>
        </select>

        <input
          type="text"
          placeholder="Search plugin..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "5px" }}
        />
      </div>

      <div
        ref={chartRef}
        style={{
          width: "100%",
          maxWidth: "900px",
          height: "400px",
          marginBottom: "40px",
        }}
      />

      <div
        id="pieChart"
        style={{
          width: "100%",
          maxWidth: "900px",
          height: "400px",
          marginBottom: "40px",
        }}
      />
      <h2>Insights</h2>

<div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
  <div>
    <h3>Status Distribution</h3>
    <p>Updated: {updatedPercent}%</p>
    <p>Deprecated: {deprecatedPercent}%</p>
    <p>Needs Migration: {migrationPercent}%</p>
  </div>

  <div>
    <h3>Top Plugins</h3>
    <ul>
      {topPlugins.map((p: any) => (
        <li key={p.name}>{p.name}</li>
      ))}
    </ul>
  </div>
</div>

      <h2>Plugin Data Explorer</h2>

      <div style={{ overflowX: "auto" }}>
        <table border={1} cellPadding={10} style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Plugin Name</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((plugin: any, index: number) => (
              <tr
                key={index}
                onClick={() => setSelectedPlugin(plugin)}
                style={{ cursor: "pointer" }}
              >
                <td>
                    <a href={`#/plugin/${plugin.name}`}
                    
                    rel="noreferrer"
                    style={{
                      color: "#1976d2",
                      textDecoration: "none",
                    }}
                  >
                    {plugin.name}
                  </a>
                </td>

               <td>
  <span
    style={{
      padding: "4px 8px",
      borderRadius: "6px",
      fontSize: "12px",
      fontWeight: "bold",
      background:
        plugin.status === "updated"
          ? "#1b5e20"
          : plugin.status === "deprecated"
          ? "#b71c1c"
          : "#e65100",
      color: "white"
    }}
  >
    {plugin.status}
  </span>
</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: "15px" }}>
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Prev
          </button>

          <span style={{ margin: "0 10px" }}>
            Page {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>

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
          <p>
            <b>Recommendation:</b> Update plugin dependencies and migrate APIs.
          </p>
        </div>
      )}
            </div>
      }
    />
    <Route path="/plugin/:name" element={<PluginDetail />} />
  </Routes>
);
}

export default App;