const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para leer JSON
app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
  res.send('<h2>Servidor ESP32 en Node.js funcionando ✅</h2>');
});

// Ruta donde el ESP32 enviará datos
app.post('/data', (req, res) => {
  console.log('📡 Datos recibidos del ESP32:', req.body);
  res.sendStatus(200);
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
