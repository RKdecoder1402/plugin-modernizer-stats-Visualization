const fs = require("fs");

async function fetchPlugins() {
  const res = await fetch(
    "https://api.github.com/repos/jenkins-infra/metadata-plugin-modernizer/contents/"
  );

  const data = await res.json();

  const plugins = data
    .filter(item => item.type === "dir")
    .slice(0, 50)
    .map(p => ({
  name: p.name,
  status: "needs_migration",
  url: `https://github.com/jenkinsci/${p.name}-plugin`
}));

  fs.writeFileSync(
    "src/data/jenkins-plugins.json",
    JSON.stringify(plugins, null, 2)
  );

  console.log("Real plugin data generated");
}

fetchPlugins();