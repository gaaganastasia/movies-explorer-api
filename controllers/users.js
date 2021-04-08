const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send({ name: user.name, email: user.email, _id: user._id });
      } else {
        throw new NotFoundError('Пользователь не найден');
      }
    })
    .catch(next);
};

const updateUserInfo = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.send(user);
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUser,
  updateUserInfo,
};
