import { useState, useEffect, useRef } from "react";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const API = "http://localhost:8080/api/earthquakes";

function App() {
    const [earthquakes, setEarthquakes] = useState([]);
    const [status, setStatus] = useState("");
    const [filterTime, setFilterTime] = useState("");
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    const fetchFromUSGS = async () => {
        setStatus("Fetching...");
        await axios.post(`${API}/fetch`);
        loadAll();
    };

    const loadAll = async () => {
        const res = await axios.get(API);
        setEarthquakes(res.data);
        setStatus(`Showing ${res.data.length} earthquakes`);
    };

    const filterByTime = async () => {
        if (!filterTime) return;
        const timestamp = new Date(filterTime).getTime();
        const res = await axios.get(`${API}/filter/time?timestamp=${timestamp}`);
        setEarthquakes(res.data);
        setStatus(`Showing ${res.data.length} earthquakes after ${filterTime}`);
    };

    const deleteEarthquake = async (id) => {
        await axios.delete(`${API}/${id}`);
        setEarthquakes((prev) => prev.filter((eq) => eq.id !== id));
        setStatus("Record deleted.");
    };

    const formatTime = (ms) => new Date(ms).toLocaleString();

    useEffect(() => {
        if (!mapInstanceRef.current) {
            mapInstanceRef.current = L.map(mapRef.current).setView([20, 0], 2);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
                mapInstanceRef.current
            );
        }

        // Clear old markers
        mapInstanceRef.current.eachLayer((layer) => {
            if (layer instanceof L.CircleMarker) {
                mapInstanceRef.current.removeLayer(layer);
            }
        });

        // Add new markers
        earthquakes.forEach((eq) => {
            if (eq.latitude && eq.longitude) {
                L.circleMarker([eq.latitude, eq.longitude], {
                    radius: eq.magnitude * 3,
                    color: "red",
                })
                    .bindPopup(
                        `<b>${eq.title}</b><br/>Magnitude: ${eq.magnitude}<br/>${formatTime(eq.time)}`
                    )
                    .addTo(mapInstanceRef.current);
            }
        });
    }, [earthquakes]);

    return (
        <div style={{ padding: 20, fontFamily: "sans-serif" }}>
            <h1>🌍 Earthquake Tracker</h1>

            <button onClick={fetchFromUSGS} style={{ marginRight: 10 }}>
                Fetch Latest Data
            </button>
            <button onClick={loadAll} style={{ marginRight: 10 }}>
                Reload Table
            </button>

            <div style={{ marginTop: 15, marginBottom: 10 }}>
                <label>Filter after: </label>
                <input
                    type="datetime-local"
                    value={filterTime}
                    onChange={(e) => setFilterTime(e.target.value)}
                    style={{ marginRight: 10 }}
                />
                <button onClick={filterByTime}>Apply</button>
                <button onClick={loadAll} style={{ marginLeft: 5 }}>Clear</button>
            </div>

            <p>{status}</p>

            <h2>🗺️ Map View</h2>
            <div ref={mapRef} style={{ height: "400px", width: "100%", marginBottom: 20 }} />

            {earthquakes.length > 0 && (
                <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
                    <thead style={{ background: "#f0f0f0" }}>
                    <tr>
                        <th>Title</th>
                        <th>Place</th>
                        <th>Magnitude</th>
                        <th>Mag Type</th>
                        <th>Time</th>
                        <th>Action</th>
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
                            <td>
                                <button onClick={() => deleteEarthquake(eq.id)} style={{ color: "red" }}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default App;