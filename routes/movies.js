const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const controller = require('../controllers/movies');

router.get('/', controller.getMovies);

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required().min(2),
      director: Joi.string().required().min(2),
      duration: Joi.number().required(),
      year: Joi.string().required().min(2),
      description: Joi.string().required().min(2),
      nameRU: Joi.string().required().min(2),
      nameEN: Joi.string().required().min(2),
      movieId: Joi.string().required().min(2),
      image: Joi.string()
        .required()
        .min(2)
        .regex(
          /^(https?:\/\/)(www\.)?[a-z0-9\-._~:/?#[\]@!$&'()*+,;=]+\.[a-z]{2,6}([a-z0-9\-._~:/?#[\]@!$&'()*+,;=]+)?(#?)$/i,
        ),
      trailer: Joi.string()
        .required()
        .min(2)
        .regex(
          /^(https?:\/\/)(www\.)?[a-z0-9\-._~:/?#[\]@!$&'()*+,;=]+\.[a-z]{2,6}([a-z0-9\-._~:/?#[\]@!$&'()*+,;=]+)?(#?)$/i,
        ),
      thumbnail: Joi.string()
        .required()
        .min(2)
        .regex(
          /^(https?:\/\/)(www\.)?[a-z0-9\-._~:/?#[\]@!$&'()*+,;=]+\.[a-z]{2,6}([a-z0-9\-._~:/?#[\]@!$&'()*+,;=]+)?(#?)$/i,
        ),
    }),
  }),
  controller.postMovie,
);

router.delete(
  '/:id',
  celebrate({
    params: Joi.object()
      .keys({
        id: Joi.string().required().min(24).max(24)
          .hex(),
      })
      .unknown(true),
  }),
  controller.deleteMovie,
);

module.exports = router;
