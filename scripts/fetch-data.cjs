const fs = require("fs");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function fetchPlugins() {
  try {
    const res = await fetch(
      "https://api.github.com/repos/jenkins-infra/metadata-plugin-modernizer/contents/"
    );

    if (!res.ok) {
      throw new Error("GitHub API failed");
    }

    const data = await res.json();

    const plugins = data
      .filter((item) => item.type === "dir" && !item.name.startsWith("."))
      .slice(0, 50)
      .map((p) => ({
        name: p.name,
        status: "needs_migration", // temporary (real parsing next)
        url: `https://github.com/jenkinsci/${p.name}-plugin`,
        lastUpdated: new Date().toISOString().split("T")[0],
      }));

    fs.writeFileSync(
      "src/data/jenkins-plugins.json",
      JSON.stringify(plugins, null, 2)
    );

    console.log("Real plugin data generated");
  } catch (error) {
    console.log("GitHub fetch failed, using fallback data");

    const plugins = [
      { name: "git", status: "needs_migration", url: "https://github.com/jenkinsci/git-plugin" },
      { name: "workflow-job", status: "needs_migration", url: "https://github.com/jenkinsci/workflow-job-plugin" },
      { name: "credentials", status: "needs_migration", url: "https://github.com/jenkinsci/credentials-plugin" },
      { name: "kubernetes", status: "needs_migration", url: "https://github.com/jenkinsci/kubernetes-plugin" },
      { name: "docker", status: "needs_migration", url: "https://github.com/jenkinsci/docker-plugin" }
    ].map((p) => ({
      ...p,
      lastUpdated: new Date().toISOString().split("T")[0],
    }));

    fs.writeFileSync(
      "src/data/jenkins-plugins.json",
      JSON.stringify(plugins, null, 2)
    );

    console.log("Fallback data generated");
  }
}

fetchPlugins();