const express = require("express");

const app = express();

const PORT = 3000;


// Allow dashboard to communicate with backend

app.use(express.json());


// Sensor data

app.get("/api/sensors", (req, res) => {

    const sensorData = {

        temperature: 32,
        humidity: 75,
        rain: 12,
        waterLevel: 10,
        pressure: 1006

    };

    res.json(sensorData);

});


// Start server

app.listen(PORT, () => {

    console.log(
        `CloudGuard backend running at http://localhost:${PORT}`
    );

});