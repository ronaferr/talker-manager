const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const crypto = require('crypto');

const talkerList = async () => {
  const talkers = await JSON.parse(fs.readFileSync('./talker.json', 'UTF-8'));
  return talkers;
};

function generateToken() {
  return crypto.randomBytes(8).toString('hex');
}

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', (_req, res) => {
  try {
    const talkers = JSON.parse(fs.readFileSync('./talker.json', 'UTF-8'));
    return res.status(HTTP_OK_STATUS).send(talkers);
  } catch (e) {
    return res.status(500).send('Algo deu errado');
  }
});

app.get('/talker/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const talkers = await talkerList();
    const talker = talkers.find((tlk) => tlk.id === Number(id));
  
    if (!talker) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

    return res.status(HTTP_OK_STATUS).json(talker);
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

app.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if ([email, password].includes(undefined)) {
      return res.status(401).json({ message: 'Missing fields' });
    }
    const newToken = generateToken();
    return res.status(HTTP_OK_STATUS).json({ token: newToken });
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

app.listen(PORT, () => {
  console.log('Online');
});
