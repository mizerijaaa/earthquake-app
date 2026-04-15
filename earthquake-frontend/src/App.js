import { useState } from "react";
import axios from "axios";

const API = "http://localhost:8080/api/earthquakes";

function App() {
  const [earthquakes, setEarthquakes] = useState([]);
  const [status, setStatus] = useState("");

  const fetchFromUSGS = async () => {
    setStatus("Fetching...");
    await axios.post(`${API}/fetch`);
    setStatus("Fetched! Loading data...");
    loadAll();
  };

  const loadAll = async () => {
    const res = await axios.get(API);
    setEarthquakes(res.data);
    setStatus(`Showing ${res.data.length} earthquakes`);
  };

  const formatTime = (ms) => new Date(ms).toLocaleString();

  return (
      <div style={{ padding: 20, fontFamily: "sans-serif" }}>
        <h1>🌍 Earthquake Tracker</h1>
        <button onClick={fetchFromUSGS} style={{ marginRight: 10 }}>
          Fetch Latest Data
        </button>
        <button onClick={loadAll}>Reload Table</button>
        <p>{status}</p>

        {earthquakes.length > 0 && (
            <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead style={{ background: "#f0f0f0" }}>
              <tr>
                <th>Title</th>
                <th>Place</th>
                <th>Magnitude</th>
                <th>Mag Type</th>
                <th>Time</th>
              </tr>
              </thead>
              <tbody>
              {earthquakes.map((eq) => (
                  <tr key={eq.id}>
                    <td>{eq.title}</td>
                    <td>{eq.place}</td>
                    <td>{eq.magnitude}</td>
                    <td>{eq.magType}</td>
                    <td>{formatTime(eq.time)}</td>
                  </tr>
              ))}
              </tbody>
            </table>
        )}
      </div>
  );
}

export default App;