const fs = require("fs");

const plugins = [
  { name: "git", status: "updated" },
  { name: "docker", status: "needs_migration" },
  { name: "workflow-job", status: "deprecated" },
  { name: "kubernetes", status: "needs_migration" },
  { name: "credentials", status: "updated" }
];

fs.writeFileSync(
  "src/data/jenkins-plugins.json",
  JSON.stringify(plugins, null, 2)
);

console.log("plugins data generated");