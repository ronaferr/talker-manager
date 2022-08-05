const REGEX = /\S+@\S+\.\S+/;
module.exports = (req, res, next) => {
const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'O campo "email" é obrigatório' });
    }
    if (!REGEX.test(email)) {
      return res.status(400)
      .json({ message: 'O "email" deve ter o formato "email@email.com"' });
    }
    next();
};