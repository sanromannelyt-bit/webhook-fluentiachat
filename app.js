const express = require('express');
const crypto = require('crypto');
const app = express();

app.use(express.json()); // Para parsear JSON en POST

const VERIFY_TOKEN = 'TU_TOKEN_DE_VERIFICACION_AQUI'; // El mismo del dashboard
const APP_SECRET = 'TU_APP_SECRET_AQUI'; // De la config de WhatsApp en dashboard (para signatures)

// Ruta para webhook (GET para verificación, POST para eventos)
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verificado!');
    res.status(200).send(challenge); // ¡Esto es clave! Responde EXACTAMENTE con el challenge
  } else {
    res.sendStatus(403); // Token inválido
  }
});

app.post('/webhook', (req, res) => {
  // Verificar signature para seguridad (opcional pero recomendado)
  const signature = req.headers['x-hub-signature-256'];
  const expectedSignature = 'sha256=' + crypto.createHmac('sha256', APP_SECRET)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (signature !== expectedSignature) {
    return res.sendStatus(401); // Signature inválida
  }

  // Procesar el payload (ej: log o guarda el mensaje)
  console.log('Payload recibido:', JSON.stringify(req.body, null, 2));

  // Responde 200 OK inmediatamente (no proceses async aquí)
  res.status(200).send('EVENT_RECEIVED');

  // Aquí maneja el evento, ej: si es un mensaje, responde en WhatsApp
  // Ejemplo: if (req.body.entry[0].changes[0].value.messages) { ... }
});

// Escucha en el puerto de Render
const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});
