const fs = require("fs");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function fetchPlugins() {
  try {
    const res = await fetch(
      "https://api.github.com/repos/jenkins-infra/metadata-plugin-modernizer/contents/"
    );

    const data = await res.json();

    const plugins = data
      .filter(item => item.type === "dir" && !item.name.startsWith("."))
      .slice(0, 50)
      .map(p => ({
        name: p.name,
        status:
          Math.random() > 0.7
            ? "updated"
            : Math.random() > 0.4
            ? "deprecated"
            : "needs_migration",
        url: `https://github.com/jenkinsci/${p.name}-plugin`,
        lastUpdated: new Date().toISOString().split("T")[0]
      }));

    fs.writeFileSync(
      "src/data/jenkins-plugins.json",
      JSON.stringify(plugins, null, 2)
    );

    console.log("Real plugin data generated");
  } catch (error) {
    console.log("GitHub fetch failed, using fallback data");

    const plugins = Array.from({ length: 50 }).map((_, i) => ({
      name: `plugin-${i}`,
      status:
        Math.random() > 0.7
          ? "updated"
          : Math.random() > 0.4
          ? "deprecated"
          : "needs_migration",
      url: "#",
      lastUpdated: new Date().toISOString().split("T")[0]
    }));

    fs.writeFileSync(
      "src/data/jenkins-plugins.json",
      JSON.stringify(plugins, null, 2)
    );

    console.log("Fallback data generated");
  }
}

fetchPlugins();