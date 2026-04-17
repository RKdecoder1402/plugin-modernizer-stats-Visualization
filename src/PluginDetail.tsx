import { useParams } from "react-router-dom";
import data from "./data/jenkins-plugins.json";

function PluginDetail() {
  const { name } = useParams();

  const plugin = data.find((p: any) => p.name === name);

  if (!plugin) return <div>Plugin not found</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{plugin.name}</h1>
      <p><b>Status:</b> {plugin.status}</p>

      <p>
        <b>Repo:</b>{" "}
        <a href={plugin.url} target="_blank">
          {plugin.url}
        </a>
      </p>

      <p>
        <b>Recommendation:</b> Fix deprecated APIs and update dependencies.
      </p>
    </div>
  );
}

export default PluginDetail;