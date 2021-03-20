const bcrypt = require('bcryptjs');
const SameEmailError = require('../errors/same-email-err');
const User = require('../models/user');

const register = (req, res, next) => {
  const { email, name } = req.body;

  User.findOne({ email, name })
    .then((user) => {
      if (!user) {
        return bcrypt
          .hash(req.body.password, 10)
          .then((hash) => User.create({
            name: req.body.name,
            email: req.body.email,
            password: hash, // записываем хеш в базу
          }))
          .then((userData) => res.status(201).send({
            name: userData.name,
            _id: userData._id,
            email: userData.email,
          }))

          .catch(next);
      }
      throw new SameEmailError('Пользователь с таким email уже существует');
    })
    .catch(next);
};

module.exports = register;
