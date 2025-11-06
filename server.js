const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Estado global con último valor recibido
let ultimoEstado = {
  estado: 'offline',
  ip: null,
  ultima: null,
  senal: null
};

// Servir página principal (HTML + JS) que consulta /estado periódicamente
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Monitor de Pulsos Cardíacos</title>
  <style>
    body { font-family: Arial, Helvetica, sans-serif; text-align:center; padding:40px; background:#f6f8fa; color:#333; }
    .card { display:inline-block; padding:24px 32px; border-radius:12px; box-shadow:0 6px 18px rgba(0,0,0,0.08); background:#fff; }
    h1 { margin:0 0 8px; color:#d32f2f; }
    .valor { font-size:3.6rem; font-weight:700; color:#2e7d32; margin:12px 0; }
    .small { color:#666; font-size:0.95rem; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Latidos por minuto (BPM)</h1>
    <div class="valor" id="bpm">--</div>
    <div class="small">Última actualización: <span id="hora">--</span></div>
    <div style="margin-top:12px;"><small id="ip">IP: --</small></div>
  </div>

  <script>
    async function actualizarDatos() {
      try {
        const resp = await fetch('/estado');
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        const datos = await resp.json();
        document.getElementById('bpm').textContent = datos.senal !== null ? datos.senal : '--';
        document.getElementById('hora').textContent = datos.ultima || '--';
        document.getElementById('ip').textContent = 'IP: ' + (datos.ip || '--');
      } catch (err) {
        console.error('Error al obtener /estado:', err);
        document.getElementById('bpm').textContent = '--';
        document.getElementById('hora').textContent = '--';
        document.getElementById('ip').textContent = 'IP: --';
      }
    }

    // Actualiza de inmediato y luego cada 5 segundos
    actualizarDatos();
    setInterval(actualizarDatos, 5000);
  </script>
</body>
</html>`);
});

// Ruta POST para recibir datos desde el ESP32
app.post('/', (req, res) => {
  const data = req.body;
  console.log('Datos recibidos:', data);

  if (data.estado === 'online') {
    ultimoEstado.estado = 'online';
    ultimoEstado.ip = data.ip || ultimoEstado.ip;
    ultimoEstado.ultima = new Date().toLocaleString();
  }

  if (data.senal !== undefined) {
    ultimoEstado.senal = data.senal;
    ultimoEstado.ultima = new Date().toLocaleString();
  }

  // Respuesta con estado actualizado (200 OK)
  res.status(200).json({ mensaje: 'Datos recibidos correctamente', estado: ultimoEstado });
});

// Endpoint para que la página y otros clientes consulten el último estado
app.get('/estado', (req, res) => {
  res.json(ultimoEstado);
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
