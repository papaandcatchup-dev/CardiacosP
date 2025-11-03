const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let ultimoEstado = {
  estado: 'offline',
  ip: null,
  ultima: null,
  senal: null
};

app.get('/', (req, res) => {
  res.send('Servidor de PulsosCardiacos activo 💓');
});

app.post('/', (req, res) => {
  const data = req.body;
  console.log('📩 Datos recibidos:', data);

  if (data.estado === 'online') {
    ultimoEstado.estado = 'online';
    ultimoEstado.ip = data.ip;
    ultimoEstado.ultima = new Date().toLocaleString();
  }

  if (data.senal !== undefined) {
    ultimoEstado.senal = data.senal;
    ultimoEstado.ultima = new Date().toLocaleString();
  }

  res.status(200).json({ mensaje: 'Datos recibidos correctamente', estado: ultimoEstado });
});

app.get('/estado', (req, res) => {
  res.json(ultimoEstado);
});

app.listen(PORT, () => {
  console.log(`✅ Servidor ejecutándose en el puerto ${PORT}`);
});
