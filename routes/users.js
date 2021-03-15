const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const controller = require('../controllers/users');

router.get('/', controller.getUsers);

router.get('/me', controller.getUser);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string()
        .required()
        .email({ tlds: { allow: false } }),
    }),
  }),
  controller.updateUserInfo,
);

module.exports = router;
