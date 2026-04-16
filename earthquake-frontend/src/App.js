import { useState, useEffect, useRef } from "react";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { styles } from "./styles";

const API = "http://localhost:8080/api/earthquakes";

function App() {
    const [earthquakes, setEarthquakes] = useState([]);
    const [status, setStatus] = useState("No data loaded yet.");
    const [filterTime, setFilterTime] = useState("");
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    const fetchFromUSGS = async () => {
        setStatus("Fetching latest data...");
        await axios.post(`${API}/fetch`);
        loadAll();
    };

    const loadAll = async () => {
        const res = await axios.get(API);
        setEarthquakes(res.data);
        setStatus(`${res.data.length} earthquakes loaded.`);
    };

    const filterAbove2 = async () => {
        const res = await axios.get(`${API}/filter/magnitude?minMag=2.0`);
        setEarthquakes(res.data);
        setStatus(`${res.data.length} earthquakes with magnitude above 2.0.`);
    };

    const filterByTime = async () => {
        if (!filterTime) return;
        const timestamp = new Date(filterTime).getTime();
        const res = await axios.get(`${API}/filter/time?timestamp=${timestamp}`);
        setEarthquakes(res.data);
        setStatus(`${res.data.length} earthquakes after ${new Date(filterTime).toLocaleString()}.`);
    };

    const deleteEarthquake = async (id) => {
        await axios.delete(`${API}/${id}`);
        setEarthquakes((prev) => prev.filter((eq) => eq.id !== id));
        setStatus("Record deleted.");
    };

    const formatTime = (ms) => new Date(ms).toLocaleString();

    useEffect(() => {
        if (!mapInstanceRef.current && mapRef.current) {
            mapInstanceRef.current = L.map(mapRef.current).setView([20, 0], 2);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "OpenStreetMap"
            }).addTo(mapInstanceRef.current);
        }

        if (!mapInstanceRef.current) return;

        mapInstanceRef.current.eachLayer((layer) => {
            if (layer instanceof L.CircleMarker) mapInstanceRef.current.removeLayer(layer);
        });

        earthquakes.forEach((eq) => {
            if (eq.latitude && eq.longitude) {
                const color = eq.magnitude >= 5 ? "#E24B4A" : eq.magnitude >= 3 ? "#EF9F27" : "#639922";
                L.circleMarker([eq.latitude, eq.longitude], {
                    radius: Math.max(eq.magnitude * 2.5, 4),
                    color,
                    fillColor: color,
                    fillOpacity: 0.5,
                    weight: 1
                })
                    .bindPopup(`<strong>${eq.title}</strong><br/>Magnitude: ${eq.magnitude}<br/>${formatTime(eq.time)}`)
                    .addTo(mapInstanceRef.current);
            }
        });
    }, [earthquakes]);

    return (
        <div style={styles.app}>
            <div style={styles.header}>
                <h1 style={styles.title}>Earthquake Tracker</h1>
                <p style={styles.subtitle}>Live seismic data from the USGS feed</p>
            </div>

            <div style={styles.toolbar}>
                <button style={styles.btnPrimary} onClick={fetchFromUSGS}>Fetch latest data</button>
                <button style={styles.btn} onClick={loadAll}>Show all</button>
                <button style={styles.btn} onClick={filterAbove2}>Magnitude above 2.0</button>

                <div style={styles.divider} />

                <div style={styles.filterGroup}>
                    <label style={styles.label}>After</label>
                    <input
                        type="datetime-local"
                        style={styles.input}
                        value={filterTime}
                        onChange={(e) => setFilterTime(e.target.value)}
                    />
                    <button style={styles.btn} onClick={filterByTime}>Apply</button>
                    <button style={styles.btn} onClick={loadAll}>Clear</button>
                </div>
            </div>

            <p style={styles.status}>{status}</p>

            <div style={styles.sectionTitle}>Map</div>
            <div style={styles.mapWrapper}>
                <div ref={mapRef} style={{ height: 380 }} />
            </div>

            {earthquakes.length > 0 && (
                <>
                    <div style={styles.sectionTitle}>Records</div>
                    <table style={styles.table}>
                        <thead>
                        <tr>
                            <th style={styles.th}>Title</th>
                            <th style={styles.th}>Place</th>
                            <th style={styles.th}>Magnitude</th>
                            <th style={styles.th}>Type</th>
                            <th style={styles.th}>Time</th>
                            <th style={styles.th}></th>
                        </tr>
                        </thead>
                        <tbody>
                        {earthquakes.map((eq) => (
                            <tr key={eq.id}>
                                <td style={styles.td}>{eq.title}</td>
                                <td style={styles.td}>{eq.place}</td>
                                <td style={styles.td}>
                                    <span style={styles.magBadge(eq.magnitude)}>{eq.magnitude}</span>
                                </td>
                                <td style={styles.td}>{eq.magType}</td>
                                <td style={styles.td}>{formatTime(eq.time)}</td>
                                <td style={styles.td}>
                                    <button style={styles.btnDanger} onClick={() => deleteEarthquake(eq.id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}

export default App;