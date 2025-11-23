// Import Express.js
const express = require('express');
const app = express();

// Middleware para leer JSON
app.use(express.json());

// Ruta para verificación del webhook
app.get('/webhook', (req, res) => {
  const verify_token = "fluentia_token";

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token && mode === 'subscribe' && token === verify_token) {
    console.log("WEBHOOK_VERIFIED");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Ruta para recibir mensajes
app.post('/webhook', (req, res) => {
  console.log("Mensaje recibido:");
  console.log(JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

// Puerto para Render
app.listen(10000, () => console.log("Webhook running on port 10000"));
