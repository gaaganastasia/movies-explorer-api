const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(
      token,
      process.env.NODE_ENV === 'production'
        ? process.env.JWT_SECRET
        : 'dev-secret',
      { expiresIn: '7d' },
    );
  } catch (err) {
    return res.status(401).send({ message: 'необходима авторизация' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  return next(); // пропускаем запрос дальше
};
