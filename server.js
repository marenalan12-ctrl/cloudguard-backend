const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

// Allow dashboard (and ESP32) to talk to backend from anywhere
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

// This holds the CURRENT sensor readings.
// Starts with sample values, gets overwritten by real ESP32 data.
let sensorData = {
    temperature: 32,
    humidity: 75,
    rain: 12,
    waterLevel: 10,
    pressure: 1006
};

// Dashboard calls this to GET the latest readings
app.get("/api/sensors", (req, res) => {
    res.json(sensorData);
});

// ESP32 calls this to SEND new readings
app.post("/api/update", (req, res) => {
    const incoming = req.body;

    // Only update fields that were actually sent
    if (incoming.temperature !== undefined) sensorData.temperature = incoming.temperature;
    if (incoming.humidity !== undefined) sensorData.humidity = incoming.humidity;
    if (incoming.rain !== undefined) sensorData.rain = incoming.rain;
    if (incoming.waterLevel !== undefined) sensorData.waterLevel = incoming.waterLevel;
    if (incoming.pressure !== undefined) sensorData.pressure = incoming.pressure;

    console.log("Received new data:", incoming);

    res.json({ success: true, current: sensorData });
});

app.listen(PORT, () => {
    console.log(`CloudGuard backend running at http://localhost:${PORT}`);
});