const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises');
const crypto = require('crypto');
const validationPassword = require('./middlewares/validationPassword');
const validationUser = require('./middlewares/validationUser');
const validationToken = require('./middlewares/validationToken');
const validationName = require('./middlewares/validationName');
const validationAge = require('./middlewares/validationAge');
const validationTalk = require('./middlewares/validationTalk');
const validationTalkRate = require('./middlewares/validationTalkRate');

const talkerList = async () => {
  const list = await fs.readFile('./talker.json', 'UTF-8');
  return JSON.parse(list);
};

const setTalker = (newTalker) => fs.writeFile('./talker.json', JSON.stringify(newTalker));

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

app.post('/login', validationPassword, validationUser, (req, res) => {
  const newToken = generateToken();
  return res.status(HTTP_OK_STATUS).json({ token: newToken });
});

app.get('/talker', async (_req, res) => {
  try {
    const talkers = await talkerList() || [];
    return res.status(HTTP_OK_STATUS).json(talkers);
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

app.post('/talker',
validationToken,
validationName,
validationAge,
validationTalk,
validationTalkRate, async (req, res) => {
  try {
  const talkersList = await talkerList();
  const id = talkersList.length + 1;
  const { name, age, talk } = req.body;
  const { watchedAt, rate } = talk;
  const newTlk = { name, age, id, talk: { watchedAt, rate } };
  talkersList.push(newTlk);
  setTalker(talkersList);
  return res.status(201).json(newTlk);
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

app.put('/talker/:id', validationToken, validationName, validationAge, validationTalk,
validationTalkRate, async (req, res) => {
  try {
  const talkersList = await talkerList();
  const { id } = req.params;
  const talkerIndex = talkersList.findIndex((t) => t.id === Number(id));
  talkersList[talkerIndex] = {
    ...talkersList[talkerIndex],
    ...req.body,
  };
  await setTalker(talkersList);
  return res.status(200).send(talkersList[talkerIndex]);
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

app.delete('/talker/:id',
validationToken, async (req, res) => {
  try {
  const talkersList = await talkerList();
  const { id } = req.params;
  
  const talkerIndex = talkersList.findIndex((t) => t.id === Number(id));

  talkersList.splice(talkerIndex, 1);
  await setTalker(talkersList);

  res.status(204).end();
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

app.listen(PORT, () => {
  console.log('Online');
});
