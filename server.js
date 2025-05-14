const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;
const CSV_FILE = path.join(__dirname, 'data.csv');

app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

async function readCsv() {
  try {
    const content = await fs.readFile(CSV_FILE, 'utf8');
    return content.trim().split('\n').filter(line => line).map(line => {
      const [matricula, points] = line.split(',');
      return { matricula, points: parseInt(points, 10) };
    });
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function writeCsv(records) {
  const lines = records.map(r => `${r.matricula},${r.points}`);
  await fs.writeFile(CSV_FILE, lines.join('\n') + '\n');
}

app.post('/register', async (req, res) => {
  const { matricula } = req.body;
  if (!matricula || !/^\d+$/.test(matricula)) {
    return res.status(400).json({ error: 'Matrícula inválida.' });
  }
  const records = await readCsv();
  const index = records.findIndex(r => r.matricula === matricula);
  let points;
  if (index >= 0) {
    records[index].points += 5;
    points = records[index].points;
    await writeCsv(records);
  } else {
    points = 5;
    records.push({ matricula, points });
    await writeCsv(records);
  }
  res.json({ matricula, points });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

app.get('/ranking', async (req, res) => {
  const records = await readCsv();
  res.json(records);
});

app.use(express.static(__dirname));