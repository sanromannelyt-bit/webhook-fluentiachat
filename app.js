// Import Express.js
const express = require('express');
const app = express();

// Middleware para leer JSON
app.use(express.json());

// Verificación del webhook
app.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = "fluentia123"; // debe coincidir con Meta

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token && mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log("WEBHOOK_VERIFIED");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Recibir mensajes de WhatsApp
app.post('/webhook', (req, res) => {
  console.log("Mensaje recibido:");
  console.log(JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

// Puerto dinámico para Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook running on port ${PORT}`);
});
