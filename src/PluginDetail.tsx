import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function PluginDetail() {
  const { name } = useParams();
  const [repoData, setRepoData] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!name) return;

    fetch(`https://api.github.com/repos/jenkinsci/${name}-plugin`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("API failed");
        }
        return res.json();
      })
      .then((data) => {
        setRepoData(data);
        setError(false);
      })
      .catch(() => {
        setRepoData(null);
        setError(true);
      });
  }, [name]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>{name}</h1>

      {repoData ? (
        <>
          <p><b>⭐ Stars:</b> {repoData.stargazers_count}</p>
          <p><b>🍴 Forks:</b> {repoData.forks_count}</p>
          <p><b>👀 Watchers:</b> {repoData.watchers_count}</p>
          <p>
            <b>🕒 Last Updated:</b>{" "}
            {new Date(repoData.updated_at).toLocaleDateString()}
          </p>

          <p>
            <b>Repo:</b>{" "}
            <a href={repoData.html_url} target="_blank" rel="noreferrer">
              {repoData.html_url}
            </a>
          </p>
        </>
      ) : error ? (
        <p style={{ color: "red" }}>Failed to load plugin data</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default PluginDetail;