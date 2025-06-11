const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const WebSocket = require('ws');

const app = express();
app.use(cors());
app.use(express.json());

const dataFile = path.join(__dirname, 'scenes.json');
let scenes = [];

function loadScenes() {
  try {
    scenes = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  } catch (e) {
    scenes = [];
  }
}

function saveScenes() {
  fs.writeFileSync(dataFile, JSON.stringify(scenes, null, 2));
}

loadScenes();

app.get('/api/scenes', (req, res) => {
  res.json(scenes);
});

app.post('/api/scenes', (req, res) => {
  const newScene = { id: uuidv4(), ...req.body };
  scenes.push(newScene);
  saveScenes();
  res.json(newScene);
});

app.put('/api/scenes/:id', (req, res) => {
  const idx = scenes.findIndex(s => s.id === req.params.id);
  if (idx >= 0) {
    scenes[idx] = { ...scenes[idx], ...req.body };
    saveScenes();
    res.json(scenes[idx]);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/scenes/:id', (req, res) => {
  scenes = scenes.filter(s => s.id !== req.params.id);
  saveScenes();
  res.status(204).end();
});

let server = app.listen(4000, () => {
  console.log('Server listening on port 4000');
});

const wss = new WebSocket.Server({ server });

function broadcastScene(scene) {
  const msg = JSON.stringify({ type: 'SCENE_UPDATE', scene });
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
}

app.post('/api/scenes/:id/activate', (req, res) => {
  const scene = scenes.find(s => s.id === req.params.id);
  if (scene) {
    broadcastScene(scene);
    res.json({ status: 'ok' });
  } else {
    res.status(404).end();
  }
});

