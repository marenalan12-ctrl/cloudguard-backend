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
    // Original environmental sensors
    temperature: 32,
    humidity: 75,
    rain: 12,
    waterLevel: 10,
    pressure: 1006,

    // New sensors
    pm25: 0,          // PM2.5 air particles (µg/m³)
    pm10: 0,           // PM10 air particles (µg/m³)
    mq2: 0,             // Gas/smoke sensor (raw or ppm)
    mq135: 0,           // Air quality sensor (raw or ppm)
    soilMoisture: 0,    // Soil moisture (%)
    tiltX: 0,           // MPU6050 tilt/motion
    tiltY: 0,
    tiltZ: 0,
    vibration: 0        // Vibration sensor (0 = still, 1 = shaking)
};

// Dashboard calls this to GET the latest readings
app.get("/api/sensors", (req, res) => {
    res.json(sensorData);
});

// ESP32 calls this to SEND new readings
app.post("/api/update", (req, res) => {
    const incoming = req.body;

    // Only update fields that were actually sent
    for (const key in sensorData) {
        if (incoming[key] !== undefined) {
            sensorData[key] = incoming[key];
        }
    }

    console.log("Received new data:", incoming);

    res.json({ success: true, current: sensorData });
});

app.listen(PORT, () => {
    console.log(`CloudGuard backend running at http://localhost:${PORT}`);
});